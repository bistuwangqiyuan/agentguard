import { DashboardClient } from "@/components/DashboardClient";
import { getSessionUser } from "@/lib/auth";
import { billingReady } from "@/lib/paddle";
import { getUsage, listKeysForUser, storageMode } from "@/lib/store";

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
      subscriptionStatus: user.subscriptionStatus,
      cancelAtPeriodEnd: user.cancelAtPeriodEnd,
      usage,
      keys: keys.map((k) => ({
        id: k.id,
        prefix: k.keyPrefix,
        name: k.name,
        createdAt: k.createdAt,
      })),
    };
  }

  return (
    <DashboardClient
      initial={initial}
      billingReady={billingReady()}
      storageMode={storageMode()}
    />
  );
}
