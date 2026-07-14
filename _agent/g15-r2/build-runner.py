from pathlib import Path

expected = {
    "_agent/g15-r2/upload_00.b64": 8000,
    "_agent/g15-r2/upload_01.b64": 8000,
    "_agent/g15-r2/upload_02.b64": 8000,
    "_agent/g15-r2/upload_03.b64": 8000,
    "_agent/g15-r2/upload_04.b64": 8000,
    "_agent/g15-r2/upload_05.b64": 8000,
    "_agent/g15-r2/upload_06.b64": 8000,
    "_agent/g15-r2/upload_07_0.b64part": 2000,
    "_agent/g15-r2/upload_07_1.b64part": 2000,
    "_agent/g15-r2/upload_07_2.b64part": 2000,
    "_agent/g15-r2/upload_07_3.b64part": 2000,
    "_agent/g15-r2/upload_08_0.b64part": 2000,
    "_agent/g15-r2/upload_08_1.b64part": 2000,
    "_agent/g15-r2/upload_08_2.b64part": 2000,
    "_agent/g15-r2/upload_08_3.b64part": 892,
}
actual = {name: (Path(name).stat().st_size if Path(name).is_file() else -1) for name in expected}
for name, size in actual.items():
    print(f"PAYLOAD_FILE {name} expected={expected[name]} actual={size}", flush=True)
ok = actual == expected
print(f"G15_R2_PAYLOAD_SIZE_PROBE={'PASS' if ok else 'FAIL'}", flush=True)
raise SystemExit(0 if ok else 1)
