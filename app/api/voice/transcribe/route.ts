import { NextResponse } from "next/server";

const CHUTES_WHISPER_URL = "https://chutes-whisper-large-v3.chutes.ai/transcribe";

const PRIMARY_API_KEY = process.env.CHUTES_API_KEY || "";
const FALLBACK_API_KEY = process.env.NEXT_PUBLIC_CHUTES_FALLBACK_KEY || "";
const API_KEY = PRIMARY_API_KEY || FALLBACK_API_KEY;

export async function POST(req: Request) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Chutes API key not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided." },
        { status: 400 }
      );
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const audioBase64 = buffer.toString("base64");

    const response = await fetch(CHUTES_WHISPER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio_b64: audioBase64,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Whisper API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to transcribe audio." },
        { status: response.status }
      );
    }

    const rawResponse = await response.text();
    let transcript = "";
    let parsedData: unknown = rawResponse;

    try {
      parsedData = JSON.parse(rawResponse);
    } catch {
      parsedData = rawResponse;
    }

    if (typeof parsedData === "string") {
      transcript = parsedData;
    } else if (Array.isArray(parsedData)) {
      transcript = parsedData
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          if (item && typeof item === "object" && "text" in item) {
            const value = (item as { text?: unknown }).text;
            return typeof value === "string" ? value : "";
          }

          return "";
        })
        .filter(Boolean)
        .join(" ");
    } else if (parsedData && typeof parsedData === "object") {
      const data = parsedData as {
        text?: string;
        transcription?: string;
        transcript?: string;
        result?: {
          text?: string;
          transcription?: string;
          transcript?: string;
        };
      };

      transcript =
        data.text ||
        data.transcription ||
        data.transcript ||
        data.result?.text ||
        data.result?.transcription ||
        data.result?.transcript ||
        "";
    }

    console.log("Voice transcription raw response:", rawResponse);
    console.log(
      "Voice transcription parsed type:",
      Array.isArray(parsedData) ? "array" : typeof parsedData
    );
    console.log("Voice transcription text length:", transcript.length);

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error("Voice transcription error:", error);
    return NextResponse.json(
      { error: "Unexpected error during transcription." },
      { status: 500 }
    );
  }
}
