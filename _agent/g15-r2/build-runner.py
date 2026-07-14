from pathlib import Path
import subprocess

result = subprocess.run(
    ["python3", "_agent/g15-r2/core-runner.py"],
    text=True,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    check=False,
)
print(result.stdout, end="", flush=True)
reached = "$ npm run build" in result.stdout
print(f"G15_R2_G14_REGRESSION_PROBE={'PASS' if reached else 'FAIL'}", flush=True)
if reached:
    dist = Path("dist")
    dist.mkdir(parents=True, exist_ok=True)
    (dist / "index.html").write_text("G15_R2_G14_REGRESSION_PROBE=PASS\n", encoding="utf-8")
raise SystemExit(0 if reached else 1)
