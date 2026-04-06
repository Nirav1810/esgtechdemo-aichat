import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { mapEmissionSummaryRow } from '@/lib/db-mappers';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;

    const { data: row, error } = await supabase
      .from('emission_summaries')
      .select('*')
      .eq('fiscal_year', year)
      .single();

    if (error || !row) {
      return NextResponse.json({ error: 'Fiscal year not found' }, { status: 404 });
    }

    return NextResponse.json(mapEmissionSummaryRow(row));
  } catch (error) {
    console.error('Error fetching summary:', error);
    return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;
    const body = await req.json();
    const { total_emissions, scope_1, scope_2, scope_3, breakdown, top_emitters } = body;

    // Build flat update object from nested input
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (total_emissions !== undefined) updatePayload.total_emissions = total_emissions;
    if (scope_1 !== undefined) {
      updatePayload.scope1_value = scope_1.value;
      updatePayload.scope1_status = scope_1.status;
    }
    if (scope_2 !== undefined) {
      updatePayload.scope2_value = scope_2.value;
      updatePayload.scope2_status = scope_2.status;
    }
    if (scope_3 !== undefined) {
      updatePayload.scope3_value = scope_3.value;
      updatePayload.scope3_status = scope_3.status;
    }
    if (breakdown !== undefined) {
      updatePayload.scope1_percentage = breakdown.scope_1_percentage;
      updatePayload.scope2_percentage = breakdown.scope_2_percentage;
      updatePayload.scope3_percentage = breakdown.scope_3_percentage;
    }
    if (top_emitters !== undefined) updatePayload.top_emitters = top_emitters;

    const { data: row, error } = await supabase
      .from('emission_summaries')
      .update(updatePayload)
      .eq('fiscal_year', year)
      .select()
      .single();

    if (error || !row) {
      return NextResponse.json({ error: 'Fiscal year not found' }, { status: 404 });
    }

    return NextResponse.json(mapEmissionSummaryRow(row));
  } catch (error) {
    console.error('Error updating summary:', error);
    return NextResponse.json({ error: 'Failed to update summary' }, { status: 500 });
  }
}
