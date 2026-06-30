# LF-PROD-SOT-CLEANUP-000 — Preflight i zamrożenie zasad pracy

## Status

```txt
PREFLIGHT_BLOCKED_BY_GUARD / LOCAL_GUARDS_PENDING / PUSH_NOT_DONE / ZIP_READY_FOR_DAMIAN
```

Uwaga techniczna: żaden guard nie został oznaczony jako FAIL. Blokada wynika z tego, że wymagane komendy muszą zostać uruchomione w lokalnym checkoutcie Windows `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`. W tym przebiegu wykonano remote scan przez GitHub connector i przygotowano payload/ZIP, bez udawania lokalnych wyników.

Nie przechodzić do `LF-PROD-SOT-001A`, dopóki lokalne guardy i `git diff --check` nie przejdą.

## PROJECT_SCAN

```txt
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
HEAD: 479ea77ab086139c281a70eca385c2c3efa1fd9f — docs(closeflow): close c3 001b report consistency
current stage: LF-PROD-SOT-CLEANUP-000 — Preflight i zamrożenie zasad pracy
active router: src/App.tsx + src/lib/routes.ts; BrowserRouter/Routes in App.tsx; CLOSEFLOW_ROUTES/CLOSEFLOW_ROUTE_MAP in src/lib/routes.ts
active audit: _project/audits/closeflow-source-of-truth-production-audit.md = FILE_NOT_FOUND
target Obsidian path: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-CLEANUP-000_PREFLIGHT_AND_WORK_RULES.md
```

### main risks

```txt
- ryzyko pracy po starym routerze,
- ryzyko big-bang refactoru,
- ryzyko zmiany UI/CSS bez mapy,
- ryzyko zmiany danych bez status/date/entity SOT,
- ryzyko zostawienia etapu tylko w czacie bez Obsidiana,
- ryzyko fałszywego zamknięcia etapu bez lokalnego PASS guardów,
- ryzyko pomieszania starej ścieżki C3 z nową ścieżką LF-PROD-SOT-CLEANUP.
```

### available guards

```txt
guard:routes:canonical = node scripts/check-routes-canonical.cjs
guard:ui:patch-layers = node scripts/check-ui-patch-layers.cjs
guard:config:status-source-of-truth = node scripts/check-config-status-source-of-truth.cjs
check:polish-mojibake = node scripts/check-polish-mojibake.cjs
verify:closeflow = node scripts/closeflow-release-check.cjs
verify:closeflow:quiet = node scripts/closeflow-release-check-quiet.cjs
```

### available tests

```txt
test = node scripts/run-tests-compact.cjs
test:raw = node --test "tests/**/*.test.cjs"
test:compact = node scripts/run-tests-compact.cjs
test:critical = node scripts/run-tests-compact.cjs --critical
```

### files intentionally not touched

```txt
runtime: NOT_TOUCHED
CSS: NOT_TOUCHED
SQL: NOT_TOUCHED
Supabase: NOT_TOUCHED
routing: NOT_TOUCHED
auth: NOT_TOUCHED
UI redesign: NOT_TOUCHED
data provider: NOT_TOUCHED
src/App.tsx: READ_ONLY
src/lib/routes.ts: READ_ONLY
src/components/Layout.tsx: READ_ONLY
package.json: READ_ONLY
```

## Komendy uruchomione

```txt
git status --short --branch:
NOT_RUN_LOCAL_CHATGPT_NO_ACCESS_TO_C_USERS_PATH
required local command prepared below

git branch --show-current:
NOT_RUN_LOCAL_CHATGPT_NO_ACCESS_TO_C_USERS_PATH
remote branch ref used: dev-rollout-freeze

git log --oneline -1:
REMOTE_CHECK_BY_GITHUB_CONNECTOR
479ea77 docs(closeflow): close c3 001b report consistency

npm run guard:routes:canonical:
NOT_RUN_LOCAL / LOCAL_GUARD_PENDING

npm run guard:ui:patch-layers:
NOT_RUN_LOCAL / LOCAL_GUARD_PENDING

npm run check:polish-mojibake:
NOT_RUN_LOCAL / LOCAL_GUARD_PENDING

git diff --check:
NOT_RUN_LOCAL / LOCAL_DIFF_CHECK_PENDING
```

## Decyzja

```txt
Aktywna ścieżka:
LF-PROD-SOT-CLEANUP

Następny etap po zamknięciu 000:
LF-PROD-SOT-001A — Mapowanie statusów

Nie wolno przejść do 001B bez zamkniętego 001A.
Nie wolno przejść do 001A, dopóki 000 nie ma lokalnego PASS:
- guard:routes:canonical PASS,
- guard:ui:patch-layers PASS,
- check:polish-mojibake PASS,
- git diff --check PASS,
- raport zapisany i wypchnięty albo ręcznie zastosowany z ZIP.
```

## Czego nie ruszano

```txt
runtime: NOT_TOUCHED
CSS: NOT_TOUCHED
SQL: NOT_TOUCHED
Supabase: NOT_TOUCHED
routing: NOT_TOUCHED
auth: NOT_TOUCHED
UI redesign: NOT_TOUCHED
data provider: NOT_TOUCHED
```

## Ryzyka

```txt
- big-bang refactor zakazany,
- mapa przed wdrożeniem obowiązkowa,
- każdy etap musi mieć guard/test/build,
- każdy etap musi trafić do Obsidiana,
- push do GitHuba jest domyślnym zamknięciem etapu,
- ten etap nie jest zamknięty, dopóki lokalne guardy nie przejdą.
```

## Lokalne komendy do wykonania przed commitem

```powershell
$ErrorActionPreference = "Stop"

cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"

git status --short --branch
git branch --show-current
git log --oneline -1

npm run guard:routes:canonical
npm run guard:ui:patch-layers
npm run check:polish-mojibake
git diff --check

git status --short --branch
```

Jeżeli branch nie jest `dev-rollout-freeze`, zatrzymać:

```txt
BLOCKED_WRONG_BRANCH
```

Jeżeli guard/diff failuje, zatrzymać:

```txt
PREFLIGHT_BLOCKED_BY_GUARD
```

## Commit/push po lokalnym PASS

```powershell
$ErrorActionPreference = "Stop"

cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"

git status --short --branch
git diff --check

git add "_project/runs/LF-PROD-SOT-CLEANUP-000_PREFLIGHT_AND_WORK_RULES.md"
git commit -m "docs(closeflow): add production sot cleanup preflight"
git push origin dev-rollout-freeze
```

## Obsidian apply/commit/push po lokalnym PASS

```powershell
$ErrorActionPreference = "Stop"

cd "C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT"

git status --short --branch -- . ":(exclude).tmp.driveupload"
git diff --check

git add "10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-CLEANUP-000_PREFLIGHT_AND_WORK_RULES.md"
git commit -m "docs(closeflow): add production sot cleanup preflight"
git push origin main
```

## Obsidian local sync po pushu Obsidiana

```powershell
$ErrorActionPreference = "Stop"

cd "C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT"
git status --short --branch -- . ":(exclude).tmp.driveupload"
git pull --ff-only origin main
git status --short --branch -- . ":(exclude).tmp.driveupload"
```

## Zapis do Obsidiana

```txt
data i godzina: 2026-06-30 18:29 Europe/Warsaw
name/alias: LF-PROD-SOT-CLEANUP-000 preflight and work rules
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
target file/path: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-CLEANUP-000_PREFLIGHT_AND_WORK_RULES.md
save status: ZIP_READY_FOR_DAMIAN / APP_REPORT_PAYLOAD_PREPARED / NOT_APPLIED_LOCAL
Obsidian GitHub sync: NOT_DONE
Obsidian local sync: LOCAL_SYNC_PENDING
tests:
- guard:routes:canonical: LOCAL_PENDING
- guard:ui:patch-layers: LOCAL_PENDING
- check:polish-mojibake: LOCAL_PENDING
- git diff --check: LOCAL_PENDING
risk audit: do not close this stage and do not start LF-PROD-SOT-001A until local guard/diff PASS is pasted back or applied by Damian
what was not touched: runtime, CSS, SQL, Supabase, routing, auth, UI redesign, data provider
next step: apply ZIP locally, run guards, commit/push selectively if PASS
```
