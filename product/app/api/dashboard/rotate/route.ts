import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { rotateKey } from "@/lib/store";

export const runtime = "nodejs";

export async function POST() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const apiKey = await rotateKey(user.id);
  return NextResponse.json({
    apiKey,
    note: "Previous keys revoked. Save this key now.",
  });
}
