# -*- coding: utf-8 -*-
"""Apple-styled SVG chart generation (matplotlib)."""
from __future__ import annotations

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np

INK = "#1d1d1f"
SUB = "#86868b"
GRID = "#e8e8ed"
BLUE = "#0071e3"
GREEN = "#34c759"
ORANGE = "#ff9500"
RED = "#ff3b30"
PURPLE = "#af52de"
TEAL = "#5ac8fa"

plt.rcParams.update({
    "font.family": "sans-serif",
    "font.sans-serif": ["Segoe UI", "Microsoft YaHei", "Arial"],
    "svg.fonttype": "none",
    "axes.edgecolor": GRID,
    "axes.labelcolor": SUB,
    "text.color": INK,
    "xtick.color": SUB,
    "ytick.color": SUB,
    "axes.grid": True,
    "grid.color": GRID,
    "grid.linewidth": 0.8,
    "axes.axisbelow": True,
    "figure.facecolor": "white",
    "axes.facecolor": "white",
})


def _ax(figsize=(9.2, 4.6)):
    fig, ax = plt.subplots(figsize=figsize, dpi=110)
    for s in ("top", "right", "left"):
        ax.spines[s].set_visible(False)
    ax.spines["bottom"].set_color(GRID)
    ax.tick_params(length=0, labelsize=10)
    return fig, ax


def _kfmt(x, _=None):
    if abs(x) >= 1_000_000:
        return f"${x/1e6:.1f}M"
    if abs(x) >= 1000:
        return f"${x/1000:.0f}k"
    return f"${x:.0f}"


def _save(fig, path):
    fig.tight_layout(pad=1.2)
    # generous padding: browser font metrics differ from matplotlib's estimate
    # (svg.fonttype="none"), so labels can overflow a tight viewBox
    fig.savefig(path, format="svg", bbox_inches="tight", pad_inches=0.28)
    plt.close(fig)
    print("wrote", path)


def chart_mrr_scenarios(scen: dict, path: str):
    fig, ax = _ax((9.2, 3.9))
    colors = {"conservative": SUB, "base": BLUE, "upside": GREEN}
    labels = {"conservative": "保守(存活产品 P25)", "base": "基准(存活产品中位)", "upside": "乐观(全体 P90)"}
    for name, data in scen.items():
        m = data["month"]
        ax.plot(m, data["mrr"], lw=2.4, color=colors[name], label=labels[name])
        ax.annotate(_kfmt(data["mrr"][-1]), (m[-1], data["mrr"][-1]),
                    textcoords="offset points", xytext=(6, -3),
                    fontsize=10, color=colors[name], fontweight="bold")
    ax.yaxis.set_major_formatter(mticker.FuncFormatter(_kfmt))
    ax.set_xlabel("月份")
    ax.set_ylabel("MRR (USD)")
    ax.set_xlim(1, 63)
    ax.legend(frameon=False, fontsize=10, loc="upper left")
    _save(fig, path)


def chart_mc_fan(mc: dict, path: str):
    fig, ax = _ax((9.2, 3.4))
    months = np.arange(1, len(mc["mrr_percentiles"]["p50"]) + 1)
    p = mc["mrr_percentiles"]
    ax.fill_between(months, p["p10"], p["p90"], color=BLUE, alpha=0.10,
                    label="P10–P90", lw=0)
    ax.fill_between(months, p["p25"], p["p75"], color=BLUE, alpha=0.18,
                    label="P25–P75", lw=0)
    ax.plot(months, p["p50"], color=BLUE, lw=2.4, label="中位数 P50")
    ax.plot(months, p["p90"], color=GREEN, lw=1.2, ls="--", label="P90")
    ax.yaxis.set_major_formatter(mticker.FuncFormatter(_kfmt))
    ax.set_xlabel("月份")
    ax.set_ylabel("MRR (USD)")
    ax.set_xlim(1, 60)
    ax.legend(frameon=False, fontsize=10, loc="upper left")
    _save(fig, path)


def chart_mc_hist(mc: dict, path: str):
    fig, ax = _ax((9.2, 3.0))
    sample = np.array(mc["m24_sample"])
    sample = np.clip(sample, 1, None)
    bins = np.logspace(0, np.log10(max(sample.max(), 50000)), 40)
    ax.hist(sample, bins=bins, color=BLUE, alpha=0.85, edgecolor="white", lw=0.4)
    ax.set_xscale("log")
    for x, label, c in ((1000, "$1k", ORANGE), (5000, "$5k", GREEN), (10000, "$10k", PURPLE)):
        ax.axvline(x, color=c, lw=1.4, ls="--", alpha=0.9)
        ax.text(x, ax.get_ylim()[1] * 0.95, f" {label}", color=c, fontsize=10,
                va="top", fontweight="bold")
    ax.xaxis.set_major_formatter(mticker.FuncFormatter(_kfmt))
    ax.set_xlabel("第24个月 MRR(对数刻度)")
    ax.set_ylabel("模拟次数")
    _save(fig, path)


def chart_prob_ladder(mc: dict, path: str):
    fig, ax = _ax((9.2, 3.8))
    levels = [100, 500, 1000, 2000, 5000, 10000, 20000]
    months = ["m12", "m24", "m36", "m60"]
    colors = [TEAL, BLUE, PURPLE, INK]
    labels = ["12个月", "24个月", "36个月", "60个月"]
    x = np.arange(len(levels))
    w = 0.2
    for i, (m, c, lb) in enumerate(zip(months, colors, labels)):
        vals = [mc["prob_table"][m][f"ge_{l}"] * 100 for l in levels]
        bars = ax.bar(x + (i - 1.5) * w, vals, w, color=c, alpha=0.9, label=lb)
        for b, v in zip(bars, vals):
            if v >= 1:
                ax.text(b.get_x() + b.get_width() / 2, v + 1, f"{v:.0f}",
                        ha="center", fontsize=8, color=SUB)
    ax.set_xticks(x)
    ax.set_xticklabels([f"≥${l/1000:g}k" if l >= 1000 else f"≥${l}" for l in levels])
    ax.set_ylabel("达成概率 (%)")
    ax.set_ylim(0, 100)
    ax.legend(frameon=False, fontsize=10, ncols=4)
    _save(fig, path)


def chart_unit_econ(ue: dict, path: str):
    """Waterfall: ARPU -> fees/costs -> gross profit per paying user."""
    fig, ax = _ax((9.2, 3.4))
    steps = ue["waterfall"]  # list of (label, value); first positive, rest negative, last = result
    labels = [s[0] for s in steps]
    vals = [s[1] for s in steps]
    cum = 0.0
    for i, (lb, v) in enumerate(steps):
        if i == 0:
            ax.bar(i, v, color=BLUE, width=0.62)
            cum = v
            ax.text(i, v + 0.5, f"${v:.2f}", ha="center", fontsize=10, fontweight="bold")
        elif i == len(steps) - 1:
            ax.bar(i, v, color=GREEN, width=0.62)
            ax.text(i, v + 0.5, f"${v:.2f}", ha="center", fontsize=10,
                    fontweight="bold", color=GREEN)
        else:
            ax.bar(i, -v, bottom=cum, color=RED, alpha=0.75, width=0.62)
            ax.text(i, cum + 0.5, f"−${v:.2f}", ha="center", fontsize=10, color=RED)
            cum -= v
    ax.set_xticks(range(len(labels)))
    ax.set_xticklabels(labels, fontsize=10)
    ax.set_ylabel("USD / 付费用户 / 月")
    _save(fig, path)


def chart_cash(scen: dict, path: str):
    fig, ax = _ax((9.2, 3.8))
    colors = {"conservative": SUB, "base": BLUE, "upside": GREEN}
    labels = {"conservative": "保守", "base": "基准", "upside": "乐观"}
    for name, data in scen.items():
        ax.plot(data["month"], data["cash"], lw=2.2, color=colors[name],
                label=labels[name])
    ax.axhline(0, color=RED, lw=1.2, ls="--", alpha=0.8)
    ax.yaxis.set_major_formatter(mticker.FuncFormatter(_kfmt))
    ax.set_xlabel("月份")
    ax.set_ylabel("现金余额 (USD)")
    ax.legend(frameon=False, fontsize=10, loc="upper left")
    _save(fig, path)


def chart_sensitivity(sens: list, path: str):
    """sens: list of dicts {label, low, high, base} for m36 MRR."""
    fig, ax = _ax((9.2, 4.4))
    sens = sorted(sens, key=lambda d: abs(d["high"] - d["low"]))
    y = np.arange(len(sens))
    base = sens[0]["base"]
    lows = [min(d["low"], d["high"]) for d in sens]
    highs = [max(d["low"], d["high"]) for d in sens]
    span = max(highs) - min(lows)
    for i, d in enumerate(sens):
        lo, hi = sorted((d["low"], d["high"]))
        ax.barh(i, hi - lo, left=lo, color=BLUE, alpha=0.75, height=0.55)
        ax.text(lo - span * 0.015, i, _kfmt(lo), ha="right", va="center", fontsize=9, color=SUB)
        ax.text(hi + span * 0.015, i, _kfmt(hi), ha="left", va="center", fontsize=9, color=SUB)
    ax.axvline(base, color=INK, lw=1.4, ls="--")
    ax.text(base, len(sens) - 0.15, f" 基准 {_kfmt(base)}", fontsize=10, fontweight="bold")
    ax.set_yticks(y)
    ax.set_yticklabels([d["label"] for d in sens], fontsize=10)
    ax.set_xlim(min(lows) - span * 0.16, max(highs) + span * 0.16)
    ax.xaxis.set_major_formatter(mticker.FuncFormatter(_kfmt))
    ax.set_xlabel("第36个月 MRR (USD)")
    ax.grid(axis="y", visible=False)
    _save(fig, path)


def chart_hours(scen: dict, path: str):
    fig, ax = _ax((9.2, 3.2))
    colors = {"conservative": SUB, "base": BLUE, "upside": GREEN}
    labels = {"conservative": "保守", "base": "基准", "upside": "乐观"}
    for name, data in scen.items():
        ax.plot(data["month"], data["human_hours_week"], lw=2.0,
                color=colors[name], label=labels[name])
    ax.axhline(20, color=RED, lw=1.4, ls="--")
    ax.text(2, 20.6, "每周20小时预算上限", color=RED, fontsize=10)
    ax.set_xlabel("月份")
    ax.set_ylabel("人工运营小时 / 周")
    ax.set_ylim(0, 24)
    ax.legend(frameon=False, fontsize=10, loc="center left")
    _save(fig, path)


def chart_kelly(invest: dict, path: str):
    """Annualized log-growth vs fraction of bankroll committed, two calibers."""
    fig, ax = _ax((9.2, 3.4))
    series = [
        ("econ_exit", "无放弃规则:36个月全程投入", SUB),
        ("gated", "实际策略:第6/12月硬性放弃门槛", BLUE),
    ]
    for key, label, color in series:
        c = invest[key]["kelly_curve"]
        ax.plot(c["f"], [g * 100 for g in c["g_ann"]], lw=2.2, color=color, label=label)
        fstar = invest[key]["kelly_f"]
        gstar = invest[key]["g_ann_at_kelly"] * 100
        ax.plot([fstar], [gstar], "o", ms=6, color=color)
        ax.annotate(f"f*={fstar:.2f}  g={gstar:.1f}%/年",
                    (fstar, gstar), textcoords="offset points", xytext=(8, 6),
                    fontsize=9.5, fontweight="bold", color=color)
    ax.axhline(0, color=GRID, lw=1)
    ax.set_xlabel("投入比例 f(占可承受风险资本+时间预算)")
    ax.set_ylabel("长期复合年化 (%)")
    ax.legend(frameon=False, fontsize=10, loc="lower left")
    _save(fig, path)


def chart_cost_structure(base: dict, path: str):
    fig, ax = _ax((9.2, 4.2))
    m = base["month"]
    mor = [mr - nr for mr, nr in zip(base["mrr"], base["net_revenue"])]
    ax.stackplot(m, base["cogs"], base["infra"], base["fixed"] if isinstance(base["fixed"], list) else [base["fixed"][0] if isinstance(base["fixed"], list) else 35] * len(m), mor,
                 labels=["AI 推理成本", "基础设施", "固定工具", "MoR 渠道费"],
                 colors=[BLUE, TEAL, SUB, ORANGE], alpha=0.85)
    ax.yaxis.set_major_formatter(mticker.FuncFormatter(_kfmt))
    ax.set_xlabel("月份")
    ax.set_ylabel("月度成本 (USD)")
    ax.legend(frameon=False, fontsize=10, loc="upper left")
    _save(fig, path)
