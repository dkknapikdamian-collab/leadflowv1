# LF-PROD-SOT-G15-R23A — TypeScript active scope and type-debt map

TIMESTAMP:
2026-07-21 Europe/Warsaw

STATUS:
READY_FOR_AUTOMATED_EVIDENCE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
8480a77d76a4777c2b9ea9d069c632bfd14f5099

REPLACED_PR:
#37 CLOSED_WITHOUT_MERGE_SCOPE_MISMATCH

## Cel

Ustalić prawdziwy zakres głównego `tsc --noEmit` oraz wygenerować wykonywalną mapę błędów wyłącznie aktywnego kodu. Etap nie naprawia jeszcze błędów domenowych i nie może przemycać zmian runtime jako konfiguracji TypeScript.

## Zakres wdrożenia

- `tsconfig.json`: jawne `include` dla `src/**/*`, `api/**/*`, `vite.config.ts`;
- `tsconfig.json`: jawne wyłączenie historycznych patcherów, backupów i artefaktów;
- guard programu TypeScript oparty o TypeScript API;
- diagnostyka zapisująca pełny log oraz maszynowy `summary.json`;
- focused tests klasyfikacji;
- dedykowany workflow Ubuntu;
- production build.

## Fundament typów

Workflow instaluje diagnostycznie, bez zapisu manifestów:

- `@types/react@19.2.17`;
- `@types/react-dom@19.2.3`.

Krok `git diff --exit-code -- package.json package-lock.json` musi potwierdzić, że instalacja nie modyfikuje zależności projektu. Trwała decyzja dotycząca typów React należy do późniejszego, osobnego etapu i nie jest ukrywana jako PASS.

## Kryteria PASS R23A

- focused tests: PASS;
- active TypeScript scope guard: PASS;
- brak plików `scripts`, `tools`, `_project`, backupów i `bisect` w programie TypeScript;
- mapper zwraca `ALL_GREEN` albo `ACTIVE_TYPE_DEBT_IDENTIFIED`;
- pełny log i `summary.json` są opublikowane jako artifact;
- production build: PASS;
- brak zmian `src`, `api`, `package.json`, `package-lock.json`, SQL i runtime;
- następny etap jest jednoznacznie wyprowadzony z pierwszego aktywnego błędu.

## Statusy niedozwolone jako PASS

- `GLOBAL_TYPE_FOUNDATION_ERROR`;
- `NON_PRODUCT_SCOPE_LEAK`;
- `UNCLASSIFIED_TSC_FAILURE`;
- Vercel `build-rate-limit` jako rzekomy sukces deploymentu.

## Nienaruszalny zakres

- Event DELETE i Task DELETE bez zmian;
- remote Google Calendar bez zmian;
- manualny Google Calendar smoke: `NOT_EXECUTED_DEFERRED_BY_OWNER`;
- lokalny Obsidian: `LOCAL_VAULT_SYNC_WAIVED_BY_OWNER`;
- inne projekty, w tym Hermes: bez zmian.

## Wynik oczekujący na CI

WORKFLOW_RUN:
PENDING

ARTIFACT_ID:
PENDING

ARTIFACT_DIGEST:
PENDING

TSC_MAP_STATUS:
PENDING

FIRST_ACTIVE_ERROR:
PENDING

NEXT_STAGE:
PENDING_FROM_ARTIFACT

RESULT:
PENDING_AUTOMATED_EVIDENCE
