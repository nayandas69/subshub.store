import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import CategoryModel from "@/models/Category";
import { isAdmin } from "@/lib/admin-auth";

export async function GET() {
  try {
    await connectToDatabase();
    const cats = await CategoryModel.find().sort({ order: 1 }).lean();
    return NextResponse.json(cats);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const doc = new CategoryModel(body);
    await doc.save();
    return NextResponse.json({ success: true, category: doc });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
