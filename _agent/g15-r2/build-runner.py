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
tokens = [
    "WRONG_APP_BRANCH",
    "APP_INPUT_HEAD_NOT_ANCESTOR",
    "APP_OUT_OF_SCOPE",
    "RUNTIME_SCOPE_MISMATCH",
    "PACKAGE_ALIAS_MISMATCH",
    "TSCONFIG_MISSING",
    "MISSING_REQUIRED_FILE",
    "MISSING_SECTION",
]
found = [token for token in tokens if token in result.stdout]
print(f"G15_R2_GUARD_GROUP_A={','.join(found) if found else 'NONE'}", flush=True)
if found:
    dist = Path("dist")
    dist.mkdir(parents=True, exist_ok=True)
    (dist / "index.html").write_text("G15_R2_GUARD_GROUP_A=FOUND\n", encoding="utf-8")
raise SystemExit(0 if found else 1)
