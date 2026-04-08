import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import BadgeModel from "@/models/Badge";
import { isAdmin } from "@/lib/admin-auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    await connectToDatabase();
    await BadgeModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
