import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { EmissionSummary } from "@/models/EmissionSummary";
import { EmissionMonthly } from "@/models/EmissionMonthly";
import { EmissionCategory } from "@/models/EmissionCategory";
import { EmissionRecord } from "@/models/EmissionRecord";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;
    await dbConnect();

    const summary = await EmissionSummary.findOne({ fiscal_year: year }).lean();
    const monthlyScope1 = await EmissionMonthly.find({ fiscal_year: year, scope: 1 }).sort({ month: 1 }).lean();
    const monthlyScope2 = await EmissionMonthly.find({ fiscal_year: year, scope: 2 }).sort({ month: 1 }).lean();
    const categories = await EmissionCategory.find({ fiscal_year: year }).lean();
    const records = await EmissionRecord.find({ fiscal_year: year }).lean();

    if (!summary) {
      return NextResponse.json({ error: "Fiscal year not found" }, { status: 404 });
    }

    return NextResponse.json({
      summary,
      monthlyScope1,
      monthlyScope2,
      categories,
      records
    });
  } catch (error) {
    console.error("Error fetching emissions data:", error);
    return NextResponse.json({ error: "Failed to fetch emissions data" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;
    await dbConnect();

    await EmissionSummary.deleteOne({ fiscal_year: year });
    await EmissionMonthly.deleteMany({ fiscal_year: year });
    await EmissionCategory.deleteMany({ fiscal_year: year });
    await EmissionRecord.deleteMany({ fiscal_year: year });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting fiscal year:", error);
    return NextResponse.json({ error: "Failed to delete fiscal year" }, { status: 500 });
  }
}
