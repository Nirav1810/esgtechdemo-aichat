import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { mapEmissionCategoryRow } from '@/lib/db-mappers';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;

    const { data: rows, error } = await supabase
      .from('emission_categories')
      .select('*')
      .eq('fiscal_year', year);

    if (error) throw error;

    return NextResponse.json((rows ?? []).map(mapEmissionCategoryRow));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;
    const body = await req.json();
    const { data } = body;

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Data array required' }, { status: 400 });
    }

    // Delete existing then insert new (same behaviour as the old Mongoose version)
    await supabase.from('emission_categories').delete().eq('fiscal_year', year);

    if (data.length > 0) {
      const rows = data.map((item: any) => ({
        fiscal_year: year,
        scope: 3,
        category: item.name || item.category,
        value: item.value,
        color: item.color || '#6366f1',
      }));
      await supabase.from('emission_categories').insert(rows);
    }

    const { data: updatedRows } = await supabase
      .from('emission_categories')
      .select('*')
      .eq('fiscal_year', year);

    return NextResponse.json((updatedRows ?? []).map(mapEmissionCategoryRow));
  } catch (error) {
    console.error('Error updating categories:', error);
    return NextResponse.json({ error: 'Failed to update categories' }, { status: 500 });
  }
}
