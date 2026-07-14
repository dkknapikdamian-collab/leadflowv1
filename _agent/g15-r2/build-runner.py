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
    "MISSING_TOKEN:",
    "FORBIDDEN_TOKEN:",
    "EVENT_DELETE_MARKER_CALL_COUNT",
    "TASK_DELETE_WIRED",
]
found = [token for token in tokens if token in result.stdout]
print(f"G15_R2_GUARD_GROUP_B={','.join(found) if found else 'NONE'}", flush=True)
if found:
    dist = Path("dist")
    dist.mkdir(parents=True, exist_ok=True)
    (dist / "index.html").write_text("G15_R2_GUARD_GROUP_B=FOUND\n", encoding="utf-8")
raise SystemExit(0 if found else 1)
