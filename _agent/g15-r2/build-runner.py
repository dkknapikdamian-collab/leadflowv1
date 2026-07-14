from pathlib import Path

files = [f"_agent/g15-r2/upload_{index:02d}.b64" for index in range(7)]
ok = True
for name in files:
    size = Path(name).stat().st_size if Path(name).is_file() else -1
    print(f"PAYLOAD_LARGE {name} expected=8000 actual={size}", flush=True)
    ok = ok and size == 8000
print(f"G15_R2_PAYLOAD_LARGE_PROBE={'PASS' if ok else 'FAIL'}", flush=True)
raise SystemExit(0 if ok else 1)
