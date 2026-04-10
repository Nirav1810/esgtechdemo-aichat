import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;

    const { data: report, error } = await supabase
      .from('brsr_reports')
      .select('*')
      .eq('fiscal_year', year)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!report) {
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({
      exists: true,
      data: {
        pyData: report.py_data,
        formData: report.form_data,
        isReportGenerated: report.is_report_generated,
      }
    });
  } catch (error) {
    console.error('Error fetching BRSR report:', error);
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;
    const body = await req.json();
    const { pyData, formData, isReportGenerated } = body;

    const { error } = await supabase
      .from('brsr_reports')
      .upsert({
        fiscal_year: year,
        py_data: pyData || {},
        form_data: formData || {},
        is_report_generated: !!isReportGenerated,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'fiscal_year' });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving BRSR report:', error);
    return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
  }
}
