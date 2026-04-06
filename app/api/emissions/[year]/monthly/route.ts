import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { mapEmissionMonthlyRow } from '@/lib/db-mappers';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;
    const { searchParams } = new URL(req.url);
    const scope = parseInt(searchParams.get('scope') || '1');

    const { data: rows, error } = await supabase
      .from('emission_monthly')
      .select('*')
      .eq('fiscal_year', year)
      .eq('scope', scope)
      .order('month');

    if (error) throw error;

    return NextResponse.json((rows ?? []).map(mapEmissionMonthlyRow));
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    return NextResponse.json({ error: 'Failed to fetch monthly data' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;
    const body = await req.json();
    const { scope, data } = body;

    if (!scope || !Array.isArray(data)) {
      return NextResponse.json({ error: 'Scope and data array required' }, { status: 400 });
    }

    // Upsert each month individually (replacing MongoDB bulkWrite)
    const upsertRows = data.map((item: any) => ({
      fiscal_year: year,
      scope,
      month: item.month,
      stationary: item.stationary ?? 0,
      mobile: item.mobile ?? 0,
      fugitive: item.fugitive ?? 0,
      renewable: item.renewable ?? 0,
      imported: item.imported ?? 0,
      electricity: item.electricity ?? 0,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('emission_monthly')
      .upsert(upsertRows, { onConflict: 'fiscal_year,scope,month' });

    if (error) throw error;

    const { data: updatedRows } = await supabase
      .from('emission_monthly')
      .select('*')
      .eq('fiscal_year', year)
      .eq('scope', scope)
      .order('month');

    return NextResponse.json((updatedRows ?? []).map(mapEmissionMonthlyRow));
  } catch (error) {
    console.error('Error updating monthly data:', error);
    return NextResponse.json({ error: 'Failed to update monthly data' }, { status: 500 });
  }
}
