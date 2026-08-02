import { cookies } from "next/headers";
import { signSession, verifySession } from "./crypto";
import { getUserById, type User } from "./store";

const COOKIE = "ag_session";

export async function setSessionCookie(userId: string) {
  const token = signSession({ uid: userId });
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSessionUser(): Promise<User | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const data = verifySession<{ uid?: string }>(token);
  if (!data?.uid || typeof data.uid !== "string") return null;
  return getUserById(data.uid);
}

export function bearerFromRequest(req: Request): string | null {
  const h = req.headers.get("authorization") || "";
  const m = /^Bearer\s+(.+)$/i.exec(h);
  if (m) return m[1].trim();
  const alt = req.headers.get("x-api-key");
  return alt?.trim() || null;
}
