# -*- coding: utf-8 -*-
"""
Build bp.html from bp_template.html by injecting numbers computed in
output/results.json and inlining SVG charts.

Placeholder syntax:
    {{path.to.value}}            raw value
    {{path|usd}} {{path|usd2}} {{path|usd0k}} {{path|rmb}} {{path|rmbw}}
    {{path|pct}} {{path|pct0}} {{path|num}} {{path|num1}}
    {{svg:filename.svg}}         inline SVG from assets/
    {{gen:NAME}}                 generated HTML fragment (tables/lists)
"""
from __future__ import annotations

import html as html_mod
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RMB = 7.1


def resolve(data, path: str):
    cur = data
    for seg in path.split("."):
        if isinstance(cur, list):
            cur = cur[int(seg)]
        else:
            cur = cur[seg]
    return cur


def fmt(value, spec: str | None):
    if spec is None:
        return str(value)
    if spec == "usd":
        return f"${value:,.0f}"
    if spec == "usd2":
        return f"${value:,.2f}"
    if spec == "usd0k":
        return f"${value/1000:,.0f}k" if abs(value) >= 1000 else f"${value:,.0f}"
    if spec == "rmb":
        return f"¥{value*RMB:,.0f}"
    if spec == "rmbw":
        return f"{value*RMB/10000:,.1f}万元"
    if spec == "pct":
        return f"{value*100:.1f}%"
    if spec == "pct0":
        return f"{value*100:.0f}%"
    if spec == "pct2":
        return f"{value*100:.2f}%"
    if spec == "signpct0":
        return f"{value*100:+.0f}%"
    if spec == "signpct":
        return f"{value*100:+.1f}%"
    if spec == "mult":
        return f"{value:.2f}x"
    if spec == "num2":
        return f"{value:.2f}"
    if spec == "num":
        return f"{value:,.0f}"
    if spec == "num1":
        return f"{value:,.1f}"
    raise ValueError(f"unknown format {spec}")


def add_derived(d: dict):
    base = d["scenarios"]["base"]["summary"]
    cons = d["scenarios"]["conservative"]["summary"]
    up = d["scenarios"]["upside"]["summary"]
    yearly = base["yearly"]
    profit_36m_base = sum(y["profit"] for y in yearly[:3])
    hours_36m = 20 * 52 * 3
    hours_60m = 20 * 52 * 5
    d["derived"] = {
        "base_arr_m36": base["mrr_m36"] * 12,
        "base_arr_m60": base["mrr_m60"] * 12,
        "profit_36m_base": profit_36m_base,
        "profit_per_hour_36m_base": profit_36m_base / hours_36m,
        "profit_per_hour_60m_base": base["cum_profit_60m"] / hours_60m,
        "exit_value_y3_base": yearly[2]["profit"] * 3.9,
        "exit_value_y5_base": yearly[4]["profit"] * 3.9,
        "exit_value_y3_upside": up["yearly"][2]["profit"] * 3.9,
        "moic_36m_p50": (d["montecarlo"]["cum_profit_36m"]["p50"]
                         + d["scenarios"]["base"]["params"]["starting_cash"])
                        / d["scenarios"]["base"]["params"]["starting_cash"],
        "mc_share_flop_pct": d["montecarlo"]["calibration"]["share_below_1k_m24"],
        "cons_cum": cons["cum_profit_60m"],
        "up_cum": up["cum_profit_60m"],
    }


def gen_fragments(d: dict) -> dict:
    esc = html_mod.escape
    g = {}

    # --- scoring matrix table ---
    dims = [("ops", "零人工运营"), ("dist", "分发自动化"), ("build", "单人可建"),
            ("wtp", "付费与留存"), ("margin", "毛利"), ("space", "竞争空间"),
            ("risk", "合规安全")]
    w = d["scoring"]["weights"]
    rows = []
    head = "".join(
        f"<th>{label}<span class='w'>×{w[k]:.2f}</span></th>" for k, label in dims)
    for c in d["scoring"]["candidates"]:
        cls = "sel" if c.get("selected") else ("rej" if c.get("original_plan") else "")
        cells = "".join(f"<td>{c['scores'][k]}</td>" for k, _ in dims)
        tag = ""
        if c.get("selected"):
            tag = " <span class='tag tag-blue'>选定</span>"
        if c.get("original_plan"):
            tag = " <span class='tag tag-red'>原案 · 淘汰</span>"
        rows.append(
            f"<tr class='{cls}'><td class='nm'>{esc(c['name'])}{tag}</td>"
            f"{cells}<td class='score'>{c['weighted']:.2f}</td></tr>")
    g["scoring_table"] = (
        "<table class='tbl scoring'><thead><tr><th>候选方向</th>"
        + head + "<th>加权分</th></tr></thead><tbody>"
        + "".join(rows) + "</tbody></table>")

    # --- yearly table, base scenario ---
    rows = []
    for y in d["scenarios"]["base"]["summary"]["yearly"]:
        rows.append(
            f"<tr><td>第{y['year']}年</td>"
            f"<td>${y['revenue']:,.0f}</td>"
            f"<td>${y['profit']:,.0f}</td>"
            f"<td>{y['paid_end']:,.0f}</td>"
            f"<td>${y['mrr_end']:,.0f}</td></tr>")
    g["yearly_table_base"] = (
        "<table class='tbl'><thead><tr><th>年份</th><th>账面营收(MRR累计)</th>"
        "<th>净利润</th><th>期末付费客户</th><th>期末MRR</th></tr></thead><tbody>"
        + "".join(rows) + "</tbody></table>")

    # --- probability table ---
    levels = [(100, "$100"), (500, "$500"), (1000, "$1,000"), (2000, "$2,000"),
              (5000, "$5,000"), (10000, "$10,000"), (20000, "$20,000")]
    pt = d["montecarlo"]["prob_table"]
    rows = []
    for lv, label in levels:
        cells = "".join(
            f"<td>{pt[m][f'ge_{lv}']*100:.1f}%</td>" for m in ("m12", "m24", "m36", "m60"))
        rows.append(f"<tr><td>MRR ≥ {label}</td>{cells}</tr>")
    g["prob_table"] = (
        "<table class='tbl'><thead><tr><th>里程碑</th><th>12个月</th>"
        "<th>24个月</th><th>36个月</th><th>60个月</th></tr></thead><tbody>"
        + "".join(rows) + "</tbody></table>")

    # --- calibration table ---
    cal = d["montecarlo"]["calibration"]
    rows = [
        ("第24个月 MRR &lt; $1k 占比", f"{cal['share_below_1k_m24']*100:.1f}%", "60–72%(Freemius 2025 / RockingWeb / IndieLaunches)"),
        ("$1k–5k 占比", f"{cal['share_1k_5k_m24']*100:.1f}%", "18–25%"),
        ("&gt; $5k 占比", f"{cal['share_above_5k_m24']*100:.1f}%", "8–14%"),
        ("&gt; $10k 占比", f"{cal['share_above_10k_m24']*100:.1f}%", "3–6%"),
    ]
    g["calibration_table"] = (
        "<table class='tbl'><thead><tr><th>校准指标(全部尝试口径)</th><th>本模型</th>"
        "<th>实证目标区间</th></tr></thead><tbody>"
        + "".join(f"<tr><td>{a}</td><td>{b}</td><td>{c}</td></tr>" for a, b, c in rows)
        + "</tbody></table>")

    # --- startup costs ---
    rows = "".join(
        f"<tr><td>{esc(k)}</td><td>${v:,.0f}</td></tr>"
        for k, v in d["startup_costs"])
    g["startup_table"] = (
        "<table class='tbl'><thead><tr><th>一次性启动成本</th><th>金额(USD)</th></tr></thead>"
        f"<tbody>{rows}<tr class='total'><td>合计</td>"
        f"<td>${d['startup_total']:,.0f}</td></tr></tbody></table>")

    # --- sources list ---
    items = "".join(
        f"<li><span class='src-key'>[{esc(k)}]</span> {esc(v)}</li>"
        for k, v in d["sources"].items())
    g["sources_list"] = f"<ol class='sources'>{items}</ol>"

    return g


def build(template_path: str, out_path: str):
    with open(os.path.join(ROOT, "output", "results.json"), encoding="utf-8") as f:
        data = json.load(f)
    add_derived(data)
    frags = gen_fragments(data)

    with open(template_path, encoding="utf-8") as f:
        html = f.read()

    def sub_svg(m):
        with open(os.path.join(ROOT, "assets", m.group(1)), encoding="utf-8") as f:
            svg = f.read()
        svg = re.sub(r"<\?xml[^>]*\?>\s*", "", svg)
        svg = re.sub(r"<!DOCTYPE[^>]*>\s*", "", svg)
        return svg

    html = re.sub(r"\{\{svg:([^}]+)\}\}", sub_svg, html)
    html = re.sub(r"\{\{gen:([^}]+)\}\}", lambda m: frags[m.group(1).strip()], html)

    missing = []

    def sub_val(m):
        expr = m.group(1)
        path, _, spec = expr.partition("|")
        try:
            v = resolve(data, path.strip())
            return fmt(v, spec.strip() or None if spec else None)
        except Exception:
            missing.append(expr)
            return f"[MISSING:{expr}]"

    html = re.sub(r"\{\{([^}]+)\}\}", sub_val, html)

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html)
    print("wrote", out_path)
    if missing:
        print("MISSING PLACEHOLDERS:", *missing, sep="\n  ")
        sys.exit(1)


if __name__ == "__main__":
    build(os.path.join(ROOT, "bp_template.html"), os.path.join(ROOT, "bp.html"))
