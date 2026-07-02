# LF-PROD-SOT-004F - CaseDetail isolated adoption plan

## Status

CASEDETAIL_ISOLATED_ADOPTION_PLAN_ADDED / 004E_FORMAL_CLEANUP_DONE / GUARD_PASS / TEST_PASS / BUILD_PASS / DIFF_CHECK_PASS / READY_FOR_004G_CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN

## Linki SOT / mapa wejściowa

- Centralny indeks map SOT: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md`
- Mapa wejściowa użyta przez ten etap: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md`
- Poprzedni zamknięty etap Obsidian 004D: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004D_LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE.md`
- Poprzedni zamknięty etap Obsidian 004E: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004E_FORMS_MODALS_ACTION_VISUAL_BRIDGE.md`
- Poprzedni zamknięty etap app run 004E: `_project/runs/LF-PROD-SOT-004E_FORMS_MODALS_ACTION_VISUAL_BRIDGE.md`
- Ten etap korzysta z mapy: `LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP`
- Ten etap jest konsumentem mapy: `LF-PROD-SOT-004F_CASEDETAIL_ISOLATED_ADOPTION_PLAN`
- Zasada: nie duplikować całej mapy; trzymać link, status, decyzję, guardy i wynik.

## 004E formal cleanup

- 004E app report main status corrected: DONE
- 004E Obsidian report main status corrected: DONE
- 004E bridge status corrected from pending to final: DONE
- 004E guard after cleanup: PASS
- 004E node test after cleanup: PASS
- 004E build after cleanup: PASS

## Zakres

Etap dodaje wyłącznie izolowany plan adopcji CaseDetail:
- anchor map,
- risk map,
- no-drift policy,
- fixture policy,
- manual smoke policy,
- guard,
- test,
- report.

Etap nie podpina planu do runtime CaseDetail.
Etap nie zmienia widocznego outputu.
Etap nie zmienia CSS.
Etap nie zmienia finansów.
Etap nie zmienia lifecycle/status/timeline/action panels.

## Dodane pliki 004F

- `src/lib/source-of-truth/casedetail-isolated-adoption-plan.ts`
- `scripts/guards/verify-lf-prod-sot-004f-casedetail-isolated-adoption-plan.cjs`
- `tests/lf-prod-sot-004f-casedetail-isolated-adoption-plan.test.cjs`
- `_project/runs/LF-PROD-SOT-004F_CASEDETAIL_ISOLATED_ADOPTION_PLAN.md`
- `package.json` alias: `verify:lf-prod-sot-004f-casedetail-isolated-adoption-plan`

## Twarde reguły

- runtimeBehaviorChange: FORBIDDEN
- uiChange: FORBIDDEN
- cssChange: FORBIDDEN
- layoutChange: FORBIDDEN
- componentReplacement: FORBIDDEN
- CaseDetailRuntimeAdoption: NOT_STARTED
- CaseDetailRepositoryImport: FORBIDDEN_IN_RUNTIME
- caseStatusRedefinition: FORBIDDEN
- caseLifecycleRecalculation: FORBIDDEN
- activityTimelineChange: FORBIDDEN
- serviceWorkspaceChange: FORBIDDEN
- checklistChange: FORBIDDEN
- notesChange: FORBIDDEN
- actionPanelChange: FORBIDDEN
- rightRailChange: FORBIDDEN
- financeSettlementChange: FORBIDDEN
- paymentStatusChange: FORBIDDEN
- commissionStatusChange: FORBIDDEN
- amountCalculationChange: FORBIDDEN
- datePrecedenceChange: FORBIDDEN
- statusLabelChange: FORBIDDEN
- badgeChange: FORBIDDEN
- colorChange: FORBIDDEN
- googleCalendarSyncChange: FORBIDDEN
- dataWriteChange: FORBIDDEN
- sourceOfTruthUsage: GUARDS_TESTS_ISOLATED_PLAN_ONLY
- visibleOutputDrift: FORBIDDEN
- manualSmokeRequiredByDamian: REQUIRED_AND_BLOCKING_BEFORE_RUNTIME_IMPORT
- CalendarRuntimeAdoption: FORBIDDEN_UNTIL_004G
- FinanceRuntimeAdoption: FORBIDDEN_IN_004F

## Anchor map

- caseDetailHeaderAnchor
- caseLifecycleAnchor
- caseStatusAnchor
- serviceWorkspaceAnchor
- historyTimelineAnchor
- notesAnchor
- checklistAnchor
- actionPanelAnchor
- rightRailAnchor
- financeSettlementAnchor
- paymentStatusAnchor
- commissionStatusAnchor
- plannedActionsAnchor
- ownerControlAnchor
- activityTruthAnchor
- visualLayoutAnchor

## Czego nie ruszano

- 004E formal cleanup: DONE
- CaseDetail runtime: NOT_TOUCHED
- CaseDetail repository import: NOT_TOUCHED / FORBIDDEN_IN_RUNTIME
- runtime behavior: NOT_TOUCHED
- UI components: NOT_TOUCHED
- CSS: NOT_TOUCHED
- layout: NOT_TOUCHED
- case status: NOT_TOUCHED
- case lifecycle: NOT_TOUCHED
- activity timeline: NOT_TOUCHED
- service workspace: NOT_TOUCHED
- notes: NOT_TOUCHED
- checklist: NOT_TOUCHED
- action panel: NOT_TOUCHED
- right rail: NOT_TOUCHED
- finance settlement: NOT_TOUCHED
- payment status: NOT_TOUCHED
- commission status: NOT_TOUCHED
- amount calculation: NOT_TOUCHED
- date precedence: NOT_TOUCHED
- status labels: NOT_TOUCHED
- badges/colors: NOT_TOUCHED
- Google Calendar sync: NOT_TOUCHED
- Finance runtime: NOT_TOUCHED / FORBIDDEN_IN_004F
- Calendar runtime: NOT_TOUCHED / FORBIDDEN_UNTIL_004G
- Supabase/API: NOT_TOUCHED
- SQL: NOT_TOUCHED
- LF-PROD-SOT-004G: STARTED_AFTER_004F

## Historia remote implementation przed R2

Remote GitHub connector does not run local npm/build commands.

- `npm run verify:lf-prod-sot-004b-readonly-runtime-adoption`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `npm run verify:lf-prod-sot-004c-today-readonly-bridge`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `npm run verify:lf-prod-sot-004d-lists-cards-readonly-bridge`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `npm run verify:lf-prod-sot-004e-forms-modals-action-visual-bridge`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `npm run verify:lf-prod-sot-004f-casedetail-isolated-adoption-plan`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `node --test tests/lf-prod-sot-004f-casedetail-isolated-adoption-plan.test.cjs`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `npm run guard:routes:canonical`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `npm run guard:ui:patch-layers`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `npm run check:polish-mojibake`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `npm run build`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `git diff --check`: NOT_RUN_REMOTE_GITHUB_CONNECTOR

## R2 local verification closeout PASS - 2026-07-02 15:16 Europe/Warsaw

Status:
- 004E formal cleanup: DONE.
- package.json alias added.
- 004B guard PASS.
- 004C guard PASS.
- 004D guard PASS.
- 004E guard PASS.
- 004F guard PASS.
- 004F node test PASS.
- routes guard PASS.
- UI patch guard PASS.
- Polish mojibake PASS.
- npm run build PASS.
- git diff --check PASS.
- CaseDetail runtime NOT_TOUCHED.
- UI/CSS/layout NOT_TOUCHED.
- Finance/Calendar/Supabase/API/SQL NOT_TOUCHED.
- READY_FOR_004G_CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN.

## Finalne wyniki wykonanych komend

- `npm run verify:lf-prod-sot-004b-readonly-runtime-adoption`: PASS
- `npm run verify:lf-prod-sot-004c-today-readonly-bridge`: PASS
- `npm run verify:lf-prod-sot-004d-lists-cards-readonly-bridge`: PASS
- `npm run verify:lf-prod-sot-004e-forms-modals-action-visual-bridge`: PASS
- `npm run verify:lf-prod-sot-004f-casedetail-isolated-adoption-plan`: PASS
- `node --test tests/lf-prod-sot-004f-casedetail-isolated-adoption-plan.test.cjs`: PASS
- `npm run guard:routes:canonical`: PASS
- `npm run guard:ui:patch-layers`: PASS
- `npm run check:polish-mojibake`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS

## Risk audit

- CaseDetail jest VERY_HIGH risk.
- CaseDetail contains many layers: header, lifecycle, status, service workspace, notes, checklists, history, actions, right rail and settlement surfaces.
- This stage does not change runtime or UI.
- This stage only blocks future uncontrolled changes and creates an anchor map.
- Real runtime import to CaseDetail requires a separate stage after Damian manual smoke.
- Calendar/Google Calendar boundary remains blocked until 004G.
- Finance runtime remains outside 004F.

## Wynik

KONIEC ETAPU LF-PROD-SOT-004F.
