import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { EmissionCategory } from "@/models/EmissionCategory";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;
    await dbConnect();

    const categories = await EmissionCategory.find({ fiscal_year: year }).lean();

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
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
    const { data } = body;

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Data array required" }, { status: 400 });
    }

    await EmissionCategory.deleteMany({ fiscal_year: year });

    if (data.length > 0) {
      const records = data.map((item: any) => ({
        fiscal_year: year,
        scope: 3,
        category: item.name || item.category,
        value: item.value,
        color: item.color || "#6366f1"
      }));
      await EmissionCategory.insertMany(records);
    }

    const updatedCategories = await EmissionCategory.find({ fiscal_year: year }).lean();

    return NextResponse.json(updatedCategories);
  } catch (error) {
    console.error("Error updating categories:", error);
    return NextResponse.json({ error: "Failed to update categories" }, { status: 500 });
  }
}
