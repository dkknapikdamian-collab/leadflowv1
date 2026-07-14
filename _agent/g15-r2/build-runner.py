from __future__ import annotations

import base64
import hashlib
import json
import os
import shutil
import subprocess
from pathlib import Path

ROOT = Path.cwd()
INPUT_HEAD = "6acc65b22f6fd467019da5973682aa03cc9cbe65"
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


def run(args: list[str], *, env: dict[str, str] | None = None) -> str:
    print("$", " ".join(args), flush=True)
    result = subprocess.run(
        args,
        cwd=ROOT,
        env=env,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        check=False,
    )
    print(result.stdout, end="", flush=True)
    if result.returncode != 0:
        raise SystemExit(result.returncode)
    return result.stdout


def write_artifact(evidence: dict[str, object]) -> None:
    files: dict[str, dict[str, str | int]] = {}
    for rel in FINAL_FILES:
        data = (ROOT / rel).read_bytes()
        files[rel] = {
            "sha256": hashlib.sha256(data).hexdigest(),
            "size": len(data),
            "content_base64": base64.b64encode(data).decode("ascii"),
        }
    payload = {
        "stage": STAGE,
        "input_head": INPUT_HEAD,
        "status": "APP_PREVIEW_TESTS_PASS",
        "files": files,
        "evidence": evidence,
    }
    out = ROOT / "dist" / "g15-r2-artifacts.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"ARTIFACT={out}", flush=True)


combined = "".join((ROOT / rel).read_text(encoding="utf-8").strip() for rel in PARTS)
script = base64.b64decode(combined, validate=True)
apply_path = Path("/tmp/g15-r2-apply.py")
apply_path.write_bytes(script)
run(["python3", str(apply_path)])

# Convert the preview checkout into the exact branch/diff shape required by guards.
run(["git", "checkout", "-B", "dev-rollout-freeze"])
shutil.rmtree(ROOT / "_agent", ignore_errors=True)
workflow = ROOT / ".github" / "workflows" / "g15-r2-agent.yml"
if workflow.exists():
    workflow.unlink()
# Remove preview-only buildCommand from the net stage diff.
baseline_vercel = run(["git", "show", f"{INPUT_HEAD}:vercel.json"])
(ROOT / "vercel.json").write_text(baseline_vercel, encoding="utf-8", newline="\n")

run(["git", "config", "user.name", "openai-g15-r2-preview"])
run(["git", "config", "user.email", "openai-g15-r2-preview@users.noreply.github.com"])
run(["git", "add", "--", *FINAL_FILES])
run(["git", "add", "-u", "--", "_agent", ".github/workflows/g15-r2-agent.yml", "vercel.json"])
run(["git", "diff", "--cached", "--check"])
run(["git", "commit", "-m", "feat(closeflow): adopt G15-R2 event delete owner evidence"])

changed = [line for line in run(["git", "diff", "--name-only", f"{INPUT_HEAD}..HEAD"]).splitlines() if line]
if set(changed) != set(FINAL_FILES):
    raise SystemExit("FINAL_DIFF_MISMATCH:" + ",".join(changed))
src_changed = [name for name in changed if name.startswith("src/")]
if src_changed != ["src/server/event-route-stage124f.ts"]:
    raise SystemExit("RUNTIME_SCOPE_MISMATCH:" + ",".join(src_changed))

results: dict[str, object] = {"changed_files": changed, "src_changed": src_changed}
results["g15_r2"] = run(["npm", "run", "verify:lf-prod-sot-g15-r2"])
results["g14"] = run(["npm", "run", "verify:lf-prod-sot-g14"])
results["diff_check"] = run(["git", "diff", "--check", f"{INPUT_HEAD}..HEAD"])
results["build"] = run(["npm", "run", "build"])
write_artifact(results)
print("G15_R2_PREVIEW_RUNNER: PASS", flush=True)
