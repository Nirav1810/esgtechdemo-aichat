import { NextResponse } from "next/server";

const CHUTES_CHAT_URL = "https://llm.chutes.ai/v1/chat/completions";

const IMAGE_GENERATION_ENDPOINTS: Record<string, string> = {
  "hunyuan-image-3": "https://chutes-hunyuan-image-3.chutes.ai/generate",
  "z-image-turbo": "https://chutes-z-image-turbo.chutes.ai/generate",
  "FLUX.1-schnell": "https://chutes-flux-1-schnell.chutes.ai/generate",
  "Qwen-Image-2512": "https://chutes-qwen-image-2512.chutes.ai/generate",
};

const IMAGE_GENERATION_FALLBACK_ORDER = [
  "hunyuan-image-3",
  "z-image-turbo",
  "FLUX.1-schnell",
  "Qwen-Image-2512",
];

const IMAGE_PROMPT_MODELS = [
  "zai-org/GLM-4.6V",
  "Qwen/Qwen2.5-VL-32B-Instruct",
  "chutesai/Mistral-Small-3.2-24B-Instruct-2506",
  "unsloth/gemma-3-12b-it",
  "unsloth/gemma-3-4b-it",
];

const MAX_REFERENCE_IMAGE_BYTES = 10 * 1024 * 1024;
const ESG_ONLY_MESSAGE =
  "I am an AI chatbot for ESG topics, so I cannot answer general-purpose requests. Please provide an ESG-related image prompt.";
const IMAGE_SCOPE_CLASSIFIER_MODEL = "zai-org/GLM-4.6V";
// ESG scope behavior toggle (set in .env.local):
// - ESG_SCOPE_ENFORCEMENT=strict (default): blocks non-ESG image prompts.
// - ESG_SCOPE_ENFORCEMENT=soft: auto-rewrites non-ESG prompts into ESG-themed prompts.
// - ESG_SCOPE_ENFORCEMENT=off: disables scope enforcement.
type ScopeEnforcementMode = "strict" | "soft" | "off";

type ImagePart = {
  type: "image_url";
  image_url: {
    url: string;
  };
};

function getApiKey(): string {
  const primary =
    process.env.CHUTES_API_KEY || process.env.NEXT_PUBLIC_CHUTES_API_KEY || "";
  const fallback = process.env.CHUTES_API_TOKEN || "";
  return primary || fallback;
}

function getScopeEnforcementMode(): ScopeEnforcementMode {
  const raw = (process.env.ESG_SCOPE_ENFORCEMENT || "strict").toLowerCase();
  if (raw === "off") return "off";
  if (raw === "soft") return "soft";
  return "strict";
}

function ensurePrompt(prompt: string): string {
  const trimmed = prompt.trim();
  if (!trimmed) {
    throw new Error("Prompt is required for image generation.");
  }
  if (trimmed.length > 2000) {
    return trimmed.slice(0, 2000);
  }
  return trimmed;
}

async function classifyImageScope(
  apiKey: string,
  prompt: string,
  referenceImageDataUrl?: string
): Promise<boolean> {
  try {
    const userContent: Array<{ type: "text"; text: string } | ImagePart> = [
      {
        type: "text",
        text: `Classify whether this image-generation request is ESG-related. Return only compact JSON: {"in_scope":true} or {"in_scope":false}. Request: ${prompt}`,
      },
    ];

    if (referenceImageDataUrl) {
      userContent.push({
        type: "image_url",
        image_url: { url: referenceImageDataUrl },
      });
    }

    const response = await fetch(CHUTES_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: IMAGE_SCOPE_CLASSIFIER_MODEL,
        stream: false,
        temperature: 0,
        max_tokens: 30,
        messages: [
          {
            role: "system",
            content:
              "You are an ESG scope classifier. In-scope requests are about: environment (climate, emissions, sustainability, renewable energy, waste management, pollution, conservation, nature), social (labor practices, human rights, diversity, community impact, health and safety, CSR), governance (ethics, compliance, corporate responsibility, transparency, risk management), or ANY business analysis related to these topics. When in doubt, classify as in_scope instead of out of scope. Return only JSON.",
          },
          {
            role: "user",
            content: userContent,
          },
        ],
      }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    const content: string =
      data?.choices?.[0]?.message?.content ||
      data?.message ||
      data?.content ||
      "";

    if (typeof content !== "string") return false;

    try {
      const parsed = JSON.parse(content);
      return Boolean(parsed?.in_scope === true);
    } catch {
      const normalized = content.toLowerCase();
      if (normalized.includes("\"in_scope\":true")) return true;
      return false;
    }
  } catch {
    return false;
  }
}

function getExtension(name: string): string {
  const parts = name.toLowerCase().split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

function inferImageMime(fileName: string): string {
  const ext = getExtension(fileName);
  if (ext === "png") return "image/png";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  return "image/png";
}

function isImageFile(file: File): boolean {
  const mime = (file.type || "").toLowerCase();
  return mime.startsWith("image/") || ["png", "jpg", "jpeg", "webp", "gif"].includes(getExtension(file.name));
}

async function fileToDataUrl(file: File): Promise<string> {
  const mime = (file.type || inferImageMime(file.name)).toLowerCase();
  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  return `data:${mime};base64,${base64}`;
}

function buildGenerationModelOrder(requestedModel?: string): string[] {
  if (!requestedModel || !IMAGE_GENERATION_ENDPOINTS[requestedModel]) {
    return IMAGE_GENERATION_FALLBACK_ORDER;
  }
  return [
    requestedModel,
    ...IMAGE_GENERATION_FALLBACK_ORDER.filter((model) => model !== requestedModel),
  ];
}

async function buildPromptFromReferenceImage(
  apiKey: string,
  originalPrompt: string,
  imageDataUrl: string
): Promise<string> {
  let lastErrorText = "";

  const instruction = originalPrompt.trim()
    ? `User prompt: ${originalPrompt}`
    : "User did not provide a text prompt. Infer a high-quality prompt from the reference image.";

  for (const model of IMAGE_PROMPT_MODELS) {
    const messages = [
      {
        role: "system",
        content:
          "You write concise, production-ready text-to-image prompts. Return ONLY a single prompt sentence in English. No markdown, no labels.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `${instruction}\n\nCreate one detailed prompt that preserves the key subject/composition/style of the reference image while following the user intent.`,
          },
          {
            type: "image_url",
            image_url: {
              url: imageDataUrl,
            },
          } satisfies ImagePart,
        ],
      },
    ];

    const response = await fetch(CHUTES_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 200,
        temperature: 0.4,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      lastErrorText = errorText;
      const status = response.status || 500;
      const shouldTryNext =
        status === 404 ||
        status === 429 ||
        status === 401 ||
        status === 403 ||
        status >= 500;
      if (shouldTryNext) continue;
      break;
    }

    const data = await response.json();
    const content =
      data?.choices?.[0]?.message?.content ||
      data?.content ||
      data?.message ||
      "";

    if (typeof content === "string" && content.trim()) {
      return content.trim().replace(/^"|"$/g, "");
    }
  }

  if (originalPrompt.trim()) {
    return originalPrompt.trim();
  }

  if (lastErrorText) {
    throw new Error("Failed to derive prompt from reference image.");
  }

  throw new Error("Unable to build prompt from reference image.");
}

async function callGenerationEndpoint(
  endpoint: string,
  apiKey: string,
  prompt: string
): Promise<{ imageDataUrl: string; mimeType: string }> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP_${response.status}:${errorText}`);
  }

  const contentType = (response.headers.get("content-type") || "").toLowerCase();

  if (contentType.startsWith("image/")) {
    const imageBuffer = Buffer.from(await response.arrayBuffer());
    const base64 = imageBuffer.toString("base64");
    return {
      imageDataUrl: `data:${contentType};base64,${base64}`,
      mimeType: contentType,
    };
  }

  const payload = await response.json();
  const imageBase64 =
    payload?.image || payload?.image_base64 || payload?.b64_json || payload?.data?.[0]?.b64_json;

  if (typeof imageBase64 === "string" && imageBase64.trim()) {
    return {
      imageDataUrl: `data:image/png;base64,${imageBase64}`,
      mimeType: "image/png",
    };
  }

  throw new Error("Generation endpoint returned no image payload.");
}

export async function POST(req: Request) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Chutes API key not configured on the server." },
      { status: 500 }
    );
  }

  const requestContentType = req.headers.get("content-type") || "";

  try {
    let prompt = "";
    let model = "";
    let referenceImageFile: File | null = null;

    if (requestContentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      prompt =
        typeof formData.get("prompt") === "string"
          ? (formData.get("prompt") as string)
          : typeof formData.get("question") === "string"
            ? (formData.get("question") as string)
            : "";
      model =
        typeof formData.get("model") === "string"
          ? (formData.get("model") as string)
          : "";

      const explicitlyProvidedImage = formData.get("referenceImage");
      if (explicitlyProvidedImage instanceof File) {
        referenceImageFile = explicitlyProvidedImage;
      } else {
        const files = formData
          .getAll("files")
          .filter((entry): entry is File => entry instanceof File);
        referenceImageFile = files.find((file) => isImageFile(file)) || null;
      }
    } else {
      const body = await req.json();
      prompt = typeof body.prompt === "string" ? body.prompt : "";
      model = typeof body.model === "string" ? body.model : "";
    }

    let referenceImageDataUrl = "";
    if (referenceImageFile) {
      if (!isImageFile(referenceImageFile)) {
        return NextResponse.json(
          { error: "Reference file must be an image." },
          { status: 400 }
        );
      }
      if (referenceImageFile.size > MAX_REFERENCE_IMAGE_BYTES) {
        return NextResponse.json(
          { error: "Reference image is too large. Max size is 10 MB." },
          { status: 400 }
        );
      }
      referenceImageDataUrl = await fileToDataUrl(referenceImageFile);
    }

    let finalPrompt = prompt.trim();
    if (referenceImageDataUrl) {
      const referencePrompt = await buildPromptFromReferenceImage(
        apiKey,
        finalPrompt,
        referenceImageDataUrl
      );

      finalPrompt = finalPrompt
        ? `${finalPrompt}. Reference guidance: ${referencePrompt}`
        : referencePrompt;
    }

    finalPrompt = ensurePrompt(finalPrompt);

    const scopeMode = getScopeEnforcementMode();
    const inScope =
      scopeMode === "off"
        ? true
        : await classifyImageScope(
          apiKey,
          finalPrompt,
          referenceImageDataUrl || undefined
        );
    if (!inScope) {
      if (scopeMode === "strict") {
        return NextResponse.json({ error: ESG_ONLY_MESSAGE }, { status: 400 });
      }

      if (scopeMode === "soft") {
        finalPrompt = `Create an ESG-themed visual that remains environmentally focused. Prompt: ${finalPrompt}`;
        finalPrompt = ensurePrompt(finalPrompt);
      }
    }

    const modelOrder = buildGenerationModelOrder(model.trim());
    let lastError = "";

    for (const candidateModel of modelOrder) {
      const endpoint = IMAGE_GENERATION_ENDPOINTS[candidateModel];
      if (!endpoint) continue;

      try {
        const generated = await callGenerationEndpoint(endpoint, apiKey, finalPrompt);
        return NextResponse.json({
          imageDataUrl: generated.imageDataUrl,
          mimeType: generated.mimeType,
          modelUsed: candidateModel,
          promptUsed: finalPrompt,
        });
      } catch (error) {
        const errorText = error instanceof Error ? error.message : "Unknown error";
        lastError = errorText;
        const statusMatch = errorText.match(/^HTTP_(\d+):/);
        const status = statusMatch ? Number(statusMatch[1]) : 500;

        const shouldTryNext =
          status === 404 ||
          status === 429 ||
          status === 401 ||
          status === 403 ||
          status >= 500;

        if (!shouldTryNext) {
          break;
        }
      }
    }

    return NextResponse.json(
      {
        error: "All image generation models failed.",
        details: lastError,
      },
      { status: 502 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate image.",
      },
      { status: 400 }
    );
  }
}
