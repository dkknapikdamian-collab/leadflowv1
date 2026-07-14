from pathlib import Path
import subprocess

result = subprocess.run(
    [
        "git",
        "push",
        "--dry-run",
        "origin",
        "HEAD:refs/heads/agent/g15-r2-vercel-auth-probe",
    ],
    text=True,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    check=False,
)
print(f"G15_R2_VERCEL_GIT_PUSH_DRY_RUN={'PASS' if result.returncode == 0 else 'FAIL'}", flush=True)
if result.returncode == 0:
    dist = Path("dist")
    dist.mkdir(parents=True, exist_ok=True)
    (dist / "index.html").write_text("G15_R2_VERCEL_GIT_PUSH_DRY_RUN=PASS\n", encoding="utf-8")
raise SystemExit(result.returncode)
