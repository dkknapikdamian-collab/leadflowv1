# STAGE231H_R1_CASE_DETAIL_FUNCTION_MAPPING_AUDIT_AND_REPAIR

Status: REQUIRES_R1B_RUNTIME_REPAIR

## Scan report

Read: AGENTS.md, _project/04_ETAPY_ROZWOJU_APLIKACJI.md, _project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md, src/pages/CaseDetail.tsx, src/components/CaseQuickActions.tsx, src/components/finance/CaseSettlementSection.tsx, src/components/finance/CaseFinanceEditorDialog.tsx.

## Audit findings

- DICTATION_COPY_FALSE_PROMISE: button labeled Dyktuj notatke opens the same plain note flow.
- DUAL_CASE_ITEM_PATHS: blocker/case_item has shared quick action path and local CaseItemDialog path.
- CONTRACT_VALUE_PERCENT_ONLY: transaction value edit appears bound to percent commission mode.
- PAYMENT_HISTORY_LIMITED_VISIBLE_LIST: payment history uses a visible list capped to eight records.
- NEXT_ACTION_MISSING_FALLBACK: next action can fallback to missing/blocker.
- CASE_COSTS_LIFECYCLE_UNCONFIRMED: costs creation and summary exist; edit/delete lifecycle is not confirmed.

SQL: NOT_TOUCHED

## MANUAL TEST 20 KROKOW

Manual test remains required in R1B after runtime repair.

## Decision

R1A is an audit lock. Runtime repair must be done in STAGE231H_R1B before CaseDetail can be called PASS.
