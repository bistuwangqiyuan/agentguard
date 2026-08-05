import { NextResponse } from "next/server";
import { bearerFromRequest, getSessionUser } from "@/lib/auth";
import { getUsage, listKeysForUser, resolveApiKey } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const key = bearerFromRequest(req);
  let user = null as Awaited<ReturnType<typeof getSessionUser>>;
  if (key) {
    const auth = await resolveApiKey(key);
    user = auth?.user || null;
  } else {
    user = await getSessionUser();
  }
  if (!user) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Sign in or provide API key" } },
      { status: 401 }
    );
  }
  const usage = await getUsage(user.id);
  const keys = await listKeysForUser(user.id);
  return NextResponse.json({
    email: user.email,
    plan: user.plan,
    monthlyQuota: user.monthlyQuota,
    subscriptionStatus: user.subscriptionStatus,
    cancelAtPeriodEnd: user.cancelAtPeriodEnd,
    usage,
    keys: keys.map((k) => ({
      id: k.id,
      prefix: k.keyPrefix,
      name: k.name,
      createdAt: k.createdAt,
    })),
  });
}
