# -*- coding: utf-8 -*-
"""
Opportunity scoring matrix under the binding constraints:
solo founder · 20 h/week · RMB 10-50k budget · zero-human operations ·
global market · 2026 competitive conditions.

Every score cites evidence from research/ (archetypes.md, acquisition_survival.md,
compliance_risk.md, 2026-solo-ai-saas-cost-benchmarks.md).

Scale: 1-10, higher is better. "space" and "risk" are inverted dimensions
(higher = less saturated / safer).
"""

WEIGHTS = {
    "ops":    0.22,   # 零人工可运营性(支持负担、运营自动化)
    "dist":   0.20,   # 分发可自动化(无受众冷启动)
    "build":  0.15,   # 单人 20h/周可建可维护
    "wtp":    0.15,   # 付费意愿与留存
    "margin": 0.08,   # 毛利与成本结构
    "space":  0.10,   # 竞争空间(饱和度反向)
    "risk":   0.10,   # 合规与平台安全(风险反向)
}

CANDIDATES = [
    {
        "name": "面向 AI 代理开发者的利基 API",
        "name_en": "Niche developer API for AI-agent builders",
        "selected": True,
        "scores": {"ops": 9, "dist": 8, "build": 8, "wtp": 8, "margin": 9, "space": 7, "risk": 8},
        "rationale": {
            "ops": "支持负担为全部原型最低:开发者读文档自助,ScreenshotOne 400付费客户仅每周1-3个工单;ScrapingBee 经验:砍掉低价档可再消除大部分工单",
            "dist": "SEO+开发者内容+免费工具漏斗,Bannerbear/ScreenshotOne 零广告纯内容增长,完全无需既有受众;代价是慢(12-18个月到$5-10k MRR)",
            "build": "单一职能API表面积小,无UI重负担;一人20h/周可维护",
            "wtp": "开发者/基础设施工具流失率为全行业最低(月1.8-3%,Focus Digital);嵌入生产代码形成真实切换成本;$29-149/月定价已验证",
            "margin": "廉价模型(DeepSeek/nano级$0.14-0.20/M tokens)使COGS<20%,毛利80%+",
            "space": "通用品类(截图/PDF/爬虫)拥挤,但2026年AI代理消费API为最不饱和的开发者利基(调研结论),为新需求浪潮",
            "risk": "文本/数据类API是MoR明确允许的品类;多供应商抽象层可对冲API依赖",
        },
    },
    {
        "name": "垂直 AI 微 SaaS(自身熟悉的利基)",
        "name_en": "Vertical AI micro-SaaS in an inhabited niche",
        "selected": False,
        "scores": {"ops": 6, "dist": 5, "build": 7, "wtp": 8, "margin": 7, "space": 6, "risk": 8},
        "rationale": {
            "ops": "利基专业用户期待响应:$1k-25k MRR阶段每周5-15工单(Groundwork汇总)",
            "dist": "已验证最快路径(ChatSEO 3个月€14k MRR)全部依赖创始人已在利基内;冷启动无法自动化",
            "wtp": "与收入挂钩的专业工具付费意愿强($29-99/月)",
            "space": "明显利基(SEO/亚马逊/房产)已拥挤,冷门职业利基仍开放",
            "risk": "品类合规友好",
        },
    },
    {
        "name": "利基专业浏览器/市场插件",
        "name_en": "Niche professional browser/marketplace extension",
        "selected": False,
        "scores": {"ops": 8, "dist": 8, "build": 9, "wtp": 5, "margin": 9, "space": 5, "risk": 6},
        "rationale": {
            "ops": "工具型插件支持负担接近零;Shopify类除外(评分被商家支持期待拖低)",
            "dist": "市场自然搜索是唯一零受众第一天就有效的渠道(IndieLaunches:市场目录为第二大首批客户来源)",
            "wtp": "天花板低:典型$650-6.8k/月;消费者插件$3-10/月付费意愿弱",
            "space": "通用工具饱和,专业B2B利基中等",
            "risk": "平台政策风险(Manifest V3式变更)、评分绑架",
        },
    },
    {
        "name": "自助式 AI 生成工具(头像/字幕等)",
        "name_en": "Self-serve AI generation tools",
        "selected": False,
        "scores": {"ops": 7, "dist": 5, "build": 7, "wtp": 6, "margin": 5, "space": 2, "risk": 4},
        "rationale": {
            "ops": "退款与质量投诉可模板化,PhotoAI零雇员运营",
            "dist": "大赢家全部依赖2023窗口+受众或精确匹配域名($10k-35k,超全部预算)",
            "margin": "AI wrapper毛利仅25-35%(行业汇总);GPU成本高",
            "space": "高度饱和:AI头像市场12+家融资竞品,$9-18入场价;PDF.ai 2025年营收因拥挤下滑",
            "risk": "Paddle明确禁止AI图像生成/换脸/语音克隆——MoR渠道存在被拒风险",
        },
    },
    {
        "name": "SMB 网站 AI 客服机器人",
        "name_en": "SMB AI support chatbot (SiteGPT model)",
        "selected": False,
        "scores": {"ops": 4, "dist": 5, "build": 6, "wtp": 6, "margin": 6, "space": 2, "risk": 6},
        "rationale": {
            "ops": "品类讽刺:卖支持自动化却需要大量人工支持(非技术SMB买家手把手教学);SiteGPT首月流失50%为实证",
            "space": "极度饱和:品类标杆SiteGPT 2024年濒临折价出售;Intercom/Zendesk按解决量定价压价",
            "wtp": "替代人力故付费意愿尚可,但SMB月流失3-7%结构性偏高",
        },
    },
    {
        "name": "程序化 SEO 内容订阅站",
        "name_en": "Programmatic SEO content subscriptions",
        "selected": False,
        "scores": {"ops": 9, "dist": 2, "build": 8, "wtp": 4, "margin": 8, "space": 3, "risk": 3},
        "rationale": {
            "ops": "网站型业务支持接近零",
            "dist": "2026年3月Google核心更新对模板页站点造成50-93%流量清零且无申诉通道;AI Overviews使信息类CTR再降58-61%",
            "risk": "单平台依赖:一次算法更新=业务终结",
        },
    },
    {
        "name": "原方案:AI 模型训练与部署平台",
        "name_en": "Original plan: AI model training & deployment platform",
        "selected": False,
        "original_plan": True,
        "scores": {"ops": 2, "dist": 3, "build": 1, "wtp": 7, "margin": 3, "space": 2, "risk": 5},
        "rationale": {
            "ops": "企业级客户要求SLA、安全审计与人工售前售后,与零人工运营根本矛盾",
            "dist": "企业销售依赖人工外联与信任建立,无法自动化",
            "build": "GPU编排、分布式训练、多租户隔离为数十人团队工程量;1-5万元预算与GPU资本开支差2-3个数量级",
            "space": "直面 Hugging Face、Replicate、Modal、各大云厂商;无任何一人公司在此品类存活的实例",
            "margin": "GPU成本结构沉重,毛利远低于纯API编排",
        },
    },
]


def compute():
    out = []
    for c in CANDIDATES:
        total = sum(WEIGHTS[k] * v for k, v in c["scores"].items())
        out.append({**c, "weighted": round(total, 2)})
    out.sort(key=lambda x: -x["weighted"])
    return {"weights": WEIGHTS, "candidates": out}


if __name__ == "__main__":
    import json
    print(json.dumps(compute(), ensure_ascii=False, indent=2))
