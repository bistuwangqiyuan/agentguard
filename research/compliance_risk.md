All eight research areas are covered. Here is the full report.

---

# Compliance & Risk Report: Solo Chinese Founder Running a Fully-Automated AI SaaS for US/EU Markets

**As of June 2026.** Assumes: solo founder resident in mainland China, no Chinese legal entity, product hosted overseas, sold globally (mainly US/EU) via a Merchant of Record, built on third-party LLM APIs (OpenAI/Anthropic), not serving mainland Chinese users.

---

## 1. EU AI Act (2026 status)

**Where you sit in the regime.** Using OpenAI/Claude APIs inside your SaaS makes you a **deployer / downstream provider of an AI system**, not a GPAI model provider. The heavy GPAI obligations (Art. 53 model documentation, training-data summaries, copyright policy) sit with OpenAI/Anthropic/Google, not you ([sota.io GPAI guide](https://sota.io/blog/eu-ai-act-gpai-provider-deployer-responsibility-2026), [ComplyDrive deadlines](https://www.complydrive.ai/articles/the-august-2026-deadline-what-needs-to-be-done-by-when)).

**Timeline (after the May 2026 "Digital Omnibus" agreement):**

| Date | What applies |
|---|---|
| Feb 2, 2025 | Prohibited practices ban (already in force) |
| Aug 2, 2025 | GPAI model-provider rules (OpenAI's problem, not yours) |
| **Aug 2, 2026** | **Art. 50(1)–(3) transparency: chatbot disclosure, deepfake/public-interest-text labelling — applies to you** |
| Dec 2, 2026 | Machine-readable marking of AI-generated content (3-month grace from Omnibus) |
| Dec 2, 2027 / Aug 2028 | High-risk system obligations (delayed by the Omnibus; only relevant if your use case is Annex III high-risk) |

Sources: [HRZN small-business guide](https://hrzn.pro/en/ai/eu-ai-act-small-business-guide-august-2026/), [ComplyDrive](https://www.complydrive.ai/articles/the-august-2026-deadline-what-needs-to-be-done-by-when), [EC Code of Practice on AI-content transparency](https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content), [aiactblog Art. 50](https://www.aiactblog.nl/en/ai-act/artikel/50).

**Your practical obligations as a "limited risk" AI SaaS:**
- **Chatbot disclosure (Art. 50(1)):** visible "you are interacting with AI" notice at first contact — UI banner/greeting, not buried in ToS ([sota.io Art. 50 guide](https://sota.io/blog/eu-ai-act-art50-transparency-saas-developer-guide-2026)).
- **Synthetic content labelling (Art. 50(2)/(4)):** AI-generated images/audio/video must be marked machine-readably (preserve provider watermarks/C2PA metadata in your pipeline; don't strip them). Deepfakes always need visible labels. AI text "informing the public on matters of public interest" needs disclosure unless human-reviewed with editorial responsibility ([EC digital-strategy](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai), [Grid Dynamics](https://www.griddynamics.com/blog/eu-ai-act-compliance)).
- **No SME exemption from Art. 50**, but enforcement is expected to start with egregious cases (undisclosed human-impersonating bots) ([aiactblog](https://www.aiactblog.nl/en/ai-act/artikel/50), [sota.io](https://sota.io/blog/eu-ai-act-gpai-provider-deployer-responsibility-2026)).
- Keep lightweight evidence: screenshots of disclosures, a one-page note of why you're not high-risk.

**Micro-company checklist (1–2 days of work):** (1) AI badge/disclosure on every chat surface; (2) "AI-generated" labels + metadata pass-through on generated media; (3) avoid Annex III use cases (hiring, credit, education scoring, etc.); (4) one-page internal compliance memo; (5) test before Aug 2026.

## 2. GDPR essentials for a solo SaaS

- **Required artifacts:** privacy policy at `/privacy`, cookie consent banner (for non-essential trackers), DPAs with each subprocessor (you mostly just accept the standard DPAs of Stripe/OpenAI/AWS/Vercel etc.), public subprocessor list, simple record of processing, SCCs handled via vendors' DPAs for cross-border transfer ([Cadence guide](https://cadence.withremote.ai/blog/saas-privacy-policy), [DPA guide 2026](https://blog.mean.ceo/data-processing-agreements-dpas/), [Promise Legal DPA template](https://promise.legal/templates/dpa)).
- **Data residency:** not mandatory to host in the EU; lawful transfer mechanisms (SCCs / EU–US DPF vendors) suffice for a small SaaS. Choosing EU regions on your host and OpenAI/Anthropic's EU data options reduces friction with EU customers.
- **Tools and costs:** Termly free tier → Starter $10/mo → Pro+ $15/mo (annual billing); iubenda from ~$3.49–$5.99/mo, Advanced ~$24.99/mo, strongest for multilingual EU; Cookiebot for the most robust consent banner (~$0–50/mo). A lawyer-drafted policy is ~$1,500–3,500 and unnecessary at this stage ([Termly GDPR](https://termly.io/solutions/gdpr-compliance/), [Termly vs iubenda](https://termly.io/resources/compare/termly-vs-iubenda/), [Cadence cost table](https://cadence.withremote.ai/blog/saas-privacy-policy)).
- **Realistic budget: ~$60–180/year** for a generator + CMP covering GDPR, ePrivacy, and US state laws.

## 3. United States

- **State privacy laws:** 20 comprehensive state laws in effect in 2026 (new in 2026: Indiana, Kentucky, Rhode Island). Most have thresholds of 100k consumers (or 25k + 50% revenue from data sales); Maryland and Rhode Island are the strictest at 35k consumers / 10k + 20% data-sale revenue, with no revenue floor. **A small SaaS under ~35k consumers per state and not selling data is generally below every threshold** — but the privacy-policy/consent tooling above covers CCPA-style disclosures anyway. Note Connecticut's July 1, 2026 amendment requiring privacy notices to disclose whether personal data trains LLMs ([MultiState 2026 tracker](https://www.multistate.us/insider/2026/2/4/all-of-the-comprehensive-privacy-laws-that-take-effect-in-2026), [Axiom](https://www.axiomlaw.com/blog/state-privacy-laws), [Shumaker](https://www.shumaker.com/insight/the-patchwork-of-data-privacy-laws-recent-developments-and-implications/)).
- **FTC:** Section 5 applies to anyone selling to US consumers regardless of where you're based. "Operation AI Comply" targets deceptive AI claims: exaggerated capability claims, fake "AI-powered" labels, tools that facilitate deception (e.g., fake-review generators). Cleo AI paid $17M in March 2025. Rule: every marketing claim about what your AI does must be truthful and substantiated; don't promise outcomes ("guaranteed first-page SEO") you can't prove ([Holland & Knight](https://www.hklaw.com/en/insights/publications/2025/06/ftc-evaluating-deceptive-artificial-intelligence-claims), [MN legal guide 2026](https://mn.gov/deed/assets/a-legal-guide-to-privacy-and-data-security-2026_ACC_tcm1045-606481.pdf)).
- **Sales tax:** fully handled by a Merchant of Record (Paddle/Lemon Squeezy are the legal seller and collect/remit US sales tax and EU VAT) — this is the single biggest compliance simplification for a foreign solo founder ([Lemon Squeezy MoR docs](https://docs.lemonsqueezy.com/help/payments/merchant-of-record), [Paddle handbook](https://www.paddle.com/seller-guides/seller-handbook)).

## 4. AI-specific risks

- **Copyright of outputs:** USCO Part 2 report (Jan 2025) — purely AI-generated output is **not copyrightable**, regardless of prompt sophistication; protection attaches only to perceptible human contributions (selection, arrangement, modification), case by case. Implication: your customers' AI outputs can be freely copied by others, and so can yours — don't market "you own exclusive rights to outputs." Part 3 (training-data fair use/liability) released in pre-publication May 2025 ([USCO report PDF](https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-2-Copyrightability-Report.pdf), [Skadden](https://www.skadden.com/insights/publications/2025/02/copyright-office-publishes-report), [Jones Day](https://www.jonesday.com/en/insights/2025/02/copyrightability-of-ai-outputs-us-copyright-office-analyzes-human-authorship-requirement)).
- **Liability for outputs:** *Moffatt v. Air Canada* (2024) — you are fully liable for what your AI tells customers; "the chatbot is a separate entity" fails. Over 900 documented AI-hallucination court cases; API providers disclaim output liability downstream to you ([ABA](https://www.americanbar.org/groups/business_law/resources/business-law-today/2024-february/bc-tribunal-confirms-companies-remain-liable-information-provided-ai-chatbot/), [Pinsent Masons](https://www.pinsentmasons.com/out-law/news/air-canada-chatbot-case-highlights-ai-liability-risks), [Forbes Councils](https://councils.forbes.com/blog/the-new-ai-vendor-checklist-drift-controls-red-team-testing-liability)). Mitigate with ToS disclaimers, accuracy warnings in-product, and avoiding advice-like outputs (legal/medical/financial).
- **Can you resell outputs?** Yes. OpenAI Business Terms: you own Output ("We hereby assign to you all our right, title, and interest, if any, in and to Output") and may build commercial products on it; you may **not** resell raw API/account access or use Output to train competing models ([OpenAI Business Terms](https://openai.com/policies/nov-2023-business-terms/), [OpenAI ToU](https://openai.com/policies/row-terms-of-use/)). Anthropic Commercial Terms: same — you own Outputs, Anthropic won't train on your content ([Anthropic terms summary](https://conductatlas.com/platform/anthropic/anthropic-commercial-terms/output-ownership-and-no-model-training/)). You remain responsible for evaluating outputs and end-user compliance with [usage policies](https://openai.com/policies/usage-policies/) — meaning **you must do basic content moderation** of user inputs/outputs (use the free moderation endpoints) or risk API account termination.

## 5. Payment / MoR risks

- **Category restrictions:** Paddle's AUP **explicitly prohibits AI image generators, deepfakes, face swaps, and voice cloning** (driven by Visa/Mastercard rules); AI code/writing/analytics tools are fine. Lemon Squeezy has no AI-specific ban but AI keywords trigger manual review (days to weeks). Get written pre-approval from the MoR before building checkout ([Freemius comparison](https://freemius.com/blog/payment-platform-restrictions-ai-apps/), [Paddle AUP analysis](https://www.boathouse.co/paddle-video-series-episode/34-aup-update-gen-ai)).
- **Chargebacks:** digital goods run 1.0–2.0%, SaaS 0.7–1.2% — among the highest of any category. Paddle treats >0.75% as unacceptable; Visa VDMP triggers at 0.9%+100 disputes, Mastercard ECP at 1.5%. Chargeback fee ~$15 each, passed to you. Mitigations: generous instant refunds, clear billing descriptor, cancel-anytime, renewal reminders, server-side usage logs as dispute evidence ([Paddle handbook](https://www.paddle.com/seller-guides/seller-handbook), [Merrisk 2026 benchmarks](https://merrisk.com/blog/what-is-a-good-chargeback-rate-2026-industry-benchmarks), [Chargeflow](https://www.chargeflow.io/blog/chargeback-thresholds)).

## 6. Platform dependency

- **Prices:** yes, prices fell roughly 10x at the frontier and far more below it. Frontier: GPT-4 $30/$60 per M tokens (Mar 2023) → GPT-5.4 $2.50/$15 (2026) ≈ **12x cheaper input / ~94% index drop**. "Good-enough" tier fell 50–300x (GPT-4-class quality now $0.10–0.50/M via GPT-4o-mini/DeepSeek-class models) ([TokenCost price index](https://tokencost.app/blog/ai-price-index), [BenchLM pricing history](https://benchlm.ai/llm-pricing-trends), [AI Cost Check](https://aicostcheck.com/blog/ai-model-pricing-trends-2026), [TokenMix](https://tokenmix.ai/blog/ai-pricing-trends-history)). Tailwind for your margins, but it also collapses competitors' costs — moat must be product, not API arbitrage.
- **Deprecations/rate limits/bans:** ~14 major pricing/model inflection points in 36 months, ~90 days between major changes; models get deprecated on ~12–18 month cycles. Mitigations: abstract the LLM layer (e.g., OpenRouter/LiteLLM-style routing), keep 2+ providers integrated, monitor deprecation notices, comply strictly with usage policies (ban = business death for a single-provider product), and note OpenAI services may not be used from embargoed countries — run your API org under a clean, properly-domiciled entity/account.

## 7. China-side: receiving foreign income legally

- **Forex (结汇):** individuals have a **USD 50,000/year facilitation quota** for converting FX with just an ID. Above that, conversion is still allowed with genuine-transaction documents (contracts, invoices) — current-account income with real trade background is not capped, it just needs evidence ([SAFE guide PDF](https://www.safe.gov.cn/neimenggu/file/file/20200228/fa90770027ed4d919de981c09bc25751.pdf), [hulinike practical guide](https://www.hulinike.com/platforms/cross-border-profit-exchange-tax/)).
- **New AML rule:** from Jan 1, 2026, cross-border remittances ≥ ¥5,000 / $1,000 require sender-identity verification — verification only, does not change the $50k quota ([21jingji](https://www.21jingji.com/article/20251205/herald/b254b605f3fdb6150d57fa0f25a2312a.html), [Sina Finance](https://finance.sina.com.cn/roll/2025-12-05/doc-infzuert9389491.shtml)).
- **Channels:** Payoneer (mainland individuals OK, ~1.2% to CNY card, handles 涉外收入申报 via partner banks); Wise personal account works for receiving USD/EUR but no US-detail multi-currency account without a US address; Stripe direct requires a foreign company. MoR payouts (Paddle/LS) typically land via Payoneer/Wise/bank wire ([Payoneer docs](https://www.payoneer.com/zh-hans/rmb-tax-refunds/bank/), [overseas creator payment guide 2026](https://www.jichangcepi.com/monetize/overseas-creator-payment-tax-2026/)).
- **Tax (个税):** as a Chinese tax resident you must declare worldwide income. Foreign service/business income is declared in the annual reconciliation (Mar 1–Jun 30 of the following year) via the 个税 App's 境外所得 function; foreign tax paid is creditable. Golden Tax IV bank-data matching makes non-declaration of recurring large inflows a real audit risk (a Shenzhen seller's HK$23M undeclared income led to >¥4M in back taxes/penalties) ([STA expert explainer](https://www.chinatax.gov.cn/chinatax/n810219/n810780/c5241796/content.html), [ingstart](https://www.ingstart.com/blog/50561.html)).
- **No ICP / no Chinese company needed:** the 生成式AI暂行办法 (Interim Measures for Generative AI) applies only to services offered **to the public within mainland China** (Art. 2); R&D and overseas-facing services are explicitly out of scope. ICP filing applies to websites served from/into China. Practical hygiene: host abroad, don't market in China, geo-block or at least don't localize for mainland users, don't accept CNY domestic payments, don't train on mainland personal data ([CAC text](https://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm), [JunHe analysis](https://www.junhe.com/legal-updates/2243?locale=zh)). Note: there is no explicit prohibition on a Chinese individual operating an overseas-facing SaaS, but stay clean on forex/tax (above) and avoid content that violates Chinese law even when produced abroad.

## 8. Public order / ethics (公序良俗) — categories to avoid

Avoid entirely (illegal, MoR-prohibited, API-policy-violating, or EU-AI-Act-prohibited):
- **Deepfakes / face swap / voice cloning** of real people (Paddle bans; EU Art. 50 labelling; USCO Part 1 flags digital replicas as needing federal legislation).
- **NSFW / adult AI content** (MoR & card-network prohibited; high chargeback category).
- **Academic-cheating tools** (essay-mills marketing; FTC deception exposure; reputational).
- **Untargeted scraping of personal data / facial images** (EU AI Act Art. 5 prohibited practice since Feb 2025 — Clearview-style; GDPR violations) ([EU AI Act prohibited practices](https://euaiactguide.com/prohibited-ai-practices-2026/), [EC AI Act overview](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai)).
- **Emotion recognition in workplace/education**, social scoring, fake reviews / astroturfing tools (FTC), anything advising on medicine/law/finance without disclaimers.

Responsible-AI disclosure best practices: visible AI badge, model/provider disclosure in docs, accuracy disclaimer, feedback/report-abuse button, public subprocessor + AI-usage page, and human-review claims only if true.

---

## Practical Compliance Checklist (with costs)

**One-time (total ≈ $0–500, mostly time):**

| # | Item | Cost |
|---|---|---|
| 1 | Confirm product category is MoR-acceptable (email Paddle/LS before building) | $0 |
| 2 | Privacy policy + ToS + cookie policy via Termly/iubenda | $0–50 |
| 3 | EU AI Act Art. 50 UI: AI-interaction badge, "AI-generated" labels, metadata pass-through | $0 (dev time) |
| 4 | ToS clauses: output accuracy disclaimer, no-copyright-warranty on outputs, acceptable-use policy, refund policy | $0 (template) or ~$300 lawyer review |
| 5 | Public subprocessor page (`/subprocessors`) + accept vendor DPAs | $0 |
| 6 | Wire moderation endpoint on inputs/outputs; abuse-report button | $0 (OpenAI moderation is free) |
| 7 | LLM abstraction layer + second provider integrated | $0 (dev time) |
| 8 | Payoneer/Wise account + bookkeeping spreadsheet for 结汇 evidence | $0 |
| 9 | One-page internal AI Act memo (risk classification, disclosure screenshots) | $0 |

**Recurring (total ≈ $150–800/year + taxes):**

| Item | Cost |
|---|---|
| Termly Pro+ or iubenda Essentials (policy + CMP + consent logs) | $60–180/yr |
| MoR fees (Paddle ~5% + $0.50; LS ~5% + $0.50) — replaces sales tax/VAT compliance | % of revenue |
| Payoneer/Wise withdrawal + FX | ~0.4–1.2% of payouts |
| Chargeback fees | ~$15/dispute |
| 个税 annual reconciliation (DIY via App, or accountant) | ¥0–3,000/yr |
| Quarterly review: API ToS changes, model deprecations, new state laws, AI Act Omnibus final text | time only |
| Optional: E&O/cyber insurance once revenue is meaningful | ~$500–2,000/yr |

---

## Top-10 Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | **MoR account rejection/suspension** (AI category flagged, chargebacks >0.75%) | Medium | Critical — revenue stops | Pre-approve category in writing; avoid image/voice-gen primary output; instant refunds; keep dispute rate <0.5%; have backup MoR onboarded |
| 2 | **LLM API account ban / ToS violation** (user abuse passed through your key) | Medium | Critical | Moderation on inputs/outputs; AUP for users; 2+ providers behind abstraction layer; clean account ownership/domicile |
| 3 | **China tax non-compliance** (undeclared foreign income caught by Golden Tax IV) | Medium-High if ignored | High — back taxes + penalties | Declare via 个税 App annually; keep contracts/invoices/payout records; consider accountant once >$50k/yr |
| 4 | **Forex friction** (>$50k/yr conversions queried; AML identity checks) | Medium | Medium | Keep transaction evidence; use Payoneer's declared-channel; convert above quota with documentation rather than splitting accounts (smurfing is itself a red flag) |
| 5 | **EU AI Act Art. 50 non-compliance after Aug 2, 2026** | Low-Medium | Medium (fines unlikely first; MoR/customer trust damage likelier) | Ship disclosure UI + content labels before Aug 2026; keep compliance memo |
| 6 | **Liability for harmful/wrong AI outputs** (Air Canada-style claim, FTC deception) | Low-Medium | Medium-High | Disclaimers in UI+ToS; no regulated advice verticals; truthful marketing claims only; logs of what was shown |
| 7 | **Platform price/deprecation shock** (model retired, price restructure, rate limits) | High (frequency) / Low (severity per event) | Medium | Provider-agnostic architecture; usage-based pricing to customers; margin buffer; monitor deprecation calendars |
| 8 | **Commoditization from falling LLM prices** (competitors replicate at 10x lower cost) | High | High (business model) | Moat = workflow/data/distribution, not API access; reprice as costs fall |
| 9 | **GDPR/state-privacy complaint** (no consent banner, DSAR ignored) | Low at small scale | Medium | Termly/iubenda CMP + DSAR inbox; don't sell data; EU-region hosting options; stay under state thresholds |
| 10 | **Chinese regulatory reinterpretation** (overseas-facing AI services by residents drawn into scope, or capital controls tighten) | Low | High | Strict no-mainland-users posture; clean tax/forex record; contingency: HK/Singapore/US entity when revenue justifies (~$2–5k setup) |

**Bottom line:** this business model is viable and the compliance load for a micro company is light (~$200–500/yr in tools) **if** you (a) pick a non-prohibited product category and clear it with the MoR first, (b) ship EU Art. 50 disclosure/labelling before Aug 2, 2026, (c) declare Chinese income annually, and (d) architect away single-provider dependency. The two existential risks are payment-rail loss and API account loss — both mitigated by category choice, moderation, and redundancy rather than money.

 I've got solid coverage across all the key compliance areas now. There are a few minor gaps I could chase down—like the specifics of Operation AI Comply and OpenAI's account deprecation policies—but I have enough to move forward. Time to structure this into a markdown report with sources and build out a practical compliance checklist covering both one-time setup and ongoing requirements.