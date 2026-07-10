# LF-PROD-SOT-G3 — CaseDetail SOT Gap Map

DATA_I_CZAS: 2026-07-10 16:38 Europe/Warsaw
STAGE: LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP
STATUS: PASS_CASEDETAIL_SOT_GAP_MAP

CANONICAL_NAME: CloseFlow / LeadFlow
PROJECT_ID: DO_POTWIERDZENIA

APP_REPO: dkknapikdamian-collab/leadflowv1
APP_BRANCH: dev-rollout-freeze
APP_HEAD_BEFORE: e15cc2c2da51612b306ca91eb0b943fd988cbe97
APP_LOCAL_PATH: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

OBSIDIAN_REPO: dkknapikdamian-collab/obsidian-vault
OBSIDIAN_BRANCH: main
OBSIDIAN_HEAD_BEFORE: f38c979fe8b6850ce7738d85b0a95369c313425a
OBSIDIAN_FOLDER: 10_PROJEKTY/CloseFlow_Lead_App
OBSIDIAN_LOCAL_PATH: C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT

## Rezultat mapy

CASEDETAIL_CALLSITE_COUNT: 46
DOMAIN_COUNT: 13
FINDING_COUNT: 12

G3_DECISION: STOP_NO_SAFE_CASEDETAIL_CANDIDATE
G3_FIRST_SAFE_CANDIDATE: NONE
NEXT_STAGE_SELECTED: STOP

Najważniejszy fakt: `getCaseDetailPillClass` istnieje w case SOT, lecz `CaseDetail.tsx` nie ma żywego callsite’u klasy statusu sprawy. Generic `getStatusClass` jest używany dla tasków, eventów i case itemów, których SOT-y nie posiadają docelowego kontraktu klas. Pozostałe dryfy dotykają filtrów, dat, sortowania, lifecycle, historii albo finansów.

## Rozdzielenie domen

stored case status != effective case status
effective case status != lifecycle bucket
case item status != missing/blocker semantic status
task status != event status
task/event status != history event type
payment status != case status
cost status != payment status
finance value != finance status
date display != date precedence
visual class != semantic status owner

## Korekta bram

G3_GATE_REPAIR: PRECHECK_ONLY_FOR_R28_G2_G2_R1
POST_G3_OLD_CLOSURE_GUARDS: NOT_RERUN_BY_DESIGN

Guardy G2 i G2-R1 jawnie wymagają nieistnienia G3. Dlatego są uruchamiane raz na czystym wejściowym HEAD przed zapisaniem plików G3. Po zapisaniu G3 obowiązują wyłącznie guard G3, build i `git diff --check`.

## Pliki etapu

APP:
- package.json
- scripts/guards/verify-lf-prod-sot-g3-casedetail-sot-gap-map.cjs
- tests/lf-prod-sot-g3-casedetail-sot-gap-map.test.cjs
- _project/runs/LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP.md

OBSIDIAN:
- 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP.md
- 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md

## Raport końcowy

G3_FINAL_STATUS: PASS_CASEDETAIL_SOT_GAP_MAP
APP_COMMIT: REPORTED_BY_EXECUTOR_AFTER_COMMIT
OBSIDIAN_COMMIT: REPORTED_BY_EXECUTOR_AFTER_COMMIT

VERIFY_R28: PASS (PRECHECK_AT_INPUT_HEAD)
VERIFY_G2: PASS (PRECHECK_AT_INPUT_HEAD)
VERIFY_G2_R1: PASS (PRECHECK_AT_INPUT_HEAD)
VERIFY_G3: PASS
BUILD: PASS

GIT_DIFF_CHECK_APP: PASS
GIT_DIFF_CHECK_OBSIDIAN: PASS

APP_FINAL_STATUS: CLEAN_AFTER_PUSH_EXPECTED
OBSIDIAN_FINAL_STATUS: CLEAN_AFTER_PUSH_EXPECTED
OBSIDIAN_LOCAL_SYNC: DONE_BY_LOCAL_COMMIT_AND_PUSH

CASEDETAIL_CALLSITE_COUNT: 46
DOMAIN_COUNT: 13
FINDING_COUNT: 12

G3_DECISION: STOP_NO_SAFE_CASEDETAIL_CANDIDATE
G3_FIRST_SAFE_CANDIDATE: NONE
NEXT_STAGE_SELECTED: STOP

RUNTIME_CHANGED: NO
SRC_CHANGED: NO
UI_CSS_CHANGED: NO
SQL_API_SUPABASE_CHANGED: NO
FINANCE_RUNTIME_CHANGED: NO
G4_CREATED: NO

KONIEC ETAPU
