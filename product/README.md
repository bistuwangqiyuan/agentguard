# AgentGuard

Agent output guardrail API: **JSON Schema · PII · prompt-injection** checks.  
Global billing via **Paddle** (Merchant of Record) + Payoneer-friendly for CN individual sellers.

**Production:** https://agentguard-swart.vercel.app  
**Health:** https://agentguard-swart.vercel.app/api/health

## Honest status

| Piece | Status |
|---|---|
| Free API + Dashboard | Live |
| Paddle software path | Implemented (checkout · webhook · portal · refund form) |
| Paid live checkout | Requires your Paddle KYC + Supabase + env (see ops checklist) |
| Memory store | Demo only — **not** for paid entitlements |

Mainland China is **not** on Lemon Squeezy bank payout lists — we use **Paddle**, not LS.

## Local

```bash
cd product
npm install
cp .env.example .env.local
npm run dev
npm test
```

## Env (production)

See `.env.example`. Paid path needs:

- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (+ run `supabase/schema.sql`)
- `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`, `PADDLE_API_KEY`, `PADDLE_WEBHOOK_SECRET`
- `PADDLE_PRICE_BUILDER` / `PRO` / `SCALE`
- `NEXT_PUBLIC_PADDLE_ENV=sandbox` then `production`

Webhook URL: `https://<domain>/api/webhooks/paddle`

## Operator onboarding

Copy `../ops/paddle-onboarding.example.md` → `../ops/paddle-onboarding.local.md` (gitignored) and complete S2–S4 steps.

## Acceptance criteria

1. Free key works without Paddle.
2. With sandbox env + Supabase: Dashboard → Paddle overlay → webhook upgrades plan/quota.
3. Portal / refund form reachable; refunds executed in Paddle dashboard.
4. Live mode only after store activation + Vercel Pro for commercial traffic.
