from __future__ import annotations

import subprocess
from pathlib import Path

root = Path.cwd()
result = subprocess.run(
    ["python3", "_agent/g15-r2/core-runner.py"],
    cwd=root,
    text=True,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    check=False,
)
print(result.stdout, end="", flush=True)
# Probe 1: patch, synthetic baseline, exact allowlist commit and diff all succeeded
# only when the runner reached the G15-R2 command.
reached = "$ npm run verify:lf-prod-sot-g15-r2" in result.stdout
print(f"G15_R2_PATCH_PROBE={'PASS' if reached else 'FAIL'}", flush=True)
raise SystemExit(0 if reached else 1)
