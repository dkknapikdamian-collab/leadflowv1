import subprocess

result = subprocess.run(
    ["python3", "_agent/g15-r2/core-runner.py"],
    text=True,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    check=False,
)
print(result.stdout, end="", flush=True)
raise SystemExit(result.returncode)
