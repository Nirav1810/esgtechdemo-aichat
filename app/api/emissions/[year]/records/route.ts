import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { mapEmissionRecordRow, emissionRecordToRow } from '@/lib/db-mappers';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get('scope');
    const category = searchParams.get('category');
    const siteName = searchParams.get('siteName');

    let query = supabase
      .from('emission_records')
      .select('*')
      .eq('fiscal_year', year)
      .order('date', { ascending: false });

    if (scope) query = query.eq('scope', parseInt(scope));
    if (category) query = query.eq('category', category);
    // Supabase ILIKE replaces MongoDB $regex with $options: 'i'
    if (siteName) query = query.ilike('site_name', `%${siteName}%`);

    const { data: rows, error } = await query;
    if (error) throw error;

    return NextResponse.json((rows ?? []).map(mapEmissionRecordRow));
  } catch (error) {
    console.error('Error fetching records:', error);
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;
    const body = await req.json();

    const rowData = emissionRecordToRow({ ...body, fiscal_year: year });

    const { data: row, error } = await supabase
      .from('emission_records')
      .insert(rowData)
      .select()
      .single();

    if (error || !row) throw error;

    return NextResponse.json(mapEmissionRecordRow(row));
  } catch (error) {
    console.error('Error creating record:', error);
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    await params; // year is not needed for update-by-id but required by Next.js routing
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Record ID is required' }, { status: 400 });
    }

    const rowData = {
      ...emissionRecordToRow(updateData),
      updated_at: new Date().toISOString(),
    };

    const { data: row, error } = await supabase
      .from('emission_records')
      .update(rowData)
      .eq('id', id)
      .select()
      .single();

    if (error || !row) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json(mapEmissionRecordRow(row));
  } catch (error) {
    console.error('Error updating record:', error);
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    await params;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Record ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('emission_records')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting record:', error);
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
