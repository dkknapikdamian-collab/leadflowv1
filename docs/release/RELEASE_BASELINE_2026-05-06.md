# RELEASE BASELINE - 2026-05-06

## Scope
Dokument dowodowy (bez napraw): punkt startowy dla dalszych etapów rollout.

## Repo / branch / commit
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- commit SHA (HEAD): `d789e394749ee0e8c929dca85cbdc1da3cdeb3c5`
- data audytu (lokalna): `2026-05-06 15:38:08 +02:00`

## Git status (baseline)
```text
## dev-rollout-freeze...origin/dev-rollout-freeze
 M docs/release/STAGE12_AI_ASSISTANT_VERCEL_RELEASE_EVIDENCE_LATEST.md
 M docs/release/STAGE16_CONTEXT_ACTION_BUTTON_PARITY_AUDIT_LATEST.md
 M docs/release/STAGE18_CONTEXT_ACTION_RUNTIME_SMOKE_LATEST.md
 M docs/release/STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_LATEST.md
 M docs/release/STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_V1_2026-05-06.md
 M package.json
 M scripts/check-stage19-context-action-route-map-evidence.cjs
 M tests/stage19-context-action-route-map-evidence.test.cjs
?? docs/release/STAGE20B_CONTEXT_ACTION_VERIFY_CHAIN_REPAIR_V1_2026-05-06.md
?? docs/release/STAGE20C_CONTEXT_ACTION_VERIFY_CHAIN_STAGE14_REPAIR_V1_2026-05-06.md
?? docs/release/STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_AUDIT_V1_2026-05-06.md
?? scripts/audit-context-action-real-button-triggers.cjs
?? scripts/audit-stage19-context-action-route-map-evidence.cjs
?? scripts/check-stage20-context-action-real-button-trigger-audit.cjs
?? scripts/check-stage20b-context-action-verify-chain-repair.cjs
?? scripts/check-stage20c-context-action-verify-chain-stage14-repair.cjs
?? tests/stage20-context-action-real-button-trigger-audit.test.cjs
?? tests/stage20b-context-action-verify-chain-repair.test.cjs
?? tests/stage20c-context-action-verify-chain-stage14-repair.test.cjs
```

## package.json - lista istniejących skryptów
Status: skrypty istnieją i są zdefiniowane w `package.json` (sekcja `scripts`).

Kluczowe skrypty release/guard obecne:
- `build`
- `verify:closeflow`
- `verify:closeflow:quiet`
- `test:critical`
- `audit:etap0-freeze-evidence`
- `verify:stage11-stage12-ai-vercel-evidence`
- `verify:stage14-action-route-parity`
- `verify:stage15-context-action-contract`
- `verify:stage16-context-action-button-parity`
- `verify:stage17-context-action-contract-registry`
- `verify:stage18-context-action-runtime-smoke`
- `verify:stage19-context-action-route-map`
- `verify:stage19-context-action-route-map-evidence`
- `verify:stage20-context-action-real-button-triggers`
- `verify:stage20c-context-action-verify-chain-stage14-repair`

Uwaga: pełna lista skryptów jest bardzo duża i znajduje się bezpośrednio w `package.json`.

## Wyniki komend wymaganych w etapie 0

### 1) `npm.cmd run build`
Status: `PASS`

Skrót wyniku:
- Vite build zakończony poprawnie.
- Końcowy komunikat: `built in 13.63s`.

### 2) `npm.cmd run verify:closeflow:quiet`
Status: `FAIL` (skrypt istnieje i uruchamia się)

Skrót wyniku:
- Przeszło wiele testów gate/release, ale cały proces zakończony błędem.
- Główna awaria: `tests/ai-assistant-command-center.test.cjs`.
- W raporcie: `pass 1`, `fail 4` w tej paczce testów.
- Przykładowe oczekiwania, które nie zostały spełnione:
  - brak dopasowania do `scope: 'assistant_read_or_draft_only'`
  - brak dopasowania do `ASSISTANT_ALLOWED_SCOPE`

### 3) `npm.cmd run test:critical`
Status: `FAIL` (skrypt istnieje i uruchamia się)

Skrót wyniku:
- `Tests: 13 | Pass: 12 | Fail: 1`
- Log wskazany przez runner: `test-results\last-test-full.log`
- Sygnalizowana porażka: `A13 guards catch critical auth, access, data, portal, AI, Firestore, Gemini and template UI regressions`

## Brakujące ENV (evidence only)
Metoda:
- porównanie zmiennych wykrytych w kodzie (`src/`, `api/`, `scripts/`, `tests/`) z deklaracjami w `.env.example`.

Zmienne używane w kodzie, których nie ma w `.env.example` (potencjalnie brakujące):
- `A23_DECISION`
- `A23_IMPORT_CONFIRM`
- `A23_INPUT_FILE`
- `A23_MODE`
- `A23_REPORT_FILE`
- `AI_ENABLED`
- `AI_FALLBACK_PROVIDER`
- `AI_PRIMARY_PROVIDER`
- `CLOSEFLOW_SMOKE_ACCESS_TOKEN`
- `CLOSEFLOW_SMOKE_AI_EXPECTED`
- `CLOSEFLOW_SMOKE_BASE_URL`
- `CLOSEFLOW_SMOKE_KEEP_DATA`
- `CLOSEFLOW_SMOKE_WORKSPACE_ID`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_AI_MODEL`
- `CLOUDFLARE_API_TOKEN`
- `DEPLOYMENT_URL`
- `DIGEST_ENFORCE_WORKSPACE_HOUR`
- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `FIREBASE_SERVICE_ACCOUNT_JSON_PATH`
- `FIREBASE_SERVICE_ACCOUNT_PATH`
- `FIRESTORE_COLLECTIONS`
- `FIRESTORE_EXPORT_OUT`
- `GEMINI_MODEL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `QUICK_LEAD_CAPTURE_ENABLED`
- `QUICK_LEAD_DELETE_RAW_TEXT_ON_CONFIRM`
- `RELEASE_PREVIEW_URL`
- `REPO_UNDER_TEST`
- `STRIPE_PRICE_BUSINESS_MONTHLY_PLN`
- `STRIPE_PRICE_BUSINESS_YEARLY_PLN`
- `SUPABASE_WORKSPACE_ID`
- `SUPPORT_FORWARD_EMAIL`
- `SUPPORT_FROM_EMAIL`
- `VERCEL_BRANCH_URL`
- `VERCEL_ENV`
- `VERCEL_PROJECT_PRODUCTION_URL`
- `VITE_AI_USAGE_UNLIMITED`
- `VITE_APP_URL`
- `VITE_PUBLIC_APP_URL`

Uwagi do jakości ekstrakcji:
- W wynikach skanowania pojawiły się też tokeny techniczne niebędące realnymi ENV (`DEV`, `NODE_ENV`, pojedyncze `C`, `GEMINI`), potraktowane jako artefakt regexu/warunków i nieujęte jako brak krytyczny.
- Ten etap tylko raportuje brak zgodności deklaracji vs użycie; bez zmian funkcjonalnych.

## Kontrola po wdrożeniu dokumentu
Wykonać i archiwizować w logach:
- `git status`
- `git branch --show-current`
- `git log --oneline -10`

## Statement baseline
Ten baseline wskazuje dokładnie commit i stan roboczy, który jest audytowany.
Dalsze etapy powinny startować z tego punktu odniesienia.

---
**Formuła audytowa:** "ten commit audytujemy i z tego commita idziemy dalej".
