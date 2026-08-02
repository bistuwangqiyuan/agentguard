import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function generateApiKey(): { raw: string; hash: string; prefix: string } {
  const raw = `ag_live_${randomBytes(24).toString("base64url")}`;
  return { raw, hash: sha256(raw), prefix: raw.slice(0, 12) };
}

export function sessionSecret(): string {
  return process.env.SESSION_SECRET || "dev-only-insecure-session-secret";
}

export function signSession(payload: object, maxAgeSec = 60 * 60 * 24 * 30): string {
  const body = Buffer.from(
    JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + maxAgeSec })
  ).toString("base64url");
  const sig = createHmac("sha256", sessionSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifySession<T extends Record<string, unknown>>(token: string): T | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expect = createHmac("sha256", sessionSecret()).update(body).digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expect);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T & {
    exp?: number;
  };
  if (data.exp && data.exp < Math.floor(Date.now() / 1000)) return null;
  return data;
}

export function hmacSha256Hex(secret: string, rawBody: string): string {
  return createHmac("sha256", secret).update(rawBody).digest("hex");
}

export function safeEqualHex(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}
