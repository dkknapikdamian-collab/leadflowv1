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
# Probe 2: the clean synthetic baseline was committed and the real patch command started.
reached = "$ python3 /tmp/g15-r2-apply.py" in result.stdout
print(f"G15_R2_BASELINE_PROBE={'PASS' if reached else 'FAIL'}", flush=True)
raise SystemExit(0 if reached else 1)
