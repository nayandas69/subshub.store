import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import ProductModel from "@/models/Product";
import CategoryModel from "@/models/Category";
import BadgeModel from "@/models/Badge";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BADGES } from "@/lib/products-data";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Auto-seed Categories if empty
    const categoriesCount = await CategoryModel.countDocuments();
    if (categoriesCount === 0) {
      await CategoryModel.insertMany(INITIAL_CATEGORIES);
    }
    
    // Auto-seed Badges if empty
    const badgesCount = await BadgeModel.countDocuments();
    if (badgesCount === 0) {
      await BadgeModel.insertMany(INITIAL_BADGES);
    }

    // Auto-seed Products if empty
    const productsCount = await ProductModel.countDocuments();
    if (productsCount === 0) {
      const docs = INITIAL_PRODUCTS.map(p => ({
        ...p,
        productId: p.id, // map to mongoose schema
      }));
      await ProductModel.insertMany(docs);
    }

    const products = await ProductModel.find().lean();
    
    // Map them back to frontend format
    const formatted = products.map((p: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      id: p.productId,
      category: p.category,
      name: p.name,
      description: p.description,
      badge: p.badge,
      icon: p.icon,
      iconBg: p.iconBg,
      iconColor: p.iconColor,
      plans: p.plans,
      features: p.features || [],
    }));

    return NextResponse.json(formatted);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    // TODO: Verify Admin Session here
    const body = await req.json();
    const doc = new ProductModel({
      ...body,
      productId: body.id || `product-${Date.now()}`
    });
    await doc.save();
    return NextResponse.json({ success: true, product: doc });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
