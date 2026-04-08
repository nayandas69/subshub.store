/**
 * /api/admin/check — Route Handler
 * GET → returns whether the current request has a valid admin session
 */
import { isAdmin } from "@/lib/admin-auth";

export async function GET() {
  const auth = await isAdmin();
  if (auth) {
    return Response.json({ status: "authenticated" });
  }
  return Response.json({ status: "unauthenticated" }, { status: 401 });
}
