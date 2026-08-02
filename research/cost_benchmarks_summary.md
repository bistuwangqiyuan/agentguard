The full report is saved at `research/2026-solo-ai-saas-cost-benchmarks.md`. Highlights:

## 1. LLM APIs (per 1M tokens, in/out) — cheapest for high-volume automation in bold
- **DeepSeek V4 Flash: $0.14 / $0.28 (cache-hit input $0.0028)** — [api-docs.deepseek.com](https://api-docs.deepseek.com/quick_start/pricing)
- **OpenAI gpt-5.4-nano $0.20/$1.25**, gpt-5.4-mini $0.75/$4.50; GPT-5.4 $2.50/$15; GPT-5.5 flagship $5/$30 — [openai.com/api/pricing](https://openai.com/api/pricing/)
- **Gemini 3.1 Flash-Lite $0.25/$1.50**; Gemini 3 Flash $0.50/$3; Gemini 3.5 Flash $1.50/$9 — [ai.google.dev](https://ai.google.dev/gemini-api/docs/pricing)
- Claude Haiku 4.5 $1/$5; Sonnet 4.6 $3/$15; Opus 4.8 $5/$25 — [finout.io](https://www.finout.io/blog/anthropic-api-pricing)
- Batch APIs = 50% off everywhere; prompt caching ≈ 90% off input. A 100K-msg/mo chatbot: ~$17.50 on DeepSeek vs ~$200 on Haiku vs ~$600 on Sonnet.

## 2. Images
FLUX 1.1 Pro **$0.04/image** (BFL/fal/Replicate); SDXL $0.003–0.005; OpenAI GPT Image 2 $0.005–0.211 (DALL·E was removed from the API May 12, 2026).

## 3. Infra
Months 1–6 can be ~$0: Cloudflare Workers free (100K req/day, commercial OK; paid $5/mo) + Supabase free (pauses after 1 wk idle; Pro $25) + R2 free 10GB/zero egress. Vercel Pro $20/mo (Hobby bans commercial use); Railway $5/mo net-zero; Hetzner from €3.49/mo.

## 4. Payments / MoR
- **Yes, Stripe acquired Lemon Squeezy (July 2024); in 2026 LS still operates** at 5% + $0.50, and Stripe launched its own MoR "Managed Payments" (in the API since 2026-04-22, effective ~6.4%+$0.30 — flagged estimate).
- Paddle: 5% + $0.50, **no monthly fee or minimum** ([paddle.com/pricing](https://www.paddle.com/pricing)); MoRs fully handle US sales tax + EU VAT.
- Stripe direct: 2.9%+30¢ (+1.5% intl, +1% FX) + Stripe Tax 0.5%/txn — but you file taxes yourself.

## 5–6. Email & tools
Resend free 3K/mo → $20/50K; Postmark $15/10K; Loops $49/mo with free transactional. Domain $10.46–11/yr (Cloudflare/Porkbun); Google Workspace $7/user; PostHog free 1M events; Sentry dev free; commercial-use-free uptime monitors exist (UptimeRobot free tier doesn't allow it); Chatbase $32/mo / DocsBot $49/mo, DIY chatbot ≈ $1–5/mo.

## 7. Company (Chinese solo founder)
- **Selling as an individual via Paddle/Lemon Squeezy is allowed in 2026** — $0 setup, MoR is the legal seller; you declare personal income in China.
- Stripe Atlas Delaware LLC: $500 one-time; ~$450–900/yr after (franchise tax $300 + agent $100 + mandatory Form 5472, $25K penalty if missed).
- HK Ltd: ~$900–1,900 year 1, ~$2,000–4,300/yr ongoing (mandatory audit even at 0% offshore tax).

## 8. Benchmarks (ChartMogul 2026, 200 products + others)
Freemium→paid median 5.5% (good 3–5%); opt-in trial ~8–9%; CC-required trial ~30%; visitor→signup 4.5–9%; SMB monthly churn 2–8%; chargebacks 0.5–1.0% norm (digital goods avg 0.54%, Visa VAMP limit 1.5%). AI-tool refund rates: no authoritative source — flagged as estimate (~5–15%, plan ~10%). SEO-driven CAC ≈ $0 marginal (flagged as inference).

## Burn estimate
- **One-time: ~$11** (domain only, individual + MoR) or ~$520–620 with a US LLC.
- **Fixed monthly burn months 1–6: ~$31 → $133** (≈$360 total), dominated by the LLM testing budget; MoR's 5%+$0.50 comes out of revenue, not fixed burn. All composite numbers are flagged as estimates built from the sourced unit prices.