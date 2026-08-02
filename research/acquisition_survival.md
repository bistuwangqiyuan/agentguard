All searches are complete. Here is the full report.

---

# Solo Bootstrapped (Micro-)SaaS in 2024–2026: Acquisition & Survival Evidence Report

**Methodology note on source quality.** During verification I found that several of the most-cited "studies" in this space (RockingWeb, SaaSRanger, and various 2026-dated blogs) are content-marketing pieces by agencies/tool vendors with vague methodology, and they heavily cross-cite each other. I've tagged every figure: **[VERIFIED]** = primary source with disclosed methodology/platform data; **[SECONDARY]** = published figure from a source with weak/undisclosed methodology — treat as directional; **[ESTIMATE]** = my synthesis.

---

## 1. Revenue distribution, time-to-milestones, abandonment

### 1.1 The headline distribution — verification result

The numbers you quoted check out as *published*, but the provenance chain is weaker than it appears. The "70% / 18% / $4.2K median" figures originate in **RockingWeb's 2025 analysis** (a Sydney web-dev agency's content piece, methodology not fully disclosed — it says it "dove into" MicroConf survey data, YC batch data, and Stripe Atlas metrics) and were then *repeated* by Freemius's State of Micro-SaaS 2025, which lends them credibility but does not independently re-derive them.

| Claim | Status | Source |
|---|---|---|
| ~70% of micro-SaaS earn <$1K MRR | **[SECONDARY, widely republished]** | [RockingWeb 2025](https://www.rockingweb.com.au/micro-saas-revenue-analysis-2025/), republished by [Freemius 2025](https://freemius.com/blog/state-of-micro-saas-2025/) |
| 18% in $1K–$5K MRR "sustainability zone" | **[SECONDARY]** | same |
| Median *profitable* micro-SaaS ≈ $4.2K MRR | **[SECONDARY]** | same (Freemius attributes to Rocking Web data) |
| Top 1–2% exceed $50K MRR | **[SECONDARY]** | same |
| 95% reach profitability within 12 months | **[SECONDARY]** (low bar: costs ≈ $0) | RockingWeb, repeated by Freemius |
| 45.7% of Freemius SaaS makers are solo founders | **[VERIFIED — Freemius platform data]** | [Freemius 2025](https://freemius.com/blog/state-of-micro-saas-2025/) |
| 28% of 230 MicroConf 2025 attendees report >$100K MRR | **[VERIFIED — but heavily survivor-biased sample]** | Freemius citing MicroConf 2025 |

### 1.2 Granular distribution — the best primary dataset

**IndieLaunches' analysis of 326 HN "Who is making money?" projects (2024–2025)** is the most transparent dataset available, with full counts published ([indielaunches.com](https://indielaunches.com/indie-maker-analytics-2024-2025-projects/)) **[VERIFIED, but self-selected sample — people posting in money threads skew toward having revenue]**:

| Band (monthly revenue) | % of 160 disclosing projects |
|---|---|
| $0 (pre-revenue) | 5% |
| <$500/mo | 13% |
| $500–$1K/mo | 46% |
| $1K–$5K/mo | 19% |
| $5K–$10K/mo | 8% |
| $10K+/mo | 10% |

Median: **$500/mo** (2024: $600; 2025: $500). Mean $5,768 (skewed). Note 44% of the 326 declined to disclose — true distribution is almost certainly worse.

A finer-grained breakdown attributed to RockingWeb ([SaaSRanger summary](https://saasranger.com/blog/what-is-micro-saas/)) **[SECONDARY]**: 47% earn $0; 23% earn $1–$499; 12% earn $500–$999; 10% earn $1K–$5K; ~6-8% $5K–$50K; 1–2% >$50K.

### 1.3 Time-to-milestones and survival

- Time to first paying customer: **~3 months typical**; HN dataset shows avg **47 days launch→first sale** for projects that reached $500+/mo ([HN 9-year analysis](https://news.ycombinator.com/item?id=46932483)) **[SECONDARY]**
- Time to $1K MRR: **12–18 months typical** ([SaaSRanger synthesis of RockingWeb/Freemius](https://saasranger.com/blog/micro-saas-revenue-reality-what-1000-founders-actually-earn/)) **[SECONDARY]**
- Median bootstrapped SaaS time to $1M ARR: **2 years 9 months** (RockingWeb citing ChartMogul-style data) **[SECONDARY]**
- **"92% of micro-SaaS fail within 18 months"** ([RockingWeb](https://www.rockingweb.com.au/micro-saas-revenue-analysis-2025/)) — **[SECONDARY, weakly sourced; treat as plausible-but-unverified].** The 18-month mark as the abandonment "valley of death" recurs across sources.
- B2B skew: 73% of HN projects that reached $500+/mo were B2B, not consumer; 87% priced $20–49/mo **[SECONDARY]**

---

## 2. Acquisition channels for indie SaaS

### 2.1 What actually acquired first customers (best primary data)

From the 326-project IndieLaunches dataset ([source](https://saasranger.com/blog/how-to-get-your-first-micro-saas-customers-6-channels-that-actually-worked/)) **[VERIFIED dataset, main-channel counts]**:

| Channel (main source of first customers) | Projects (of 326) |
|---|---|
| Word of mouth | 40 |
| App marketplace / store listings | 33 |
| SEO / organic | 27 |
| Community / Reddit | 20 |
| Direct outreach | 15 |
| Product Hunt | 8–9 |
| **Paid ads** | **4 (1.2%)** |

### 2.2 SEO under Google AI Overviews — the CTR data **[VERIFIED — multiple independent studies]**

- **Ahrefs (Dec 2025, 300K keywords):** AI Overview presence reduces position-1 CTR by **~58%** (was −34.5% in Apr 2025). Decay by position: #1 −58%, #3 −46%, #5 −32%, #10 −19%. ([ahrefs.com](https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/))
- **Seer Interactive (Sept 2025, 3,119 queries / 25.1M impressions):** organic CTR for informational queries with AIOs fell from 1.76% → **0.61% (−61%)**; paid CTR −65–68%. Critically, **even queries *without* AIOs lost 41% CTR YoY** — clicks are leaving search generally. Brands *cited inside* AIOs got +35% organic clicks. ([seerinteractive.com](https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-september-2025-update), [searchengineland.com](https://searchengineland.com/google-ai-overviews-drive-drop-organic-paid-ctr-464212))
- AI referral traffic (ChatGPT etc.) is still only **0.1–2.8% of site traffic** but grew 357% in 2025, and AI-referred visitors crossed conversion parity with search in late 2025 ([SearchSignal aggregation](https://searchsignal.online/research/ai-search-referrals-citations-2026)) **[SECONDARY aggregation of verified studies]**
- Implication: transactional/comparison/long-tail queries are far less affected (−5–8%) than informational (−30–60%) **[SECONDARY]** ([eseospace](https://eseospace.com/blog/how-ai-overviews-impact-seo-2026/))

### 2.3 Programmatic SEO timelines (new domain)

- Consensus bracket: **months 1–5 near zero → first clicks months 4–8 → compounding months 9–14**; on a brand-new domain (DR<10) add 3–6 months, total **14–24 months to meaningful payback** ([pSEO payback analysis](https://medium.com/@ayvataskenan/the-pseo-payback-period-how-fast-can-you-recover-your-investment-521d010e5299), [SEOJuice](https://seojuice.com/blog/seo-timeline-realistic-expectations/)) **[SECONDARY, consistent across sources]**
- Ahrefs (primary): **<6% of new pages reach Google top-10 within a year**; median top-10 page is 2+ years old **[VERIFIED]** (cited in [Averi benchmark](https://resources.averi.ai/benchmarks/seo-ranking-timeline))
- Risk: Google's Scaled Content Abuse enforcement — one travel site had **98% of 50K templated pages deindexed** in 2025 ([hotpress.ai](https://hotpress.ai/blog/programmatic-seo)) **[SECONDARY]**

### 2.4 Product Hunt in 2026 — not dead, but demoted to a credibility badge

- Featured products fell from ~47/day to **~16/day**, traffic drops 80–90% within 72h of launch ([merge.rocks](https://merge.rocks/blog/saas-product-launch-guide-what-worked-in-2023-but-doesnt-in-2026)) **[SECONDARY]**
- Realistic top-10 outcome 2026: **1,500–3,000 visitors, 50–200 signups, 5–20 paying customers**; the *median* launch (outside top 20) gets 50–300 visitors and ~0 customers ([promptstoproduct aggregation of 2024–26 retrospectives](https://www.promptstoproduct.com/when-to-launch-on-product-hunt)) **[SECONDARY]**
- 5-founder roundup (spring 2026, all top-6): 7-day signups **71–450 (median ~115)**; rank did not predict revenue; top-3 finisher had 0% paid conversion ([happysupport.ai](https://happysupport.ai/blog/product-hunt-launch-roundup-2026)) **[SECONDARY]**
- One famous datapoint: top-5 launch → 4,500 waitlist signups → **5 paid (0.11%)** ([thevibepreneur](https://thevibepreneur.com/reddit-vs-product-hunt-launch)) **[SECONDARY anecdote]**
- Launch volume context: PH launches went from ~3,577/mo (pre-Feb-2025) to **~10,000/mo avg, peaking 21,040 in Mar 2026** — 2.8x more competition for the same attention ([findsimilarstartups, PH API data](https://www.findsimilarstartups.com/en/blog/vibe-coding-product-hunt-launches-karpathy)) **[VERIFIED — API data]**

### 2.5 X/Twitter build-in-public

- 20-founder 12-month cohort: **8/20 saw direct revenue impact**, 12/20 fundraising benefit, 6/20 negative consequences; median 4–6 hrs/week; follower count barely correlated with revenue (2,800-follower founder generated $340K pipeline; 48K-follower founder $0) ([Inner Ping](https://www.innerping.com/blog/building-in-public-2025-retrospective)) **[SECONDARY, small n]**
- X demotes external links (~50% reach penalty); realistic horizon: **6–12 months to signal, 2–3 years to meaningful channel** ([foundra.ai](https://www.foundra.ai/key-reads/build-in-public-x-2026-after-algorithm-shift)) **[SECONDARY]**
- Median launch thread: ~200 impressions, <10 likes ([youngju.dev](https://www.youngju.dev/blog/culture/2026-05-14-side-project-launch-strategy-2026-product-hunt-hacker-news-twitter-x-indie-hackers-deep-dive.en)) **[SECONDARY]**

### 2.6 Reddit

- Targeted subreddit posts: **2–8% signup rates**, threads keep converting for months via Google indexing of Reddit (vs PH's 24–48h spike); OpenHunts study of 387 launches: Indie Hackers converted 23.1% of engaged readers vs Product Hunt 3.1% ([thevibepreneur](https://thevibepreneur.com/reddit-vs-product-hunt-launch), [SaaSRanger](https://saasranger.com/blog/micro-saas-revenue-reality-what-1000-founders-actually-earn/)) **[SECONDARY]**

### 2.7 Directories / marketplaces

- Second-biggest first-customer source in the IndieLaunches data (33/326) **[VERIFIED dataset]**
- There's An AI For That: ~7.8M monthly visits, paid launch packages claim 700–10,000 clicks first week, ~1.3% CTR ([taaft launch page](https://theresanaiforthat.com/launch/)) **[VERIFIED as vendor claim — i.e., marketing numbers]**; Futurepedia ~2.8–3.2M visits, DR 74 ([LaunchBoosts/Similarweb](https://launchboosts.com/blog/similarweb-futurepedia-io-traffic-2026)) **[SECONDARY]**. Most AI directories are now pay-to-surface; main durable value is backlinks.

### 2.8 Newsletter sponsorships **[SECONDARY, consistent across sources]**

- Tech/dev/founder newsletter CPMs: **$40–$100+** (founder/startup audiences median ~$65; AI-native ~$68; from a broker's 2,600-deal HubSpot sample: [ReveNews](https://www.revenews.co/p/what-sponsors-actually-pay-for-your-audience))
- Typical placements: <5K subs $50–250; 5–50K subs $500–3,000; 50K+ $3,000–20,000; TLDR primary ~$15,000 ([beehiiv](https://www.beehiiv.com/blog/newsletter-sponsorship-cost), [SponsorGap](https://sponsorgap.com/blog/saas-newsletter-sponsorship-rates-2026))

### 2.9 Affiliate programs **[VERIFIED — Rewardful platform data, $68.4M affiliate revenue analyzed]**

The sobering one: ([Rewardful State of SaaS Affiliate Programs](https://www.rewardful.com/articles/state-of-saas-affiliate-programs-report))
- Only **7.6% of recruited affiliates ever generate a referral; 1.28% generate a sale**; referral→sale conversion 0.8%
- Only **15.6% of programs survive long-term**; avg commission 24.16%, avg payout $14.10
- Mature programs can contribute 15–25% of MRR (highest for AI/ML SaaS), but that takes 18–30 months ([Rewardful benchmarks](https://www.rewardful.com/articles/saas-affiliate-program-benchmarks))

---

## 3. AI impact on indie SaaS, 2025–2026

### 3.1 Named AI-wrapper deaths/pivots **[VERIFIED events; interpretations secondary]**

| Company | What happened | Why |
|---|---|---|
| **Builder.ai** | Microsoft-backed, $1.2B valuation → **bankruptcy May 2025** | AI promises masked manual labor; unit economics |
| **Forefront Chat** | Shut down Feb 2024 | OpenAI improved free ChatGPT tier; value prop vanished |
| **Tome** | Abandoned AI presentations, pivoted to sales software 2025 | Copilot-in-PowerPoint, Canva AI, Google Slides AI commoditized it |
| **Playground AI** | Pivoted away from image gen Jan 2025 | Model-provider competition |
| **Jasper** | Revenue reportedly **−61% over 18 months** post-ChatGPT | Direct competition from the model it wrapped |
| **Inflection AI** | $1.3B raised → acquihired into Microsoft | Couldn't compete with frontier labs |

Sources: [The AI Cemetery](https://theaicemetery.com/blog/why-ai-wrappers-keep-dying/), [AgentMarketCap](https://agentmarketcap.ai/blog/2026/04/10/ai-thin-wrapper-extinction-event-q2-2026), [IdeaProof 2025 retrospective](https://ideaproof.io/startup-failures-2025). Note: the Jasper −61% figure appears in one secondary source; I could not verify it against a primary disclosure — **[SECONDARY]**.

### 3.2 Margin compression & failure rates

- AI wrapper gross margins: **25–35%** vs 70–85% traditional SaaS; API costs eat 30–60% of revenue; power users cost 10–50x median users ([vibe-eval](https://blog.vibe-eval.com/content/posts/ai-wrapper-saas-margin-trap/), [startupa.ge citing "Market Clarity 2025"](https://startupa.ge/blog/micro-saas-ideas-2026)) **[SECONDARY but consistent]**
- "90% of AI wrappers will fail; 60–70% generate zero revenue" — **[SECONDARY/UNVERIFIED projection, not measured data]**
- Median AI startup valuation compressed from ~80x ARR (2024) → **~18x ARR (Q3–Q4 2025)** ([IdeaProof](https://ideaproof.io/startup-failures-2025)) **[SECONDARY]**
- SimpleClosure's State of Startup Shutdowns 2025: **2.5x YoY increase in Series A shutdowns**, AI wrappers over-represented **[SECONDARY citation of a real report]**
- Platform risk mechanism in 2025–26: OpenAI AgentKit/Apps SDK absorbing automation wrappers; Anthropic/Google shipping native agents, voice, content tools ([roborhythms](https://www.roborhythms.com/openai-killed-automation-startups/))

### 3.3 Vibe-coding supply flood **[mostly VERIFIED]**

- iOS App Store submissions: **235,800 in Q1 2026, +84% YoY** (Sensor Tower data; biggest quarterly surge in a decade); meanwhile **apps with significant usage stayed flat** (FT chart, Demirer et al. 2026) ([officechai](https://officechai.com/ai/ai-has-led-to-an-explosion-of-new-apps-but-nearly-none-have-managed-to-garner-significant-usage/))
- **200,000+ new projects/day on Lovable alone** (company disclosure alongside $400M ARR); 63% of builders aren't developers ([aienabledpm](https://aienabledpm.com/200-000-vibe-coded-projects-launch-every-day-almost-none-get-customers/))
- Product Hunt launches ~2.8x pre-2025 levels (see §2.4)
- Net effect: **building is no longer the bottleneck; distribution is the entire game.** Supply of products up 2–3x; demand (usage, revenue) flat.

---

## 4. Niches: willingness to pay & churn benchmarks

### 4.1 Churn by vertical (Focus Digital study, Sept 2024–Jan 2025; n across 15 verticals) **[SECONDARY — methodology partially disclosed]**

([focus-digital.co](https://focus-digital.co/average-churn-rate-by-industry-saas/))

| Vertical | Monthly churn | Annual churn | Median LTV |
|---|---|---|---|
| Infrastructure & DevOps | 1.8% | 19.8% | $47,200 |
| ERP | 2.1% | 22.9% | $124,500 |
| CRM | 2.4% | 25.6% | $38,900 |
| Cybersecurity/Compliance | 2.6% | 27.8% | $52,100 |
| BI & Analytics | 3.2% | 32.8% | $29,400 |
| HR & Payroll | 3.5% | 35.9% | $22,800 |
| Finance & Accounting | 4.3% | 42.5% | $31,200 |
| Marketing automation | 4.8% | 46.1% | $16,900 |
| Project management | 6.1% | 55.6% | $9,800 |
| **E-commerce enablement** | **6.8%** | **59.4%** | $11,200 |
| Email/communication tools | 8.1% | 67.2% | $5,900 |

### 4.2 Churn by customer segment **[VERIFIED-ish: Optifai n=939 companies + Focus Digital concur]**

| Segment | Monthly churn | Annual |
|---|---|---|
| Enterprise | 1–2% | ~13% |
| Mid-market | 1.5–3% | ~29% |
| **SMB (10–99 emp.)** | **3–7%** | **31–58%** |
| **Micro-business (<10 emp.)** | **8.9%** | **~69%** |

([Optifai](https://optif.ai/learn/questions/b2b-saas-churn-rate-benchmark/), [Fungies](https://fungies.io/how-to-reduce-saas-churn/)). Key driver of SMB churn: **business closure (~40% of all churn)** ([growthlist](https://growthlist.co/enterprise-vs-smb-saas-strategy/)).

### 4.3 Practical implications for niche choice **[ESTIMATE/synthesis]**

- **High WTP + low churn:** developer/infrastructure tools, legal tech (reported 1.6–3.1% monthly via switching costs), compliance, accounting ledger tools (some at 1.1–1.9% monthly), vertical B2B with regulatory lock-in
- **High WTP + high churn:** e-commerce sellers (6.8%/mo — customers' businesses die), content creators, marketing tools
- **Annual prepay cuts churn ~30% and lifts LTV ~27%** (Freemius/RockingWeb) **[SECONDARY]**; 73% of $500+/mo HN projects are B2B
- Vertical AI SaaS is cited as growing 2–3x faster than horizontal **[SECONDARY]**

---

## 5. SEO specifics for 2026: traffic & conversion funnels

### 5.1 Realistic organic visitors, new domain (DR 0–15), competent solo execution **[SECONDARY benchmarks + ESTIMATE]**

| Milestone | Median expectation | Top quartile | Source |
|---|---|---|---|
| Month 6 | **0–500/mo** (85% of new sites' content not in top 50 yet) | 1,000–5,000 | [the-seo-autopilot](https://the-seo-autopilot.com/en/stats/saas-seo-time-to-rank-benchmarks-2026), [Averi](https://resources.averi.ai/benchmarks/website-traffic-benchmarks-startups) |
| Month 12 | **1,000–5,000/mo** (first 1,000 typically arrives month 5–8 with 2–4 posts/mo) | 5,000–15,000 | [rankinglens](https://blog.rankinglens.com/saas-seo-0-to-1000-visitors), Averi |
| Month 24 | **3,000–15,000/mo** | 20,000–50,000+ | Averi (seed-stage benchmark) |

pSEO can multiply these (one case study: 12,000 pages → 175K/mo programmatic traffic by month 14 — but that was on an *established* domain, [getathenic](https://getathenic.com/blog/programmatic-seo-saas-case-study)) **[SECONDARY, vendor case study]**. On a new domain, expect pSEO payback at month 14–24 and real deindexing risk for thin templates.

### 5.2 Visitor → trial → paid conversion **[VERIFIED — First Page Sage (86 cos, 2022–2025) & ChartMogul 2026 (200 products)]**

| Funnel step | First Page Sage 2025 | ChartMogul 2026 |
|---|---|---|
| Visitor → trial (opt-in, no CC) | 8.5% | 4.5% |
| Trial → paid (opt-in) | 18.2% | **8.9%** |
| Visitor → trial (CC required) | 2.5% | 3.5% |
| Trial → paid (CC required) | 48.8% | 31.4% |
| Freemium signup → paid | 2.6% | 5.6% |
| **Paying customers per 1,000 visitors** | **12–16** | **4–11** |

([firstpagesage.com](https://firstpagesage.com/seo-blog/saas-free-trial-conversion-rate-benchmarks/), [pulseahead summary of ChartMogul](https://www.pulseahead.com/blog/trial-to-paid-conversion-benchmarks-in-saas)). For blog-driven AI tool sites specifically: informational posts convert 1–3% to trial, comparison/alternative pages 15–30%; a site at 1,000 visitors/mo typically yields **5–20 trials/mo → roughly 1–4 new paying customers/mo** ([rankinglens](https://blog.rankinglens.com/saas-seo-0-to-1000-visitors)) **[SECONDARY]**.

**Planning math [ESTIMATE]:** 5,000 visitors/mo × ~1% visitor→paid ≈ 25–50 customers/yr from SEO alone at month 12–18 — i.e., SEO alone rarely gets a new product past ~$1–2K MRR in year one. It's a year-2–3 channel now.

---

## 6. Acquisition/exit market (Acquire.com)

**[VERIFIED — Acquire.com's own reports]** ([Jan 2026 Biannual Multiples Report](https://blog.acquire.com/acquire-com-biannual-acquisition-multiples-report-jan-2026/), [2025 webinar recap](https://blog.acquire.com/acquisition-multiples-report-2025-findings-webinar-recap/), [2025 annual PDF](https://blog.acquire.com/wp-content/uploads/2025/02/acquire-annual-report-2025.pdf)):

- Multiples are quoted on **TTM profit (SDE), not ARR**, for sub-$1M businesses. Your "2.5–4x ARR" prior is the wrong axis: median confirmed sale was **3.9x TTM *profit*** in both 2024 and 2025 (range 3–5x; <$100K net income avg 3.7x; $100K–$1M avg 3.9x). Since listed SaaS average ~71% margins, that's roughly **2.5–3x revenue equivalent** for a healthy micro-SaaS — so your prior is approximately right in effect, wrong in denomination.
- AI features do **not** automatically earn a premium; buyers price cash flow and want 3–5 year payback
- Avg time on market 80–90 days; well-priced deals close in ≤30 days; fairly priced listings see ~50+ NDAs and 10–12 offers
- **% of listings that sell: not publicly disclosed.** Known: only ~45% of applicants get accepted to list; 2,000+ total startups sold against ~1,200 live listings at any time and ~136 deals reporting multiples in the 2025 report. **[ESTIMATE: meaningful fraction of accepted, fairly-priced listings sell — likely 30–60% — but no verified figure exists.]**
- Fees: $25–100/mo listing + 6–8% closing ([startupa.ge marketplace comparison](https://startupa.ge/blog/best-startup-marketplaces-buy-sell-saas)) **[SECONDARY]**

---

## 7. Summary: probability of reaching X MRR within Y months
### (competent solo technical founder, new product, 2026 conditions) — **[ESTIMATE]**

These are my synthesis, anchored on the IndieLaunches distribution (self-selected, optimistic), the RockingWeb/Freemius distribution (broader, pessimistic), 12–18mo time-to-$1K benchmarks, and adjusted *upward* ~1.5–2x from raw population base rates because "competent + actually persists past month 18" already filters out the majority of abandoned weekend projects — then adjusted *downward* for 2026 conditions (2–3x more competing launches, −40–60% SEO CTR).

| Milestone | Within 6 mo | Within 12 mo | Within 24 mo | Within 36 mo |
|---|---|---|---|---|
| First paying customer | 70–85% | 85–90% | 90%+ | 90%+ |
| **$100+ MRR** | 45–60% | 60–70% | 70–75% | ~75% |
| **$500+ MRR** | 15–25% | 30–40% | 40–50% | 45–55% |
| **$1K+ MRR** | 5–10% | 15–25% | 25–35% | 30–40% |
| **$5K+ MRR** ("ramen profitable") | 1–3% | 5–8% | 10–15% | 12–18% |
| **$10K+ MRR** | <1% | 2–4% | 5–8% | 7–10% |
| **$50K+ MRR** | ~0% | <0.5% | ~1% | 1–2% |

**Key conditioning factors (evidence-backed):** B2B niche with $29–$99/mo pricing roughly doubles the odds vs consumer/$9 pricing; SMB/micro-business churn (6–9%/mo) means ~$1K MRR requires replacing ~half your customer base annually just to stand still; pure-informational SEO as primary channel pushes every milestone out 6–12 months in 2026; thin AI wrappers face an additional independent platform-risk hazard that the table above does not include.

### Biggest verified deltas vs your priors
1. The "70%/18%/$4.2K" numbers are real publications but trace to a single agency content piece (RockingWeb) laundered through Freemius — directionally fine, methodologically soft.
2. Acquire.com multiples are **profit-based (3.9x SDE)**, not ARR-based.
3. AI Overview damage is worse than most assume: −58–61% CTR on affected queries **and −41% even on unaffected queries** — but transactional/long-tail queries (where indie SaaS lives) are the least affected.
4. Product Hunt isn't dead, but the median launch is now worth ~0 customers; it only pays for top-10 finishes with an existing audience.
5. Affiliate programs are far weaker than commonly pitched: 1.28% of affiliates ever produce a sale.

 Now I'm organizing my sources by reliability tier—pulling from verified platforms like Freemius, IndieLaunches, and Ahrefs for the primary layer, while flagging secondary sources like SEO content sites that need more careful handling. Time to structure this into a solid markdown report.

I'll build out seven sections: revenue distribution and time-to-milestone data, acquisition channels, AI's impact on indie products, niche performance and churn patterns, SEO trends for 2026, exit market dynamics, and a probability summary table. For the probability estimates, I'm anchoring on base rates from HN discussions and disclosed data—roughly 50% of products share revenue figures, with a median around $500/month. I'll layer in the distribution: about 70% stay under $1K MRR, 18% hit the $1K-5K range, and only 1-2% break $50K. Then I'll adjust upward for "competent solo technical founder" since that filters out abandoned weekend projects, and I'll mark these as estimates throughout.