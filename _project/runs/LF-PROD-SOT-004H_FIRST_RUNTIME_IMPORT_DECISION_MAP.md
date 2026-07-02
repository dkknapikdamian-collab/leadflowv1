# LF-PROD-SOT-004H - First runtime import decision map

## Status

FIRST_RUNTIME_IMPORT_DECISION_MAP_ADDED / NO_RUNTIME_CHANGE / NO_UI_CHANGE / NO_CSS_CHANGE / NO_SQL_CHANGE / FIRST_RUNTIME_IMPORT_DECISION_SELECTED

## Input status

- Previous stage: LF-PROD-SOT-004G_CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN
- Previous required marker: FIRST_RUNTIME_IMPORT_DECISION_NEEDED
- Required bridge marker: FIRST_RUNTIME_IMPORT_DECISION_NEEDED_FROM_004G
- App closeout commit for 004G: 71fbb289e0477825b0bbd0b8981e3559705ae9b3
- This stage resolves the decision only. It does not implement runtime import.

## Source maps read

- _project/runs/LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md
- _project/runs/LF-PROD-SOT-004B_READONLY_RUNTIME_ADOPTION.md
- _project/runs/LF-PROD-SOT-004C_TODAY_READONLY_BRIDGE.md
- _project/runs/LF-PROD-SOT-004D_LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE.md
- _project/runs/LF-PROD-SOT-004E_FORMS_MODALS_ACTION_VISUAL_BRIDGE.md
- _project/runs/LF-PROD-SOT-004F_CASEDETAIL_ISOLATED_ADOPTION_PLAN.md
- _project/runs/LF-PROD-SOT-004G_CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN.md
- src/lib/source-of-truth/runtime-adoption-readonly.ts
- src/lib/source-of-truth/today-readonly-bridge.ts
- src/lib/source-of-truth/lists-cards-readonly-bridge.ts
- src/lib/source-of-truth/forms-modals-action-visual-readonly-bridge.ts
- src/lib/source-of-truth/casedetail-isolated-adoption-plan.ts
- src/lib/source-of-truth/calendar-date-time-boundary-plan.ts
- src/lib/source-of-truth/status-repository.ts
- src/lib/source-of-truth/date-time-repository.ts
- src/lib/source-of-truth/visual-repository.ts

## Hard boundaries for 004H

- Runtime import: FORBIDDEN_IN_004H
- UI change: FORBIDDEN
- CSS change: FORBIDDEN
- SQL change: FORBIDDEN
- Supabase/API change: FORBIDDEN
- Google Calendar sync change: FORBIDDEN
- Google Calendar mapper change: FORBIDDEN
- Calendar runtime change: FORBIDDEN
- Tasks runtime change: FORBIDDEN
- Today runtime change: FORBIDDEN
- CaseDetail runtime adoption: FORBIDDEN
- Finance runtime adoption: FORBIDDEN
- date precedence change: FORBIDDEN
- date-only default change: FORBIDDEN
- Today counts change: FORBIDDEN
- task/event status label change: FORBIDDEN
- work-items normalize change: FORBIDDEN

## Candidate decision matrix

### 1. Calendar/date-time boundary read-only runtime import

- candidateId: CALENDAR_DATE_TIME_BOUNDARY_READONLY_IMPORT
- risk level: MEDIUM
- touched runtime surfaces: Calendar local date/time boundary only in a future stage
- possible visible output drift: MEDIUM, guarded by no-drift snapshot and manual smoke
- rollback difficulty: LOW to MEDIUM
- manual smoke required: YES
- guard coverage existing: YES, LF-PROD-SOT-004G
- test coverage existing: YES, LF-PROD-SOT-004G node test
- Google Calendar sync touched: NO
- SQL/Supabase/API touched: NO
- CSS/UI touched: NO
- runtime implementation in 004H: NO
- recommendation: YES
- selectedFirstImport: TRUE

### 2. Today status/date read-only runtime import

- candidateId: TODAY_STATUS_DATE_READONLY_IMPORT
- risk level: HIGH
- touched runtime surfaces: Today task/event display and counters in a future stage
- possible visible output drift: HIGH
- rollback difficulty: MEDIUM
- manual smoke required: YES
- guard coverage existing: PARTIAL
- test coverage existing: PARTIAL
- Google Calendar sync touched: NO
- SQL/Supabase/API touched: NO
- CSS/UI touched: NO
- runtime implementation in 004H: NO
- recommendation: LATER

### 3. Lists/cards status/date read-only runtime import

- candidateId: LISTS_CARDS_STATUS_DATE_READONLY_IMPORT
- risk level: HIGH
- touched runtime surfaces: leads/cases/clients list cards in a future stage
- possible visible output drift: HIGH
- rollback difficulty: MEDIUM
- manual smoke required: YES
- guard coverage existing: PARTIAL
- test coverage existing: PARTIAL
- Google Calendar sync touched: NO
- SQL/Supabase/API touched: NO
- CSS/UI touched: NO
- runtime implementation in 004H: NO
- recommendation: LATER

### 4. Forms/modals/action visual read-only runtime import

- candidateId: FORMS_MODALS_ACTION_VISUAL_READONLY_IMPORT
- risk level: HIGH
- touched runtime surfaces: forms, modals, actions in a future stage
- possible visible output drift: HIGH
- rollback difficulty: HIGH
- manual smoke required: YES
- guard coverage existing: PARTIAL
- test coverage existing: PARTIAL
- Google Calendar sync touched: NO
- SQL/Supabase/API touched: NO
- CSS/UI touched: NO
- runtime implementation in 004H: NO
- recommendation: LATER

### 5. CaseDetail isolated runtime import

- candidateId: CASEDETAIL_ISOLATED_RUNTIME_IMPORT
- risk level: VERY_HIGH
- touched runtime surfaces: CaseDetail in a future stage
- possible visible output drift: VERY_HIGH
- rollback difficulty: HIGH
- manual smoke required: YES
- guard coverage existing: PARTIAL
- test coverage existing: PARTIAL
- Google Calendar sync touched: NO
- SQL/Supabase/API touched: NO
- CSS/UI touched: NO
- runtime implementation in 004H: NO
- recommendation: BLOCKED_FOR_LATER

### 6. Finance runtime import

- candidateId: FINANCE_RUNTIME_IMPORT
- risk level: VERY_HIGH
- touched runtime surfaces: Finance in a future stage
- possible visible output drift: VERY_HIGH
- rollback difficulty: HIGH
- manual smoke required: YES
- guard coverage existing: NO_FOR_CURRENT_PATH
- test coverage existing: NO_FOR_CURRENT_PATH
- Google Calendar sync touched: NO
- SQL/Supabase/API touched: POSSIBLE_IN_FUTURE
- CSS/UI touched: NO
- runtime implementation in 004H: NO
- recommendation: BLOCKED_FOR_LATER

## FIRST_RUNTIME_IMPORT_DECISION

CALENDAR_DATE_TIME_BOUNDARY_READONLY_IMPORT_FIRST

Reason:
- 004G created a dedicated calendar/date-time boundary plan.
- The first import can be isolated to local calendar/date-time read-only behavior.
- It does not require Google Calendar sync mutation.
- It does not require SQL/Supabase/API changes.
- It does not require CSS/UI changes.
- CaseDetail remains VERY_HIGH risk.
- Finance remains outside the current runtime adoption path.

## NEXT_STAGE_AFTER_004H

LF-PROD-SOT-004I_CALENDAR_DATE_TIME_BOUNDARY_READONLY_RUNTIME_IMPORT

## What was not touched in 004H

- Calendar runtime: NOT_TOUCHED
- Tasks runtime: NOT_TOUCHED
- Today runtime: NOT_TOUCHED
- CaseDetail runtime: NOT_TOUCHED
- Finance runtime: NOT_TOUCHED
- Google Calendar sync: NOT_TOUCHED
- Google Calendar mapper: NOT_TOUCHED
- SQL: NOT_TOUCHED
- Supabase/API: NOT_TOUCHED
- UI: NOT_TOUCHED
- CSS: NOT_TOUCHED
- runtime behavior: NOT_TOUCHED

## Required verification

- verify:lf-prod-sot-004h-first-runtime-import-decision-map: REQUIRED
- node --test tests/lf-prod-sot-004h-first-runtime-import-decision-map.test.cjs: REQUIRED
- verify:lf-prod-sot-004g-calendar-date-time-boundary-plan: REQUIRED
- verify:lf-prod-sot-004f-casedetail-isolated-adoption-plan: REQUIRED
- guard:routes:canonical: REQUIRED
- guard:ui:patch-layers: REQUIRED
- check:polish-mojibake: REQUIRED
- npm run build: REQUIRED
- git diff --check: REQUIRED

KONIEC ETAPU LF-PROD-SOT-004H.
