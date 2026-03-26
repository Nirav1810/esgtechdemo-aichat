import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { EmissionMonthly } from "@/models/EmissionMonthly";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;
    const { searchParams } = new URL(req.url);
    const scope = parseInt(searchParams.get("scope") || "1");
    
    await dbConnect();

    const monthlyData = await EmissionMonthly.find({ fiscal_year: year, scope }).sort({ month: 1 }).lean();

    return NextResponse.json(monthlyData);
  } catch (error) {
    console.error("Error fetching monthly data:", error);
    return NextResponse.json({ error: "Failed to fetch monthly data" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;
    await dbConnect();
    const body = await req.json();
    const { scope, data } = body;

    if (!scope || !Array.isArray(data)) {
      return NextResponse.json({ error: "Scope and data array required" }, { status: 400 });
    }

    const operations = data.map((item: any) => ({
      updateOne: {
        filter: { fiscal_year: year, scope, month: item.month },
        update: { $set: item },
        upsert: true
      }
    }));

    await EmissionMonthly.bulkWrite(operations);

    const updatedData = await EmissionMonthly.find({ fiscal_year: year, scope }).sort({ month: 1 }).lean();

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error("Error updating monthly data:", error);
    return NextResponse.json({ error: "Failed to update monthly data" }, { status: 500 });
  }
}
