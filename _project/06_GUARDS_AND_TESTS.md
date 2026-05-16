# 06_GUARDS_AND_TESTS - CloseFlow / LeadFlow

## Guard dodany przez V9
npm run check:project-memory:closeflow

## Guard preferowany
npm run verify:closeflow:quiet, jesli istnieje w package.json.

Etap nie jest zamkniety bez logu guardow albo jawnego wpisu SKIP z powodem.

## 2026-05-15 - React StrictMode runtime import guard v14
- node scripts/check-react-strictmode-runtime-import-stage87.cjs

## 2026-05-15 - Lazy page default runtime guard v15
- node scripts/check-lazy-page-default-runtime-stage88.cjs

## 2026-05-15 - Lazy page default runtime guard v17
- node scripts/check-lazy-page-default-runtime-stage88.cjs

## 2026-05-15 - lazy page default runtime guard v18
- node scripts/check-lazy-page-default-runtime-stage88.cjs

## 2026-05-15 - Lazy page runtime guard v19
- node scripts/check-lazy-page-default-runtime-stage88.cjs
- Guard wymusza jeden lazyPage i 23 trasy lazyPage bez bezposrednich React.lazy imports.

## 2026-05-15 - Lazy page runtime guard v19
- node scripts/check-lazy-page-default-runtime-stage88.cjs
- Guard wymusza jeden lazyPage i 23 trasy lazyPage bez bezposrednich React.lazy imports.

## 2026-05-16 — Guard Stage92: calendar selected day readable actions {#STAGE92_CALENDAR_SELECTED_DAY_READABLE_ACTIONS}

Guard: `tests/stage92-calendar-selected-day-readable-actions.test.cjs`

Zakres:
- pełne etykiety typów wpisu,
- obecność `data-cf-entry-title`,
- pełne akcje `Edytuj`, `+1H`, `+1D`, `+1W`, `Zrobione/Przywróć`, `Usuń`,
- brak aktywnego legacy renderu selected-day w `Calendar.tsx`,
- brak osobnego pustego paska pod wpisem,
- brak sztywnego `min-width: 260px` dla akcji V9.

## STAGE93_GUARD_CALENDAR_WEEK_RAIL_CLEANUP — 2026-05-16
- Guard: `tests/stage93-calendar-week-rail-cleanup.test.cjs`.
- Scope: Calendar week rail cleanup, old hidden filter removal, plain count text, quiet release gate wiring.

## STAGE93_GUARD_FIX_CALENDAR_SWEEP_2026_05_16

- Naprawiono guard Stage93 tak, aby nie szukał kruchego znacznika końca po `calendar-week-plan-list`.
- Dodano lokalny sweep: `scripts/check-closeflow-calendar-ui-sweep-stage94.cjs`.
- Sweep wykrywa stare/ryzykowne wzorce Calendar UI: legacy week filter, badge count, dual selected-day render, błędne źródło selected day, duplikaty klas i stare selektory CSS.

## STAGE94 calendar consolidated cleanup guard

- tests/stage94-calendar-consolidated-cleanup.test.cjs guards one selected-day render, no wrong source, no duplicate month completed class, clean week rail, and valid calendar skin selector.
- scripts/check-closeflow-calendar-ui-sweep-stage94.cjs is now a regression sweep that fails on P1/P2 calendar UI debt.
- Run: node --test tests/stage94-calendar-consolidated-cleanup.test.cjs && node scripts/check-closeflow-calendar-ui-sweep-stage94.cjs

## Stage94 Calendar weekly plan full entry text - 2026-05-16

- tests/stage94-calendar-week-plan-full-entry-text.test.cjs protects the weekly plan readable entry model.

## STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V2 - Calendar weekly plan full entry text
- Guard: `tests/stage94-calendar-week-plan-full-entry-text.test.cjs`.
- Scope: week plan / `ScheduleEntryCard`; month grid remains frozen.

## STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V3 - Calendar weekly plan full entry text
- Guard: `tests/stage94-calendar-week-plan-full-entry-text.test.cjs`.
- Scope: week plan / `ScheduleEntryCard`; month grid remains frozen.

## STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V4

- Guard: `tests/stage94-calendar-week-plan-full-entry-text.test.cjs`.
- Scope: week plan `ScheduleEntryCard` must show full type/time/status/title/relation/actions.
- Month grid remains frozen and may keep compact Wyd/Zad labels only inside month chip normalizers.

## Stage95 destructive action visual source guard
- Guard: tests/stage95-destructive-action-visual-source.test.cjs.
- Scope: src/components/entity-actions.tsx, context-action CSS, record list CSS, TasksStable, Cases, Calendar, quiet gate.

## Stage95 V2 destructive action CSS guard
- Guard remains tests/stage95-destructive-action-visual-source.test.cjs. Stage95 V2 fixes CSS source content, not UI behavior.


## Stage96 leads right rail width and position
- `tests/stage96-leads-right-rail-width-position.test.cjs` dopięty do quiet release gate.
- Guard blokuje lokalny grid 195px/300px i wymusza wspólny right rail source of truth.

- Stage96 V2 guard: Leads right rail width/position source truth.

### Stage96 guard
- tests/stage96-leads-right-rail-width-position.test.cjs protects /leads right rail order and shared width source truth.

### Stage96 V4 guard
- Protects /leads right rail layout class, shared source truth width, and card order.

## STAGE96_V5_GUARD_REGISTER
- tests/stage96-leads-right-rail-width-position.test.cjs protects /leads rail order, source marker, shared width tokens and no local JSX width override.


## STAGE97_GUARD_TODAY_OVERDUE_TASK_DONE_BUTTON

- Guard: tests/stage97-today-overdue-task-done-button.test.cjs.
- Checks: overdue/today task rows pass taskId and doneKind=task into RowLink and use existing completion logic.

## Stage97 today overdue task done button

- tests/stage97-today-overdue-task-done-button.test.cjs protects Today overdue/today task rows from edit-only regression.

### STAGE98_100_RECOVERY_FROM_CLEAN_V3 - 2026-05-16
- Stage98: calendar mojibake hard fail.
- Stage99: Calendar JSX/CSS class contract.
- Stage100: one visible week-plan entry DOM model.
- Stage101 intentionally excluded from this recovery.

## STAGE102_CALENDAR_EDIT_MODAL_FORM_SOURCE â€” 2026-05-16

- Guard: `tests/stage102-calendar-edit-modal-form-source.test.cjs`.
- Scope: `/calendar` create/edit modal form visual source of truth.
- Checks: shared `data-calendar-entry-form-source`, edit/create modes, `modalFooterClass('event-form-footer')`, bright input/select contract, no dark footer bar, quiet gate wiring.

<!-- STAGE103_CALENDAR_MONTH_GRID_DAY_STATES_V3_GUARD -->
## Stage103 V3 â€” Calendar month grid day states

Guard: 	ests/stage103-calendar-month-grid-day-states.test.cjs

Zakres guardu:
- wymusza klasy is-today, is-past, is-selected, is-outside,
- blokuje powrĂłt gĂłrnego Badge count przy numerze dnia,
- wymusza data-calendar-month-more-button i handler handleShowMoreMonthDay,
- wymusza target data-calendar-selected-day-panel,
- wymusza finalny CSS override Stage103.
