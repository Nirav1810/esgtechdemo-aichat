import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { DEFAULT_FORM_DATA, BrsrFormData } from '../../reports/types';

/**
 * POST /api/parse-brsr-excel
 * Accepts a multipart form-data upload containing the BRSR P6 Excel template.
 * Reads the "Data Entry" sheet, matches each row's internal key (Column A)
 * to a BrsrFormData field, and returns the parsed current-year data.
 */
export async function POST(req: Request) {
  try {
    const formPayload = await req.formData();
    const file = formPayload.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in request.' },
        { status: 400 },
      );
    }

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.xlsx')) {
      return NextResponse.json(
        { success: false, error: 'File must be an Excel (.xlsx) file.' },
        { status: 400 },
      );
    }

    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: 'array' });

    // Prefer the "Data Entry" sheet; fall back to the first sheet
    const sheetName =
      wb.SheetNames.find((n) => n === 'Data Entry') ?? wb.SheetNames[0];

    if (!sheetName) {
      return NextResponse.json(
        { success: false, error: 'No sheets found in the uploaded file.' },
        { status: 422 },
      );
    }

    const ws = wb.Sheets[sheetName];

    // sheet_to_json uses the first row as header keys
    const rows = XLSX.utils.sheet_to_json<Record<string, string | number>>(ws, {
      defval: '',
      raw: true,   // Return raw cell values (numbers as numbers, not formatted strings like "17,618")
    });

    const KEY_COL = 'Internal Key (DO NOT EDIT)';
    const VAL_COL = 'FY 2024-25 Value';

    // Build a set of valid keys for fast lookup
    const validKeys = new Set<string>(Object.keys(DEFAULT_FORM_DATA));
    const result: BrsrFormData = { ...DEFAULT_FORM_DATA };
    const unknownKeys: string[] = [];

    for (const row of rows) {
      const key = String(row[KEY_COL] ?? '').trim();
      if (!key) continue;

      const rawVal = row[VAL_COL];
      // Coerce to plain string: raw numbers come as JS numbers, strip any accidental commas
      const val = rawVal !== undefined && rawVal !== ''
        ? String(rawVal).replace(/,/g, '').trim()
        : '';

      if (validKeys.has(key)) {
        result[key as keyof BrsrFormData] = val;
      } else {
        unknownKeys.push(key);
      }
    }

    // Auto-derive RevenuePPP if it wasn't filled in the template
    if (!result.RevenuePPP || result.RevenuePPP === '0') {
      const rev = parseFloat(result.Revenue);
      result.RevenuePPP = rev > 0 ? String(Math.round((rev * 10) / 20.66)) : '';
    }

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        sheetUsed: sheetName,
        rowsParsed: rows.length,
        unknownKeys,
      },
    });
  } catch (error) {
    console.error('[parse-brsr-excel] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to parse the Excel file.' },
      { status: 500 },
    );
  }
}
