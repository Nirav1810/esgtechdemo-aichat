import { NextResponse } from "next/server";
import type { PyData } from '../../reports/types';

const CHUTES_URL = "https://llm.chutes.ai/v1/chat/completions";
const API_KEY =
  process.env.CHUTES_API_KEY ||
  process.env.NEXT_PUBLIC_CHUTES_API_KEY ||
  process.env.NEXT_PUBLIC_CHUTES_FALLBACK_KEY ||
  "";

// Max chars of PDF text to send to the LLM to stay within token budgets
const MAX_PDF_CHARS = 40_000;

/**
 * Models to try in order. On 503/429/404/5xx we move to the next one.
 * Mirrors the fallback chain in /api/chat/route.ts.
 */
const EXTRACTION_MODELS = [
  "Qwen/Qwen3-235B-A22B-Instruct-2507-TEE",
  "Qwen/Qwen3-32B",
  "deepseek-ai/DeepSeek-V3-0324",
  "zai-org/GLM-4.7-TEE",
];

/**
 * Extracts raw text from a PDF buffer using pdf2json.
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    import("pdf2json")
      .then((module) => {
        const PDFParser = module.default;
        const parser = new PDFParser();

        // pdf2json emits a harmless "Setting up fake worker" warning from its
        // bundled pdfjs build. Suppress it to keep logs clean.
        const originalWarn = console.warn.bind(console);
        console.warn = (...args: unknown[]) => {
          const msg = typeof args[0] === "string" ? args[0] : "";
          if (!msg.includes("fake worker")) originalWarn(...args);
        };

        parser.on("pdfParser_dataError", (err: any) => {
          console.warn = originalWarn;
          reject(new Error(err?.parserError ?? "Failed to parse PDF."));
        });

        parser.on("pdfParser_dataReady", (pdfData: any) => {
          console.warn = originalWarn;
          try {
            const pages: any[] = Array.isArray(pdfData?.Pages)
              ? pdfData.Pages
              : [];
            const text = pages
              .map((page) => {
                const texts: any[] = Array.isArray(page?.Texts)
                  ? page.Texts
                  : [];
                return texts
                  .map((textItem) => {
                    const runs: any[] = Array.isArray(textItem?.R)
                      ? textItem.R
                      : [];
                    return runs
                      .map((run) => {
                        const raw =
                          typeof run?.T === "string" ? run.T : "";
                        try {
                          return decodeURIComponent(raw);
                        } catch {
                          return raw;
                        }
                      })
                      .join("");
                  })
                  .join(" ");
              })
              .join("\n\n");
            resolve(text);
          } catch (err) {
            reject(err);
          }
        });

        parser.parseBuffer(buffer);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Uses the LLM to extract BRSR Principle-6 tabular data from raw PDF text.
 * Returns structured JSON matching the PyData schema.
 */
async function extractDataWithLLM(pdfText: string): Promise<PyData> {
  const truncated =
    pdfText.length > MAX_PDF_CHARS
      ? pdfText.slice(0, MAX_PDF_CHARS) + "\n\n[Truncated]"
      : pdfText;

  const systemPrompt = `You are a highly accurate data extraction assistant specialised in BRSR (Business Responsibility and Sustainability Report) Principle 6 filings.
Your task is to extract numeric values for the PREVIOUS YEAR (PY / FY2024) column only from the tabular disclosures below.

Extract ONLY the following fields — use the EXACT key names listed. Return 0 for any field not found. NEVER guess.

=== Q1: ENERGY CONSUMPTION (GJ) ===
energy_A  — Total electricity consumption from renewable sources
energy_B  — Total fuel consumption from renewable sources
energy_C  — Energy consumption through other renewable sources
energy_D  — Total electricity consumption from non-renewable sources
energy_E  — Total fuel consumption from non-renewable sources
energy_F  — Energy consumption through other non-renewable sources
Revenue   — Revenue from operations (in Crores INR) — usually in a financial section
Production — Physical output / production (MT) — for intensity calculation

=== Q3: WATER (kL) ===
water_surface     — Surface water withdrawal
water_ground      — Groundwater withdrawal
water_thirdparty  — Third party / municipal water
water_seawater    — Seawater / desalinated water
water_others      — Other water sources
water_consumption — Total volume of water consumption

=== Q4: WATER DISCHARGE (kL) ===
wd_surface_notx — To surface water, no treatment
wd_surface_tx   — To surface water, with treatment
wd_ground_notx  — To groundwater, no treatment
wd_ground_tx    — To groundwater, with treatment
wd_sea_notx     — To seawater, no treatment
wd_sea_tx       — To seawater, with treatment
wd_third_notx   — To third parties, no treatment
wd_third_tx     — To third parties, with treatment
wd_others_notx  — Others, no treatment
wd_others_tx    — Others, with treatment

=== Q6: AIR EMISSIONS (MT) ===
air_nox — NOx
air_sox — SOx
air_pm  — Particulate matter (PM)

=== Q7: GHG EMISSIONS (tCO₂Eq) ===
ghg_scope1 — Total Scope 1 emissions
ghg_scope2 — Total Scope 2 emissions

=== Q9: WASTE GENERATED (MT) ===
waste_A — Plastic waste
waste_B — E-waste
waste_C — Bio-medical waste
waste_D — Construction and demolition waste
waste_E — Battery waste
waste_F — Radioactive waste
waste_G — Other hazardous waste
waste_H — Other non-hazardous waste

=== Q9: WASTE RECOVERY (MT) ===
waste_recycled        — Recycled
waste_reused          — Re-used
waste_recovery_other  — Other recovery operations

=== Q9: WASTE DISPOSAL (MT) ===
waste_incineration          — Incineration
waste_landfill              — Landfilling
waste_landfill_incineration — Landfilling after incineration

CRITICAL RULES:
1. Only return values EXPLICITLY present in the PDF text. Do NOT infer, calculate, or guess.
2. Skip any row that says "Total", "Intensity", or is clearly a formula row — those are computed.
3. Revenue and Production are in financial / intensity sections, often separate from the energy table.
4. Return ONLY a raw JSON object with the exact keys above. No markdown, no explanation.
5. All values must be plain numbers. Use 0 for anything not found.

ANTI-HALLUCINATION: If uncertain, return 0. Wrong zeros are correctable; hallucinated numbers are not.

Example output (abbreviated):
{"energy_A":51268,"energy_B":454852,"energy_C":0,"energy_D":128000,"energy_E":657562,"energy_F":0,"Revenue":0,"Production":0,"water_surface":2329406,"water_ground":173115,"water_thirdparty":178252,"water_seawater":0,"water_others":0,"water_consumption":4730690,"wd_surface_notx":0,"wd_surface_tx":0,"wd_ground_notx":0,"wd_ground_tx":0,"wd_sea_notx":0,"wd_sea_tx":0,"wd_third_notx":24237,"wd_third_tx":0,"wd_others_notx":0,"wd_others_tx":0,"air_nox":73,"air_sox":7,"air_pm":18,"ghg_scope1":61501,"ghg_scope2":37282,"waste_A":1139,"waste_B":65,"waste_C":11,"waste_D":0,"waste_E":3,"waste_F":0,"waste_G":790,"waste_H":7193,"waste_recycled":6875,"waste_reused":0,"waste_recovery_other":2251,"waste_incineration":3,"waste_landfill":77,"waste_landfill_incineration":0}`;

  const userMessage = `Here is the extracted text from the BRSR PDF. Extract ONLY the Previous Year (PY / FY2024) values:\n\n${truncated}`;

  // Try each model in order; skip on 503 / 429 / 404 / 5xx
  let rawContent = "";
  let lastError = "All models unavailable";

  for (const model of EXTRACTION_MODELS) {
    let response: Response;
    try {
      response = await fetch(CHUTES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          temperature: 0,
          max_tokens: 1024,
          stream: false,
        }),
      });
    } catch (networkErr) {
      lastError = `Network error reaching ${model}: ${(networkErr as Error).message}`;
      continue;
    }

    if (!response.ok) {
      const errText = await response.text();
      lastError = `Model ${model} returned ${response.status}: ${errText}`;
      // Retry-able statuses: 503 (unavailable), 429 (rate limit), 404 (not found), 5xx
      const retryable = response.status === 503 || response.status === 429 ||
        response.status === 404 || response.status >= 500;
      if (retryable) continue;
      // Non-retryable (e.g. 400, 401): fail immediately
      throw new Error(lastError);
    }

    const data = await response.json();
    rawContent = data?.choices?.[0]?.message?.content ?? "";
    if (rawContent) break; // Success — exit the loop
    lastError = `Model ${model} returned an empty response`;
  }

  if (!rawContent) {
    throw new Error(`Extraction failed. ${lastError}`);
  }

  // Strip markdown code fences if present
  const cleaned = rawContent
    .replace(/```(?:json)?/gi, "")
    .replace(/```/g, "")
    .trim();

  // Extract the first JSON object from the response
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(
      "LLM did not return a valid JSON object. Raw response: " + rawContent
    );
  }

  const parsed = JSON.parse(jsonMatch[0]);

  const n = (key: string): number => {
    const v = parsed[key];
    return typeof v === "number" && isFinite(v) ? v : 0;
  };

  return {
    // Q1 Energy
    energy_A: n("energy_A"), energy_B: n("energy_B"), energy_C: n("energy_C"),
    energy_D: n("energy_D"), energy_E: n("energy_E"), energy_F: n("energy_F"),
    Revenue: n("Revenue"), Production: n("Production"),
    RevenuePPP: 0, // Always formula-computed client-side
    // Q3 Water
    water_surface: n("water_surface"), water_ground: n("water_ground"),
    water_thirdparty: n("water_thirdparty"), water_seawater: n("water_seawater"),
    water_others: n("water_others"), water_consumption: n("water_consumption"),
    // Q4 Water Discharge
    wd_surface_notx: n("wd_surface_notx"), wd_surface_tx: n("wd_surface_tx"),
    wd_ground_notx: n("wd_ground_notx"), wd_ground_tx: n("wd_ground_tx"),
    wd_sea_notx: n("wd_sea_notx"), wd_sea_tx: n("wd_sea_tx"),
    wd_third_notx: n("wd_third_notx"), wd_third_tx: n("wd_third_tx"),
    wd_others_notx: n("wd_others_notx"), wd_others_tx: n("wd_others_tx"),
    // Q6 Air
    air_nox: n("air_nox"), air_sox: n("air_sox"), air_pm: n("air_pm"),
    // Q7 GHG
    ghg_scope1: n("ghg_scope1"), ghg_scope2: n("ghg_scope2"),
    // Q9 Waste Generated
    waste_A: n("waste_A"), waste_B: n("waste_B"), waste_C: n("waste_C"),
    waste_D: n("waste_D"), waste_E: n("waste_E"), waste_F: n("waste_F"),
    waste_G: n("waste_G"), waste_H: n("waste_H"),
    // Q9 Waste Recovery
    waste_recycled: n("waste_recycled"), waste_reused: n("waste_reused"),
    waste_recovery_other: n("waste_recovery_other"),
    // Q9 Waste Disposal
    waste_incineration: n("waste_incineration"), waste_landfill: n("waste_landfill"),
    waste_landfill_incineration: n("waste_landfill_incineration"),
  };
}

export async function POST(req: Request) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "LLM API key not configured on the server." },
      { status: 500 }
    );
  }

  let file: File | null = null;

  try {
    const formData = await req.formData();
    const entry = formData.get("file");
    if (!(entry instanceof File)) {
      return NextResponse.json(
        { error: "No PDF file provided. Send a multipart/form-data request with field 'file'." },
        { status: 400 }
      );
    }
    file = entry;
  } catch {
    return NextResponse.json(
      { error: "Failed to parse multipart form data." },
      { status: 400 }
    );
  }

  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith(".pdf")) {
    return NextResponse.json(
      { error: "Only PDF files are accepted." },
      { status: 400 }
    );
  }

  const MAX_SIZE = 20 * 1024 * 1024; // 20 MB
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum allowed size is 20 MB." },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Step 1: Extract text from PDF
    const pdfText = await extractPdfText(buffer);

    if (!pdfText.trim()) {
      return NextResponse.json(
        { error: "Could not extract any text from the PDF. The file may be scanned/image-only." },
        { status: 422 }
      );
    }

    // Step 2: Use LLM to extract structured BRSR PY data
    const extractedData = await extractDataWithLLM(pdfText);
    // RevenuePPP is formula-computed client-side (Revenue × 10 / 20.66)
    return NextResponse.json({ success: true, data: extractedData });
  } catch (err) {
    console.error("[parse-brsr-pdf] Error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while processing the PDF.",
      },
      { status: 500 }
    );
  }
}
