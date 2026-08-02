# -*- coding: utf-8 -*-
"""Quick calibration check for MC_SPEC against empirical targets."""
import dataclasses
import json
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from montecarlo import run_montecarlo
import params

base = dataclasses.asdict(params.SCENARIOS["base"])
mc = run_montecarlo(params.MC_SPEC, base, n=20000, months=36, seed=params.MC_SEED)
print(json.dumps(mc["calibration"], indent=2))
print("targets: below_1k 0.60-0.72 | 1k-5k 0.18-0.25 | >5k 0.08-0.14 | >10k 0.03-0.06")
print("p>=1k m24:", mc["prob_table"]["m24"]["ge_1000"],
      "| p>=5k m36:", mc["prob_table"]["m36"]["ge_5000"],
      "| p>=10k m36:", mc["prob_table"]["m36"]["ge_10000"])
