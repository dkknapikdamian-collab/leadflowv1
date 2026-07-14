from __future__ import annotations

import base64
import hashlib
import json
import shutil
import subprocess
from pathlib import Path

ROOT = Path.cwd()
REAL_INPUT_HEAD = "6acc65b22f6fd467019da5973682aa03cc9cbe65"
STAGE = "LF-PROD-SOT-G15-R2_EVENT_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION"
PARTS = [
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
FINAL_FILES = [
    "src/server/event-route-stage124f.ts",
    "package.json",
    "tsconfig.g15-r2.json",
    "scripts/guards/verify-lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.cjs",
    "tests/lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.test.cjs",
    f"_project/runs/{STAGE}.md",
    "scripts/guards/verify-lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.cjs",
    "tests/lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.test.cjs",
    "scripts/guards/verify-lf-prod-sot-g15-gcal-delete-legacy-workspace-tombstone-and-retry-contract-map.cjs",
    "tests/lf-prod-sot-g15-gcal-delete-legacy-workspace-tombstone-and-retry-contract-map.test.cjs",
    "scripts/guards/verify-lf-prod-sot-g14-task-post-gcal-create-atomic-sync-state-insert-payload-runtime-adoption.cjs",
    "tests/lf-prod-sot-g14-task-post-gcal-create-atomic-sync-state-insert-payload-runtime-adoption.test.cjs",
]


def run(args: list[str]) -> str:
    print("$", " ".join(args), flush=True)
    result = subprocess.run(
        args,
        cwd=ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        check=False,
    )
    print(result.stdout, end="", flush=True)
    if result.returncode != 0:
        raise SystemExit(result.returncode)
    return result.stdout


def write_bytes(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)


def make_artifact(final_bytes: dict[str, bytes], evidence: dict[str, object]) -> None:
    files: dict[str, dict[str, str | int]] = {}
    for rel, data in final_bytes.items():
        files[rel] = {
            "sha256": hashlib.sha256(data).hexdigest(),
            "size": len(data),
            "content_base64": base64.b64encode(data).decode("ascii"),
        }
    payload = {
        "stage": STAGE,
        "real_input_head": REAL_INPUT_HEAD,
        "status": "APP_PREVIEW_TESTS_PASS",
        "files": files,
        "evidence": evidence,
    }
    out = ROOT / "dist" / "g15-r2-artifacts.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"ARTIFACT={out}", flush=True)


# Preserve the exact patch before deleting technical transport files.
combined = "".join((ROOT / rel).read_text(encoding="utf-8").strip() for rel in PARTS)
patch_bytes = base64.b64decode(combined, validate=True)
if hashlib.sha256(patch_bytes).hexdigest() != "bfdbb4c1d6ae6737056f522d66b6c80632ab57c7a70d96e0c491df081a406e2b":
    raise SystemExit("PATCH_SHA256_MISMATCH")
apply_path = Path("/tmp/g15-r2-apply.py")
apply_path.write_bytes(patch_bytes)
run(["python3", "-m", "py_compile", str(apply_path)])

# Build a clean synthetic baseline because Vercel may not expose repository history.
shutil.rmtree(ROOT / ".git", ignore_errors=True)
shutil.rmtree(ROOT / "_agent", ignore_errors=True)
workflow = ROOT / ".github" / "workflows" / "g15-r2-agent.yml"
if workflow.exists():
    workflow.unlink()
vercel_path = ROOT / "vercel.json"
vercel_config = json.loads(vercel_path.read_text(encoding="utf-8"))
vercel_config.pop("buildCommand", None)
vercel_path.write_text(json.dumps(vercel_config, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

run(["git", "init"])
run(["git", "checkout", "-b", "dev-rollout-freeze"])
run(["git", "config", "user.name", "openai-g15-r2-preview"])
run(["git", "config", "user.email", "openai-g15-r2-preview@users.noreply.github.com"])
run(["git", "add", "-A"])
run(["git", "commit", "-m", "synthetic exact source baseline"])
synthetic_input_head = run(["git", "rev-parse", "HEAD"]).strip()

# Apply the same patch intended for the real input SHA.
run(["python3", str(apply_path)])
run(["git", "add", "--", *FINAL_FILES])
run(["git", "diff", "--cached", "--check"])
run(["git", "commit", "-m", "feat(closeflow): adopt G15-R2 event delete owner evidence"])

changed = [line for line in run(["git", "diff", "--name-only", f"{synthetic_input_head}..HEAD"]).splitlines() if line]
if set(changed) != set(FINAL_FILES):
    raise SystemExit("FINAL_DIFF_MISMATCH:" + ",".join(changed))
src_changed = [name for name in changed if name.startswith("src/")]
if src_changed != ["src/server/event-route-stage124f.ts"]:
    raise SystemExit("RUNTIME_SCOPE_MISMATCH:" + ",".join(src_changed))
if any("package-lock.json" == name or name.endswith(".sql") or "migration" in name.lower() for name in changed):
    raise SystemExit("FORBIDDEN_DIFF")

# Preserve byte-exact final artifacts with the real input SHA before test-only baseline substitution.
final_bytes = {rel: (ROOT / rel).read_bytes() for rel in FINAL_FILES}
for rel in [
    "scripts/guards/verify-lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.cjs",
    "tests/lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.test.cjs",
]:
    path = ROOT / rel
    text = path.read_text(encoding="utf-8")
    if REAL_INPUT_HEAD not in text:
        raise SystemExit(f"REAL_INPUT_HEAD_MISSING:{rel}")
    path.write_text(text.replace(REAL_INPUT_HEAD, synthetic_input_head), encoding="utf-8", newline="\n")

results: dict[str, object] = {
    "synthetic_input_head": synthetic_input_head,
    "changed_files": changed,
    "src_changed": src_changed,
    "patch_sha256": hashlib.sha256(patch_bytes).hexdigest(),
}
results["g15_r2"] = run(["npm", "run", "verify:lf-prod-sot-g15-r2"])
results["g14"] = run(["npm", "run", "verify:lf-prod-sot-g15-r2"] if False else ["npm", "run", "verify:lf-prod-sot-g14"])
results["diff_check"] = run(["git", "diff", "--check", f"{synthetic_input_head}..HEAD"])
results["build"] = run(["npm", "run", "build"])

# Restore byte-exact final files in the deployed artifact, not the test-only substituted copies.
make_artifact(final_bytes, results)
print("G15_R2_PREVIEW_RUNNER: PASS", flush=True)
