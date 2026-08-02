import { DashboardClient } from "@/components/DashboardClient";
import { getSessionUser } from "@/lib/auth";
import { checkoutUrl, lemonConfigured } from "@/lib/lemon";
import { getUsage, listKeysForUser } from "@/lib/store";
import type { PlanId } from "@/lib/plans";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await getSessionUser();
  let initial = null;
  if (user) {
    const usage = await getUsage(user.id);
    const keys = await listKeysForUser(user.id);
    initial = {
      email: user.email,
      plan: user.plan,
      monthlyQuota: user.monthlyQuota,
      usage,
      keys: keys.map((k) => ({
        id: k.id,
        prefix: k.keyPrefix,
        name: k.name,
        createdAt: k.createdAt,
      })),
    };
  }

  const checkout: Partial<Record<PlanId, string | null>> = {};
  if (user) {
    for (const p of ["builder", "pro", "scale"] as PlanId[]) {
      checkout[p] = checkoutUrl(p, user.email);
    }
  }

  return (
    <DashboardClient
      initial={initial}
      checkout={checkout}
      billingReady={lemonConfigured()}
    />
  );
}
