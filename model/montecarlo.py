# -*- coding: utf-8 -*-
"""
Vectorized Monte Carlo over the same recurrence as engine.run_scenario.

Key design decision: parameter distributions are CALIBRATED so that the
simulated month-24 MRR distribution matches the observed cross-sectional
distribution of real micro-SaaS outcomes (Freemius 2025, RockingWeb 2025,
MicroConf; see params.SOURCES) instead of being chosen optimistically:

    ~60-72% of products below $1k MRR at month 24
    median (all products, incl. flops) in the low hundreds of $
    ~8-14% above $5k, ~3-6% above $10k

A mixture "flop factor" represents products that never find traction
(distribution channel fails / no willingness to pay), which is the dominant
empirical failure mode for solo SaaS.
"""
from __future__ import annotations

import numpy as np


def run_montecarlo(mc: dict, base: dict, n: int = 20000, months: int = 60,
                   seed: int = 20260611) -> dict:
    """mc: sampling spec, base: base scenario param dict (engine defaults)."""
    rng = np.random.default_rng(seed)

    # --- sample parameters across runs ---
    def logn(median, sigma):
        return rng.lognormal(np.log(median), sigma, n)

    cap = logn(mc["cap_median"], mc["cap_sigma"])
    flop = rng.random(n) < mc["p_flop"]
    cap = np.where(flop, cap * rng.uniform(*mc["flop_cap_mult"], n), cap)

    s_rate = np.clip(logn(mc["signup_median"], mc["signup_sigma"]), 0.005, 0.12)
    c_rate = np.clip(logn(mc["paid_median"], mc["paid_sigma"]), 0.005, 0.20)
    # flopped products also convert worse (no real pain point)
    c_rate = np.where(flop, c_rate * rng.uniform(*mc["flop_conv_mult"], n), c_rate)

    churn_floor = np.clip(rng.normal(mc["churn_floor_mu"], mc["churn_floor_sd"], n), 0.02, 0.12)
    churn_start = np.clip(churn_floor + rng.normal(0.04, 0.015, n), 0.03, 0.20)
    arpu = np.clip(logn(mc["arpu_median"], mc["arpu_sigma"]), 9.0, 99.0)
    wom = np.clip(logn(mc["wom_median"], mc["wom_sigma"]), 0.0, 30.0)
    t_mid = np.clip(rng.normal(mc["t_mid_mu"], mc["t_mid_sd"], n), 8.0, 36.0)
    k = np.clip(rng.normal(0.18, 0.04, n), 0.08, 0.30)

    # --- fixed cost-side params from base scenario ---
    mor_pct = base["mor_fee_pct"]; mor_fix = base["mor_fee_fixed"]
    ai_paid = base["ai_cost_paid_user"]; ai_free = base["ai_cost_free_user"]
    free_share = base["free_active_share"]; fixed = base["fixed_cost"]
    tiers = base["infra_tiers"]
    other_v = base["other_visitors_base"]
    launch = list(base["launch_visitors"])
    start_cash = base["starting_cash"] - base["one_time_setup"]

    paid = np.zeros(n)
    cum_signups = np.zeros(n)
    pending = np.zeros(n)
    cash = np.full(n, start_cash)

    mrr_path = np.zeros((months, n))
    cash_path = np.zeros((months, n))

    thresholds = np.array([t for t, _ in tiers]); costs = np.array([c for _, c in tiers])

    for t in range(1, months + 1):
        seo = cap / (1.0 + np.exp(-k * (t - t_mid)))
        lv = launch[t - 1] if t - 1 < len(launch) else 0.0
        visitors = seo + lv + other_v + wom * paid

        signups = visitors * s_rate
        cum_signups += signups
        new_paid = pending
        pending = signups * c_rate

        churn = churn_floor + (churn_start - churn_floor) * np.exp(-0.06 * (t - 1))
        paid = paid * (1.0 - churn) + new_paid

        free_active = np.maximum(cum_signups * free_share - paid, 0.0)
        total_users = paid + free_active

        mrr = paid * arpu
        net_rev = mrr * (1.0 - mor_pct) - mor_fix * paid
        cogs = paid * ai_paid + free_active * ai_free
        idx = np.searchsorted(thresholds, total_users, side="right") - 1
        infra = costs[np.maximum(idx, 0)]
        profit = net_rev - cogs - infra - fixed
        cash += profit

        mrr_path[t - 1] = mrr
        cash_path[t - 1] = cash

    pct = [5, 10, 25, 50, 75, 90, 95]
    mrr_pct = {f"p{q}": np.percentile(mrr_path, q, axis=1).tolist() for q in pct}

    def p_ge(month, x):
        return float((mrr_path[month - 1] >= x).mean())

    levels = [100, 500, 1000, 2000, 5000, 10000, 20000]
    prob_table = {
        f"m{m}": {f"ge_{x}": p_ge(m, x) for x in levels}
        for m in (12, 24, 36, 60) if m <= months
    }

    m24 = mrr_path[23]
    calibration = {
        "share_below_1k_m24": float((m24 < 1000).mean()),
        "share_1k_5k_m24": float(((m24 >= 1000) & (m24 < 5000)).mean()),
        "share_above_5k_m24": float((m24 >= 5000).mean()),
        "share_above_10k_m24": float((m24 >= 10000).mean()),
        "median_m24": float(np.median(m24)),
        "median_m24_survivors": float(np.median(m24[m24 >= 100])) if (m24 >= 100).any() else 0.0,
    }

    cum_profit_36 = cash_path[35] - start_cash
    out = {
        "n": n,
        "mrr_percentiles": mrr_pct,
        "prob_table": prob_table,
        "calibration": calibration,
        "m24_sample": m24[np.argsort(rng.random(n))[:4000]].tolist(),  # for histogram
        "cash_min_p10": float(np.percentile(cash_path.min(axis=0), 10)),
        "cash_min_p50": float(np.percentile(cash_path.min(axis=0), 50)),
        "p_cash_negative": float((cash_path.min(axis=0) < 0).mean()),
        "n_cash_negative": int((cash_path.min(axis=0) < 0).sum()),
        "cum_profit_36m": {f"p{q}": float(np.percentile(cum_profit_36, q)) for q in pct},
        "ev_cum_profit_36m": float(cum_profit_36.mean()),
        # raw arrays kept out of JSON; exposed for compute_invest
        "_cum36": cum_profit_36,
        "_trailing12_m36": cash_path[35] - cash_path[23],
        "_start_cash_committed": base["starting_cash"],
        "_mrr_m6": mrr_path[5], "_mrr_m12": mrr_path[11],
        "_cum6": cash_path[5] - start_cash, "_cum12": cash_path[11] - start_cash,
    }
    return out


def compute_invest(mc_out: dict, invest: dict) -> dict:
    """Investment lens on the MC distribution: win rate, profit/loss ratio,
    risk-adjusted annualized return and Kelly-optimal fraction.

    Three calibers, from least to most complete:
      cash       : cash flows only (founder time priced at zero)
      econ       : cash flows minus opportunity cost of founder time
      econ_exit  : econ plus a haircut exit residual (multiple x TTM profit)
    The stake S per caliber = committed cash (+ monetized time where priced).
    """
    cum36 = mc_out["_cum36"]
    trailing12 = mc_out["_trailing12_m36"]
    cash_stake = mc_out["_start_cash_committed"]

    years = invest["horizon_months"] / 12.0
    hours = invest["hours_per_week"] * invest["weeks_per_year"] * years
    time_cost = hours * invest["opp_rate"]
    exit_val = np.maximum(trailing12, 0.0) * invest["exit_multiple"] * invest["exit_haircut"]

    def caliber(X, stake):
        X = np.asarray(X, dtype=float)
        win = X > 0
        win_rate = float(win.mean())
        gain = float(X[win].mean()) if win.any() else 0.0
        loss = float(-X[~win].mean()) if (~win).any() else 0.0
        ev = float(X.mean())
        # wealth multiple per attempt (loss bounded by the stake)
        m = np.maximum(1.0 + X / stake, 1e-9)
        ann_ev = (1.0 + ev / stake) ** (1.0 / years) - 1.0
        ann_med = (1.0 + float(np.median(X)) / stake) ** (1.0 / years) - 1.0
        # Kelly: fraction f of bankroll committed per 36-month attempt
        fs = np.linspace(0.0, 1.0, 201)
        g = np.array([np.mean(np.log(np.maximum(1.0 - f + f * m, 1e-12))) for f in fs])
        i = int(np.argmax(g))
        f_star = float(fs[i])
        g_ann_full = float(np.exp(g[-1] / years) - 1.0)       # f = 1
        g_ann_star = float(np.exp(g[i] / years) - 1.0)        # f = f*
        i_half = int(round(i / 2))
        g_ann_half = float(np.exp(g[i_half] / years) - 1.0)   # f*/2
        return {
            "stake": float(stake),
            "win_rate": win_rate,
            "avg_gain": gain,
            "avg_loss": loss,
            "pl_ratio": gain / loss if loss > 0 else float("inf"),
            "ev": ev,
            "moic": float(m.mean()),
            "ann_ev": float(ann_ev),
            "ann_med": float(ann_med),
            "kelly_f": f_star,
            "g_ann_at_kelly": g_ann_star,
            "g_ann_at_half_kelly": g_ann_half,
            "g_ann_at_full": g_ann_full,
            "kelly_curve": {"f": fs.tolist(),
                            "g_ann": (np.exp(g / years) - 1.0).tolist()},
        }

    # --- gated caliber: the actual strategy with hard kill criteria ---
    # Abandon at m6 if MRR<gate_m6 (time cost stops at 6 months), else at m12
    # if MRR<gate_m12, else run to m36 and keep the exit residual option.
    mrr6 = mc_out["_mrr_m6"]; mrr12 = mc_out["_mrr_m12"]
    cum6 = mc_out["_cum6"]; cum12 = mc_out["_cum12"]
    kill6 = mrr6 < invest["gate_m6_mrr"]
    kill12 = (~kill6) & (mrr12 < invest["gate_m12_mrr"])
    survive = ~(kill6 | kill12)
    tc_m = time_cost / invest["horizon_months"]
    X_gated = np.where(kill6, cum6 - 6 * tc_m,
               np.where(kill12, cum12 - 12 * tc_m,
                        cum36 + exit_val - time_cost))
    gate_stats = {
        "share_kill_m6": float(kill6.mean()),
        "share_kill_m12": float(kill12.mean()),
        "share_continue": float(survive.mean()),
    }

    res = {
        "assumptions": {
            "hours_total": hours,
            "time_cost": float(time_cost),
            "opp_rate": invest["opp_rate"],
            "cash_stake": float(cash_stake),
            "exit_multiple": invest["exit_multiple"],
            "exit_haircut": invest["exit_haircut"],
            "exit_val_mean": float(exit_val.mean()),
            "exit_val_p50": float(np.median(exit_val)),
        },
        "cash": caliber(cum36, cash_stake),
        "econ": caliber(cum36 - time_cost, cash_stake + time_cost),
        "econ_exit": caliber(cum36 + exit_val - time_cost, cash_stake + time_cost),
        "gated": {**caliber(X_gated, cash_stake + time_cost), **gate_stats},
    }
    # opportunity-rate sensitivity on the headline caliber (econ_exit win rate)
    for key, rate in (("low", invest["opp_rate_low"]), ("high", invest["opp_rate_high"])):
        tc = hours * rate
        X = cum36 + exit_val - tc
        res[f"econ_exit_opp_{key}"] = {
            "opp_rate": rate,
            "win_rate": float((X > 0).mean()),
            "ann_ev": float((1.0 + X.mean() / (cash_stake + tc)) ** (1.0 / years) - 1.0),
        }
    return res
