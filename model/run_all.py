# -*- coding: utf-8 -*-
"""Run all models: scenarios, Monte Carlo, sensitivity. Writes output/results.json
and assets/*.svg. Every number in the business plan traces back to this run."""
from __future__ import annotations

import dataclasses
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from engine import ScenarioParams, run_scenario
from montecarlo import run_montecarlo, compute_invest
import charts
import params
import scoring

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "output")
ASSETS = os.path.join(ROOT, "assets")


def run_sensitivity(base_params: ScenarioParams) -> list:
    """One-at-a-time sensitivity on month-36 MRR."""
    base = run_scenario(base_params)["summary"]["mrr_m36"]
    specs = [
        ("月流失率 ±30%", "churn_floor", 0.7, 1.3, True),
        ("SEO 流量上限 ±40%", "seo_visitors_cap", 0.6, 1.4, False),
        ("注册→付费转化 ±30%", "signup_paid_rate", 0.7, 1.3, False),
        ("访客→注册转化 ±30%", "visitor_signup_rate", 0.7, 1.3, False),
        ("客单价 ARPU ±25%", "arpu", 0.75, 1.25, False),
        ("口碑系数 ±50%", "wom_coeff", 0.5, 1.5, False),
        ("SEO 起量时点 ±4个月", "seo_t_mid", None, None, False),
    ]
    out = []
    for label, attr, lo_m, hi_m, invert in specs:
        if attr == "seo_t_mid":
            lo_p = dataclasses.replace(base_params, seo_t_mid=base_params.seo_t_mid + 4)
            hi_p = dataclasses.replace(base_params, seo_t_mid=base_params.seo_t_mid - 4)
        else:
            v = getattr(base_params, attr)
            lo_p = dataclasses.replace(base_params, **{attr: v * (hi_m if invert else lo_m)})
            hi_p = dataclasses.replace(base_params, **{attr: v * (lo_m if invert else hi_m)})
        lo = run_scenario(lo_p)["summary"]["mrr_m36"]
        hi = run_scenario(hi_p)["summary"]["mrr_m36"]
        out.append({"label": label, "low": lo, "high": hi, "base": base})
    return out


def main():
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(ASSETS, exist_ok=True)

    scen_results = {name: run_scenario(p) for name, p in params.SCENARIOS.items()}

    base_dict = dataclasses.asdict(params.SCENARIOS["base"])
    mc = run_montecarlo(params.MC_SPEC, base_dict, n=params.MC_RUNS,
                        months=60, seed=params.MC_SEED)
    invest = compute_invest(mc, params.INVEST)
    # raw arrays are for compute_invest only; keep them out of results.json
    for k in [k for k in mc if k.startswith("_")]:
        mc.pop(k)

    sens = run_sensitivity(params.SCENARIOS["base"])

    results = {
        "scenarios": {k: {"summary": v["summary"], "params": v["params"]}
                      for k, v in scen_results.items()},
        "montecarlo": mc,
        "invest": invest,
        "sensitivity": sens,
        "unit_economics": params.UNIT_ECON,
        "startup_costs": params.STARTUP_COSTS,
        "startup_total": params.STARTUP_TOTAL,
        "market": params.MARKET,
        "scoring": scoring.compute(),
        "sources": params.SOURCES,
    }
    with open(os.path.join(OUT, "results.json"), "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print("wrote", os.path.join(OUT, "results.json"))

    charts.chart_mrr_scenarios(scen_results, os.path.join(ASSETS, "mrr_scenarios.svg"))
    charts.chart_mc_fan(mc, os.path.join(ASSETS, "mc_fan.svg"))
    charts.chart_mc_hist(mc, os.path.join(ASSETS, "mc_hist.svg"))
    charts.chart_prob_ladder(mc, os.path.join(ASSETS, "prob_ladder.svg"))
    charts.chart_unit_econ(params.UNIT_ECON, os.path.join(ASSETS, "unit_econ.svg"))
    charts.chart_cash(scen_results, os.path.join(ASSETS, "cash_runway.svg"))
    charts.chart_sensitivity(sens, os.path.join(ASSETS, "sensitivity.svg"))
    charts.chart_hours(scen_results, os.path.join(ASSETS, "hours.svg"))
    charts.chart_kelly(invest, os.path.join(ASSETS, "kelly.svg"))

    # key headline numbers for quick reference
    b = scen_results["base"]["summary"]
    print(json.dumps({
        "base_mrr_m12": round(b["mrr_m12"]),
        "base_mrr_m24": round(b["mrr_m24"]),
        "base_mrr_m36": round(b["mrr_m36"]),
        "base_mrr_m60": round(b["mrr_m60"]),
        "base_breakeven_month": b["breakeven_month"],
        "mc_p_ge_1k_m24": mc["prob_table"]["m24"]["ge_1000"],
        "mc_p_ge_5k_m36": mc["prob_table"]["m36"]["ge_5000"],
        "calibration": mc["calibration"],
    }, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
