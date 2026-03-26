import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { EmissionSummary } from "@/models/EmissionSummary";

export async function GET() {
  try {
    await dbConnect();
    const summaries = await EmissionSummary.find({}).sort({ fiscal_year: -1 }).lean();
    const fiscalYears = summaries.map(s => s.fiscal_year);
    return NextResponse.json({ fiscalYears });
  } catch (error) {
    console.error("Error fetching fiscal years:", error);
    return NextResponse.json({ error: "Failed to fetch fiscal years" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { fiscal_year } = body;

    if (!fiscal_year) {
      return NextResponse.json({ error: "Fiscal year is required" }, { status: 400 });
    }

    const existing = await EmissionSummary.findOne({ fiscal_year });
    if (existing) {
      return NextResponse.json({ error: "Fiscal year already exists" }, { status: 400 });
    }

    const summary = await EmissionSummary.create({
      fiscal_year,
      total_emissions: 0,
      scope_1: { value: 0, status: "Data available" },
      scope_2: { value: 0, status: "Data available" },
      scope_3: { value: 0, status: "Data available" },
      breakdown: {
        scope_1_percentage: 0,
        scope_2_percentage: 0,
        scope_3_percentage: 0
      },
      top_emitters: []
    });

    return NextResponse.json({ success: true, fiscalYear: summary.fiscal_year });
  } catch (error) {
    console.error("Error creating fiscal year:", error);
    return NextResponse.json({ error: "Failed to create fiscal year" }, { status: 500 });
  }
}
