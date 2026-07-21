# LF-PROD-SOT-G15-R23A — TypeScript active scope and type-debt map

TIMESTAMP:
2026-07-21 Europe/Warsaw

STATUS:
PASS_TSC_ACTIVE_SCOPE_AND_TYPE_DEBT_MAP

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
8480a77d76a4777c2b9ea9d069c632bfd14f5099

EVIDENCE_HEAD:
e3464612086e713194bdd4520def09f42a749d4a

PR:
#38

REPLACED_PR:
#37 CLOSED_WITHOUT_MERGE_SCOPE_MISMATCH

## Cel

Ustalić prawdziwy zakres głównego `tsc --noEmit` oraz wygenerować wykonywalną mapę błędów wyłącznie aktywnego kodu. Etap nie naprawia błędów domenowych i nie przemyca zmian runtime jako konfiguracji TypeScript.

## Wdrożony zakres

- `tsconfig.json`: jawne `include` dla `src/**/*`, `api/**/*`, `vite.config.ts`;
- `tsconfig.json`: jawne wyłączenie historycznych patcherów, backupów i artefaktów;
- guard programu TypeScript oparty o TypeScript API;
- diagnostyka zapisująca pełny log oraz maszynowy `summary.json`;
- focused tests klasyfikacji;
- dedykowany workflow Ubuntu;
- production build.

## Fundament typów

Workflow zainstalował diagnostycznie, bez zapisu manifestów:

- `@types/react@19.2.17`;
- `@types/react-dom@19.2.3`.

`git diff --exit-code -- package.json package-lock.json`: PASS. Trwała decyzja dotycząca typów React należy do osobnego etapu i nie jest ukrywana jako pełny lint PASS.

## Dowody automatyczne

WORKFLOW_RUN:
29828167925

WORKFLOW_JOB:
88626246761

FOCUSED_TESTS:
PASS

TSC_SCOPE_GUARD:
PASS

DEPENDENCY_MANIFESTS_UNCHANGED:
PASS

TSC_MAP_STATUS:
ACTIVE_TYPE_DEBT_IDENTIFIED

TSC_EXIT_CODE:
2

ACTIVE_ERROR_COUNT:
68

GLOBAL_ERROR_COUNT:
0

NON_ACTIVE_ERROR_COUNT:
0

ARTIFACT_ID:
8494164719

ARTIFACT_DIGEST:
sha256:60136a56360270d5e31a47ef43a014dd25fe46bd0cf3f876024d7a7984bc0631

PRODUCTION_BUILD:
PASS

VERCEL_2_CLOSEFLOW:
SUCCESS

VERCEL_CLOSEDOCKAPP:
SUCCESS

## Pierwszy realny błąd aktywnego kodu

COMMAND:
`tsc --noEmit --pretty false`

FIRST_ACTIVE_ERROR:
`src/components/CloseFlowPageHeaderV2.tsx(16,3): TS2741 — Property 'kicker' is missing in type '{ title: string; description: string; }' but required in type 'CloseFlowPageHeaderContent'.`

RELATED_CONTRACT_ERROR:
`src/lib/page-header-content.ts(30,3): TS2741 — Property 'kicker' is missing in the same content contract.`

Największe skupiska błędów z mapy:

- `src/pages/CaseDetail.tsx`: 11;
- `src/pages/LeadDetail.tsx`: 8;
- `src/components/ContextActionDialogs.tsx`: 5;
- `src/pages/Today.tsx`: 5;
- `src/lib/finance/case-finance-source.ts`: 4.

## Następny etap

NEXT_STAGE:
LF-PROD-SOT-G15-R23B_PAGE_HEADER_CONTENT_CONTRACT_TYPE_REPAIR

NEXT_STAGE_SCOPE:
Naprawić wyłącznie kontrakt `CloseFlowPageHeaderContent` i dwa pierwsze błędy `kicker`, z focused testem, typecheck debt delta, production build i bez zmian innych domen.

## Nienaruszony zakres

- pliki `src` i `api`: bez zmian;
- `package.json` i `package-lock.json`: bez zmian;
- SQL i migracje: bez zmian;
- Event DELETE i Task DELETE: bez zmian;
- remote Google Calendar: bez zmian;
- manualny Google Calendar smoke: `NOT_EXECUTED_DEFERRED_BY_OWNER`;
- lokalny Obsidian: `LOCAL_VAULT_SYNC_WAIVED_BY_OWNER`;
- inne projekty, w tym Hermes: bez zmian.

## Interpretacja wyniku

R23A jest PASS jako etap mapowania. Pełny lint nie jest oznaczony jako PASS: zatrzymuje się na realnym aktywnym długu TypeScript, który został teraz policzony, zlokalizowany i skierowany do wąskich etapów naprawczych.

RESULT:
PASS_SCOPE_AND_DEBT_MAP_NEXT_STAGE_READY
