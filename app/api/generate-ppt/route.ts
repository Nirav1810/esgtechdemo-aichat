import { NextResponse } from "next/server";

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

  // ── Proxy to Python FastAPI server ───────────────────────────
  // generate_ppt.py (python-pptx) handles both dashboard and ghg-report generation.
  // The Python server must be running: uvicorn generate_ppt:app --app-dir app/api/generate-ppt --port 8000
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
      hint: "Start it with: uvicorn generate_ppt:app --app-dir app/api/generate-ppt --port 8000",
    },
    { status: 503 }
  );
}
