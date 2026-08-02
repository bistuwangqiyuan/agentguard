# -*- coding: utf-8 -*-
"""
All model assumptions with sources. Source keys reference SOURCES at the bottom
and the full research dossiers in research/.

Currency: USD. RMB conversion at 7.1.

Business: niche developer API for AI-agent builders (selected by scoring.py),
sold globally via Merchant of Record as an individual, $29-49/mo tiers,
free-tool SEO funnel as primary distribution.
"""
from engine import ScenarioParams

# ---------------------------------------------------------------------------
# Shared cost-side parameters (identical across scenarios; all sourced)
# ---------------------------------------------------------------------------
_COSTS = dict(
    # Paddle / Lemon Squeezy 2026: 5% + $0.50/txn, no monthly minimum [cost_mor]
    mor_fee_pct=0.05,
    mor_fee_fixed=0.50,
    # DeepSeek V4 Flash $0.14/$0.28 per 1M tok; nano $0.20/$1.25 [cost_llm].
    # A paying API customer consuming ~3M tok/mo on cheap-model routing ≈ $1-2.5.
    ai_cost_paid_user=1.80,
    # Free tier hard-capped (e.g. 300 calls/mo) on cached cheap models [cost_llm]
    ai_cost_free_user=0.08,
    free_active_share=0.25,
    # Domain $11/yr + Termly $10/mo + dev/test LLM budget $20-75/mo + misc
    # ≈ $31-133/mo months 1-6 per burn table [cost_burn]; $55 ≈ steady average
    fixed_cost=55.0,
    # Cloudflare/Supabase free → Workers Paid $5+Supabase Pro $25 → scale steps
    # [cost_infra]
    infra_tiers=((0, 0.0), (200, 30.0), (1000, 95.0), (5000, 350.0), (20000, 900.0)),
    # RMB 30k mid-point of the 1-5万 budget = USD ~4,200
    starting_cash=4200.0,
    # Individual via MoR: domain $11 + compliance tooling yr1 $60 + design $50 +
    # buffer; no company needed at start [cost_company]
    one_time_setup=150.0,
    # ~7-18 support contacts /100 users/mo (B2C-weighted industry avg 7;
    # we take 18 = conservative) [arch_support]; docs+AI agent deflect 85%
    # (KB alone deflects 40-60%, docs-grounded AI agent on top) [arch_support]
    tickets_per_user_month=0.18,
    ai_deflection=0.85,
    minutes_per_human_ticket=8.0,
    weekly_hour_budget=20.0,
)

# ---------------------------------------------------------------------------
# Scenarios. Anchors:
#  conservative ≈ P25 of *surviving* products: typical month $500-700 MRR
#    at month 24 [dist_median500]
#  base ≈ median surviving product: ~$4.2k MRR at month 24 [dist_freemius],
#    12-18 months to $1k [dist_time]
#  upside ≈全体尝试的P90+:对标 ScreenshotOne($20k MRR @ 3yr)级别成功 [arch_api]
# Funnel rates anchored to ChartMogul 2026 (visitor→opt-in trial 4.5%,
# trial→paid 8.9%, freemium→paid 5.5%) and rankinglens (1000 visitors →
# 1-4 paying) [funnel_chartmogul]; SEO ramp to logistic cap anchored to
# new-domain benchmarks (month 12: 1k-5k visits, month 24: 3k-15k median,
# 20k-50k top quartile) [seo_timeline].
# Churn: dev/infra verified 1.8-3%/mo, micro-business 8.9%/mo; indie-dev
# customer base blends to 4-6% [churn_vertical].
# ---------------------------------------------------------------------------
SCENARIOS = {
    "conservative": ScenarioParams(
        name="conservative",
        seo_visitors_cap=6000.0, seo_t_mid=22.0, seo_k=0.18,
        launch_visitors=(1200.0, 700.0, 400.0),
        other_visitors_base=150.0, wom_coeff=3.0,
        visitor_signup_rate=0.030, signup_paid_rate=0.045,
        churn_start=0.10, churn_floor=0.060,
        arpu=24.0,
        **_COSTS,
    ),
    "base": ScenarioParams(
        name="base",
        seo_visitors_cap=14000.0, seo_t_mid=18.0, seo_k=0.18,
        launch_visitors=(2000.0, 1200.0, 800.0),
        other_visitors_base=300.0, wom_coeff=5.0,
        visitor_signup_rate=0.038, signup_paid_rate=0.055,
        churn_start=0.085, churn_floor=0.048,
        arpu=28.0,
        **_COSTS,
    ),
    "upside": ScenarioParams(
        name="upside",
        seo_visitors_cap=30000.0, seo_t_mid=16.0, seo_k=0.18,
        launch_visitors=(3000.0, 2000.0, 1200.0),
        other_visitors_base=500.0, wom_coeff=7.0,
        visitor_signup_rate=0.045, signup_paid_rate=0.068,
        churn_start=0.075, churn_floor=0.042,
        arpu=32.0,
        **_COSTS,
    ),
}

# ---------------------------------------------------------------------------
# Monte Carlo sampling spec — calibrated to the observed cross-section of
# micro-SaaS outcomes at month 24 (all attempts):
#   below $1k: 60-72% [dist_freemius][dist_indielaunches]
#   $1k-5k:    18-25%
#   above $5k:  8-14%
#   above $10k: 3-6%  (IndieLaunches self-selected sample shows 10% above
#                      $10k, RockingWeb broader sample ~2-4%; we sit between)
# Achieved calibration (seed 20260611, n=20k): 65.4% / 23.9% / 10.7% / 4.8%
# ---------------------------------------------------------------------------
MC_SPEC = {
    "p_flop": 0.55,                # share of attempts that never find PMF/distribution
    "flop_cap_mult": (0.02, 0.15),
    "flop_conv_mult": (0.25, 0.7),
    "cap_median": 8000.0, "cap_sigma": 1.10,
    "signup_median": 0.035, "signup_sigma": 0.45,
    "paid_median": 0.050, "paid_sigma": 0.50,
    "churn_floor_mu": 0.052, "churn_floor_sd": 0.012,
    "arpu_median": 27.0, "arpu_sigma": 0.30,
    "wom_median": 4.0, "wom_sigma": 0.60,
    "t_mid_mu": 19.0, "t_mid_sd": 4.5,
}
MC_RUNS = 20000
MC_SEED = 20260611

# ---------------------------------------------------------------------------
# Investment-lens spec: treat the venture as a self-funded bet of cash + time.
# Used by montecarlo.compute_invest for win rate, P/L ratio, risk-adjusted
# annualized return and Kelly fraction.
# ---------------------------------------------------------------------------
INVEST = {
    "horizon_months": 36,
    "hours_per_week": 20.0,
    "weeks_per_year": 52.0,
    # Opportunity cost of founder time: Upwork live-posting median for
    # full-stack/backend devs $25/h (p25 $20, p75 $36-40); Upwork's own
    # web-dev cost page median $30/h [invest_opp]. Base $25, range $15-40.
    "opp_rate": 25.0,
    "opp_rate_low": 15.0,
    "opp_rate_high": 40.0,
    # Exit residual: Acquire.com median 3.9x TTM SDE [market_exit], then a
    # 50% haircut for sale probability & illiquidity (only a fraction of
    # fairly-priced listings sell; no verified figure -> conservative 0.5).
    "exit_multiple": 3.9,
    "exit_haircut": 0.5,
    # Kill gates mirroring the milestone section: abandon at m6 if MRR<$150,
    # at m12 if MRR<$400 (sunk time stops, next wedge starts).
    "gate_m6_mrr": 150.0,
    "gate_m12_mrr": 400.0,
}

# ---------------------------------------------------------------------------
# Unit economics waterfall (per paying user per month, base scenario)
# ---------------------------------------------------------------------------
_arpu = SCENARIOS["base"].arpu
_mor = _arpu * _COSTS["mor_fee_pct"] + _COSTS["mor_fee_fixed"]
_ai = _COSTS["ai_cost_paid_user"]
_infra = 0.45        # blended infra per paying user at ~500-user scale
_free_burden = 0.55  # free-tier AI cost carried per paying user
UNIT_ECON = {
    "arpu": _arpu,
    "waterfall": [
        ["ARPU", _arpu],
        ["MoR渠道费", round(_mor, 2)],
        ["AI推理", _ai],
        ["免费层负担", _free_burden],
        ["基础设施", _infra],
        ["毛利", round(_arpu - _mor - _ai - _free_burden - _infra, 2)],
    ],
    "gross_margin_pct": round((_arpu - _mor - _ai - _free_burden - _infra) / _arpu * 100, 1),
}

# ---------------------------------------------------------------------------
# One-time startup costs, USD (individual seller via MoR — no company needed
# at start [cost_company])
# ---------------------------------------------------------------------------
STARTUP_COSTS = [
    ["域名(首年, Cloudflare/Porkbun)", 11],
    ["合规工具首年(Termly等隐私政策+CMP)", 60],
    ["设计资源/品牌(模板、图标)", 50],
    ["公司注册", 0],
    ["预备金(MoR审核期测试、杂项)", 29],
]
STARTUP_TOTAL = sum(x[1] for x in STARTUP_COSTS)

# ---------------------------------------------------------------------------
# Market sizing (sources in SOURCES)
# ---------------------------------------------------------------------------
MARKET = {
    "tam_2026_low_b": 10.9, "tam_2026_high_b": 12.1,
    "tam_2030_low_b": 47.0, "tam_2030_high_b": 53.2,
    "tam_cagr_low": 0.44, "tam_cagr_high": 0.496,
    # Empirical solo-achievable band for comparable utility APIs (verified):
    "comparable_arr_low": 200000,   # ScreenshotOne $200k ARR @ ~3yr, solo
    "comparable_arr_high": 1000000, # Bannerbear $1M ARR @ 6yr, solo
    # SOM = what the model itself produces (base scenario), see results.json
}

# ---------------------------------------------------------------------------
# Sources registry — keys cited across params and the business plan
# ---------------------------------------------------------------------------
SOURCES = {
    # Revenue distribution & timelines
    "dist_freemius": "Freemius《State of Micro-SaaS 2025》(转引RockingWeb 2025千产品分析):约70%低于$1k MRR,18%在$1k-5k,盈利产品中位≈$4.2k — freemius.com/blog/state-of-micro-saas-2025/(方法论软,经多源交叉后作方向性使用)",
    "dist_indielaunches": "IndieLaunches 326个HN项目分析(2024-25,160个披露收入):中位$500/月;<$500占18%,$500-1k占46%,$1k-5k占19%,$5k-10k占8%,$10k+占10%(自选样本偏乐观) — indielaunches.com/indie-maker-analytics-2024-2025-projects/",
    "dist_median500": "三个独立数据集(RockingWeb/Freemius/IndieLaunches)交叉一致的『典型月份』≈$500/月 — saasranger.com/blog/micro-saas-revenue-reality-what-1000-founders-actually-earn/",
    "dist_time": "到$1k MRR典型12-18个月;首个付费客户中位~3个月;『92%在18个月内失败』(RockingWeb,弱来源,作方向性参考)",
    # Funnel & channels
    "funnel_chartmogul": "ChartMogul 2026 SaaS转化报告(200个产品):访客→opt-in试用4.5%,试用→付费8.9%,freemium→付费中位5.5%;每千访客4-11个付费客户 — chartmogul.com/reports/saas-conversion-report/",
    "seo_timeline": "新域名SEO基准:第6个月0-500访客/月,第12个月1k-5k,第24个月中位3k-15k、前四分位20k-50k — resources.averi.ai/benchmarks;Ahrefs:新页面<6%一年内进前10",
    "seo_aio": "Ahrefs(2025-12,30万关键词):AI Overviews使首位CTR下降~58%;Seer:信息类查询CTR 1.76%→0.61%;交易类/长尾查询受影响最小(-5-8%) — ahrefs.com/blog/ai-overviews-reduce-clicks-update/",
    "channel_first": "IndieLaunches 326项目首批客户主渠道:口碑40、应用市场33、SEO 27、社区/Reddit 20、外联15、Product Hunt 8-9、付费广告4 — saasranger.com",
    "channel_ph": "Product Hunt 2026:发布量2.8倍(月均~1万,2026-03达21,040),中位发布≈0客户;TOP10≈1.5-3k访客、5-20付费 — findsimilarstartups.com(PH API数据)",
    "channel_affiliate": "Rewardful平台数据($68.4M联盟收入):仅1.28%的联盟客产生过销售;15.6%的项目长期存活 — rewardful.com/articles/state-of-saas-affiliate-programs-report",
    # Churn
    "churn_vertical": "Focus Digital分行业月流失率:基础设施/DevOps 1.8%、BI 3.2%、营销自动化4.8%、电商工具6.8%;按客群:SMB 3-7%、微型企业8.9% — focus-digital.co/average-churn-rate-by-industry-saas/",
    # Costs
    "cost_llm": "DeepSeek V4 Flash $0.14/$0.28 per 1M tokens(缓存命中输入$0.0028);OpenAI gpt-5.4-nano $0.20/$1.25;Gemini 3.1 Flash-Lite $0.25/$1.50;批处理一律5折 — api-docs.deepseek.com、openai.com/api/pricing(2026-06)",
    "cost_llm_trend": "前沿模型价格2023-2026下降约12倍(GPT-4 $30/$60 → GPT-5.4 $2.50/$15);『够用层级』下降50-300倍 — tokencost.app/blog/ai-price-index",
    "cost_mor": "Paddle/Lemon Squeezy 2026:5%+$0.50/笔,无月费无最低额,全权处理美国销售税+欧盟VAT;Stripe已于2024-07收购Lemon Squeezy,2026仍独立运营 — paddle.com/pricing",
    "cost_infra": "Cloudflare Workers免费层10万请求/日且允许商用;Supabase免费层500MB;R2出口流量永久免费;PostHog免费100万事件/月 — developers.cloudflare.com/workers/platform/pricing/(2026-06)",
    "cost_burn": "前6个月固定月燃烧$31-133,合计≈$360;最低一次性启动成本≈$11(个人+MoR,无需公司) — research/2026-solo-ai-saas-cost-benchmarks.md",
    "cost_company": "2026年Paddle/Lemon Squeezy允许个人卖家入驻,MoR为法律卖方;Stripe Atlas美国LLC $500一次性+$450-900/年;建议年收入>$5万再设实体 — dodopayments.com/blogs/accept-payments-without-company",
    # Archetype evidence
    "arch_api": "ScreenshotOne(单人):2022-05创立→2024-09 $10k MRR→2025-06 $20k MRR/400+付费客户;Bannerbear(单人):18个月到$10k MRR,6年$1M ARR;ScrapingBee:2.5年$1M ARR→2025-06八位数全现金退出 — screenshotone.com/blog、bannerbear.com/journey-to-10k-mrr",
    "arch_support": "单人创始人在$1k-25k MRR阶段每周5-15工单(≈3-10小时);完善知识库可消解40-60%;行业均值≈每百活跃用户每月7次支持接触 — groundworkblog.com、happysupport.ai",
    "arch_sitegpt": "SiteGPT($100k MRR传言不实):实际2025-12为$15.8k MRR,2026年初过$20k,2人团队,2024年曾濒临折价出售;其流量90%来自50+免费SEO工具 — arrfounder.com、sqmagazine.co.uk/sitegpt-statistics/",
    "arch_wrapper": "AI wrapper死亡案例:Builder.ai破产(2025-05)、Forefront关停、Jasper营收18个月-61%(次级来源);wrapper毛利25-35% vs 传统SaaS 70-85% — theaicemetery.com、blog.vibe-eval.com",
    "arch_pseo": "2026-03 Google核心更新:模板页站点两周内流量-50%~-93%且无申诉通道 — digitalapplied.com/blog/programmatic-seo-after-march-2026",
    "arch_supply": "供给洪水:iOS提交2026Q1同比+84%;Lovable单平台日增20万项目;PH发布量2.8倍 — officechai.com、aienabledpm.com(Sensor Tower/FT数据)",
    "arch_unfair": "已核实的成功者均有不可复制的分发资产:Levels 35-60万粉丝、Postma此前$1M退出、Marc Lou 32.3万粉丝、Damon Chen $10k-35k精确匹配域名 — research/archetypes.md §1.2",
    # Market
    "market_agents": "AI代理市场:2026年$10.9-12.1B,2030年$47-53.2B,CAGR 44-49.6%(Grand View Research、BCC、TBRC、MarketsandMarkets共识区间)— grandviewresearch.com/industry-analysis/ai-agents-market-report",
    "market_exit": "Acquire.com 2025-26:小型SaaS成交中位3.9x TTM利润(SDE口径,≈2.5-3x收入);AI功能不带来自动溢价;挂牌-成交80-90天 — blog.acquire.com/acquire-com-biannual-acquisition-multiples-report-jan-2026/",
    # Probability synthesis
    "prob_synthesis": "调研综合估计(胜任的单人技术创始人,2026条件):12个月内$1k+ MRR概率15-25%,$5k+ 5-8%;24个月内$1k+ 25-35%,$5k+ 10-15%,$10k+ 5-8% — research/acquisition_survival.md §7",
    # Investment lens
    "invest_opp": "创始人时间机会成本:Upwork 2026 活跃订单中位价全栈/后端开发 $25/h(p25 $20,p75 $36-55,11,000+订单抓取);Upwork官方网页开发者成本页中位 $30/h(典型$15-50) — upwatcher.io/guides/upwork-hourly-rate-distribution-2026/、upwork.com/hire/web-developers/cost/",
    # Compliance
    "comp_aiact": "EU AI Act Art.50透明义务2026-08-02生效(聊天机器人披露),AI内容机器可读标记2026-12-02;小微公司合规负担≈1-2天工作+$60-180/年工具 — complydrive.ai、hrzn.pro",
    "comp_output": "OpenAI/Anthropic商业条款均将输出所有权转让给客户,可商用转售;但须对输入/输出做内容审核否则面临封号 — openai.com/policies/nov-2023-business-terms/",
    "comp_paddle_ban": "Paddle AUP明确禁止AI图像生成器/深度伪造/换脸/语音克隆(Visa/MC驱动);AI代码/写作/分析工具允许 — freemius.com/blog/payment-platform-restrictions-ai-apps/",
    "comp_china": "生成式AI暂行办法仅适用于向中国境内公众提供服务(第2条),纯出海服务不在范围内;个人结汇便利化额度$5万/年,超出可凭真实交易单证办理;境外所得须于次年3-6月个税年度汇算申报 — cac.gov.cn、chinatax.gov.cn",
    "comp_chargeback": "数字商品拒付率基准0.5-1.0%(均值0.54%),Paddle视>0.75%为不可接受,Visa VAMP阈值1.5%;每笔拒付费~$15 — paycompass.com、paddle.com/seller-guides",
    "comp_liability": "Moffatt v. Air Canada(2024):企业对其AI输出全责;900+起AI幻觉诉讼;缓解=免责声明+避开法律/医疗/金融建议场景 — americanbar.org",
}
