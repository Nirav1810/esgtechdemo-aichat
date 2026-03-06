import { NextResponse } from "next/server";

const CHUTES_URL = "https://llm.chutes.ai/v1/chat/completions";
const MODELS = [
  "Qwen/Qwen3-32B",
  "Qwen/Qwen3-235B-A22B-Instruct-2507-TEE",
  "deepseek-ai/DeepSeek-V3.2-TEE",
  "NousResearch/Hermes-4-405B-FP8-TEE",
  "zai-org/GLM-4.7-TEE",
];
const IMAGE_MODELS = [
  "zai-org/GLM-4.6V",
  "chutesai/Mistral-Small-3.2-24B-Instruct-2506",
  "Qwen/Qwen2.5-VL-32B-Instruct",
  "unsloth/gemma-3-12b-it",
  "unsloth/gemma-3-4b-it",
];
const MAX_TOKENS = 8000;
const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_TEXT_CHARS_PER_FILE = 20000;
const MAX_TOTAL_TEXT_CHARS = 60000;

const TEXT_EXTENSIONS = new Set(["txt", "md", "csv", "json", "log"]);
const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "gif"]);
const ESG_ONLY_MESSAGE =
  "I am an AI chatbot for ESG topics, so I cannot answer general-purpose questions. Please ask about ESG, sustainability, emissions, climate reporting, or related topics.";
const SCOPE_CLASSIFIER_MODEL = "chutesai/Mistral-Small-3.2-24B-Instruct-2506";
// ESG scope behavior toggle (set in .env.local):
// - ESG_SCOPE_ENFORCEMENT=strict (default): blocks non-ESG questions.
// - ESG_SCOPE_ENFORCEMENT=soft: allows request but injects policy reminder to keep answer ESG-only.
// - ESG_SCOPE_ENFORCEMENT=off: disables scope enforcement.
type ScopeEnforcementMode = "strict" | "soft" | "off";

type ImagePart = {
  type: "image_url";
  image_url: {
    url: string;
  };
};

const PRIMARY_API_KEY =
  process.env.CHUTES_API_KEY ||
  process.env.NEXT_PUBLIC_CHUTES_API_KEY ||
  "";
const FALLBACK_API_KEY = process.env.NEXT_PUBLIC_CHUTES_FALLBACK_KEY || "";
const API_KEY = PRIMARY_API_KEY || FALLBACK_API_KEY;

const TAVILY_API_KEY = process.env.TAVILY_API_KEY || "";

async function performWebSearch(query: string): Promise<string | null> {
  if (!TAVILY_API_KEY) return null;

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query,
        max_results: 5,
        include_answer: true,
      }),
    });

    if (!response.ok) {
      console.error("Tavily search error status:", response.status);
      return null;
    }

    const data = await response.json();
    const answer = typeof data.answer === "string" ? data.answer : "";
    const results = Array.isArray(data.results) ? data.results : [];

    const snippets = results
      .slice(0, 5)
      .map(
        (r: any, index: number) =>
          `[${index + 1}] ${r.title ?? ""} - ${r.url ?? ""}\n${r.content ?? ""}`
      )
      .join("\n\n");

    const combined = [answer, snippets].filter(Boolean).join("\n\n");
    return combined || null;
  } catch (error) {
    console.error("Tavily search exception:", error);
    return null;
  }
}

function getScopeEnforcementMode(): ScopeEnforcementMode {
  const raw = (process.env.ESG_SCOPE_ENFORCEMENT || "strict").toLowerCase();
  if (raw === "off") return "off";
  if (raw === "soft") return "soft";
  return "strict";
}

async function classifyScope(
  question: string
): Promise<"esg" | "greeting" | "out_of_scope"> {
  const fallbackGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening|yo|hola)\b/i.test(
    question.trim()
  );

  try {
    const response = await fetch(CHUTES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: SCOPE_CLASSIFIER_MODEL,
        stream: false,
        temperature: 0,
        max_tokens: 40,
        messages: [
          {
            role: "system",
            content: "Classify user intent into exactly one label: esg, greeting, out_of_scope. ESG includes: environment (climate, emissions, sustainability, renewable energy, waste management, pollution, conservation), social (labor practices, human rights, diversity, community impact, health and safety), governance (ethics, compliance, corporate responsibility, transparency, risk management), and ANY business analysis related to these topics (strategic planning, reporting, metrics, reduction targets, ESG frameworks, regulations, green finance). When in doubt, label as esg instead of out_of_scope. Return only compact JSON like {\"label\":\"esg\"}.",
          },
          {
            role: "user",
            content: question,
          },
        ],
      }),
    });

    if (!response.ok) {
      return fallbackGreeting ? "greeting" : "out_of_scope";
    }

    const data = await response.json();
    const content: string =
      data?.choices?.[0]?.message?.content ||
      data?.message ||
      data?.content ||
      "";

    if (typeof content === "string") {
      try {
        const parsed = JSON.parse(content);
        const label = parsed?.label;
        if (label === "esg" || label === "greeting" || label === "out_of_scope") {
          return label;
        }
      } catch {
        const normalized = content.toLowerCase();
        if (normalized.includes("esg")) {
          return "esg";
        }
        if (normalized.includes("greeting")) {
          return "greeting";
        }
        if (normalized.includes("out_of_scope") || normalized.includes("out of scope")) {
          return "out_of_scope";
        }
      }
    }

    return fallbackGreeting ? "greeting" : "out_of_scope";
  } catch {
    return fallbackGreeting ? "greeting" : "out_of_scope";
  }
}

function getExtension(fileName: string): string {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

function inferMimeFromName(fileName: string): string | null {
  const ext = getExtension(fileName);
  if (ext === "pdf") return "application/pdf";
  if (ext === "json") return "application/json";
  if (ext === "csv") return "text/csv";
  if (ext === "md") return "text/markdown";
  if (ext === "txt" || ext === "log") return "text/plain";
  if (ext === "png") return "image/png";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  return null;
}

function truncateText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}\n\n[Truncated due to size limit]`;
}

function isTextFile(file: File): boolean {
  const mime = (file.type || "").toLowerCase();
  const extension = getExtension(file.name);
  return (
    mime.startsWith("text/") ||
    mime === "application/json" ||
    mime === "application/pdf" ||
    TEXT_EXTENSIONS.has(extension) ||
    extension === "pdf"
  );
}

function isImageFile(file: File): boolean {
  const mime = (file.type || "").toLowerCase();
  const extension = getExtension(file.name);
  return mime.startsWith("image/") || IMAGE_EXTENSIONS.has(extension);
}

async function extractTextFromFile(file: File): Promise<string> {
  const mime = (file.type || inferMimeFromName(file.name) || "").toLowerCase();
  const extension = getExtension(file.name);

  if (mime === "application/pdf" || extension === "pdf") {
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfText = await new Promise<string>((resolve, reject) => {
      import("pdf2json")
        .then((module) => {
          const PDFParser = module.default;
          const parser = new PDFParser();

          parser.on("pdfParser_dataError", (err: any) => {
            reject(new Error(err?.parserError || "Failed to parse PDF file."));
          });

          parser.on("pdfParser_dataReady", (pdfData: any) => {
            try {
              const pages = Array.isArray(pdfData?.Pages) ? pdfData.Pages : [];
              const text = pages
                .map((page: any) => {
                  const texts = Array.isArray(page?.Texts) ? page.Texts : [];
                  return texts
                    .map((textItem: any) => {
                      const runs = Array.isArray(textItem?.R) ? textItem.R : [];
                      return runs
                        .map((run: any) => {
                          const raw = typeof run?.T === "string" ? run.T : "";
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
            } catch (error) {
              reject(error);
            }
          });

          parser.parseBuffer(buffer);
        })
        .catch(reject);
    });

    return pdfText;
  }

  if (mime === "application/json" || extension === "json") {
    const raw = await file.text();
    try {
      return JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      return raw;
    }
  }

  if (
    mime.startsWith("text/") ||
    mime.includes("csv") ||
    TEXT_EXTENSIONS.has(extension)
  ) {
    return file.text();
  }

  throw new Error(`Unsupported document type: ${file.name}`);
}

async function buildUploadedFileContext(files: File[]): Promise<{
  textContext: string;
  imageParts: ImagePart[];
}> {
  if (files.length > MAX_FILES) {
    throw new Error(`You can upload up to ${MAX_FILES} files at once.`);
  }

  const textChunks: string[] = [];
  const imageParts: ImagePart[] = [];
  let totalChars = 0;

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(
        `${file.name} is too large. Maximum allowed size is 10 MB per file.`
      );
    }

    if (!isTextFile(file) && !isImageFile(file)) {
      throw new Error(`Unsupported file type: ${file.name}`);
    }

    if (isImageFile(file)) {
      const mime = (file.type || inferMimeFromName(file.name) || "image/jpeg").toLowerCase();
      const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
      imageParts.push({
        type: "image_url",
        image_url: {
          url: `data:${mime};base64,${base64}`,
        },
      });
      continue;
    }

    const extracted = (await extractTextFromFile(file)).trim();
    if (!extracted) continue;

    const remaining = MAX_TOTAL_TEXT_CHARS - totalChars;
    if (remaining <= 0) break;

    const chunk = truncateText(extracted, Math.min(MAX_TEXT_CHARS_PER_FILE, remaining));
    totalChars += chunk.length;
    textChunks.push(`File: ${file.name}\n${chunk}`);
  }

  const textContext = textChunks.length
    ? `User uploaded file content (use this for summarization and Q&A):\n\n${textChunks.join("\n\n---\n\n")}\n\n`
    : "";

  return { textContext, imageParts };
}

export async function POST(req: Request) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Chutes API key not configured on the server." },
      { status: 500 }
    );
  }

  const requestContentType = req.headers.get("content-type") || "";
  let question = "";
  let contextData = "";
  let pageType = "dashboard";
  let preferredModel = "";
  let uploadedTextContext = "";
  let uploadedImageParts: ImagePart[] = [];

  if (requestContentType.includes("multipart/form-data")) {
    try {
      const formData = await req.formData();
      question =
        typeof formData.get("question") === "string"
          ? (formData.get("question") as string).trim()
          : "";
      contextData =
        typeof formData.get("contextData") === "string"
          ? (formData.get("contextData") as string).trim()
          : "";
      pageType =
        typeof formData.get("pageType") === "string"
          ? (formData.get("pageType") as string)
          : "dashboard";
      preferredModel =
        typeof formData.get("model") === "string"
          ? (formData.get("model") as string).trim()
          : "";

      const files = formData
        .getAll("files")
        .filter((entry): entry is File => entry instanceof File);

      if (files.length > 0) {
        const uploadContext = await buildUploadedFileContext(files);
        uploadedTextContext = uploadContext.textContext;
        uploadedImageParts = uploadContext.imageParts;
      }
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Invalid multipart request.",
        },
        { status: 400 }
      );
    }
  } else {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body in request." },
        { status: 400 }
      );
    }

    question = typeof body.question === "string" ? body.question.trim() : "";
    contextData =
      typeof body.contextData === "string" ? body.contextData.trim() : "";
    pageType = typeof body.pageType === "string" ? body.pageType : "dashboard";
    preferredModel =
      typeof body.model === "string" ? body.model.trim() : "";
  }

  if (!question) {
    return NextResponse.json(
      { error: "Question is required." },
      { status: 400 }
    );
  }

  const scopeMode = getScopeEnforcementMode();
  const scopeLabel =
    scopeMode === "off" ? "esg" : await classifyScope(question);
  if (scopeLabel !== "esg") {
    if (scopeLabel === "greeting") {
      return NextResponse.json({
        answer:
          "Hello! I am an AI chatbot for ESG topics. Ask me about emissions, sustainability, climate reporting, or related ESG questions.",
      });
    }

    if (scopeMode === "strict") {
      return NextResponse.json({ answer: ESG_ONLY_MESSAGE });
    }
  }

  const searchContext = await performWebSearch(question);

  let combinedContext = "";
  if (contextData) {
    combinedContext += pageType === "ghg-report"
      ? `Here is the current GHG Report data:\n${contextData}\n\n`
      : `Here is the current dashboard context data:\n${contextData}\n\n`;
  }
  if (uploadedTextContext) {
    combinedContext += uploadedTextContext;
  }
  if (searchContext) {
    combinedContext += `Here are web search results you can rely on:\n${searchContext}\n\n`;
  }
  if (scopeMode === "soft" && scopeLabel === "out_of_scope") {
    combinedContext +=
      "Policy reminder: user request appears non-ESG. You must refuse non-ESG requests with this exact sentence: \"I am an AI chatbot for ESG topics, so I cannot answer general-purpose questions. Please ask about ESG, sustainability, emissions, climate reporting, or related topics.\"\n\n";
  }

  // Different system prompts based on page type
  const dashboardPrompt = `You are an expert ESG (Environmental, Social, and Governance) consultant assistant. You help users understand their greenhouse gas emissions data, provide sustainability insights, and suggest improvements.

CRITICAL INSTRUCTION: You MUST respond ONLY in English. Do NOT use any other language including Chinese, Korean, Japanese, or any other language. All responses must be in clear, professional English.

SCOPE RESTRICTION: You are strictly an ESG assistant. If a user asks a non-ESG question, refuse briefly and ask them to provide an ESG-related question.

You have access to dashboard data and, when available, web search results. Only analyze or summarize this data when the user explicitly asks for a summary, insights, or asks a question that requires the data. If the user greets or makes small talk, respond briefly and do not summarize the dashboard data.

For factual questions about ESGtech.ai as a company (founders, ownership, investors, legal entity details, founding year, headquarters, or similar), you must rely only on explicit information provided in the dashboard context or web search results. If the information is not clearly present, you must say that you do not know and recommend checking the official ESGtech.ai website or other authoritative public sources. Never invent or guess names, dates, roles, or organizations.

Keep responses concise and precise. Default to 3-6 sentences or 4-6 bullet points. Avoid long explanations, repetition, or unnecessary detail unless the user asks for more depth. End the answer once the user's request is satisfied.

JSON FORMAT FOR ANALYSIS - MANDATORY: When the user asks about ANY of these: positives, negatives, benefits, drawbacks, advantages, disadvantages, pros, cons, strengths, weaknesses, risks, opportunities, good/bad aspects, or any comparative analysis - you MUST use this JSON format:
{"format":"analysis","positives":["point 1","point 2",...],"negatives":["point 1","point 2",...],"summary":"brief overall summary"}

IMPORTANT: 
- If the user asks for ONLY positives, fill the positives array and leave negatives empty []
- If the user asks for ONLY negatives, fill the negatives array and leave positives empty []
- If the user asks for BOTH, fill both arrays
- ALWAYS use this JSON format for ANY question involving positives, negatives, benefits, drawbacks, pros, cons, etc.
- NEVER use markdown bullet points for these types of questions - ONLY JSON format is allowed`;

  const ghgReportPrompt = `You are a specialized GHG Report AI Assistant. You help users understand and analyze detailed greenhouse gas emissions data from their reports.

CRITICAL INSTRUCTION: You MUST respond ONLY in English. Do NOT use any other language including Chinese, Korean, Japanese, or any other language. All responses must be in clear, professional English.

SCOPE RESTRICTION: You are strictly an ESG assistant. If a user asks a non-ESG question, refuse briefly and ask them to provide an ESG-related question.

You have access to detailed GHG Report data including:
- Scope 1 emissions: Stationary Combustion, Mobile Combustion, Fugitive Emissions
- Scope 2 emissions: Purchased Electricity, Purchased Heat and Steam, Renewable Electricity Generation
- Scope 3 emissions: Employee Commute, Food Consumption, Purchased Goods, Transmission & Distribution Loss

CAPABILITIES:
1. SUMMARIZATION: When asked to summarize, provide concise overviews of emission categories, total values, and key insights. Do NOT summarize unless explicitly asked.
2. FIELD EXPLANATION: Explain what specific fields mean (e.g., "What is Stationary Combustion?", "What does 'Loop' mean?").
3. COMPARISONS: Compare different scopes or categories (e.g., "Compare Scope 1 vs Scope 2").
4. DATA ANALYSIS: Identify highest/lowest emission sources, trends, or notable values.

GUIDELINES:
- Only analyze or summarize the GHG report data when the user explicitly asks for it
- If the user greets or makes small talk, respond briefly without summarizing data
- When summarizing, focus on the most important metrics and insights
- When explaining fields, be clear and concise
- Keep responses to 3-6 sentences or 4-6 bullet points unless the user asks for more detail
- Use the actual data values from the context when providing summaries or comparisons

JSON FORMAT FOR ANALYSIS - MANDATORY: When the user asks about ANY of these: positives, negatives, benefits, drawbacks, advantages, disadvantages, pros, cons, strengths, weaknesses, risks, opportunities, good/bad aspects, or any comparative analysis - you MUST use this JSON format:
{"format":"analysis","positives":["point 1","point 2",...],"negatives":["point 1","point 2",...],"summary":"brief overall summary"}

IMPORTANT: 
- If the user asks for ONLY positives, fill the positives array and leave negatives empty []
- If the user asks for ONLY negatives, fill the negatives array and leave positives empty []
- If the user asks for BOTH, fill both arrays
- ALWAYS use this JSON format for ANY question involving positives, negatives, benefits, drawbacks, pros, cons, etc.
- NEVER use markdown bullet points for these types of questions - ONLY JSON format is allowed`;

  const systemPrompt = pageType === "ghg-report" ? ghgReportPrompt : dashboardPrompt;

  const userMessage = `${combinedContext}User question: ${question}`;

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content:
        uploadedImageParts.length > 0
          ? [
            {
              type: "text",
              text: userMessage,
            },
            ...uploadedImageParts,
          ]
          : userMessage,
    },
  ];

  try {
    let lastStatus = 500;
    let lastErrorText = "";

    const defaultModelChain =
      uploadedImageParts.length > 0
        ? [...IMAGE_MODELS, ...MODELS]
        : [...MODELS];

    const modelsToTry = preferredModel
      ? Array.from(new Set([preferredModel, ...defaultModelChain]))
      : Array.from(new Set(defaultModelChain));

    for (const model of modelsToTry) {
      const upstreamResponse = await fetch(CHUTES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: MAX_TOKENS,
          stream: true,
        }),
      });

      if (upstreamResponse.ok && upstreamResponse.body) {
        console.log(`Using model: ${model}`);
        return new Response(upstreamResponse.body, {
          status: upstreamResponse.status,
          headers: {
            "Content-Type":
              upstreamResponse.headers.get("content-type") ||
              "text/event-stream",
            "X-Chutes-Model": model,
          },
        });
      }

      const status = upstreamResponse.status || 500;
      const errorText = await upstreamResponse.text();
      console.error(`Chutes upstream error for ${model}:`, status, errorText);
      lastStatus = status;
      lastErrorText = errorText;

      // Continue fallback on transient/model-specific errors.
      const shouldTryNextModel =
        status === 404 ||
        status === 429 ||
        status === 401 ||
        status === 403 ||
        status >= 500;

      if (!shouldTryNextModel) {
        break;
      }
    }

    return NextResponse.json(
      {
        error: "All upstream models failed.",
        details: lastErrorText,
        status: lastStatus,
      },
      { status: lastStatus }
    );
  } catch (error) {
    console.error("Error calling Chutes:", error);
    return NextResponse.json(
      { error: "Unexpected error while contacting the model." },
      { status: 500 }
    );
  }
}
