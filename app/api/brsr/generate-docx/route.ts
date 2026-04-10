import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';

export const maxDuration = 120; // 2-minute timeout for PDF generation

export async function POST(req: NextRequest) {
  let inputJsonPath = '';
  let outputDocxPath = '';
  let outputPdfPath = '';

  try {
    const body = await req.json();
    const { formData, pyData, fyMetrics, pyMetrics } = body;

    if (!formData || !pyData) {
      return NextResponse.json({ error: 'formData and pyData are required' }, { status: 400 });
    }

    // ── Write payload to a temp JSON file ──────────────────────────────────
    const uid = randomUUID();
    inputJsonPath  = join(tmpdir(), `brsr_input_${uid}.json`);
    outputDocxPath = join(tmpdir(), `brsr_output_${uid}.docx`);
    outputPdfPath  = join(tmpdir(), `brsr_output_${uid}.pdf`);

    writeFileSync(inputJsonPath, JSON.stringify({ formData, pyData, fyMetrics, pyMetrics }), 'utf8');

    // ── Resolve paths relative to project root ─────────────────────────────
    const projectRoot  = process.cwd();
    const scriptPath   = join(projectRoot, 'scripts', 'generate_brsr_from_template.py');

    // ── Run the Python script ──────────────────────────────────────────────
    await new Promise<void>((resolve, reject) => {
      const proc = spawn('python', [scriptPath, inputJsonPath, outputPdfPath], {
        cwd: projectRoot,
        env: { ...process.env },
      });

      let stderr = '';
      proc.stderr.on('data', (chunk: Buffer) => {
        stderr += chunk.toString();
        console.log('[BRSR Generator]', chunk.toString().trim());
      });

      proc.stdout.on('data', (chunk: Buffer) => {
        console.log('[BRSR Generator stdout]', chunk.toString().trim());
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Python script exited with code ${code}.\nstderr: ${stderr}`));
        }
      });

      proc.on('error', (err) => reject(err));
    });

    // ── Read the generated PDF ─────────────────────────────────────────────
    if (!existsSync(outputPdfPath)) {
      return NextResponse.json({ error: 'PDF generation failed — output file not found.' }, { status: 500 });
    }

    const pdfBuffer = readFileSync(outputPdfPath);

    // ── Cleanup temp files ─────────────────────────────────────────────────
    for (const path of [inputJsonPath, outputDocxPath, outputPdfPath]) {
      try { if (existsSync(path)) unlinkSync(path); } catch { /* ignore */ }
    }

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="BRSR_Report_FY2024_25.pdf"`,
        'Content-Length': String(pdfBuffer.length),
      },
    });
  } catch (error: unknown) {
    // Cleanup on error
    for (const path of [inputJsonPath, outputDocxPath, outputPdfPath]) {
      try { if (path && existsSync(path)) unlinkSync(path); } catch { /* ignore */ }
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[generate-brsr-docx] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
