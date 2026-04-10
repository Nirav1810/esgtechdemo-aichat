import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

/**
 * GET /api/download-brsr-template
 * Returns the exact SEBI XBRL macro-enabled Excel template format for BRSR.
 */
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'sebi_brsr_template.xlsm');
    const buffer = await fs.readFile(filePath);

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.ms-excel.sheet.macroEnabled.12',
        'Content-Disposition': 'attachment; filename="SEBI_BRSR_Template.xlsm"',
      },
    });
  } catch (error) {
    console.error('Failed to download SEBI template:', error);
    return NextResponse.json(
      { error: 'Failed to download SEBI template' },
      { status: 500 }
    );
  }
}
