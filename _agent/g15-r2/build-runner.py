import base64
import hashlib
from pathlib import Path

parts = [
    "_agent/g15-r2/upload_00.b64",
    "_agent/g15-r2/upload_01.b64",
    "_agent/g15-r2/upload_02.b64",
    "_agent/g15-r2/upload_03.b64",
    "_agent/g15-r2/upload_04.b64",
    "_agent/g15-r2/upload_05.b64",
    "_agent/g15-r2/upload_06.b64",
    "_agent/g15-r2/upload_07_0.b64part",
    "_agent/g15-r2/upload_07_1.b64part",
    "_agent/g15-r2/upload_07_2.b64part",
    "_agent/g15-r2/upload_07_3.b64part",
    "_agent/g15-r2/upload_08_0.b64part",
    "_agent/g15-r2/upload_08_1.b64part",
    "_agent/g15-r2/upload_08_2.b64part",
    "_agent/g15-r2/upload_08_3.b64part",
]
expected = "bfdbb4c1d6ae6737056f522d66b6c80632ab57c7a70d96e0c491df081a406e2b"
try:
    encoded = "".join(Path(name).read_text(encoding="utf-8").strip() for name in parts)
    decoded = base64.b64decode(encoded, validate=True)
    actual = hashlib.sha256(decoded).hexdigest()
    ok = actual == expected
except Exception as error:
    print(f"PAYLOAD_EXCEPTION={type(error).__name__}:{error}", flush=True)
    actual = "ERROR"
    ok = False
print(f"PAYLOAD_SHA256_EXPECTED={expected}", flush=True)
print(f"PAYLOAD_SHA256_ACTUAL={actual}", flush=True)
print(f"G15_R2_PAYLOAD_FULL_PROBE={'PASS' if ok else 'FAIL'}", flush=True)
if ok:
    dist = Path("dist")
    dist.mkdir(parents=True, exist_ok=True)
    (dist / "index.html").write_text("G15_R2_PAYLOAD_FULL_PROBE=PASS\n", encoding="utf-8")
raise SystemExit(0 if ok else 1)
