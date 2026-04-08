import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

export const ADMIN_COOKIE = "admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET ?? "premiumstore-secret-2024";

export async function createAdminSession() {
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(new TextEncoder().encode(SESSION_SECRET));

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function verifyAdminSession(token: string | undefined): Promise<boolean> {
  if (!token || !SESSION_SECRET) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(SESSION_SECRET));
    return payload.admin === true;
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return await verifyAdminSession(token);
}
