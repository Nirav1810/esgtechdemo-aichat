import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { EmissionSummary } from "@/models/EmissionSummary";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;
    await dbConnect();

    const summary = await EmissionSummary.findOne({ fiscal_year: year }).lean();

    if (!summary) {
      return NextResponse.json({ error: "Fiscal year not found" }, { status: 404 });
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error fetching summary:", error);
    return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 });
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

    const { total_emissions, scope_1, scope_2, scope_3, breakdown, top_emitters } = body;

    const summary = await EmissionSummary.findOneAndUpdate(
      { fiscal_year: year },
      {
        $set: {
          ...(total_emissions !== undefined && { total_emissions }),
          ...(scope_1 !== undefined && { scope_1 }),
          ...(scope_2 !== undefined && { scope_2 }),
          ...(scope_3 !== undefined && { scope_3 }),
          ...(breakdown !== undefined && { breakdown }),
          ...(top_emitters !== undefined && { top_emitters })
        }
      },
      { new: true, runValidators: true }
    );

    if (!summary) {
      return NextResponse.json({ error: "Fiscal year not found" }, { status: 404 });
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error updating summary:", error);
    return NextResponse.json({ error: "Failed to update summary" }, { status: 500 });
  }
}
