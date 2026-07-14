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
found = "MISSING_TOKEN:" in result.stdout
print(f"G15_R2_GUARD_MISSING_TOKEN={'YES' if found else 'NO'}", flush=True)
if found:
    dist = Path("dist")
    dist.mkdir(parents=True, exist_ok=True)
    (dist / "index.html").write_text("G15_R2_GUARD_MISSING_TOKEN=YES\n", encoding="utf-8")
raise SystemExit(0 if found else 1)
