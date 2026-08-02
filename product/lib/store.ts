/**
 * Dual-mode persistence:
 * - In-memory (default): works on Vercel for demo / first deploy without DB.
 * - Supabase REST (when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY set).
 *
 * Honest caveat: memory store is per-instance and resets on cold start.
 * Use Supabase for production traffic (see supabase/schema.sql).
 */
import { PLANS, type PlanId } from "./plans";
import { generateApiKey, sha256 } from "./crypto";

export type User = {
  id: string;
  email: string;
  plan: PlanId;
  monthlyQuota: number;
  lemonSubscriptionId?: string | null;
  lemonCustomerId?: string | null;
  createdAt: string;
};

export type ApiKeyRow = {
  id: string;
  userId: string;
  keyHash: string;
  keyPrefix: string;
  name: string;
  revokedAt?: string | null;
  createdAt: string;
};

type MemoryDb = {
  users: Map<string, User>;
  usersByEmail: Map<string, string>;
  keys: Map<string, ApiKeyRow>;
  keysByHash: Map<string, string>;
  usage: Map<string, number>; // `${userId}:${YYYY-MM}`
  webhooks: Set<string>;
};

declare global {
  var __agentguard_db: MemoryDb | undefined;
}

function mem(): MemoryDb {
  if (!globalThis.__agentguard_db) {
    globalThis.__agentguard_db = {
      users: new Map(),
      usersByEmail: new Map(),
      keys: new Map(),
      keysByHash: new Map(),
      usage: new Map(),
      webhooks: new Set(),
    };
  }
  return globalThis.__agentguard_db;
}

function uid(): string {
  return crypto.randomUUID();
}

function periodNow(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function supabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function sb<T>(
  path: string,
  init?: RequestInit & { prefer?: string }
): Promise<{ data: T | null; error?: string; status: number }> {
  const url = `${process.env.SUPABASE_URL}/rest/v1/${path}`;
  const headers: Record<string, string> = {
    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
    "Content-Type": "application/json",
  };
  if (init?.prefer) headers.Prefer = init.prefer;
  const res = await fetch(url, { ...init, headers: { ...headers, ...(init?.headers || {}) } });
  const text = await res.text();
  let data: T | null = null;
  if (text) {
    try {
      data = JSON.parse(text) as T;
    } catch {
      data = null;
    }
  }
  if (!res.ok) {
    return { data: null, error: text || res.statusText, status: res.status };
  }
  return { data, status: res.status };
}

export function storageMode(): "memory" | "supabase" {
  return supabaseConfigured() ? "supabase" : "memory";
}

export async function getOrCreateUserByEmail(email: string): Promise<{
  user: User;
  created: boolean;
  apiKeyPlain?: string;
}> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !normalized.includes("@")) {
    throw new Error("Invalid email");
  }

  if (!supabaseConfigured()) {
    const db = mem();
    const existingId = db.usersByEmail.get(normalized);
    if (existingId) {
      return { user: db.users.get(existingId)!, created: false };
    }
    const user: User = {
      id: uid(),
      email: normalized,
      plan: "free",
      monthlyQuota: PLANS.free.monthlyQuota,
      createdAt: new Date().toISOString(),
    };
    db.users.set(user.id, user);
    db.usersByEmail.set(normalized, user.id);
    const { raw, hash, prefix } = generateApiKey();
    const key: ApiKeyRow = {
      id: uid(),
      userId: user.id,
      keyHash: hash,
      keyPrefix: prefix,
      name: "default",
      createdAt: new Date().toISOString(),
    };
    db.keys.set(key.id, key);
    db.keysByHash.set(hash, key.id);
    return { user, created: true, apiKeyPlain: raw };
  }

  const found = await sb<Array<Record<string, unknown>>>(
    `users?email=eq.${encodeURIComponent(normalized)}&select=*`
  );
  if (found.data && found.data.length) {
    return { user: mapUser(found.data[0]), created: false };
  }
  const created = await sb<Array<Record<string, unknown>>>("users", {
    method: "POST",
    prefer: "return=representation",
    body: JSON.stringify({
      email: normalized,
      plan: "free",
      monthly_quota: PLANS.free.monthlyQuota,
    }),
  });
  if (!created.data?.[0]) throw new Error(created.error || "Failed to create user");
  const user = mapUser(created.data[0]);
  const { raw, hash, prefix } = generateApiKey();
  await sb("api_keys", {
    method: "POST",
    body: JSON.stringify({
      user_id: user.id,
      key_hash: hash,
      key_prefix: prefix,
      name: "default",
    }),
  });
  return { user, created: true, apiKeyPlain: raw };
}

function mapUser(row: Record<string, unknown>): User {
  return {
    id: String(row.id),
    email: String(row.email),
    plan: (row.plan as PlanId) || "free",
    monthlyQuota: Number(row.monthly_quota ?? row.monthlyQuota ?? 300),
    lemonSubscriptionId: (row.lemon_subscription_id as string) || null,
    lemonCustomerId: (row.lemon_customer_id as string) || null,
    createdAt: String(row.created_at || row.createdAt || new Date().toISOString()),
  };
}

export async function getUserById(id: string): Promise<User | null> {
  if (!supabaseConfigured()) {
    return mem().users.get(id) || null;
  }
  const r = await sb<Array<Record<string, unknown>>>(`users?id=eq.${id}&select=*`);
  return r.data?.[0] ? mapUser(r.data[0]) : null;
}

export async function listKeysForUser(userId: string): Promise<ApiKeyRow[]> {
  if (!supabaseConfigured()) {
    return [...mem().keys.values()].filter((k) => k.userId === userId && !k.revokedAt);
  }
  const r = await sb<Array<Record<string, unknown>>>(
    `api_keys?user_id=eq.${userId}&revoked_at=is.null&select=*`
  );
  return (r.data || []).map((row) => ({
    id: String(row.id),
    userId: String(row.user_id),
    keyHash: String(row.key_hash),
    keyPrefix: String(row.key_prefix),
    name: String(row.name || "default"),
    revokedAt: (row.revoked_at as string) || null,
    createdAt: String(row.created_at),
  }));
}

export async function rotateKey(userId: string): Promise<string> {
  if (!supabaseConfigured()) {
    const db = mem();
    for (const k of db.keys.values()) {
      if (k.userId === userId && !k.revokedAt) {
        k.revokedAt = new Date().toISOString();
        db.keysByHash.delete(k.keyHash);
      }
    }
    const { raw, hash, prefix } = generateApiKey();
    const key: ApiKeyRow = {
      id: uid(),
      userId,
      keyHash: hash,
      keyPrefix: prefix,
      name: "default",
      createdAt: new Date().toISOString(),
    };
    db.keys.set(key.id, key);
    db.keysByHash.set(hash, key.id);
    return raw;
  }
  await sb(`api_keys?user_id=eq.${userId}&revoked_at=is.null`, {
    method: "PATCH",
    body: JSON.stringify({ revoked_at: new Date().toISOString() }),
  });
  const { raw, hash, prefix } = generateApiKey();
  await sb("api_keys", {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      key_hash: hash,
      key_prefix: prefix,
      name: "default",
    }),
  });
  return raw;
}

export async function resolveApiKey(
  rawKey: string
): Promise<{ user: User; key: ApiKeyRow } | null> {
  const hash = sha256(rawKey);
  if (!supabaseConfigured()) {
    const db = mem();
    const kid = db.keysByHash.get(hash);
    if (!kid) return null;
    const key = db.keys.get(kid)!;
    if (key.revokedAt) return null;
    const user = db.users.get(key.userId);
    if (!user) return null;
    return { user, key };
  }
  const r = await sb<Array<Record<string, unknown>>>(
    `api_keys?key_hash=eq.${hash}&revoked_at=is.null&select=*`
  );
  const row = r.data?.[0];
  if (!row) return null;
  const user = await getUserById(String(row.user_id));
  if (!user) return null;
  return {
    user,
    key: {
      id: String(row.id),
      userId: String(row.user_id),
      keyHash: String(row.key_hash),
      keyPrefix: String(row.key_prefix),
      name: String(row.name || "default"),
      createdAt: String(row.created_at),
    },
  };
}

export async function getUsage(userId: string): Promise<{ period: string; calls: number }> {
  const period = periodNow();
  if (!supabaseConfigured()) {
    return { period, calls: mem().usage.get(`${userId}:${period}`) || 0 };
  }
  const r = await sb<Array<{ calls: number }>>(
    `usage_monthly?user_id=eq.${userId}&period=eq.${period}&select=calls`
  );
  return { period, calls: r.data?.[0]?.calls || 0 };
}

export async function incrementUsage(
  userId: string,
  n = 1
): Promise<{ period: string; calls: number; remaining: number; quota: number }> {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");
  const period = periodNow();
  if (!supabaseConfigured()) {
    const db = mem();
    const k = `${userId}:${period}`;
    const next = (db.usage.get(k) || 0) + n;
    db.usage.set(k, next);
    return {
      period,
      calls: next,
      remaining: Math.max(0, user.monthlyQuota - next),
      quota: user.monthlyQuota,
    };
  }
  const current = await getUsage(userId);
  const next = current.calls + n;
  await sb("usage_monthly", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=minimal",
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({ user_id: userId, period, calls: next }),
  });
  // upsert via PATCH if exists
  if (current.calls > 0) {
    await sb(`usage_monthly?user_id=eq.${userId}&period=eq.${period}`, {
      method: "PATCH",
      body: JSON.stringify({ calls: next }),
    });
  }
  return {
    period,
    calls: next,
    remaining: Math.max(0, user.monthlyQuota - next),
    quota: user.monthlyQuota,
  };
}

export async function setUserPlan(
  userId: string,
  plan: PlanId,
  lemon?: { subscriptionId?: string; customerId?: string }
): Promise<User> {
  const quota = PLANS[plan].monthlyQuota;
  if (!supabaseConfigured()) {
    const user = mem().users.get(userId);
    if (!user) throw new Error("User not found");
    user.plan = plan;
    user.monthlyQuota = quota;
    if (lemon?.subscriptionId !== undefined) user.lemonSubscriptionId = lemon.subscriptionId;
    if (lemon?.customerId !== undefined) user.lemonCustomerId = lemon.customerId;
    return user;
  }
  await sb(`users?id=eq.${userId}`, {
    method: "PATCH",
    prefer: "return=representation",
    body: JSON.stringify({
      plan,
      monthly_quota: quota,
      lemon_subscription_id: lemon?.subscriptionId ?? undefined,
      lemon_customer_id: lemon?.customerId ?? undefined,
    }),
  });
  const u = await getUserById(userId);
  if (!u) throw new Error("User not found");
  return u;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const normalized = email.trim().toLowerCase();
  if (!supabaseConfigured()) {
    const id = mem().usersByEmail.get(normalized);
    return id ? mem().users.get(id)! : null;
  }
  const r = await sb<Array<Record<string, unknown>>>(
    `users?email=eq.${encodeURIComponent(normalized)}&select=*`
  );
  return r.data?.[0] ? mapUser(r.data[0]) : null;
}

export async function findUserByLemonSubscription(subId: string): Promise<User | null> {
  if (!supabaseConfigured()) {
    for (const u of mem().users.values()) {
      if (u.lemonSubscriptionId === subId) return u;
    }
    return null;
  }
  const r = await sb<Array<Record<string, unknown>>>(
    `users?lemon_subscription_id=eq.${encodeURIComponent(subId)}&select=*`
  );
  return r.data?.[0] ? mapUser(r.data[0]) : null;
}

export async function claimWebhookEvent(eventId: string, eventName: string): Promise<boolean> {
  if (!eventId) return false;
  if (!supabaseConfigured()) {
    const db = mem();
    if (db.webhooks.has(eventId)) return false;
    db.webhooks.add(eventId);
    return true;
  }
  const r = await sb("webhook_events", {
    method: "POST",
    body: JSON.stringify({ event_id: eventId, event_name: eventName }),
  });
  if (r.status === 409 || (r.error && r.error.includes("duplicate"))) return false;
  return r.status >= 200 && r.status < 300;
}
