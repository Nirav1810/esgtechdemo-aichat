import { NextResponse } from "next/server";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODELS = [
  "openai/gpt-oss-120b:free",
  "upstage/solar-pro-3:free",
  "meta-llama/llama-3.1-8b-instruct:free",
];
const MAX_TOKENS = 8000;

const PRIMARY_API_KEY =
  process.env.OPENROUTER_API_KEY ||
  process.env.NEXT_PUBLIC_OPENROUTER_PRIMARY_KEY ||
  "";
const FALLBACK_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_FALLBACK_KEY || "";
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

export async function POST(req: Request) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "OpenRouter API key not configured on the server." },
      { status: 500 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body in request." },
      { status: 400 }
    );
  }

const question = typeof body.question === "string" ? body.question.trim() : "";
  const contextData =
    typeof body.contextData === "string" ? body.contextData.trim() : "";
  const pageType =
    typeof body.pageType === "string" ? body.pageType : "dashboard";

  if (!question) {
    return NextResponse.json(
      { error: "Question is required." },
      { status: 400 }
    );
  }

  const searchContext = await performWebSearch(question);

  let combinedContext = "";
  if (contextData) {
    combinedContext += pageType === "ghg-report"
      ? `Here is the current GHG Report data:\n${contextData}\n\n`
      : `Here is the current dashboard context data:\n${contextData}\n\n`;
  }
  if (searchContext) {
    combinedContext += `Here are web search results you can rely on:\n${searchContext}\n\n`;
  }

  // Different system prompts based on page type
  const dashboardPrompt = `You are an expert ESG (Environmental, Social, and Governance) consultant assistant. You help users understand their greenhouse gas emissions data, provide sustainability insights, and suggest improvements.

CRITICAL INSTRUCTION: You MUST respond ONLY in English. Do NOT use any other language including Chinese, Korean, Japanese, or any other language. All responses must be in clear, professional English.

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

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: `${combinedContext}User question: ${question}`,
    },
  ];

  try {
    let lastStatus = 500;
    let lastErrorText = "";

    for (const model of MODELS) {
      const upstreamResponse = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "ESGtech.ai Dashboard",
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
            "X-OpenRouter-Model": model,
          },
        });
      }

      const status = upstreamResponse.status || 500;
      const errorText = await upstreamResponse.text();
      console.error(`OpenRouter upstream error for ${model}:`, status, errorText);
      lastStatus = status;
      lastErrorText = errorText;

      // On 401/403/429/5xx, try the next model; on 4xx like 400, break early
      if (status >= 400 && status < 500 && status !== 429) {
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
    console.error("Error calling OpenRouter:", error);
    return NextResponse.json(
      { error: "Unexpected error while contacting the model." },
      { status: 500 }
    );
  }
}
