import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

// ── Slide layout plan types ────────────────────────────────────────────────
type SlideType = "hero" | "text_heavy" | "chart_focus" | "comparison" | "image_focus" | "summary";
interface SlideLayout {
  slide_index: number;
  slide_type: SlideType;
  layout_metadata: {
    text_zone?: string;   // e.g. "left 50%" | "top_center 60%"
    chart_zone?: string;  // e.g. "left 65%" | "center 70%"
    image_zone?: string;  // e.g. "right 50%" | "bg 100%"
    design_style?: string;
  };
  content_intent?: string;
  chart_intent?: string;
  image_keywords?: string[];
}

// ── Chutes ───────────────────────────────────────────────────────────────
const CHUTES_API_KEY =
  process.env.CHUTES_API_KEY ||
  process.env.NEXT_PUBLIC_CHUTES_API_KEY ||
  "";
const CHUTES_URL = "https://llm.chutes.ai/v1/chat/completions";

async function callChutes(prompt: string, maxTokens = 4000): Promise<string> {
  const models = [
    "Qwen/Qwen3-235B-A22B-Instruct-2507-TEE",
    "deepseek-ai/DeepSeek-R1-Distill-Llama-70B",
    "openai/gpt-oss-20b",
    "chutesai/Mistral-Small-3.2-24B-Instruct-2506",
  ];
  let lastStatus = 0;
  for (const model of models) {
    const res = await fetch(CHUTES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CHUTES_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: maxTokens,
      }),
    });
    if (res.ok) {
      console.log(`Chutes: using model ${model}`);
      const data = await res.json();
      return data.choices?.[0]?.message?.content ?? "";
    }
    lastStatus = res.status;
    console.warn(`Model ${model} failed with ${res.status}, trying next...`);
  }
  throw new Error(`All Chutes models failed. Last status: ${lastStatus}`);
}

// ── AI Layout Planner ────────────────────────────────────────────────────────
async function generateLayoutPlan(topic: string, contextSummary: string, slideCount: number): Promise<SlideLayout[]> {
  const prompt = `You are an expert slide designer. Given a topic and dataset, produce a JSON layout plan for the entire deck.

Topic: ${topic}
Data summary: ${contextSummary.slice(0, 800)}
Slide count: ${slideCount}
Style: modern, professional, bold visual hierarchy, balanced whitespace

JSON schema for each object in the array:
{
  "slide_index": number,
  "slide_type": "hero" | "text_heavy" | "chart_focus" | "comparison" | "image_fsummary",
  "layout_metadata": {
    "text_zone": "e.gocus" | ". left 45% | top_center 60%",
    "chart_zone": "e.g. left 65% | center 70% (omit if no chart)",
    "image_zone": "e.g. right 50% | bg 100% (omit if no image)",
    "design_style": "minimal | bold | professional | creative"
  },
  "content_intent": "One sentence: what this slide communicates",
  "chart_intent": "Chart type and data fields if chart is expected (omit if no chart)",
  "image_keywords": ["keyword1", "keyword2"] 
}

Rules:
- Slide 1 is always hero (title slide)
- Last slide is hero (closing/thank-you)
- Use summary type for KPI/metrics overview slides (3-6 big numbers)
- Use comparison type for side-by-side analysis slides
- Use chart_focus for data-heavy slides — at least 35% of slides should have charts
- Use image_focus for narrative/context slides to add visual impact
- Vary slide_type across the deck — no two consecutive same type unless necessary

IMPORTANT: Output ONLY valid JSON array. No markdown, no explanations, no text before or after. Start with [ and end with ].`;

  try {
    const raw = await callChutes(prompt, 2000);
    console.log(`Layout plan raw response (first 300 chars): ${raw.slice(0, 300)}`);

    // Try multiple extraction strategies
    let jsonStr: string | null = null;

    // Strategy 1: Extract from markdown code block
    const codeBlockMatch = raw.match(/```json\s*(\[[\s\S]*?\])\s*```/i) || raw.match(/```\s*(\[[\s\S]*?\])\s*```/i);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1];
    }

    // Strategy 2: Find JSON array with balanced brackets
    if (!jsonStr) {
      const startIdx = raw.indexOf("[");
      if (startIdx !== -1) {
        let depth = 0;
        let inString = false;
        let escapeNext = false;
        for (let i = startIdx; i < raw.length; i++) {
          const char = raw[i];
          if (escapeNext) {
            escapeNext = false;
            continue;
          }
          if (char === "\\") {
            escapeNext = true;
            continue;
          }
          if (char === '"' && !escapeNext) {
            inString = !inString;
            continue;
          }
          if (inString) continue;
          if (char === "[") depth++;
          else if (char === "]") {
            depth--;
            if (depth === 0) {
              jsonStr = raw.slice(startIdx, i + 1);
              break;
            }
          }
        }
      }
    }

    // Strategy 3: Simple regex as last resort
    if (!jsonStr) {
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) jsonStr = match[0];
    }

    if (!jsonStr) {
      throw new Error("No JSON array found in layout plan response");
    }

    // Clean up and parse
    jsonStr = jsonStr.trim()
      .replace(/^```json\s*/i, "")
      .replace(/```$/i, "")
      .replace(/,\s*]/g, "]")
      .replace(/,\s*}/g, "}");

    const plan: SlideLayout[] = JSON.parse(jsonStr);
    console.log(`Layout plan: ${plan.length} slides planned`);
    return plan;
  } catch (err) {
    console.warn("Layout plan generation failed, using default plan:", err);
    // Fallback: generate a reasonable default plan
    const types: SlideType[] = ["hero", "summary", "chart_focus", "chart_focus", "image_focus",
      "text_heavy", "comparison", "chart_focus", "image_focus", "chart_focus",
      "text_heavy", "chart_focus", "summary", "comparison", "hero"];
    return Array.from({ length: slideCount }, (_, i) => ({
      slide_index: i,
      slide_type: types[i % types.length],
      layout_metadata: { design_style: "professional" },
    }));
  }
}

// ── Growlity brand constants ─────────────────────────────────────────────────
const BRAND_GREEN = "3DAF5C";   // mid-green: borders, accents, bullets
const BRAND_BLUE = "2A7FD5";
const HEADER_BG = "1E3A4F";   // legacy (title slide bg)
const BODY_BG = "FFFFFF";
const TEXT_DARK = "1A1A2E";
const TEXT_MID = "555566";
// Slidesgo "Sustainability & Environment" theme
const HEADING_GREEN = "1E3A0E";  // dark forest green — headings & labels
const ACCENT_ORANGE = "F5A623";  // warm amber — KPI values, icons, highlights
const BG_LIGHT = "D8ECC8";  // light sage green — body background
const CONTENT_BOX = "EEF7E4";  // off-white green — card & table fills
const BODY_TEXT = "3D4A2E";  // dark olive — body paragraphs
const W = 10, H = 5.625;  // 16:9 slide dimensions in inches

const LOGO_PATH = path.join(process.cwd(), "Growlity-Logo-Website-2-new.png.webp");
const PEXELS_API_KEY = process.env.PEXELS_API_KEY ?? "";
const MIN_BULLET_FONT = 10.5;
const MAX_BULLETS_TWO_COL = 10;

// ── Strip markdown syntax that pptxgenjs renders literally ───────────────────
function stripMd(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[\d]+\.\s*/, "")
    .trim();
}

// ── Brand chrome: applied to every slide ────────────────────────────────────
function addSlideChrome(slide: any, title: string, slideNum: number, total: number, logoBase64: string | null) {
  // ── Full slide — sage-green background (matches body-area of all slide types) ─
  slide.addShape("rect" as any, { x: 0, y: 0, w: W, h: H, fill: { color: BG_LIGHT }, line: { color: BG_LIGHT } });
  // ── Title band: off-white card + dark forest left border stripe ────────────
  slide.addShape("rect" as any, { x: 0, y: 0, w: W, h: 1.0, fill: { color: CONTENT_BOX }, line: { color: CONTENT_BOX } });
  slide.addShape("rect" as any, { x: 0, y: 0, w: 0.055, h: 1.0, fill: { color: HEADING_GREEN }, line: { color: HEADING_GREEN } });
  // ── BRAND_GREEN accent stripe below title ──────────────────────────────────
  slide.addShape("rect" as any, { x: 0, y: 1.0, w: W, h: 0.055, fill: { color: BRAND_GREEN }, line: { color: BRAND_GREEN } });
  // ── Dot-grid clusters: 3×3 grids of small BRAND_GREEN squares ────────────
  // Top-left corner
  const DOT_SIZE = 0.055, DOT_GAP = 0.082;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++)
    slide.addShape("rect" as any, { x: 0.10 + c * DOT_GAP, y: 0.10 + r * DOT_GAP, w: DOT_SIZE, h: DOT_SIZE, fill: { color: BRAND_GREEN }, line: { color: BRAND_GREEN } });
  // Bottom-left corner (above footer)
  const blY = H - 3 * DOT_GAP - 0.07;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++)
    slide.addShape("rect" as any, { x: 0.10 + c * DOT_GAP, y: blY + r * DOT_GAP, w: DOT_SIZE, h: DOT_SIZE, fill: { color: BRAND_GREEN }, line: { color: BRAND_GREEN } });
  // ── Footer: dark forest green bar with counter and branding ───────────────
  slide.addShape("rect" as any, { x: 0, y: H - 0.28, w: W, h: 0.28, fill: { color: HEADING_GREEN }, line: { color: HEADING_GREEN } });
  slide.addText(`Growlity ESG Report  |  Slide ${slideNum} of ${total}`, {
    x: 0.3, y: H - 0.26, w: 7, h: 0.22, fontSize: 8.5, color: "AAAAAA", fontFace: "Calibri",
  });
  slide.addText("esgtech.ai", {
    x: W - 1.3, y: H - 0.26, w: 1.2, h: 0.22, fontSize: 8.5, color: BRAND_GREEN, fontFace: "Calibri", align: "right",
  });
  // ── Title text — dark forest green on the off-white title band ─────────────
  slide.addText(title, {
    x: 0.35, y: 0.08, w: logoBase64 ? 7.0 : 9.3, h: 0.85,
    fontSize: 21, bold: true, color: HEADING_GREEN, fontFace: "Calibri", valign: "middle",
  });
  if (logoBase64) {
    slide.addImage({ data: `image/webp;base64,${logoBase64}`, x: W - 2.05, y: 0.1, w: 1.85, h: 0.78 });
  }
}

// ── Parse [CHART:type:Label1=val1,Label2=val2] from slide markdown ────────────
function parseChartTag(text: string): { type: string; labels: string[]; values: number[] } | null {
  const match = text.match(/\[CHART:(pie|doughnut|bar|col|line|area|radar|polar|stacked):([^\]]+)\]/i);
  if (!match) return null;
  const type = match[1].toLowerCase();
  const pairs = match[2].split(",").map(p => p.trim());
  const labels: string[] = [];
  const values: number[] = [];
  for (const pair of pairs) {
    const [label, val] = pair.split("=");
    if (label && val && !isNaN(parseFloat(val))) {
      labels.push(label.trim());
      values.push(parseFloat(val.trim()));
    }
  }
  return labels.length > 0 ? { type, labels, values } : null;
}

// ── Parse [IMAGE:search query:layout] from slide markdown ────────────────────
function parseImageTag(text: string): { query: string; layout: string } | null {
  const match = text.match(/\[IMAGE:([^\]:]+?)(?::(bg|right|left|inset))?\]/i);
  if (!match) return null;
  return { query: match[1].trim(), layout: (match[2] ?? "right").toLowerCase() };
}

// ── Distinct color palettes — rotated by hashing labels so different charts get different looks ──
const PALETTES = [
  // 0: Brand ESG (default)
  ["#3DAF5C", "#2A7FD5", "#E8A838", "#E85C3A", "#9B59B6", "#1ABC9C"],
  // 1: Ocean Blues
  ["#1E88E5", "#0D47A1", "#42A5F5", "#1565C0", "#64B5F6", "#5C6BC0"],
  // 2: Forest Greens
  ["#2E7D32", "#43A047", "#66BB6A", "#1B5E20", "#00897B", "#558B2F"],
  // 3: Warm Sunset
  ["#E64A19", "#F57C00", "#FFA000", "#D84315", "#FF7043", "#FB8C00"],
  // 4: Purple-Teal Contrast
  ["#7B1FA2", "#00897B", "#AB47BC", "#26A69A", "#BA68C8", "#4DB6AC"],
];

const PALETTE_BG = ["#F0FAF4", "#EBF4FD", "#EDF7ED", "#FEF3EE", "#F5EEF9"];

// ── Render a chart to PNG via QuickChart.io (Chart.js v3 cloud renderer) ─────
async function renderChartPNG(type: string, labels: string[], values: number[]): Promise<Buffer | null> {
  try {
    // Pick palette based on label content so same data = same palette, different slides = different palettes
    const hash = labels.join("").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const pi = hash % PALETTES.length;
    const pal = PALETTES[pi];
    const bg = PALETTE_BG[pi];
    const primary = pal[0];
    const palSlice = pal.slice(0, values.length);

    // Add hex alpha for transparent fills
    const alpha = (hex: string, pct: number) => hex + Math.round(pct * 255).toString(16).padStart(2, "0");

    const isCircular = type === "pie" || type === "doughnut" || type === "polar";
    const isLine = type === "line" || type === "area";
    const isRadar = type === "radar";
    const isStacked = type === "stacked";
    const isHBar = type === "bar";

    let chartConfig: any;

    if (type === "doughnut") {
      chartConfig = {
        type: "doughnut",
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: palSlice,
            borderColor: "#ffffff",
            borderWidth: 3,
            hoverOffset: 12,
          }],
        },
        options: {
          cutout: "62%",
          plugins: {
            legend: { position: "bottom", labels: { color: "#222222", font: { size: 13, weight: "bold" }, padding: 18, boxWidth: 14 } },
            datalabels: {
              color: "#ffffff",
              font: { size: 14, weight: "bold" },
              formatter: "function(v,ctx){ var total=ctx.dataset.data.reduce(function(a,b){return a+b},0); return Math.round(v/total*100)+'%'; }",
            },
          },
        },
      };
    } else if (type === "pie") {
      chartConfig = {
        type: "pie",
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: palSlice,
            borderColor: "#ffffff",
            borderWidth: 3,
            hoverOffset: 10,
          }],
        },
        options: {
          plugins: {
            legend: { position: "right", labels: { color: "#222222", font: { size: 12 }, padding: 14, boxWidth: 12 } },
            datalabels: {
              color: "#ffffff",
              font: { size: 13, weight: "bold" },
              formatter: "function(v,ctx){ var total=ctx.dataset.data.reduce(function(a,b){return a+b},0); return Math.round(v/total*100)+'%'; }",
            },
          },
        },
      };
    } else if (type === "polar") {
      chartConfig = {
        type: "polarArea",
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: palSlice.map(c => alpha(c, 0.75)),
            borderColor: palSlice,
            borderWidth: 2,
          }],
        },
        options: {
          plugins: { legend: { position: "bottom", labels: { color: "#333333", font: { size: 12 }, padding: 14 } } },
          scales: { r: { grid: { color: "#dddddd" }, ticks: { backdropColor: "transparent", color: "#666666", font: { size: 10 }, stepSize: Math.ceil(Math.max(...values) / 4) } } },
        },
      };
    } else if (isLine) {
      const isFill = type === "area";
      chartConfig = {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: "Value",
            data: values,
            borderColor: primary,
            backgroundColor: isFill ? alpha(primary, 0.22) : "transparent",
            fill: isFill,
            tension: 0.42,
            pointRadius: 6,
            pointHoverRadius: 9,
            pointBackgroundColor: primary,
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            borderWidth: 3,
          }],
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {
            y: {
              grid: { color: "#eeeeee", borderColor: "#cccccc" },
              ticks: { color: "#444444", font: { size: 12 }, maxTicksLimit: 6 },
            },
            x: {
              grid: { color: "transparent" },
              ticks: { color: "#444444", font: { size: 11 }, maxRotation: 30 },
            },
          },
        },
      };
    } else if (isRadar) {
      chartConfig = {
        type: "radar",
        data: {
          labels,
          datasets: [{
            label: "Emissions",
            data: values,
            backgroundColor: alpha(primary, 0.25),
            borderColor: primary,
            borderWidth: 2.5,
            pointBackgroundColor: primary,
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 5,
          }],
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {
            r: {
              grid: { color: "#dddddd" },
              angleLines: { color: "#cccccc" },
              ticks: { backdropColor: "transparent", color: "#666666", font: { size: 10 }, maxTicksLimit: 4 },
              pointLabels: { color: "#333333", font: { size: 12, weight: "bold" } },
            },
          },
        },
      };
    } else if (isStacked) {
      const half = Math.ceil(labels.length / 2);
      const padB = Array(Math.max(0, half - Math.floor(values.length / 2))).fill(0);
      chartConfig = {
        type: "bar",
        data: {
          labels: labels.slice(0, half),
          datasets: [
            {
              label: "Primary",
              data: values.slice(0, half),
              backgroundColor: alpha(pal[0], 0.88),
              borderColor: pal[0],
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: "Secondary",
              data: [...values.slice(half, half * 2), ...padB],
              backgroundColor: alpha(pal[1], 0.88),
              borderColor: pal[1],
              borderWidth: 1,
              borderRadius: 4,
            },
          ],
        },
        options: {
          plugins: { legend: { position: "bottom", labels: { color: "#333333", font: { size: 12 }, boxWidth: 12 } } },
          scales: {
            x: { stacked: true, grid: { color: "transparent" }, ticks: { color: "#444444", font: { size: 11 }, maxRotation: 25 } },
            y: { stacked: true, grid: { color: "#eeeeee" }, ticks: { color: "#444444", font: { size: 11 }, maxTicksLimit: 5 } },
          },
        },
      };
    } else {
      // col (vertical bar) or bar (horizontal)
      // Use individual colors from palette for visual variety; gradient-like ordering
      const barColors = values.map((_, i) => alpha(pal[i % pal.length], 0.9));
      const barBorder = values.map((_, i) => pal[i % pal.length]);
      chartConfig = {
        type: "bar",
        data: {
          labels,
          datasets: [{
            label: "tCO₂Eq",
            data: values,
            backgroundColor: barColors,
            borderColor: barBorder,
            borderWidth: 1.5,
            borderRadius: isHBar ? 4 : 6,
            borderSkipped: false,
          }],
        },
        options: {
          indexAxis: isHBar ? "y" : "x",
          plugins: {
            legend: { display: false },
            datalabels: {
              color: "#333333",
              anchor: isHBar ? "end" : "end",
              align: isHBar ? "end" : "top",
              font: { size: 11, weight: "bold" },
              formatter: "function(v){ if(Math.abs(v)>=1000000) return (v/1000000).toFixed(1)+'M'; if(Math.abs(v)>=1000) return (v/1000).toFixed(1)+'K'; return v; }",
            },
          },
          layout: { padding: { top: isHBar ? 4 : 28, right: isHBar ? 60 : 8, bottom: 4, left: 4 } },
          scales: {
            x: {
              grid: { color: isHBar ? "#eeeeee" : "transparent", borderColor: "#cccccc" },
              ticks: { color: "#444444", font: { size: isHBar ? 11 : 10 }, maxRotation: isHBar ? 0 : 30 },
            },
            y: {
              grid: { color: isHBar ? "transparent" : "#eeeeee", borderColor: "#cccccc" },
              ticks: { color: "#444444", font: { size: isHBar ? 11 : 11 }, maxTicksLimit: 6 },
            },
          },
        },
      };
    }

    const res = await fetch("https://quickchart.io/chart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chart: chartConfig,
        width: 1200,
        height: 700,
        backgroundColor: bg,
        version: "3",
        format: "png",
        devicePixelRatio: 2,
      }),
    });
    if (!res.ok) { console.warn("QuickChart failed:", res.status, await res.text()); return null; }
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.warn("renderChartPNG error:", err);
    return null;
  }
}

// ── Fetch a photo from Pexels API ────────────────────────────────────────────
async function fetchPexelsImage(query: string): Promise<{ buffer: Buffer; mime: string } | null> {
  const fallbackUrls = [
    `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)}`,
    `https://picsum.photos/seed/${encodeURIComponent(query)}/1600/900`,
  ];

  const tryDownload = async (url: string): Promise<{ buffer: Buffer; mime: string } | null> => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const mime = res.headers.get("content-type")?.split(";")[0] || "image/jpeg";
      return { buffer: Buffer.from(await res.arrayBuffer()), mime };
    } catch {
      return null;
    }
  };

  if (!PEXELS_API_KEY) {
    console.warn("PEXELS_API_KEY not set — using public image fallback");
    for (const url of fallbackUrls) {
      const img = await tryDownload(url);
      if (img) return img;
    }
    return null;
  }
  try {
    const search = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
      { headers: { Authorization: PEXELS_API_KEY } }
    );
    if (!search.ok) {
      console.warn("Pexels search failed:", search.status);
      for (const url of fallbackUrls) {
        const img = await tryDownload(url);
        if (img) return img;
      }
      return null;
    }
    const data = await search.json() as any;
    const photo = data?.photos?.[0];
    if (!photo) {
      for (const url of fallbackUrls) {
        const img = await tryDownload(url);
        if (img) return img;
      }
      return null;
    }
    const imgUrl: string = photo.src.large2x ?? photo.src.large ?? photo.src.medium;
    const pexelsImage = await tryDownload(imgUrl);
    if (pexelsImage) return pexelsImage;
    for (const url of fallbackUrls) {
      const img = await tryDownload(url);
      if (img) return img;
    }
    return null;
  } catch (err) {
    console.warn("fetchPexelsImage error:", err);
    for (const url of fallbackUrls) {
      const img = await tryDownload(url);
      if (img) return img;
    }
    return null;
  }
}

function splitDenseSlideMarkdown(slideMd: string): string[] {
  const lines = slideMd
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [slideMd];

  const hasChart = lines.some(l => parseChartTag(l));
  const hasImage = lines.some(l => parseImageTag(l));
  const bulletLines = lines.filter(l => /^([-*]|\d+\.)\s+/.test(l));
  const avgLen = bulletLines.length
    ? bulletLines.reduce((n, l) => n + l.length, 0) / bulletLines.length
    : 0;

  if (hasChart || hasImage) return [slideMd];
  if (bulletLines.length <= MAX_BULLETS_TWO_COL) return [slideMd];
  if (bulletLines.length <= MAX_BULLETS_TWO_COL + 2 && avgLen < 120) return [slideMd];

  const title = lines.find(l => l.startsWith("# ")) || "# Slide";
  const subtitle = lines.find(l => l.startsWith("## "));
  const splitAt = Math.max(6, Math.ceil(bulletLines.length / 2));
  const firstBullets = bulletLines.slice(0, splitAt);
  const secondBullets = bulletLines.slice(splitAt);
  if (secondBullets.length === 0) return [slideMd];

  const first = [title, ...(subtitle ? [subtitle] : []), "[TYPE:text_heavy]", ...firstBullets].join("\n");
  const second = [`${title} (cont.)`, "## Continued", "[TYPE:text_heavy]", ...secondBullets].join("\n");
  return [first, second];
}

// ── Render one parsed slide onto the pptxgenjs slide object ──────────────────
async function renderSlide(pptx: any, slide: any, slideMd: string, slideNum: number, total: number, logoBase64: string | null, layout?: SlideLayout) {
  const lines = slideMd
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.includes("---SLIDE---"));

  let title = `Slide ${slideNum}`;
  let subtitle = "";
  const bullets: string[] = [];
  let chartTag: ReturnType<typeof parseChartTag> = null;
  let imageTag: ReturnType<typeof parseImageTag> = null;

  for (const line of lines) {
    if (line.startsWith("# ")) {
      title = stripMd(line.replace(/^#+\s*/, ""));
    } else if (line.startsWith("## ")) {
      subtitle = stripMd(line.replace(/^#+\s*/, ""));
    } else if (line.startsWith("- ") || line.startsWith("* ") || /^\d+\.\s/.test(line)) {
      const raw = line.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "");
      const chart = parseChartTag(raw);
      const img = parseImageTag(raw);
      if (chart && !chartTag) chartTag = chart;
      else if (img && !imageTag) imageTag = img;
      else bullets.push(stripMd(raw));
    } else if (!line.startsWith("#")) {
      // Ignore [TYPE:...] hints — they only affect effectiveType resolution, not content
      if (/^\[TYPE:/i.test(line)) { /* skip */ }
      else {
        const chart = parseChartTag(line);
        const img = parseImageTag(line);
        if (chart && !chartTag) chartTag = chart;
        else if (img && !imageTag) imageTag = img;
        else if (!subtitle) subtitle = stripMd(line);
        // Paragraph text after subtitle has already been set → treat as bullet fallback
        else if (line.length > 15) bullets.push(stripMd(line));
      }
    }
  }

  // Resolve effective slide type — prefer layout plan, else auto-detect from content
  const effectiveType: SlideType = layout?.slide_type ??
    (chartTag ? "chart_focus" : imageTag ? "image_focus" : bullets.length >= 5 ? "text_heavy" : "text_heavy");

  const makeBulletItems = (bArr: string[], color = TEXT_DARK) => bArr.map(b => ({
    text: b,
    options: { bullet: { indent: 18, color: BRAND_GREEN }, paraSpaceAfter: 10, breakLine: true, color },
  }));

  // ── HERO / SECTION BREAK ─────────────────────────────────────────────────
  if (effectiveType === "hero") {
    // Bold left-accent section break slide
    slide.addShape("rect" as any, { x: 0, y: 0, w: W, h: H, fill: { color: "F4F7FA" }, line: { color: "F4F7FA" } });
    slide.addShape("rect" as any, { x: 0, y: 0, w: 0.28, h: H, fill: { color: BRAND_GREEN }, line: { color: BRAND_GREEN } });
    slide.addShape("rect" as any, { x: 0.28, y: 0, w: 0.09, h: H, fill: { color: BRAND_BLUE }, line: { color: BRAND_BLUE } });
    // Slide number badge
    slide.addShape("rect" as any, { x: W - 0.65, y: 0, w: 0.65, h: 0.5, fill: { color: HEADER_BG }, line: { color: HEADER_BG } });
    slide.addText(`${slideNum}`, { x: W - 0.65, y: 0, w: 0.65, h: 0.5, fontSize: 13, bold: true, color: BRAND_GREEN, fontFace: "Calibri", align: "center", valign: "middle" });
    // Footer
    slide.addShape("rect" as any, { x: 0, y: H - 0.28, w: W, h: 0.28, fill: { color: HEADER_BG }, line: { color: HEADER_BG } });
    slide.addText("esgtech.ai", { x: W - 1.3, y: H - 0.26, w: 1.2, h: 0.22, fontSize: 7.5, color: BRAND_GREEN, fontFace: "Calibri", align: "right" });
    if (logoBase64) slide.addImage({ data: `image/webp;base64,${logoBase64}`, x: W - 2.5, y: 0.15, w: 1.7, h: 0.72 });
    // Large title
    slide.addText(title, { x: 0.58, y: 1.0, w: 8.8, h: 1.4, fontSize: 34, bold: true, color: HEADER_BG, fontFace: "Calibri", wrap: true });
    if (subtitle) {
      slide.addShape("rect" as any, { x: 0.58, y: 2.55, w: 6.5, h: 0.04, fill: { color: BRAND_GREEN }, line: { color: BRAND_GREEN } });
      slide.addText(subtitle, { x: 0.58, y: 2.68, w: 8.8, h: 0.65, fontSize: 15, color: "445566", fontFace: "Calibri", italic: true, wrap: true });
    }
    // Fetch and place image if layout plan has keywords
    const heroKeywords = layout?.image_keywords?.join(" ") ?? "";
    if (heroKeywords && PEXELS_API_KEY) {
      const imgRes = await fetchPexelsImage(heroKeywords);
      if (imgRes) {
        const d = `${imgRes.mime};base64,${imgRes.buffer.toString("base64")}`;
        slide.addImage({ data: d, x: 6.5, y: 1.0, w: 3.4, h: 3.25, sizing: { type: "cover" } });
        slide.addShape("rect" as any, { x: 6.5, y: 1.0, w: 3.4, h: 3.25, fill: { color: "1E3A4F", transparency: 30 }, line: { color: "1E3A4F", transparency: 100 } });
      }
    }
    // Bullets as large highlight points
    if (bullets.length > 0) {
      slide.addText(makeBulletItems(bullets.slice(0, 3), "334455"), {
        x: 0.58, y: 3.45, w: 9.2, h: 1.8,
        fontSize: 12, fontFace: "Calibri", wrap: true, lineSpacingMultiple: 1.55,
      });
    }
    return;
  }

  // ── SUMMARY / KPI CARDS ──────────────────────────────────────────────────
  if (effectiveType === "summary") {
    addSlideChrome(slide, title, slideNum, total, logoBase64);
    const bodyY = subtitle ? 1.72 : 1.2;
    // Add subtitle if any
    if (subtitle) {
      slide.addShape("rect" as any, { x: 0.12, y: 1.12, w: W - 0.24, h: 0.5, fill: { color: "E8F4EC" }, line: { color: BRAND_GREEN, pt: 1 } });
      slide.addShape("rect" as any, { x: 0.12, y: 1.12, w: 0.06, h: 0.5, fill: { color: BRAND_GREEN }, line: { color: BRAND_GREEN } });
      slide.addText(subtitle, { x: 0.28, y: 1.13, w: W - 0.45, h: 0.48, fontSize: 10.5, italic: true, color: "1E4D2B", fontFace: "Calibri", wrap: true, valign: "middle" });
    }
    // Try to parse STAT-format bullets: "STAT: Label | value | unit"
    const statItems: { label: string; value: string; unit: string }[] = [];
    const nonStatBullets: string[] = [];
    for (const b of bullets) {
      const stMatch = b.match(/^STAT:\s*([^|]+)\|\s*([^|]+)\|\s*(.+)$/i);
      const pipeMatch = !stMatch && b.match(/^([^|]+)\|\s*([^|]+)\|\s*(.+)$/);
      if (stMatch) statItems.push({ label: stMatch[1].trim(), value: stMatch[2].trim(), unit: stMatch[3].trim() });
      else if (pipeMatch) statItems.push({ label: pipeMatch[1].trim(), value: pipeMatch[2].trim(), unit: pipeMatch[3].trim() });
      else nonStatBullets.push(b);
    }
    const cardPalette = ["#1E3A4F", "#2E7D32", "#1565C0", "#7B1FA2", "#E64A19", "#00695C"];
    if (statItems.length >= 2) {
      // Render KPI card grid (max 6 cards, 3 per row)
      const perRow = statItems.length <= 3 ? statItems.length : 3;
      const rows = Math.ceil(statItems.length / perRow);
      const cardW = (W - 0.3) / perRow - 0.12;
      const availCardH = H - 0.28 - bodyY;  // available body height minus footer
      const cardH = rows === 1
        ? Math.min(2.2, availCardH - 0.1)
        : Math.min(1.65, (availCardH - (rows - 1) * 0.12) / rows);
      const gapX = cardW + 0.12;
      const gapY = cardH + 0.12;
      statItems.slice(0, 6).forEach((item, idx) => {
        const col = idx % perRow;
        const row = Math.floor(idx / perRow);
        const x = 0.15 + col * gapX;
        const y = bodyY + row * gapY;
        const bg = cardPalette[idx % cardPalette.length];
        slide.addShape("rect" as any, { x, y, w: cardW, h: cardH, fill: { color: bg.replace("#", "") }, line: { color: bg.replace("#", "") }, rectRadius: 0.08 });
        slide.addShape("rect" as any, { x, y, w: cardW, h: 0.32, fill: { color: "FFFFFF", transparency: 80 }, line: { color: "FFFFFF", transparency: 100 } });
        slide.addText(item.label.toUpperCase(), { x: x + 0.1, y: y + 0.05, w: cardW - 0.2, h: 0.25, fontSize: 7.5, bold: true, color: "FFFFFF", fontFace: "Calibri", align: "left" });
        const vFontSize = item.value.length > 8 ? 22 : 28;
        slide.addText(item.value, { x: x + 0.08, y: y + 0.38, w: cardW - 0.16, h: cardH * 0.48, fontSize: vFontSize, bold: true, color: "FFFFFF", fontFace: "Calibri", valign: "middle" });
        slide.addText(item.unit, { x: x + 0.08, y: y + cardH - 0.42, w: cardW - 0.16, h: 0.38, fontSize: 8.5, color: "DDDDDD", fontFace: "Calibri", wrap: true });
      });
      if (nonStatBullets.length > 0) {
        slide.addText(makeBulletItems(nonStatBullets.slice(0, 3)), {
          x: 0.15, y: bodyY + rows * gapY + 0.05, w: W - 0.3, h: H - 0.35 - (bodyY + rows * gapY),
          fontSize: 10.5, fontFace: "Calibri", wrap: true, lineSpacingMultiple: 1.3,
        });
      }
    } else {
      // Fallback: two-column bullets
      const mid = Math.ceil(bullets.length / 2);
      const colW = (W - 0.55) / 2;
      slide.addText(makeBulletItems(bullets.slice(0, mid)), { x: 0.2, y: bodyY, w: colW, h: H - bodyY - 0.35, fontSize: 12, fontFace: "Calibri", valign: "top", wrap: true, lineSpacingMultiple: 1.5 });
      slide.addText(makeBulletItems(bullets.slice(mid)), { x: 0.2 + colW + 0.15, y: bodyY, w: colW, h: H - bodyY - 0.35, fontSize: 12, fontFace: "Calibri", valign: "top", wrap: true, lineSpacingMultiple: 1.5 });
    }
    return;
  }

  // ── COMPARISON (two equal styled columns) ────────────────────────────────
  if (effectiveType === "comparison") {
    addSlideChrome(slide, title, slideNum, total, logoBase64);
    const bodyY = subtitle ? 1.72 : 1.15;
    const bodyH = subtitle ? 3.55 : 4.1;
    if (subtitle) {
      slide.addShape("rect" as any, { x: 0.12, y: 1.12, w: W - 0.24, h: 0.5, fill: { color: "E8F4EC" }, line: { color: BRAND_GREEN, pt: 1 } });
      slide.addShape("rect" as any, { x: 0.12, y: 1.12, w: 0.06, h: 0.5, fill: { color: BRAND_GREEN }, line: { color: BRAND_GREEN } });
      slide.addText(subtitle, { x: 0.28, y: 1.13, w: W - 0.45, h: 0.48, fontSize: 10.5, italic: true, color: "1E4D2B", fontFace: "Calibri", wrap: true, valign: "middle" });
    }
    const colW = 4.6;
    const col1X = 0.15, col2X = 5.1;
    // Column A header
    slide.addShape("rect" as any, { x: col1X, y: bodyY, w: colW, h: 0.38, fill: { color: HEADER_BG }, line: { color: HEADER_BG } });
    slide.addShape("rect" as any, { x: col1X, y: bodyY + 0.38, w: colW, h: 0.04, fill: { color: BRAND_GREEN }, line: { color: BRAND_GREEN } });
    // Column B header
    slide.addShape("rect" as any, { x: col2X, y: bodyY, w: colW, h: 0.38, fill: { color: "163058" }, line: { color: "163058" } });
    slide.addShape("rect" as any, { x: col2X, y: bodyY + 0.38, w: colW, h: 0.04, fill: { color: BRAND_BLUE }, line: { color: BRAND_BLUE } });
    // Parse [A] / [B] prefixed bullets, or split evenly
    const aItems: string[] = [], bItems: string[] = [];
    for (const b of bullets) {
      if (/^\[A\]/i.test(b)) aItems.push(b.replace(/^\[A\]\s*/i, ""));
      else if (/^\[B\]/i.test(b)) bItems.push(b.replace(/^\[B\]\s*/i, ""));
      else (aItems.length <= bItems.length ? aItems : bItems).push(b);
    }
    // Header labels
    const headerA = aItems.length > 0 && /current|existing|before/i.test(aItems[0]) ? "CURRENT STATE" : "ANALYSIS A";
    const headerB = bItems.length > 0 && /target|future|after/i.test(bItems[0]) ? "TARGET STATE" : "ANALYSIS B";
    slide.addText(headerA, { x: col1X + 0.1, y: bodyY + 0.06, w: colW - 0.2, h: 0.28, fontSize: 10, bold: true, color: "FFFFFF", fontFace: "Calibri", valign: "middle" });
    slide.addText(headerB, { x: col2X + 0.1, y: bodyY + 0.06, w: colW - 0.2, h: 0.28, fontSize: 10, bold: true, color: "FFFFFF", fontFace: "Calibri", valign: "middle" });
    const contentY = bodyY + 0.5;
    const contentH = bodyH - 0.5;

    const aChars = aItems.slice(0, 5).reduce((acc, curr) => acc + curr.length, 0);
    const aFont = aChars > 350 ? 9.5 : (aChars > 250 ? 10.5 : 11.5);
    if (aItems.length > 0) slide.addText(makeBulletItems(aItems.slice(0, 5)), { x: col1X, y: contentY, w: colW, h: contentH, fontSize: aFont, fontFace: "Calibri", valign: "top", wrap: true, lineSpacingMultiple: 1.5 });

    const bChars = bItems.slice(0, 5).reduce((acc, curr) => acc + curr.length, 0);
    const bFont = bChars > 350 ? 9.5 : (bChars > 250 ? 10.5 : 11.5);
    if (bItems.length > 0) slide.addText(makeBulletItems(bItems.slice(0, 5)), { x: col2X, y: contentY, w: colW, h: contentH, fontSize: bFont, fontFace: "Calibri", valign: "top", wrap: true, lineSpacingMultiple: 1.5 });
    return;
  }

  // ── All remaining types share the chrome + subtitle banner ───────────────
  addSlideChrome(slide, title, slideNum, total, logoBase64);
  if (subtitle) {
    slide.addShape("rect" as any, { x: 0.12, y: 1.12, w: W - 0.24, h: 0.5, fill: { color: "E8F4EC" }, line: { color: BRAND_GREEN, pt: 1 } });
    slide.addShape("rect" as any, { x: 0.12, y: 1.12, w: 0.06, h: 0.5, fill: { color: BRAND_GREEN }, line: { color: BRAND_GREEN } });
    slide.addText(subtitle, { x: 0.28, y: 1.13, w: W - 0.45, h: 0.48, fontSize: 10.5, italic: true, color: "1E4D2B", fontFace: "Calibri", wrap: true, valign: "middle" });
  }
  const bodyY = subtitle ? 1.72 : 1.15;
  const bodyH = subtitle ? 3.55 : 4.1;

  // ── CHART_FOCUS: chart left ~55%, bullets right ────────────────────────
  if (effectiveType === "chart_focus" && chartTag) {
    // Determine chart dimensions from layout plan (cap width at 58%, height at 3.0")
    const chartZone = layout?.layout_metadata?.chart_zone ?? "left 55%";
    const chartWidthPct = Math.min(parseFloat(chartZone.match(/(\d+)%/)?.[1] ?? "55") / 100, 0.58);
    const cW = (W - 0.25) * chartWidthPct;
    const cH = Math.min(bodyH, 3.45);
    const chartOffY = bodyY + (bodyH - cH) / 2; // vertically center within body
    const textX = cW + 0.28;
    const textW = W - textX - 0.1;
    slide.addShape("rect" as any, { x: 0.1, y: chartOffY - 0.04, w: cW + 0.02, h: cH + 0.08, fill: { color: "EEF7E4" }, line: { color: "EEF7E4" } });
    const chartBuffer = await renderChartPNG(chartTag.type, chartTag.labels, chartTag.values);
    if (chartBuffer) {
      slide.addImage({ data: `image/png;base64,${chartBuffer.toString("base64")}`, x: 0.12, y: chartOffY, w: cW, h: cH });
    } else {
      const chartData = [{ name: "Value", labels: chartTag.labels, values: chartTag.values }];
      const pptxType = (["col", "bar", "line", "area", "stacked"].includes(chartTag.type)) ? "bar" : chartTag.type === "pie" ? "pie" : chartTag.type === "doughnut" ? "doughnut" : "bar";
      const barDir = (["col", "line", "area", "stacked"].includes(chartTag.type)) ? "col" : "bar";
      slide.addChart((pptx.ChartType as any)[pptxType], chartData, { x: 0.12, y: chartOffY, w: cW, h: cH, chartColors: ["3DAF5C", "2A7FD5", "E8A838", "E85C3A", "9B59B6", "1ABC9C"], barDir, showValue: true, dataLabelFontSize: 8, showLegend: pptxType === "pie" || pptxType === "doughnut", legendPos: "b", legendFontSize: 8 });
    }
    if (textW > 1.5) {
      // ── Colored legend panel: swatch + label + value (matches Slidesgo pie-chart template) ─
      const palHash = chartTag.labels.join("").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      const palItems = PALETTES[palHash % PALETTES.length];
      const legendN = Math.min(chartTag.labels.length, 7);
      const legendItemH = Math.min(0.45, bodyH / Math.max(legendN + 1, 1));
      for (let li = 0; li < legendN; li++) {
        const ly = bodyY + li * legendItemH;
        const swatchHex = palItems[li % palItems.length].replace("#", "");
        // Colored square swatch
        slide.addShape("rect" as any, {
          x: textX, y: ly + legendItemH * 0.18, w: 0.14, h: legendItemH * 0.64,
          fill: { color: swatchHex }, line: { color: swatchHex },
        });
        // Label (bold, dark forest green)
        slide.addText(chartTag.labels[li], {
          x: textX + 0.20, y: ly, w: textW - 0.22, h: legendItemH * 0.52,
          fontSize: 11, bold: true, color: HEADING_GREEN, fontFace: "Calibri", valign: "bottom",
        });
        // Value (smaller, dark olive)
        const vVal = chartTag.values[li];
        const vStr = typeof vVal === "number"
          ? (Math.abs(vVal) >= 1e6 ? `${(vVal / 1e6).toFixed(1)}M`
            : Math.abs(vVal) >= 1000 ? `${(vVal / 1000).toFixed(1)}K`
              : vVal.toFixed(1))
          : String(vVal);
        slide.addText(vStr, {
          x: textX + 0.20, y: ly + legendItemH * 0.50, w: textW - 0.22, h: legendItemH * 0.50,
          fontSize: 10, color: BODY_TEXT, fontFace: "Calibri", valign: "top",
        });
      }
      // Insight bullets below legend if vertical space remains
      if (bullets.length > 0) {
        const belowY = bodyY + legendN * legendItemH + 0.12;
        const remH = bodyY + bodyH - belowY;
        if (remH > 0.45) {
          slide.addText(makeBulletItems(bullets.slice(0, 2)), {
            x: textX, y: belowY, w: textW, h: remH,
            fontSize: 10, fontFace: "Calibri", valign: "top", wrap: true, lineSpacingMultiple: 1.4,
          });
        }
      }
    }
    return;
  }
  // chart_focus fell through without chartTag — treat as text_heavy

  // ── IMAGE_FOCUS ──────────────────────────────────────────────────────────
  if (effectiveType === "image_focus" || imageTag) {
    const query = imageTag?.query ?? layout?.image_keywords?.join(" ") ?? title;
    const rawLayout = imageTag?.layout ?? (() => {
      const iz = layout?.layout_metadata?.image_zone ?? "right 50%";
      if (iz.startsWith("bg")) return "bg";
      if (iz.startsWith("left")) return "left";
      if (iz.startsWith("inset")) return "inset";
      return "right";
    })();
    const imgResult = await fetchPexelsImage(query);
    if (imgResult) {
      const imgData = `${imgResult.mime};base64,${imgResult.buffer.toString("base64")}`;
      if (rawLayout === "bg") {
        slide.addImage({ data: imgData, x: 0.08, y: bodyY, w: W - 0.16, h: bodyH, sizing: { type: "cover" } });
        slide.addShape("rect" as any, { x: 0.08, y: bodyY, w: W - 0.16, h: bodyH, fill: { color: "000000", transparency: 45 }, line: { color: "000000", transparency: 100 } });
        if (bullets.length > 0) slide.addText(bullets.slice(0, 6).map(b => ({ text: b, options: { bullet: { indent: 18, color: BRAND_GREEN }, paraSpaceAfter: 10, breakLine: true, color: "FFFFFF" } })), { x: 0.35, y: bodyY + 0.2, w: W - 0.5, h: bodyH - 0.3, fontSize: 12, fontFace: "Calibri", valign: "top", wrap: true, lineSpacingMultiple: 1.5 });
      } else if (rawLayout === "right") {
        const imgW = 4.6; const textW2 = W - imgW - 0.35;
        slide.addImage({ data: imgData, x: W - imgW - 0.08, y: bodyY, w: imgW, h: bodyH, sizing: { type: "cover" } });
        if (bullets.length > 0) slide.addText(makeBulletItems(bullets.slice(0, 6)), { x: 0.18, y: bodyY, w: textW2, h: bodyH, fontSize: 12, fontFace: "Calibri", valign: "top", wrap: true, lineSpacingMultiple: 1.5 });
      } else if (rawLayout === "left") {
        const imgW2 = 4.6; const textX2 = imgW2 + 0.25;
        slide.addImage({ data: imgData, x: 0.08, y: bodyY, w: imgW2, h: bodyH, sizing: { type: "cover" } });
        if (bullets.length > 0) slide.addText(makeBulletItems(bullets.slice(0, 6)), { x: textX2, y: bodyY, w: W - textX2 - 0.1, h: bodyH, fontSize: 12, fontFace: "Calibri", valign: "top", wrap: true, lineSpacingMultiple: 1.5 });
      } else {
        slide.addImage({ data: imgData, x: W - 3.1, y: bodyY, w: 2.9, h: 1.85, sizing: { type: "cover" } });
        if (bullets.length > 0) slide.addText(makeBulletItems(bullets.slice(0, 7)), { x: 0.18, y: bodyY, w: W - 3.3, h: bodyH, fontSize: 12, fontFace: "Calibri", valign: "top", wrap: true, lineSpacingMultiple: 1.5 });
      }
      return;
    }
    // Image failed — fall through to text
  }

  // ── TEXT_HEAVY / default ─────────────────────────────────────────────────
  if (bullets.length > 0) {
    const allBullets = bullets.slice(0, MAX_BULLETS_TWO_COL);
    if (allBullets.length >= 5) {
      const mid = Math.ceil(allBullets.length / 2);
      const colW = (W - 0.55) / 2;
      const col1X = 0.2;
      const col2X = col1X + colW + 0.15;
      // Column header bars
      slide.addShape("rect" as any, { x: col1X, y: bodyY, w: colW, h: 0.32, fill: { color: HEADER_BG }, line: { color: HEADER_BG } });
      slide.addShape("rect" as any, { x: col1X, y: bodyY + 0.32, w: colW, h: 0.04, fill: { color: BRAND_GREEN }, line: { color: BRAND_GREEN } });
      slide.addText("KEY FINDINGS", { x: col1X + 0.1, y: bodyY + 0.04, w: colW - 0.2, h: 0.25, fontSize: 8, bold: true, color: "FFFFFF", fontFace: "Calibri", valign: "middle" });
      slide.addShape("rect" as any, { x: col2X, y: bodyY, w: colW, h: 0.32, fill: { color: "163058" }, line: { color: "163058" } });
      slide.addShape("rect" as any, { x: col2X, y: bodyY + 0.32, w: colW, h: 0.04, fill: { color: BRAND_BLUE }, line: { color: BRAND_BLUE } });
      slide.addText("ANALYSIS & IMPLICATIONS", { x: col2X + 0.1, y: bodyY + 0.04, w: colW - 0.2, h: 0.25, fontSize: 8, bold: true, color: "FFFFFF", fontFace: "Calibri", valign: "middle" });
      const textY = bodyY + 0.42;
      const textH = bodyH - 0.42;
      slide.addText(makeBulletItems(allBullets.slice(0, mid)), { x: col1X, y: textY, w: colW, h: textH, fontSize: 12, fontFace: "Calibri", valign: "top", wrap: true, lineSpacingMultiple: 1.5 });
      slide.addText(makeBulletItems(allBullets.slice(mid)), { x: col2X, y: textY, w: colW, h: textH, fontSize: 12, fontFace: "Calibri", valign: "top", wrap: true, lineSpacingMultiple: 1.5 });
    } else {
      slide.addText(makeBulletItems(allBullets), { x: 0.2, y: bodyY, w: W - 0.35, h: bodyH, fontSize: 13, fontFace: "Calibri", valign: "top", wrap: true, lineSpacingMultiple: 1.6 });
    }
  } else {
    // No bullets — show subtitle text as centred body or a "no data" notice
    const bodyText = subtitle || title;
    slide.addShape("rect" as any, { x: 0.15, y: bodyY + 0.3, w: W - 0.3, h: bodyH - 0.6, fill: { color: "F0FAF4" }, line: { color: BRAND_GREEN, pt: 1 } });
    slide.addShape("rect" as any, { x: 0.15, y: bodyY + 0.3, w: 0.06, h: bodyH - 0.6, fill: { color: BRAND_GREEN }, line: { color: BRAND_GREEN } });
    slide.addText("No detailed breakdown available for this section. Please refer to the appendix for supporting data.", {
      x: 0.38, y: bodyY + 0.55, w: W - 0.55, h: bodyH - 1.1,
      fontSize: 13, color: "445566", fontFace: "Calibri", italic: true, wrap: true, valign: "middle",
    });
  }
}

// ── Main AI slide generator ──────────────────────────────────────────────────
async function generateSlides(contextData: string, pageType: string): Promise<{ slidesMarkdown: string[]; layoutPlan: SlideLayout[] }> {
  const isReport = pageType === "ghg-report";
  const label = isReport ? "GHG Emissions Report" : "ESG Dashboard";
  const slideCount = isReport ? 15 : 8;

  // Step 1: Generate layout plan in parallel with content calls where possible
  const layoutPlanPromise = generateLayoutPlan(label, contextData, slideCount);

  const formatRules = `STRICT OUTPUT FORMAT — follow exactly:
- Put this exact delimiter alone on its own line between every slide: ---SLIDE---
- Every slide MUST start with: # Slide Title
- Optionally one ## subtitle sentence after the title
- Then 4-6 bullet points starting with "- "
- NO markdown bold (**), NO extra headers, plain professional English

SLIDE TYPE TAGS — include exactly ONE per slide on its own line after ##:
[TYPE:hero]          — section-break / intro slide, no bullet list needed, just a title + subtitle
[TYPE:summary]       — KPI/metrics overview; bullets MUST use format: - STAT: Label | value | unit
                       Example: - STAT: Scope 3 Total | 45,840 TCO₂Eq | 52.3% of portfolio
[TYPE:chart_focus]   — data-heavy slide; include a [CHART:...] tag; chart takes 65% of slide
[TYPE:comparison]    — side-by-side analysis; prefix bullets with [A] or [B] to assign to each column
                       Example: - [A] Current: coal boilers, 29,746 TCO₂Eq, high CAPEX
                                - [B] Target: gas+solar hybrid, est 18,500 TCO₂Eq, 38% saving
[TYPE:image_focus]   — narrative/visual slide; include an [IMAGE:...] tag for a Pexels stock photo
[TYPE:text_heavy]    — dense analysis slide, auto-splits into two columns

EXAMPLE of three slides of different types:
---SLIDE---
# Growlity FY2025 GHG Inventory
[TYPE:hero]
## Science-based carbon accounting across Scope 1, 2 and 3 — GHG Protocol / Defra methodology
[IMAGE:sustainability corporate office green energy:right]
---SLIDE---
# Emissions at a Glance
[TYPE:summary]
## Key performance indicators across all three emission scopes
- STAT: Total Emissions | 87,725 TCO₂Eq | Full Scope 1+2+3 portfolio
- STAT: Scope 1 Direct | 35,533 TCO₂Eq | 40.5% of total
- STAT: Scope 2 Energy | 6,352 TCO₂Eq | 7.2% of total
- STAT: Scope 3 Value Chain | 45,840 TCO₂Eq | 52.3% of total
- STAT: Reporting Period | FY2025 | GHG Protocol methodology
---SLIDE---
# Scope 1 Sub-category Breakdown
[TYPE:chart_focus]
## Stationary combustion dominates all direct on-site emissions
[CHART:bar:Stationary Combustion=29746,Fugitive Emissions=4241,Mobile Combustion=1546]
- Stationary Combustion is 29,746 TCO₂Eq (83.7% of Scope 1) — coal-to-gas fuel switch cuts 30-45%
- Fugitive refrigerant leaks: 4,241 TCO₂Eq with very high GWP — leak audit programme needed now
- Mobile fleet: 1,546 TCO₂Eq — EV transition for last-mile vehicles halves this within 3 years

CHART TAG SYNTAX:  [CHART:type:Label1=value1,Label2=value2,...]
  Types: pie | doughnut | bar (horizontal) | col (vertical bar) | line | area | radar | polar | stacked
IMAGE TAG SYNTAX (only on slides WITHOUT a chart): [IMAGE:search query:layout]
  Layouts: bg | right | left | inset

All numeric bullets must include: real number from data + what it means + specific action/implication.
No text before first ---SLIDE--- and no text after last slide.`;

  if (!isReport) {
    const prompt = `You are a senior ESG consultant creating an ${label} for Growlity's Board of Directors.
${formatRules}

Create 8 compelling slides using varied types: at least 1 hero, 1 summary, 3 chart_focus, 1 comparison, 1 image_focus.
Cover: title (hero), KPI overview (summary), scope emissions breakdown, key category analysis, risks, strategy, recommendations.

DATA:
${contextData}

Generate all 8 slides now:`;
    const [raw, layoutPlan] = await Promise.all([callChutes(prompt, 4500), layoutPlanPromise]);
    console.log("[Dashboard] raw output (first 600 chars):", raw.slice(0, 600));
    let slides = raw.split(/---+\s*slide\s*---+/gi).map(s => s.trim()).filter(s => s.length > 0 && s.includes("#"));
    if (slides.length < 2) {
      console.warn(`[Dashboard] delimiter split yielded ${slides.length} — falling back to heading split`);
      const byHeading = raw.split(/(?=^# )/m).map(s => s.trim()).filter(s => s.startsWith("#") && s.length > 3);
      if (byHeading.length > slides.length) slides = byHeading;
    }
    const expandedSlides: string[] = [];
    const expandedPlan: SlideLayout[] = [];
    slides.forEach((slideMd, idx) => {
      const parts = splitDenseSlideMarkdown(slideMd);
      parts.forEach((part, partIdx) => {
        expandedSlides.push(part);
        const entry = layoutPlan[idx]
          ? { ...layoutPlan[idx] }
          : ({ slide_index: idx, slide_type: "text_heavy", layout_metadata: {} } as SlideLayout);
        if (partIdx > 0) entry.slide_type = "text_heavy";
        expandedPlan.push(entry);
      });
    });

    console.log(`Dashboard: AI generated ${expandedSlides.length} slides after density split`);
    return { slidesMarkdown: expandedSlides, layoutPlan: expandedPlan };
  }

  // GHG Report: 15 slides — split into 2 parallel calls (free models cap ~4096 output tokens)
  const sharedCtx = `DATA (use exact numbers for all bullets and charts):
${contextData}`;

  const promptPart1 = `You are a senior ESG consultant creating a GHG Emissions Report for Growlity's Board of Directors.
${formatRules}

Generate EXACTLY slides 1 through 8 of a 15-slide deck.
Slide type variety required: slide 1 hero, slide 2 summary (KPI cards), slides 3-7 mix of chart_focus and text_heavy, slide 8 comparison or image_focus.
Cover: title/overview (hero), KPI metrics (summary), Scope 1 three sub-categories (chart_focus), Scope 2 energy (chart_focus), Scope 3 overview (chart_focus), plus 1 comparison and 1 image slide.

${sharedCtx}

Output ONLY slides 1-8 (each separated by ---SLIDE---):`;

  const promptPart2 = `You are a senior ESG consultant creating a GHG Emissions Report for Growlity's Board of Directors.
${formatRules}

Generate EXACTLY slides 9 through 15 of a 15-slide deck.
Slide type variety required: at least 2 chart_focus, 1 comparison, 1 image_focus, 1 summary or hero intro, 1 text_heavy, last slide hero (thank-you).
Cover: Scope 3 deep-dives (business travel chart, logistics, water/waste/people), top emitters ranked (bar chart), regulatory risks (comparison or text_heavy), final recommendations (summary), closing (hero).

${sharedCtx}

Output ONLY slides 9-15 (each separated by ---SLIDE---):`;

  console.log("GHG Report: making 3 parallel AI calls (layout plan + slides 1-8 + slides 9-15)...");
  const [raw1, raw2, layoutPlan] = await Promise.all([
    callChutes(promptPart1, 4500),
    callChutes(promptPart2, 4500),
    layoutPlanPromise,
  ]);

  // Robust parse: tolerates lowercase/spaced delimiters; falls back to heading-split
  const parse = (raw: string, lbl: string) => {
    console.log(`[${lbl}] raw output (first 600 chars):`, raw.slice(0, 600));
    let chunks = raw.split(/---+\s*slide\s*---+/gi).map(s => s.trim()).filter(s => s.length > 0 && s.includes("#"));
    if (chunks.length < 2) {
      console.warn(`[${lbl}] delimiter split yielded ${chunks.length} slide(s) — falling back to heading split`);
      const byHeading = raw.split(/(?=^# )/m).map(s => s.trim()).filter(s => s.startsWith("#") && s.length > 3);
      if (byHeading.length > chunks.length) chunks = byHeading;
    }
    console.log(`[${lbl}] parsed ${chunks.length} slides`);
    return chunks;
  };

  const part1 = parse(raw1, "part1");
  const part2 = parse(raw2, "part2");
  const mergedSlides = [...part1, ...part2];
  const slidesMarkdown: string[] = [];
  const expandedPlan: SlideLayout[] = [];
  mergedSlides.forEach((slideMd, idx) => {
    const parts = splitDenseSlideMarkdown(slideMd);
    parts.forEach((part, partIdx) => {
      slidesMarkdown.push(part);
      const entry = layoutPlan[idx]
        ? { ...layoutPlan[idx] }
        : ({ slide_index: idx, slide_type: "text_heavy", layout_metadata: {} } as SlideLayout);
      if (partIdx > 0) entry.slide_type = "text_heavy";
      expandedPlan.push(entry);
    });
  });

  console.log(`GHG Report: part1=${part1.length} slides, part2=${part2.length} slides, total=${slidesMarkdown.length} after density split`);
  return { slidesMarkdown, layoutPlan: expandedPlan };
}

// ── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  let body: { contextData?: string; pageType?: string } | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body?.contextData) {
    return NextResponse.json({ error: "Missing contextData in request." }, { status: 400 });
  }

  const pageType = body.pageType ?? "dashboard";

  // ── GHG Report → proxy to Python FastAPI server ───────────────────────────
  // generate_ppt.py (python-pptx) handles ghg-report generation.
  // The Python server must be running: uvicorn generate_ppt:app --app-dir app/api/generate-ppt --port 8000
  if (pageType === "ghg-report") {
    const envUrl = process.env.PYTHON_PPT_URL?.trim();
    const candidateUrls = [
      envUrl,
      "http://127.0.0.1:8001/generate-ppt",
      "http://localhost:8001/generate-ppt",
      "http://127.0.0.1:8000/generate-ppt",
      "http://localhost:8000/generate-ppt",
    ].filter((url, idx, arr): url is string => Boolean(url) && arr.indexOf(url as string) === idx);

    let lastError: unknown = null;
    for (const pythonUrl of candidateUrls) {
      try {
        const pyRes = await fetch(pythonUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contextData: body.contextData, pageType }),
        });

        if (!pyRes.ok) {
          const errText = await pyRes.text();
          lastError = new Error(`Backend ${pythonUrl} responded ${pyRes.status}: ${errText}`);
          console.error("Python PPT server error:", pyRes.status, pythonUrl, errText);
          continue;
        }

        const pptBuffer = await pyRes.arrayBuffer();
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        const downloadName = `growlity-esg-report-${ts}.pptx`;
        const renderer = pyRes.headers.get("x-ppt-renderer") ?? "python-ghg-v2";
        return new Response(pptBuffer, {
          status: 200,
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "Content-Disposition": `attachment; filename="${downloadName}"`,
            "X-PPT-Backend-URL": pythonUrl,
            "X-PPT-Renderer": renderer,
            "X-PPT-Filename": downloadName,
          },
        });
      } catch (err) {
        lastError = err;
      }
    }

    console.error("Could not reach any Python PPT server endpoint:", lastError);
    return NextResponse.json(
      {
        error: "Python PPT server is not reachable on configured endpoints.",
        tried: candidateUrls,
        hint: "Start it with: uvicorn generate_ppt:app --app-dir app/api/generate-ppt --port 8001",
      },
      { status: 503 }
    );
  }

  // ── Load logo ──────────────────────────────────────────────────────────────
  let logoBase64: string | null = null;
  try {
    logoBase64 = fs.readFileSync(LOGO_PATH).toString("base64");
  } catch {
    console.warn("Logo not found at:", LOGO_PATH);
  }

  // ── AI generates all slides + layout plan ──────────────────────────────────
  let slidesMarkdown: string[];
  let layoutPlan: SlideLayout[] = [];
  try {
    ({ slidesMarkdown, layoutPlan } = await generateSlides(body.contextData, pageType));
    if (slidesMarkdown.length === 0) throw new Error("No slides returned");
  } catch (err) {
    console.error("AI slide generation failed:", err);
    return NextResponse.json(
      { error: "AI slide generation failed. Please try again in a moment." },
      { status: 503 }
    );
  }

  // ── Build PPTX ────────────────────────────────────────────────────────────
  // @ts-ignore
  const PptxGenJS = require("pptxgenjs");
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";

  const total = slidesMarkdown.length;

  for (let i = 0; i < slidesMarkdown.length; i++) {
    const slideMd = slidesMarkdown[i];

    // Title slide (first slide): full-brand dark layout
    if (i === 0) {
      const slide = pptx.addSlide();
      slide.addShape("rect" as any, { x: 0, y: 0, w: W, h: H, fill: { color: HEADER_BG }, line: { color: HEADER_BG } });
      slide.addShape("rect" as any, { x: 0, y: 0, w: 0.18, h: H, fill: { color: BRAND_GREEN }, line: { color: BRAND_GREEN } });
      slide.addShape("rect" as any, { x: 0.18, y: 0, w: 0.08, h: H, fill: { color: BRAND_BLUE }, line: { color: BRAND_BLUE } });
      if (logoBase64) slide.addImage({ data: `image/webp;base64,${logoBase64}`, x: W - 2.7, y: 0.3, w: 2.4, h: 1.05 });

      // Parse title from markdown — strip all DSL tags ([TYPE:...] / [IMAGE:...] / [CHART:...])
      const isDslTag = (s: string) => /^\[(?:TYPE|IMAGE|CHART|A\]|B\]):/i.test(s.trim()) || /^\[TYPE:/i.test(s.trim());
      const titleLine = slideMd.split("\n").find(l => l.startsWith("# ")) ?? "# ESG Report";
      const mainTitle = stripMd(titleLine.replace(/^#+\s*/, "")).toUpperCase();
      const subLines = slideMd.split("\n")
        .filter(l => !l.startsWith("#") && l.trim().length > 0 && !l.startsWith("-") && !isDslTag(l))
        .slice(0, 2).map(l => stripMd(l));
      const bullets = slideMd.split("\n")
        .filter(l => l.startsWith("- ")).map(l => stripMd(l.replace(/^-\s*/, "")));

      slide.addText(mainTitle, { x: 0.55, y: 1.1, w: 7.5, h: 0.75, fontSize: 28, bold: true, color: "FFFFFF", fontFace: "Calibri" });
      if (subLines[0]) slide.addText(subLines[0], { x: 0.55, y: 1.95, w: 8, h: 0.45, fontSize: 15, color: BRAND_GREEN, fontFace: "Calibri" });
      if (subLines[1]) slide.addText(subLines[1], { x: 0.55, y: 2.45, w: 8.5, h: 0.35, fontSize: 11, color: "AAAAAA", fontFace: "Calibri" });
      if (bullets[0]) slide.addText(bullets[0], { x: 0.55, y: 3.15, w: 7, h: 0.5, fontSize: 16, bold: true, color: "FFFFFF", fontFace: "Calibri" });
      slide.addText("Prepared by ESGtech.ai  |  esgtech.ai", { x: 0.55, y: H - 0.5, w: 9, h: 0.3, fontSize: 9, color: "777777", fontFace: "Calibri" });
      continue;
    }

    // Last slide: branded closing
    if (i === total - 1 && slideMd.toLowerCase().includes("thank")) {
      const slide = pptx.addSlide();
      slide.addShape("rect" as any, { x: 0, y: 0, w: W, h: H, fill: { color: HEADER_BG }, line: { color: HEADER_BG } });
      slide.addShape("rect" as any, { x: 0, y: 0, w: 0.18, h: H, fill: { color: BRAND_GREEN }, line: { color: BRAND_GREEN } });
      slide.addShape("rect" as any, { x: 0.18, y: 0, w: 0.08, h: H, fill: { color: BRAND_BLUE }, line: { color: BRAND_BLUE } });
      if (logoBase64) slide.addImage({ data: `image/webp;base64,${logoBase64}`, x: W - 2.7, y: 0.3, w: 2.4, h: 1.05 });
      slide.addText("Thank You", { x: 0.55, y: 1.3, w: 7, h: 0.75, fontSize: 36, bold: true, color: "FFFFFF", fontFace: "Calibri" });
      const sub = slideMd.split("\n").filter(l => l.startsWith("- ")).map(l => stripMd(l.replace(/^-\s*/, ""))).join("  ·  ");
      if (sub) slide.addText(sub, { x: 0.55, y: 2.2, w: 8.5, h: 0.4, fontSize: 11, color: BRAND_GREEN, fontFace: "Calibri", wrap: true });
      slide.addText("Growlity – Committed to Science-Based Carbon Accounting", { x: 0.55, y: 2.75, w: 8.5, h: 0.35, fontSize: 12, color: "CCCCCC", fontFace: "Calibri" });
      slide.addText("Generated by ESGtech.ai  |  esgtech.ai", { x: 0.55, y: H - 0.5, w: 9, h: 0.3, fontSize: 9, color: "777777", fontFace: "Calibri" });
      continue;
    }

    // All other slides: branded content with chart, image, or text
    const slide = pptx.addSlide();
    await renderSlide(pptx, slide, slideMd, i + 1, total, logoBase64, layoutPlan[i]);
  }

  // ── Stream PPTX ───────────────────────────────────────────────────────────
  try {
    const buffer = await pptx.write({ outputType: "base64" });
    const binary = Buffer.from(buffer as string, "base64");
    return new Response(binary, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": 'attachment; filename="growlity-esg-report.pptx"',
      },
    });
  } catch (err) {
    console.error("PPTX write failed:", err);
    return NextResponse.json({ error: "Failed to generate PPTX." }, { status: 500 });
  }
}
