from pathlib import Path

files = ["_agent/g15-r2/upload_00.b64", "_agent/g15-r2/upload_01.b64"]
ok = True
for name in files:
    size = Path(name).stat().st_size if Path(name).is_file() else -1
    print(f"PAYLOAD_00_01 {name} expected=8000 actual={size}", flush=True)
    ok = ok and size == 8000
print(f"G15_R2_PAYLOAD_00_01_PROBE={'PASS' if ok else 'FAIL'}", flush=True)
if ok:
    dist = Path("dist")
    dist.mkdir(parents=True, exist_ok=True)
    (dist / "index.html").write_text("G15_R2_PAYLOAD_00_01_PROBE=PASS\n", encoding="utf-8")
raise SystemExit(0 if ok else 1)
