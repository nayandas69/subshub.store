import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import SettingsModel from "@/models/Settings";
import { isAdmin } from "@/lib/admin-auth";

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await SettingsModel.findOne().lean();
    if (!settings) {
      const doc = new SettingsModel();
      await doc.save();
      settings = doc.toObject();
    }
    return NextResponse.json({
      flashSaleEnabled: settings.flashSaleEnabled,
      flashSaleEndTime: settings.flashSaleEndTime,
      currency: settings.currency || "$",
      popupEnabled: !!settings.popupEnabled,
      popupText: settings.popupText || "",
      popupDelay: settings.popupDelay || 5
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    let settings = await SettingsModel.findOne();
    if (!settings) settings = new SettingsModel();
    
    if (body.flashSaleEnabled !== undefined) settings.flashSaleEnabled = body.flashSaleEnabled;
    if (body.flashSaleEndTime !== undefined) settings.flashSaleEndTime = body.flashSaleEndTime;
    if (body.currency !== undefined) settings.currency = body.currency;
    if (body.popupEnabled !== undefined) settings.popupEnabled = body.popupEnabled;
    if (body.popupText !== undefined) settings.popupText = body.popupText;
    if (body.popupDelay !== undefined) settings.popupDelay = body.popupDelay;
    
    await settings.save();
    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
