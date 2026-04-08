import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// ─── GET /api/brsr?year=FY+2024-25 ───────────────────────────────────────────
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const fiscal_year = searchParams.get('year');

  if (!fiscal_year) {
    return NextResponse.json({ error: 'year query param required' }, { status: 400 });
  }

  const { data: report, error } = await supabase
    .from('brsr_reports')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('fiscal_year', fiscal_year)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = row not found — normal for a fresh year
    console.error('Error fetching BRSR report:', error);
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
  }

  return NextResponse.json({ report: report ?? null });
}

// ─── PUT /api/brsr ────────────────────────────────────────────────────────────
// Upsert: creates the row if it doesn't exist, updates it if it does.
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const {
    fiscal_year,
    baseline_year,
    py_data,
    fy_data,
    upload_state,
    is_report_generated,
  } = body;

  if (!fiscal_year) {
    return NextResponse.json({ error: 'fiscal_year is required' }, { status: 400 });
  }

  const { data: report, error } = await supabase
    .from('brsr_reports')
    .upsert(
      {
        user_id: session.user.id,
        fiscal_year,
        baseline_year: baseline_year ?? null,
        py_data: py_data ?? {},
        fy_data: fy_data ?? {},
        upload_state: upload_state ?? 'idle',
        is_report_generated: is_report_generated ?? false,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,fiscal_year' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error saving BRSR report:', error);
    return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
  }

  return NextResponse.json({ report });
}
