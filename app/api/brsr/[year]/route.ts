import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// ─── GET /api/brsr/[year] ─────────────────────────────────────────────────────
// Returns the BRSR report for the authenticated user and specified fiscal year.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    // 1. Authenticate — reject unauthenticated requests immediately
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { year } = await params;

    // 2. Query scoped strictly to this user's ID AND the requested fiscal year
    const { data: report, error } = await supabase
      .from('brsr_reports')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('fiscal_year', year)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = row not found — normal for a fresh user/year combo
      throw error;
    }

    if (!report) {
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({
      exists: true,
      data: {
        pyData: report.py_data ?? {},
        // The table column is fy_data; kept as formData for UI compatibility
        formData: report.fy_data ?? {},
        isReportGenerated: report.is_report_generated ?? false,
      },
    });
  } catch (error) {
    console.error('[GET /api/brsr/[year]] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
  }
}

// ─── POST /api/brsr/[year] ────────────────────────────────────────────────────
// Upserts the BRSR report for the authenticated user and specified fiscal year.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    // 1. Authenticate — reject unauthenticated requests immediately
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { year } = await params;
    const body = await req.json();
    const { pyData, formData, isReportGenerated } = body;

    // 2. Upsert scoped to (user_id, fiscal_year) — the unique constraint in DB
    const { error } = await supabase
      .from('brsr_reports')
      .upsert(
        {
          user_id: session.user.id,   // ← bind to authenticated user
          fiscal_year: year,
          py_data: pyData ?? {},
          fy_data: formData ?? {},    // UI calls it formData; DB column is fy_data
          is_report_generated: !!isReportGenerated,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,fiscal_year' }  // ← correct composite unique key
      );

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[POST /api/brsr/[year]] Error:', error);
    return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
  }
}
