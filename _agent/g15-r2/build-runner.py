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
# Probe 3: payload hash and Python compilation succeeded and git initialization started.
reached = "$ git init" in result.stdout
print(f"G15_R2_GIT_INIT_PROBE={'PASS' if reached else 'FAIL'}", flush=True)
raise SystemExit(0 if reached else 1)
