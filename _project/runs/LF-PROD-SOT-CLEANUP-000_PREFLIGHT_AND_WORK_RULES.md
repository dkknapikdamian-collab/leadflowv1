# LF-PROD-SOT-CLEANUP-000 — Preflight i zamrożenie zasad pracy

## Status

```txt
PREFLIGHT_DONE / ROUTER_KNOWN / AUDIT_BASELINE_KNOWN / READY_FOR_MAPPING_001
```

Uwaga techniczna: etap był najpierw zapisany jako remote preflight/payload bez lokalnego PASS. Po lokalnym uruchomieniu wymaganych komend w Windows checkout `C:\Users\malim\Desktop\biznesy_ai\2.closeflow` guardy i `git diff --check` przeszły, raport został zapisany i wypchnięty do repo aplikacji, a payload został zapisany i wypchnięty do Obsidiana.

Można przejść do `LF-PROD-SOT-001A` wyłącznie jako mapowania statusów. Nie wolno w 001A robić runtime, CSS, SQL, Supabase, routingu ani redesignu.

## PROJECT_SCAN

```txt
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
HEAD at local preflight command: 479ea77a — docs(closeflow): close c3 001b report consistency
app report push commit: 8aa077e4 — docs(closeflow): add production sot cleanup preflight
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
- ryzyko fałszywego zamknięcia etapu bez lokalnego PASS guardów — RESOLVED_BY_LOCAL_LOG,
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
PASS
## dev-rollout-freeze...origin/dev-rollout-freeze

branch check:
PASS
git branch --show-current: dev-rollout-freeze

git log --oneline -1:
PASS
479ea77a (HEAD -> dev-rollout-freeze, origin/dev-rollout-freeze) docs(closeflow): close c3 001b report consistency

npm run guard:routes:canonical:
PASS
ok: true
guard: guard:routes:canonical
canonicalCaseDetail: /cases/:caseId
legacyAlias: /case/:caseId -> replace redirect
screensChecked: 17

npm run guard:ui:patch-layers:
PASS
ok: true
guard: guard:ui:patch-layers
knownDebt recorded, no failure

npm run check:polish-mojibake:
PASS
OK: no Polish mojibake detected in runtime UI/source copy.

git diff --check:
PASS
no output / no whitespace errors

post-report git status before commit:
PASS
## dev-rollout-freeze...origin/dev-rollout-freeze
?? _project/runs/LF-PROD-SOT-CLEANUP-000_PREFLIGHT_AND_WORK_RULES.md

app commit:
PASS
8aa077e4 docs(closeflow): add production sot cleanup preflight

app push:
PASS
479ea77a..8aa077e4 dev-rollout-freeze -> dev-rollout-freeze

Obsidian commit:
PASS
4283d9ff docs(closeflow): add production sot cleanup preflight

Obsidian push:
PASS
e0815ad5..4283d9ff main -> main

Obsidian local sync:
PASS
git pull --ff-only origin main: Already up to date.
final status: ## main...origin/main
```

## Decyzja

```txt
Aktywna ścieżka:
LF-PROD-SOT-CLEANUP

Następny etap po zamknięciu 000:
LF-PROD-SOT-001A — Mapowanie statusów

Nie wolno przejść do 001B bez zamkniętego 001A.
001A ma być mapowaniem, bez runtime implementation.
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
- każdy etap musi mieć guard/test/build adekwatny do zakresu,
- każdy etap musi trafić do Obsidiana,
- push do GitHuba jest domyślnym zamknięciem etapu,
- 001A nie może mapować statusów przez zmianę runtime,
- 001A nie może zmieniać CSS, SQL, Supabase, routingu, auth ani data provider.
```

## Kryterium zamknięcia 000

```txt
branch = dev-rollout-freeze: PASS
lokalny git status sprawdzony: PASS
npm run guard:routes:canonical: PASS
npm run guard:ui:patch-layers: PASS
npm run check:polish-mojibake: PASS
git diff --check: PASS
raport repo zaktualizowany: PASS
raport repo pushed: PASS / 8aa077e4
Obsidian zaktualizowany: PASS
Obsidian pushed: PASS / 4283d9ff
Obsidian local sync: PASS / Already up to date
runtime/CSS/SQL/Supabase/routing/auth untouched: PASS
```

## Zapis do Obsidiana

```txt
data i godzina: 2026-06-30 18:45 Europe/Warsaw
name/alias: LF-PROD-SOT-CLEANUP-000 preflight and work rules closeout
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
target file/path: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-CLEANUP-000_PREFLIGHT_AND_WORK_RULES.md
save status: CLOSED / APP_REPORT_PUSHED / OBSIDIAN_PAYLOAD_PUSHED
Obsidian GitHub sync: DONE / 4283d9ff
Obsidian local sync: DONE / Already up to date
tests:
- guard:routes:canonical: PASS
- guard:ui:patch-layers: PASS
- check:polish-mojibake: PASS
- git diff --check: PASS
risk audit: 000 zamknięty; 001A może być tylko mapowaniem statusów bez runtime/CSS/SQL/Supabase/routingu/auth/data provider
what was not touched: runtime, CSS, SQL, Supabase, routing, auth, UI redesign, data provider
next step: LF-PROD-SOT-001A — Mapowanie statusów
```
