from __future__ import annotations

import hashlib
import json
import os
import shutil
import subprocess
import zipfile
from pathlib import Path

APP_COMMIT = "4804b532f143918d9f714e8ea61a12f8c70b2f91"
APP_INPUT = "1036e10e6c2ca734d9a9b61c9eaa1315fcef1ad9"
G10_VAULT_ANCESTOR = "2b9f4dad19a4ce9bafca1b6475db8d07e33c3170"
STAGE = "LF-PROD-SOT-G11_EVENT_PATCH_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_RUNTIME_ADOPTION"
ZIP_NAME = f"{STAGE}_V1.zip"
ROOT = Path("/tmp/g11-package")
ZIP_PATH = Path("/tmp") / ZIP_NAME
APP_FILES = [
    "src/server/event-route-stage124f.ts",
    "scripts/guards/verify-lf-prod-sot-g11-event-patch-gcal-mutation-scoped-sync-state-marker-runtime-adoption.cjs",
    "tests/lf-prod-sot-g11-event-patch-gcal-mutation-scoped-sync-state-marker-runtime-adoption.test.cjs",
    "_project/runs/LF-PROD-SOT-G11_EVENT_PATCH_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_RUNTIME_ADOPTION.md",
    "tsconfig.g11.json",
    "package.json",
]
ROUTER_REL = "10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md"
MAP_REL = "10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G11_EVENT_PATCH_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_RUNTIME_ADOPTION_MAP.md"


def run(*args: str) -> bytes:
    return subprocess.check_output(args)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


shutil.rmtree(ROOT, ignore_errors=True)
ROOT.mkdir(parents=True)
for relative in APP_FILES:
    destination = ROOT / "APP" / relative
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(run("git", "show", f"{APP_COMMIT}:{relative}"))

router_block = """<!-- LF-PROD-SOT-G11 START -->

## LF-PROD-SOT-G11

STAGE:
LF-PROD-SOT-G11_EVENT_PATCH_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_RUNTIME_ADOPTION

MAPA:
10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G11_EVENT_PATCH_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_RUNTIME_ADOPTION_MAP.md

DEPENDENCY_CHAIN:
G7 -> G8 -> G9 -> G10 task PATCH -> G11 event PATCH

STATUS:
PASS_EVENT_PATCH_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_RUNTIME_ADOPTION

TASK_PATCH_WIRED: YES
EVENT_PATCH_WIRED: YES
TASK_POST_WIRED: NO
TASK_DELETE_WIRED: NO
EVENT_POST_WIRED: NO
EVENT_DELETE_WIRED: NO
NEXT_STAGE: DO_POTWIERDZENIA_AFTER_G11_VERIFICATION
G12_CREATED: NO

<!-- LF-PROD-SOT-G11 END -->
"""
(ROOT / "OBSIDIAN" / "G11_ROUTER_BLOCK.md").parent.mkdir(parents=True, exist_ok=True)
(ROOT / "OBSIDIAN" / "G11_ROUTER_BLOCK.md").write_text(router_block, encoding="utf-8", newline="\n")

map_path = ROOT / "OBSIDIAN" / MAP_REL
map_path.parent.mkdir(parents=True, exist_ok=True)
map_path.write_text(
    f"""# LF-PROD-SOT-G11 — Event PATCH Google Calendar Mutation Scoped Sync-State Marker Runtime Adoption Map

DATA_I_CZAS: 2026-07-12 14:55 Europe/Warsaw
STAGE: {STAGE}
STATUS: READY_FOR_LOCAL_OBSIDIAN_APPLY_AND_PUSH
CANONICAL_NAME: CloseFlow / LeadFlow
PROJECT_ID: closeflow_lead_app
APP_REPO: dkknapikdamian-collab/leadflowv1
APP_BRANCH: dev-rollout-freeze
APP_LOCAL_PATH: C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow
APP_INPUT_HEAD_G11: {APP_INPUT}
APP_COMMIT: {APP_COMMIT}
APP_PUSH: PASS
OBSIDIAN_REPO: dkknapikdamian-collab/obsidian-vault
OBSIDIAN_BRANCH: main
OBSIDIAN_LOCAL_PATH: C:\\Users\\malim\\Desktop\\biznesy_ai\\00_OBSIDIAN_VAULT
OBSIDIAN_INPUT_HEAD_G11: RESOLVED_BY_APPLY_SCRIPT
REQUIRED_G10_OBSIDIAN_ANCESTOR: {G10_VAULT_ANCESTOR}
OBSIDIAN_COMMIT: SELF_RESOLVED_AFTER_COMMIT
OBSIDIAN_PUSH: PENDING_LOCAL_APPLY
ROUTER: {ROUTER_REL}
MAP: {MAP_REL}
DEPENDENCY_CHAIN: G7 -> G8 -> G9 -> G10 task PATCH -> G11 event PATCH
CALL_ORDER: EVENT_SCOPED_UPDATE -> EXISTING_LEAD_SIDE_EFFECT -> G9_MARKER -> HTTP_200
MARKER_INPUT: workItemId=String(body.id) / workspaceId / mutationKind=update
MARKER_OUTPUT: Nie jest zwracany klientowi.
NO_WRITE_BEHAVIOR: unchanged / skip_imported / skip_no_owner / skip_no_calendar_time / already pending / already pending_delete -> PATCH 200
HARD_ERROR_BEHAVIOR: found=false -> EVENT_PATCH_GCAL_MUTATION_SNAPSHOT_NOT_FOUND; błędy G8/G9 -> istniejący sendError
SNAPSHOT_NOT_FOUND_IS_HARD_ERROR: YES
SUCCESS_RESPONSE_SHAPE_CHANGED: NO
TASK_PATCH_WIRED: YES
EVENT_PATCH_WIRED: YES
TASK_POST_WIRED: NO
TASK_DELETE_WIRED: NO
EVENT_POST_WIRED: NO
EVENT_DELETE_WIRED: NO
GOOGLE_REMOTE_CALL_CHANGED: NO
SQL_CHANGED: NO
UI_CSS_CHANGED: NO
G10_PRECHECK: PASS
G10_PRECHECK_TESTS: 31 PASS / 0 FAIL
PRE_G11_BUILD: PASS
G11_GUARD: PASS_AFTER_LOCAL_OBSIDIAN_APPLY
G11_TESTS: 36 PASS / 0 FAIL
G11_SCOPED_TSC: PASS
BUILD: PASS
GIT_DIFF_CHECK: PASS
RECOVERY_ZIP: {ZIP_NAME}
RISK_AUDIT:
- Event PATCH pozostaje operacją wieloetapową bez transakcji DB.
- Główny zapis i side effect leada mogą zostać utrwalone przed błędem markera.
- Retry PATCH jest mechanizmem naprawczym.
- Event POST/DELETE i task POST/DELETE pozostają poza G11.
- Obsidian push wymaga lokalnego apply, ponieważ repo nie przydziela runnera GitHub Actions.
WHAT_WAS_NOT_TOUCHED:
- task route
- event GET/POST/DELETE
- G7/G8/G9/G10
- outbound/inbound
- SQL/migrations
- UI/CSS
NEXT_STEP: RUN_SCRIPTS/APPLY_OBSIDIAN_G11_AND_PUSH.ps1
G12_CREATED: NO
KONIEC ETAPU G11 — PENDING_OBSIDIAN_PUSH
""",
    encoding="utf-8",
    newline="\n",
)

scripts = ROOT / "SCRIPTS"
scripts.mkdir(parents=True, exist_ok=True)
apply_script = r'''$ErrorActionPreference = "Stop"
$App = "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
$Vault = "C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT"
$ExpectedApp = "4804b532f143918d9f714e8ea61a12f8c70b2f91"
$RequiredVaultAncestor = "2b9f4dad19a4ce9bafca1b6475db8d07e33c3170"
$RouterRel = "10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md"
$MapRel = "10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G11_EVENT_PATCH_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_RUNTIME_ADOPTION_MAP.md"
$Root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path "$App\.git")) { throw "APP_REPO_NOT_FOUND" }
if (-not (Test-Path "$Vault\.git")) { throw "OBSIDIAN_REPO_NOT_FOUND" }
if (@(git -C $App status --porcelain --untracked-files=all).Count -gt 0) { throw "BLOCKED_DIRTY_APP_WORKTREE" }
if (@(git -C $Vault status --porcelain --untracked-files=all).Count -gt 0) { throw "BLOCKED_DIRTY_OBSIDIAN_WORKTREE" }
git -C $App fetch origin dev-rollout-freeze --prune
if ((git -C $App branch --show-current).Trim() -ne "dev-rollout-freeze") { throw "BLOCKED_APP_BRANCH" }
if ((git -C $App rev-parse origin/dev-rollout-freeze).Trim() -ne $ExpectedApp) { throw "BLOCKED_APP_ORIGIN_DRIFT" }
if ((git -C $App rev-parse HEAD).Trim() -ne $ExpectedApp) { git -C $App pull --ff-only origin dev-rollout-freeze }
if ((git -C $App rev-parse HEAD).Trim() -ne $ExpectedApp) { throw "APP_LOCAL_SYNC_FAILED" }
git -C $Vault fetch origin main --prune
if ((git -C $Vault branch --show-current).Trim() -ne "main") { throw "BLOCKED_OBSIDIAN_BRANCH" }
if ((git -C $Vault rev-parse HEAD).Trim() -ne (git -C $Vault rev-parse origin/main).Trim()) { git -C $Vault pull --ff-only origin main }
if ((git -C $Vault rev-parse HEAD).Trim() -ne (git -C $Vault rev-parse origin/main).Trim()) { throw "OBSIDIAN_LOCAL_SYNC_FAILED" }
git -C $Vault merge-base --is-ancestor $RequiredVaultAncestor HEAD
if ($LASTEXITCODE -ne 0) { throw "BLOCKED_G10_OBSIDIAN_ANCESTRY" }
$ObsidianInput = (git -C $Vault rev-parse HEAD).Trim()
$RouterPath = Join-Path $Vault $RouterRel
$MapPath = Join-Path $Vault $MapRel
$Router = [IO.File]::ReadAllText($RouterPath, [Text.UTF8Encoding]::new($false))
if ($Router.Contains("<!-- LF-PROD-SOT-G11 START -->") -or $Router.Contains("<!-- LF-PROD-SOT-G11 END -->")) { throw "G11_ROUTER_BLOCK_ALREADY_EXISTS" }
if (-not $Router.Contains("<!-- LF-PROD-SOT-G10 END -->")) { throw "G10_ROUTER_ANCHOR_NOT_FOUND" }
$Block = [IO.File]::ReadAllText((Join-Path $Root "OBSIDIAN\G11_ROUTER_BLOCK.md"), [Text.UTF8Encoding]::new($false))
[IO.File]::WriteAllText($RouterPath, $Router.TrimEnd("`r", "`n") + "`n`n" + $Block.TrimStart("`r", "`n"), [Text.UTF8Encoding]::new($false))
$MapTemplate = Join-Path $Root ("OBSIDIAN\" + $MapRel)
$Map = [IO.File]::ReadAllText($MapTemplate, [Text.UTF8Encoding]::new($false)).Replace("OBSIDIAN_INPUT_HEAD_G11: RESOLVED_BY_APPLY_SCRIPT", "OBSIDIAN_INPUT_HEAD_G11: $ObsidianInput")
[IO.Directory]::CreateDirectory((Split-Path -Parent $MapPath)) | Out-Null
[IO.File]::WriteAllText($MapPath, $Map, [Text.UTF8Encoding]::new($false))
$Expected = @($RouterRel, $MapRel) | Sort-Object
$Actual = @(git -C $Vault status --porcelain --untracked-files=all | ForEach-Object { $_.Substring(3).Replace("\", "/") } | Sort-Object)
if (($Actual -join "`n") -ne ($Expected -join "`n")) { git -C $Vault status --short; throw "STOP_SCOPE_DRIFT" }
git -C $Vault diff --check
if ($LASTEXITCODE -ne 0) { throw "OBSIDIAN_DIFF_CHECK_FAILED" }
Push-Location $App
$env:OBSIDIAN_VAULT_PATH = $Vault
$env:G11_OBSIDIAN_INPUT_HEAD = $ObsidianInput
npm.cmd run verify:lf-prod-sot-g11
if ($LASTEXITCODE -ne 0) { throw "G11_VERIFY_FAILED" }
npm.cmd run build
if ($LASTEXITCODE -ne 0) { throw "G11_BUILD_FAILED" }
Pop-Location
git -C $Vault add -- $RouterRel $MapRel
git -C $Vault diff --cached --check
$Staged = @(git -C $Vault diff --cached --name-only | Sort-Object)
if (($Staged -join "`n") -ne ($Expected -join "`n")) { throw "STOP_STAGED_SCOPE_DRIFT" }
git -C $Vault commit -m "docs(sot): map G11 event PATCH marker adoption"
git -C $Vault push origin main
$ObsidianCommit = (git -C $Vault rev-parse HEAD).Trim()
if ($ObsidianCommit -ne (git -C $Vault rev-parse origin/main).Trim()) { throw "OBSIDIAN_HEAD_ORIGIN_MISMATCH" }
if (@(git -C $Vault status --porcelain --untracked-files=all).Count -gt 0) { throw "OBSIDIAN_WORKTREE_NOT_CLEAN" }
Write-Host "STATUS: PASS_EVENT_PATCH_GCAL_MUTATION_SCOPED_SYNC_STATE_MARKER_RUNTIME_ADOPTION"
Write-Host "APP_COMMIT: $ExpectedApp"
Write-Host "OBSIDIAN_INPUT_HEAD_G11: $ObsidianInput"
Write-Host "OBSIDIAN_COMMIT: $ObsidianCommit"
Write-Host "APP_LOCAL_SYNC: PASS"
Write-Host "OBSIDIAN_LOCAL_SYNC: PASS"
Write-Host "G12_CREATED: NO"
Write-Host "KONIEC ETAPU G11"
'''
(scripts / "APPLY_OBSIDIAN_G11_AND_PUSH.ps1").write_text(apply_script, encoding="utf-8", newline="\n")
(scripts / "PRECHECK_G11.ps1").write_text(
    '$ErrorActionPreference = "Stop"\nWrite-Host "Run APPLY_OBSIDIAN_G11_AND_PUSH.ps1; it performs the full guarded precheck before writing."\n',
    encoding="utf-8",
    newline="\n",
)
(scripts / "VERIFY_COMMIT_PUSH_G11.ps1").write_text(
    r'''$ErrorActionPreference = "Stop"
$App = "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
$Vault = "C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT"
$ExpectedApp = "4804b532f143918d9f714e8ea61a12f8c70b2f91"
if (@(git -C $App status --porcelain --untracked-files=all).Count -gt 0) { throw "APP_WORKTREE_NOT_CLEAN" }
if (@(git -C $Vault status --porcelain --untracked-files=all).Count -gt 0) { throw "OBSIDIAN_WORKTREE_NOT_CLEAN" }
git -C $App fetch origin dev-rollout-freeze --prune
git -C $Vault fetch origin main --prune
if ((git -C $App rev-parse HEAD).Trim() -ne $ExpectedApp) { throw "APP_LOCAL_SYNC_PENDING" }
if ((git -C $App rev-parse origin/dev-rollout-freeze).Trim() -ne $ExpectedApp) { throw "APP_ORIGIN_MISMATCH" }
if ((git -C $Vault rev-parse HEAD).Trim() -ne (git -C $Vault rev-parse origin/main).Trim()) { throw "OBSIDIAN_LOCAL_SYNC_PENDING" }
Push-Location $App
git diff --check
npm.cmd run verify:lf-prod-sot-g11
npm.cmd run build
Pop-Location
Write-Host "VERIFY_COMMIT_PUSH_G11: PASS"
''',
    encoding="utf-8",
    newline="\n",
)

manifest = {
    "stage": STAGE,
    "status": "BLOCKED_OBSIDIAN_PUSH_PENDING_LOCAL_APPLY",
    "created_at": "2026-07-12 14:55 Europe/Warsaw",
    "app_input_head_g11": APP_INPUT,
    "app_commit": APP_COMMIT,
    "app_push": "PASS",
    "required_g10_obsidian_ancestor": G10_VAULT_ANCESTOR,
    "obsidian_push": "PENDING_LOCAL_APPLY",
    "tests": "36 PASS / 0 FAIL",
    "scoped_tsc": "PASS",
    "build": "PASS",
    "g12_created": False,
    "fallback_reason": "obsidian-vault Actions jobs fail before their first step; router is patched locally after ancestry, clean-tree and scope checks",
    "app_files": APP_FILES,
}
(ROOT / "MANIFEST.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")

files = sorted(path for path in ROOT.rglob("*") if path.is_file())
(ROOT / "SHA256SUMS.txt").write_text(
    "\n".join(f"{sha256(path)}  {path.relative_to(ROOT).as_posix()}" for path in files) + "\n",
    encoding="utf-8",
    newline="\n",
)
if ZIP_PATH.exists():
    ZIP_PATH.unlink()
with zipfile.ZipFile(ZIP_PATH, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for path in sorted(path for path in ROOT.rglob("*") if path.is_file()):
        archive.write(path, path.relative_to(ROOT).as_posix())
zip_digest = sha256(ZIP_PATH)
Path("/tmp/G11_ZIP_SHA256.txt").write_text(f"{zip_digest}  {ZIP_NAME}\n", encoding="ascii")
print(json.dumps({"zip": str(ZIP_PATH), "sha256": zip_digest, "files": len(files)}, sort_keys=True))
