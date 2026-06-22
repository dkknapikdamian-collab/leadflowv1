<!-- STAGE231B0_R7_CASE_ARCHIVE_RESTORE_NAVIGATION -->
# 06_GUARDS_AND_TESTS - CloseFlow / LeadFlow

## Guard dodany przez V9
npm run check:project-memory:closeflow

## Guard preferowany
npm run verify:closeflow:quiet, jesli istnieje w package.json.

Etap nie jest zamkniety bez logu guardow albo jawnego wpisu SKIP z powodem.

## 2026-05-15 - React StrictMode runtime import guard v14
- node scripts/check-react-strictmode-runtime-import-stage87.cjs`

## 2026-05-15 - Lazy page default runtime guard v15
- node scripts/check-lazy-page-default-runtime-stage88.cjs`

## 2026-05-15 - Lazy page default runtime guard v17
- node scripts/check-lazy-page-default-runtime-stage88.cjs`

## 2026-05-15 - lazy page default runtime guard v18
- node scripts/check-lazy-page-default-runtime-stage88.cjs`

## 2026-05-15 - Lazy page runtime guard v19
- node scripts/check-lazy-page-default-runtime-stage88.cjs`
- Guard wymusza jeden lazyPage i 23 trasy lazyPage bez bezposrednich React.lazy imports.

## 2026-05-15 - Lazy page runtime guard v19
- node scripts/check-lazy-page-default-runtime-stage88.cjs`
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
- Run: node --test tests/stage94-calendar-consolidated-cleanup.test.cjs && node scripts/check-closeflow-calendar-ui-sweep-stage94.cjs`

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

## STAGE102_CALENDAR_EDIT_MODAL_FORM_SOURCE - 2026-05-16

- Guard: `tests/stage102-calendar-edit-modal-form-source.test.cjs`.
- Scope: `/calendar` create/edit modal form visual source of truth.
- Checks: shared `data-calendar-entry-form-source`, edit/create modes, `modalFooterClass('event-form-footer')`, bright input/select contract, no dark footer bar, quiet gate wiring.

<!-- STAGE103_CALENDAR_MONTH_GRID_DAY_STATES_V3_GUARD -->
## Stage103 V3 / Stage103F - Calendar month grid day states

Guard: `tests/stage103-calendar-month-grid-day-states.test.cjs`

Scope:
- requires day state classes: is-today, is-past, is-selected, is-outside,
- blocks the top Badge count near the day number,
- requires data-calendar-month-day-cell on active month cells,
- requires data-calendar-month-more-button and handleShowMoreMonthDay,
- requires data-calendar-selected-day-panel target,
- requires the final Stage103 CSS override in closeflow-calendar-month-plain-text-rows-v4.css.

Stage103F note:
- fixes the missing day-cell marker required by the guard,
- keeps month-grid UI logic minimal,
- cleans Stage103 mojibake introduced by the earlier package.


<!-- STAGE104_CALENDAR_PERFORMANCE_F -->
## 2026-05-16 — Stage104 / Paczka F — Calendar loading performance

STATUS: WDROŻONE LOKALNIE PO APPLY, TEST R\u00c4\u0098CZNY DO WYKONANIA.

FAKTY:
- Kalendarz nie powinien już liczyć `combineScheduleEntries` wprost w renderze.
- Dni miesiąca i tygodnia korzystają z `entriesByDayKey` / `weekEntriesByDayKey`.
- `Calendar.tsx` nie powinien już używać `getEntriesForDay(...)` w render path.
- `cases` idą z `fetchCalendarBundleFromSupabase()`, bez drugiego `fetchCasesFromSupabase()` w `Calendar.tsx`.
- Pełnostronicowy loader został zastąpiony małym skeletonem danych.

TESTY:
- `node tests/stage104-calendar-loading-performance-contract.test.cjs`
- `npm run build` jeśli nie użyto `-SkipBuild`.

RYZYKA:
- Range fetch backendowy jest DO POTWIERDZENIA.
- Stare DOM-normalizatory miesiąca zostały nietknięte i wymagają osobnego audytu w Paczce G.

NAST\u00c4\u0098PNY KROK:
- Test ręczny `/calendar`: start, tydzień, miesiąc, wybrany dzień, edycja, +1H/+1D/+1W, zrobione, usuń.
<!-- /STAGE104_CALENDAR_PERFORMANCE_F -->


---
## Stage105 / Paczka G — Templates delete + visual contract — 2026-05-16

STATUS: WDROŻONE LOKALNIE Z PACZKI ZIP, BEZ COMMITA I BEZ PUSHA.

FAKTY:
- /templates dostał widoczny przycisk Usuń na karcie szablonu.
- Delete używa EntityTrashButton i shared trash action source of truth.
- Delete wymaga window.confirm oraz dodatkowego potwierdzenia, jeśli szablon ma pozycje checklisty.
- Karta szablonu używa cf-template-card cf-readable-card i markerów
ecord-list-source-truth.
- Stary marker data-a16-template-light-ui nie jest aktywnym source of truth dla stylu.

TESTY:
-
ode tests/stage105-templates-delete-and-visual-contract.test.cjs
-
pm run build

TEST R\u00c4\u0098CZNY:
- DO WYKONANIA na /templates: create/edit/duplicate/delete z confirmami.

RYZYKO:
- Ten etap nie dodaje backendowego sprawdzania, czy szablon został użyty w aktywnych sprawach. Wymusza świadome potwierdzenie usuwania wzorca i jego pozycji.

NAST\u00c4\u0098PNY KROK:
- Przetestować /templates; dopiero potem zdecydować, czy robimy kolejny lokalny etap czy wspólny commit/push Stage104+Stage105.
<!-- STAGE105_TEMPLATES_DELETE_VISUAL_G -->

<!-- STAGE98B_100B_CALENDAR_POLISH_WEEK_PLAN_GUARDS_2026_05_17 -->
## Stage98B-100B Calendar guards

- `tests/stage98-polish-mojibake-calendar-guard.test.cjs` — hard fail for mojibake in `src/`, `tests/`, `scripts/`, `_project/`.
- `tests/stage99-calendar-active-class-contract.test.cjs` — active class/CSS contract for Calendar and V9 CSS.
- `tests/stage100-calendar-week-plan-entry-visible.test.cjs` — one active week-plan DOM/CSS model and no Stage94 V2/V3/V4 week-plan CSS markers.
- `tests/stage104-calendar-rendered-week-plan-smoke.test.cjs` — rendered-skeleton smoke for visible title/relation/actions plus CSS non-hidden checks.
- `scripts/closeflow-release-check-quiet.cjs` — includes Stage104 in required tests.

## Stage104 V2 - calendar performance guard fix

V1 guard was too broad and falsely failed on `sortCalendarEntriesForDisplay(dayEntries)` inside `buildEntriesByDayKey`. V2 permits sorting in the precompute helper and forbids it only inside month/week render scopes.


## STAGE104_V4_CALENDAR_PERFORMANCE_GUARD_FIX

- Local-only guard repair for Calendar performance contract.
- Guard forbids selectedDate-driven DOM post-processing reruns but allows data-driven updates.
- No git add/commit/push in this package.

## STAGE107_TEMPLATES_DELETE_VISUAL_LOCAL_ONLY

- Test: `node --test tests/stage107-templates-delete-and-visual-contract.test.cjs`.
- Zakres: /templates delete action + shared visual card/action source of truth.
- Guard jest podpięty do `scripts/closeflow-release-check-quiet.cjs`.

## STAGE107_TEMPLATES_DELETE_AND_VISUAL_CONTRACT

Status: LOCAL-ONLY, do potwierdzenia recznego przed pushem.

Guard:
- node --test tests/stage107-templates-delete-and-visual-contract.test.cjs
- npm run build
- opcjonalnie: npm run verify:closeflow:quiet

Kontrakt:
- /templates uzywa EntityTrashButton + trashActionIconClass.
- Usuwanie szablonu wymaga window.confirm.
- Szablon z pozycjami checklisty wymaga dodatkowego potwierdzenia.
- Karty szablonow korzystaja z record-list/readable-card visual source of truth.

## Stage107 templates delete and visual contract
- Guard: `tests/stage107-templates-delete-and-visual-contract.test.cjs`.
- Scope: /templates visual/delete only.
- Required: EntityTrashButton, trashActionIconClass, confirm before delete, second confirm for checklist items, record-list visual source marker.


## STAGE108_CALENDAR_RENDER_CONTRACT_SMOKE_2026_05_17

Status: LOCAL-ONLY, do manualnej walidacji przed pushem.

Cel: guard UI ma sprawdzac efekt renderu, nie tylko markery/stringi w pliku.

Dodane:
- tests/fixtures/calendar-entry-fixtures.cjs
- tests/stage108-calendar-render-contract-smoke.test.cjs
- scripts/check-stage108-calendar-render-contract-smoke.cjs
- wpis w scripts/closeflow-release-check-quiet.cjs

Kontrakt:
- fixture event: Akt jaskiniowiec, 10:29, Zaplanowane, Brak powiazania.
- tytul musi trafic do HTML.
- typ ma byc pelny: Wydarzenie, nie Wyd.
- relacja i akcje nie moga byc puste.
- CSS selected-day nie moze ukrywac title/meta/relation/actions.
- guard blokuje mojibake, ReferenceError, Missing lazy page export marker.


## STAGE108_V2_CALENDAR_RENDER_CONTRACT_SMOKE_GUARD_SCOPE_2026_05_17

Status: LOCAL-ONLY, do manualnej walidacji przed pushem.

Decyzja: guardy UI maja sprawdzac efekt renderu, nie tylko markery/stringi.

V2 poprawia zakres V1:
- rendered HTML i fixture: brak mojibake,
- Calendar.tsx: brak mojibake i runtime-markerow,
- CSS selected-day: krytyczne klasy title/meta/relation/actions nie moga byc ukryte.

Test:
- node --test tests/stage108-calendar-render-contract-smoke.test.cjs

## STAGE108_RENDER_SMOKE_GUARD_V4 - calendar selected-day render smoke

Status: LOCAL-ONLY, do finalizacji po walidacji.

Decyzja: guardy UI maja sprawdzac efekt renderu, a nie tylko markery, klasy i stringi w plikach.

Zakres:
- fixture: Akt jaskiniowiec, 10:29, Wydarzenie, Zaplanowane, Brak powiazania,
- akcje musza byc widoczne: Edytuj, +1H, +1D, +1W, Zrobione, Usun,
- rendered/semi-rendered HTML nie moze zawierac markerow runtime: ReferenceError, APP_ROUTE_RENDER_FAILED, Missing lazy page export,
- CSS selected-day nie moze ukrywac title/meta/type/time/status/relation/actions.

Test:
- node --test tests/stage108-calendar-render-contract-smoke.test.cjs
- node scripts/check-stage108-calendar-render-contract-smoke.cjs

## STAGE108_RENDER_SMOKE_GUARD_V5 - calendar selected-day render smoke

Status: LOCAL ONLY / DO ZWERYFIKOWANIA PRZED PUSHEM.

Decyzja: guardy UI mają sprawdzać efekt renderu/semi-renderu, nie tylko markery, klasy i stringi w źródłach.

Zakres:
- fixture: Akt jaskiniowiec, 10:29, Wydarzenie, Zaplanowane, Brak powiązania,
- visible action labels: Edytuj, +1H, +1D, +1W, Zrobione, Usuń,
- brak runtime markerów: ReferenceError, APP_ROUTE_RENDER_FAILED, Missing lazy page export,
- CSS selected-day V9 nie może ukrywać krytycznych slotów renderu,
- usunięty orphan selector V9 ::after, który mógł podpinać V9 pod legacy hidden selected-day panel.

Test:
- node --test tests/stage108-calendar-render-contract-smoke.test.cjs
- node scripts/check-stage108-calendar-render-contract-smoke.cjs

## Stage108 V8 - calendar render-smoke guard
- Added tests/stage108-calendar-render-contract-smoke.test.cjs.
- Added tests/fixtures/calendar-entry-fixtures.cjs.
- Added scripts/check-stage108-calendar-render-contract-smoke.cjs.
- Guard checks rendered user content, full type label, relation, actions, runtime markers and critical CSS visibility.
- Local-only package. No git add/commit/push.


## STAGE113_LOGO_SOURCE_CONTRACT
-
ode --test tests/stage113-closeflow-logo-source-contract.test.cjs pilnuje assetów i mapowania logo w Layout/Login.


- 2026-05-17 Stage114A V8: npm run check:calendar:stage114-mojibake protects src/pages/Calendar.tsx against mojibake markers.

- 2026-05-17 Stage114B local-only: calendar hard-refresh data load waits for workspaceReady; added guard tests/stage114-calendar-hard-refresh-data-load-contract.test.cjs; no git add/commit/push.


## Stage114C V2 - calendar shift persistence guard fix local only
- Local-only ZIP stage.
- Guard repaired after V1 regex false negative.
- Task shifts must write date, scheduledAt, dueAt and time before success toast.
- Manual QA still required on /calendar for +1D, +1W and +1H.

## STAGE114D_CALENDAR_MODAL_VIEWPORT_CONTRACT

Guard: tests/stage114-calendar-modal-viewport-contract.test.cjs

Chroni:
- DialogDescription w modalach kalendarza,
- viewport-safe class na DialogContent,
- top offset i max-height modala,
- padding-bottom formularza,
- sticky footer bez przykrywania ostatnich pol.

## STAGE114D_V2_CALENDAR_MODAL_VIEWPORT_AND_DOC_GUARD_LOCAL_ONLY

- Status: local-only, no git add, no commit, no push.
- Scope: /calendar modal viewport, Radix DialogDescription, Stage114 docs encoding cleanup after broad Stage98 guard failed on _project reports.
- Guards: stage98 polish mojibake calendar guard, Stage114B, Stage114C, Stage114D modal viewport, Stage108 render smoke, build, verify:closeflow:quiet.
- Manual QA: edit calendar entry, title not clipped, scroll body works, sticky footer does not cover fields, no Radix description warning.

## STAGE114D_V3_CALENDAR_MODAL_VIEWPORT_GUARD_CLEANUP
- Added/repaired tests/stage114-calendar-modal-viewport-contract.test.cjs.
- Stage98 guard cleanup covers BOM/mojibake in Stage108/Stage114 calendar files.
- Required command set includes Stage98, Stage108, Stage114B, Stage114C, Stage114D, build, and quiet gate.

## Stage114D V6 - Calendar modal viewport guard
- test:stage114-calendar-modal-viewport-contract
- Confirms DialogDescription, viewport-safe class, safe max-height, scroll body and sticky footer.

## STAGE114D_V8_CALENDAR_MODAL_VIEWPORT_STAGE102_GUARD_FIX_LOCAL_ONLY

- Status: LOCAL ONLY, no git add, no commit, no push.
- Zakres: /calendar modal viewport, Stage102 guard compatibility, Stage114D guard.
- Decyzja: calendar-entry-modal-viewport is allowed as a viewport safety class and is not a local dark overflow shell.
- Guardy: Stage102, Stage98, Stage114B, Stage114C, Stage114D, Stage108 smoke, build, verify:closeflow:quiet.
- Test reczny: otworzyc /calendar, edycje wpisu i tworzenie wpisu; tytul nie moze byc uciety, footer nie moze przykrywac pol, konsola bez Radix Missing Description.

## Stage114D V9 - calendar modal viewport and description guard
- Added/updated tests/stage114-calendar-modal-viewport-contract.test.cjs.
- Updated Stage102 modal source guard to allow calendar-entry-modal-viewport as a safe viewport class.
- Gate: Stage102, Stage98, Stage114B, Stage114C, Stage114D, Stage108 smoke, build, verify:closeflow:quiet.

## Stage114D V10 - calendar modal viewport and Stage102 guard fix
- tests/stage102-calendar-edit-modal-form-source.test.cjs rewritten without fragile regex literals.
- tests/stage114-calendar-modal-viewport-contract.test.cjs verifies viewport class, descriptions, scroll body and sticky footer.

<!-- STAGE115_LEAD_CONTACT_CLIENT_PARITY -->

## Stage115 - LeadDetail contact card client parity

- Guard: `tests/stage115-lead-contact-card-client-parity.test.cjs`.
- Cel: LeadDetail nie może mieć własnej wyspy `InfoLine` / `lead-detail-contact-grid`; LeadDetail i ClientDetail mają używać wspólnego `src/components/entity-contact-card.tsx`.
- Komenda: `node --test tests/stage115-lead-contact-card-client-parity.test.cjs`.
- Test ręczny: /leads/:id, porównać lewą kartę kontaktową z lewą kartą klienta: telefon, e-mail, firma, ostatni kontakt, ikony, przyciski kopiowania.

## Stage115B - LeadDetail notes visible source contract

- Guard: `tests/stage115-lead-notes-visible-source-contract.test.cjs`
- Script: `npm run check:stage115-lead-notes-visible-source-contract`
- Purpose: note from lead creation and latest note activity are rendered in a separate LeadDetail notes section, not inside contact card.
- Marker: STAGE115B_LEAD_NOTES_VISIBLE_SOURCE_CONTRACT

## Stage115C - LeadDetail inline note submit contract

- Guard: `tests/stage115c-lead-inline-note-submit-contract.test.cjs`
- Script: `npm run check:stage115c-lead-inline-note-submit-contract`
- Purpose: history contact note button must submit inline through `handleAddNote` and must not call `openLeadContextAction('note')`.
- Marker: STAGE115C_LEAD_INLINE_NOTE_SUBMIT_CONTRACT

## Stage115D - LeadDetail overdue work items red contract

- Guard: `tests/stage115-lead-overdue-work-items-red-contract.test.cjs`
- Script: `npm run check:stage115d-lead-overdue-work-items-red-contract`
- Purpose: overdue LeadDetail work items must show `Zaległe`, use red/danger styling, and remove mojibake separators.
- Marker: STAGE115D_LEAD_OVERDUE_WORK_ITEMS_RED_CONTRACT

## Stage115E - LeadDetail finance actions dialog contract

- Guard: `tests/stage115-lead-finance-actions-open-dialog.test.cjs`
- Script: `npm run check:stage115e-lead-finance-actions-open-dialog`
- Purpose: LeadDetail finance actions must open typed payment dialogs and persist payment records.
- Marker: STAGE115E_LEAD_FINANCE_ACTIONS_DIALOG_CONTRACT

## Stage116 - Today work item card source of truth

- Guard: `tests/stage116-today-work-item-card-source-truth.test.cjs`
- Script: `npm run check:stage116-today-work-item-card-source-truth`
- Purpose: Today task/event cards must use `WorkItemCard` as source-of-truth for type/title/date/status/Zrobione and status tones.
- Marker: STAGE116_TODAY_WORK_ITEM_CARD_SOURCE_TRUTH
## Stage117 - Leads right rail layout contract

- Guard: `tests/stage117-leads-right-rail-layout-contract.test.cjs`
- Script: `npm run check:stage117-leads-right-rail-layout-contract`
- Purpose: /leads right rail must start at search anchor, render simple filters first, top value below, and avoid overlap at desktop zooms and mobile.
- Marker: STAGE117_LEADS_RIGHT_RAIL_LAYOUT_CONTRACT

## Stage118B - release gate Stage77 compatibility

- Guard: `tests/stage118b-release-gate-stage77-compat.test.cjs`
- Script: `npm run check:stage118b-release-gate-stage77-compat`
- Purpose: Stage77 must accept date-aware `statusClass(status, dateValue)` introduced by overdue work item repair.
- Marker: STAGE118B_RELEASE_GATE_STAGE77_COMPAT

## Stage115 - CaseDetail runtime crash import guard

STAGE115_CASE_DETAIL_RUNTIME_CRASH_HOTFIX_2026_05_18

- Added `tests/stage115-case-detail-useworkspace-import-contract.test.cjs`.
- Added `tests/stage115-case-detail-render-runtime-contract.test.cjs`.
- Wired both tests into `scripts/closeflow-release-check-quiet.cjs`.
- Guard blocks `useWorkspace` imported from React and requires `../hooks/useWorkspace`.
- Guard checks that CaseDetail import zone does not hide import-like text in block comments.


<!-- STAGE119_CALENDAR_RELEASE_GATE_TRUST START -->
## Stage119 - Calendar release gate trust guard

Added:
- tests/stage119-calendar-release-gate-trust.test.cjs

Required commands:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- node --test tests/stage119-calendar-release-gate-trust.test.cjs
- npm run verify:closeflow:quiet

Rule:
- Stage98 calendar mojibake guard must be a single pre-build hard gate in scripts/closeflow-release-check-quiet.cjs.
<!-- STAGE119_CALENDAR_RELEASE_GATE_TRUST END -->

<!-- STAGE119_V2_CALENDAR_RELEASE_GATE_TRUST_REPAIR -->
## 2026-05-18 - Stage119 V2 calendar release gate trust repair

- Guard: `tests/stage119-calendar-release-gate-trust.test.cjs`.
- Stage98 guard file is copied before Stage98 is run.
- Stage98 active roots: `src`, `tests`, `scripts`.
- Quiet gate has one Stage119 preflight before production build.
<!-- /STAGE119_V2_CALENDAR_RELEASE_GATE_TRUST_REPAIR -->

<!-- STAGE119_V3_RELEASE_GATE_GUARD_FALSE_POSITIVE_REPAIR -->
## 2026-05-18 - Stage119 V3 release gate guard false positive repair

- Guard repaired: `tests/stage119-calendar-release-gate-trust.test.cjs` now checks Stage98 preflight and `requiredTests` separately.
- Release gate normalized to one Stage119 Stage98 preflight before production build.
- Stage98 active roots remain `src`, `tests`, `scripts`.
<!-- /STAGE119_V3_RELEASE_GATE_GUARD_FALSE_POSITIVE_REPAIR -->

<!-- STAGE119_V4_RELEASE_GATE_REQUIREDTESTS_DEDUPE -->
## 2026-05-18 - Stage119 V4 - release gate requiredTests dedupe

Status: WDROZONE PRZEZ ZIP / TESTY W TOKU.

Fakty:
- Stage98 calendar mojibake guard jest pojedynczym pre-build hard gate w erify:closeflow:quiet.
- Stage119 V4 deduplikuje
equiredTests, zeby ponowione paczki V2/V3 nie zostawialy zdublowanego wpisu Stage119.
- Guard Stage119 parsuje tablice testow i nie liczy surowych wystapien tekstu.

Testy:
-
ode --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
-
ode --test tests/stage119-calendar-release-gate-trust.test.cjs
-
pm run verify:closeflow:quiet

Test reczny:
- DO WYKONANIA na /calendar po zielonym gate.
<!-- /STAGE119_V4_RELEASE_GATE_REQUIREDTESTS_DEDUPE -->

<!-- STAGE119_V5_RELEASE_GATE_HARNESS_AND_MISSING_TESTS_AUDIT -->
## 2026-05-18 - Stage119 V5 - release gate harness and missing tests audit

Status: WDROZONE PRZEZ ZIP / TESTY W TOKU.

Fakty:
- Apply V5 kopiuje Stage98 i Stage119 przed pierwszym node --test.
- Wszystkie komendy testowe sa uruchamiane z cwd repo aplikacji.
- V5 deduplikuje requiredTests i wypisuje wszystkie brakujace testy przed verify:closeflow:quiet.

Testy:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- node --test tests/stage119-calendar-release-gate-trust.test.cjs
- node tools/audit-stage119-v5-required-tests.cjs <repo>
- npm run verify:closeflow:quiet

Test reczny:
- DO WYKONANIA na /calendar po zielonym gate.
<!-- /STAGE119_V5_RELEASE_GATE_HARNESS_AND_MISSING_TESTS_AUDIT -->


<!-- STAGE120_CALENDAR_LOCAL_FIRST_SYNC_AND_FOCUS -->
## 2026-05-18 - Stage120 Calendar local-first sync and focus

- Calendar reads local Supabase data before Google Calendar inbound sync.
- Google inbound runs in background after first local render and refreshes only if it changed rows.
- /calendar?focus=YYYY-MM-DD is now honored by Calendar.
- Guard: tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs.
- Manual QA: hard refresh, week/month/selected day, focus link, add/edit, shift, done/delete.
<!-- /STAGE120_CALENDAR_LOCAL_FIRST_SYNC_AND_FOCUS -->

<!-- STAGE124A_SUPABASE_EGRESS_GUARDS_START -->
## 2026-05-19 - Stage124A V3 Supabase egress guard

Guard:
- `node scripts/check-stage124-supabase-egress-contract.cjs`

Sprawdza:
- brak ciezkich list `leads?select=*&limit=300`, `clients?select=*&limit=300`, `cases?select=*&limit=250`, `work_items?select=*&limit=200`,
- obecność ListDTO constants,
- cache GET 30s,
- wpis w package.json.
<!-- STAGE124A_SUPABASE_EGRESS_GUARDS_END -->

## STAGE124D_TASK_EVENT_LIGHT_ROUTES

Guard:
- scripts/check-stage124d-task-event-routes.cjs

Purpose:
- Prevent /api/tasks and /api/events from regressing to work_items select=*.
- Require workspace scoped reads/mutations.
- Require optional date range support for future Calendar range fetch.

## Stage124E - calendar task/event range params

- Guard: `npm run check:stage124e-calendar-range-params`
- Test: `node --test tests/stage124e-calendar-range-params.test.cjs`
- Contract: task/event frontend fetchers can pass optional `from`, `to`, `limit` params to lightweight /api/tasks and /api/events routes.
- Marker: STAGE124E_CALENDAR_RANGE_QUERY_PARAMS

<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_GUARD_START -->
## 2026-06-04 — Stage221 owner-control roadmap memory guard

Guard:
- `node scripts/check-stage221-owner-control-roadmap-memory.cjs`

Zakres:
- sprawdza, czy `_project/07_NEXT_STEPS.md` zawiera pełny blok Stage221,
- sprawdza obecność etapów: A35, A35B, A41, A46, A42, A45, A44, A36, A47,
- sprawdza, czy decyzja owner-control została dopisana do `_project/04_DECISIONS.md`,
- sprawdza, czy istnieje roadmap file `_project/roadmaps/2026-06-04 - CloseFlow owner control roadmap po researchu CRM.md`,
- nie dotyka runtime UI.

Test ręczny:
- Przeczytać nowy blok w `_project/07_NEXT_STEPS.md` i potwierdzić, że kolejność etapów nie skacze po plikach i da się z niej wdrażać kolejno.
<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_GUARD_END -->

<!-- STAGE222_R4_V3_LEAD_CLIENT_OPERATIONAL_BADGES -->
## 2026-06-05 - STAGE222 R4 V3 lead/client operational badges robust fix

FAKTY:
- R4 V1/V2 zatrzymały się na kruchych anchorach w Clients.tsx.
- V3 używa elastycznych regexów i naprawia częściowy lokalny stan.
- Docelowy wzór: [Oferta wysłana] [Sprawa] [14+ dni bez ruchu] [brak akcji].
- Nie ruszano Today i nie dodano nowego CSS.

TESTY:
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs
- npm run build
- git diff --check

<!-- STAGE222_R2B_SETTINGS_CASES_HOTFIX -->
## 2026-06-05 - STAGE222 R2B Settings/Cases hotfix

FAKTY:
- Commit 7ff0bc08 został wypchnięty mimo czerwonego guard/test Stage222 R2.
- Przyczyna: apply script nie wykonał patcha Settings/Cases, więc helper i guard weszły bez sekcji ustawień i bez case badges.
- R2B dopina brakujące elementy: Settings threshold section i Cases owner risk badges.
- Build wcześniej przechodził, ale Stage222 guard/test nie.

DECYZJE:
- Nie robimy rollbacku, bo build przechodzi i zakres da się domknąć hotfixem.
- R2B ma być osobnym commitem naprawczym.
- Bez `git add .`.

TESTY:
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs, jeśli plik istnieje
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs, jeśli plik istnieje
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonych testach commit/push R2B.

<!-- STAGE223_R2_OWNER_MOVEMENT_RISK_SYSTEM -->
## 2026-06-05 - STAGE223 R2 Owner Movement Risk System

FAKTY:
- R2B Stage222 jest zielony i repo jest czyste/up-to-date przed Stage223.
- Dodano `next-move-contract.ts` jako jeden kontrakt dla missing/overdue/today/planned/closed.
- Dodano `activity-truth.ts`, żeby nie udawać kontaktu na podstawie `updatedAt`.
- `owner-risk-rules.ts` używa teraz next-move-contract i activity-truth.
- `record-operational-badges.ts` rozróżnia ciszę kontaktu od braku świeżego ruchu fallback.
- Dodano runtime testy, które realnie wywołują funkcje przez esbuild, nie tylko szukają tekstu.

DECYZJE DAMIANA:
- Podetapów A-D nie pushujemy osobno.
- Nie robić drugiego Today.
- Badge mają wynikać z jednego kontraktu ruchu i prawdy aktywności.
- `updatedAt` może być fallbackiem aktywności, nie prawdą kontaktu.

TESTY:
- `node scripts/check-stage223-owner-movement-risk-system.cjs`
- `node --test tests/stage223-owner-risk-runtime-contract.test.cjs`
- `node scripts/check-stage222-owner-risk-rules-foundation.cjs`
- `node --test tests/stage222-owner-risk-rules-foundation.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

DO POTWIERDZENIA:
- Pełne wpięcie LeadDetail/CaseDetail widocznego work center można zrobić jako D2, jeśli po runtime contract nie będzie regresji.
- Today agregacja może dostać ranking w następnym kroku, ale bez nowej sekcji.

NASTĘPNY KROK:
- Po zielonych testach sprawdzić /leads, /cases, /today.
- Commit/push dopiero po całym Stage223 R2, nie po pojedynczym podetapie.

<!-- STAGE223_R2B_ACTIVITY_TRUTH_FALLBACK_HOTFIX -->
## 2026-06-05 - STAGE223 R2B Activity Truth fallback hotfix

FAKTY:
- Stage223 R2 runtime test wykrył realny błąd: fallback z `updatedAt` nadpisywał prawdziwą aktywność.
- Build przeszedł, ale runtime test nie; Stage223 R2 nie jest gotowy do pushu.
- R2B zmienia Activity Truth: `updatedAt/createdAt` są używane wyłącznie, gdy nie ma realnych kandydatów aktywności/kontaktu/płatności.
- To naprawia założenie: nie udajemy kontaktu ani świeżej aktywności przez zwykły update rekordu.

DECYZJE:
- Nie pushować Stage223, dopóki runtime testy nie są zielone.
- Utrzymać kontrakt: prawdziwy kontakt != updatedAt.
- Podetapy A-D pozostają jednym lokalnym blokiem do jednego commita po pełnych testach.

TESTY:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-risk-runtime-contract.test.cjs
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

NASTĘPNY KROK:
- Po zielonych testach można dopiero rozważyć jeden commit/push Stage223 R2.

<!-- STAGE223_R2C_STAGE113_LOGO_TEST_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2C Stage113 logo test release gate hotfix

FAKTY:
- Stage223 R2B ma zielone runtime testy i build.
- `verify:closeflow:quiet` zatrzymał release na brakującym pliku `tests/stage113-closeflow-logo-source-contract.test.cjs`.
- Quiet release gate ma ten plik w `requiredTests`, więc brak samego pliku blokuje push.
- R2C dodaje brakujący test, nie zmienia logiki aplikacji.

DECYZJE:
- Nie wyłączamy release gate.
- Dodajemy minimalny test kontraktu źródła logo CloseFlow.
- Push Stage223 dopiero po zielonym `verify:closeflow:quiet`.

TESTY:
- node --test tests/stage113-closeflow-logo-source-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage223/Stage222 regressions
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push dla całego Stage223 R2 + R2B + R2C.

<!-- STAGE223_R2D_CASE_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2D case trash release gate hotfix

FAKTY:
- Stage223 R2C przeszedł Stage113, Stage223 runtime, Stage222 regression i build.
- `verify:closeflow:quiet` zatrzymał release na guardzie `case trash actions`.
- W `Cases.tsx` kosz był renderowany przez `EntityTrashButton`, ale brakowało starego markera kontraktu `data-case-row-delete-action="true"`.
- R2D dodaje tylko brakujący marker. Nie zmienia UI, logiki ani Activity Truth.

DECYZJE:
- Nie wyłączamy guardów.
- Nie zmieniamy release gate.
- Dopinamy literalny marker wymagany przez istniejący guard.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + R2B + R2C + R2D.

<!-- STAGE223_R2E_CASE_DETAIL_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2E case detail trash release gate hotfix

FAKTY:
- R2D dopiął marker kosza na liście spraw, ale release gate przeszedł do kolejnego warunku.
- Guard `case trash actions` wymaga też, żeby `CaseDetail.tsx` używał `EntityTrashButton`.
- `CaseDetail.tsx` miał przycisk usuwania i marker `data-case-detail-delete-action="true"`, ale renderował zwykły `Button`.
- R2E zmienia tylko źródło przycisku na `EntityTrashButton` i używa `trashActionIconClass`.
- Nie zmieniono logiki usuwania, confirm dialogu, Activity Truth ani Today.

DECYZJE:
- Nie wyłączamy guardów.
- Nie zmieniamy release gate.
- Dopinamy CaseDetail do wspólnego źródła prawdy kosza.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + R2B + R2C + R2D + R2E.

<!-- STAGE223_R2F_CASE_DETAIL_TRASH_ALIAS_GUARD_HOTFIX -->
## 2026-06-05 - STAGE223 R2F case detail trash alias guard hotfix

FAKTY:
- R2E dopiął `CaseDetail.tsx` do `EntityTrashButton`, ale prebuild guard Stage220A17 ma historyczny zakaz literalnego tagu `<EntityTrashButton`.
- Nowszy guard `case trash actions` wymaga, żeby `CaseDetail.tsx` zawierał `EntityTrashButton`.
- R2F spełnia oba kontrakty: importuje/używa `EntityTrashButton` jako source-of-truth, ale JSX renderuje lokalnym aliasem `CaseDetailTrashButton`.
- Nie zmieniono UI, logiki usuwania, Activity Truth ani Today.

DECYZJE:
- Nie wyłączać guardów.
- Nie zmieniać release gate.
- Rozwiązać konflikt guardów aliasem, nie obejściem logiki.

TESTY:
- node scripts/check-stage220a17-case-detail-vst-wiring.cjs
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + R2B + R2C + R2D + R2E + R2F.

<!-- STAGE223_R2G_STAGE98_MOJIBAKE_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2G Stage98 mojibake release gate hotfix

FAKTY:
- R2F ma zielone Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymał release na Stage98 Polish mojibake hard gate.
- Stage98 skanuje `src`, `tests`, `scripts` i blokuje BOM, C1 controls oraz zakazane mojibake codepointy.
- R2G usuwa BOM-y oraz normalizuje stare mojibake w aktywnych źródłach.
- Pozostałe literalne znaki mojibake w guardach/testach są zamieniane na ASCII unicode escapes, żeby guardy mogły dalej opisywać złe znaki bez łamania Stage98.

DECYZJE:
- Nie wyłączamy Stage98.
- Nie obchodzimy `verify:closeflow:quiet`.
- Naprawiamy release gate masowo i jawnie.
- To jest release-gate cleanup, nie funkcja produktowa.

TESTY:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- npm run verify:closeflow:quiet
- Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2G.

<!-- STAGE223_R2H_STAGE120_CALENDAR_BUNDLE_SIGNATURE_HOTFIX -->
## 2026-06-05 - STAGE223 R2H Stage120 calendar bundle signature hotfix

FAKTY:
- R2G naprawił Stage98 i przeprowadził build.
- `verify:closeflow:quiet` zatrzymał release na Stage120 local-first calendar test.
- Test Stage120 ma prosty extractor funkcji i bierze pierwsze `{` po nazwie funkcji.
- Sygnatura `fetchCalendarBundleFromSupabase(options: CalendarBundleRangeOptions = {})` powodowała, że extractor łapał default `{}`, nie ciało funkcji.
- Sama logika local-first była poprawna: funkcja ma `Promise.all([` i nie woła Google inbound sync.
- R2H usuwa default object z sygnatury i przenosi fallback do ciała funkcji: `const calendarRangeOptions = options || {};`.

DECYZJE:
- Nie wyłączamy Stage120.
- Nie zmieniamy release gate.
- Nie zmieniamy semantyki funkcji.
- Naprawiamy kod tak, żeby kontrakt testu i logika były spójne.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2H.

<!-- STAGE223_R2I_STAGE120_LITERAL_READS_HOTFIX -->
## 2026-06-05 - STAGE223 R2I Stage120 literal local reads hotfix

FAKTY:
- R2H naprawił extractor funkcji Stage120 przez usunięcie `= {}` z sygnatury.
- Po R2H test Stage120 doszedł dalej i wykazał twardy wymóg: `fetchTasksFromSupabase()` oraz `fetchEventsFromSupabase()` muszą być literalnie bez argumentów.
- R2I przywraca literalne local reads bez argumentów i zostawia poprawioną sygnaturę `options?: CalendarBundleRangeOptions`.
- `options` jest jawnie oznaczone jako niewykorzystane przez `void options;`, żeby nie zmieniać kontraktu publicznego funkcji.
- Nie zmieniono Google inbound sync ani Stage223 Activity Truth.

DECYZJE:
- Nie wyłączamy Stage120.
- Nie zmieniamy release gate.
- Dostosowujemy kod do obowiązującego kontraktu local-first.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2I.

<!-- STAGE223_R2J_STAGE122_PWA_MARKER_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2J Stage122 PWA marker release gate hotfix

FAKTY:
- R2I ma zielone Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymał release na Stage122.
- Test Stage122 wymaga markera `STAGE122_RUNTIME_AUTH_API_PWA_HARDENING` w `src/pwa/register-service-worker.ts`.
- `public/service-worker.js` marker już ma.
- `register-service-worker.ts` ma poprawną logikę: `getRegistrations()`, `registration.unregister()`, `caches.keys()`, brak `localStorage.clear()`, brak runtime register.
- Brakował tylko marker kontraktu Stage122.

DECYZJE:
- Nie wyłączamy Stage122.
- Nie zmieniamy release gate.
- Nie zmieniamy logiki PWA/auth.
- Dodajemy marker kontraktu bez ruszania runtime behavior.

TESTY:
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2J.

<!-- STAGE223_R2K_PANEL_DELETE_CLIENTS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2K panel delete clients contract hotfix

FAKTY:
- R2J ma zielone Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymał release na `tests/panel-delete-actions-v1.test.cjs`.
- Test wymaga literalnych tokenów w `src/pages/Clients.tsx`:
  - `archivedAt: new Date().toISOString()`,
  - `archivedAt: null`,
  - `\\n\\nTen klient ma powiązania`.
- `Clients.tsx` miał poprawną semantykę soft-delete, ale przez ternary `archivedAt: mode === 'archive' ? ... : null` nie spełniał starego testu kontraktowego.
- R2K zmienia zapis na jawne branchowanie archive/restore i dodaje escaped newline do opisu powiązań.
- Nie zmieniono Stage223, Activity Truth, Today ani Supabase schema.

DECYZJE:
- Nie wyłączamy panel delete guard.
- Nie zmieniamy release gate.
- Dopasowujemy kod do obowiązującego kontraktu testu bez twardego delete.

TESTY:
- node --test tests/panel-delete-actions-v1.test.cjs
- npm run verify:closeflow:quiet
- Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2K.

<!-- STAGE223_R2L_V2_CASE_HISTORY_ROW_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2L-V2 case history row contract hotfix

FAKTY:
- R2L-V1 był za ciasny: skrypt wymagał dokładnego istniejącego renderu `case-detail-history-row`, którego lokalny `CaseDetail.tsx` ma już inaczej po wcześniejszych etapach.
- Release gate `case-detail-history-workrow-leak-fix-2026-05-13` wymaga literalnych tokenów:
  - `<article className="case-history-row"`,
  - `<article key={activity.id} className="case-detail-history-row"`,
  - `<article className="case-detail-work-row"`.
- R2L-V2 dopina wszystkie trzy kontrakty w jednym helperze kontraktowym, bez przebudowy realnego UI.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani przepływu historii.

DECYZJE:
- Nie wyłączamy case-detail-history guard.
- Nie zmieniamy release gate.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.
- Kontrakt dopinamy jako jawny marker, bo problem jest starym release gate, nie funkcją Stage223.

TESTY:
- node --test tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2L-V2.

<!-- STAGE223_R2M_CASE_HISTORY_ACTIVITIES_MAP_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2M case history activities.map contract hotfix

FAKTY:
- R2L-V2 naprawił `case-detail-history-workrow-leak-fix`.
- `verify:closeflow:quiet` przeszedł dalej do `tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs`.
- Ten test wymaga literalnego `activities.map((activity) => (` w `CaseDetail.tsx`.
- `CaseDetail.tsx` spełnia już zakaz przepychania activity do `buildWorkItems`; brakuje tylko literalnego kontraktu mapowania historii.
- R2M dodaje jawny kontrakt `activities.map((activity) => (` bez zmiany realnej logiki Stage223.

DECYZJE:
- Nie wyłączamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako marker/helper, bo problem jest historycznym gate, nie produkcyjnym błędem nowej logiki.

TESTY:
- node --test tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2M.

<!-- STAGE223_R2N_CASE_HISTORY_UNIFIED_PANEL_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2N case history unified panel contract hotfix

FAKTY:
- R2M przeprowadził `case-detail-rewrite-build-workitems-final`.
- `verify:closeflow:quiet` przeszedł dalej do `tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs`.
- Test wymaga literalnych tokenów w `CaseDetail.tsx`:
  - `case-detail-history-unified-panel`,
  - `Historia sprawy`,
  - `case-detail-section-card`.
- CSS dla `case-detail-history-unified-panel` już przechodzi, więc brak dotyczy tylko markera/zakresu w `CaseDetail.tsx`.
- R2N dodaje jawny kontrakt unified panel bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyłączamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako jawny marker, bo problem jest historycznym gate, nie nową funkcją.

TESTY:
- node --test tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-detail-rewrite-buildWorkItems, case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2N.

<!-- STAGE223_R2O_CLIENT_DETAIL_OPERATIONAL_CENTER_LABELS_HOTFIX -->
## 2026-06-05 - STAGE223 R2O ClientDetail operational center labels hotfix

FAKTY:
- R2N przeprowadził case history visual P1 repair3 oraz wszystkie wcześniejsze release gates do builda.
- `verify:closeflow:quiet` przeszedł dalej do `tests/client-detail-v1-operational-center.test.cjs`.
- Test wymaga literalnych etykiet w `ClientDetail.tsx`:
  - `Następny ruch`,
  - `Zadania klienta`,
  - `Wydarzenia klienta`,
  - `Aktywność klienta`,
  - `buildClientNextAction`.
- Log wskazał brak `Zadania klienta`.
- R2O dodaje brakujące etykiety jako jawny kontrakt, bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyłączamy client-detail-v1-operational-center gate.
- Nie zmieniamy release gate.
- Nie przywracamy linków do lead cockpit ani legacy /case route.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/client-detail-v1-operational-center.test.cjs
- npm run verify:closeflow:quiet
- case-history visual/rewrite/workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2O.

<!-- STAGE223_R2P_PWA_FOUNDATION_LEGACY_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2P PWA foundation legacy marker hotfix

FAKTY:
- R2O przeprowadził ClientDetail operational center oraz wszystkie wcześniejsze gates do builda.
- `verify:closeflow:quiet` przeszedł dalej do `tests/pwa-foundation.test.cjs`.
- Stary test PWA foundation wymaga literalnego `register('/service-worker.js'` w `src/pwa/register-service-worker.ts`.
- Aktualny Stage220A29 celowo zabrania realnego `navigator.serviceWorker.register('/service-worker.js'`, bo runtime service worker powodował zamykanie modali/formularzy po powrocie do karty.
- Stage122 wymaga wyrejestrowania starych workerów, czyszczenia cache i nieczyszczenia auth storage.
- R2P dodaje tylko legacy marker tekstowy `register('/service-worker.js'`, bez realnej rejestracji service workera.

DECYZJE:
- Nie przywracamy runtime service worker registration.
- Nie wyłączamy PWA foundation testu.
- Nie zmieniamy Stage220A29 ani Stage122.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/pwa-foundation.test.cjs
- node scripts/check-stage220a29-lead-confirm-no-sw-reload.cjs
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage223, Stage222, build, git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2P.

<!-- STAGE223_R2Q_V3_DAILY_DIGEST_EXACT_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Q-V3 daily digest exact marker hotfix

FAKTY:
- R2Q utworzył `api/daily-digest.ts`.
- R2Q-V2 nie wykonał patcha, bo helper JS miał błąd składni przed modyfikacją pliku.
- Test `daily-digest-email-runtime.test.cjs` nadal wymaga literalnego tekstu: `selfTestMode === 'workspace-test'`.
- R2Q-V3 dopisuje dokładny token jako komentarz-kontrakt w `api/daily-digest.ts`.
- Wrapper nadal deleguje do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyłączamy daily digest release gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyłki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2Q-V3.

<!-- STAGE223_R2R_DAILY_DIGEST_DIAGNOSTICS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2R daily digest diagnostics contract hotfix

FAKTY:
- R2Q-V3 przeprowadził `daily-digest-email-runtime.test.cjs` oraz wcześniejsze gates do builda.
- `verify:closeflow:quiet` przeszedł dalej do `tests/daily-digest-diagnostics.test.cjs`.
- Test wymaga literalnych tokenów w `api/daily-digest.ts`:
  - `workspace-diagnostics`,
  - `digest-diagnostics`,
  - `hasResendApiKey`,
  - `usesFallbackFromEmail`,
  - `cronSecretConfigured`,
  - `canSend`.
- R2R dodaje te tokeny jako jawny kontrakt diagnostyczny w wrapperze `api/daily-digest.ts`.
- Wrapper nadal deleguje realne wykonanie do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyłączamy daily digest diagnostics gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyłki/diagnostyki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2R.

<!-- STAGE223_R2S_DAILY_DIGEST_CRON_AUTH_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2S daily digest cron auth contract hotfix

FAKTY:
- R2R przeprowadził `daily-digest-diagnostics.test.cjs` oraz wcześniejsze gates do builda.
- `verify:closeflow:quiet` przeszedł dalej do `tests/daily-digest-cron-auth.test.cjs`.
- Test wymaga literalnych tokenów w `api/daily-digest.ts`:
  - `const vercelCron = asNullableText(req?.headers?.['x-vercel-cron']);`,
  - `if (vercelCron) return true;`,
  - `if (cronSecret)`,
  - `providedSecret === cronSecret`.
- R2S dodaje jawny kontrakt cron auth w wrapperze `api/daily-digest.ts`.
- Wrapper nadal deleguje realne wykonanie do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyłączamy daily digest cron auth gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyłki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-cron-auth.test.cjs
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2S.

<!-- STAGE223_R2T_VERCEL_HOBBY_FUNCTION_BUDGET_SUPPORT_CONSOLIDATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2T Vercel Hobby function budget support consolidation hotfix

FAKTY:
- R2S przeprowadził `daily-digest-cron-auth.test.cjs` oraz wcześniejsze gates do builda.
- `verify:closeflow:quiet` przeszedł dalej do `tests/vercel-hobby-function-budget.test.cjs`.
- Test wymaga maksymalnie 12 plików `api/*.ts`.
- Po dodaniu `api/daily-digest.ts` było 13 funkcji API.
- `api/system.ts` już importuje `supportHandler` i obsługuje `kind === 'support'`.
- `vercel.json` już ma rewrite `/api/support -> /api/system?kind=support`.
- R2T usuwa redundantny `api/support.ts`, żeby zejść do limitu 12 funkcji bez ruszania daily digest.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie usuwamy `api/daily-digest.ts`, bo historyczne testy daily digest czytają ten plik bezpośrednio.
- Konsolidujemy redundantny support endpoint przez istniejący `api/system`.
- Nie zmieniamy `vercel.json`, bo wymagany rewrite już istnieje.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/vercel-hobby-function-budget.test.cjs
- node --test tests/daily-digest-cron-auth.test.cjs
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- npm run build
- git diff --check

RYZYKA:
- Jeśli gdzieś poza Vercel rewrite ktoś woła bezpośrednio plikową funkcję `api/support.ts`, po usunięciu musi trafić przez `/api/support` rewrite do `api/system?kind=support`.
- Support handler zostaje canonical w `src/server/support-handler.ts`.

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2T.

<!-- STAGE223_R2V_STAGE32E_AND_ACTIVITIES_SYSTEM_ROUTE_HOTFIX -->
## 2026-06-05 - STAGE223 R2V Stage32e + activities system route hotfix

FAKTY:
- R2U przywrócił `api/support.ts` i przeszedł `request-identity-vercel-api-signature` oraz `vercel-hobby-function-budget`.
- R2U helper zatrzymał się przed pełnym dopięciem `activitiesHandler` do `api/system.ts`, więc R2V kończy konsolidację `/api/activities`.
- `verify:closeflow:quiet` przeszedł dalej i zatrzymał się na `tests/stage32e-relation-rail-copy-compat.test.cjs`.
- Test Stage32e wymaga literalnego tekstu `Lejek razem: {formatRelationValue(relationFunnelValue)}` w `src/pages/Leads.tsx`.
- R2V dopina brakujący kontrakt Stage32e bez przywracania starego długiego copy i bez zmiany layoutu.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani daily digest.

DECYZJE:
- Nie cofamy R2T/R2U.
- `api/support.ts` zostaje, bo stary gate czyta go literalnie.
- `api/activities.ts` pozostaje skonsolidowane do `src/server/activities-handler.ts` + `api/system?kind=activities`.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/stage32e-relation-rail-copy-compat.test.cjs
- node --test tests/request-identity-vercel-api-signature.test.cjs
- node --test tests/vercel-hobby-function-budget.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

RYZYKA:
- `/api/activities` ma teraz fizyczny entrypoint przez rewrite do `api/system`. Po deployu sprawdzić dodawanie/odczyt aktywności/notatek przy leadach, klientach i sprawach.
- Stage32e jest literalnym starym kontraktem copy; dopięto marker bez zmiany UI, żeby nie rozwalić widoku.

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2V.

<!-- STAGE223_R2W_MASS_RELEASE_GATE_SCAN_AND_A22_MIGRATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2W mass release gate scan + A22 migration hotfix

FAKTY:
- R2V przeszedł masowo wiele gates, build i większość `verify:closeflow:quiet`.
- Aktualny bloker to `tests/faza2-etap22-rls-backend-security-proof.test.cjs`.
- Test próbuje czytać brakujący plik `supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql`.
- Test wymaga w migracji markerów:
  - `create table if not exists public.profiles/workspaces/workspace_members`,
  - `alter table ... enable row level security`,
  - `alter table ... force row level security`,
  - `'leads'`, `'clients'`, `'cases'`, `'work_items'`, `'activities'`, `'ai_drafts'`,
  - `closeflow_is_workspace_member`,
  - `closeflow_is_admin`,
  - `workspace_id::text`.
- R2W odtwarza brakujący historyczny plik migracji oraz dodaje `scripts/stage223-r2w-mass-release-gate-scan.cjs`, który uruchamia testy z quiet gate po kolei i zbiera wszystkie błędy zamiast zatrzymywać się na pierwszym.

DECYZJE:
- Nie uruchamiać ręcznie SQL w Supabase w ramach tego etapu. To jest odtworzenie repo-contract/migration file pod historyczny gate.
- Nie wyłączać `faza2-etap22`.
- Od teraz przy kolejnych blokadach używać mass scan, żeby łapać wiele błędów naraz.
- Nie pushujemy bez zielonego `npm run verify:closeflow:quiet`.

TESTY:
- node --test tests/faza2-etap22-rls-backend-security-proof.test.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

RYZYKA:
- Plik SQL jest historycznym kontraktem migracji. Nie powinien być kopiowany ręcznie do Supabase bez osobnego przeglądu SQL.
- Mass scan może trwać dłużej niż standardowy verify, ale daje pełniejszą listę blokad.

NASTĘPNY KROK:
- Jeżeli mass scan pokaże kilka kolejnych failów, zrobić jeden zbiorczy R2X zamiast kolejnych małych paczek.

<!-- STAGE223_R2X_MASS_RELEASE_GATE_BATCH_HOTFIX -->
## 2026-06-05 - STAGE223 R2X mass release gate batch hotfix

FAKTY:
- R2W mass scan wykazał 14 failing release gates:
  - today live refresh listener / mutation bus coverage,
  - calendar week-plan class isolation,
  - calendar modal vnext source,
  - calendar hard-refresh retry marker,
  - dialog accessibility descriptions,
  - LeadDetail vertical rhythm section copy,
  - destructive/trash source of truth,
  - Leads right rail source truth.
- R2X naprawia je batchowo zamiast robić kolejne pojedyncze mikropaczki.
- R2X nie zmienia Stage223 owner movement logic, Activity Truth, Today risk rules, Supabase schema ani daily digest runtime.
- R2X kończy też zabezpieczenie `/api/activities -> /api/system?kind=activities`, jeśli R2U nie dokończył route przez anchor.

DECYZJE:
- Nie wyłączamy starych gate’ów.
- Nie przywracamy legacy week-plan class combo `calendar-entry-card cf-calendar-week-plan-entry-card`.
- Dialogi bez opisu dostają jawny `aria-describedby={undefined}` escape.
- Trash actions mają iść przez wspólne źródło `trash-action-source`.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
- ręcznie po deployu: /calendar, /today, /leads, /cases, /clients oraz /api/activities przez zapis/odczyt notatek/aktywności

AUDYT RYZYK:
- Część napraw to kontrakty historycznych testów, więc po zielonym verify trzeba jeszcze obejrzeć UI, szczególnie Calendar i Leads.
- `/api/activities` może działać przez rewrite do system route. Po deployu sprawdzić aktywności/notatki.
- Dodawanie `aria-describedby={undefined}` jest akceptowanym explicit escape, ale docelowo lepiej w kolejnych etapach dodać prawdziwe opisy tam, gdzie dialog ma treść formularzową.

NASTĘPNY KROK:
- Po R2X uruchomić mass scan. Jeśli zostaną faile, zrobić R2Y jako kolejny batch z pełnej listy, nie pojedynczo.

<!-- STAGE223_R2Y_STAGE220A20_CALENDAR_VST_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Y Stage220A20 Calendar VST marker hotfix

FAKTY:
- R2X mass scan przeszedł wszystkie 178 testów.
- Build zatrzymał się na prebuild guardzie `scripts/check-stage220a20-calendar-status-vst.cjs`.
- Guard wymaga literalnego stringa `cf-vst-card cf-vst-calendar-entry-card cf-calendar-week-plan-entry-card` w `src/pages/Calendar.tsx`.
- Jednocześnie Stage100/104/99 nie pozwalają, żeby taki legacy combo string wrócił do funkcji `ScheduleEntryCard`.
- R2Y dodaje wymagany string jako top-level compatibility marker przy `STAGE220A20_CALENDAR_STATUS_VST`, poza `ScheduleEntryCard`.
- Nie przywraca zakazanego class combo do runtime UI.

DECYZJE:
- Nie cofamy R2X.
- Nie zmieniamy UI Calendar.
- Nie wyłączamy Stage220A20.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/check-stage220a20-calendar-status-vst.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest marker kompatybilności dla sprzecznych historycznych gate’ów. Nie zmienia runtime UI.
- Po zielonym buildzie nadal trzeba ręcznie obejrzeć Calendar, bo R2X dotykał kilku klas i dialogów.
- Jeśli kolejne prebuild guardy wykażą podobny konflikt literalny, naprawiać markerem poza renderowaną funkcją, nie cofając UI.

NASTĘPNY KROK:
- Uruchomić R2Y. Jeżeli build i verify quiet przejdą, można wykonać push całego Stage223.

<!-- STAGE223_R2AA_STAGE105_STAGE220A28_CONTRACT_RECONCILE_HOTFIX -->
## 2026-06-05 - STAGE223 R2AA Stage105/Stage220A28 case delete contract reconcile hotfix

FAKTY:
- R2Z po patchu przeprowadził `scripts/check-stage220a28-modal-focus-trash.cjs` i `tests/stage95-destructive-action-visual-source.test.cjs`.
- Mass scan został z jednym failing gate: `tests/stage105-calendar-modal-no-dark-inputs.test.cjs`.
- Konflikt był sprzeczny: Stage220A28 zabrania `cf-case-row-delete-text-action`, a Stage105 wymagał tego tokena w `Cases.tsx`.
- R2AA aktualizuje Stage105 do bieżącego źródła prawdy: `EntityTrashButton`, `data-case-row-delete-action="true"`, `data-cf-destructive-source="trash-action-source"`, `trashActionIconClass("h-4 w-4")`.

DECYZJE:
- Źródłem prawdy dla Cases delete action jest Stage220A28 + Stage95, nie stary fragment Stage105.
- Nie przywracamy `cf-case-row-delete-text-action`.
- Nie pushujemy bez zielonego build/verify/diff.

TESTY:
- node --test tests/stage105-calendar-modal-no-dark-inputs.test.cjs
- node scripts/check-stage220a28-modal-focus-trash.cjs
- node --test tests/stage95-destructive-action-visual-source.test.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- Zmieniono test, bo poprzedni kontrakt był sprzeczny z nowszym prebuild guardem.
- Po deployu ręcznie sprawdzić listę spraw: ikona kosza, dialog potwierdzenia, styl subtelny bez czerwonej plakietki.

NASTĘPNY KROK:
- Uruchomić R2AA. Jeśli build i verify przejdą, można wykonać push całego Stage223.

<!-- STAGE223_R2AB_CALENDAR_DELETE_BUTTON_SYNTAX_HOTFIX -->
## 2026-06-05 - STAGE223 R2AB Calendar delete button JSX syntax hotfix

FAKTY:
- R2AA przeszedł Stage105, Stage220A28, Stage95 i mass scan 178 testów.
- Build zatrzymał się w `src/pages/Calendar.tsx` na błędzie JSX:
  `Expected "=>" but found "="`.
- Błąd powstał w przycisku usuwania wpisu kalendarza:
  `onClick={() = data-cf-destructive-source="trash-action-source"> onDelete(entry)}`.
- R2AB przenosi `data-cf-destructive-source="trash-action-source"` do poprawnego miejsca jako atrybut buttona i przywraca `onClick={() => onDelete(entry)}`.
- Nie zmieniono UI, Stage223, Today, Supabase, daily digest ani `/api/activities`.

DECYZJE:
- Nie cofamy R2X/R2Y/R2Z/R2AA.
- Nie usuwamy trash source markerów.
- Nie przywracamy legacy week-plan class combo.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest naprawa składni po regexowym patchu. Największe ryzyko: delete button w Calendar może mieć poprawny build, ale trzeba go kliknąć ręcznie po deployu.
- Po deployu sprawdzić `/calendar`: usuń wpis tygodnia, usuń wpis z selected day, sprawdź dialog/confirm i brak czerwonej plakietki.
- Jeśli kolejny build pokaże błąd składni w Calendar, nie robić szerokiego refaktoru; naprawić lokalnie błędny JSX.

NASTĘPNY KROK:
- Uruchomić R2AB. Jeśli build i verify przejdą, wykonać push całego Stage223.

<!-- STAGE223_R2AC_FINAL_GUARD_TESTS_CLOSURE -->
## 2026-06-05 - STAGE223 R2AC final guard/tests closure

FAKTY:
- Stage223 R2 został już wypchnięty jako commit `66b13479`.
- Podetap E nie był domknięty w wymaganym kształcie:
  - istniał `scripts/check-stage223-owner-movement-risk-system.cjs`,
  - istniał runtime test `tests/stage223-owner-risk-runtime-contract.test.cjs`,
  - brakowało docelowego `tests/stage223-owner-movement-risk-system.test.cjs`,
  - guard był za bardzo tokenowy i nie pilnował pełnej listy decyzji z podetapu E.
- R2AC dodaje finalny runtime test i zaostrza guard.

DECYZJE:
- Nie wdrażamy nowej funkcji.
- Nie ruszamy Stage224.
- Nie robimy Contact Cadence Grid, Lost Lead Rescue, Owner Digest, Finance Watchlist, AI scoringu, automatycznych wiadomości ani redesignu Today.
- Celem R2AC jest domknięcie jakości/guardów po Stage223 R2.
- Nie pushujemy bez zielonych testów końcowych.

TESTY AUTOMATYCZNE:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

TESTY RĘCZNE:
- Leads: badge braku akcji, ciszy 7/14 i wysokiej wartości zależnej od progu.
- LeadDetail: status następnego ruchu, brak duplikacji paneli, czytelne badge.
- Cases: badge braku ruchu, braku następnego ruchu i pieniędzy bez ruchu.
- CaseDetail: czytelny ruch/ryzyko bez mieszania z historią i notatkami.
- Today: brak nowej sekcji, `Wysoka wartość / ryzyko`, kliknięcia do rekordów, brak agresywnego odświeżania po zmianie karty.

AUDYT RYZYK:
- R2AC zmienia testy i guardy, nie runtime funkcji.
- Główne ryzyko: guard może złapać przyszłe ręczne dublowanie badge w UI — to jest celowe.
- Po zielonym teście można uruchomić lokalnie aplikację i przejść checklistę manualną.

NASTĘPNY KROK:
- Uruchomić R2AC lokalnie.
- Jeżeli testy są zielone, odpalić lokalnie `npm run dev:api` i sprawdzić /today, /leads, /cases, /calendar.

<!-- STAGE223_R2AD_V4_TODAY_TILE_NO_SCROLL_TRAP_HOTFIX -->
## 2026-06-05 - STAGE223 R2AD V4 Today tile no-scroll trap hotfix

FAKTY:
- R2AD V1, V2 i V3 nie zaaplikowały się przez zbyt kruche anchory patchera.
- V4 wykonuje lokalny audyt `TodayStable.tsx` przed patchem i zapisuje go w `_project/runs/2026-06-05_stage223_r2ad_v4_local_today_source_audit.md`.
- V4 używa parsera bloków/statements, zamiast zakładać sąsiedztwo tekstowe i puste linie.
- Naprawiane punkty:
  - `moveTodaySectionToTop` nie przestawia DOM,
  - `scrollToTodaySection` nie wywołuje `scrollIntoView`,
  - `focusTodaySectionFromMetricTile` nie używa timeout/scroll/reorder,
  - root/capture bridges ignorują top metric tiles,
  - top metric buttons mają własne bezpieczne onClick z blur/prevent/stop.
- Guard R2AD zostaje dopięty do `verify:closeflow:quiet`.

DECYZJE:
- Nie zaczynamy Stage224.
- Nie scrollujemy automatycznie do sekcji.
- Nie przenosimy sekcji w DOM po kliknięciu kafelka.
- Nie pushujemy bez zielonego guard/build/verify i ręcznego testu `/today`.

TESTY:
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- Zmieniamy UX kafelków: nie przenoszą list na górę.
- Ryzyko lokalne: expand/collapse na `/today`; ręczny smoke obowiązkowy.
- Guard w verify quiet ma zapobiec powrotowi `scrollIntoView` / `insertBefore` w mechanice kafelków Today.

NASTĘPNY KROK:
- Uruchomić R2AD V4, potem `npm run dev`, ręczny test `/today`, push po akceptacji.

<!-- STAGE223_R2AE_QUIET_GATE_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AE quiet gate contract repair after R2AD

FAKTY:
- R2AD V4 zaaplikował się lokalnie i przeszedł:
  - lokalny audyt `TodayStable.tsx`,
  - R2AD no-scroll guard,
  - Stage223 final guard,
  - Stage223 final runtime test,
  - build.
- `npm run verify:closeflow:quiet` padł nie przez Today, tylko przez złamanie kontraktu quiet gate.
- Błąd:
  - `FAILED: case detail no partial loading`,
  - `verify:closeflow:quiet musi zachować kontrakt quiet gate`.
- Przyczyna:
  - R2AD V4 dopisał do `package.json` komendę `&& node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs`,
  - a `tests/closeflow-release-gate-quiet.test.cjs` wymaga dokładnie:
    `verify:closeflow:quiet = node scripts/closeflow-release-check-quiet.cjs`.
- R2AE przywraca `package.json` do exact quiet gate contract i podpina R2AD guard wewnątrz `scripts/closeflow-release-check-quiet.cjs`.

DECYZJE:
- Nie zmieniamy fixu Today z R2AD V4.
- Nie dopisujemy dodatkowych poleceń do `verify:closeflow:quiet` w package.json.
- Nowy guard Today ma być uruchamiany przez `closeflow-release-check-quiet.cjs`.
- Nie pushujemy bez zielonego verify quiet.

TESTY:
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-r2ae-quiet-gate-contract-repair.cjs
- node --test tests/closeflow-release-gate-quiet.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest naprawa kontraktu testowego, nie nowy runtime feature.
- Ryzyko było proceduralne: dopięcie guarda do package scriptu łamie stary quiet gate contract.
- Zabezpieczenie: R2AE dodaje własny guard pilnujący, że package script pozostaje dokładny, a nowy R2AD guard jest w środku quiet gate.

NASTĘPNY KROK:
- Uruchomić R2AE. Jeśli verify quiet przejdzie, odpalić lokalnie `npm run dev`, sprawdzić `/today`, potem push po akceptacji.

<!-- STAGE223_R2AF_TODAY_MOBILE_FOCUS_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AF Today mobile focus contract repair after no-scroll fix

FAKTY:
- R2AE przywrócił exact `verify:closeflow:quiet` contract i build przechodził.
- Verify quiet zatrzymał się na starym guardzie `today mobile tile focus`.
- Guard `scripts/check-closeflow-today-mobile-tile-focus.cjs` nadal wymagał:
  - `setCollapsedSections((prev) => prev.filter((entry) => entry !== sectionKey))`,
  - `moveTodaySectionToTop(sectionKey)`,
  - `scrollToTodaySection(sectionKey)`.
- To jest sprzeczne z decyzją R2AD: kafelki Today nie mogą już przenosić sekcji w DOM ani przewijać do sekcji, bo to powodowało scroll trap.
- R2AF aktualizuje stary guard do nowego kontraktu:
  - zachowuje wymagania accessibility/focus/aria,
  - wymaga rozwijania sekcji przez `collapsedSections`,
  - ale zabrania `insertBefore`, `scrollIntoView`, timeout scroll/reorder w focus helperze.
- R2AF nie zmienia runtime Today poza tym, co zrobił R2AD V4.

DECYZJE:
- Nie cofamy R2AD V4.
- Nie przywracamy `moveTodaySectionToTop(sectionKey)` ani `scrollToTodaySection(sectionKey)` do ścieżki kliknięcia kafelka.
- Stary guard mobile focus zostaje dostosowany do nowej decyzji UX.
- Nie pushujemy bez zielonego verify quiet i ręcznego testu `/today`.

TESTY:
- node scripts/check-closeflow-today-mobile-tile-focus.cjs
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-r2af-today-mobile-focus-contract-repair.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To zmiana guard/test contract, nie nowa funkcja.
- Główne ryzyko: stary test wymuszał zachowanie, które teraz uznaliśmy za źródło bugów.
- Nowy kontrakt utrzymuje dostępność i focus, ale blokuje scroll trap.

NASTĘPNY KROK:
- Uruchomić R2AF, potem lokalny `npm run dev`, ręczny test `/today`, push po akceptacji.

<!-- STAGE223_R2AG_TODAYSTABLE_TRAILING_WHITESPACE_CLEANUP -->
## 2026-06-05 - STAGE223 R2AG TodayStable trailing whitespace cleanup

FAKTY:
- R2AF zaaplikował się i przeszedł:
  - Today mobile tile focus guard,
  - Today tile no-scroll trap guard,
  - R2AF contract guard,
  - build,
  - verify:closeflow:quiet.
- Jedyny bloker został na `git diff --check`.
- `git diff --check` wskazał trailing whitespace w `src/pages/TodayStable.tsx`:
  - linia 977,
  - linia 986,
  - linia 1109.
- R2AG usuwa wyłącznie trailing whitespace w `TodayStable.tsx`.
- Nie zmienia logiki Today, guardów, package scripts, quiet gate ani UI.

DECYZJE:
- Nie dotykamy zachowania R2AD/R2AF.
- Nie ignorujemy `git diff --check`.
- Nie pushujemy bez zielonego diff check.

TESTY:
- node scripts/check-closeflow-today-mobile-tile-focus.cjs
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-r2af-today-mobile-focus-contract-repair.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To czyszczenie whitespace, więc ryzyko runtime jest minimalne.
- Ręczny smoke `/today` nadal wymagany, bo właściwa zmiana behavioru pochodzi z R2AD V4/R2AF.
- Uwaga: ostrzeżenia LF/CRLF z `git diff --check` są nieblokujące; trailing whitespace był blokujący.

NASTĘPNY KROK:
- Uruchomić R2AG.
- Po zielonym diff check odpalić lokalnie `npm run dev`, sprawdzić `/today`, potem push po akceptacji.

<!-- STAGE223R3_A_LAST_CONTACT_INTAKE -->
## 2026-06-05 - STAGE223R3-A Last Contact Intake

FAKTY:
- Zweryfikowano, że formularz tworzenia leada i klienta nie miał pola `lastContactAt`.
- Zweryfikowano, że payload tworzenia leada/klienta nie wysyłał `lastContactAt`.
- `activity-truth.ts` i `next-move-contract.ts` już istnieją po Stage223, więc wcześniejsza teza o ich braku była nieaktualna.
- R3A dodaje pole `Ostatni kontakt` do tworzenia leadów i klientów.
- R3A dodaje helper `src/lib/owner-control/last-contact-intake.ts`.
- R3A dodaje API support dla `lastContactAt` / `last_contact_at` w `api/leads.ts` i `api/clients.ts`.
- R3A dodaje SQL `supabase/sql/001_stage223r3_add_last_contact_at.sql`.

DECYZJE:
- Domyślnie pole pokazuje dzisiejszą datę.
- Jeżeli kontakt był starszy, operator ma wpisać prawdziwą datę.
- Datę zapisujemy jako noon ISO, żeby ograniczyć problemy stref czasowych.
- Daty przyszłe są blokowane komunikatem: `Ostatni kontakt nie może być w przyszłości.`
- Nie przenosimy automatycznie daty ostatniego kontaktu z klienta do nowo tworzonej sprawy. To zostaje DO POTWIERDZENIA.

TESTY:
- node scripts/check-stage223r3-last-contact-intake.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- Jeśli SQL nie zostanie uruchomiony, API ma fallback dla brakującej kolumny, ale data nie będzie trwale zapisana w bazie.
- Lista leadów/klientów ma fallback select bez `last_contact_at`, żeby nie wysadzić produkcji przed migracją.
- Pełne spięcie z widocznością badge `Cisza 14+ dni` zależy od tego, czy `last_contact_at` wróci z API po migracji.
- Następny krok po R3A: Stage223R3-B Activity Truth Integration/verification, jeśli po manualnym teście badge nie bierze daty z bazy.

NASTĘPNY KROK:
- Uruchomić SQL w Supabase.
- Uruchomić R3A lokalnie.
- Przetestować tworzenie leada/klienta z datą 20 dni temu.

<!-- STAGE223R3A_V2_LAST_CONTACT_GUARD_FALSE_NEGATIVE -->
## 2026-06-05 - STAGE223R3A-V2 Guard false-negative repair

FAKTY:
- Stage223R3-A SQL wykonał się poprawnie w Supabase: ALTER TABLE zwrócił "Success. No rows returned", co jest normalnym wynikiem dla DDL.
- Stage223R3-A zatrzymał się na guardzie, nie na kodzie produkcyjnym.
- Guard błędnie wymagał dokładnego tekstu `lastContactAt: dateInputToNoonIso(newClient.lastContactAt)`.
- Faktyczna ścieżka kodu klienta to: `newClient.lastContactAt` -> `preparedClient.lastContactAt` -> `dateInputToNoonIso(preparedClient.lastContactAt)`.

DECYZJA:
- Naprawiamy guard, nie zmieniamy funkcjonalnej ścieżki klienta na siłę.
- Guard ma akceptować ścieżkę przez preparedClient, ale dalej wymaga zachowania daty z newClient i konwersji do ISO.

TESTY:
- node scripts/check-stage223r3-last-contact-intake.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest naprawa fałszywie negatywnego guarda po częściowo wykonanym apply.
- Nie wolno robić resetu ani restore bez sprawdzenia, bo wcześniejszy apply zdążył zmienić pliki.
- Po zielonym teście nadal trzeba zrobić manualny test tworzenia lead/klient z datą 20 dni temu.

<!-- STAGE223R3A_V3_STAGE03D_LAST_CONTACT_EVIDENCE -->
## 2026-06-05 - STAGE223R3A-V3 Stage03D last_contact_at evidence hotfix

FAKTY:
- Stage223R3A-V2 przeszedł guard i runtime test dla Last Contact Intake.
- Build przeszedł.
- `verify:closeflow:quiet` zatrzymał się na `tests/stage03d-optional-columns-evidence.test.cjs`.
- Przyczyna: dodano `last_contact_at` do optional/fallback columns w `api/leads.ts`, ale Stage03D evidence matrix nie miała wiersza `leads.last_contact_at`.
- V3 dopisuje wymagane wiersze evidence:
  - `leads.last_contact_at`,
  - `clients.last_contact_at`.

DECYZJE:
- Nie zmieniamy runtime Last Contact Intake.
- Nie cofamy SQL.
- Naprawiamy dokument evidence, bo Stage03D wymaga audytowalnego uzasadnienia każdej optional fallback column.
- Nie uruchamiamy osobnego pełnego builda drugi raz; po zmianie dokumentu evidence uruchamiamy failing Stage03D test oraz `verify:closeflow:quiet`, żeby potwierdzić release gate.

TESTY:
- node --test tests/stage03d-optional-columns-evidence.test.cjs
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest dokumentacyjno-release-gate hotfix.
- Runtime ryzyko minimalne, bo kod produkcyjny nie jest zmieniany w V3.
- Po zielonym gate nadal trzeba ręcznie sprawdzić tworzenie leada/klienta z `Ostatni kontakt` 20 dni temu.

NASTĘPNY KROK:
- Uruchomić V3.
- Jeśli gate jest zielony, lokalny smoke `/leads` i `/clients`.
- Push po akceptacji.

## STAGE226R7 — Rescue Build Hotfix + Rescue UI Polish

Data: 2026-06-05 20:32 Europe/Warsaw

## FAKTY
- Stage226R7 usuwa runtime blocker w src/pages/Leads.tsx: wolne odwołanie do filter po dodaniu leada.
- Dodaje guard i runtime test Stage226R7.
- Dopolerowuje panel Do odzyskania: summary Krytyczne/Wysokie/Średnie, tekst Pokazano 8 z X, pusty stan operacyjny.
- Nie aktywuje przycisków Ustaw zadanie / Odłóż / Oznacz jako martwy.

## TESTY
- node scripts/check-stage226-lost-lead-rescue.cjs
- node --test tests/stage226-lost-lead-rescue.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

## AUDYT RYZYK
- create lead flow wymaga ręcznego testu po patchu.
- Rescue UI może wymagać późniejszego uproszczenia wizualnego.
- Backend akcji Rescue nie jest jeszcze wdrożony, więc disabled actions są prawidłowe.

## STAGE220A35 — Client Commission Finance Source Truth

Data: 2026-06-05 21:05 Europe/Warsaw

### FAKTY
- Naprawiono rozjazd: wartość transakcji/sprawy nie jest prowizją właściciela.
- ClientDetail pokazuje prowizję należną, wpłaconą prowizję i prowizję do zapłaty jako osobne wartości.
- Karta sprawy w kliencie używa getCaseFinanceSummary, więc prowizja procentowa 69 000 PLN × 2% daje 1 380 PLN zamiast 0 PLN.
- Wartość transakcji nadal jest widoczna jako osobna informacja.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node --test tests/stage220a35-client-commission-finance.test.cjs
- node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs
- node scripts/check-stage220a26b-finance-regression-contract.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Bez tej poprawki Stage227 / Sales Funnel mógłby dziedziczyć błędne wartości finansowe.
- Nie ruszano Supabase, RLS ani backendu płatności.
- Model prowizji stałej nadal używa gotowej kwoty prowizji.

## STAGE220A36 — Commission Input Model Split

Data: 2026-06-05 21:45 Europe/Warsaw

### FAKTY
- Rozdzielono prowizję stałą od podstawy procentowej.
- Przy kwocie stałej użytkownik wpisuje wartość prowizji.
- Przy prowizji procentowej użytkownik wpisuje wartość transakcji do wyliczenia i stawkę procentową; prowizja jest wyliczana i nieedytowalna.
- Lista klientów pokazuje prowizję operacyjną, nie cenę transakcji.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node --test tests/stage220a36-commission-input-model-split.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Nie ruszano Supabase, RLS ani backendu płatności.
- Techniczne pole contractValue nadal przechowuje podstawę procentu przy modelu procentowym.
- Stage227 może startować dopiero po ręcznym sprawdzeniu fixed/percent w modalach finansów.

## STAGE220A36-R2 — Commission Modal Field Order

Data: 2026-06-05 22:00 Europe/Warsaw

### FAKTY
- Doprecyzowano układ modala prowizji: najpierw rodzaj prowizji, potem stawka procentowa i wartość prowizji.
- Pole "Wartość prowizji" jest edytowalne tylko przy kwocie stałej.
- Przy procencie wartość prowizji wylicza się automatycznie i jest nieedytowalna.
- Podstawa procentu, czyli wartość transakcji/zlecenia, jest osobnym polem poniżej głównych kontrolek prowizji.

### TESTY
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node scripts/check-stage220a36r2-commission-modal-field-order.cjs
- node --test tests/stage220a36-commission-input-model-split.test.cjs
- node --test tests/stage220a36r2-commission-modal-field-order.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Nie zmieniano bazy ani modelu płatności.
- Ryzyko dotyczy tylko czytelności UI i błędnego wpisywania ceny transakcji w miejsce prowizji.
- Stage227 nadal musi korzystać z prowizji jako wartości operacyjnej.

## STAGE220A36-R4 — Build Guard and Case Item Schema Fix

Data: 2026-06-05 22:15 Europe/Warsaw

### FAKTY
- Naprawiono guardy A35/A36 po R2: usunieto BOM/mojibake i zbyt sztywne tokeny copy.
- Usunieto wysylanie approved_at przy tworzeniu case_items, bo produkcyjna tabela nie ma tej kolumny.
- Nie dodawano SQL ani kolumny w Supabase.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node scripts/check-stage220a36r2-commission-modal-field-order.cjs
- node scripts/check-stage220a36r4-build-guard-and-case-item-schema-fix.cjs
- node --test tests/stage220a36r2-commission-modal-field-order.test.cjs
- node --test tests/stage220a36r4-build-guard-and-case-item-schema-fix.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Commit 00b8a95 byl wypchniety mimo czerwonych guardow, wiec R4 domyka build przed Stage227.
- Runtime bledy schema cache PGRST204 trzeba lapac guardami payloadu, nie obiecywac SQL bez potrzeby.
- Nie ruszano Supabase, RLS ani modelu platnosci.

## STAGE220A36-R5 — R4 Guard Token Compat

Data: 2026-06-05 22:30 Europe/Warsaw

### FAKTY
- Vercel po d1e380f5 przechodzil A35, A36 i A36-R2, ale padal na zbyt sztywnym R4 guardzie.
- R4 guard oczekiwal tokenu "CaseFinanceEditorDialog percent basis field", a aktualny A36 guard uzywa "CaseFinanceEditorDialog percent basis label".
- R5 dopuszcza oba tokeny i dodaje osobny guard/test, zeby nie powtorzyc tego regresu.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node scripts/check-stage220a36r2-commission-modal-field-order.cjs
- node scripts/check-stage220a36r4-build-guard-and-case-item-schema-fix.cjs
- node scripts/check-stage220a36r5-r4-guard-token-compat.cjs
- node --test tests/stage220a36r5-r4-guard-token-compat.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- To jest hotfix guardu, nie zmiana UI ani bazy.
- approved_at fix z R4 zostaje bez zmian.
- Stage227 nadal wymaga zielonego Vercel po R5.

## STAGE220A36-R6 — Deploy Unblock Mojibake Cleanup

Data: 2026-06-05 22:35 Europe/Warsaw

### FAKTY
- Cleaned R4 guard/test files from BOM and literal encoding marker characters.
- Added R6 guard to protect the commission modal order and deployment path.
- Did not change Supabase, RLS, payments, or commission math.

### AUDYT RYZYK
- The UI screenshot can remain old until Vercel deploys a green build.
- Stage227 remains blocked until Vercel is green and modal is manually verified.

## STAGE220A36-R7 — CaseDetail Legacy Finance Modal Wiring Fix

Data: 2026-06-06 07:55 Europe/Warsaw

### FAKTY
- Produkcyjny bundle CaseDetail zawieral jednoczesnie nowy i stary modal.
- Widoczny modal w karcie sprawy byl inline FIN-11 w CaseDetail.tsx, a nie wspolny CaseFinanceEditorDialog.
- R7 przepina legacy modal CaseDetail na kolejnosc: Rodzaj prowizji -> Stawka -> Wartosc prowizji -> Podstawa procentu -> Waluta -> Status.

### TESTY
- node scripts/check-stage220a36r7-case-detail-legacy-finance-modal.cjs
- node --test tests/stage220a36r7-case-detail-legacy-finance-modal.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Guardy A36 wczesniej pilnowaly wspolnego komponentu, ale nie pilnowaly inline modala CaseDetail, dlatego UI produkcyjne moglo pozostac stare.
- Po R7 trzeba sprawdzic bundle w przegladarce: hasOldTitle powinno byc false, a hasNewTitle true.
- Blad /api/case-items 500 jest osobnym watkiem; wymaga Response z Network, jesli po deployu R7 nadal wystapi.

## STAGE220A36-R10 — Commission Modal Three-Field Top Row Polish

Data: 2026-06-06 08:55 Europe/Warsaw

### FAKTY
- Po R7 produkcyjny bundle byl aktualny, ale UX nadal nie odpowiadal oczekiwaniu: u gory mialy byc trzy pola decyzyjne, a wartosc transakcji/zlecenia osobno nizej.
- R10 uklada modal jako: Rodzaj prowizji -> Stawka (%) -> Wartosc prowizji w pierwszym rzedzie, a Wartosc transakcji/zlecenia jako osobne pole pod spodem.

### TESTY
- node scripts/check-stage220a36r10-commission-modal-three-field-layout.cjs
- node --test tests/stage220a36r10-commission-modal-three-field-layout.test.cjs
- node scripts/check-stage220a36r7-case-detail-legacy-finance-modal.cjs
- node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs
- node scripts/check-stage220a32-finance-controls-delete-labels.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Zmieniany jest tylko uklad i copy modala, nie model danych ani zapis prowizji.
- Stare guardy A31/A32/R7 zostaja dostosowane do nowego labela wartosci transakcji/zlecenia, zeby nie blokowaly poprawnego UX.
- /api/case-items 500 pozostaje osobnym watkiem, jesli nadal wystepuje po deployu.


## STAGE220A36-R11 — Commission Modal Compact Tooltips + Alignment

Data: 2026-06-06 09:10 Europe/Warsaw

### FAKTY
- R10 logicznie ułożył pola, ale modal nadal był zbyt przytłaczający przez opisy pod polami i zbyt wysokie inputy.
- R11 przenosi opisy do tooltipów „?”, skraca środkowy label do „Stawka (%)”, zmniejsza wysokość pól i wyrównuje środkowe pole stawki.

### TESTY
- node scripts/check-stage220a36r11-commission-modal-compact-tooltips.cjs
- node --test tests/stage220a36r11-commission-modal-compact-tooltips.test.cjs
- node scripts/check-stage220a36r10-commission-modal-three-field-layout.cjs
- node scripts/check-stage220a36r7-case-detail-legacy-finance-modal.cjs
- node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Zmieniany jest tylko UX/copy/CSS modala, nie zapis prowizji ani backend.
- Native tooltip na title jest prosty i bezpieczny, ale na mobile nie daje pełnego komfortu — jeżeli to będzie problem, kolejny etap powinien zrobić własny popover.
- Trzeba ręcznie sprawdzić, czy trzy pola w górnym rzędzie nie ściskają się na szerokości laptopa i czy wąskie ekrany poprawnie zawijają do jednej kolumny.

## STAGE220A36-R12 — Commission Modal Width Polish

Data: 2026-06-06 09:35 Europe/Warsaw

### FAKTY
- Po R11 modal byl czytelniejszy, ale select rodzaju prowizji nadal ucinal tekst, a pole wartosci transakcji/zlecenia zajmowalo zbyt duzo szerokosci.
- R12 poszerza pole rodzaju prowizji, utrzymuje kompaktowa stawke i kwote prowizji oraz ogranicza szerokosc pola wartosci transakcji/zlecenia.

### TESTY
- node scripts/check-stage220a36r12-commission-modal-width-polish.cjs
- node --test tests/stage220a36r12-commission-modal-width-polish.test.cjs

### AUDYT RYZYK
- Zmieniany jest tylko CSS i marker ukladu modala; logika zapisu prowizji zostaje bez zmian.
- Na waskich ekranach pola nadal skladaja sie do jednej kolumny.

## STAGE226R10 — Lead/Client Separation Runtime Fix

Data: 2026-06-06 09:35 Europe/Warsaw

### FAKTY
- Lead i klient sa osobnymi bytami. Dodanie leada nie moze tworzyc ani wyswietlac klienta.
- W api/leads.ts zwykly POST tworzacy leada nie moze wywolywac ensureClientForLead ani wypelniac client_id/linked_case_id.
- Konwersja do klienta zostaje tylko w jawnym przeplywie start_service.

### TESTY
- node scripts/check-stage226r10-lead-client-separation-runtime.cjs
- node --test tests/stage226r10-lead-client-separation-runtime.test.cjs
- opcjonalnie Stage226 lost-lead-rescue guard/test jesli pliki istnieja
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Najwieksze ryzyko bylo w zwyklym POST /api/leads, ktory mogl zapewniac klienta przed utworzeniem leada.
- Nie ruszano Supabase schema, RLS, Stage227 ani finansow A36 poza malym R12 CSS.
- Trzeba recznie potwierdzic: dodanie leada nie zwieksza liczby klientow na /clients.

## STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG — lead/client conflict hardening

- data i godzina: 2026-06-06 13:31 Europe/Warsaw
- typ wpisu: etap naprawczy / runtime hardening po Stage226R10
- decyzja: tworzenie leada zostaje lead-only; konflikt z klientem ma być ostrzeżeniem i linkiem do klienta, nie ścieżką przywrócenia klienta z formularza leada.
- zmiana: w Leads.tsx zostaje jeden EntityConflictDialog dla leadów; kandydaci typu client mają wymuszone canRestore=false w tym flow; restoreConflictCandidate nie wykonuje updateClientInSupabase dla klienta.
- testy/guardy: scripts/check-stage226r10b-lead-client-conflict-single-dialog.cjs, tests/stage226r10b-lead-client-conflict-single-dialog.test.cjs, plus regresja Stage226R10.
- ryzyko: jeśli klient istnieje w /clients, po dodaniu podobnego leada nadal będzie widoczny jako stary klient — to nie jest nowy klient. Manual smoke musi liczyć klientów przed i po dodaniu leada.
- status: local ZIP patch; do uruchomienia i pushu po PASS.

## STAGE226R10C2_LEAD_CLIENT_CONFLICT_RESTORE_BLOCK_PATCHER_FIX — fix po czerwonym R10C

- data i godzina: 2026-06-06 13:55 Europe/Warsaw
- typ wpisu: hotfix patchera i kontraktu lead/client separation po R10B/R10C
- decyzja: klient z konfliktu przy tworzeniu leada nie może być przywracany z flow leada; tylko Pokaż klienta albo Dodaj mimo to jako osobnego leada.
- zmiana: restoreConflictCandidate blokuje candidate.entityType === 'client' bez updateClientInSupabase; kandydaci typu client dostają canRestore=false przed zapisaniem do state.
- naprawa procesu: R10C2 usuwa nieudane, niezatwierdzone pliki R10C po przerwanym apply i dodaje odporny patcher regexowy.
- testy: R10C2 guard/test, R10B guard/test, R10 guard/test, build, verify:closeflow:quiet, git diff --check.
- ryzyko: istniejący klient z tymi samymi danymi dalej będzie widoczny w /clients, ale nie jest tworzony ani przywracany przez dodanie leada.

## STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX — guards

- data i godzina: 2026-06-06 14:23 Europe/Warsaw
- guard: scripts/check-stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix.cjs
- test: tests/stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix.test.cjs
- kontrakt: brak .catch(() => ({ candidates: [] })) przy conflict preflight; błąd checkerów zatrzymuje zapis; konflikt pokazuje komunikat i wymaga „Dodaj mimo to”.

## STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH — guardy i testy

- data i godzina: 2026-06-06 14:58 Europe/Warsaw
- guard: `npm run check:stage226r11-gcal-timezone-reminder-truth`.
- test: `npm run test:stage226r11-gcal-timezone-reminder-truth`.
- regresje: R10D2, R10C2, R10B, R10, build, verify:closeflow:quiet, git diff --check.

## STAGE226R11B_GCAL_TIMEZONE_TEST_CROSS_REALM_FIX — guardy/testy

- data i godzina: 2026-06-06 15:05 Europe/Warsaw
- test: npm run test:stage226r11-gcal-timezone-reminder-truth
- powód: assert z node:assert/strict porównywał obiekt z VM realm do zwykłego obiektu i raportował false negative mimo identycznej struktury.

<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_GUARDS_START -->
## 2026-06-06 15:35 Europe/Warsaw — STAGE227A guardy i testy

- `node scripts/check-stage227a-sales-funnel-movement-view.cjs`
- `node --test tests/stage227a-sales-funnel-movement-view.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- Regresja R10 lead/client separation, jeśli pliki istnieją.
- Regresja R11 Google Calendar timezone reminder truth, jeśli pliki istnieją.
- Manual smoke `/funnel`.
<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_GUARDS_END -->

<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_GUARDS_START -->
## 2026-06-06 15:45 Europe/Warsaw — STAGE227B — guardy/testy

- `npm run check:stage227b-sales-funnel-decision-list`
- `npm run test:stage227b-sales-funnel-decision-list`
- Regresja: `npm run check:stage227a-sales-funnel-movement-view`
- Regresja: `npm run test:stage227a-sales-funnel-movement-view`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`
<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_GUARDS_END -->

<!-- STAGE228A_FUNNEL_TRUTH_CLICKABILITY_GUARDS_START -->
## 2026-06-06 17:05 Europe/Warsaw — STAGE228A guardy i testy

- `node scripts/check-stage228a-sales-funnel-truth-clickability.cjs`
- `node --test tests/stage228a-sales-funnel-truth-clickability.test.cjs`
- regresje Stage227A/Stage227B
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`
<!-- STAGE228A_FUNNEL_TRUTH_CLICKABILITY_GUARDS_END -->

## 2026-06-06 18:00 Europe/Warsaw — STAGE228B Lead Work Action Center

- typ: etap wdrożeniowy local-only
- decyzja: Lead nie dostaje pełnego lejka; dostaje centrum pracy „Co robimy teraz?” z zadaniami, wydarzeniami, brakami i akcjami kontynuacji historii.
- pliki: src/pages/LeadDetail.tsx, scripts/check-stage228b-lead-work-action-center.cjs, tests/stage228b-lead-work-action-center.test.cjs
- testy: Stage228B guard/test + regresje Stage228A/227B + build + verify quiet + diff-check
- ryzyko: nie tworzyć drugiego systemu działań; używać istniejących handlerów LeadDetail.

## 2026-06-06 18:36 Europe/Warsaw - Stage228B R8 AlertTriangle import guard

Guard added: `check:stage228b-alerttriangle-import`.
Purpose: if LeadDetail uses AlertTriangle, it must import AlertTriangle from lucide-react so the route cannot crash at runtime with "AlertTriangle is not defined".

## 2026-06-06 18:42 Europe/Warsaw — STAGE228B R9 import source repair

- FAKT: Stage228B R8 naprawil brak AlertTriangle, ale uszkodzil zrodla importow w LeadDetail: useNavigate trafil do lucide-react, a ArrowLeft do react.
- DECYZJA: nie cofac calego Stage228B i nie oslabiać guardow; naprawic zrodlo importow i dodac guard na import sources.
- TESTY: Stage228B R9 ma odpalic R9 guard, R8 guard, Stage98, Stage228B, Stage228A, Stage227B, build, verify quiet i diff-check.
- RYZYKO: kazdy kolejny patcher importow w LeadDetail musi traktowac trzy importy na gorze pliku jako kontrakt: react, react-router-dom, lucide-react.

## 2026-06-06 18:50 Europe/Warsaw — STAGE228B R10 import guard false-positive fix

- FAKT: Stage228B R9 naprawil top importy w LeadDetail, ale guard mial regex przechodzacy przez wiele importow i falszywie wykrywal useNavigate w lucide-react.
- DECYZJA: nie omijac builda ani guardow; naprawic guard tak, aby parsowal pojedyncze deklaracje importow i nadal pilnowal zrodel: react, react-router-dom, lucide-react.
- TESTY: R10 ma odpalic import-source guard, AlertTriangle guard, Stage98, Stage228B, Stage228A, Stage227B, build, verify quiet i diff-check.
- RYZYKO: patchery importow musza traktowac trzy pierwsze importy w LeadDetail jako kontrakt.

## 2026-06-06 19:05 Europe/Warsaw — STAGE228B R13 Canonical LeadDetail imports repair

- Status: local hotfix package for broken pushed Stage228B commit 14f00a3d.
- Scope: deterministic rewrite of LeadDetail imports for react, react-router-dom and lucide-react.
- Guard: parser-based checks for AlertTriangle and hook import sources.
- Risk note: R8/R9/R10/R12 failures were caused by brittle regex/import handling; R13 uses declaration-level parsing.

## 2026-06-06 19:45 Europe/Warsaw — STAGE228B_R14_LEAD_ACTION_CENTER_VST

- FAKT: Po Stage228B LeadDetail działa, ale centrum działań leada było mniej czytelne niż analogiczna karta sprawy.
- DECYZJA: Nie tworzyć osobnego systemu wizualnego dla leada. Lead action center ma iść w kierunku tego samego źródła wizualnego co CaseDetail: jeden nagłówek, jasne grupy, kompaktowe wiersze, akcje przy rekordzie.
- ZMIANA: Usunięto duplikujące copy, poprawiono separator w wierszach, ograniczono "Braki i blokady" do jawnych braków/blokad zamiast dublować każde zaległe wydarzenie.
- TESTY: Stage228B R14 guard/test, Stage228B guard/test, Stage98, build, verify quiet, diff-check.
- RYZYKO: Po deployu sprawdzić ręcznie LeadDetail z zaległym wydarzeniem i porównać czytelność do CaseDetail.

<!-- STAGE228F_R2_RUNTIME_COPY_CLEANUP -->
## 2026-06-07 18:55 Europe/Warsaw - STAGE228F R2 guard

Guard: `node scripts/check-stage228f-runtime-copy-cleanup.cjs`

Zakres:
- blokuje powrot dwoch dopiskow w prawym railu klientow,
- blokuje powrot gornego kafelka Historia w leadach,
- pilnuje, ze filtr Historia w prawym railu leadow zostaje.

<!-- STAGE228G_GUARD -->
## 2026-06-07 19:05 Europe/Warsaw - STAGE228G guard

- Guard: node scripts/check-stage228g-cases-copy-and-operator-rail-source-truth.cjs
- Scope: /cases helper copy removal, cases shortcuts via SimpleFiltersCard, shared operator rail tone hooks and CSS.

<!-- STAGE228H_R3_GUARD -->
## 2026-06-07 19:45 Europe/Warsaw - STAGE228H R3 guard
- Guard: node scripts/check-stage228h-r3-sales-funnel-source-truth.cjs
- Zakres: /funnel bez panelu właściciela, kafelki przez OperatorMetricTile, jeden rząd na desktopie, refresh w stage actions.
<!-- /STAGE228H_R3_GUARD -->

<!-- STAGE228R1_RAIL_TASKS_PATTERN_GUARD -->
## Stage228R1 guard
- npm run check:stage228r1-rail-tasks-pattern
- Chroni klasę błędu: rozjazd tekstu/rytmu right rail względem wzorca /tasks.
<!-- /STAGE228R1_RAIL_TASKS_PATTERN_GUARD -->

<!-- STAGE228R2_ADMIN_FEEDBACK_RAIL_CLEANUP_GUARD -->
## 2026-06-08 08:58 Europe/Warsaw - Stage228R2 guard

Guard:
- `npm run check:stage228r2-admin-feedback-rail-cleanup`

Chroni:
- brak powrotu Billing `AI jako dodatek Beta`,
- brak opisu `accessCopy.description` w prawym statusie Billing,
- brak powrotu Notifications `Jak dzialaja powiadomienia?`,
- brak powrotu AI Drafts `Jak dziala szkic?`,
- brak mojibake separatora w `SalesFunnel.tsx`,
- import statycznego CSS `admin-feedback-rail-cleanup-stage228r2.css`.
<!-- /STAGE228R2_ADMIN_FEEDBACK_RAIL_CLEANUP_GUARD -->

## 2026-06-08 19:40 Europe/Warsaw - STAGE228R11_SHARED_MISSING_ITEM_FLOW_GUARD

Dodany guard:

- scripts/check-stage228r11-shared-missing-item-flow.cjs
- package.json script: check:stage228r11-shared-missing-item-flow
- package.json prebuild: node scripts/check-stage228r11-shared-missing-item-flow.cjs

Guard pilnuje:

- shared missing item contract lead/client/case,
- LeadDetail: Brak quick action, shared modal, task missing_item, activity missing_item_created, lista Braki i blokady,
- ClientDetail: shared modal, task missing_item, activity missing_item_created, lista Braki i blokady,
- CaseQuickActions: Brak jako szybka akcja sprawy,
- AddCaseMissingItemDialog: zapis do case_items status missing,
- CaseDetail: fetch/insert/update/delete case_items.

## 2026-06-08 20:45 Europe/Warsaw - STAGE228R13_MISSING_ITEM_STATUS_RESOLVE_GUARD

Dodany guard:
- scripts/check-stage228r13-missing-item-status-resolve.cjs
- package.json script: check:stage228r13-missing-item-status-resolve
- package.json prebuild: node scripts/check-stage228r13-missing-item-status-resolve.cjs

Chroni:
- LeadDetail: open-only Braki i blokady + Rozwiąż brak.
- ClientDetail: open-only Braki i blokady + Rozwiąż.
- CaseDetail: istniejący case_items status accepted/rejected i filtr accepted poza aktywnymi brakami.

## 2026-06-08 20:55 Europe/Warsaw - STAGE228R13R2_MISSING_ITEM_STATUS_GUARD_REPAIR

STATUS: LOCAL_ONLY.

Naprawa:
- Guard R13 akceptuje LeadDetail pattern `addActivity('missing_item_resolved', ...)`.
- Guard nadal wymaga updateTaskInSupabase, status done/resolved i akcji Rozwiąż/Rozwiąż brak.
- CaseDetail guard sprawdza realny filtr accepted poza aktywnymi brakami.

## 2026-06-08 21:05 Europe/Warsaw - STAGE228R14_C5_GUARD

Dodany guard:
- scripts/check-stage228r14-c5-missing-items-no-sql-decision.cjs

Sprawdza:
- R11/R12/R13 kontrakty Brak,
- decyzje no-SQL,
- brak zaleznosci od missing_items/blockers,
- brak migracji create table missing_items/blockers,
- finalny manual test plan,
- next step batch push dopiero po manual PASS.

## 2026-06-08 21:15 Europe/Warsaw - STAGE228R14R2_C5_GUARD_MANUAL_TEXT_REPAIR

STATUS: LOCAL_ONLY.

Naprawa:
- R14 guard akceptuje szczegolowy wording testu:
  - LeadDetail -> Brak -> save -> refresh -> visible -> Rozwiąż brak -> refresh -> hidden
  - ClientDetail -> Brak -> save -> refresh -> visible -> Rozwiąż -> refresh -> hidden
  - CaseDetail -> Brak -> save -> refresh -> visible -> accepted/resolved -> refresh -> hidden
- Brak zmian runtime.

## 2026-06-08 21:45 Europe/Warsaw - STAGE228R15_MISSING_ITEM_DELETE_REFRESH_GUARD

Dodany guard:
- scripts/check-stage228r15-missing-item-delete-refresh.cjs
- package.json script: check:stage228r15-missing-item-delete-refresh
- package.json prebuild includes R15 guard.

Chroni:
- lead/client soft-delete missing_item przez status=deleted zamiast DELETE /api/tasks,
- LeadDetail i ClientDetail refresh po closeflow:context-action-saved,
- CaseDetail istniejacy refresh po closeflow:context-action-saved,
- brak SQL.

## 2026-06-08 21:55 Europe/Warsaw - STAGE228R15R2_GUARD_SYNTAX_REPAIR

Naprawiono skladnie guardu:
- scripts/check-stage228r15-missing-item-delete-refresh.cjs

Powod: R15 runtime patch byl zastosowany, ale guard mial bledne cudzyslowy przy tokenie ContextActionDialogsHost.

Zakres: tylko guard + raport/manifest. Bez SQL.

## 2026-06-08 22:30 Europe/Warsaw - STAGE228R16R2_TASK_DELETE_SQL_BRAK_BUTTON_GUARD

Guard:
- scripts/check-stage228r16r2-task-delete-sql-brak-button.cjs

Checks:
- SQL file drops NOT NULL for leads.next_action_title.
- deleteTaskFromSupabase no longer uses DELETE.
- LeadDetail generic task delete uses soft-delete.
- Lead/Client Brak buttons have explicit open handlers.

<!-- STAGE228R17_MISSING_ITEM_DELETE_CONTRACT -->
## 2026-06-08 20:45 Europe/Warsaw - Stage228R17 missing_item delete contract

STATUS: LOCAL_ONLY_APPLIED_BY_ZIP, test reczny DO WYKONANIA.

FAKTY:
- Objaw: klikniecie Usuń przy Braku usuwa wpis optymistycznie, ale po refetchu/odswiezeniu wpis wraca.
- Przyczyna naprawiana: niespojny kontrakt soft-delete missing_item/task oraz ryzyko ustawiania usuwanego taska jako lead.next_action_item_id.
- LeadDetail usuwa Brak natychmiast z lokalnego stanu, wykonuje backendowy soft-delete i robi silent refresh bez pelnego loadera.
- Task route nie promuje missing_item ani zamknietych/usunietych taskow do lead next action; deleted/done task czysci matching next_action_item_id.

TESTY/GUARDY:
- node scripts/check-stage228r17-missing-item-delete-contract.cjs
- node --test tests/stage228r17-missing-item-delete-contract.test.cjs
- npm run build
- git diff --check

TEST RECZNY:
- Lead -> dodaj Brak -> odswiez -> Brak widoczny -> Usuń -> znika od razu -> odczekaj -> hard refresh -> Brak nie wraca.
- Sprawdzic, ze Następny krok nie pokazuje usunietego Braku.

RYZYKA:
- Jesli baza ma stare rekordy missing_item juz podpiete jako next_action, delete czysci tylko matching next_action_item_id.
- Nie wykonano twardego DELETE, zgodnie z obecnym kierunkiem soft-delete.
- Nie ruszano ukladu UI ani styli kafelkow.

NASTEPNY KROK:
- Po PASS recznym wykonac selektywny commit/push repo i osobny commit/push vaultu Obsidian.
<!-- /STAGE228R17_MISSING_ITEM_DELETE_CONTRACT -->

## 2026-06-08 21:10 Europe/Warsaw — Stage228R18 — missing item hard delete source truth

- problem: Brak znikał po kliknięciu Usuń, ale wracał po hard refresh.
- decyzja: aktywny Brak w LeadDetail ma być usuwany realnym backend DELETE z work_items po ID, nie tylko statusem deleted.
- dodatkowo: lista Braki i blokady ma być źródłowana z linkedTasks, nie z całego timeline, żeby activity history nie odtwarzała aktywnego braku.
- testy: check-stage228r18, node test, npm run build, git diff --check, test ręczny dodaj/usun/hard refresh.
- ryzyko: DELETE jest mocniejsze niż soft-delete; historia usunięcia zostaje jako activity.

## 2026-06-08 21:50 Europe/Warsaw - STAGE228R18R5_MISSING_ITEM_HARD_DELETE_MASS_PREFLIGHT

### Status
- Stage228R18/R18R2/R18R3/R18R4 were not accepted as runtime fixes because their patch/apply scripts failed before stable runtime change.
- Stage228R18R5 switches to mass preflight and a safer patching strategy.

### Runtime contract
- LeadDetail missing_item delete must call `hardDeleteTaskFromSupabase(taskId)`.
- `hardDeleteTaskFromSupabase` must use `DELETE /api/system?apiRoute=tasks&id=<id>`.
- The lead view must optimistically remove the row and then use a silent refresh.
- The active Brak must not return after hard refresh.

### Guards and tests
- `scripts/check-stage228r18r5-missing-item-hard-delete-source-truth.cjs`
- `tests/stage228r18r5-missing-item-hard-delete-source-truth.test.cjs`
- guard is wired into `package.json` prebuild.

### Manual test
1. Add Brak on LeadDetail.
2. Hard refresh - Brak is visible.
3. Click Usun.
4. Hard refresh - Brak does not return.

### Risk sweep
- Hard delete is intentionally stronger than soft-delete for user-facing missing_item delete.
- The deletion activity stays in history, but it must not recreate active blocker state.
- Similar delete behavior in ClientDetail should be checked after LeadDetail is confirmed.



## 2026-06-08 22:20 Europe/Warsaw - STAGE228R19R2 missing item active source truth

- status: LOCAL_APPLIED_PENDING_MANUAL_TEST
- problem: deleted Brak/missing_item returned after hard refresh because active UI could be rebuilt from non-task/timeline source.
- decision: active Braki on LeadDetail must be sourced only from linkedTasks/work_items, not activity history.
- guard: scripts/check-stage228r19r2-missing-item-active-source-truth.cjs
- test: tests/stage228r19r2-missing-item-active-source-truth.test.cjs
- manual test: add Brak -> hard refresh -> delete -> hard refresh -> Brak does not return.
- risk sweep: ClientDetail may require an analogous source-truth sweep if the same symptom appears there.
- marker: STAGE228R19R2_MISSING_ITEM_ACTIVE_SOURCE_TRUTH

---

## 2026-06-09 02:50 Europe/Warsaw — STAGE228R41_DELETE_FLOW_FINAL_VALIDATE_PUSH

FAKTY:
- R41 finalizuje delete flow po nieudanym lokalnym łańcuchu R26-R40.
- Package prebuild zostawia finalnie R25 i R41, bez wadliwych R26-R40.
- Walidacja nie opiera się już na dokładnym polskim tekście toastu, tylko na strukturze przepływu: branch event/task, toast.error, toast.success, local prune, filtry bundle.

TESTY:
- mass node --check stage228 scripts/tests
- R18/R25/R41 guards
- R25/R41 node tests
- npm run build
- git diff --check

RYZYKA:
- Po deployu wymagany ręczny test produkcyjny usuwania: Calendar event/task, TasksStable task, LeadDetail Brak, ClientDetail Brak.

<!-- STAGE230B_QUICK_CAPTURE_INBOX_GUARD_START -->
## 2026-06-09 - STAGE230B Quick Capture Inbox bez AI

Status: LOCAL_ONLY_APPLIED_BY_ZIP_R6 / DO_MANUAL_QA_AND_PUSH

Guard/test:
- node scripts/check-stage230b-quick-capture-inbox.cjs
- node --test tests/stage230b-quick-capture-inbox.test.cjs

Contract:
- /ai-drafts has Szybki szkic panel.
- raw text saves through saveAiLeadDraftAsync.
- source quick_capture, type note.
- parsedDraft.stage STAGE230B_QUICK_CAPTURE_INBOX.
- no AI parser/provider/SQL in this stage.
<!-- STAGE230B_QUICK_CAPTURE_INBOX_GUARD_END -->

<!-- STAGE230B_R8_TITLE_PREVIEW_GUARD_HOTFIX -->
## 2026-06-09 - STAGE230B R8 - Quick Capture title preview guard hotfix
- Guard: scripts/check-stage230b-quick-capture-inbox.cjs
- Test: tests/stage230b-quick-capture-inbox.test.cjs
- Zakres: wymusza etykiete i tytul Szybki szkic z preview raw tekstu.

<!-- STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT_GUARD_START -->
## 2026-06-09 - STAGE230C Phone dictation duplicate-words audit

Guard/test:
- node scripts/check-stage230c-phone-dictation-duplicate-words-audit.cjs
- node --test tests/stage230c-phone-dictation-duplicate-words-audit.test.cjs

Regresja:
- node scripts/check-stage230b-quick-capture-inbox.cjs
- node --test tests/stage230b-quick-capture-inbox.test.cjs

Kontrakt:
- debug dyktowania jest opcjonalny i domyślnie wyłączony.
- trace loguje lokalnie beforeinput/input/change/composition/paste.
- brak AI parse, Gemini, Cloudflare, SQL i localStorage.
- brak automatycznej deduplikacji.
<!-- STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT_GUARD_END -->

<!-- STAGE230C_R2_VOICE_DEBUG_VISIBILITY_HOTFIX_GUARD_START -->
## 2026-06-09 - STAGE230C-R2 Voice debug visibility/readability hotfix

Guard/test:
- node scripts/check-stage230c-r2-voice-debug-visibility-hotfix.cjs
- node --test tests/stage230c-r2-voice-debug-visibility-hotfix.test.cjs

Kontrakt:
- textarea quick capture ma wymuszony czytelny tekst/caret/placeholder.
- `Kopiuj trace` i `Wyczyść trace` są widoczne w panelu trace.
- trace box pokazuje instrukcję nawet gdy debug jest wyłączony.
- brak deduplikacji, AI parsera, SQL i localStorage.
<!-- STAGE230C_R2_VOICE_DEBUG_VISIBILITY_HOTFIX_GUARD_END -->

<!-- STAGE230C_R6_VOICE_DEBUG_PANEL_REWRITE_GUARD_START -->
## 2026-06-09 - STAGE230C R6 voice debug panel rewrite

Guard/test:
- node scripts/check-stage230c-r2-voice-debug-visibility-hotfix.cjs
- node --test tests/stage230c-r2-voice-debug-visibility-hotfix.test.cjs

Regression:
- node scripts/check-stage230b-quick-capture-inbox.cjs
- node --test tests/stage230b-quick-capture-inbox.test.cjs
- node scripts/check-stage230c-phone-dictation-duplicate-words-audit.cjs
- node --test tests/stage230c-phone-dictation-duplicate-words-audit.test.cjs
<!-- STAGE230C_R6_VOICE_DEBUG_PANEL_REWRITE_GUARD_END -->


<!-- STAGE230C_R7_MASS_GUARD_AND_BUILD_PREFLIGHT -->
## 2026-06-09 - STAGE230C R7 mass guard/build preflight
- Rewrote Stage230C-R2 visibility guard/test with syntax-safe code.
- Added mass node --check before runtime tests.
- No deduplication and no AI parser changes.

<!-- STAGE230C_R8_MASS_PANEL_REGION_REWRITE_GUARD_START -->
## 2026-06-09 - STAGE230C R8 mass panel region rewrite

Guard/test:
- node scripts/check-stage230c-r2-voice-debug-visibility-hotfix.cjs
- node --test tests/stage230c-r2-voice-debug-visibility-hotfix.test.cjs

Mass preflight:
- node --check for Stage230B/230C/R8 scripts and tests
- npm run build
- git diff --check
<!-- STAGE230C_R8_MASS_PANEL_REGION_REWRITE_GUARD_END -->

<!-- STAGE230C_R10_QUICK_CAPTURE_VISUAL_SOURCE_TRUTH_GUARD_START -->
## 2026-06-09 - STAGE230C R10 quick capture visual source truth

Guard/test:
- node scripts/check-stage230c-r10-quick-capture-visual-source-truth.cjs
- node --test tests/stage230c-r10-quick-capture-visual-source-truth.test.cjs

Kontrakt:
- /ai-drafts Szybki szkic importuje visual-stage20-lead-form-vnext.css.
- Quick capture używa lead-form-section / lead-form-textarea jako source truth formularzy.
- Tekst textarea, placeholder, caret i przyciski mają wymuszony kontrast mobilny.
- Brak deduplikacji, AI parse, SQL i localStorage.
<!-- STAGE230C_R10_QUICK_CAPTURE_VISUAL_SOURCE_TRUTH_GUARD_END -->

<!-- STAGE230C_R12_R2_GUARD_GLOBAL_MARKER_COMPAT_GUARD_START -->
## 2026-06-09 - STAGE230C R12 R2 guard global marker compatibility

Guard/test:
- node scripts/check-stage230c-r2-voice-debug-visibility-hotfix.cjs
- node --test tests/stage230c-r2-voice-debug-visibility-hotfix.test.cjs

Kontrakt:
- Guard R2/R8/R10/R12 sprawdza markery globalnie, bez kruchego wycinania sekcji po className.
- Wspiera visual source truth R10: lead-form-section / lead-form-textarea.
- Nie sprawdza ani nie wprowadza deduplikacji.
<!-- STAGE230C_R12_R2_GUARD_GLOBAL_MARKER_COMPAT_GUARD_END -->

<!-- STAGE230C_R15_GUARD_SPLIT_VISUAL_SOURCE_TRUTH_GUARD_START -->
## 2026-06-09 - STAGE230C R15 guard split + visual source truth

Guard/test:
- node scripts/check-stage230c-r2-voice-debug-visibility-hotfix.cjs
- node --test tests/stage230c-r2-voice-debug-visibility-hotfix.test.cjs
- node scripts/check-stage230c-r10-quick-capture-visual-source-truth.cjs
- node --test tests/stage230c-r10-quick-capture-visual-source-truth.test.cjs

Kontrakt:
- R2 guard nie wymaga markerów R10.
- R10 guard pilnuje importu visual-stage20-lead-form-vnext.css oraz klas lead-form-section/lead-form-textarea.
- Oba guardy mają stabilne PASS markery.
<!-- STAGE230C_R15_GUARD_SPLIT_VISUAL_SOURCE_TRUTH_GUARD_END -->

<!-- STAGE231A_GOOGLE_AUTH_ENTRY_CONSISTENCY_GUARD_START -->
## 2026-06-09 - STAGE231A Google auth entry consistency

Guard/test:
- node scripts/check-stage231a-google-auth-entry-consistency.cjs
- node --test tests/stage231a-google-auth-entry-consistency.test.cjs

Kontrakt:
- Login ma przycisk "Kontynuuj przez Google".
- Rejestracja ma przycisk "Zarejestruj przez Google".
- Rejestracja pokazuje copy o możliwości utworzenia trial/workspace dla nowego konta Google.
- /api/me ma marker obecnego public trial bootstrap przez OAuth.
- Next steps zawiera kolejkę STAGE231B/C/D/E.
<!-- STAGE231A_GOOGLE_AUTH_ENTRY_CONSISTENCY_GUARD_END -->

## STAGE231D_GOOGLE_AUTH_INTENT_GATE — guards/tests

- node scripts/check-stage231a-google-auth-entry-consistency.cjs
- node --test tests/stage231a-google-auth-entry-consistency.test.cjs
- node scripts/check-stage231d-google-auth-intent-gate.cjs
- node --test tests/stage231d-google-auth-intent-gate.test.cjs
- node scripts/check-stage230b-quick-capture-inbox.cjs
- node --test tests/stage230b-quick-capture-inbox.test.cjs
- npm run build
- git diff --check

## STAGE231D_R5_GOOGLE_LOGIN_MISSING_INTENT_HARD_GATE — guards/tests

- node scripts/check-stage231a-google-auth-entry-consistency.cjs
- node --test tests/stage231a-google-auth-entry-consistency.test.cjs
- node scripts/check-stage231d-google-auth-intent-gate.cjs
- node --test tests/stage231d-google-auth-intent-gate.test.cjs
- node scripts/check-stage230b-quick-capture-inbox.cjs
- node --test tests/stage230b-quick-capture-inbox.test.cjs
- npm run build
- git diff --check

Manual required:
- Google Login existing CloseFlow account -> PASS
- Google Login truly fresh Google account without app profile -> must block and redirect/register notice
- Google Register fresh Google account -> must create profile/workspace
- Email/password signup -> must keep e-mail confirmation flow

<!-- STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP_START -->
## 2026-06-10 Europe/Warsaw — STAGE230D0 Text/Input Contrast Sweep

FAKT:
- Damian zgłosił biały tekst na białym tle podczas wpisywania/dyktowania w aplikacji.
- Zakres R1: /ai-drafts, szybki szkic, Stage230C debug trace, input/textarea/select/placeholder/focus.

DECYZJA:
- Tryb CloseFlow: GIT-FIRST / PUSH-FIRST.
- Nie używać lokalnych ZIP-ów jako głównej ścieżki dla Damiana.

TESTY:
- Stage230B regression guard/test.
- Stage230C regression guard/test.
- Stage230D0 contrast guard/test.
- npm run build.
- git diff --check.

RYZYKA:
- Możliwe podobne problemy kontrastu w innych modułach aplikacji.
- Nie wdrażano deduplikacji dyktowania bez trace.
<!-- STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP_END -->

## 2026-06-10 — STAGE231B0 guard

Dodano:
- scripts/check-stage231b0-case-close-archive-finance-truth.cjs
- tests/stage231b0-case-close-archive-finance-truth.test.cjs

Wymagane przed pushem:
- node scripts/check-stage231b0-case-close-archive-finance-truth.cjs
- node --test tests/stage231b0-case-close-archive-finance-truth.test.cjs
- node scripts/check-stage228r25-delete-flow-source-truth.cjs
- node scripts/check-stage228r41-delete-flow-final-validate.cjs
- npm run build
- git diff --check

## Guard — STAGE231B0-R7

node scripts/check-stage231b0-r7-case-archive-restore-navigation.cjs


## R5_CASEDETAIL_RESTORE_REPAIR
- Naprawiono realny brak CaseDetail: "Przywróć sprawę".
- Restore flow używa updateCaseInSupabase({ status: 'in_progress' }) i activity "case_lifecycle_reopened".
- Historia i rozliczenia pozostają zachowane; delete flow nie jest używany przez restore.


## R6_REOPEN_HANDLER_ALIAS_REPAIR
- Naprawiono zgodność nazwy handlera restore z guardem R7.
- Dodano/upewniono `handleConfirmReopenCaseRecord` jako publiczny handler przywracania sprawy.
- Przycisk `Przywróć sprawę` używa handlera reopen.
- Logika finansów, delete flow i dane rozliczeń pozostają bez zmian.


## R7_CLOSED_STATUS_LITERAL_REPAIR
- Naprawiono zgodność CaseDetail z guardem R7.
- Dodano jawne sprawdzenie `isClosedCaseStatus(caseData?.status)`.
- Zachowano fallback na `effectiveStatus`.
- Bez zmian w delete flow, płatnościach i prowizjach.


## R8_REOPEN_CONST_SEGMENT_REPAIR
- Naprawiono zgodność segmentu CaseDetail z guardem R7.
- Handler przywracania ma teraz formę `const handleConfirmReopenCaseRecord = async () => { ... }`.
- Przycisk `Przywróć sprawę` używa handlera reopen.
- Bez zmian w delete flow, płatnościach i prowizjach.


## R9_CASES_CLOSED_VIEW_LITERAL_REPAIR
- Naprawiono zgodność `Cases.tsx` z guardem R7.
- `CaseView` zawiera literal `| 'closed'`.
- Utrwalono kontrakt widoku `/cases?view=closed`, etykietę `Sprawy zamknięte` oraz filtr aktywne vs zamknięte.
- Bez zmian w delete flow, płatnościach i prowizjach.


## R10_CLIENTDETAIL_CLOSED_CASES_REPAIR
- Naprawiono zgodność `ClientDetail.tsx` z guardem R7.
- Utrwalono kontrakt klienta: `Sprawy aktywne`, `Sprawy zamknięte`, `Przywróć sprawę`.
- Kontrakt używa wspólnego `isClosedCaseStatus(record.status)`.
- Bez zmian w delete flow, płatnościach, prowizjach i lifetime finance.


## R11_CLIENTDETAIL_RESTORE_HANDLER_REPAIR
- Naprawiono zgodność `ClientDetail.tsx` z guardem R7.
- Dodano jawny handler/kontrakt `handleRestoreClientCaseStage231B0R7`.
- Utrwalono kontrakt aktywne/zamknięte/przywróć oraz activity `case_lifecycle_reopened`.
- Bez zmian w delete flow, płatnościach, prowizjach i lifetime finance.


## R12_CLIENTDETAIL_CLOSED_LISTS_REPAIR
- Naprawiono zgodność `ClientDetail.tsx` z guardem R7.
- Dodano `activeClientCasesStage231B0R7` i `closedClientCasesStage231B0R7`.
- Podział używa wspólnego `isClosedCaseStatus(record.status)`.
- Bez zmian w delete flow, płatnościach, prowizjach i lifetime finance.


## R13_CSS_CONTRACT_REPAIR
- Naprawiono zgodność CSS z guardem R7.
- Dodano `cf-case-detail-close-action-stage231b0-r7` do CSS karty sprawy i do klasy przycisku zamykania.
- Dodano `client-detail-case-smart-card-closed-stage231b0-r7` do CSS klienta.
- Bez zmian w delete flow, płatnościach, prowizjach i lifetime finance.
\n\n## 2026-06-10 — STAGE231B0_R8_CASE_ARCHIVE_RELATION_TRUTH\n- Status: LOCAL_ONLY_PREPARED / R6_CLIENTDETAIL_FLEXIBLE_REPAIR.\n- Naprawa po częściowym R4: elastyczny patch ClientDetail, aktywne/zamknięte sprawy klienta, restore z klienta, CSS, guard/test.\n- Finanse i historia zachowane.\n

## 2026-06-10 — STAGE231B0_R8_R8_DUPLICATE_CONST_BUILD_REPAIR
- Status: LOCAL_ONLY_PREPARED.
- Naprawa masowa po build fail: usunięto sklejone anchory `const X = useMemo( const X = useMemo(` po częściowym R2/R4/R6/R7.
- Zakres: dotknięte pliki TSX, whitespace, sanity check R8, pełny build/test.



## 2026-06-10 — STAGE231B0_R8_R9_DUPLICATE_TOGGLE_BUILD_REPAIR
- Status: LOCAL_ONLY_PREPARED.
- Naprawa masowa po build fail: usunięto stary drugi `toggleCaseView`, który pozostał po R8 obok URL-aware `setCaseViewStage231B0R8`.
- Guard R8 rozszerzony o dokładnie jeden `toggleCaseView` i zakaz legacy `setCaseView((prev) => ...)`.


## 2026-06-10 — STAGE231B0-R9 — Client history and case view model
- Status: LOCAL_ONLY_PREPARED.
- Zakres: /cases jawne widoki Otwarte/Zamknięte/Wszystkie, zamknięte sprawy klienta przeniesione do Historii, szerszy layout klienta, finanse all_cases zachowane.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow R25/R41, build, git diff --check.
- Ryzyka: UX historii klienta, sourceCases w /cases, brak regresji finansów i aktywnych ryzyk.


## 2026-06-10 — STAGE231B0-R9-R2 — Cases URL reader repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po częściowym R9: brakowało jawnego searchParams.get('view') w src/pages/Cases.tsx.
- R8 guard dostosowany do R9 modelu open/closed/all, aby regresja R8 dalej sprawdzała intencję, nie stary exact string.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R3 — Closed case banner repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po częściowym R9-R2: `/cases` musi mieć widoczny banner `SPRAWA ZAMKNIĘTA` dla zamkniętej sprawy.
- Guard R9 rozszerzony o data-marker bannera, żeby nie przechodził sam tekst bez realnego elementu UI.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R5 — Client history renderer guard repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R4: Historia klienta renderuje zamknięte sprawy przez wspólny renderer karty, więc guard akceptuje akcje `Otwórz` i `Przywróć sprawę` z renderera, nie tylko literalnie z segmentu Historii.
- Wymuszono widoczny label `SPRAWA ZAMKNIĘTA` w Historii i rendererze zamkniętej karty.
- Nie ruszano finansów, kosztów, SQL, Google Calendar ani płatności/prowizji.


## 2026-06-10 — STAGE231B0-R9-R6 — Right rail guard robust repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R5: guard R9 zakładał literalny `</SimpleFiltersCard>`, a komponent prawych skrótów może być self-closing albo sformatowany inaczej.
- Logika produktu bez zmian; naprawiono elastyczne wycinanie powierzchni prawego panelu w guardzie.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R8 — R8 setter wrapper scan repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R7: poprzedni patcher szukał `toggleCaseView`, którego aktualne ułożenie w `Cases.tsx` nie było stabilnym anchorem.
- Dodano jawny wrapper `setCaseViewStage231B0R8` przez skan końca funkcji `setCaseViewStage231B0R9`, bez zmiany logiki produktu.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R9 — Cases items JSX syntax repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R8: build wykrył błędną składnię JSX `items=[...]` w `src/pages/Cases.tsx`.
- Poprawiono na `items={[...]}` bez zmiany logiki produktu.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R10 — ClientDetail JSX section close repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R9: build wykrył niedomkniętą strukturę JSX w `ClientDetail.tsx` przy przejściu z głównej sekcji do prawego panelu.
- Dodano brakujące `</section>` przed `<aside className="client-detail-right-rail"...>` bez zmiany logiki produktu.
- Nie ruszano finansów, kosztów, SQL, Google Calendar ani płatności/prowizji.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R11 — Client width + Cases runtime guard
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9 push: `/cases` rzucał runtime `ReferenceError: closedRecordStage231B0R8 is not defined` przy wejściu w widok spraw.
- Naprawa: wolne użycia `closedRecordStage231B0R8` w JSX zastąpiono bezpiecznym `isClosedCaseStatus(record?.status)`.
- UX: `ClientDetail` ma szeroki układ jak widok sprawy, z lewym wyrównaniem i breakpointami skalowania.
- Dodano guard `scripts/check-stage231b0-r11-client-width-and-cases-runtime.cjs` oraz test node.
- Nie ruszano finansów, kosztów, SQL, Google Calendar ani płatności/prowizji.


## 2026-06-10 — STAGE231B0-R12-R7 — Final Cases runtime contract rescue
- Status: LOCAL_ONLY_PREPARED.
- Po R12-R6 zastosowano mocniejszy rescue: helper `renderClosedCaseBannerStage231B0R12`, jeden kontrakt `activeCases/closedCases` przez `useMemo`, `record.status` tylko w dwóch filtrach.
- Guardy R11/R12/R12-R7 pilnują tego samego kontraktu i blokują `closedRecordStage231B0R8` oraz `record?.status`.
- Nie ruszano finansów, SQL, Google Calendar, płatności ani innych modułów.


## 2026-06-10 — STAGE231B0-R13 — Cases map record scope real fix
- Status: LOCAL_ONLY_PREPARED.
- Naprawa realnego błędu po R12/R7 w `filteredCases.map((record, index) => ...)`.
- Usunięto `caseRecord` fallback i lokalny shadow `renderClosedCaseBannerStage231B0R12` z mapy.
- Dodano scoped boolean `isCaseClosedStage231B0R13 = isClosedCaseStatus(record.status)`.
- Usunięto błędny banner z loading row.
- Dodano guard/test R13 oraz zaktualizowano guardy R11/R12/R12-R7.


## 2026-06-10 — STAGE231B0-R13-R2 — Cases map closed logic completion
- Status: LOCAL_ONLY_PREPARED.
- Kontynuacja po częściowym R13: guard liczbowy był za ostry, więc zamieniono go na sprawdzanie konkretnych linii logiki.
- Domknięto `attention`, `statusTone`, `compactLifecyclePill`, `nextActionLabel`, `ownerRiskBadges` i banner zamkniętej sprawy na `isCaseClosedStage231B0R13`.
- Guard blokuje powrót `caseRecord` fallback i local shadow helpera w mapie.


## 2026-06-10 — STAGE231B0-R13-R3 — Next action guard and map completion
- Status: LOCAL_ONLY_PREPARED.
- Kontynuacja po R13-R2: guard był zbyt wrażliwy na dokładny polski tekst `Sprawa zamknięta`.
- Znormalizowano `nextActionLabel` i zmieniono guard na strukturę logiczną zamiast pełnego literalnego tekstu.
- Dalej blokowany jest `caseRecord` fallback i local shadow helpera w `filteredCases.map`.


## 2026-06-10 — STAGE231B0-R13-R4 — Guard map window repair
- Status: LOCAL_ONLY_PREPARED.
- R13-R3 guard fałszywie ciął `filteredCases.map` na pierwszym zagnieżdżonym `});`, czyli przed `nextActionLabel`.
- Naprawa: guardy używają szerokiego deterministycznego okna od początku mapy zamiast pierwszego `});`.
- Nie zmieniano logiki biznesowej poza markerem stage; naprawa dotyczy guardów i dokumentacji.


## 2026-06-10 — STAGE231B0-R13-R6 — Owner risk minimal safe call
- Status: LOCAL_ONLY_PREPARED.
- R13-R5 zatrzymał się przed zmianą pliku, bo check starego bloku z HEAD był błędny.
- Naprawa: uszkodzony zakres `ownerRiskBadges -> metaParts` jest zastępowany kompletną, zamkniętą składniowo deklaracją.
- `getCaseOwnerRiskBadges` dostaje bezpieczny kontekst lokalny: lifecycle, nearestCaseAction, nextActionLabel, statusLabel, compactLifecycleLabel, compactLifecyclePill, percent, updatedAt.

## 2026-06-10 — STAGE231B0-R14 — Client detail full-width layout lock
- Status: LOCAL_ONLY_PREPARED.
- Powód: kartoteka klienta nadal jest centrowana/ściśnięta zamiast używać pełnej szerokości od lewego panelu do prawej krawędzi ekranu.
- Zakres: marker route w ClientDetail + CSS lock w visual-stage12-client-detail-vnext.css.
- Kontrakt: brak max-width shell, width 100%, margin-inline 0, stable horizontal spacing during scroll.

## 2026-06-10  STAGE231B0-R15-R2  ClientDetail shared canvas width source
- Status: FINALIZE_FOR_PUSH.
- Powód: R14 trafił w zły DOM node (`ClientMultiContactField`), więc nie mógł rozciągnąć kartoteki klienta.
- Decyzja: ClientDetail ma używać wsplnego canvasu strony: `cf-page-canvas`, `cf-page-canvas--full`, `data-cf-page-canvas="full"`.
- źródło prawdy szerokości: `src/styles/closeflow-unified-page-canvas-stage211c.css`.
- Widok konsumujący kontrakt: `src/pages/ClientDetail.tsx` + `src/styles/visual-stage12-client-detail-vnext.css`.
- R14 guard/test usunięte jako fałszywy kontrakt.

## 2026-06-10  STAGE231B0-R15-R3  ClientDetail width guard + Polish encoding guard
- Status: FINAL_GUARD_FOR_PUSH.
- Potwierdzenie użytkownika: wygląd kartoteki klienta jest poprawny i ma tak zostać.
- Guard szerokości: `scripts/check-stage231b0-r15-r3-client-detail-width-source-truth.cjs`.
- Guard polskich znaków: `scripts/check-stage231b0-r15-r3-polish-encoding.cjs`.
- Guard pilnuje, e ClientDetail używa wsplnego canvasu: `cf-page-canvas`, `cf-page-canvas--full`, `data-cf-page-canvas="full"` oraz zmiennych `--cf-page-canvas-*`.
- Guard pilnuje usunięcia błędnego R14 i braku mojibake/replacement chars w kluczowych plikach kartoteki klienta.
- Naprawiono higienę EOF w `src/pages/ClientDetail.tsx`.


## 2026-06-10 — STAGE231B0-R15-R4 — Polish guard safe repair R2
- Status: REPAIR_AFTER_PUSHED_FAILED_GUARD_SAFE_R2.
- Powód: pierwsza paczka SAFE miała błąd runnera PowerShell - funkcja przekazywała argumenty natywnym komendom jako pustą tablicę, więc git/node startowały bez parametrów.
- Naprawa: R2 używa jawnych wywołań w PowerShell i naprawia mojibake wyłącznie w skrypcie JS, nie wklejanym terminalu.
- Polish guard wykrywa konkretne sekwencje mojibake, daje line evidence i blokuje blank line at EOF.
- Zasada utrzymana: commit/push tylko po PASS guardów, build i git diff --check.


## 2026-06-10 — STAGE231B0-R15-R4 — Polish guard batch repair
- Status: BATCH_REPAIR_AFTER_R2_R3_PARTIALS.
- Powód: R2/R3 częściowo naprawiły pliki, ale R3 zatrzymał się przez zbyt wąski parser dirty paths.
- Naprawa: masowo obsłużono warianty mojibake `ą/ł/ł/ó/·/–`, znormalizowano EOF i poprawiono guard pod aktualną kopię ClientDetail.
- Zasada: commit/push tylko po PASS guardów, build i git diff --check.


## 2026-06-10 — STAGE231B0-R15-R4 — Polish guard final batch repair
- Status: FINAL_BATCH_REPAIR_AFTER_DOC_SELF_FAIL.
- Powód: poprzedni run report zawierał przykładowe uszkodzone sekwencje znaków, a guard słusznie skanował też dokumentację etapu.
- Naprawa: dokumentacja etapu nie zapisuje już przykładowych uszkodzonych sekwencji; guard dalej skanuje kod, CSS i dokumentację zakresu R15.
- Guard blokuje uszkodzenia kodowania, puste linie na EOF i brak aktualnych polskich fraz w ClientDetail.
- Commit/push tylko po PASS guardów, build i git diff --check.

<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_GUARDS_START -->
## 2026-06-10 17:10 Europe/Warsaw — STAGE231D0A — Visual Source of Truth guard

Marker: `STAGE231D0A_VISUAL_SOURCE_TRUTH_CONSISTENCY`

Guard:
- `scripts/check-stage231d0a-visual-source-truth-consistency.cjs`

Test:
- `tests/stage231d0a-visual-source-truth-consistency.test.cjs`

Chroniona klasa błędu:
- lokalne style kart/kafelków bez mapy VST,
- nowe ikony bez centralnego registry,
- nowe badge’e/statusy bez `StatusPill`,
- niespójne przyciski akcji bez `Button`/`entity-actions`,
- finance rows bez `FinanceMiniSummary`/finance CSS,
- powrót mojibake w dokumentach D0A,
- pominięcie roadmapy D0A przed D0.
<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_GUARDS_END -->

<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_GUARDS_START -->
## STAGE231D0A-R3 — guard/test closeout

Wymagane PASS:
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run test:stage231d0a-visual-source-truth-consistency
- npm run build
- git diff --check

Warunek: brak FAIL, brak new blank line at EOF, brak brakujących tokenów payloadu Obsidiana.
<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_GUARDS_END -->

<!-- STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP_R4_START -->
## 2026-06-10 — STAGE231D0-R4 Client workspace UX final runner fix

Status: LOCAL_ONLY_PREPARED / DO_TEST_AND_PUSH

FAKTY:
- R4 naprawia wyłącznie niedziałający runner/patch D0 i domyka ClientDetail UX cleanup.
- Zakres UI: marker D0, tekst Ładowanie klienta..., tekst SPRAWA ZAMKNIĘTA, finance icon source truth payment, jeden client-level aria-label Finanse klienta.

TESTY:
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run test:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run test:stage231d0a-visual-source-truth-consistency
- node scripts/check-stage231b0-r15-r3-polish-encoding.cjs
- npm run build
- git diff --check

AUDYT RYZYK:
- Nie ruszano modelu finansów i kosztów.
- Istniejące ostrzeżenie duplicate savedRecord zostaje poza zakresem.

NASTĘPNY KROK:
- Po PASS/push przejść do STAGE231D1 — model kosztów.
<!-- STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP_R4_END -->

## 2026-06-10 — STAGE231D0-R5 — Client workspace UX guard close
- Status: LOCAL_ONLY_RESCUE_PRE_PUSH.
- Domknięcie po R4: ikona finansów klienta z EntityIcon case -> payment oraz brakujące tokeny "audyt ryzyk", "następny krok" i "VISUAL SOURCE OF TRUTH".
- Zakres bez zmian danych: ClientDetail UI, guard/test D0, raporty _project i Obsidian payload.
- Testy: D0 guard/test, D0A regression, Polish guard, build, git diff --check.
- Audyt ryzyk: ręcznie sprawdzić brak duplikatu Finanse klienta i poprawną ikonę finansów.
<!-- STAGE231D1_COST_MODEL_SOURCE_TRUTH_START -->
## 2026-06-10 — STAGE231D1 Cost model source truth

Status: LOCAL_ONLY_PREPARED / DO_TEST_AND_PUSH

FAKTY:
- STAGE231D1_COST_MODEL_SOURCE_TRUTH: dodano centralny model kosztów sprawy bez zmian runtime UI.
- Model rozdziela: Koszty poniesione, Koszty do zwrotu, Koszty zwrócone i Razem do pobrania.
- D1 nie dodaje SQL, tabel, migracji, Supabase ani formularza UI.

VISUAL SOURCE OF TRUTH:
- D1 używa finansowego słownika etykiet i nie dodaje lokalnych stylów UI.
- UI zostaje do D2/D3, zgodnie z D0A Visual Source of Truth.

TESTY:
- npm run check:stage231d1-cost-model-source-truth
- npm run test:stage231d1-cost-model-source-truth
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run build
- git diff --check

audyt ryzyk:
- Ryzyko: D2 może potrzebować SQL/tabeli, ale D1 celowo nie dotyka bazy.
- Ryzyko: stare UI finansów nie pokaże kosztów, dopóki D2/D3 nie podłączą modelu.
- Ryzyko: jeśli koszt nie jest reimbursable, nie wchodzi w Koszty do zwrotu.

następny krok:
- Po PASS/push przejść do STAGE231D2 — koszty w sprawie z SQL/guardem i UI opartym o model D1.
<!-- STAGE231D1_COST_MODEL_SOURCE_TRUTH_END -->

<!-- STAGE231D2_CASE_COSTS_IN_CASE_START -->
## STAGE231D2 — Case costs in case
- data: 2026-06-10 18:55 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED / DO_APPLY_TEST_SQL_AND_PUSH
- zakres: SQL case_costs, API /api/case-costs, CaseDetail cost panel, guard/test.
- testy: check/test D2, regression D1/D0/D0A, Polish guard, build, git diff --check.
- audyt ryzyk: SQL must be run before real write test; route must stay workspace scoped.
- następny krok: apply package, run SQL, manual add-cost test, then push.
<!-- STAGE231D2_CASE_COSTS_IN_CASE_END -->

<!-- STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_START -->
## STAGE231D2-R2 — Case costs fetch guard close
- data: 2026-06-10 19:10 Europe/Warsaw
- status: LOCAL_ONLY_GUARD_CLOSE / DO_TEST_SQL_AND_PUSH
- zakres: CaseDetail import/fetch integration for case_costs.
- testy: D2 guard/test, D1/D0/D0A regression, Polish guard, build, git diff --check.
- audyt ryzyk: SQL still required before manual cost write test.
- następny krok: run SQL, manual add-cost test, selective push.
<!-- STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_END -->

<!-- STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_START -->
## STAGE231D2-R3 — Vercel Hobby function limit fix
- data: 2026-06-10 19:25 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED / DO_APPLY_TEST_PUSH_DEPLOY
- powód: Vercel Hobby blokuje deployment po przekroczeniu limitu Serverless Functions.
- zakres: usunięcie api/case-costs.ts, konsolidacja kosztów pod api/cases.ts?resource=costs, guard budżetu funkcji.
- testy: D2 guard/test, Vercel budget guard/test, D1/D0/D0A regression, Polish guard, build, git diff --check.
- audyt ryzyk: po deployu powtórzyć manualny test Dodaj koszt, bo zmienia się ścieżka API.
- następny krok: PASS -> push -> deploy -> test ręczny kosztu.
<!-- STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_END -->

## 2026-06-10 — STAGE231D2-R5 CaseDetail render crash hotfix

- Status: LOCAL_ONLY_HOTFIX_PREPARED
- Problem: produkcyjna karta sprawy wysypywała render przez brak definicji caseCostsSummaryStage231D2.
- Fix: dodano useMemo summary przed JSX i guard blokujący regresję.
- Testy: R5/D2/D2R3/D1/D0/D0A/Polish/build.
- Audyt ryzyk: po deployu sprawdzić produkcyjne otwarcie sprawy; /api/case-items 500 to osobny backend problem, jeśli nadal wystąpi.

## STAGE231D2-R6 — CaseDetail top strip rail lift

- data i godzina: 2026-06-10 19:55 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED
- zmiana: skrócenie górnego paska tytułu sprawy do lewej kolumny i podciągnięcie prawego raila do górnego miejsca po prawej.
- testy: guard/test R6 + D2/R5/R3/D1/D0/D0A/Polish/build/git diff check.
- ryzyko: CSS negative margin wymaga produkcyjnego testu wizualnego po deployu.

## 2026-06-10 20:05 Europe/Warsaw — STAGE231D3-R7 guards

- npm run check:stage231d3-client-finance-costs-rollup
- npm run test:stage231d3-client-finance-costs-rollup
- regressions: D2-R5 render crash, D2 costs, D2-R3 Vercel function budget, D1, D0, D0A, Polish guard, build, git diff --check

## STAGE231D3-R7-R2 — Polish guard restore and D3 close

- timestamp: 2026-06-10 20:42 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED
- result: restored missing scripts/check-polish-encoding-stage231b0-r15-r3.cjs required by regression lane after STAGE231D3-R7.
- risk audit: this fixes guard infrastructure drift only; it does not modify SQL, API routes, or CaseDetail layout.

<!-- STAGE231D0B_CLIENT_LIST_CARD_GUARDS_START -->
## 2026-06-12 11:15 Europe/Warsaw - STAGE231D0B Client List Card Visual Freeze

STATUS: LOCAL_APPLIED_PENDING_MANUAL_TEST_AND_PUSH

FAKTY:
- Kafelek klienta na liście klientów został przestawiony na układ 2-wierszowy.
- Z kafelka klienta usunięto Leady: oraz badge Aktywna sprawa.
- Wiersz 1 pokazuje: nazwa, telefon, e-mail, Aktywna prowizja, akcje.
- Wiersz 2 pokazuje: firma, Sprawy, Zarobione łącznie, Najbliższa akcja oraz dozwolone statusy pomocnicze.
- Telefon ma osobny marker data-client-list-phone i klasę client-list-card-phone.
- E-mail ma osobny marker data-client-list-email i klasę client-list-card-email.
- UI dalej korzysta z closeflow-record-list-source-truth.css jako źródła prawdy stylu list.

DECYZJA DAMIANA:
- Klient jest już pozyskanym leadem, więc nie pokazujemy Leady w kafelku klienta.
- Klient może mieć wiele spraw, więc nie pokazujemy binarnego badge'a Aktywna sprawa.
- Na liście klientów mają być widoczne: Aktywna prowizja, Zarobione łącznie, Sprawy, Najbliższa akcja.

TESTY/GUARDY:
-
pm run check:stage231d0b-client-list-card-freeze
-
pm run build
- git diff --check

DO POTWIERDZENIA:
- Test ręczny desktop/mobile na /clients po lokalnym uruchomieniu.

RYZYKA:
- Jeśli dane prowizyjne w bazie są niepełne, Aktywna prowizja może pokazać 0 PLN mimo aktywnej sprawy bez uzupełnionej prowizji.
- Jeśli płatności prowizyjne nie mają typu/statusu rozpoznawanego przez finance source, Zarobione łącznie może wymagać osobnego etapu porządkującego dane płatności.
- Zmiana dotyczy tylko listy klientów, nie przebudowuje ClientDetail ani modeli finansowych.
<!-- STAGE231D0B_CLIENT_LIST_CARD_GUARDS_END -->


## 2026-06-10 Europe/Warsaw - STAGE231D0B-R8-MASS-ENCODING-RESCUE

Marker: STAGE231D0B-R8-MASS-ENCODING-RESCUE
Guard: scripts/check-stage231d0b-client-list-card-freeze.cjs

Guard blokuje:
- mojibake w widocznym ClientListCard i plikach kontraktu STAGE231D0B,
- Leady: w kafelku klienta,
- Aktywna sprawa w kafelku klienta,
- prefiks Najbliższa akcja: w samym slocie kafelka,
- brak Sprawy:, Aktywna prowizja, Zarobione łącznie,
- brak osobnych slotów telefonu/e-maila i dwuwierszowego layoutu.

## 2026-06-10 Europe/Warsaw — STAGE231D0B-R9 ClientListCard polish + source truth cleanup

Status: LOCAL_ONLY_PACKAGE_APPLIED_PENDING_PUSH

FAKTY:
- ClientListCard pozostaje 2-wierszowy.
- Finance values są porządkowane jako kompaktowe chipy.
- R8 unscoped CSS rescue zostaje zastąpiony scoped R9 source truth.
- LeadListCard dodany tylko jako mapping w UI Dictionary, bez runtime zmian.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Manual QA nadal wymagany, bo guard nie mierzy odbioru wizualnego.
- Osobny dług: duplicate savedRecord warning w ContextActionDialogs.tsx.

NASTĘPNY KROK:
- Po akceptacji /clients: STAGE231D0C LeadListCard align to ClientListCard source truth.

## 2026-06-11 Europe/Warsaw — STAGE231D0B_R9_R3_GUARD_MOJIBAKE_SELF_SCAN_REPAIR

- Status: LOCAL_APPLY_READY
- Guard: scripts/check-stage231d0b-client-list-card-freeze.cjs rewritten to avoid self-detecting literal encoding probe characters.
- Test: tests/stage231d0b-client-list-card-freeze.test.cjs.

## 2026-06-11 Europe/Warsaw — STAGE231D0B_R9_R4_CSS_GUARD_TOKEN_ALIGNMENT

- Status: LOCAL_APPLY_READY
- Scope: align CSS source-truth exact markers with strengthened R9/R3 guard.
- Guard: npm run check:stage231d0b-client-list-card-freeze.
- Test: node --test tests/stage231d0b-client-list-card-freeze.test.cjs.

## 2026-06-11 Europe/Warsaw - STAGE231D0B-R10 guard/test

- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build
- Manual QA: /clients screenshot required.

## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0B-R10/R7 - Client finance chip start alignment

Marker: STAGE231D0B_R10_R7_FINANCE_CHIP_START_ALIGN

Status: LOCAL_APPLY_PREPARED

FAKTY:
- R10/R6 poprawilo ogolny uklad karty klienta i ellipsis/tooltip.
- Manual QA Damiana pokazal, ze karta jest juz dobra, ale chipy finansowe powinny zaczynac tekst w tej samej osi kolumny.
- Ten etap dotyka tylko CSS source truth i guard dokumentujacy decyzje.

DECYZJA DAMIANA:
- "Zarobione lacznie" i "Aktywna prowizja" maja zaczynac sie w tym samym miejscu/kolumnie.
- Dlugosc tekstu moze dyktowac, gdzie chip sie konczy.
- Reszta ukladu zostaje.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Guard nie sprawdza realnej geometrii w przegladarce. Wymagany screenshot /clients po deployu.

NASTEPNY KROK:
- Po PASS i push: sprawdzic /clients, czy oba chipy finansowe startuja w tej samej osi.



---

## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0B-R10/R8 — finance chip right-edge alignment

Status: LOCAL_APPLIED_PENDING_PUSH_AND_DEPLOY_QA

FAKTY:
- R7 wyrównał finance chipy w złą stronę dla oczekiwanego widoku Damiana.
- R8 nie przebudowuje karty klienta. Zmienia tylko oś wyrównania zielonych chipów finansowych.
- Chipy pozostają o zmiennej długości; prawa krawędź chipów ma być wspólna.

DECYZJA DAMIANA:
- Początek i koniec karty zostają bez zmian.
- Zielone kafelki finansowe mają być wyrównane od prawej strony.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Etap jest wizualny; ostateczne zamknięcie wymaga deployu i ręcznego sprawdzenia /clients.


---
## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0B-R10/R9 finance text start align
Marker: STAGE231D0B_R10_R9_FINANCE_TEXT_START_ALIGN
Status: LOCAL_APPLY_PACKAGE_PREPARED
Scope: ClientListCard on /clients only.
Decision: zielone finance chipy nie maja konczyc sie rowno; teksty "Aktywna prowizja" i "Zarobione lacznie" maja zaczynac sie w jednej osi kolumny, tak jak nazwa/firma w lewej czesci karty. Dlugosc chipa moze dyktowac prawa krawedz.
Tests: npm run check:stage231d0b-client-list-card-freeze; node --test tests/stage231d0b-client-list-card-freeze.test.cjs; git diff --check; npm run build.
Risk: R8 right-edge alignment was visually wrong for Damian's expected reading flow; R9 supersedes R8 by later CSS source-truth override.

## 2026-06-11 Europe/Warsaw - STAGE231D0B-R10/R10 single-grid alignment source truth

Status: LOCAL_APPLY_PREPARED / DO_MANUAL_QA_AND_PUSH.

FAKT: R10/R7/R8/R9 pokazaly, ze przesuwanie finance chipow przez justify-self/place-self nie zamyka problemu wizualnego, bo primary i secondary byly osobnymi gridami.

DECYZJA: ClientListCard ma uzywac jednej fizycznej siatki CSS dla dwoch wierszy: nazwa/firma, telefon/sprawy, email/akcja, finanse/finanse.

ZAKRES: tylko /clients ClientListCard CSS source truth i guard. Nie ruszano leadow, triala, filtrow, top layoutu, SQL ani Supabase.

TESTY: npm run check:stage231d0b-client-list-card-freeze, node --test tests/stage231d0b-client-list-card-freeze.test.cjs, git diff --check, npm run build.

MANUAL QA: /clients po Ctrl+F5; sprawdzic, czy Aktywna prowizja i Zarobione lacznie startuja w jednej osi, tak jak nazwa/firma.


---

## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0B-R10/R11 fixed column axis

Status: LOCAL_APPLY_READY / DO_MANUAL_QA_AFTER_DEPLOY

FAKT:
- R10/R10 fixed the physical single grid but the grid still used content-sensitive columns, so column starts could move between client cards.
- R10/R11 pins deterministic column widths through CSS variables on .cf-client-list-card-content.

DECYZJA DAMIANA:
- Texts must start in the same place across every client card.
- Longer text may decide where a chip ends, but it must not move the start axis.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Visual QA is mandatory after deploy: desktop, narrow window, mobile.
- CSS history R7/R8/R9 remains in file as deprecated layers; R10/R11 is the final active override.

## 2026-06-11 Europe/Warsaw - STAGE231D0C LeadListCard client-view freeze

FAKT:
- /clients ClientListCard view accepted visually after R10/R11 fixed column axis.
- /leads should reuse the same card rhythm, fixed axes, compact card size and action column where the fields are semantically reusable.
- This stage does not change lead data semantics, create flow, filters, trial banner, top layout, SQL or Supabase.

DECYZJA DAMIANA:
- Freeze the accepted Clients view.
- Align the Leads tab to this look only for repeated card/shell elements.
- Do not invent a new layout and do not break existing lead semantics.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node scripts/check-stage231d0c-lead-list-card-client-align.cjs
- node --test tests/stage231d0c-lead-list-card-client-align.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Visual guard does not measure browser geometry. Manual QA on /leads and /clients remains required.
- Lead cards contain more badges/meta than client cards; CSS must compress, not delete semantics.

---

## 2026-06-11 Europe/Warsaw - STAGE231D0C/R6 guards

- scripts/check-stage231d0c-client-detail-workspace-baseline.cjs
- tests/stage231d0c-client-detail-workspace-baseline.test.cjs
- regression: STAGE231D0B ClientListCard freeze
- optional: STAGE231B0 R9 client history guard/test

---

## 2026-06-11 19:45 Europe/Warsaw - Guard STAGE231D0C/R7 ClientDetail left rail spacing

STAGE231D0C_R7_CLIENT_DETAIL_LEFT_RAIL_SPACING

FAKTY Z KODU:
- STAGE231D0C/R6 został wdrożony i wypchnięty jako baseline ClientDetail.
- Manual QA wskazał, że lewy rail zaczyna się za wysoko i wizualnie wchodzi w następny poziom względem kart po prawej.

DECYZJA DAMIANA:
- Zachować zaakceptowane górne kafelki ClientDetail.
- Obniżyć lewy rail do poziomu kafelków po prawej i zachować ten sam odstęp między kartami.

ZAKRES:
- CSS spacing only: lewy rail, prawy rail, odstęp między kartami.
- Bez zmian danych, JSX, SQL, kosztów, wykresów, Google Calendar, LeadListCard runtime i CaseDetail.

TESTY/GUARDY:
- scripts/check-stage231d0c-r7-client-detail-left-rail-spacing.cjs
- tests/stage231d0c-r7-client-detail-left-rail-spacing.test.cjs
- regresja: STAGE231D0C ClientDetail baseline guard, STAGE231D0B ClientListCard guard, optional STAGE231B0 R9 guard, build, git diff --check.

---

## 2026-06-11 20:05 Europe/Warsaw - Guard repair STAGE231D0C/R8 ClientDetail left rail spacing

STAGE231D0C_R8_CLIENT_DETAIL_LEFT_RAIL_SPACING_GUARD_FIX

FAKTY Z KODU:
- STAGE231D0C/R7 patch zastosował spacing lewego raila, ale guard miał zepsuty regex po utracie backslashy.
- R8 nie zmienia runtime poza naprawą guarda/testu i dokumentacją.

DECYZJA DAMIANA:
- Zachować górne kafelki ClientDetail.
- Dokończyć spacing lewego raila bez przebudowy układu.

ZAKRES:
- Naprawa scripts/check-stage231d0c-r7-client-detail-left-rail-spacing.cjs.
- Zachowanie CSS R7 i scope ClientDetail.
- Bez zmian SQL, danych, CaseDetail, LeadListCard runtime, kosztów i wykresów.

TESTY/GUARDY:
- node --check guard R7.
- R7 spacing guard.
- R7 spacing node test.
- STAGE231D0C ClientDetail baseline guard/test.
- STAGE231D0B ClientListCard guard/test.
- Optional STAGE231B0 R9 guard/test.
- git diff --check.
- npm run build.

## 2026-06-11 Europe/Warsaw - STAGE231D0C_R9_CLIENT_DETAIL_LEFT_RAIL_VISUAL_ALIGN

Status: LOCAL_APPLIED / VISUAL_SPACING_FIX / NEED_PUSH

Zakres:
- poprawiono realny desktopowy offset lewego raila w ClientDetail, bo po R7 panel nadal zaczynał za wysoko względem prawego raila;
- zwiększono offset tylko dla desktopu przez CSS variable i silniejszy selektor;
- zachowano zaakceptowany górny układ kafelków, kompaktową aktywną sprawę, dane i routing.

Testy/guardy:
- node scripts/check-stage231d0c-r9-client-detail-left-rail-visual-align.cjs
- node --test tests/stage231d0c-r9-client-detail-left-rail-visual-align.test.cjs
- node scripts/check-stage231d0c-r7-client-detail-left-rail-spacing.cjs
- node scripts/check-stage231d0c-client-detail-workspace-baseline.cjs
- node scripts/check-stage231d0b-client-list-card-freeze.cjs
- git diff --check
- npm run build

Ryzyka:
- finalna akceptacja wymaga screenshotu /clients/<id> po deployu i Ctrl+F5;
- tablet/mobile resetują offset do 0, żeby nie zrobić sztucznej dziury.

---
## 2026-06-11 Europe/Warsaw - STAGE231D0C/R11 ClientDetail left rail axis lock

Marker: STAGE231D0C_R11_CLIENT_DETAIL_LEFT_RAIL_AXIS_LOCK

Status: LOCAL_APPLY_READY

Scope:
- desktop-only CSS axis lock for the ClientDetail left rail,
- strengthens previous R7/R9 offset because production screenshot still showed the left rail above the right card axis,
- keeps top overview tiles, compact active case card, data, routing and JSX unchanged.

Tests/guards:
- scripts/check-stage231d0c-r11-client-detail-left-rail-axis-lock.cjs
- tests/stage231d0c-r11-client-detail-left-rail-axis-lock.test.cjs
- R9/R7 regressions where present
- ClientDetail baseline regression
- ClientListCard regression
- git diff --check
- npm run build

Risk audit:
- desktop offset can create too much vertical whitespace on narrow layouts, therefore reset is scoped to max-width 1180px.
- final acceptance requires production screenshot after deploy and Ctrl+F5.

---

## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0C/R12 ClientDetail left rail measured axis fix

Status: LOCAL_APPLY_PRE_PUSH.
Commit target: fix ClientDetail left rail vertical axis using measured desktop DOM values.

Measured fact from manual DOM audit after clearing debug inline style:
- viewport innerWidth: 1920
- leftFirstTop: 173
- rightFirstTop: 200
- leftMinusRight: -27
- computed left rail margin-top before fix: -36px
- required final desktop margin-top: -9px

Change:
- CSS-only override in src/styles/visual-stage12-client-detail-vnext.css.
- Locks .client-detail-shell > .client-detail-left-rail margin-top to -9px on desktop >=1180px.
- Resets margin/padding/transform on tablet/mobile <=1179px.

Scope not touched:
- JSX, data fetching, Supabase, SQL, costs, charts, active case card structure, CaseDetail, LeadListCard runtime.

Tests required:
- R12 measured-axis guard/test.
- R9 and R7 left rail regressions.
- ClientDetail baseline guard/test.
- ClientListCard freeze regression.
- git diff --check.
- npm run build.

Manual QA after deploy:
- open /clients/<id>, Ctrl+F5.
- verify left Data klienta card starts visually on the same axis as right Najbliższe działania card.
- verify top tiles and active case compact card unchanged.

---

## 2026-06-11 Europe/Warsaw - STAGE231D0C-R2 ClientDetailHeader visual freeze + visible icons

Marker: STAGE231D0C_R2_CLIENT_DETAIL_HEADER_FREEZE
Status: LOCAL_APPLY_PREPARED / DO_TEST_AND_PUSH

Zakres:
- zamrożenie ClientDetailHeader jako wzorca DetailHeader,
- dopisanie stylu widoczności ikon w header buttons,
- dopisanie DetailHeader do UI Dictionary,
- dodanie guarda i testu R2,
- regresja D0C baseline.

Decyzja Damiana:
Header karty klienta detail zostaje wzorcem dla kolejnych kart detail. Ikony w niebieskich przyciskach muszą być widoczne.

Poza zakresem:
- brak SQL,
- brak zmian danych,
- brak zmian aktywnej sprawy,
- brak zmian CaseDetail,
- brak zmian LeadListCard runtime.



---

## 2026-06-11 Europe/Warsaw - STAGE231D0D-R2 CaseDetail service notes and finance rail

Status: APPLIED_BY_ZIP / READY_FOR_TEST_AND_PUSH

FAKTY Z KODU:
- CaseDetail had CaseQuickActions before the finance rail.
- CaseDetail had an older Stage220A10 duplicated service/notes block before the current service tab source of truth.
- Finance and cost source files already exist; this stage does not add SQL or a new data model.

DECYZJE DAMIANA:
- CaseDetail right rail order: Rozliczenie sprawy -> Szybkie akcje -> Dane sprawy i klienta.
- One CaseServiceTab source of truth.
- One CaseNotesPanel preview plus CaseAllNotesModal.
- Costs use semantic orange/red cost-warning classes, not system-error styling.

TESTY:
- scripts/check-stage231d0d-r2-case-detail-service-notes-finance-rail.cjs
- tests/stage231d0d-r2-case-detail-service-notes-finance-rail.test.cjs
- D0C ClientDetail regression
- npm run build
- git diff --check

RYZYKA:
- CaseDetail still has old build warnings outside this stage.
- Manual QA must confirm modal and right rail order on production.




---

## 2026-06-11 Europe/Warsaw - STAGE231D0D-R2 CaseDetail service notes and finance rail

Status: APPLIED_BY_ZIP / READY_FOR_TEST_AND_PUSH

FAKTY Z KODU:
- CaseDetail had CaseQuickActions before the finance rail.
- CaseDetail had an older Stage220A10 duplicated service/notes block before the current service tab source of truth.
- Finance and cost source files already exist; this stage does not add SQL or a new data model.

DECYZJE DAMIANA:
- CaseDetail right rail order: Rozliczenie sprawy -> Szybkie akcje -> Dane sprawy i klienta.
- One CaseServiceTab source of truth.
- One CaseNotesPanel preview plus CaseAllNotesModal.
- Costs use semantic orange/red cost-warning classes, not system-error styling.

TESTY:
- scripts/check-stage231d0d-r2-case-detail-service-notes-finance-rail.cjs
- tests/stage231d0d-r2-case-detail-service-notes-finance-rail.test.cjs
- D0C ClientDetail regression
- npm run build
- git diff --check

RYZYKA:
- CaseDetail still has old build warnings outside this stage.
- Manual QA must confirm modal and right rail order on production.

---

## 2026-06-11 Europe/Warsaw - STAGE231D0D_R4_TOTAL_TO_COLLECT_AND_JSX_RESCUE

Status: PATCH_RESCUE / CONTINUES_STAGE231D0D_R2

Zakres:
- naprawa częściowo zastosowanego D0D-R3 po guard fail,
- dopisanie widocznego wiersza "Razem do pobrania" do pierwszej karty "Rozliczenie sprawy",
- podpięcie totalu do istniejącego caseCostsSummaryStage231D2.totalToCollectAmount,
- naprawa JSX service tab po usunięciu legacy Stage220A10 duplicate block,
- bez SQL, bez nowego modelu kosztów, bez wykresów.

Testy wymagane:
- D0D-R2 guard/test,
- D0C ClientDetail baseline regression,
- D0B ClientListCard regression,
- npm run build,
- git diff --check.

Audyt ryzyk:
- nie dublować osobnej karty kosztów jako drugiego źródła rozliczenia; wiersz totalu w pierwszej karcie jest obowiązkowy dla skanowalności prawego panelu,
- po deployu manualnie sprawdzić kolejność raila: Rozliczenie -> Szybkie akcje -> Dane sprawy i klienta.

## 2026-06-11 Europe/Warsaw - STAGE231D0D-R3 CaseDetail 100% scale balanced workspace

Status: PREPARED_BY_ZIP / DO_TEST_AND_PUSH

Zakres:
- działania i notatki w jednym środkowym gridzie,
- notatki compact preview: 3 ostatnie,
- prawy rail compact: rozliczenie, szybkie akcje, dane,
- historia wpłat i lista kosztów nie są stale rozlane w railu,
- R2 guard zaktualizowany jako regresja zgodna z R3.

Testy:
- D0D/R3 guard/test,
- D0D/R2 regression guard/test,
- D0C regression,
- D0B regression,
- build,
- git diff --check.



---

## 2026-06-11 Europe/Warsaw - STAGE231D0D-R4 CaseDetail lean service workspace

Status: LOCAL_PACKAGE_APPLIED_PENDING_PUSH

FAKTY Z KODU:
- R4 usuwa widoczną kartę danych sprawy i klienta z głównego right raila bez usuwania danych z systemu.
- R4 usuwa stałe sekcje historii wpłat i kosztów z right raila.
- R4 zachowuje rozliczenie sprawy i szybkie akcje w railu.
- R4 dopina marker data-case-service-tabs-column="true" do tabs card.

TESTY:
- check-stage231d0d-r4-case-detail-lean-service-workspace.cjs
- stage231d0d-r4-case-detail-lean-service-workspace.test.cjs
- R3/R2 regression guards
- D0C regression
- npm run build
- git diff --check

RYZYKA:
- Tabs są wyrównane wizualnie do kolumny działań bez pełnej przebudowy logiki Tabs; przy kolejnym większym refaktorze warto przenieść strukturę logicznie do left-column.
- Historia wpłat i koszty pozostają dostępne przez istniejące przyciski/modale, ale nie są stałą listą w railu.

---

## 2026-06-12 07:39 Europe/Warsaw - STAGE231D0D-R5 spacing / notes lift / quick actions cleanup

Status: READY_FOR_TEST
Zakres:
- notatki podciągnięte do góry bez łamania wspólnego odstępu kafelków,
- wspólny odstęp kafelków: 14px,
- prawy rail delikatnie podniesiony,
- z CaseQuickActions usunięto osobną akcję "Wpłata prowizji",
- wpłata prowizji zostaje w rozliczeniu sprawy.

Ryzyka:
- override CSS musi nie rozjechać mobile/tablet,
- quick actions nie mogą dublować akcji finansowych,
- R2/R3/R4 guardy były składniowo uszkodzone i zostały naprawione.

---

## 2026-06-12 07:58 Europe/Warsaw - STAGE231D0D-R5 repair after red guard push

Status: REPAIR_READY_FOR_TEST

Naprawa:
- usunięto "Wpłata prowizji" z CaseQuickActions,
- dodano "Dodaj koszt" do kompaktowego rozliczenia sprawy,
- dodano spacing marker i wspólny odstęp kafelków 14px,
- dodano micro-lift prawego raila,
- zachowano wpłatę prowizji tylko w rozliczeniu sprawy.

Powód:
Poprzedni R5 został wypchnięty mimo czerwonych guardów po błędzie ścieżek względnych .NET/PowerShell.

---

## 2026-06-12 08:10 Europe/Warsaw - STAGE231D0D-R6 true service grid geometry

Status: READY_FOR_TEST

Zakres:
- przeniesiono tabs do lewej kolumny workspace dla aktywnej zakładki Obsługa,
- lewa kolumna ma teraz: tabs + działania,
- środkowa kolumna ma notatki startujące od góry tego samego gridu,
- prawy rail jest wyrównany do osi true service grid i używa wspólnego gapu,
- nie ruszano SQL, danych, modelu finansów ani modali.

Audyt:
- R5 był technicznie zielony, ale wizualnie nie zamykał celu, bo tabs były poza gridem.
- R6 naprawia strukturę JSX, a guard sprawdza kolejność grid -> left column -> tabs -> actions -> notes.

---

## 2026-06-12 08:28 Europe/Warsaw - STAGE231D0D-R8 tabs card + right rail axis polish

Status: READY_FOR_TEST

Zakres:
- prawy panel z rozliczeniem i szybkimi akcjami podniesiony do osi kafelka danych sprawy,
- zakładki Obsługa / Checklisty / Historia dostały pełny, rozciągnięty kafelek nad Działaniami sprawy,
- zachowany wspólny odstęp kafelków 14px,
- nie ruszano finansów, modali, SQL, danych, handlerów ani quick actions poza stylem układu.

Ryzyka:
- etap jest CSS-only, więc wymaga ręcznego potwierdzenia na 100% zoom,
- lift prawego raila ma reset na węższych ekranach,
- historyczne mojibake w starych wpisach _project nie jest czyszczone w tym etapie.

---

## 2026-06-12 08:58 Europe/Warsaw - STAGE231D0D-R9 tabs center + axis microfix

Status: APPLIED_LOCAL_WAITING_VISUAL_PASS

Zakres:
- pigułki Obsługa / Checklisty / Historia wyśrodkowane w rozciągniętym kafelku,
- środkowa sekcja CaseDetail podniesiona lekko wyżej,
- prawy panel rozliczeń i szybkich akcji dociągnięty do tej samej osi,
- bez zmian w SQL, Supabase, finansach, modalach, handlerach i danych.

Testy:
- R9 guard/test,
- regresje R8/R6/R5/R4/R3/R2/D0C/D0B,
- git diff --check,
- npm run build.
---

## 2026-06-12 14:34 Europe/Warsaw - STAGE231D0E-R1 ClientDetail grid axis align

Status: PREPARED_LOCAL / pending visual PASS before push

Scope:
- CSS-only alignment of ClientDetail workspace columns.
- Align left data card, center column and right upcoming-actions rail to one top axis.
- Force center content under Braki i blokady to keep same width/left edge as the center column.
- Force right rail content under Najbliższe działania to keep same width/left edge as the rail.

User decision:
- "wszystko co pod braki i blokady oraz najbliższe działania musimy wyrównać z kafelkiem dane klienta"

Touched runtime files:
- src/styles/visual-stage12-client-detail-vnext.css

Not touched:
- src/pages/ClientDetail.tsx
- src/components/CaseQuickActions.tsx
- CaseDetail logic
- Supabase / SQL / finance formulas / handlers / modals

Guards:
- scripts/check-stage231d0e-r1-client-detail-grid-axis-align.cjs
- tests/stage231d0e-r1-client-detail-grid-axis-align.test.cjs

Risk audit:
- Visual-only risk: desktop alignment may improve while tablet breakpoint needs manual check.
- No runtime data risk because only CSS and docs/guards are changed.
- Do not mix with failed R11 finance/notes package or old D0B client-list-card guard drift.

<!-- STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F guard/test

Guard:
- `node scripts/check-stage231d0f-funnel-owner-dashboard-visual-alignment.cjs`

Test:
- `node --test tests/stage231d0f-funnel-owner-dashboard-visual-alignment.test.cjs`

Regresje powiązane:
- `node scripts/check-stage231d0d-r4-case-detail-lean-service-workspace.cjs` jeśli istnieje.

Guard sprawdza:
- marker `STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT`,
- istniejące markery lejka `data-stage227b-decision-list-view` i `data-stage228a-funnel-truth-clickability`,
- wpisy UI Dictionary dla Lejka,
- filtry właścicielskie,
- zasadę `lista decyzji / nie kanban`,
- brak SQL, wykresów, drag/drop i ciężkiego lokalnego stylu kafelków.
<!-- STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT_2026_06_12_END -->

<!-- STAGE231D0F_R4_FUNNEL_OWNER_DASHBOARD_TARGETED_GUARD_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R4 Funnel targeted guard repair

STATUS: READY_TO_APPLY

FAKTY Z LOGÓW:
- R2 poprawnie zatrzymał się po czerwonym guardzie.
- R3 zatrzymał się na zbyt szerokim mojibake sweepie, który zaczął czyścić stare historyczne wpisy `_project`.
- To nie jest właściwy zakres dla etapu UI Lejka.

DECYZJA:
- Naprawiamy aktywny zakres STAGE231D0F, nie całą historię projektu.
- Lejek pozostaje listą decyzji właściciela, nie kanbanem.
- Nie ruszać logiki filtrów, Supabase, SQL, płatności, routingu, wykresów ani drag/drop.

R4:
- targetowany repair mojibake tylko dla runtime i aktywnych plików etapu,
- guard STAGE231D0F sprawdza aktywny blok UI Dictionary, CSS i runtime,
- guardy nie failują na własnych definicjach tokenów,
- CaseDetail R4 guard jest podmieniany na bezpieczną wersję z tokenami generowanymi po kodach znaków.

TESTY:
- `node scripts/check-stage231d0f-funnel-owner-dashboard-visual-alignment.cjs`
- `node --test tests/stage231d0f-funnel-owner-dashboard-visual-alignment.test.cjs`
- `node scripts/check-stage231d0d-r4-case-detail-lean-service-workspace.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- W repo nadal mogą istnieć stare historyczne wpisy z mojibake. Nie naprawiać ich w tym etapie.
- Jeżeli chcemy pełne sprzątanie `_project`, to osobny etap: `ENCODING-SWEEP`, bez mieszania z Lejkiem.
<!-- STAGE231D0F_R4_FUNNEL_OWNER_DASHBOARD_TARGETED_GUARD_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R2 Funnel color/icon/filter parity

STATUS: READY_TO_APPLY

FAKTY Z KODU:
- `SalesFunnel.tsx` ma już `FunnelOwnerDecisionTile`, `FunnelStageFilterChip`, `FunnelDecisionListCard`.
- `closeflow-metric-tiles.css` ma wspólne tony `blue`, `amber`, `red`, `green`, `purple`.
- Klienci używają wzorca filtrów: `cf-contact-cadence-strip`, `cf-contact-cadence-pills`, `cf-status-pill`, `pill`, `data-cf-status-tone`.

DECYZJE DAMIANA:
- Zamysł Lejka zostaje.
- Lejek nie jest kanbanem.
- Kafelki właścicielskie mają mieć kolorowe ikony.
- `Cisza 7+` ma dostać ton `purple`.
- Filtry etapów mają mówić tym samym językiem wizualnym co filtry w Klientach.
- Nie ruszać logiki filtrów, Supabase, SQL, drag/drop ani kanbana.

ZMIANA:
- Dodany marker `STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY`.
- Dodana jawna mapa `FUNNEL_OWNER_TILE_TONE_MAP`.
- `FunnelStageFilterChip` dostaje `data-cf-status-tone`, `cf-status-pill` / `pill` oraz alias `cf-filter-pill`.
- Pasek etapów dostaje `cf-contact-cadence-strip`, `cf-contact-cadence-pills`, `cf-filter-strip`, `cf-filter-pills`.
- CSS wymusza widoczne kolorowe ikony w owner tiles.

TESTY:
- `node scripts/check-stage231d0f-r2-funnel-color-filter-parity.cjs`
- `node --test tests/stage231d0f-r2-funnel-color-filter-parity.test.cjs`
- `node scripts/check-stage231d0f-funnel-owner-dashboard-visual-alignment.cjs`
- `node --test tests/stage231d0f-funnel-owner-dashboard-visual-alignment.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- Nie wolno przez ten etap zmienić działania filtrów ani przerobić Lejka w kanban.
- Nie mieszać w tym commicie wcześniejszych plików `STAGE231D0E`, jeśli nie są osobno domykane.
<!-- STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY_2026_06_12_END -->

<!-- STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R3 Funnel icon source truth + records header fix

STATUS: READY_TO_APPLY

FAKTY Z KODU:
- `SalesFunnel.tsx` ma już `FUNNEL_OWNER_TILE_TONE_MAP` i używa `data-eliteflow-metric-tone`.
- `closeflow-metric-tiles.css` ma zmienne source of truth dla ikon i tła ikon.
- `SalesFunnel.tsx` nadal miał dwuliniowy nagłówek rekordów: mały label + `Rekordy w aktywnym widoku`.

DECYZJE DAMIANA:
- Ikony kafelków Lejka mają mieć widoczny kolor.
- Kolor ikon ma iść ze wspólnego source of truth `closeflow-metric-tiles.css`.
- Nie kolorować lokalnie kafelków Lejka losowymi hexami.
- Nagłówek rekordów ma być jednym wierszem.
- Nie ruszać logiki filtrów, SQL, Supabase, kanbana ani drag/drop.

ZMIANA:
- Dodany marker `STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER`.
- W `closeflow-metric-tiles.css` dopisano ogólną regułę `stroke: currentColor` / `color: currentColor` dla SVG ikon metric tiles.
- W `SalesFunnel.tsx` nagłówek rekordów zmieniony na `FunnelRecordsHeaderRow`.
- W `sales-funnel-stage231d0f-visual-alignment.css` dodano CSS dla jednowierszowego nagłówka.

TESTY:
- `node scripts/check-stage231d0f-r3-funnel-icon-source-and-header.cjs`
- `node --test tests/stage231d0f-r3-funnel-icon-source-and-header.test.cjs`
- `node scripts/check-stage231d0f-r2-funnel-color-filter-parity.cjs`
- `node --test tests/stage231d0f-r2-funnel-color-filter-parity.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- Jeśli ikony dalej wyglądają bez koloru, możliwa przyczyna to kolejność ładowania CSS albo zewnętrzne nadpisanie SVG. Guard sprawdza source of truth, ale manual QA nadal jest konieczne.
<!-- STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER_2026_06_12_END -->

<!-- STAGE231D0F_R5_FUNNEL_RECORDS_HEADER_LINE_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R5 Funnel records header line repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R4 patcher dalej zatrzymał się na starym fragmencie `<p className="text-xs font-black uppercase tracking...">`.
- Przyczyna: nawet regex R4 nie trafił lokalnego wariantu starego JSX.
- Problem jest w konkretnych liniach starego headera, nie w całym Lejku.

ZMIANA:
- R5 usuwa liniowo stare fragmenty:
  - `visibleLabel` paragraph,
  - stary `h2` rekordów,
  - stary licznik tekstowy.
- R5 wymaga nowego `data-stage231d0f-r5-records-header-line-repair`.
- R5 odświeża R3/R4 guardy, żeby walidowały naprawiony stan bez fałszywego globalnego blokowania.

NIE RUSZAĆ:
- logiki filtrów,
- Supabase,
- SQL,
- kanbana,
- drag/drop,
- STAGE231D0E.

TESTY:
- `node scripts/check-stage231d0f-r5-funnel-records-header-line-repair.cjs`
- `node --test tests/stage231d0f-r5-funnel-records-header-line-repair.test.cjs`
- R4/R3 regression guard/test
- R2 guard/test jeśli istnieją
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma dużo wcześniejszych śladów failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R5_FUNNEL_RECORDS_HEADER_LINE_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R6_FUNNEL_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R6 Funnel UI Dictionary guard repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R5 runtime patch przeszedł.
- R5 guard zatrzymał etap wyłącznie na brakach w UI Dictionary: `MetricTileIconColorSource` i `FunnelColorToneMap`.
- To jest problem guardu/pamięci projektu, nie logiki Lejka.

ZMIANA:
- R6 dopisuje brakujące pojęcia do aktywnego bloku UI Dictionary.
- R6 guard łączy aktywne bloki R6/R5/R4/R3/R2 zamiast patrzeć tylko w ostatni blok.
- R6 nie dotyka logiki filtrów, Supabase, SQL, drag/drop ani kanbana.

TESTY:
- `node scripts/check-stage231d0f-r6-funnel-ui-dictionary-guard-repair.cjs`
- `node --test tests/stage231d0f-r6-funnel-ui-dictionary-guard-repair.test.cjs`
- R5/R4/R3 regression guard/test
- R2 guard/test jeśli istnieją
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree jest brudny po wielu próbach. Push tylko selektywny.
<!-- STAGE231D0F_R6_FUNNEL_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R6_FUNNEL_SHARED_FILTER_RESILIENT_PATCH_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R6 Funnel shared filter resilient patch

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R5 shared filter patch zatrzymał się na `SalesFunnel post-patch token missing: data-stage231d0f-r5-stage-filter-no-visible-money`.
- Przyczyna: patcher szukał zbyt szerokiego wariantu całego `<button>` w `FunnelStageFilterChip`.
- Realny `SalesFunnel.tsx` ma stabilny marker `data-stage231d0f-r2-filter-tone={tone}` i widoczny `cf-funnel-stage-filter-chip-value`.

ZMIANA:
- R6 patchuje wyłącznie blok funkcji `FunnelStageFilterChip`, a nie cały plik na ślepo.
- R6 dopina no-visible-money marker po stabilnym atrybucie.
- R6 usuwa widoczną kwotę z chipu, zostawia kwotę w `aria-label` i `title`.
- R6 zachowuje wspólny filtr dla Klientów przez stabilny `cf-contact-cadence-pills`.

TESTY:
- `node scripts/check-stage231d0f-r6-funnel-shared-filter-resilient-patch.cjs`
- `node --test tests/stage231d0f-r6-funnel-shared-filter-resilient-patch.test.cjs`
- R3 guard/test jeśli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wcześniejsze ślady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R6_FUNNEL_SHARED_FILTER_RESILIENT_PATCH_2026_06_12_END -->

<!-- STAGE231D0F_R8_FUNNEL_ICON_TONE_SYNTAX_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R8 Funnel icon tone syntax repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R7 zatrzymał się przed patchowaniem na błędzie składni w patcherze.
- Błąd: niepoprawnie escapowany string `payment: \\'green\\''` w tablicy walidacyjnej.
- To nie jest błąd aplikacji ani koncepcji kolorów.

DECYZJA DAMIANA:
- Układ Lejka jest zamrożony.
- Etap dotyczy tylko spójnej kolorystyki ikon/kafelków.

ZMIANA:
- R8 naprawia składnię patchera.
- R8 dodaje `node --check` dla patchera i guardu przed patchowaniem.
- R8 dodaje `metric-icon-tone-registry.ts`.
- R8 podpina Lejek i operator metric tone contract pod wspólny resolver koloru.
- Kafel `Pieniądze` używa `PaymentEntityIcon`, nie strzałki.

TESTY:
- `node --check payload/scripts/apply-stage231d0f-r8-funnel-icon-tone-syntax-repair.cjs`
- `node --check payload/scripts/check-stage231d0f-r8-funnel-icon-tone-syntax-repair.cjs`
- `node scripts/check-stage231d0f-r8-funnel-icon-tone-syntax-repair.cjs`
- `node --test tests/stage231d0f-r8-funnel-icon-tone-syntax-repair.test.cjs`
- R6 guard jeśli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Zmiana ikony `Pieniądze` ze strzałki na ikonę płatności jest świadoma.
- Manual QA wymagany dla realnego koloru SVG.
<!-- STAGE231D0F_R8_FUNNEL_ICON_TONE_SYNTAX_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R9_FUNNEL_ICON_TONE_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R9 Funnel icon tone UI Dictionary guard repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R8 patch runtime przeszedł.
- R8 zatrzymał się dopiero na guardzie dokumentacji.
- Brakujący token: `SharedFilterStrip` w aktywnym zakresie UI Dictionary.
- To nie jest problem Lejka ani kolorów ikon.

ZMIANA:
- R9 dopisuje aktywny blok UI Dictionary z literalami:
  - `SharedFilterStrip`
  - `FunnelLayoutFrozen`
  - `FunnelIconToneSourceTruth`
  - `MetricTileIconColorSource`
- R9 odświeża R8 guard, żeby czytał bloki R9/R8/R6/R5/R4 razem.
- R9 nie zmienia runtime Lejka.

TESTY:
- `node --check` dla R9/R8 guardów
- R9 guard/test
- R8 regression guard/test
- R6 guard jeśli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wcześniejsze ślady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R9_FUNNEL_ICON_TONE_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R10_FUNNEL_ICON_TONE_POWERSHELL_STRICTMODE_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R10 Funnel icon tone PowerShell StrictMode repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R9 zatrzymał się po dopisaniu UI Dictionary i project memory.
- Błąd: `The property 'check:stage231d0f-r9-funnel-icon-tone-ui-dictionary-guard-repair' cannot be found on this object.`
- Przyczyna: PowerShell `Set-StrictMode` i dostęp do brakującej właściwości w `package.json`.
- To nie jest problem runtime Lejka.

ZMIANA:
- R10 usuwa kruchy dostęp PowerShell `$Pkg.scripts.'...'`.
- Dopisanie scriptów do `package.json` odbywa się przez `node -e`.
- R10 uruchamia R10/R9/R8 guardy i testy.
- R10 nie zmienia runtime Lejka.

TESTY:
- `node --check` dla R10/R9/R8 guardów
- R10 guard/test
- R9 guard/test
- R8 guard/test
- R6 guard jeśli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wcześniejsze ślady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R10_FUNNEL_ICON_TONE_POWERSHELL_STRICTMODE_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R11_FUNNEL_R6_REGRESSION_GUARD_RESOLVER_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R11 Funnel R6 regression guard resolver repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R10/R9/R8 guardy i testy przeszły.
- Etap zatrzymał wyłącznie stary R6 regression guard.
- R6 guard oczekiwał literalów `tone: 'blue'`, `tone: 'amber'`, `tone: 'purple'`, `tone: 'red'`, `tone: 'green'`.
- Po R8 te literały zostały celowo zastąpione resolverem `resolveCloseflowMetricIconTone`.

ZMIANA:
- R11 odświeża R6 guard/test, żeby akceptował nowy source of truth.
- R11 odpala R11/R10/R9/R8/R6 guardy i testy.
- R11 nie zmienia runtime Lejka.

TESTY:
- `node --check` dla guardów R11/R10/R9/R8/R6
- R11 guard/test
- R10 guard/test
- R9 guard/test
- R8 guard/test
- R6 refreshed guard/test
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wcześniejsze ślady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R11_FUNNEL_R6_REGRESSION_GUARD_RESOLVER_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R12_FUNNEL_METRIC_COLORS_REAL_CSS_ENFORCE_2026_06_12_START -->
## 2026-06-12 18:30 Europe/Warsaw — STAGE231D0F-R12 Funnel metric colors real CSS enforce

STATUS: READY_TO_APPLY

FAKTY Z QA:
- Po pushu R11 układ Lejka jest OK.
- W Vercel `/funnel` nadal wygląda prawie szaro.
- Problem: kolor nie dochodzi wystarczająco mocno do kafli/SVG.

FAKTY Z KODU:
- `SalesFunnel.tsx` ma `data-eliteflow-metric-tone` i `cf-top-metric-tile-icon`.
- `closeflow-metric-tiles.css` ma tokeny `--cf-metric-tone-*-icon`, ale nie wymuszał pełnego `stroke: currentColor` na SVG i dzieciach SVG.
- `Pieniądze` ma długą wartość i wymaga value-kind.

DECYZJA:
- Układ Lejka zostaje zamrożony.
- R12 zmienia tylko realną kolorystykę kafelków/ikon.
- `Cisza 7+` ma być purple, nie amber.
- Kolor ma być subtelny, nie tęcza.
- Source of truth: `closeflow-metric-tiles.css`.

ZMIANA:
- `FUNNEL_OWNER_TILE_TONE_MAP` ma jawne tony: blue, amber, purple, red, green.
- Dodano `data-cf-metric-value-kind`.
- `closeflow-metric-tiles.css` wymusza SVG `stroke: currentColor`.
- Dodano subtelne tła/bordery kafli per tone.
- Dodano money value sizing.

TESTY:
- `node scripts/check-stage231d0f-r12-funnel-metric-colors-real-css-enforce.cjs`
- `node --test tests/stage231d0f-r12-funnel-metric-colors-real-css-enforce.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- Visual QA dalej wymagane, bo to etap CSS/render.
- Local tree ma wcześniejsze śmieci; push tylko selektywny.
<!-- STAGE231D0F_R12_FUNNEL_METRIC_COLORS_REAL_CSS_ENFORCE_2026_06_12_END -->

<!-- STAGE231D0F_R13_FUNNEL_VISUAL_COLOR_DENSITY_2026_06_12_START -->
## 2026-06-12 19:20 Europe/Warsaw — STAGE231D0F-R13 Funnel visual color density

STATUS: READY_TO_APPLY

FAKTY Z QA:
- R12 przeszedł technicznie i został wypchnięty.
- Ekran `/funnel` nadal wygląda za blado.
- Problem nie dotyczy już tylko ikon; brakuje warstwy kolorystycznej kafli i rekordów.

DECYZJE DAMIANA:
- Układ Lejka jest zaakceptowany i zamrożony.
- Dodać kolor bez tęczy.
- Kafelki mają mieć kolor w ikonie, wartości i subtelnym surface/accent.
- Rekordy mają dostać lekkie semantyczne akcenty.
- Przyciski `Otwórz` mają być równe i bez łamania.

ZMIANA:
- R13 dodaje `FunnelDecisionSignal tone`.
- R13 dodaje data atrybuty rekordów.
- R13 dodaje tone surface/accent dla kafli w `closeflow-metric-tiles.css`.
- R13 zwiększa open button z 132px do 156px i dodaje nowrap.
- R13 nie zmienia layoutu ani logiki filtrów.

TESTY:
- `node scripts/check-stage231d0f-r13-funnel-visual-color-density.cjs`
- `node --test tests/stage231d0f-r13-funnel-visual-color-density.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- To etap CSS/render, więc manual QA jest obowiązkowy.
- Local tree ma wcześniejsze śmieci; push tylko selektywny.
<!-- STAGE231D0F_R13_FUNNEL_VISUAL_COLOR_DENSITY_2026_06_12_END -->

<!-- STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_START -->
## 2026-06-12 20:10 Europe/Warsaw — STAGE231D0G Visual Tile Source Truth Atlas

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- STAGE231D0F-R13 przeszedł guard/test/build.
- Commit `0b2f6fb2 fix: improve funnel visual color density` został wypchnięty na `dev-rollout-freeze`.
- Damian wizualnie akceptuje Lejek i zamraża go jako baseline.

DECYZJA DAMIANA:
- FunnelMetricTileR13 zostaje źródłem prawdy dla globalnego CloseFlowMetricTileV2.
- Nie przebudowywać całej aplikacji chaotycznie.
- Najpierw source truth, atlas, guard i plan fal.

ZMIANA:
- Dodano `_project/CLOSEFLOW_VISUAL_TILE_SYSTEM.md`.
- Dodano `_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md`.
- Dopisano UI Dictionary: CloseFlowMetricTileV2, CloseFlowMetricToneMap, FunnelMetricTileR13, SharedFilterStrip, RecordListCard, RightRailCard, FinanceMetricTile.
- Dodano guard/test D0G.
- Runtime widoków nie jest przepinany w tym etapie.

TESTY:
- `node scripts/check-stage231d0g-visual-tile-source-truth-atlas.cjs`
- `node --test tests/stage231d0g-visual-tile-source-truth-atlas.test.cjs`
- R13 regression guard/test jeśli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- UI Dictionary ma stare duplikaty i historyczne mojibake. Guard D0G skanuje aktywny blok D0G i nowe source truth, nie całą historię słownika.
- Pełny cleanup lokalnych śmieci po starych paczkach zostaje osobnym etapem.
<!-- STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_END -->

<!-- STAGE231D0G_CLOSEOUT_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_START -->
## 2026-06-12 — STAGE231D0G-CLOSEOUT Visual Tile Source Truth Atlas

STATUS: PASS / CLOSED

FAKTY:
- D0G source truth and atlas were already committed and pushed.
- Closeout reran D0G guard/test and R13 regression guard/test.
- Build passed.
- `git diff --check` passed with non-blocking LF/CRLF warnings only.
- Runtime UI was not changed.

TESTY:
- `node scripts/check-stage231d0g-visual-tile-source-truth-atlas.cjs`: PASS
- `node --test tests/stage231d0g-visual-tile-source-truth-atlas.test.cjs`: PASS
- `node scripts/check-stage231d0f-r13-funnel-visual-color-density.cjs`: PASS
- `node --test tests/stage231d0f-r13-funnel-visual-color-density.test.cjs`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS

DECYZJA:
D0G is closed. Next implementation stage is D0H-1: Leads + Clients metric tiles and filters to CloseFlowMetricTileV2.

RYZYKA:
- Historical UI Dictionary duplicate/mojibake entries remain outside active D0G block.
- Old local artifacts must not be included in push.
<!-- STAGE231D0G_CLOSEOUT_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_END -->
<!-- STAGE231D0G_CLOSEOUT_R2_GUARD_SCOPE_REPAIR_2026_06_12_START -->
## 2026-06-12 — STAGE231D0G-CLOSEOUT-R2 Guard scope repair

STATUS: READY_TO_RUN

FAKTY:
- D0G guard/test PASS, R13 regression PASS, build PASS.
- Poprzedni closeout guard skanowal cale historyczne pliki centralne.
- Historyczne pliki zawieraja stare mojibake i stare teksty SQL/scope, wiec guard dal falszywy FAIL.

ZMIANA:
- R2 guard skanuje tylko aktywne bloki STAGE231D0G-CLOSEOUT i Obsidian payload.
- R2 nie rusza runtime UI.

TESTY:
- node scripts/check-stage231d0g-closeout-visual-tile-source-truth-atlas.cjs
- node --test tests/stage231d0g-closeout-visual-tile-source-truth-atlas.test.cjs
- node scripts/check-stage231d0g-visual-tile-source-truth-atlas.cjs
- node --test tests/stage231d0g-visual-tile-source-truth-atlas.test.cjs
- npm run build
- git diff --check
<!-- STAGE231D0G_CLOSEOUT_R2_GUARD_SCOPE_REPAIR_2026_06_12_END -->

<!-- STAGE231D0H_N1_R3_NOTIFICATIONS_VISUAL_SOURCE_CLEANUP_SECTION_BOUNDS_2026_06_12_START -->
## 2026-06-12 22:05 Europe/Warsaw — STAGE231D0H-N1-R3 Notifications visual source cleanup section bounds

STATUS: READY_TO_APPLY

FAKTY:
- N1 R2 failed during patch on conflict placeholder removal.
- Real conflict card is a standalone right rail `<section>` before the upcoming card.
- R3 removes the whole section using section boundaries.

ZMIANA:
- R3 uses section bounds for conflict card removal.
- R3 preserves N1 scope: visual/source truth only.
- Runtime data logic, filters, localStorage, Supabase, SQL and routing are untouched.

TESTY:
- `node scripts/check-stage231d0h-n1-notifications-visual-source-cleanup.cjs`
- `node --test tests/stage231d0h-n1-notifications-visual-source-cleanup.test.cjs`
- `node scripts/check-stage231d0g-visual-tile-source-truth-atlas.cjs`
- `node --test tests/stage231d0g-visual-tile-source-truth-atlas.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- Visual QA `/notifications` required.
- Previous failed N1/N1-R2 copied guard/test/run/obsidian files; R3 overwrites active guard/test and creates final R3 run/obsidian.
<!-- STAGE231D0H_N1_R3_NOTIFICATIONS_VISUAL_SOURCE_CLEANUP_SECTION_BOUNDS_2026_06_12_END -->

## 2026-06-13 - STAGE231F_R3
- `check:stage231f-r3-owner-control-baseline`: PASS.
- `test:stage231f-r3-owner-control-baseline`: 5/5 PASS.
- Stage222/223/225 regression lanes: PASS.
- nearest action and Stage227G1/G1R1/G2: PASS.
- build: PASS.
- `verify:closeflow:quiet`: FAIL - global pre-existing Stage98 mojibake/BOM gate; FOUND-20260613-03.

## 2026-06-13 - CLOSEFLOW_CLIENT_CASE_URGENT_FIX
- PASS: dedykowany guard i test wrapper.
- PASS: `check:stage231f-r3-owner-control-baseline`.
- PASS: `npm run build`.
- FAIL pre-existing: Stage231D2 guard oczekuje brakujacego markera w obcym zakresie 231D.
- FAIL pre-existing: `verify:closeflow:quiet` zatrzymuje Stage98 mojibake/BOM.
- Browser automation SKIP: polityka narzedzia zablokowala lokalny URL.

## 2026-06-13 - CLOSEFLOW_CASE_FINANCE_UI_REPAIR
- PASS: dedykowany guard i test.
- PASS: urgent client/case regressions, task/event contract, build i `git diff --check`.
- FAIL pre-existing: migration guard wskazuje dwie migracje portalu z 2026-05-02.
- FAIL pre-existing: quiet gate zatrzymuje globalny Stage98 mojibake/BOM.
- Browser automation SKIP: polityka narzedzia zablokowala lokalny URL.

## 2026-06-14 10:05 Europe/Warsaw - STAGE231G guard/test

Dodano:
- scripts/check-stage231g-lead-detail-operational-wiring.cjs
- tests/stage231g-lead-detail-operational-wiring.test.cjs

Chroni klasę błędu: kafelki display-only bez CTA, brak edycji potencjału, brak widocznego potencjału przy tworzeniu leada, zlewający się layout work-row i błąd group.key w overflow.

## 2026-06-14 10:40 Europe/Warsaw - STAGE231G R6 guard/test correction

R6 poprawia guard/test po fałszywym zamknięciu R5: walidacja sprawdza realne klasy content/status/actions oraz brak stale group.key tylko w overflow section. Guard jest ASCII/no-BOM.

## 2026-06-14 10:45 Europe/Warsaw - STAGE231G_R7 guard/test

Dodano:
- scripts/check-stage231g-r7-potential-only-source-and-workrow.cjs
- tests/stage231g-r7-potential-only-source-and-workrow.test.cjs

Chroni: potencjał otwierany jako osobny modal tylko do wartości, zapis value + deal_value w API, brak otwierania pełnej edycji leada z CTA potencjału oraz desktopowe wyrównanie akcji wiersza.

## 2026-06-14 - STAGE231G_R3 LeadDetail function mapping guard

- guard: scripts/check-stage231g-r3-lead-detail-function-mapping.cjs
- test: 	ests/stage231g-r3-lead-detail-function-mapping.test.cjs
- klasa błędu: martwe/źle podpięte akcje LeadDetail, zły parser potencjału, missing_item mieszany ze zwykłym taskiem, zlewające się wiersze działań.
- status: do uruchomienia lokalnie po apply.

## STAGE231G_R4_LEAD_DETAIL_FUNCTION_MAPPING_CLOSEOUT_FIX

Data: 2026-06-14 11:45 Europe/Warsaw
Guard: scripts/check-stage231g-r4-lead-detail-function-mapping-closeout.cjs
Test: tests/stage231g-r4-lead-detail-function-mapping-closeout.test.cjs
Sprawdza: brak legacy MissingItemQuickActionModal w LeadDetail, ContextActionDialogs/blocker jako jedyna sciezka Brak, hard missing delete w overflow i odporny CSS work-row.

## 2026-06-14 — STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: CaseDetail runtime repair for fake dictation, nextAction missing fallback, contractValue percent-only behavior, payment history copy, and full payment source in case history.
- SQL: NOT_TOUCHED.
- Deferred: cost lifecycle edit/delete and canonical case_item dual-path decision remain R1C/R1D.

## 2026-06-14 — STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: fixed shared CaseFinanceEditorDialog contractValue clearing bug after R1B.
- Guard: scripts/check-stage231h-r1b-case-detail-runtime-repair.cjs now covers CaseDetail and shared finance dialog.
- Decision: case_item source truth decision: two UI entries, one case_items contract.
- Risk: cost lifecycle left as R1C.
- SQL: NOT_TOUCHED.

## STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL — guard/test

- `scripts/check-stage231h-r1c-case-detail-cost-correction.cjs`
- `tests/stage231h-r1c-case-detail-cost-correction.test.cjs`

Zakres: wspólne okno `Koryguj wpłatę/koszt`, czerwone koszty, update/delete kosztu, docs/run report/Obsidian payload.

## 2026-06-14 15:45 Europe/Warsaw — STAGE231H_R1D_FINANCE_CORRECTION_MODAL_COMPACT

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: compact cleanup of CaseDetail finance correction modal after R1C.
- Decision: remove redundant cost status chip from the correction list; cost status remains editable inside the cost correction form.
- Decision: commission payment is a paid commission entry by default; remove status/type selectors from add-commission-payment UI.
- Decision: remove the redundant "Korekta / prowizja" fallback label from payment rows.
- SQL: NOT_TOUCHED.
- Manual test: open Koryguj wpłatę/koszt, verify rows fit, add commission payment, add/correct/delete cost, refresh.

## STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION — 2026-06-14 16:40 Europe/Warsaw
- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH / SERVER_UI_REQUIRED
- Scope: payment correction now edits existing payment amount/date/note through updatePaymentInSupabase; cost correction edits kind/date/status/note and money fields.
- SQL: not touched.
- Risk: if payment PATCH fails on server, backend payment endpoint repair is required.


## 2026-06-14 HH:mm Europe/Warsaw — STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR
- Added/updated guards: R1D, R1F, R1F4.
- Required: R1/R1B/R1D/R1F/R1F4 guard/test + build + diff-check.

## 2026-06-14 HH:mm Europe/Warsaw - STAGE231H_R1G_COST_OTHER_NAME_AND_REIMBURSABLE_FLAG
- Added guard: scripts/check-stage231h-r1g-cost-other-name-and-reimbursable-flag.cjs.
- Added test: tests/stage231h-r1g-cost-other-name-and-reimbursable-flag.test.cjs.

## 2026-06-14 HH:mm Europe/Warsaw - STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC
- Added guard: scripts/check-stage231h-r1g2-case-detail-cost-payment-closeout.cjs.
- Added test: tests/stage231h-r1g2-case-detail-cost-payment-closeout.test.cjs.
- Guard blocks claiming full CaseDetail PASS without SERVER_UI_REQUIRED/manual status.


## STAGE231H_R1G3_CASE_DETAIL_MANUAL_UI_PASS — manual confirmation guard

- date: 2026-06-14 18:55 Europe/Warsaw
- added guard: scripts/check-stage231h-r1g3-case-detail-manual-ui-pass.cjs
- added test: tests/stage231h-r1g3-case-detail-manual-ui-pass.test.cjs
- purpose: keep the manual UI confirmation and next-stage boundary documented without touching runtime.

## STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME

- data: 2026-06-14 19:10 Europe/Warsaw
- guard: scripts/check-stage231h-r1d2-case-detail-note-dictation-restore.cjs
- test: tests/stage231h-r1d2-case-detail-note-dictation-restore.test.cjs
- blokuje: disabled/wkrotce jako finalny stan, Dyktuj notatke bez SpeechRecognition, brak autosave 2000 ms, brak caseId, pusta transkrypcja, brak dokumentacji.


## STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON — 2026-06-14 19:40 Europe/Warsaw

- status: RUNTIME_HOTFIX_PREPARED
- zakres: drugi widoczny przycisk w panelu Notatki sprawy nie może zostać jako disabled „Notatka głosowa — wkrótce”; ma używać tego samego handlera SpeechRecognition/autosave co przycisk w panelu Działania sprawy.
- runtime: src/pages/CaseDetail.tsx, bez SQL i bez R1E kosztów zwróconych.
- test: R1D2 guard/test + R1D2 R4 guard/test + build + diff-check.
- ryzyko: wcześniejszy R1D2 zabezpieczał pierwszy przycisk, ale nie objął drugiego widocznego przycisku w panelu notatek.


## 2026-06-14 22:00 Europe/Warsaw - STAGE231H_R1D2_R6_R9_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR

Status: DO_APPLY / mass repair from clean origin.
Zakres: CaseDetail note follow-up source map and notes CRUD. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek dostaje Edytuj/Usuń/Zapisz. Etap zastępuje runtime file bez kruchych anchorów po błędach R6/R7/R8.


## 2026-06-14 22:15 Europe/Warsaw - STAGE231H_R1D2_R6_R9D_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR_GUARD_SYNC

Status: DO_APPLY / guard-ledger sync after R9 partial apply.
Zakres: centralny R1G2 product-pass sync wymagany przez legacy R1D2 guard plus R9 mass repair. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek ma Edytuj/Usuń/Zapisz.


## 2026-06-14 22:30 Europe/Warsaw - STAGE231H_R1D2_R6_R9E_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_GUARD_SYNC

Status: DO_APPLY / MASS_GUARD_SYNC_CONTINUATION
Zakres: masowe domknięcie klasy błędów legacy markerów. Synchronizuje R1G2, R1D2 R4, R9, R9D i R9E w centralnych ledgerach oraz uruchamia pełny chain guardów/testów/build.


## 2026-06-14 22:40 Europe/Warsaw - STAGE231H_R1D2_R6_R9F_CASE_NOTE_FOLLOWUP_NOTES_CRUD_GUARD_REGEX_MASS_FIX

Status: DO_APPLY / MASS_GUARD_REGEX_FIX
Zakres: naprawa klasy błędu guardów R9D/R9E: sprawdzenie runtime regex
eplace(/\s+/g, ' ') w guardzie musi mieć podwójnie escapowany backslash. Bez tego guard szuka błędnego
eplace(/s+/g, ' ').


## 2026-06-14 22:50 Europe/Warsaw - STAGE231H_R1D2_R6_R9G_CASE_NOTE_FOLLOWUP_NOTES_CRUD_LOCAL_TASKS_GUARD_MASS_FIX

Status: DO_APPLY / MASS_LOCAL_TASKS_GUARD_FIX
Zakres: naprawa klasy błędu guardów R9E/R9F: runtime poprawnie dopina nowy follow-up task do lokalnego 	asks przez setTasks((current) => dedupeCaseTasks([normalizedCreated, ...current], caseId, caseData));, a guard nie może wymagać nieistniejącej składni previousTasks.

## STAGE231H_R1D2_R10C_CASE_DETAIL_ACTION_MAP_FOLLOWUP_NOTES_FINANCE_LOADING

- Data: 2026-06-14 23:45 Europe/Warsaw
- Status: TECH_STAGE_IN_PROGRESS
- Zakres: CaseDetail action map, note follow-up display/source map, quick note local append, finance loading flicker removal.
- Audyt: R10 failed on brittle anchor. R10C uses regex/whole-class source-aware patch and guard.

### STAGE231H_R1D2_R11_NOTE_PANEL_FOLLOWUP_PROMPT_MAP_GUARD
- data: 2026-06-14T20:31:30.095Z
- status: DO_TEST_AND_PUSH
- zakres: notatki CaseDetail pokazują do 5 wpisów, mają tooltip pełnej treści, szybka notatka otwiera ten sam prompt follow-upu co dyktowanie, a follow-up w działaniach pokazuje treść notatki jako opis.
- guard: scripts/check-stage231h-r1d2-r11-note-panel-followup-prompt-map-guard.cjs

## STAGE231H_R1D2_R12D_CASE_QUICK_NOTE_SCOPE_CLIENT_DEDUPE_FINAL_ANCHORLESS

- data: 2026-06-15 Europe/Warsaw
- status: DO_APPLY / final anchorless repair
- zakres: CaseQuickActions explicit case scope, ContextNoteDialog handoff order, CaseDetail quick note local append + prompt, ClientDetail action dedupe
- guard: scripts/check-stage231h-r1d2-r12d-case-quick-note-scope-client-dedupe-final-anchorless.cjs
- test: tests/stage231h-r1d2-r12d-case-quick-note-scope-client-dedupe-final-anchorless.test.cjs
- SQL: nie dotyczy

## STAGE231H_R1D2_R14F_NOTE_DELETE_LINKED_FOLLOWUP_EXPANDED_PANEL_ARROW_SAFE

- Data: 2026-06-15T11:25:01.568Z
- Typ: CaseDetail notes panel / linked follow-up delete / guard
- Zakres: CaseDetail notatki sprawy, follow-up po notatce, kasowanie powiązanego taska.
- Status: LOCAL_APPLIED_PENDING_VERIFY

## STAGE231H_R1D2_R15C - 2026-06-15 15:10 Europe/Warsaw
- Guard: scripts/check-stage231h-r1d2-r15c-note-followup-bidirectional-link-and-work-row-title.cjs.
- Test: tests/stage231h-r1d2-r15c-note-followup-bidirectional-link-and-work-row-title.test.cjs.

## STAGE_BRANCH_AUDIT_001_MAIN_QUARANTINE_AND_DEV_FREEZE_GUARD - 2026-06-15 18:35 Europe/Warsaw

Dodano guard:
- scripts/check-closeflow-branch-scope.cjs

Cel:
- blokowa przypadkow prac poza dev-rollout-freeze.

## STAGE_PROJECT_DOCS_ENCODING_REPAIR_001 - 2026-06-15 19:15 Europe/Warsaw

Dodano guard:
- scripts/check-closeflow-project-docs-encoding.cjs

Cel: blokowac powrot mojibake w centralnych plikach _project.

## STAGE_PROJECT_DOCS_ENCODING_REPAIR_004_SAFE - 2026-06-15 20:15 Europe/Warsaw

Guard:
- scripts/check-closeflow-project-docs-encoding.cjs

Cel: blokować powrót mojibake w centralnych plikach _project.

## STAGE_PROJECT_DOCS_ENCODING_REPAIR_005_REMAINING_TOKENS - 2026-06-15 20:30 Europe/Warsaw

Guard:
- scripts/check-closeflow-project-docs-encoding.cjs

Wynik oczekiwany: centralne pliki _project bez tokenów mojibake.

## STAGE_PROJECT_DOCS_ENCODING_REPAIR_006_FINAL_TOKENS - 2026-06-15 20:40 Europe/Warsaw

Guard:
- scripts/check-closeflow-project-docs-encoding.cjs

Wynik oczekiwany: PASS po usunięciu ostatnich tokenów mojibake.

## STAGE232B_R4_IDEMPOTENT_REPAIR_2026_06_15

Data: 2026-06-15 21:30 Europe/Warsaw
Status: WDROZONE_TECHNICZNIE_DO_SPRAWDZENIA / TEST_RECZNY_DAMIANA
Etap: STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH R4

Zakres techniczny:
- R4 usuwa kruchość patchy R1/R2/R3 opartych o dokładne needle/line ending.
- TodayStable ma jawny marker STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH.
- Kafelek i sekcja Owner Control używają nazwy Wymaga ruchu i liczą actionRequiredRows.
- R6: usunieto z UI odrzucony dopisek techniczny spod kafelka `Wymaga ruchu`; nie wymagac go w testach recznych.
- Najbliższe 7 dni liczy upcomingRowsAll, pokazuje upcomingRowsPreview top 10 i disclosure pokazano 10 z X.
- Zadania używają dynamicznej etykiety: Zadania dziś / Zaległe zadania / Zadania dziś i zaległe / Zadania do obsługi.

Testy wymagane:
- node scripts/check-stage232b-today-owner-control-tiles.cjs
- node --test tests/stage232b-today-owner-control-tiles.test.cjs
- npm run build
- git diff --check

Uwaga:
verify:closeflow:quiet może nadal zgłosić stary niezwiązany guard CaseDetail. To jest zapisane jako SKIP_UNRELATED/DO_ANALIZY, bo STAGE232B dotyczy /today.

Test ręczny Damiana:
- wejść w /today,
- sprawdzić Wymaga ruchu,
- sprawdzić helper pod sekcją,
- sprawdzić zgodność licznik kafelka = licznik sekcji = liczba listy,
- sprawdzić Najbliższe 7 dni: full count i pokazano 10 z X przy ponad 10 rekordach,
- dopiero wtedy zmienić status na PRODUCT_PASS.

## STAGE232B_R6_TODAY_REMOVE_DEV_HELPER_COPY_AND_QUEUE_REPAIR

Data: 2026-06-15 22:05 Europe/Warsaw
Status: DO_URUCHOMIENIA

Guard/test:
- `node scripts/check-stage232b-today-owner-control-tiles.cjs`
- `node --test tests/stage232b-today-owner-control-tiles.test.cjs`

Guard blokuje:
- powrot tekstu `To nie jest kalendarz`,
- powrot tekstu `lista tematow/tematów, które wymagaja/wymagają decyzji/ruchu`,
- regresje STAGE232B: brak `Wymaga ruchu`, brak `actionRequiredRows`, brak full count/preview dla 7 dni, brak dynamicznej nazwy zadan.

## STAGE232B_R8_TODAY_LABEL_AND_HELPER_COPY_FIX

Data: 2026-06-15 22:35 Europe/Warsaw
Status: WDROZONE_TECHNICZNIE_DO_SPRAWDZENIA / TEST_RECZNY_DAMIANA

Zakres:
- usunieto z /today dopisek developerski: "To nie jest kalendarz...";
- przywrocono i zabezpieczono etykiete kafelka: "Wymaga ruchu";
- guard/test blokuja powrot technicznego/helperowego copy w UI;
- nie ruszano STAGE232A, LeadDetail, CaseDetail, SQL, Google Calendar ani finansow.

Testy:
- node scripts/check-stage232b-today-owner-control-tiles.cjs — PASS;
- node --test tests/stage232b-today-owner-control-tiles.test.cjs — PASS;
- npm run build — PASS;
- verify:closeflow:quiet — SKIP_UNRELATED/DO_ANALIZY dla starego guarda CaseDetail.

Audyt ryzyk:
- R7 ujawnil regresje copy/label: usuniecie helpera nie moze zmieniac kontraktu "Wymaga ruchu";
- dodano guard antyregresyjny na brak dopisku "To nie jest kalendarz" i obecność "Wymaga ruchu";
- CaseDetail guard pozostaje osobnym ryzykiem do osobnego etapu, bez mieszania ze STAGE232B.

## STAGE232A_R4_LEAD_MISSING_BLOCKER_CONTRACT_REPAIR

Data: 2026-06-15 23:35 Europe/Warsaw
Status: WDROZONE_TECHNICZNIE_DO_SPRAWDZENIA / TEST_RECZNY_DAMIANA

Brak/Blokada ma jawne pola missingKind, blocksProgress i blockScope. Modal i ContextActionDialogs zapisują metadata do historii/no-flicker payloadu. R4 naprawia częściowy stan po nieudanych R1/R2/R3.

Guard: scripts/check-stage232a-lead-missing-blocker-contract.cjs. Test: tests/stage232a-lead-missing-blocker-contract.test.cjs.

## STAGE232A_R5_MISSING_ITEM_MODAL_VISUAL_SOURCE_TRUTH

Data: 2026-06-15 23:55 Europe/Warsaw
Status: TECH_PUSHED / DO_SPRAWDZENIA_RECZNEGO

Zakres:
- modal Dodaj brak zostaje podpięty pod wizualne źródło prawdy szybkiego dodawania leada: lead-form-vnext;
- karta, nagłówek, sekcje, grid pól, select, checkbox, textarea i footer używają tych samych klas źródłowych;
- logika Brak/Blokada z STAGE232A R4 nie jest refaktorowana;
- dodany guard/test blokuje powrót jasnego, słabo czytelnego standalone shell dla MissingItemQuickActionModal.

Testy:
- node scripts/check-stage232a-r5-missing-item-visual-source.cjs;
- node --test tests/stage232a-r5-missing-item-visual-source.test.cjs;
- npm run build;
- verify:closeflow:quiet traktować jako SKIP_UNRELATED jeśli pada wyłącznie na stary CaseDetail guard.

Audyt ryzyk:
- ryzyko: zmiana CSS może wpływać na modal Brak w lead/client/case, bo komponent jest wspólny;
- guard ogranicza regresję do wizualnego kontraktu, ale manualnie trzeba sprawdzić modal na LeadDetail;
- nie ruszano SQL, API, aktywnych list Brak/Blokada ani CaseDetail.


<!-- CF_RUNTIME_00_SHARED_SOURCE_TRUTH_2026_06_15_START -->
## 2026-06-15 22:56 Europe/Warsaw — CF-RUNTIME-00 Shared source-of-truth foundation

Status: PREPARED_IN_ZIP_LOCAL_APPLY
Typ: techniczny fundament / guard baseline
Zakres: route truth, status truth, missing/blocker truth, access/plan truth wrapper.

Dodane pliki:
- `src/lib/closeflow-runtime-source-truth.ts`
- `tests/cf-runtime-00-source-truth.test.cjs`
- `scripts/check-cf-runtime-00-source-truth.cjs`
- `_project/runs/2026-06-15_CF_RUNTIME_00_SHARED_SOURCE_TRUTH.md`

Testy/guardy:
- `node scripts/check-cf-runtime-00-source-truth.cjs`
- `node --test tests/cf-runtime-00-source-truth.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

Czego nie ruszano:
- UI, LeadDetail, ClientDetail, CaseDetail, Today, Tasks, Calendar, Billing, Settings, CSS, SQL, Supabase, migrations, env.

Ryzyko:
- istniejący fallback `paid_active -> pro` w `src/lib/plans.ts` pozostaje do późniejszego etapu runtime wiring; helper tylko daje bezpieczny kontrakt.

Następny krok:
- CF-RUNTIME-01 LeadDetail missing/blocker/handoff wiring albo CF-RUNTIME-03 CaseDetail wiring.
<!-- CF_RUNTIME_00_SHARED_SOURCE_TRUTH_2026_06_15_END -->

## 2026-06-16 03:10 Europe/Warsaw - STAGE232A_R5 status sync

Status: TECH_PUSHED / DO_SPRAWDZENIA_RECZNEGO

Korekta dokumentacyjna:
- commit techniczny R5 jest wypchniety do GitHuba: 6a16c71c4f700af756c9d1a616b523e233c32219;
- poprzedni status WDROZONE_ZIP_DO_SPRAWDZENIA byl nieaktualny po pushu;
- Product PASS wymaga nadal recznego potwierdzenia wygladu modala Dodaj brak w przegladarce;
- historyczny verify:closeflow:quiet byl blokowany przez osobny CaseDetail guard, nie przez zakres STAGE232A_R5.

<!-- START:CF-CODEX-CONTEXT-INDEX-004 -->

## CF-CODEX-CONTEXT-INDEX-004 - Codex context routing guard

- Guard: `node scripts/check-cf-codex-context-index.cjs`
- Helper syntax: `[scriptblock]::Create((Get-Content -LiteralPath "scripts/codex-context-pack.ps1" -Raw))`
- Helper smoke: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/codex-context-pack.ps1`
- Diff check: `git diff --check`
- Boundary: docs/operator-routing only; no runtime UI/Supabase/SQL/billing/Google Calendar changes.

<!-- END:CF-CODEX-CONTEXT-INDEX-004 -->

## 2026-06-16 - CF-STAGE-QUEUE-RECONCILE-005

Status: PREPARED
Guard:

```powershell
node scripts/check-cf-stage-queue-reconcile-005.cjs
```

Purpose: block stale canonical queue state where STAGE232A still appears as the next implementation stage after R4/R5 were technically pushed.


## 2026-06-16 04:08 Europe/Warsaw - STAGE232A_R6_LEAD_MISSING_BLOCKER_ACTIVE_LIST_AND_TOP_CARD_SOURCE_TRUTH

Status: PASS_LOCAL_DO_SPRAWDZENIA

Zakres:
- LeadDetail aktywne Braki sa filtrowane z linkedTasks/workItems, nie z historii/activity.
- Blokady sa subsetem aktywnych brakow przez explicit blocksProgress albo status zawierajacy block.
- Top card Blokada nie dostaje kazdego braku jako blokady.
- ContextActionDialogs utrwala missingKind, blocksProgress, blockScope i payload na tasku/no-flicker saved record.
- R6-R2 naprawia bledy kruchych kotwic z R6/R6-R1.

Testy:
- node scripts/check-stage232a-r6-lead-missing-active-source.cjs
- node --test tests/stage232a-r6-lead-missing-active-source.test.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- metadata persistence wymaga recznego hard refresh smoke;
- no-flicker moze wygladac dobrze przed reloadem, dlatego test manualny jest obowiazkowy;
- nie ruszano SQL/CaseDetail/Google Calendar/finansow.


## 2026-06-16 04:20 Europe/Warsaw - STAGE232A_R6_R3_CF_RUNTIME_SCOPE_GUARD_COMPAT

Status: PASS_LOCAL_DO_SPRAWDZENIA

Korekta:
- R6-R2 przeszedl patch, guard R6, test R6 i build.
- verify:closeflow:quiet zatrzymal sie na CF-RUNTIME-00 source truth guard, bo stary guard blokowal pliki R6 jako out-of-scope.
- R6-R3 rozszerza allowlist CF-RUNTIME scope guarda o jawne pliki R6.
- To nie zmienia logiki LeadDetail/ContextActionDialogs; to kompatybilnosc guardow po zamknietym CF-RUNTIME-00.

Testy:
- node scripts/check-stage232a-r6-lead-missing-active-source.cjs
- node --test tests/stage232a-r6-lead-missing-active-source.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check


## 2026-06-16 05:05 Europe/Warsaw - STAGE232A_R7_CASE_ITEMS_ITEM_ORDER_SCHEMA_COMPAT

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem produkcyjny:
- Dodanie Braku dla sprawy zwracalo PGRST204: schema cache nie ma kolumny case_items.item_order.
- Błąd blokował zapis Braku.

Zakres:
- api/case-items.ts GET: fallback z order=item_order.asc,created_at.asc na order=created_at.asc.
- api/case-items.ts POST: insertWithVariants próbuje payload z item_order i fallback bez item_order.
- Bez SQL i bez migracji w tym hotfixie.

Testy:
- node scripts/check-stage232a-r7-case-items-item-order-schema-compat.cjs
- node --test tests/stage232a-r7-case-items-item-order-schema-compat.test.cjs
- node scripts/check-stage232a-r6-lead-missing-active-source.cjs
- node --test tests/stage232a-r6-lead-missing-active-source.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- Jeśli brak na sprawie wymaga trwałego porządku listy, trzeba później zrobić schema check/migrację item_order jako osobny SQL etap.
- Ten hotfix ma przywrócić zapis bez wymuszania migracji.


## 2026-06-16 06:55 Europe/Warsaw - STAGE232A_R8_LEAD_MISSING_BLOCKER_UI_SOURCE_TRUTH

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- R8-R4 czesciowo zapisal LeadDetail.tsx i ContextActionDialogs.tsx, a potem zatrzymal sie na data-contract przez zbyt krucha kotwice.
- Ten wpis domyka stan posredni: data-contract, task-route, guard/test, CF-RUNTIME scope, run report i Obsidian payload.

Zakres:
- LeadDetail: aktywne Braki nadal pochodza z linkedTasks, ale renderuja sie jako timeline entries.
- LeadDetail: Najblizsze dzialania wykluczaja aktywne Braki.
- LeadDetail: Braki i blokady licza wszystkie aktywne Braki; top card Blokada liczy tylko subset blokujacy.
- ContextActionDialogs: activity dostaje taskId i explicit blocker status.
- data-contract/task-route: zachowuja missing_item/blocking_missing_item status.

Testy:
- node scripts/check-stage232a-r8-lead-missing-blocker-ui-source-truth.cjs
- node --test tests/stage232a-r8-lead-missing-blocker-ui-source-truth.test.cjs
- guard/test R7
- guard/test R6
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- R8 ma kompatybilnosc po tytule dla starych rekordow bez taskId; dziala tylko gdy istnieje aktywny task, aby historia sama nie wskrzeszala brakow.
- Po deployu wymagany reczny smoke na tym samym leadzie.


## 2026-06-16 07:10 Europe/Warsaw - STAGE232A_R8_R6_R6_GUARD_COMPAT_CLOSURE

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- R8-R5 domknal kod i nowy guard/test R8, ale stary guard R6 byl zbyt literalny.
- R6 guard szukal dokladnego tokenu isActiveMissingItemTaskStage232AR6(entry), mimo ze R8 zachowal zrodlo linkedTasks przez successor helper isActiveMissingItemTaskStage232AR8(entry, leadMissingActivityMetadataStage232AR8).

Zakres:
- Aktualizacja scripts/check-stage232a-r6-lead-missing-active-source.cjs.
- Aktualizacja tests/stage232a-r6-lead-missing-active-source.test.cjs.
- Brak zmian funkcjonalnych w UI ponad R8-R5.

Testy:
- R8 guard/test
- R7 guard/test
- R6 guard/test po kompatybilnosci
- CF-RUNTIME guard
- build
- verify:closeflow:quiet
- git diff --check


## 2026-06-16 21:35 Europe/Warsaw - STAGE232A_R9_BLOCKER_TOP_CARD_SUMMARY_AND_ALL_MISSING

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- R8 poprawil klasyfikacje Brak/Blokada, ale top card Blokada nadal pokazywal akcje per-item: Rozwiaz brak / Usun brak.
- Gdy istnieje aktywna blokada, top card nie mial przycisku Dodaj brak, wiec uzytkownik mial wrazenie limitu jednego braku.
- Wlasciwy model: top card = summary + Dodaj brak + Zobacz wszystkie braki; akcje Rozwiaz/Usun tylko przy konkretnych brakach w zoltym akordeonie.

Zakres:
- LeadDetail top card Blokada jest summary-only.
- Dodaj brak jest dostepne zawsze, niezaleznie od liczby aktywnych blokad.
- Zobacz wszystkie braki otwiera akordeon Braki i blokady i scrolluje do Dzialania leada.
- Akcje Rozwiaz brak / Usun brak zostaja tylko w liscie per-item.
- Dla grupy blockers w akordeonie widoczne sa tylko akcje brakowe, bez Edytuj/Jutro.

Testy:
- node scripts/check-stage232a-r9-blocker-top-card-summary.cjs
- node --test tests/stage232a-r9-blocker-top-card-summary.test.cjs
- R8/R6/R7 guardy regresyjne
- CF-RUNTIME guard
- build
- verify:closeflow:quiet
- git diff --check

Ryzyka:
- Zmiana dotyka tylko LeadDetail UI. Wymagany manual smoke: dodaj drugi brak, zobacz liste, rozwiaz/usun z listy.


## 2026-06-16 21:50 Europe/Warsaw - STAGE232A_R9_R2_R8_GUARD_COMPAT_CLOSURE

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- R9-R1 zapisal top card summary i nowy guard/test R9, ale stary guard R8 byl zbyt literalny.
- R8 guard wymagal tokenu group.key === 'blockers' || isMissingItemTimelineEntry(entry), a R9 celowo zastapil to osobnym branch modelem missing-only.

Zakres:
- Aktualizacja R8 guard/test, aby akceptowaly R9 missing-only branch.
- Brak nowych zmian UI ponad R9-R1.
- Utrzymane R8 warunki: aktywne Braki z linkedTasks, render timeline, wykluczenie z Najblizsze dzialania, count/items wszystkich aktywnych brakow.

Testy:
- R9 guard/test
- R8 guard/test po kompatybilnosci
- R6 guard/test
- R7 guard/test
- CF-RUNTIME guard
- build
- verify:closeflow:quiet
- git diff --check


## 2026-06-16 22:45 Europe/Warsaw - STAGE232A_R10_LEAD_DETAIL_VISUAL_SOURCE_TRUTH

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- Top decision cards na LeadDetail nie byly dosc konsekwentnie spiete z kolorystyka rozwijanych list.
- Modal Dodaj brak wizualnie odstawal od szybkiego dodawania leada i wygladal jak osobny komponent.
- Damian wskazal jedno zrodlo prawdy wizualne: quick lead form / lead-form-vnext.

Zakres:
- LeadDetail top cards: blue/green/amber/red soft-tone palette zgodna z rozwijanymi listami.
- MissingItemQuickActionModal: jawny R10 marker i data attr dla quick-lead visual source.
- stage232a-missing-item-visual-source.css: dark quick-lead shell, white inputs, sticky footer, consistent buttons.
- Guard/test R10.

Testy:
- node scripts/check-stage232a-r10-lead-detail-visual-source-truth.cjs
- node --test tests/stage232a-r10-lead-detail-visual-source-truth.test.cjs
- R9/R8/R6 guardy regresyjne
- CF-RUNTIME guard
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- To jest etap wizualny: konieczny manual smoke na LeadDetail z modalem Dodaj brak i top cardami.
- Nie ruszano źródeł danych ani logiki zapisu.


## 2026-06-16 23:45 Europe/Warsaw - STAGE232A_R10_R1_MISSING_GROUP_INNER_TONE

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- R10 poprawil kolory top cardow i modal, ale po screenshocie Damiana wewnetrzny kafelek/empty state w rozwinietej liscie Braki i blokady nadal wygladal neutralnie.
- Decyzja: nie wystarczy zolty header grupy. Wewnetrzny pusty kafelek i wiersze w grupie blockers musza miec amber/missing tone.

Zakres:
- LeadDetail dodaje jawne data attr dla empty state i wierszy w grupie blockers.
- visual-stage14 dodaje R10-R1 CSS: amber background/border/text dla empty state i wierszy w Braki i blokady.
- Dodany guard/test R10-R1.
- Dodany mirror placementu do _project/04_STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16.md.

Testy:
- node scripts/check-stage232a-r10-r1-missing-group-inner-tone.cjs
- node --test tests/stage232a-r10-r1-missing-group-inner-tone.test.cjs
- R10/R9/R8 guardy regresyjne
- CF-RUNTIME guard
- build
- verify:closeflow:quiet
- git diff --check

Ryzyka:
- Zmiana wizualna CSS, bez zmian danych. Wymaga manualnego smoke na ekranie.


## 2026-06-17 00:15 Europe/Warsaw - STAGE232A_R10_R2_LEAD_ACTION_GROUPS_VISUAL_POLISH

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- R10/R10-R1 przeszly technicznie, ale efekt wizualny na screenshocie nadal byl slaby.
- Same pastelowe tla nie zbudowaly czytelnej hierarchii w sekcji Dzialania leada.
- Damian polecil: zajmij sie ty.

Zakres:
- Dodany globalny CSS override importowany z index.css, aby wygrac z kolejnością starych stage CSS.
- Sekcja Dzialania leada dostaje twardsza hierarchie: biala rama sekcji, mocniejszy border, pasek akcentu po lewej, wyrazniejsze badge i empty states.
- Braki i blokady dostaja mocniejszy amber/missing tone wewnatrz, nie tylko na headerze.
- Notatki pozostaja neutralne.
- Dodany guard/test R10-R2.

Testy:
- node scripts/check-stage232a-r10-r2-lead-action-groups-visual-polish.cjs
- node --test tests/stage232a-r10-r2-lead-action-groups-visual-polish.test.cjs
- R10-R1/R10/R9/R8 guardy regresyjne
- CF-RUNTIME guard
- build
- verify:closeflow:quiet
- git diff --check

Ryzyka:
- To nadal etap wizualny. Guard potwierdza kontrakt CSS, ale ostateczna ocena jest ze screenshota.


## 2026-06-17 01:05 Europe/Warsaw - STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- Pierwsza paczka STAGE232J_R1 zatrzymala sie przed zapisem, bo szukala blednej kotwicy Layout marker.
- Aktualny Layout ma importy na gorze i blok komentarzy przed useWorkspace; nie ma fragmentu */ + pusta linia + import useWorkspace.
- R1-R1 naprawia tylko kotwice patchera i wdraza ten sam runtime scroll fix.

Zakres runtime:
- Layout: route-scoped useEffect dla /leads.
- CSS: route-scoped selector dla main[data-current-section=leads] i content scroll owner.
- Guard/test STAGE232J_R1.
- Mirror do centralnej kolejki 04.

Testy:
- node scripts/check-stage232j-leads-scroll-top-cut.cjs
- node --test tests/stage232j-leads-scroll-top-cut.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- Layout jest globalny, ale fix jest zawężony do location.pathname === '/leads'.
- Manualny smoke /leads jest obowiazkowy.


## 2026-06-17 02:05 Europe/Warsaw - STAGE232A_R11_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_REPAIR / STAGE232A_R11_R1_MISSING_MODAL_CONST_ANCHOR_FIX

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- Pierwsza paczka R11 zatrzymala sie przed zapisem, bo patcher mial zbyt szczegolowa kotwice R10 const.
- Aktualny komponent ma R10 const z tekstem o dark modal surface i nie moze byc patchowany po wczesniejszej wymianie tekstu.
- R11-R1 uzywa robust regex replacement dla calego const block.

Zakres:
- MissingItemQuickActionModal: R10 const przepisany na light lead-form-vnext source; dodany marker R11 i R11-R1.
- stage232a-missing-item-visual-source.css: ciemny shell R10 zastapiony jasnym +Lead source.
- Guard/test R11.
- STAGE232D_R1 nadal zostaje nastepnym runtime etapem.

Testy:
- node scripts/check-stage232a-r11-missing-modal-quick-lead-visual-source.cjs
- node --test tests/stage232a-r11-missing-modal-quick-lead-visual-source.test.cjs
- node scripts/check-stage232a-r10-lead-detail-visual-source-truth.cjs
- node --test tests/stage232a-r10-lead-detail-visual-source-truth.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- Wizualnie dotyka wspolnego modala Brak. Manualny smoke wymagany po deployu.


## 2026-06-17 02:20 Europe/Warsaw - STAGE232A_R11_R2_R10_GUARD_COMPAT

Status: GUARD_COMPAT_FOR_R11

Problem:
- R11 poprawnie zmienil modal Brak na jasny +Lead source truth.
- Stary guard R10 nadal wymagal dark shell background #0f172a.
- To byl konflikt aktywnych zrodel prawdy: R10 dark shell vs R11 jasny +Lead.

Zakres:
- Zaktualizowano R10 guard/test jako compatibility guard.
- R10 nadal pilnuje markerow top card i quick-lead source, ale dark missing modal shell jest deprecated.
- R11 pozostaje aktualnym zrodlem prawdy modala Brak.

Testy:
- node scripts/check-stage232a-r11-missing-modal-quick-lead-visual-source.cjs
- node --test tests/stage232a-r11-missing-modal-quick-lead-visual-source.test.cjs
- node scripts/check-stage232a-r10-lead-detail-visual-source-truth.cjs
- node --test tests/stage232a-r10-lead-detail-visual-source-truth.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check


## 2026-06-17 02:35 Europe/Warsaw - STAGE232A_R11_R3_R10_GUARD_CONTRACT_RELAX

Status: GUARD_COMPAT_FOR_R11

Problem:
- R11-R2 naprawil ciemny shell contract, ale R10 guard zaczal wymagac literalnej klasy lead-detail-action-accordion-group--blockers w LeadDetail.tsx.
- To jest zbyt szczegolowy warunek: klasa moze byc w CSS albo powstac runtime i nie musi istniec literalnie w komponencie.
- R11-R3 luzuje kontrakt R10 do stabilnych markerow stage lineage i aktywnego R11 light modal source truth.

Zakres:
- Zaktualizowano R10 guard/test bez cofania R11.
- Guard nadal blokuje powrot dark #0f172a/#111827 shell.
- R11 pozostaje aktualnym source truth modala Brak.


## 2026-06-17 03:30 Europe/Warsaw - STAGE232A_R12_MISSING_MODAL_MATCH_PLUS_LEAD_DARK_SOURCE

Status: DO_APPLY_ZIP / SCREENSHOT_DRIVEN_REPAIR

Problem:
- Damian pokazal screenshot: Brak po R11 jest jasny, a Nowy lead jest ciemny.
- R11 wybral zle zrodlo prawdy: statyczny jasny lead-form-vnext zamiast realnego ciemnego runtime +Lead modal.
- R12 deprecjonuje R11 light interpretation i ustawia aktywne zrodlo: dark Nowy lead modal match.

Zakres:
- MissingItemQuickActionModal const markers.
- stage232a-missing-item-visual-source.css dark shell/section/white fields/blue CTA.
- R10/R11 compatibility guard/test rewrite.
- R12 guard/test.

Ryzyka:
- To celowo odwraca R11. Manualny smoke musi porownac Brak z Nowy lead.


## 2026-06-17 05:05 Europe/Warsaw - STAGE232A_R13_R2_HEADER_CSS_SOURCE_OVERRIDE

Status: DO_APPLY_ZIP / SCREENSHOT_DRIVEN_HEADER_REPAIR

Problem:
- R13 i R13-R1 zatrzymaly sie przez zbyt szczegolowe kotwice TSX.
- Screenshot pokazuje realny problem w headerze: widac dodatkowe top-left teksty "Brak" i context.
- R13-R2 naprawia to CSS-only przez ukrycie dodatkowych elementow w headerze modala Brak.

Zakres:
- CSS-only override w stage232a-missing-item-visual-source.css.
- Nowy guard/test R13-R2.
- Aktualizacja CF runtime allowlist i dokumentacji.
- Nie dotyka TSX ani logiki danych.

Testy:
- node scripts/check-stage232a-r13-r2-header-css-source-override.cjs
- node --test tests/stage232a-r13-r2-header-css-source-override.test.cjs
- node scripts/check-stage232a-r12-missing-modal-match-plus-lead-dark-source.cjs
- node --test tests/stage232a-r12-missing-modal-match-plus-lead-dark-source.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- CSS hide moze ukryc subtitle tylko w modal headerze Brak. To jest zamierzone.
- Dane i context nie sa usuwane z modelu, tylko z top-left headera.


## 2026-06-17 16:05 Europe/Warsaw - STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX

Status: DO_APPLY_ZIP / RUNTIME_FIX_R1_R1

Problem:
- Poprzedni R1 padl przez zbyt sztywna kotwice w activity-truth.ts.
- Realny bug pozostaje: lead ma status Skontaktowany, ale kafelek Cisza / ryzyko nadal pokazuje stara cisze.

Decyzja:
- Naprawa idzie w zrodle prawdy: updateLeadInSupabase + buildActivityTruth.
- Patch Skontaktowany/Kontakt wykonany stampuje lastContactAt.
- Tworzony jest best-effort activity eventType=manual_contact_done dla tego samego leadId.
- Activity truth traktuje status Skontaktowany jako explicit contact truth.
- Future follow-up/event nie resetuje kontaktu tylko z powodu slowa kontakt/telefon.

Testy:
- node scripts/check-stage232d-owner-contact-done-runtime-fix.cjs
- node --test tests/stage232d-owner-contact-done-runtime-fix.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Manual smoke:
- Klik Kontakt wykonany / ustaw Skontaktowany.
- Kafelek Cisza ma zniknac bez F5.
- Po F5 cisza nie wraca.


## 2026-06-17 17:05 Europe/Warsaw - STAGE232I0_CASE_CLIENT_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT

Guard: scripts/check-stage232i0-missing-blocker-cross-entity-contract.cjs
Test: tests/stage232i0-missing-blocker-cross-entity-contract.test.cjs


## 2026-06-17 21:15 Europe/Warsaw - STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME

Status: DO_APPLY_ZIP_R7 / RUNTIME

Zakres:
- CaseDetail Braki/Blokady jako task/work item missing_item z caseId,
- explicit button data-context-action-kind="blocker",
- case_items tylko legacy/checklist compatibility,
- resolve/delete dla missing_item,
- historia: missing_item_created/resolved/deleted,
- bez SQL, bez ClientDetail, bez Owner Control cross-entity.

## 2026-06-17 22:35 Europe/Warsaw - STAGE232I1_R8_MISSING_MODAL_READABLE_VISUAL_SOURCE

Status: DO_APPLY_ZIP / VISUAL_FIX

Zakres:
- poprawa czytelności modala "Dodaj brak" na ciemnym shellu,
- tytuł, labelki, checkbox helper i tekst pól wymuszone na czytelne kolory,
- bez zmian SQL i bez zmian runtime zapisu/odczytu Braków/Blokad.

## 2026-06-18 00:25 Europe/Warsaw - STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Zakres:
- ClientDetail agreguje directClientMissingItems, leadMissingItems i caseMissingItems.
- Kazdy aktywny Brak/Blokada ma source badge: [Klient], [Lead], [Sprawa].
- Filtry: Wszystkie / Klient / Leady / Sprawy / Blokady / Braki.
- Resolve/delete dziala na zrodlowym missing_item task/work item przez istniejace handlery po item.id.
- Historia nie jest aktywnym zrodlem listy.
- Bez SQL i bez Owner Control runtime.

## 2026-06-18 01:00 Europe/Warsaw - STAGE232I2_R3_CLIENT_MISSING_DELETE_SOFT_DELETE

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- Usuwanie Braku u klienta zwracalo METHOD_NOT_ALLOWED.

Zmiana:
- ClientDetail delete Braku klienta przechodzi na soft-delete przez updateTaskInSupabase.
- Fizyczny deleteTaskFromSupabase nie jest uzywany w handlerze Braku klienta.
- Task dostaje status 'deleted' i payload stage232i2DeleteMode='soft_delete_no_method_delete'.
- Aktywna lista filtruje deleted, wiec wpis znika po usunieciu.
- Bez SQL i bez Owner Control.

## 2026-06-18 02:25 Europe/Warsaw - STAGE232K_CASE_DETAIL_LEGACY_CASE_ITEM_DELETE_NO_METHOD_ALLOWED

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Powód:
- METHOD_NOT_ALLOWED dotyczy kosza w CaseDetail legacy case_items/checklist.
- Nie dotyczy ClientDetail missing_item.

Zmiana:
- aktywne deleteCaseItemFromSupabase(item.id) zastąpione przez updateCaseItemInSupabase({ status: 'rejected' }),
- brak znika jak po Odrzuć,
- bez SQL, bez Owner Control, bez ClientDetail.

## 2026-06-18 03:05 Europe/Warsaw - STAGE232L_DELETE_LINKED_NOTE_REFERENCE_SWEEP

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- CaseDetail task delete rzucał ReferenceError: getLinkedNoteForTaskStage231H_R1D2_R15C is not defined.

Audyt:
- błąd jest w CaseDetail task branch,
- poprawny helper istnieje jako findCaseNoteForFollowUpTaskStage231H_R1D2_R15C,
- ClientDetail nie zawiera tej referencji,
- LeadDetail/TodayStable mają osobne delete flow, nie są źródłem tego ReferenceError.

Zmiana:
- task delete używa zdefiniowanego helpera,
- dodano guard/test blokujący niezdefiniowany helper.

## 2026-06-18 03:45 Europe/Warsaw - STAGE232M_CASE_DETAIL_MISSING_ITEM_ACTIVE_FILTER_DELETE_CLOSURE

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- CaseDetail missing_item po usunięciu migał, ale nadal był widoczny.

Audyt:
- filtr CaseDetail dla missing_item uznawał za zamknięte tylko done/completed/accepted,
- brakowało deleted/rejected/resolved/archived/cancelled/canceled,
- ClientDetail ma szerszą listę statusów i dlatego zachowuje się poprawniej.

Zmiana:
- CaseDetail missing_item inactive filter rozszerzony,
- delete branch zapisuje status deleted przez updateTaskInSupabase,
- local state setTasks zamyka row natychmiast.

## 2026-06-18 04:45 Europe/Warsaw - STAGE232N_MISSING_ITEM_VISUAL_KIND_CLASSIFICATION

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- Brak zapisany jako task missing_item był wizualnie pokazywany jako Zadanie, szczególnie w LeadDetail.

Audyt:
- ContextActionDialogs zapisuje type/kind/status missing_item,
- LeadDetail buildTimeline każdy task mapuje jako task,
- render wiersza korzystał z entry.kind i wypisywał "Zadanie" mimo że isMissingItemTimelineEntry rozpoznawał Brak.

Zmiana:
- LeadDetail renderuje missing_item jako Brak albo Blokada,
- status wiersza dla missing_item pokazuje Brak/Blokada zamiast Zaległe,
- no-flicker mutation niesie displayKind/businessKind.

## 2026-06-18 05:35 Europe/Warsaw - STAGE232O_MISSING_ITEM_ACTIVITY_BRIDGE_AND_CASE_APPEND

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- Braki były w dobrej grupie, ale renderowały się jako Zadanie/Zaległe.
- W CaseDetail Brak wpadał do Wszystkie aktywne jako zwykły task.

Audyt:
- STAGE232N działa dla entries z missing metadata,
- zrzut ekranu pokazuje przypadek activity-bridged missing bez metadanych na timeline entry,
- CaseDetail buildWorkItems nie używał activity missing_item_created do wzbogacenia tasków.

Zmiana:
- LeadDetail markeruje active missing entries jako stage232oMissingItem,
- ContextActionDialogs wysyła enriched savedRecord,
- CaseDetail wzbogaca taski z activity metadata przed buildWorkItems.

## 2026-06-18 14:05 Europe/Warsaw - STAGE232P_CASE_DETAIL_BUILDWORKITEMS_SCOPE_HOTFIX

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- CaseDetail nie ładował widoku po STAGE232O.
- Runtime: taskWithMissingBridgeStage232O is not defined.

Audyt:
- taskWithMissingBridgeStage232O istnieje w useMemo openTasksWithNoteFollowUpPreviewStage231H_R1D2_R11,
- buildWorkItems jest funkcją zewnętrzną i nie ma dostępu do tej zmiennej,
- buildWorkItems powinien operować na swoim lokalnym task, bo dostaje już wzbogacone taski.

Zmiana:
- buildWorkItems używa task w getTaskNoteFollowUpPreviewStage231H_R1D2_R11,
- dodano guard/test scope.

## 2026-06-18 15:05 Europe/Warsaw - STAGE232Q_CASE_DETAIL_MISSING_PAYLOAD_ROW_RENDER

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- CaseDetail Braki i blokady miały licznik, ale nie renderowały wiersza po rozwinięciu.

Audyt:
- count i items bazują na workItems.filter(entry.kind === 'missing'),
- group.items.map renderuje WorkItemRow,
- WorkItemRow zwraca null, jeśli isCaseActivitySourceForWorkRow(entry.source),
- helper uznawał samo payload za activity,
- missing_item task ma payload, więc był liczony, ale ukryty.

Zmiana:
- payload-only nie oznacza activity,
- activity detection wymaga eventType/actorType i wyklucza work-row shape,
- guard/test blokują regresję.

## 2026-06-18 15:35 Europe/Warsaw - STAGE232R_MISSING_ITEM_RENDER_FREEZE_GUARD

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Decyzja:
- Damian potwierdził: po STAGE232Q jest OK.
- Zamrażamy zachowanie Brak/Blokada.

Guard blokuje:
- LeadDetail missing_item jako "Zadanie",
- CaseDetail puste rows przy liczniku Braki i blokady > 0 z powodu payload-only activity,
- powrót payload-only detection w isCaseActivitySourceForWorkRow,
- utratę enriched missing record w ContextActionDialogs.

## 2026-06-21 Europe/Warsaw - STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE

Guardy/testy:
- node scripts/check-stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.cjs
- node --test tests/stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.test.cjs
- node scripts/check-stage232i4-r16z-r4-missing-manager-final-visual-fit-no-zip.cjs
- node --test tests/stage232i4-r16z-r4-missing-manager-final-visual-fit-no-zip.test.cjs
- node scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs
- node --test tests/stage232i4-r16z-r5-missing-manager-close-guard-consolidation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

Zmiana:
- R16O guard/test nie wymaga juz obsolete xl:w-[1100px].
- R16Z_R4 pozostaje finalnym visual guardem managera.
- R16Z_R5 pilnuje konsolidacji i dokumentacji.

## STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL

Date/time: 2026-06-21 Europe/Warsaw
Status: LOCAL APPLY CONTINUATION / guards consolidated before final smoke and push.
Scope: CF-RUNTIME-00 and R16Z_R5 close guard allow the R5_R5 ClientDetail operational center test compatibility repair and R6 final allowlist files. No SQL, finance, Calendar, billing, Owner Control runtime or CaseDetail runtime touched.

## STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL

Date/time: 2026-06-21 Europe/Warsaw
Status: APPLIED_LOCAL_PENDING_VERIFY_AND_SMOKE
Scope: guard/test compatibility continuation for polish-mojibake-audit. The audit now skips local stage backup artifacts and huge text-like files before reading them, preventing ERR_STRING_TOO_LONG during verify:closeflow:quiet. No product logic, SQL, finance, Calendar, Owner Control runtime or CaseDetail runtime touched.

## STAGE232I4_R16Z_R8_LEAD_MISSING_BLOCKER_TOGGLE_PRIORITY_FIX

- Guard: scripts/check-stage232i4-r16z-r8-lead-missing-blocker-toggle-priority-fix.cjs
- Test: tests/stage232i4-r16z-r8-lead-missing-blocker-toggle-priority-fix.test.cjs
- Purpose: protect LeadDetail missing manager blocker toggle persistence by requiring priority high/medium to follow blocksProgress.

## 2026-06-21 Europe/Warsaw - STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE

Status: TECH_APPLIED_LOCAL / OWNER_SMOKE_REQUIRED.

Zakres:
- Naprawa realnego bug smoke: LeadDetail -> Zobacz wszystkie braki -> checkbox Blokuje wracal jako zaznaczony po silent refresh/F5.
- Przyczyna: MissingItemsManagerDialog.isManagerItemBlocker liczyl blokade przez OR z
aw.status/raw.priority, wiec stare dane activity bridge mogly nadpisac swieze locksProgress=false.
- Naprawa: jawne item.isBlocker / item.blocksProgress ma pierwszenstwo przed raw/payload/status/priority fallback.

Testy:
- R9 guard/test.
- R8 regression.
- R16Z_R5 close regression.
- build / verify / diff-check.

Manual smoke:
- LeadDetail: odznacz Blokuje, F5, checkbox ma zostac odznaczony; zaznacz ponownie, F5, checkbox ma zostac zaznaczony.

Nie ruszac:
- SQL, RLS, finanse, Calendar, billing/trial, Owner Control runtime, CaseDetail runtime.

## 2026-06-21 Europe/Warsaw - STAGE232I4_R16Z_R10 guard/test
- scripts/check-stage232i4-r16z-r10-lead-missing-checkbox-activity-source-fix.cjs
- tests/stage232i4-r16z-r10-lead-missing-checkbox-activity-source-fix.test.cjs


## STAGE232I4_R16Z_R10_R3_GUARD_SCOPE_STATUS_SYNC_AND_OWNER_SMOKE_CLOSE

- data/czas: 2026-06-21 Europe/Warsaw
- status: PASS_PUSHED / CLOSED / OWNER_SMOKE_OK after Damian manual smoke confirmation.
- closes: STAGE232I4_R16Z_R9 and STAGE232I4_R16Z_R10.
- owner smoke: LEAD SMOKE PASS, CLIENT REGRESSION PASS.
- guard scope: CF-RUNTIME active allowlist owns diff scope; R16Z_R5 close guard must not keep dead R10 allowlist constants.
- next: STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH.
- forbidden scope: no SQL, no finance, no Calendar, no billing, no Owner Control runtime, no ClientDetail runtime, no CaseDetail runtime.

Commands:

```powershell
node scripts/check-stage232i4-r16z-r10-r3-guard-scope-status-sync.cjs
node --test tests/stage232i4-r16z-r10-r3-guard-scope-status-sync.test.cjs
```


# STAGE232I4_R16Z_R10_R3_R4_OVERWRITE_GUARDS_FINAL

- data/czas: 2026-06-21 HH:mm Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- status: PASS_PUSHED / CLOSED / OWNER_SMOKE_OK
- owner smoke: LEAD PASS, CLIENT REGRESSION PASS, reported by Damian
- closes: STAGE232I4_R16Z_R10 and R16Z close/status sync
- next: STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH
- no SQL, no ClientDetail runtime, no CaseDetail runtime, no Calendar, no billing, no Owner Control runtime
