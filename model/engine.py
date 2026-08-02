# -*- coding: utf-8 -*-
"""
Deterministic monthly simulation engine for a solo, zero-human-ops AI SaaS.

Model structure (monthly steps, default 60 months):

  Acquisition funnel
      organic visitors  v(t) = V_cap / (1 + exp(-k (t - t_mid)))   (SEO logistic ramp)
      + launch spikes (directories / HN / PH) in early months
      visitors -> signups (rate s) -> paying customers (trial conversion c, 1-month lag)

  Retention
      paid(t) = paid(t-1) * (1 - churn) + new_paid(t)
      churn declines slightly as the cohort matures (annual-plan mix), floored.

  P&L (USD)
      MRR            = paid * ARPU
      net revenue    = MRR * (1 - MoR fee%) - MoR fixed fee * paid
      COGS           = AI inference for paid + free users
      infra          = step function of total users
      fixed          = domain/email/tools amortized
      profit         = net revenue - COGS - infra - fixed
      cash(t)        = cash(t-1) + profit   (founder takes no salary)

  Zero-human-ops feasibility
      support tickets = users * ticket rate; AI bot deflects a share;
      residual human minutes must fit the weekly hour budget.

All parameter values live in params.py with sources.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field, asdict


@dataclass
class ScenarioParams:
    name: str = "base"
    months: int = 60

    # --- acquisition ---
    seo_visitors_cap: float = 30000.0   # monthly organic visitors at saturation
    seo_k: float = 0.18                 # logistic steepness
    seo_t_mid: float = 18.0             # month at which ramp reaches half of cap
    launch_visitors: tuple = (2000.0, 1200.0, 800.0)  # extra visitors months 1..n
    other_visitors_base: float = 300.0  # steady trickle: communities, social, referrals
    wom_coeff: float = 6.0              # word-of-mouth visitors per paying customer per month

    visitor_signup_rate: float = 0.04   # visitor -> free signup
    signup_paid_rate: float = 0.06      # signup -> paying within next month

    # --- retention / pricing ---
    churn_start: float = 0.085          # monthly churn, month 1
    churn_floor: float = 0.045          # mature blended churn (annual mix)
    churn_decay: float = 0.06           # exponential approach to floor
    arpu: float = 29.0                  # blended $/paying user/month

    # --- costs (USD/month unless noted) ---
    mor_fee_pct: float = 0.05           # merchant-of-record % fee
    mor_fee_fixed: float = 0.50         # per transaction
    ai_cost_paid_user: float = 1.80     # inference cost per paying user / month
    ai_cost_free_user: float = 0.08     # capped free tier inference cost / signup-month
    free_active_share: float = 0.25     # share of cumulative signups still active on free tier
    fixed_cost: float = 35.0            # domain, email, monitoring, misc tools
    infra_tiers: tuple = ((0, 0.0), (200, 25.0), (1000, 95.0), (5000, 350.0), (20000, 900.0))
    # infra cost: smallest tier whose user threshold <= total active users

    # --- one-time / cash ---
    starting_cash: float = 4200.0       # USD (~RMB 30k mid-point of 1-5万)
    one_time_setup: float = 700.0       # company/registration/design/initial tools

    # --- zero-human-ops check ---
    tickets_per_user_month: float = 0.18   # support contacts per active user
    ai_deflection: float = 0.90            # share resolved by AI agent without human
    minutes_per_human_ticket: float = 8.0
    weekly_hour_budget: float = 20.0


def infra_cost(users: float, tiers) -> float:
    cost = 0.0
    for threshold, c in tiers:
        if users >= threshold:
            cost = c
    return cost


def run_scenario(p: ScenarioParams) -> dict:
    months = p.months
    paid = 0.0
    cum_signups = 0.0
    cash = p.starting_cash - p.one_time_setup
    pending_new_paid = 0.0  # 1-month trial lag

    out = {k: [] for k in (
        "month", "visitors", "signups", "new_paid", "paid", "mrr", "net_revenue",
        "cogs", "infra", "fixed", "profit", "cash", "churn", "free_active",
        "human_hours_week",
    )}

    for t in range(1, months + 1):
        seo = p.seo_visitors_cap / (1.0 + math.exp(-p.seo_k * (t - p.seo_t_mid)))
        launch = p.launch_visitors[t - 1] if t - 1 < len(p.launch_visitors) else 0.0
        wom = p.wom_coeff * paid
        visitors = seo + launch + p.other_visitors_base + wom

        signups = visitors * p.visitor_signup_rate
        cum_signups += signups

        new_paid = pending_new_paid
        pending_new_paid = signups * p.signup_paid_rate

        churn = p.churn_floor + (p.churn_start - p.churn_floor) * math.exp(-p.churn_decay * (t - 1))
        paid = paid * (1.0 - churn) + new_paid

        free_active = max(cum_signups * p.free_active_share - paid, 0.0)
        total_users = paid + free_active

        mrr = paid * p.arpu
        net_revenue = mrr * (1.0 - p.mor_fee_pct) - p.mor_fee_fixed * paid
        cogs = paid * p.ai_cost_paid_user + free_active * p.ai_cost_free_user
        infra = infra_cost(total_users, p.infra_tiers)
        profit = net_revenue - cogs - infra - p.fixed_cost
        cash += profit

        tickets = total_users * p.tickets_per_user_month
        human_minutes = tickets * (1.0 - p.ai_deflection) * p.minutes_per_human_ticket
        human_hours_week = human_minutes / 60.0 / 4.33

        for k, v in (("month", t), ("visitors", visitors), ("signups", signups),
                     ("new_paid", new_paid), ("paid", paid), ("mrr", mrr),
                     ("net_revenue", net_revenue), ("cogs", cogs), ("infra", infra),
                     ("fixed", p.fixed_cost), ("profit", profit), ("cash", cash),
                     ("churn", churn), ("free_active", free_active),
                     ("human_hours_week", human_hours_week)):
            out[k].append(v)

    out["params"] = asdict(p)
    out["summary"] = summarize(out, p)
    return out


def summarize(out: dict, p: ScenarioParams) -> dict:
    mrr = out["mrr"]
    profit = out["profit"]
    cash = out["cash"]

    def mrr_at(m):
        return mrr[m - 1] if m <= len(mrr) else None

    breakeven_month = next((i + 1 for i, v in enumerate(profit) if v > 0), None)
    cash_recovered_month = next(
        (i + 1 for i, v in enumerate(cash) if v >= p.starting_cash), None)
    min_cash = min(cash)

    yearly = []
    for y in range(1, p.months // 12 + 1):
        lo, hi = (y - 1) * 12, y * 12
        yearly.append({
            "year": y,
            "revenue": sum(mrr[lo:hi]),
            "net_revenue": sum(out["net_revenue"][lo:hi]),
            "profit": sum(profit[lo:hi]),
            "paid_end": out["paid"][hi - 1],
            "mrr_end": mrr[hi - 1],
        })

    return {
        "mrr_m12": mrr_at(12), "mrr_m24": mrr_at(24), "mrr_m36": mrr_at(36),
        "mrr_m60": mrr_at(60),
        "breakeven_month": breakeven_month,
        "cash_recovered_month": cash_recovered_month,
        "min_cash": min_cash,
        "max_human_hours_week": max(out["human_hours_week"]),
        "cum_profit_60m": sum(profit),
        "yearly": yearly,
    }
