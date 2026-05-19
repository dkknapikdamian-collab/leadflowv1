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
## 2026-05-16 â€” Stage104 / Paczka F â€” Calendar loading performance

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
## Stage105 / Paczka G â€” Templates delete + visual contract â€” 2026-05-16

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
- Stage119 V4 deduplikuje equiredTests, zeby ponowione paczki V2/V3 nie zostawialy zdublowanego wpisu Stage119.
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
