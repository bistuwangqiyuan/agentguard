# 2026 Cost Benchmarks: Fully-Automated Solo AI SaaS (Global Market)

> Research date: June 11, 2026. All prices in USD unless noted. Every number carries a source URL. Items marked **[ESTIMATE]** could not be fully verified against a primary source.

---

## 1. LLM API Pricing (per 1M tokens, input / output)

| Provider | Model | Input | Output | Cached input | Notes | Source |
|---|---|---|---|---|---|---|
| OpenAI | GPT-5.5 (flagship) | $5.00 | $30.00 | $0.50 | >272K input tokens → 2x in / 1.5x out | [openai.com/api/pricing](https://openai.com/api/pricing/) |
| OpenAI | GPT-5.4 (prev. flagship) | $2.50 | $15.00 | $0.25 | Often best cost/quality for production | [finout.io](https://www.finout.io/blog/openai-pricing-in-2026) |
| OpenAI | gpt-5.4-mini | $0.75 | $4.50 | $0.075 | "gpt-4o-mini class" workhorse | [finout.io](https://www.finout.io/blog/openai-pricing-in-2026) |
| OpenAI | gpt-5.4-nano | $0.20 | $1.25 | $0.02 | Ultra-budget, simple high-volume tasks | [finout.io](https://www.finout.io/blog/openai-pricing-in-2026) |
| Anthropic | Claude Opus 4.8 | $5.00 | $25.00 | $0.50 (read) | Flagship, 1M context flat rate | [finout.io/anthropic](https://www.finout.io/blog/anthropic-api-pricing) |
| Anthropic | Claude Sonnet 4.6 | $3.00 | $15.00 | $0.30 (read) | Production default, 1M context | [cloudzero.com](https://www.cloudzero.com/blog/claude-api-pricing/) |
| Anthropic | Claude Haiku 4.5 | $1.00 | $5.00 | $0.10 (read) | Cheapest current-gen Claude, 200K context | [cloudzero.com](https://www.cloudzero.com/blog/claude-api-pricing/) |
| Google | Gemini 3.5 Flash | $1.50 | $9.00 | $0.15 | 1M context flat; Batch/Flex = 50% off | [ai.google.dev/gemini-api/docs/pricing](https://ai.google.dev/gemini-api/docs/pricing) |
| Google | Gemini 3 Flash | $0.50 | $3.00 | $0.05 | Previous Flash, very cheap | [tokencost.app](https://tokencost.app/blog/gemini-3-5-flash-pricing) |
| Google | Gemini 3.1 Flash-Lite | $0.25 | $1.50 | $0.025 | Cheapest Google option | [tokencost.app](https://tokencost.app/blog/gemini-3-5-flash-pricing) |
| DeepSeek | V4 Flash | $0.14 | $0.28 | $0.0028 | 1M context; cheapest serious frontier API | [api-docs.deepseek.com](https://api-docs.deepseek.com/quick_start/pricing) |
| DeepSeek | V4 Pro | $0.435 | $0.87 | $0.0036 | Harder reasoning/coding tasks | [api-docs.deepseek.com](https://api-docs.deepseek.com/quick_start/pricing) |
| xAI | Grok 4.3 | $1.25 | $2.50 | — | 1M context flat **[ESTIMATE — secondary source only]** | [tokencost.app](https://tokencost.app/blog/gemini-3-5-flash-pricing) |

**Discount levers (all major providers):** Batch APIs = 50% off (OpenAI, Anthropic, Google); prompt caching = ~90% off cached input (Anthropic cache read 10% of base; Gemini Flash $0.15; OpenAI cached $0.50 on GPT-5.5). Free tier: Gemini API has a genuinely free tier (rate-limited, data used for training); DeepSeek has no permanent free tier ([aipricing.guru](https://www.aipricing.guru/deepseek-pricing/)).

**Cheapest for high-volume automated workloads (ranked):**
1. **DeepSeek V4 Flash** — $0.14/$0.28, and $0.0028 cache-hit input makes repeated-prompt agent workloads near-free. Roughly 35x cheaper than GPT-5.5 on input, 100x on output.
2. **OpenAI gpt-5.4-nano** ($0.20/$1.25) — best US-provider floor.
3. **Gemini 3.1 Flash-Lite** ($0.25/$1.50) and **Gemini 3 Flash** ($0.50/$3.00).
4. **Claude Haiku 4.5** ($1/$5) — cheapest current-gen Claude with batch at $0.50/$2.50.

A 100K-message/month chatbot (1K tokens/msg, 75/25 in/out) costs roughly: ~$200 on Haiku 4.5, ~$600 on Sonnet 4.6 ([nicolalazzari.ai](https://nicolalazzari.ai/articles/claude-api-pricing-breakdown-2026)); the same workload on DeepSeek V4 Flash is ~$17.50 **[ESTIMATE — computed from list prices]**.

---

## 2. Image Generation API Costs (per image)

| Model / route | Cost per image | Source |
|---|---|---|
| FLUX 1.1 Pro (BFL direct, fal.ai, Replicate, SiliconFlow) | $0.04 | [inferencehub.org](https://inferencehub.org/models/flux-1-1-pro), [costbench.com](https://costbench.com/software/ai-image-generators/flux/) |
| FLUX.1 Pro | $0.05 (fal.ai) – $0.055 (Replicate) | [dev.to/techsifted](https://dev.to/techsifted/flux-ai-pricing-2026-api-costs-hosted-platform-rates-and-free-options-1ol1) |
| FLUX 1.1 Pro Ultra | $0.06 | [costbench.com](https://costbench.com/software/ai-image-generators/flux/) |
| FLUX dev (hosted) | ~$0.02–0.03 | [dev.to/techsifted](https://dev.to/techsifted/flux-ai-pricing-2026-api-costs-hosted-platform-rates-and-free-options-1ol1) |
| FLUX schnell (hosted) | ~$0.003–0.005 | [dev.to/techsifted](https://dev.to/techsifted/flux-ai-pricing-2026-api-costs-hosted-platform-rates-and-free-options-1ol1) |
| Stable Diffusion XL | $0.003 (fal.ai) / $0.005 (Replicate) | [teamday.ai](https://www.teamday.ai/blog/fal-ai-vs-replicate-comparison) |
| OpenAI GPT Image 2 (current flagship) | $0.005–$0.211 (by quality/resolution) | [costgoat.com/pricing/openai-images](https://costgoat.com/pricing/openai-images) |
| OpenAI GPT Image 1 Mini | $0.005 (low) / $0.011 (med) / $0.036 (high) at 1024² | [intuitionlabs.ai](https://intuitionlabs.ai/articles/ai-image-generation-pricing-google-openai) |
| OpenAI GPT Image 1 (deprecating Oct 23, 2026) | $0.011 / $0.042 / $0.167 at 1024² | [developers.openai.com](https://developers.openai.com/api/docs/models/gpt-image-1) |

Note: **DALL·E 2 and DALL·E 3 were removed from the OpenAI API on May 12, 2026** — new builds must use the GPT Image lineup ([costgoat.com](https://costgoat.com/pricing/openai-images)). Budget pick for automated pipelines: SDXL ($0.003) or FLUX schnell for bulk, FLUX 1.1 Pro ($0.04) for hero/marketing images.

---

## 3. Infrastructure

| Service | Free tier | Paid | Source |
|---|---|---|---|
| **Vercel** | Hobby: free, non-commercial use, hard usage caps | Pro: $20/user/mo, includes $20 usage credit; 1M function invocations, 10M edge requests, 1TB transfer included, then PAYG | [vercel.com/pricing](https://vercel.com/pricing), [vercel.com/docs/limits](https://vercel.com/docs/limits) |
| **Supabase** | 500MB DB, 50K MAU, 1GB storage, 5GB egress; max 2 projects; **pauses after 1 week inactivity** | Pro: $25/mo/project — 8GB disk, 100K MAU, 100GB storage, 250GB egress, daily backups, $10 compute credit | [uibakery.io](https://uibakery.io/blog/supabase-pricing), [srvrlss.io](https://www.srvrlss.io/provider/supabase/) |
| **Cloudflare Workers** | 100K req/day, 10ms CPU/invocation | Paid: $5/mo min — 10M req + 30M CPU-ms included, then $0.30/M req | [developers.cloudflare.com/workers/platform/pricing](https://developers.cloudflare.com/workers/platform/pricing/) |
| **Cloudflare R2** | 10GB storage, 1M Class A + 10M Class B ops/mo; **egress always free** | $0.015/GB-mo standard; Class A $4.50/M, Class B $0.36/M | [developers.cloudflare.com/r2/pricing](https://developers.cloudflare.com/r2/pricing/) |
| **Cloudflare Pages** | Free static hosting (Functions billed as Workers) | included in Workers plans | [cloudflare.com/plans/developer-platform-pricing](https://www.cloudflare.com/en-gb/plans/developer-platform-pricing/) |
| **Railway** | $5 one-time trial credit only (no permanent free tier) | Hobby: $5/mo including $5 usage credit (net ~$0 for small apps); Pro $20/mo | [birjob.com PaaS comparison](https://www.birjob.com/blog/paas-comparison-railway-render-fly-vercel-2026) |
| **Fly.io** | No permanent free tier; $5 trial credit | PAYG; minimal Postgres ~$2.09/mo; dedicated IPv4 ~$3.65/mo; egress $0.02/GB (NA/EU) | [jakeinsight.com](https://jakeinsight.com/tech/2026-03-27-flyio-free-tier-vs-railway-free-tier-hobby-project/), [birjob.com](https://www.birjob.com/blog/paas-comparison-railway-render-fly-vercel-2026) |
| **Hetzner VPS** | None | CX23 from €3.49/mo (~$4–5) in DE/FI, 20TB traffic; prices rose 30–37% April 2026; US locations €4.99+ | [hetzner.com/cloud/cost-optimized](https://www.hetzner.com/cloud/cost-optimized), [costgoat.com/pricing/hetzner](https://costgoat.com/pricing/hetzner) |

**Practical takeaway:** A solo AI SaaS can run months 1–6 at ~$0–5/mo infra: Cloudflare Pages/Workers free + Supabase free + R2 free. Caveat: Vercel Hobby prohibits commercial use — use Cloudflare free tier (commercial use allowed) or pay Vercel Pro $20/mo once revenue starts.

---

## 4. Merchant of Record (MoR) & Payments

| Provider | Fee (2026) | Monthly minimum | Tax handling | Source |
|---|---|---|---|---|
| **Paddle** (Essentials) | 5% + $0.50/txn | **None** — no monthly fee, no revenue minimum; custom (3.5–4.5%) above ~$50K/mo | Full MoR: collects & remits US sales tax, EU VAT, GST in 200+ markets | [paddle.com/pricing](https://www.paddle.com/pricing), [vendr.com](https://www.vendr.com/marketplace/paddle) |
| **Lemon Squeezy** | 5% + $0.50/txn (+~1.5–2% international cards **[ESTIMATE — secondary sources conflict]**) | None | Full MoR | [delivvo.io](https://delivvo.io/blog/polar-vs-lemonsqueezy-vs-paddle-merchant-of-record-2026), [appstackbuilder.com](https://appstackbuilder.com/blog/stripe-vs-lemon-squeezy-vs-paddle) |
| **Stripe Managed Payments** (Stripe's own MoR, launched in API 2026-04-22) | ~3.5% surcharge on top of standard processing → effective ~6.4% + $0.30 **[ESTIMATE — derived by secondary sources]** | None | Full MoR, tax in 75–80+ countries | [docs.stripe.com changelog](https://docs.stripe.com/changelog/dahlia/2026-04-22/managed-payments), [fungies.io](https://fungies.io/lemon-squeezy-stripe-acquisition-saas-founders-2026/) |
| **Stripe direct** | 2.9% + 30¢ domestic; +1.5% international cards; +1% currency conversion | None | **You** are merchant of record. Stripe Tax add-on: 0.5%/txn (no-code) or $0.50/txn (API) — calculates/collects only; **you must register & file** US state sales tax and EU VAT yourself | [stripe.com/pricing](https://stripe.com/pricing), [stripe.com/tax/pricing](https://stripe.com/tax/pricing) |
| **Polar.sh** (open-source challenger) | 4% + $0.40 | None | Full MoR | [youngju.dev deep dive](https://www.youngju.dev/blog/culture/2026-05-14-payment-infra-solo-devs-2026-stripe-lemon-squeezy-polar-paddle-creem-comparison-deep-dive.en) |

**Stripe / Lemon Squeezy status:** Yes — **Stripe acquired Lemon Squeezy in July 2024** ([TechCrunch via delivvo.io](https://delivvo.io/blog/polar-vs-lemonsqueezy-vs-paddle-merchant-of-record-2026)). As of mid-2026 Lemon Squeezy **still operates under its own brand** at 5% + $0.50, while Stripe has launched **Stripe Managed Payments** (public preview Feb 2026, in the API since April 22, 2026) as the migration path ([fungies.io](https://fungies.io/lemon-squeezy-stripe-acquisition-saas-founders-2026/)).

**Tax difference in one line:** MoR (Paddle/LS) = the platform is the legal seller and handles all US sales tax + EU VAT registration, collection and remittance; Stripe direct = Stripe Tax can compute and collect, but registration and filing in every nexus jurisdiction remains your problem (or pay Stripe Tax Complete, from ~€80–$90/mo) ([stripe.com/tax/pricing](https://stripe.com/tax/pricing), [checkoutpage.com](https://checkoutpage.com/blog/stripe-processing-fees)).

**Rule of thumb for a solo founder:** below ~$5K MRR, MoR almost always wins despite the ~6.7% effective take ([youngju.dev](https://www.youngju.dev/blog/culture/2026-05-14-payment-infra-solo-devs-2026-stripe-lemon-squeezy-polar-paddle-creem-comparison-deep-dive.en)).

---

## 5. Email (Transactional + Marketing)

| Provider | Free tier | Paid | Source |
|---|---|---|---|
| **Resend** (transactional) | 3,000 emails/mo (100/day) | Pro $20/mo = 50K emails; Scale $90/mo = 100–200K | [nuntly.com/resend-pricing](https://nuntly.com/resend-pricing), [apiscout.dev](https://apiscout.dev/guides/resend-vs-loops-vs-plunk-2026) |
| **Resend** (marketing, separate product) | 1,000 contacts | $40/mo = 5K contacts, up to $650 = 150K | [nuntly.com](https://nuntly.com/resend-pricing) |
| **Postmark** | 100 emails/mo | $15/mo = 10K; ~$115/mo = 100K; best-in-class transactional deliverability | [sideguysolutions.com](https://www.sideguysolutions.com/shareables/resend-vs-sendgrid-vs-mailgun-vs-postmark-vs-ses-vs-loops-honest-comparison.html), [f3fundit.com](https://f3fundit.com/transactional-email-bootstrapped-saas-resend-sendgrid-postmark-mailgun-2026/) |
| **Loops** (marketing-first, contact-based) | 1,000 subscribers / 4,000 sends/mo; **transactional email free on all plans** (since Q4 2025) | $49/mo (≈2,500–5,000 subscribers — sources conflict **[ESTIMATE]**); $99/mo = 10K; $249/mo = 50K | [apiscout.dev](https://apiscout.dev/guides/resend-vs-loops-vs-plunk-2026), [xmit.sh](https://xmit.sh/versus/loops-vs-resend) |

Months 1–6 cost: **$0** (Resend free tier easily covers a small user base; add Loops free for onboarding sequences).

---

## 6. Domain, Workspace, Analytics, Monitoring, Support

| Item | Cost | Source |
|---|---|---|
| .com domain | Cloudflare Registrar $10.46/yr (at-cost, registration = renewal; transfer-in only); Porkbun $11.08/yr; Namecheap $5.98 first yr / $13.98 renewal | [comparesharp.com](https://comparesharp.com/blog/namecheap-vs-cloudflare-registrar-compared), [devtoolpicks.com](https://devtoolpicks.com/blog/namecheap-vs-porkbun-vs-cloudflare-registrar-vs-godaddy-indie-hackers-2026) |
| Google Workspace | Business Starter $7/user/mo (annual); Standard $14; Plus $22 | [ifeeltech.com](https://ifeeltech.com/blog/getting-online-small-business-guide) |
| Cheaper email alternative | Zoho Mail ~$1/user/mo, or Cloudflare Email Routing (free, receive-only) + Resend for sending **[ESTIMATE — not verified this round]** | — |
| Analytics — Plausible | $9/mo (10K pageviews, 1 site); 30-day trial, no free tier | [plausible.io](https://plausible.io/) |
| Analytics — PostHog | **Free: 1M events/mo + 5K session replays + 100K errors**, forever; then ~$0.00031/event | [f3fundit.com](https://f3fundit.com/the-solopreneur-analytics-stack-2026-posthog-vs-plausible-vs-fathom-analytics-and-why-you-should-ditch-google-analytics/) |
| Error monitoring — Sentry | Developer plan free: 1 user, ~5K errors/mo, 50 replays **[ESTIMATE — secondary synthesis; check sentry.io/pricing]** | [hyperping.com context](https://hyperping.com/blog/best-uptime-kuma-alternatives) |
| Uptime monitoring | Free options allowing commercial use: BeaconBot (50 monitors, 3-min), PingZen (55 monitors, 1-min), Uptrack (50 monitors). **UptimeRobot free tier bans commercial use since Dec 2024** | [thebeaconbot.com](https://thebeaconbot.com/), [pingzen.dev](https://pingzen.dev/), [notifier.so](https://notifier.so/guides/best-uptime-monitoring-for-startups/) |
| AI support chatbot — Chatbase | Free: 50 msg credits/mo (bots deleted after 14 days idle); Hobby $32/mo annual (~$40 monthly) = 500 credits | [chatbase.co/pricing](https://www.chatbase.co/pricing) |
| AI support chatbot — DocsBot | Free: 1 bot, 50 pages, 100 msgs/mo; Personal $49/mo = 5K msgs | [docsbot.ai/pricing](https://docsbot.ai/pricing) |
| DIY docs chatbot | Build on own stack: embeddings + Haiku/DeepSeek ≈ $1–5/mo at low volume **[ESTIMATE — computed from token prices]** | — |

---

## 7. Company Registration for a Chinese Solo Founder

### Option A — No company at all (sell as individual via MoR)
**Allowed in 2026: yes.** Paddle, Lemon Squeezy, and similar MoRs onboard individuals; the MoR is the legal seller, so no entity, EIN, or foreign tax registrations are needed ([dodopayments.com](https://dodopayments.com/blogs/accept-payments-without-company), [leanvibe.io](https://leanvibe.io/blog/bp-26820)). Cost: $0 setup, $0/yr. You remain responsible for declaring personal income tax in China on payouts. Typical advice: incorporate once revenue is meaningful (~$50K+/yr) ([dodopayments.com](https://dodopayments.com/blogs/accept-payments-without-company)).

### Option B — US Delaware LLC via Stripe Atlas
- Formation: **$500 one-time** (includes EIN, first-year registered agent, Mercury bank intro; ~$350 with Mercury partner invite) — [stripe.com/atlas](https://stripe.com/atlas), [foreignllctax.com](https://foreignllctax.com/guides/stripe-atlas-china)
- Annual: Delaware franchise tax **$300/yr** (LLC, due June 1) + registered agent **~$100/yr** (year 2+) + **Form 5472 + pro-forma 1120** filing (mandatory for foreign-owned single-member LLC; $25,000 minimum penalty for failure; filing services from ~$49 to several hundred $) — [edge.stripe.com Atlas guide](https://edge.stripe.com/ie/guides/atlas/business-taxes), [earnifyhub.com](https://earnifyhub.com/finance-money/stripe-atlas-non-us-founder-guide-2026)
- Realistic year-1 total: **~$700–900**; year 2+: **~$450–900/yr** ([foreignllctax.com](https://foreignllctax.com/guides/stripe-atlas-china))
- Tax basics: single-member LLC is a disregarded entity; with no US "effectively connected income" (no US office/staff), profits typically flow to you and are taxed in China, not the US **[ESTIMATE — common interpretation; get professional advice]**. Cheaper DIY alternative: Wyoming LLC (~$154 setup, $60/yr state fee) ([foreignllctax.com](https://foreignllctax.com/guides/stripe-atlas-china)).

### Option C — Hong Kong limited company
- Government baseline: **HK$3,895** (~$500) incorporation + first-year BR certificate; realistic year-1 with mandatory secretary + registered address: **HK$7,000–15,000 (~$900–1,900)** — [growacross.com](https://growacross.com/insights/hong-kong-company-formation-cost), [statrys.com](https://statrys.com/hk/guides/company-formation)
- Annual maintenance: **~$2,000–4,300/yr** including the **mandatory CPA audit** (required even at 0% tax / offshore claim) — [cryptoverselawyers.io](https://www.cryptoverselawyers.io/cost-of-running-a-hong-kong-company-2026/)
- Tax: territorial system — offshore income may be 0%, but offshore claims need documentation and raise audit costs by HK$2,000–5,000 ([growacross.com](https://growacross.com/insights/hong-kong-company-formation-cost)). HK profits tax otherwise 8.25% on first HK$2M **[ESTIMATE — standard two-tier rate, not re-verified this round]**.

**Recommendation for month 1:** start as an individual on Paddle/Lemon Squeezy ($0); revisit US LLC (~$500 one-time) or HK Ltd (~$1,500 + $2–4K/yr) only after revenue traction.

---

## 8. SaaS Benchmark Metrics

| Metric | Benchmark | Source |
|---|---|---|
| Freemium → paid conversion | Median **5.5%**; good 3–5%; great 8–12% | [ChartMogul SaaS Conversion Report (200 products)](https://chartmogul.com/reports/saas-conversion-report/) |
| Free trial (opt-in, no CC) → paid | Median ~8% (8.9% in 2026 data); good 4–6%, great 10–15% | [chartmogul.com](https://chartmogul.com/reports/saas-conversion-report/), [pulseahead.com](https://www.pulseahead.com/blog/trial-to-paid-conversion-benchmarks-in-saas) |
| Free trial (CC required) → paid | ~30–31%; good 25–35%, great 50–60% (but fewer signups) | [growthunhinged.com](https://www.growthunhinged.com/p/free-to-paid-conversion-report) |
| AI-native / AI+SaaS conversion | good 6–8%, great 15–20%, median ~10% | [prems.ai](https://prems.ai/blog/free-to-paid-conversion-saas-2026) |
| Visitor → signup | Freemium ~9%; opt-in trial ~4.5%; CC-required trial ~3.5% (2026 data) | [pulseahead.com](https://www.pulseahead.com/blog/trial-to-paid-conversion-benchmarks-in-saas) |
| Monthly churn, SMB/prosumer SaaS | Typically **2–8%/mo** (your 3–8% assumption is within range); mid-market <2%, enterprise <1% | [artisangrowthstrategies.com](https://www.artisangrowthstrategies.com/blog/saas-conversion-rate-benchmarks-2026-data-1200-companies) |
| CAC for SEO-driven indie SaaS | **~$0 marginal** per customer once content exists; real cost is founder time + tooling **[ESTIMATE — logical inference, no single authoritative 2026 source]** | — |
| Chargeback rate, SaaS/digital goods | Industry norm **0.5–1.0%**; digital-goods average 0.54% (up 59% YoY); >1% = processor scrutiny; Visa VAMP threshold 1.5% | [paycompass.com](https://paycompass.com/blog/chargeback-rates-by-industry/), [fungies.io](https://fungies.io/prevent-win-chargebacks-digital-products-2026/) |
| Refund rate, AI tools | **[ESTIMATE]** ~5–15% of transactions for consumer/prosumer AI tools (buyer's remorse is high for intangibles); no authoritative published 2026 benchmark found. Plan conservatively at ~10%. | inference from [paycompass.com digital-goods data](https://paycompass.com/blog/chargeback-rates-by-industry/) |

---

## 9. Minimal Viable Monthly Burn — Months 1–6 (solo AI SaaS)

Assumptions: Cloudflare free tier (commercial OK) + Supabase free, sell via Paddle/LS as individual (no company), PostHog free analytics, Resend free email, DeepSeek/Haiku/Flash-class models, modest image generation. MoR fees are taken out of revenue, not fixed burn.

| Item | M1 | M2 | M3 | M4 | M5 | M6 | Notes |
|---|---|---|---|---|---|---|---|
| Domain (amortized $11/yr) | $1 | $1 | $1 | $1 | $1 | $1 | Porkbun/Cloudflare |
| Hosting / DB / storage | $0 | $0 | $0 | $0 | $5 | $5 | Free tiers; Workers Paid $5 by M5 as traffic grows |
| LLM API (dev + testing → production) | $20 | $20 | $30 | $40 | $50 | $75 | Cheap-model stack; testing-heavy early **[ESTIMATE]** |
| Image generation API | $5 | $5 | $5 | $10 | $10 | $15 | ~100–350 FLUX 1.1 Pro images **[ESTIMATE]** |
| Email (Resend free) | $0 | $0 | $0 | $0 | $0 | $0 | 3K/mo free covers early volume |
| Analytics (PostHog free) + Sentry free + uptime free | $0 | $0 | $0 | $0 | $0 | $0 | All free tiers |
| AI support chatbot | $0 | $0 | $0 | $0 | $0 | $32 | DIY/free early; Chatbase Hobby if volume justifies |
| Misc (icons, screenshots, tooling) | $5 | $5 | $5 | $5 | $5 | $5 | **[ESTIMATE]** |
| **Total fixed burn** | **~$31** | **~$31** | **~$41** | **~$56** | **~$71** | **~$133** | |

**Variable cost of revenue:** MoR takes 5% + $0.50/sale (e.g., $19/mo plan → $1.45/sale, ~7.6% effective; $500 MRR → ~$36/mo in fees). Per-customer LLM inference must also scale with usage — keep COGS <20% of price by routing to DeepSeek/nano/Flash-Lite class models.

**Six-month fixed burn total: ≈ $360** (range $250–600 depending on testing intensity). **[ESTIMATE — built from the sourced unit prices above]**

## 10. One-Time Startup Costs

| Item | Cost | Required? |
|---|---|---|
| Domain, year 1 | $6–11 | Yes |
| Company registration | $0 (individual via MoR) / $500 Stripe Atlas LLC / ~$1,200–1,900 HK Ltd | Optional at start |
| Trademark / legal | $0–350 (US TEAS trademark filing **[ESTIMATE]**) | Optional |
| Design assets / boilerplate / misc | $0–100 | Optional |
| **Minimum viable total** | **~$11** (individual + free tiers) | |
| **With US LLC** | **~$520–620** | |

---

## Key Flags / Caveats
1. **[ESTIMATE]** items: Grok pricing, Lemon Squeezy international surcharge, Stripe Managed Payments effective rate, Loops $49 tier subscriber count, Sentry free-tier exact quotas, Zoho Mail price, AI-tool refund rates, SEO CAC, all burn-table LLM/image budgets, HK profits tax rate, US LLC tax treatment.
2. Vercel Hobby and UptimeRobot free tiers **prohibit commercial use** — common gotcha for indie founders.
3. DeepSeek V4 Pro's current price reflects a promo made permanent after May 31, 2026 ([devtk.ai](https://devtk.ai/en/blog/deepseek-api-pricing-guide-2026/)) — model prices in this space move quarterly; re-verify before locking unit economics.
4. Supabase free projects pause after 1 week of inactivity — fine for an active product, risky for side projects.
5. Foreign-owned US LLC: Form 5472 non-filing penalty is $25,000 — if you take the LLC route, the ~$50–300/yr filing cost is non-negotiable.
