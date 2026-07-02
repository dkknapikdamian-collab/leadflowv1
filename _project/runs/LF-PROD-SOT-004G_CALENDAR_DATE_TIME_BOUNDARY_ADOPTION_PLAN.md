# LF-PROD-SOT-004G - Calendar/date-time boundary adoption plan

## Status

CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN_REMOTE_ADDED / LOCAL_004F_CLEANUP_PACKAGE_ALIAS_AND_VERIFICATION_PENDING / NOT_CLOSED

Target closeout status after local PASS:
CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN_ADDED / 004F_FORMAL_CLEANUP_DONE / GUARD_PASS / TEST_PASS / BUILD_PASS / DIFF_CHECK_PASS / FIRST_RUNTIME_IMPORT_DECISION_NEEDED

Remote GitHub connector created the plan, guard, test and report. Local package alias, 004F cleanup patch, guard execution, node test, build and diff check must still be run before final closure.

## Linki SOT / mapa wejściowa

- Centralny indeks map SOT: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md`
- Mapa wejściowa użyta przez ten etap: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md`
- Poprzedni zamknięty etap Obsidian 004F: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004F_CASEDETAIL_ISOLATED_ADOPTION_PLAN.md`
- Poprzedni zamknięty etap app run 004F: `_project/runs/LF-PROD-SOT-004F_CASEDETAIL_ISOLATED_ADOPTION_PLAN.md`
- Ten etap korzysta z mapy: `LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP`
- Ten etap jest konsumentem mapy: `LF-PROD-SOT-004G_CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN`
- Zasada: nie duplikować całej mapy; trzymać link, status, decyzję, guardy i wynik.

## 004F formal cleanup

Remote status before local closeout:
- 004F app report alias text corrected: LOCAL_PATCH_PENDING
- 004F Obsidian report alias text corrected: LOCAL_PATCH_PENDING
- 004F plan status corrected from pending to final: LOCAL_PATCH_PENDING
- 004F guard after cleanup: LOCAL_VERIFICATION_PENDING
- 004F node test after cleanup: LOCAL_VERIFICATION_PENDING
- 004F build after cleanup: LOCAL_VERIFICATION_PENDING

Target final markers after local cleanup:
- 004F formal cleanup: DONE
- 004F app report alias text corrected: DONE
- 004F Obsidian report alias text corrected: DONE
- 004F plan status corrected from pending to final: DONE
- 004F guard after cleanup: PASS
- 004F node test after cleanup: PASS
- 004F build after cleanup: PASS

## Zakres

Etap dodaje wyłącznie izolowany plan granicy Calendar/date-time:
- local date policy map,
- remote calendar boundary map,
- no-drift policy,
- fixture policy,
- manual smoke policy,
- guard,
- test,
- report.

Etap nie podpina planu do Calendar/Tasks/Today runtime.
Etap nie zmienia Google Calendar sync.
Etap nie zmienia widocznego outputu.
Etap nie zmienia CSS.
Etap nie zmienia sortowania, bucketów ani dat.

## Dodane pliki 004G

- `src/lib/source-of-truth/calendar-date-time-boundary-plan.ts`
- `scripts/guards/verify-lf-prod-sot-004g-calendar-date-time-boundary-plan.cjs`
- `tests/lf-prod-sot-004g-calendar-date-time-boundary-plan.test.cjs`
- `_project/runs/LF-PROD-SOT-004G_CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN.md`
- `package.json` alias pending local patch: `verify:lf-prod-sot-004g-calendar-date-time-boundary-plan`

## Twarde reguły

- runtimeBehaviorChange: FORBIDDEN
- uiChange: FORBIDDEN
- cssChange: FORBIDDEN
- CalendarRuntimeAdoption: NOT_STARTED
- TasksRuntimeAdoption: NOT_STARTED
- TodayRuntimeAdoption: NOT_STARTED
- GoogleCalendarSyncChange: FORBIDDEN
- GoogleCalendarMapperChange: FORBIDDEN
- RemoteCalendarBoundaryChange: FORBIDDEN
- LocalCalendarDayCountChange: FORBIDDEN
- TodayTaskEventCountChange: FORBIDDEN
- TaskStatusLabelChange: FORBIDDEN
- EventStatusLabelChange: FORBIDDEN
- DoneCancelledPendingLabelChange: FORBIDDEN
- datePrecedenceChange: FORBIDDEN
- dateOnlyDefaultChange: FORBIDDEN
- taskDateOnlyDefaultT0900Change: FORBIDDEN
- eventDateOnlyDefaultT0900Change: FORBIDDEN
- financeDateOnlyDefaultT235959Change: FORBIDDEN
- timezonePolicyChange: FORBIDDEN
- localWarsawBusinessDayBoundaryChange: FORBIDDEN
- recurrenceExpansionChange: FORBIDDEN
- calendarItemExpansionChange: FORBIDDEN
- workItemsNormalizeChange: FORBIDDEN
- schedulingChange: FORBIDDEN
- dataWriteChange: FORBIDDEN
- sourceOfTruthUsage: GUARDS_TESTS_BOUNDARY_PLAN_ONLY
- visibleOutputDrift: FORBIDDEN
- manualSmokeRequiredByDamian: REQUIRED_AND_BLOCKING_BEFORE_RUNTIME_IMPORT
- FinanceRuntimeAdoption: FORBIDDEN
- CaseDetailRuntimeAdoption: FORBIDDEN
- firstRuntimeImportDecision: DECISION_NEEDED_AFTER_004G

## Local date policy map

- taskScheduledAtPrecedence
- taskDueAtPrecedence
- taskDateTimeSplitPrecedence
- taskDateOnlyDefaultT0900
- eventStartAtPrecedence
- eventDateTimeSplitPrecedence
- eventDateOnlyDefaultT0900
- calendarLocalDayBucketPolicy
- todayTaskEventBucketPolicy
- localWarsawBusinessDayBoundaryPolicy
- financeDateOnlyDefaultT235959_REFERENCE_ONLY_NOT_ADOPTED

## Remote boundary map

- googleCalendarSyncBoundary
- googleCalendarMapperBoundary
- remoteCalendarProviderBoundary
- localEventNotGcalBoundary
- noRemoteCalendarMutationIn004G
- noGcalMapperChangeIn004G

## Czego nie ruszano

- Calendar runtime: NOT_TOUCHED
- Tasks runtime: NOT_TOUCHED
- Today runtime: NOT_TOUCHED
- Google Calendar sync: NOT_TOUCHED
- Google Calendar mapper: NOT_TOUCHED
- remote calendar provider: NOT_TOUCHED
- local calendar day counts: NOT_TOUCHED
- Today task/event counts: NOT_TOUCHED
- task/event status labels: NOT_TOUCHED
- done/cancelled/pending labels: NOT_TOUCHED
- date precedence: NOT_TOUCHED
- date-only defaults: NOT_TOUCHED
- timezone policy: NOT_TOUCHED
- recurrence expansion: NOT_TOUCHED
- calendar item expansion: NOT_TOUCHED
- work-items normalize: NOT_TOUCHED
- scheduling: NOT_TOUCHED
- runtime behavior: NOT_TOUCHED
- UI components: NOT_TOUCHED
- CSS: NOT_TOUCHED
- Finance runtime: NOT_TOUCHED / FORBIDDEN
- CaseDetail runtime: NOT_TOUCHED / FORBIDDEN
- Supabase/API: NOT_TOUCHED
- SQL: NOT_TOUCHED
- next step: FIRST_RUNTIME_IMPORT_DECISION_NEEDED

## Wyniki wykonanych komend

Remote GitHub connector does not run local npm/build commands.

- `npm run verify:lf-prod-sot-004b-readonly-runtime-adoption`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `npm run verify:lf-prod-sot-004c-today-readonly-bridge`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `npm run verify:lf-prod-sot-004d-lists-cards-readonly-bridge`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `npm run verify:lf-prod-sot-004e-forms-modals-action-visual-bridge`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `npm run verify:lf-prod-sot-004f-casedetail-isolated-adoption-plan`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `npm run verify:lf-prod-sot-004g-calendar-date-time-boundary-plan`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `node --test tests/lf-prod-sot-004g-calendar-date-time-boundary-plan.test.cjs`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `npm run guard:routes:canonical`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `npm run guard:ui:patch-layers`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `npm run check:polish-mojibake`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `npm run build`: NOT_RUN_REMOTE_GITHUB_CONNECTOR
- `git diff --check`: NOT_RUN_REMOTE_GITHUB_CONNECTOR

Target final command results after local closeout:

- `npm run verify:lf-prod-sot-004b-readonly-runtime-adoption`: PASS
- `npm run verify:lf-prod-sot-004c-today-readonly-bridge`: PASS
- `npm run verify:lf-prod-sot-004d-lists-cards-readonly-bridge`: PASS
- `npm run verify:lf-prod-sot-004e-forms-modals-action-visual-bridge`: PASS
- `npm run verify:lf-prod-sot-004f-casedetail-isolated-adoption-plan`: PASS
- `npm run verify:lf-prod-sot-004g-calendar-date-time-boundary-plan`: PASS
- `node --test tests/lf-prod-sot-004g-calendar-date-time-boundary-plan.test.cjs`: PASS
- `npm run guard:routes:canonical`: PASS
- `npm run guard:ui:patch-layers`: PASS
- `npm run check:polish-mojibake`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS

## Risk audit

- Calendar/date-time boundary is HIGH risk.
- Local UI task/event dates must stay separate from Google Calendar boundary.
- Task/event date-only T09:00 policy must not be changed.
- Finance date-only T23:59:59 is reference-only and not adopted in 004G.
- Google Calendar mapper/sync remains forbidden.
- Calendar/Tasks/Today runtime remains untouched.
- After 004G, first real runtime import requires Damian decision.

## Wynik

LF-PROD-SOT-004G remote implementation files added. Local 004F cleanup, package alias and verification are required before final closeout.

KONIEC CZESCI REMOTE LF-PROD-SOT-004G - NOT FULL STAGE CLOSEOUT.
