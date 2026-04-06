import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  mapEmissionSummaryRow,
  mapEmissionMonthlyRow,
  mapEmissionCategoryRow,
  mapEmissionRecordRow,
} from '@/lib/db-mappers';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;

    const [
      { data: summaryRow },
      { data: monthlyScope1 },
      { data: monthlyScope2 },
      { data: categories },
      { data: records },
    ] = await Promise.all([
      supabase.from('emission_summaries').select('*').eq('fiscal_year', year).single(),
      supabase.from('emission_monthly').select('*').eq('fiscal_year', year).eq('scope', 1).order('month'),
      supabase.from('emission_monthly').select('*').eq('fiscal_year', year).eq('scope', 2).order('month'),
      supabase.from('emission_categories').select('*').eq('fiscal_year', year),
      supabase.from('emission_records').select('*').eq('fiscal_year', year),
    ]);

    if (!summaryRow) {
      return NextResponse.json({ error: 'Fiscal year not found' }, { status: 404 });
    }

    return NextResponse.json({
      summary: mapEmissionSummaryRow(summaryRow),
      monthlyScope1: (monthlyScope1 ?? []).map(mapEmissionMonthlyRow),
      monthlyScope2: (monthlyScope2 ?? []).map(mapEmissionMonthlyRow),
      categories: (categories ?? []).map(mapEmissionCategoryRow),
      records: (records ?? []).map(mapEmissionRecordRow),
    });
  } catch (error) {
    console.error('Error fetching emissions data:', error);
    return NextResponse.json({ error: 'Failed to fetch emissions data' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;

    await Promise.all([
      supabase.from('emission_summaries').delete().eq('fiscal_year', year),
      supabase.from('emission_monthly').delete().eq('fiscal_year', year),
      supabase.from('emission_categories').delete().eq('fiscal_year', year),
      supabase.from('emission_records').delete().eq('fiscal_year', year),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting fiscal year:', error);
    return NextResponse.json({ error: 'Failed to delete fiscal year' }, { status: 500 });
  }
}
