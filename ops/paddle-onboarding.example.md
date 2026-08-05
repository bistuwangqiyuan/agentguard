# Paddle onboarding checklist (copy to paddle-onboarding.local.md — gitignored)

Do **not** commit the `.local.md` file. It may contain personal details.

## Your seller profile (fill locally)

- Legal name: Wang Qiyuan / 王启源
- Country: China (PRC)
- City / district: Beijing · Haidian
- Postal code: 100192
- Product: AgentGuard — developer API (text analytics / compliance assist for AI agents)
- Site: https://agentguard-swart.vercel.app
- Category keywords for questionnaire: SaaS, developer tools, API, text analysis, security utilities (NOT image/voice generation)

## S2 steps (you in browser)

1. Create Payoneer account (recommended payout rail for CN individuals).
2. Sign up at https://www.paddle.com → Seller account.
3. Complete business questionnaire honestly (solo SaaS / global English B2B developers).
4. KYC: government ID + address verification (Haidian / 100192).
5. Tax: non-US person form (W-8) in Paddle payout settings.
6. Bind Payoneer (or wire details Payoneer provides) in Transfer Preferences.
7. Create three **subscription** products/prices (USD monthly):
   - Builder $29 → copy `pri_…` → `PADDLE_PRICE_BUILDER`
   - Pro $79 → `PADDLE_PRICE_PRO`
   - Scale $199 → `PADDLE_PRICE_SCALE`
8. Developer tools → create Client-side token (`NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`) and API key (`PADDLE_API_KEY`).
9. Notifications → destination URL:
   `https://agentguard-swart.vercel.app/api/webhooks/paddle`
   Subscribe: `subscription.created`, `subscription.updated`, `subscription.canceled`,
   `subscription.past_due`, `subscription.activated`, `transaction.completed` (and resumed if listed).
   Copy secret → `PADDLE_WEBHOOK_SECRET`.
10. Create Supabase project → run `product/supabase/schema.sql` → set `SUPABASE_*` on Vercel.
11. Set all env on Vercel Production → redeploy.
12. Sandbox test card checkout from Dashboard → confirm plan/quota via webhook.

## China compliance (operator)

- Declare overseas income in annual IIT reconciliation.
- Keep Paddle invoices / payout statements for forex documentation.
- Do not market in CNY / mainland-only channels; product remains English global SaaS.

## Exit if rejected

If Paddle rejects the store: ask for reason in writing; consider HK entity later — do not use prohibited categories.
