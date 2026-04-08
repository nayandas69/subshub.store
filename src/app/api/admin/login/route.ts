import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/admin-auth";
import { connectToDatabase } from "@/lib/db";
import AdminModel from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Fallback environment admin check
    const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL;
    const defaultPass = process.env.DEFAULT_ADMIN_PASSWORD;

    await connectToDatabase();
    
    // Seed default admin if missing in db
    let admin = await AdminModel.findOne({ email });
    
    if (!admin && email === defaultEmail && defaultPass) {
      // Auto-create the default admin
      const hash = await bcrypt.hash(defaultPass, 10);
      admin = new AdminModel({ email, passwordHash: hash, role: "admin" });
      await admin.save();
    }

    if (!admin) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    // Verify Password
    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    // Assign JWT
    await createAdminSession();
    return NextResponse.json({ success: true });
    
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
