import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { mapEmissionSummaryRow } from '@/lib/db-mappers';

export async function GET() {
  try {
    const { data: summaries, error } = await supabase
      .from('emission_summaries')
      .select('fiscal_year')
      .order('fiscal_year', { ascending: false });

    if (error) throw error;

    const fiscalYears = (summaries ?? []).map((s) => s.fiscal_year);
    return NextResponse.json({ fiscalYears });
  } catch (error) {
    console.error('Error fetching fiscal years:', error);
    return NextResponse.json({ error: 'Failed to fetch fiscal years' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fiscal_year } = body;

    if (!fiscal_year) {
      return NextResponse.json({ error: 'Fiscal year is required' }, { status: 400 });
    }

    // Check for duplicate
    const { data: existing } = await supabase
      .from('emission_summaries')
      .select('id')
      .eq('fiscal_year', fiscal_year)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Fiscal year already exists' }, { status: 400 });
    }

    const { data: summary, error } = await supabase
      .from('emission_summaries')
      .insert({
        fiscal_year,
        total_emissions: 0,
        scope1_value: 0,
        scope1_status: 'Data available',
        scope2_value: 0,
        scope2_status: 'Data available',
        scope3_value: 0,
        scope3_status: 'Data available',
        scope1_percentage: 0,
        scope2_percentage: 0,
        scope3_percentage: 0,
        top_emitters: [],
      })
      .select()
      .single();

    if (error || !summary) throw error;

    return NextResponse.json({ success: true, fiscalYear: summary.fiscal_year });
  } catch (error) {
    console.error('Error creating fiscal year:', error);
    return NextResponse.json({ error: 'Failed to create fiscal year' }, { status: 500 });
  }
}
