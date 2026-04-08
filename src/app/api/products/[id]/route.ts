import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import ProductModel from "@/models/Product";
import { isAdmin } from "@/lib/admin-auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const product = await ProductModel.findOne({ productId: id }).lean();
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      id: product.productId,
      category: product.category,
      name: product.name,
      description: product.description,
      badge: product.badge,
      icon: product.icon,
      iconBg: product.iconBg,
      iconColor: product.iconColor,
      plans: product.plans,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();
    const updates = await request.json();
    
    // Convert 'id' to 'productId' for the schema if needed
    if (updates.id) {
      updates.productId = updates.id;
      delete updates.id;
    }

    const doc = await ProductModel.findOneAndUpdate({ productId: id }, updates, { new: true });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, product: doc });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();
    const doc = await ProductModel.findOneAndDelete({ productId: id });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
