# LF-PROD-SOT-G5-R1-R1 — UTF-8 Router Heading Repair and Guard Hardening

DATA_I_CZAS: 2026-07-10 22:07 Europe/Warsaw
STAGE: LF-PROD-SOT-G5-R1-R1_UTF8_ROUTER_HEADING_REPAIR_AND_GUARD_HARDENING
CHARACTER: UTF8_REPAIR_AND_GUARD_HARDENING_ONLY
CANONICAL_NAME: CloseFlow / LeadFlow
PROJECT_ID: closeflow_lead_app
ENTITY_ID: DO_POTWIERDZENIA
REPORT_ID: DO_POTWIERDZENIA

APP_REPO: dkknapikdamian-collab/leadflowv1
APP_BRANCH: dev-rollout-freeze
APP_LOCAL_PATH: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
OBSIDIAN_REPO: dkknapikdamian-collab/obsidian-vault
OBSIDIAN_BRANCH: main
OBSIDIAN_LOCAL_PATH: C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT

## Verified defect

G5_R1_LOGIC_CONTRACT: PASS
G5_R1_APP_SCOPE: PASS
G5_R1_OBSIDIAN_MAP_ROUTE: PRESENT
G5_R1_UTF8_CLEANLINESS_BEFORE_REPAIR: FAIL
UTF8_DEFECT_FILE: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md
UTF8_DEFECT_TOKEN: mojibake em dash in G5-R1 heading

## Repair decision

G5_R1_R1_FINAL_STATUS: PASS_UTF8_ROUTER_HEADING_REPAIR_AND_GUARD_HARDENING
UTF8_ROUTER_HEADING: CLEAN_EM_DASH
MOJIBAKE_GUARD_HARDENED: YES

REPAIR_SCOPE:
- replace only the corrupted dash in the G5-R1 router heading
- harden the existing G5-R1 guard against common mojibake tokens
- add a direct UTF-8 test for the G5-R1 router block and stage documents
- preserve the G5-R1 contract and selected G6 route

MOJIBAKE_TOKENS_BLOCKED:
- corrupted em dash token
- corrupted en dash token
- corrupted apostrophe token
- corrupted opening and closing quote tokens
- common UTF-8/Windows-1252 prefix artifacts
- Unicode replacement character

## Scope controls

RUNTIME_CHANGED: NO
SRC_CHANGED: NO
UI_CSS_CHANGED: NO
SQL_API_SUPABASE_CHANGED: NO
GCAL_REMOTE_CALL_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
PACKAGE_LOCK_CHANGED: NO
DATA_FLOWS_CHANGED: NO

G5_R1_CONTRACT_CHANGED: NO
G5_R1_APP_REPORT_CHANGED: NO
G5_R1_OBSIDIAN_MAP_CHANGED: NO
G6_CREATED: NO

APP_FILES_CHANGED:
- scripts/guards/verify-lf-prod-sot-g5-r1-gcal-contract-decision.cjs
- tests/lf-prod-sot-g5-r1-gcal-contract-decision.test.cjs
- _project/runs/LF-PROD-SOT-G5-R1-R1_UTF8_ROUTER_HEADING_REPAIR_AND_GUARD_HARDENING.md

OBSIDIAN_FILES_CHANGED:
- 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md
- 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G5-R1-R1_UTF8_ROUTER_HEADING_REPAIR_AND_GUARD_HARDENING_MAP.md

## Guard contract

GUARD_ALIAS_REUSED: verify:lf-prod-sot-g5-r1
NEW_PACKAGE_ALIAS_CREATED: NO
GUARD_SCANS:
- G5-R1 app report
- G5-R1 Obsidian map
- exact G5-R1 router block
- G5-R1-R1 app report
- G5-R1-R1 Obsidian map

GUARD_ROUTER_SCOPE: EXACT_G5_R1_MARKED_BLOCK_ONLY
UNRELATED_HISTORICAL_VAULT_MOJIBAKE_SCAN: FORBIDDEN
REASON: this repair must not absorb unrelated project cleanup into the CloseFlow stage.

## Handoff

NEXT_STAGE_SELECTED: LF-PROD-SOT-G6_GCAL_FIRST_SAFE_CONTRACT_GUARD
G6_FIRST_CONTRACT_TARGET: TASK_EVENT_MUTATION_TO_GCAL_PENDING_STATE_CONTRACT_GUARD
G6_CREATED: NO

KONIEC ETAPU
