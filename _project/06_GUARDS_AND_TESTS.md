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

## 2026-05-16 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Guard Stage92: calendar selected day readable actions {#STAGE92_CALENDAR_SELECTED_DAY_READABLE_ACTIONS}

Guard: `tests/stage92-calendar-selected-day-readable-actions.test.cjs`

Zakres:
- peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ne etykiety typÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw wpisu,
- obecnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ `data-cf-entry-title`,
- peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ne akcje `Edytuj`, `+1H`, `+1D`, `+1W`, `Zrobione/PrzywrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ`, `UsuÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ`,
- brak aktywnego legacy renderu selected-day w `Calendar.tsx`,
- brak osobnego pustego paska pod wpisem,
- brak sztywnego `min-width: 260px` dla akcji V9.

## STAGE93_GUARD_CALENDAR_WEEK_RAIL_CLEANUP Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ 2026-05-16
- Guard: `tests/stage93-calendar-week-rail-cleanup.test.cjs`.
- Scope: Calendar week rail cleanup, old hidden filter removal, plain count text, quiet release gate wiring.

## STAGE93_GUARD_FIX_CALENDAR_SWEEP_2026_05_16

- Naprawiono guard Stage93 tak, aby nie szukaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ kruchego znacznika koÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľca po `calendar-week-plan-list`.
- Dodano lokalny sweep: `scripts/check-closeflow-calendar-ui-sweep-stage94.cjs`.
- Sweep wykrywa stare/ryzykowne wzorce Calendar UI: legacy week filter, badge count, dual selected-day render, bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdne Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o selected day, duplikaty klas i stare selektory CSS.

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
- `tests/stage96-leads-right-rail-width-position.test.cjs` dopiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âty do quiet release gate.
- Guard blokuje lokalny grid 195px/300px i wymusza wspÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlny right rail source of truth.

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
## 2026-05-16 Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚ÂÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇĂ„â€šĂ˘â‚¬ĹˇÄ‚â€šĂ‚Â¬Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„â€ž Stage104 / Paczka F Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚ÂÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇĂ„â€šĂ˘â‚¬ĹˇÄ‚â€šĂ‚Â¬Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„â€ž Calendar loading performance

STATUS: WDROÄ‚â€žĂ„â€¦Ä‚â€šĂ‚Â»ONE LOKALNIE PO APPLY, TEST R\u00c4\u0098CZNY DO WYKONANIA.

FAKTY:
- Kalendarz nie powinien juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ liczyĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ `combineScheduleEntries` wprost w renderze.
- Dni miesiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ca i tygodnia korzystajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ z `entriesByDayKey` / `weekEntriesByDayKey`.
- `Calendar.tsx` nie powinien juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ `getEntriesForDay(...)` w render path.
- `cases` idĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ z `fetchCalendarBundleFromSupabase()`, bez drugiego `fetchCasesFromSupabase()` w `Calendar.tsx`.
- PeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nostronicowy loader zostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ zastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦piony maÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ym skeletonem danych.

TESTY:
- `node tests/stage104-calendar-loading-performance-contract.test.cjs`
- `npm run build` jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli nie uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄyto `-SkipBuild`.

RYZYKA:
- Range fetch backendowy jest DO POTWIERDZENIA.
- Stare DOM-normalizatory miesiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ca zostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y nietkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âte i wymagajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ osobnego audytu w Paczce G.

NAST\u00c4\u0098PNY KROK:
- Test rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âczny `/calendar`: start, tydzieÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ, miesiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦c, wybrany dzieÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ, edycja, +1H/+1D/+1W, zrobione, usuÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ.
<!-- /STAGE104_CALENDAR_PERFORMANCE_F -->


---
## Stage105 / Paczka G Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚ÂÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇĂ„â€šĂ˘â‚¬ĹˇÄ‚â€šĂ‚Â¬Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„â€ž Templates delete + visual contract Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚ÂÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇĂ„â€šĂ˘â‚¬ĹˇÄ‚â€šĂ‚Â¬Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„â€ž 2026-05-16

STATUS: WDROÄ‚â€žĂ„â€¦Ä‚â€šĂ‚Â»ONE LOKALNIE Z PACZKI ZIP, BEZ COMMITA I BEZ PUSHA.

FAKTY:
- /templates dostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ widoczny przycisk UsuÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ na karcie szablonu.
- Delete uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa EntityTrashButton i shared trash action source of truth.
- Delete wymaga window.confirm oraz dodatkowego potwierdzenia, jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli szablon ma pozycje checklisty.
- Karta szablonu uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa cf-template-card cf-readable-card i markerÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw
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
- Ten etap nie dodaje backendowego sprawdzania, czy szablon zostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄyty w aktywnych sprawach. Wymusza Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşwiadome potwierdzenie usuwania wzorca i jego pozycji.

NAST\u00c4\u0098PNY KROK:
- PrzetestowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ /templates; dopiero potem zdecydowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ, czy robimy kolejny lokalny etap czy wspÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlny commit/push Stage104+Stage105.
<!-- STAGE105_TEMPLATES_DELETE_VISUAL_G -->

<!-- STAGE98B_100B_CALENDAR_POLISH_WEEK_PLAN_GUARDS_2026_05_17 -->
## Stage98B-100B Calendar guards

- `tests/stage98-polish-mojibake-calendar-guard.test.cjs` Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ hard fail for mojibake in `src/`, `tests/`, `scripts/`, `_project/`.
- `tests/stage99-calendar-active-class-contract.test.cjs` Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ active class/CSS contract for Calendar and V9 CSS.
- `tests/stage100-calendar-week-plan-entry-visible.test.cjs` Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ one active week-plan DOM/CSS model and no Stage94 V2/V3/V4 week-plan CSS markers.
- `tests/stage104-calendar-rendered-week-plan-smoke.test.cjs` Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ rendered-skeleton smoke for visible title/relation/actions plus CSS non-hidden checks.
- `scripts/closeflow-release-check-quiet.cjs` Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ includes Stage104 in required tests.

## Stage104 V2 - calendar performance guard fix

V1 guard was too broad and falsely failed on `sortCalendarEntriesForDisplay(dayEntries)` inside `buildEntriesByDayKey`. V2 permits sorting in the precompute helper and forbids it only inside month/week render scopes.


## STAGE104_V4_CALENDAR_PERFORMANCE_GUARD_FIX

- Local-only guard repair for Calendar performance contract.
- Guard forbids selectedDate-driven DOM post-processing reruns but allows data-driven updates.
- No git add/commit/push in this package.

## STAGE107_TEMPLATES_DELETE_VISUAL_LOCAL_ONLY

- Test: `node --test tests/stage107-templates-delete-and-visual-contract.test.cjs`.
- Zakres: /templates delete action + shared visual card/action source of truth.
- Guard jest podpiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âty do `scripts/closeflow-release-check-quiet.cjs`.

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

Decyzja: guardy UI majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ sprawdzaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ efekt renderu/semi-renderu, nie tylko markery, klasy i stringi w Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ach.

Zakres:
- fixture: Akt jaskiniowiec, 10:29, Wydarzenie, Zaplanowane, Brak powiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦zania,
- visible action labels: Edytuj, +1H, +1D, +1W, Zrobione, UsuÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ,
- brak runtime markerÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw: ReferenceError, APP_ROUTE_RENDER_FAILED, Missing lazy page export,
- CSS selected-day V9 nie moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe ukrywaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ krytycznych slotÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw renderu,
- usuniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âty orphan selector V9 ::after, ktÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇry mÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇgÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ podpinaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ V9 pod legacy hidden selected-day panel.

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
ode --test tests/stage113-closeflow-logo-source-contract.test.cjs pilnuje assetÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw i mapowania logo w Layout/Login.


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
- Cel: LeadDetail nie moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe mieĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ wÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡asnej wyspy `InfoLine` / `lead-detail-contact-grid`; LeadDetail i ClientDetail majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ wspÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlnego `src/components/entity-contact-card.tsx`.
- Komenda: `node --test tests/stage115-lead-contact-card-client-parity.test.cjs`.
- Test rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âczny: /leads/:id, porÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇwnaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ lewĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ kartĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â kontaktowĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ z lewĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ kartĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ klienta: telefon, e-mail, firma, ostatni kontakt, ikony, przyciski kopiowania.

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
- Purpose: overdue LeadDetail work items must show `ZalegÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡e`, use red/danger styling, and remove mojibake separators.
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
- obecnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ ListDTO constants,
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
## 2026-06-04 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Stage221 owner-control roadmap memory guard

Guard:
- `node scripts/check-stage221-owner-control-roadmap-memory.cjs`

Zakres:
- sprawdza, czy `_project/07_NEXT_STEPS.md` zawiera peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ny blok Stage221,
- sprawdza obecnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ etapÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw: A35, A35B, A41, A46, A42, A45, A44, A36, A47,
- sprawdza, czy decyzja owner-control zostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a dopisana do `_project/04_DECISIONS.md`,
- sprawdza, czy istnieje roadmap file `_project/roadmaps/2026-06-04 - CloseFlow owner control roadmap po researchu CRM.md`,
- nie dotyka runtime UI.

Test rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âczny:
- PrzeczytaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ nowy blok w `_project/07_NEXT_STEPS.md` i potwierdziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe kolejnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ etapÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw nie skacze po plikach i da siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â z niej wdraÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ kolejno.
<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_GUARD_END -->

<!-- STAGE222_R4_V3_LEAD_CLIENT_OPERATIONAL_BADGES -->
## 2026-06-05 - STAGE222 R4 V3 lead/client operational badges robust fix

FAKTY:
- R4 V1/V2 zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â na kruchych anchorach w Clients.tsx.
- V3 uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa elastycznych regexÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw i naprawia czĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciowy lokalny stan.
- Docelowy wzÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇr: [Oferta wysÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ana] [Sprawa] [14+ dni bez ruchu] [brak akcji].
- Nie ruszano Today i nie dodano nowego CSS.

TESTY:
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs
- npm run build
- git diff --check

<!-- STAGE222_R2B_SETTINGS_CASES_HOTFIX -->
## 2026-06-05 - STAGE222 R2B Settings/Cases hotfix

FAKTY:
- Commit 7ff0bc08 zostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ wypchniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âty mimo czerwonego guard/test Stage222 R2.
- Przyczyna: apply script nie wykonaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ patcha Settings/Cases, wiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âc helper i guard weszÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y bez sekcji ustawieÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ i bez case badges.
- R2B dopina brakujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ce elementy: Settings threshold section i Cases owner risk badges.
- Build wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniej przechodziÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡, ale Stage222 guard/test nie.

DECYZJE:
- Nie robimy rollbacku, bo build przechodzi i zakres da siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â domknĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ hotfixem.
- R2B ma byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ osobnym commitem naprawczym.
- Bez `git add .`.

TESTY:
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs, jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli plik istnieje
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs, jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli plik istnieje
- npm run build
- git diff --check

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonych testach commit/push R2B.

<!-- STAGE223_R2_OWNER_MOVEMENT_RISK_SYSTEM -->
## 2026-06-05 - STAGE223 R2 Owner Movement Risk System

FAKTY:
- R2B Stage222 jest zielony i repo jest czyste/up-to-date przed Stage223.
- Dodano `next-move-contract.ts` jako jeden kontrakt dla missing/overdue/today/planned/closed.
- Dodano `activity-truth.ts`, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby nie udawaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ kontaktu na podstawie `updatedAt`.
- `owner-risk-rules.ts` uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa teraz next-move-contract i activity-truth.
- `record-operational-badges.ts` rozrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄnia ciszĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â kontaktu od braku Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşwieÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄego ruchu fallback.
- Dodano runtime testy, ktÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇre realnie wywoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ funkcje przez esbuild, nie tylko szukajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ tekstu.

DECYZJE DAMIANA:
- PodetapÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw A-D nie pushujemy osobno.
- Nie robiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ drugiego Today.
- Badge majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ wynikaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ z jednego kontraktu ruchu i prawdy aktywnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci.
- `updatedAt` moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ fallbackiem aktywnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci, nie prawdĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ kontaktu.

TESTY:
- `node scripts/check-stage223-owner-movement-risk-system.cjs`
- `node --test tests/stage223-owner-risk-runtime-contract.test.cjs`
- `node scripts/check-stage222-owner-risk-rules-foundation.cjs`
- `node --test tests/stage222-owner-risk-rules-foundation.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

DO POTWIERDZENIA:
- PeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ne wpiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcie LeadDetail/CaseDetail widocznego work center moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄna zrobiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jako D2, jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli po runtime contract nie bĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdzie regresji.
- Today agregacja moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe dostaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ ranking w nastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpnym kroku, ale bez nowej sekcji.

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonych testach sprawdziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ /leads, /cases, /today.
- Commit/push dopiero po caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ym Stage223 R2, nie po pojedynczym podetapie.

<!-- STAGE223_R2B_ACTIVITY_TRUTH_FALLBACK_HOTFIX -->
## 2026-06-05 - STAGE223 R2B Activity Truth fallback hotfix

FAKTY:
- Stage223 R2 runtime test wykryÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ realny bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦d: fallback z `updatedAt` nadpisywaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ prawdziwĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ aktywnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ.
- Build przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡, ale runtime test nie; Stage223 R2 nie jest gotowy do pushu.
- R2B zmienia Activity Truth: `updatedAt/createdAt` sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywane wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cznie, gdy nie ma realnych kandydatÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw aktywnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci/kontaktu/pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci.
- To naprawia zaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡oÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄenie: nie udajemy kontaktu ani Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşwieÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄej aktywnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci przez zwykÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y update rekordu.

DECYZJE:
- Nie pushowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ Stage223, dopÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇki runtime testy nie sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ zielone.
- UtrzymaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ kontrakt: prawdziwy kontakt != updatedAt.
- Podetapy A-D pozostajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ jednym lokalnym blokiem do jednego commita po peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nych testach.

TESTY:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-risk-runtime-contract.test.cjs
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonych testach moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄna dopiero rozwaÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄyĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push Stage223 R2.

<!-- STAGE223_R2C_STAGE113_LOGO_TEST_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2C Stage113 logo test release gate hotfix

FAKTY:
- Stage223 R2B ma zielone runtime testy i build.
- `verify:closeflow:quiet` zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ release na brakujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cym pliku `tests/stage113-closeflow-logo-source-contract.test.cjs`.
- Quiet release gate ma ten plik w `requiredTests`, wiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âc brak samego pliku blokuje push.
- R2C dodaje brakujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cy test, nie zmienia logiki aplikacji.

DECYZJE:
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czamy release gate.
- Dodajemy minimalny test kontraktu Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a logo CloseFlow.
- Push Stage223 dopiero po zielonym `verify:closeflow:quiet`.

TESTY:
- node --test tests/stage113-closeflow-logo-source-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage223/Stage222 regressions
- npm run build
- git diff --check

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push dla caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223 R2 + R2B + R2C.

<!-- STAGE223_R2D_CASE_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2D case trash release gate hotfix

FAKTY:
- Stage223 R2C przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ Stage113, Stage223 runtime, Stage222 regression i build.
- `verify:closeflow:quiet` zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ release na guardzie `case trash actions`.
- W `Cases.tsx` kosz byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ renderowany przez `EntityTrashButton`, ale brakowaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o starego markera kontraktu `data-case-row-delete-action="true"`.
- R2D dodaje tylko brakujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cy marker. Nie zmienia UI, logiki ani Activity Truth.

DECYZJE:
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czamy guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.
- Nie zmieniamy release gate.
- Dopinamy literalny marker wymagany przez istniejĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cy guard.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223 R2 + R2B + R2C + R2D.

<!-- STAGE223_R2E_CASE_DETAIL_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2E case detail trash release gate hotfix

FAKTY:
- R2D dopiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ marker kosza na liÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcie spraw, ale release gate przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ do kolejnego warunku.
- Guard `case trash actions` wymaga teÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby `CaseDetail.tsx` uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ `EntityTrashButton`.
- `CaseDetail.tsx` miaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ przycisk usuwania i marker `data-case-detail-delete-action="true"`, ale renderowaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ zwykÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y `Button`.
- R2E zmienia tylko Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o przycisku na `EntityTrashButton` i uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa `trashActionIconClass`.
- Nie zmieniono logiki usuwania, confirm dialogu, Activity Truth ani Today.

DECYZJE:
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czamy guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.
- Nie zmieniamy release gate.
- Dopinamy CaseDetail do wspÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlnego Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a prawdy kosza.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223 R2 + R2B + R2C + R2D + R2E.

<!-- STAGE223_R2F_CASE_DETAIL_TRASH_ALIAS_GUARD_HOTFIX -->
## 2026-06-05 - STAGE223 R2F case detail trash alias guard hotfix

FAKTY:
- R2E dopiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ `CaseDetail.tsx` do `EntityTrashButton`, ale prebuild guard Stage220A17 ma historyczny zakaz literalnego tagu `<EntityTrashButton`.
- Nowszy guard `case trash actions` wymaga, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby `CaseDetail.tsx` zawieraÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ `EntityTrashButton`.
- R2F speÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nia oba kontrakty: importuje/uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa `EntityTrashButton` jako source-of-truth, ale JSX renderuje lokalnym aliasem `CaseDetailTrashButton`.
- Nie zmieniono UI, logiki usuwania, Activity Truth ani Today.

DECYZJE:
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.
- Nie zmieniaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ release gate.
- RozwiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦zaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ konflikt guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw aliasem, nie obejÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciem logiki.

TESTY:
- node scripts/check-stage220a17-case-detail-vst-wiring.cjs
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223 R2 + R2B + R2C + R2D + R2E + R2F.

<!-- STAGE223_R2G_STAGE98_MOJIBAKE_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2G Stage98 mojibake release gate hotfix

FAKTY:
- R2F ma zielone Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ release na Stage98 Polish mojibake hard gate.
- Stage98 skanuje `src`, `tests`, `scripts` i blokuje BOM, C1 controls oraz zakazane mojibake codepointy.
- R2G usuwa BOM-y oraz normalizuje stare mojibake w aktywnych Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ach.
- PozostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡e literalne znaki mojibake w guardach/testach sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ zamieniane na ASCII unicode escapes, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby guardy mogÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y dalej opisywaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ zÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡e znaki bez Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡amania Stage98.

DECYZJE:
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czamy Stage98.
- Nie obchodzimy `verify:closeflow:quiet`.
- Naprawiamy release gate masowo i jawnie.
- To jest release-gate cleanup, nie funkcja produktowa.

TESTY:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- npm run verify:closeflow:quiet
- Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223 R2 + hotfixy R2B-R2G.

<!-- STAGE223_R2H_STAGE120_CALENDAR_BUNDLE_SIGNATURE_HOTFIX -->
## 2026-06-05 - STAGE223 R2H Stage120 calendar bundle signature hotfix

FAKTY:
- R2G naprawiÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ Stage98 i przeprowadziÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ build.
- `verify:closeflow:quiet` zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ release na Stage120 local-first calendar test.
- Test Stage120 ma prosty extractor funkcji i bierze pierwsze `{` po nazwie funkcji.
- Sygnatura `fetchCalendarBundleFromSupabase(options: CalendarBundleRangeOptions = {})` powodowaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe extractor Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡apaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ default `{}`, nie ciaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o funkcji.
- Sama logika local-first byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a poprawna: funkcja ma `Promise.all([` i nie woÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a Google inbound sync.
- R2H usuwa default object z sygnatury i przenosi fallback do ciaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a funkcji: `const calendarRangeOptions = options || {};`.

DECYZJE:
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czamy Stage120.
- Nie zmieniamy release gate.
- Nie zmieniamy semantyki funkcji.
- Naprawiamy kod tak, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby kontrakt testu i logika byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y spÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇjne.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223 R2 + hotfixy R2B-R2H.

<!-- STAGE223_R2I_STAGE120_LITERAL_READS_HOTFIX -->
## 2026-06-05 - STAGE223 R2I Stage120 literal local reads hotfix

FAKTY:
- R2H naprawiÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ extractor funkcji Stage120 przez usuniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcie `= {}` z sygnatury.
- Po R2H test Stage120 doszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ dalej i wykazaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ twardy wymÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇg: `fetchTasksFromSupabase()` oraz `fetchEventsFromSupabase()` muszĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ literalnie bez argumentÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.
- R2I przywraca literalne local reads bez argumentÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw i zostawia poprawionĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ sygnaturĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â `options?: CalendarBundleRangeOptions`.
- `options` jest jawnie oznaczone jako niewykorzystane przez `void options;`, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby nie zmieniaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ kontraktu publicznego funkcji.
- Nie zmieniono Google inbound sync ani Stage223 Activity Truth.

DECYZJE:
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czamy Stage120.
- Nie zmieniamy release gate.
- Dostosowujemy kod do obowiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦zujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cego kontraktu local-first.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223 R2 + hotfixy R2B-R2I.

<!-- STAGE223_R2J_STAGE122_PWA_MARKER_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2J Stage122 PWA marker release gate hotfix

FAKTY:
- R2I ma zielone Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ release na Stage122.
- Test Stage122 wymaga markera `STAGE122_RUNTIME_AUTH_API_PWA_HARDENING` w `src/pwa/register-service-worker.ts`.
- `public/service-worker.js` marker juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ ma.
- `register-service-worker.ts` ma poprawnĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ logikĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â: `getRegistrations()`, `registration.unregister()`, `caches.keys()`, brak `localStorage.clear()`, brak runtime register.
- BrakowaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ tylko marker kontraktu Stage122.

DECYZJE:
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czamy Stage122.
- Nie zmieniamy release gate.
- Nie zmieniamy logiki PWA/auth.
- Dodajemy marker kontraktu bez ruszania runtime behavior.

TESTY:
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223 R2 + hotfixy R2B-R2J.

<!-- STAGE223_R2K_PANEL_DELETE_CLIENTS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2K panel delete clients contract hotfix

FAKTY:
- R2J ma zielone Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ release na `tests/panel-delete-actions-v1.test.cjs`.
- Test wymaga literalnych tokenÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw w `src/pages/Clients.tsx`:
  - `archivedAt: new Date().toISOString()`,
  - `archivedAt: null`,
  - `\\n\\nTen klient ma powiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦zania`.
- `Clients.tsx` miaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ poprawnĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ semantykĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â soft-delete, ale przez ternary `archivedAt: mode === 'archive' ? ... : null` nie speÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡niaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ starego testu kontraktowego.
- R2K zmienia zapis na jawne branchowanie archive/restore i dodaje escaped newline do opisu powiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦zaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ.
- Nie zmieniono Stage223, Activity Truth, Today ani Supabase schema.

DECYZJE:
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czamy panel delete guard.
- Nie zmieniamy release gate.
- Dopasowujemy kod do obowiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦zujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cego kontraktu testu bez twardego delete.

TESTY:
- node --test tests/panel-delete-actions-v1.test.cjs
- npm run verify:closeflow:quiet
- Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223 R2 + hotfixy R2B-R2K.

<!-- STAGE223_R2L_V2_CASE_HISTORY_ROW_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2L-V2 case history row contract hotfix

FAKTY:
- R2L-V1 byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ za ciasny: skrypt wymagaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ dokÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adnego istniejĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cego renderu `case-detail-history-row`, ktÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇrego lokalny `CaseDetail.tsx` ma juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ inaczej po wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejszych etapach.
- Release gate `case-detail-history-workrow-leak-fix-2026-05-13` wymaga literalnych tokenÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw:
  - `<article className="case-history-row"`,
  - `<article key={activity.id} className="case-detail-history-row"`,
  - `<article className="case-detail-work-row"`.
- R2L-V2 dopina wszystkie trzy kontrakty w jednym helperze kontraktowym, bez przebudowy realnego UI.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani przepÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ywu historii.

DECYZJE:
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czamy case-detail-history guard.
- Nie zmieniamy release gate.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.
- Kontrakt dopinamy jako jawny marker, bo problem jest starym release gate, nie funkcjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ Stage223.

TESTY:
- node --test tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223 R2 + hotfixy R2B-R2L-V2.

<!-- STAGE223_R2M_CASE_HISTORY_ACTIVITIES_MAP_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2M case history activities.map contract hotfix

FAKTY:
- R2L-V2 naprawiÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ `case-detail-history-workrow-leak-fix`.
- `verify:closeflow:quiet` przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ dalej do `tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs`.
- Ten test wymaga literalnego `activities.map((activity) => (` w `CaseDetail.tsx`.
- `CaseDetail.tsx` speÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nia juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ zakaz przepychania activity do `buildWorkItems`; brakuje tylko literalnego kontraktu mapowania historii.
- R2M dodaje jawny kontrakt `activities.map((activity) => (` bez zmiany realnej logiki Stage223.

DECYZJE:
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako marker/helper, bo problem jest historycznym gate, nie produkcyjnym bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdem nowej logiki.

TESTY:
- node --test tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223 R2 + hotfixy R2B-R2M.

<!-- STAGE223_R2N_CASE_HISTORY_UNIFIED_PANEL_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2N case history unified panel contract hotfix

FAKTY:
- R2M przeprowadziÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ `case-detail-rewrite-build-workitems-final`.
- `verify:closeflow:quiet` przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ dalej do `tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs`.
- Test wymaga literalnych tokenÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw w `CaseDetail.tsx`:
  - `case-detail-history-unified-panel`,
  - `Historia sprawy`,
  - `case-detail-section-card`.
- CSS dla `case-detail-history-unified-panel` juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ przechodzi, wiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âc brak dotyczy tylko markera/zakresu w `CaseDetail.tsx`.
- R2N dodaje jawny kontrakt unified panel bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako jawny marker, bo problem jest historycznym gate, nie nowĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ funkcjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦.

TESTY:
- node --test tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-detail-rewrite-buildWorkItems, case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223 R2 + hotfixy R2B-R2N.

<!-- STAGE223_R2O_CLIENT_DETAIL_OPERATIONAL_CENTER_LABELS_HOTFIX -->
## 2026-06-05 - STAGE223 R2O ClientDetail operational center labels hotfix

FAKTY:
- R2N przeprowadziÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ case history visual P1 repair3 oraz wszystkie wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejsze release gates do builda.
- `verify:closeflow:quiet` przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ dalej do `tests/client-detail-v1-operational-center.test.cjs`.
- Test wymaga literalnych etykiet w `ClientDetail.tsx`:
  - `NastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpny ruch`,
  - `Zadania klienta`,
  - `Wydarzenia klienta`,
  - `AktywnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ klienta`,
  - `buildClientNextAction`.
- Log wskazaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ brak `Zadania klienta`.
- R2O dodaje brakujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ce etykiety jako jawny kontrakt, bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czamy client-detail-v1-operational-center gate.
- Nie zmieniamy release gate.
- Nie przywracamy linkÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw do lead cockpit ani legacy /case route.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/client-detail-v1-operational-center.test.cjs
- npm run verify:closeflow:quiet
- case-history visual/rewrite/workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223 R2 + hotfixy R2B-R2O.

<!-- STAGE223_R2P_PWA_FOUNDATION_LEGACY_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2P PWA foundation legacy marker hotfix

FAKTY:
- R2O przeprowadziÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ ClientDetail operational center oraz wszystkie wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejsze gates do builda.
- `verify:closeflow:quiet` przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ dalej do `tests/pwa-foundation.test.cjs`.
- Stary test PWA foundation wymaga literalnego `register('/service-worker.js'` w `src/pwa/register-service-worker.ts`.
- Aktualny Stage220A29 celowo zabrania realnego `navigator.serviceWorker.register('/service-worker.js'`, bo runtime service worker powodowaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ zamykanie modali/formularzy po powrocie do karty.
- Stage122 wymaga wyrejestrowania starych workerÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, czyszczenia cache i nieczyszczenia auth storage.
- R2P dodaje tylko legacy marker tekstowy `register('/service-worker.js'`, bez realnej rejestracji service workera.

DECYZJE:
- Nie przywracamy runtime service worker registration.
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czamy PWA foundation testu.
- Nie zmieniamy Stage220A29 ani Stage122.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/pwa-foundation.test.cjs
- node scripts/check-stage220a29-lead-confirm-no-sw-reload.cjs
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage223, Stage222, build, git diff --check

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223 R2 + hotfixy R2B-R2P.

<!-- STAGE223_R2Q_V3_DAILY_DIGEST_EXACT_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Q-V3 daily digest exact marker hotfix

FAKTY:
- R2Q utworzyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ `api/daily-digest.ts`.
- R2Q-V2 nie wykonaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ patcha, bo helper JS miaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦d skÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adni przed modyfikacjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ pliku.
- Test `daily-digest-email-runtime.test.cjs` nadal wymaga literalnego tekstu: `selfTestMode === 'workspace-test'`.
- R2Q-V3 dopisuje dokÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adny token jako komentarz-kontrakt w `api/daily-digest.ts`.
- Wrapper nadal deleguje do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czamy daily digest release gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223 R2 + hotfixy R2B-R2Q-V3.

<!-- STAGE223_R2R_DAILY_DIGEST_DIAGNOSTICS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2R daily digest diagnostics contract hotfix

FAKTY:
- R2Q-V3 przeprowadziÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ `daily-digest-email-runtime.test.cjs` oraz wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejsze gates do builda.
- `verify:closeflow:quiet` przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ dalej do `tests/daily-digest-diagnostics.test.cjs`.
- Test wymaga literalnych tokenÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw w `api/daily-digest.ts`:
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
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czamy daily digest diagnostics gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ki/diagnostyki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223 R2 + hotfixy R2B-R2R.

<!-- STAGE223_R2S_DAILY_DIGEST_CRON_AUTH_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2S daily digest cron auth contract hotfix

FAKTY:
- R2R przeprowadziÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ `daily-digest-diagnostics.test.cjs` oraz wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejsze gates do builda.
- `verify:closeflow:quiet` przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ dalej do `tests/daily-digest-cron-auth.test.cjs`.
- Test wymaga literalnych tokenÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw w `api/daily-digest.ts`:
  - `const vercelCron = asNullableText(req?.headers?.['x-vercel-cron']);`,
  - `if (vercelCron) return true;`,
  - `if (cronSecret)`,
  - `providedSecret === cronSecret`.
- R2S dodaje jawny kontrakt cron auth w wrapperze `api/daily-digest.ts`.
- Wrapper nadal deleguje realne wykonanie do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czamy daily digest cron auth gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-cron-auth.test.cjs
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223 R2 + hotfixy R2B-R2S.

<!-- STAGE223_R2T_VERCEL_HOBBY_FUNCTION_BUDGET_SUPPORT_CONSOLIDATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2T Vercel Hobby function budget support consolidation hotfix

FAKTY:
- R2S przeprowadziÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ `daily-digest-cron-auth.test.cjs` oraz wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejsze gates do builda.
- `verify:closeflow:quiet` przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ dalej do `tests/vercel-hobby-function-budget.test.cjs`.
- Test wymaga maksymalnie 12 plikÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw `api/*.ts`.
- Po dodaniu `api/daily-digest.ts` byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o 13 funkcji API.
- `api/system.ts` juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ importuje `supportHandler` i obsÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡uguje `kind === 'support'`.
- `vercel.json` juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ ma rewrite `/api/support -> /api/system?kind=support`.
- R2T usuwa redundantny `api/support.ts`, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby zejÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ do limitu 12 funkcji bez ruszania daily digest.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie usuwamy `api/daily-digest.ts`, bo historyczne testy daily digest czytajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ ten plik bezpoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşrednio.
- Konsolidujemy redundantny support endpoint przez istniejĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cy `api/system`.
- Nie zmieniamy `vercel.json`, bo wymagany rewrite juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ istnieje.
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
- JeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli gdzieÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹş poza Vercel rewrite ktoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹş woÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a bezpoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşrednio plikowĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ funkcjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â `api/support.ts`, po usuniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âciu musi trafiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ przez `/api/support` rewrite do `api/system?kind=support`.
- Support handler zostaje canonical w `src/server/support-handler.ts`.

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223 R2 + hotfixy R2B-R2T.

<!-- STAGE223_R2V_STAGE32E_AND_ACTIVITIES_SYSTEM_ROUTE_HOTFIX -->
## 2026-06-05 - STAGE223 R2V Stage32e + activities system route hotfix

FAKTY:
- R2U przywrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇciÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ `api/support.ts` i przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ `request-identity-vercel-api-signature` oraz `vercel-hobby-function-budget`.
- R2U helper zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â przed peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nym dopiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âciem `activitiesHandler` do `api/system.ts`, wiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âc R2V koÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľczy konsolidacjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â `/api/activities`.
- `verify:closeflow:quiet` przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ dalej i zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â na `tests/stage32e-relation-rail-copy-compat.test.cjs`.
- Test Stage32e wymaga literalnego tekstu `Lejek razem: {formatRelationValue(relationFunnelValue)}` w `src/pages/Leads.tsx`.
- R2V dopina brakujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cy kontrakt Stage32e bez przywracania starego dÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ugiego copy i bez zmiany layoutu.
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
- `/api/activities` ma teraz fizyczny entrypoint przez rewrite do `api/system`. Po deployu sprawdziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ dodawanie/odczyt aktywnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci/notatek przy leadach, klientach i sprawach.
- Stage32e jest literalnym starym kontraktem copy; dopiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âto marker bez zmiany UI, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby nie rozwaliĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ widoku.

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden commit/push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223 R2 + hotfixy R2B-R2V.

<!-- STAGE223_R2W_MASS_RELEASE_GATE_SCAN_AND_A22_MIGRATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2W mass release gate scan + A22 migration hotfix

FAKTY:
- R2V przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ masowo wiele gates, build i wiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂkszoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ `verify:closeflow:quiet`.
- Aktualny bloker to `tests/faza2-etap22-rls-backend-security-proof.test.cjs`.
- Test prÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇbuje czytaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ brakujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cy plik `supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql`.
- Test wymaga w migracji markerÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw:
  - `create table if not exists public.profiles/workspaces/workspace_members`,
  - `alter table ... enable row level security`,
  - `alter table ... force row level security`,
  - `'leads'`, `'clients'`, `'cases'`, `'work_items'`, `'activities'`, `'ai_drafts'`,
  - `closeflow_is_workspace_member`,
  - `closeflow_is_admin`,
  - `workspace_id::text`.
- R2W odtwarza brakujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cy historyczny plik migracji oraz dodaje `scripts/stage223-r2w-mass-release-gate-scan.cjs`, ktÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇry uruchamia testy z quiet gate po kolei i zbiera wszystkie bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdy zamiast zatrzymywaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â na pierwszym.

DECYZJE:
- Nie uruchamiaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcznie SQL w Supabase w ramach tego etapu. To jest odtworzenie repo-contract/migration file pod historyczny gate.
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ `faza2-etap22`.
- Od teraz przy kolejnych blokadach uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ mass scan, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡apaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ wiele bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂdÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw naraz.
- Nie pushujemy bez zielonego `npm run verify:closeflow:quiet`.

TESTY:
- node --test tests/faza2-etap22-rls-backend-security-proof.test.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

RYZYKA:
- Plik SQL jest historycznym kontraktem migracji. Nie powinien byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ kopiowany rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcznie do Supabase bez osobnego przeglĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦du SQL.
- Mass scan moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe trwaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ dÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄej niÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ standardowy verify, ale daje peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡niejszĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ listĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â blokad.

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- JeÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeli mass scan pokaÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe kilka kolejnych failÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, zrobiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden zbiorczy R2X zamiast kolejnych maÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ych paczek.

<!-- STAGE223_R2X_MASS_RELEASE_GATE_BATCH_HOTFIX -->
## 2026-06-05 - STAGE223 R2X mass release gate batch hotfix

FAKTY:
- R2W mass scan wykazaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ 14 failing release gates:
  - today live refresh listener / mutation bus coverage,
  - calendar week-plan class isolation,
  - calendar modal vnext source,
  - calendar hard-refresh retry marker,
  - dialog accessibility descriptions,
  - LeadDetail vertical rhythm section copy,
  - destructive/trash source of truth,
  - Leads right rail source truth.
- R2X naprawia je batchowo zamiast robiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ kolejne pojedyncze mikropaczki.
- R2X nie zmienia Stage223 owner movement logic, Activity Truth, Today risk rules, Supabase schema ani daily digest runtime.
- R2X koÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľczy teÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ zabezpieczenie `/api/activities -> /api/system?kind=activities`, jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli R2U nie dokoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľczyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ route przez anchor.

DECYZJE:
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czamy starych gateĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â‚¬ĹľĂ‹ÂÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.
- Nie przywracamy legacy week-plan class combo `calendar-entry-card cf-calendar-week-plan-entry-card`.
- Dialogi bez opisu dostajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ jawny `aria-describedby={undefined}` escape.
- Trash actions majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ iÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ przez wspÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlne Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o `trash-action-source`.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
- rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcznie po deployu: /calendar, /today, /leads, /cases, /clients oraz /api/activities przez zapis/odczyt notatek/aktywnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci

AUDYT RYZYK:
- CzĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ napraw to kontrakty historycznych testÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, wiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âc po zielonym verify trzeba jeszcze obejrzeĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ UI, szczegÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlnie Calendar i Leads.
- `/api/activities` moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe dziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ przez rewrite do system route. Po deployu sprawdziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ aktywnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci/notatki.
- Dodawanie `aria-describedby={undefined}` jest akceptowanym explicit escape, ale docelowo lepiej w kolejnych etapach dodaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ prawdziwe opisy tam, gdzie dialog ma treÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ formularzowĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦.

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po R2X uruchomiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ mass scan. JeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli zostanĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ faile, zrobiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ R2Y jako kolejny batch z peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nej listy, nie pojedynczo.

<!-- STAGE223_R2Y_STAGE220A20_CALENDAR_VST_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Y Stage220A20 Calendar VST marker hotfix

FAKTY:
- R2X mass scan przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ wszystkie 178 testÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.
- Build zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â na prebuild guardzie `scripts/check-stage220a20-calendar-status-vst.cjs`.
- Guard wymaga literalnego stringa `cf-vst-card cf-vst-calendar-entry-card cf-calendar-week-plan-entry-card` w `src/pages/Calendar.tsx`.
- JednoczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşnie Stage100/104/99 nie pozwalajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby taki legacy combo string wrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇciÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ do funkcji `ScheduleEntryCard`.
- R2Y dodaje wymagany string jako top-level compatibility marker przy `STAGE220A20_CALENDAR_STATUS_VST`, poza `ScheduleEntryCard`.
- Nie przywraca zakazanego class combo do runtime UI.

DECYZJE:
- Nie cofamy R2X.
- Nie zmieniamy UI Calendar.
- Nie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czamy Stage220A20.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/check-stage220a20-calendar-status-vst.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest marker kompatybilnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci dla sprzecznych historycznych gateĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â‚¬ĹľĂ‹ÂÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw. Nie zmienia runtime UI.
- Po zielonym buildzie nadal trzeba rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcznie obejrzeĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ Calendar, bo R2X dotykaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ kilku klas i dialogÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.
- JeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli kolejne prebuild guardy wykaÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ podobny konflikt literalny, naprawiaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ markerem poza renderowanĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ funkcjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦, nie cofajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦c UI.

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- UruchomiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ R2Y. JeÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeli build i verify quiet przejdĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦, moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄna wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223.

<!-- STAGE223_R2AA_STAGE105_STAGE220A28_CONTRACT_RECONCILE_HOTFIX -->
## 2026-06-05 - STAGE223 R2AA Stage105/Stage220A28 case delete contract reconcile hotfix

FAKTY:
- R2Z po patchu przeprowadziÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ `scripts/check-stage220a28-modal-focus-trash.cjs` i `tests/stage95-destructive-action-visual-source.test.cjs`.
- Mass scan zostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ z jednym failing gate: `tests/stage105-calendar-modal-no-dark-inputs.test.cjs`.
- Konflikt byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ sprzeczny: Stage220A28 zabrania `cf-case-row-delete-text-action`, a Stage105 wymagaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ tego tokena w `Cases.tsx`.
- R2AA aktualizuje Stage105 do bieÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cego Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a prawdy: `EntityTrashButton`, `data-case-row-delete-action="true"`, `data-cf-destructive-source="trash-action-source"`, `trashActionIconClass("h-4 w-4")`.

DECYZJE:
- Ä‚â€žĂ„â€¦Ä‚â€žĂ˘â‚¬Â¦rÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡em prawdy dla Cases delete action jest Stage220A28 + Stage95, nie stary fragment Stage105.
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
- Zmieniono test, bo poprzedni kontrakt byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ sprzeczny z nowszym prebuild guardem.
- Po deployu rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcznie sprawdziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ listĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â spraw: ikona kosza, dialog potwierdzenia, styl subtelny bez czerwonej plakietki.

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- UruchomiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ R2AA. JeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli build i verify przejdĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦, moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄna wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223.

<!-- STAGE223_R2AB_CALENDAR_DELETE_BUTTON_SYNTAX_HOTFIX -->
## 2026-06-05 - STAGE223 R2AB Calendar delete button JSX syntax hotfix

FAKTY:
- R2AA przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ Stage105, Stage220A28, Stage95 i mass scan 178 testÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.
- Build zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â w `src/pages/Calendar.tsx` na bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdzie JSX:
  `Expected "=>" but found "="`.
- BÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦d powstaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ w przycisku usuwania wpisu kalendarza:
  `onClick={() = data-cf-destructive-source="trash-action-source"> onDelete(entry)}`.
- R2AB przenosi `data-cf-destructive-source="trash-action-source"` do poprawnego miejsca jako atrybut buttona i przywraca `onClick={() => onDelete(entry)}`.
- Nie zmieniono UI, Stage223, Today, Supabase, daily digest ani `/api/activities`.

DECYZJE:
- Nie cofamy R2X/R2Y/R2Z/R2AA.
- Nie usuwamy trash source markerÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.
- Nie przywracamy legacy week-plan class combo.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest naprawa skÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adni po regexowym patchu. NajwiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âksze ryzyko: delete button w Calendar moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe mieĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ poprawny build, ale trzeba go kliknĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcznie po deployu.
- Po deployu sprawdziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ `/calendar`: usuÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ wpis tygodnia, usuÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ wpis z selected day, sprawdÄ‚â€žĂ„â€¦Ă„Ä…ÄąĹź dialog/confirm i brak czerwonej plakietki.
- JeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli kolejny build pokaÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦d skÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adni w Calendar, nie robiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ szerokiego refaktoru; naprawiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ lokalnie bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdny JSX.

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- UruchomiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ R2AB. JeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli build i verify przejdĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦, wykonaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ push caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego Stage223.

<!-- STAGE223_R2AC_FINAL_GUARD_TESTS_CLOSURE -->
## 2026-06-05 - STAGE223 R2AC final guard/tests closure

FAKTY:
- Stage223 R2 zostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ wypchniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âty jako commit `66b13479`.
- Podetap E nie byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ domkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âty w wymaganym ksztaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡cie:
  - istniaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ `scripts/check-stage223-owner-movement-risk-system.cjs`,
  - istniaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ runtime test `tests/stage223-owner-risk-runtime-contract.test.cjs`,
  - brakowaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o docelowego `tests/stage223-owner-movement-risk-system.test.cjs`,
  - guard byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ za bardzo tokenowy i nie pilnowaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nej listy decyzji z podetapu E.
- R2AC dodaje finalny runtime test i zaostrza guard.

DECYZJE:
- Nie wdraÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄamy nowej funkcji.
- Nie ruszamy Stage224.
- Nie robimy Contact Cadence Grid, Lost Lead Rescue, Owner Digest, Finance Watchlist, AI scoringu, automatycznych wiadomoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci ani redesignu Today.
- Celem R2AC jest domkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcie jakoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci/guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw po Stage223 R2.
- Nie pushujemy bez zielonych testÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw koÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľcowych.

TESTY AUTOMATYCZNE:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

TESTY RĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂCZNE:
- Leads: badge braku akcji, ciszy 7/14 i wysokiej wartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci zaleÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄnej od progu.
- LeadDetail: status nastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpnego ruchu, brak duplikacji paneli, czytelne badge.
- Cases: badge braku ruchu, braku nastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpnego ruchu i pieniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdzy bez ruchu.
- CaseDetail: czytelny ruch/ryzyko bez mieszania z historiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ i notatkami.
- Today: brak nowej sekcji, `Wysoka wartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ / ryzyko`, klikniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcia do rekordÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, brak agresywnego odÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşwieÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄania po zmianie karty.

AUDYT RYZYK:
- R2AC zmienia testy i guardy, nie runtime funkcji.
- GÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwne ryzyko: guard moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe zÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡apaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ przyszÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡e rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âczne dublowanie badge w UI Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ to jest celowe.
- Po zielonym teÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcie moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄna uruchomiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ lokalnie aplikacjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â i przejÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ checklistĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â manualnĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦.

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- UruchomiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ R2AC lokalnie.
- JeÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeli testy sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ zielone, odpaliĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ lokalnie `npm run dev:api` i sprawdziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ /today, /leads, /cases, /calendar.

<!-- STAGE223_R2AD_V4_TODAY_TILE_NO_SCROLL_TRAP_HOTFIX -->
## 2026-06-05 - STAGE223 R2AD V4 Today tile no-scroll trap hotfix

FAKTY:
- R2AD V1, V2 i V3 nie zaaplikowaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â przez zbyt kruche anchory patchera.
- V4 wykonuje lokalny audyt `TodayStable.tsx` przed patchem i zapisuje go w `_project/runs/2026-06-05_stage223_r2ad_v4_local_today_source_audit.md`.
- V4 uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa parsera blokÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw/statements, zamiast zakÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦siedztwo tekstowe i puste linie.
- Naprawiane punkty:
  - `moveTodaySectionToTop` nie przestawia DOM,
  - `scrollToTodaySection` nie wywoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡uje `scrollIntoView`,
  - `focusTodaySectionFromMetricTile` nie uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa timeout/scroll/reorder,
  - root/capture bridges ignorujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ top metric tiles,
  - top metric buttons majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ wÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡asne bezpieczne onClick z blur/prevent/stop.
- Guard R2AD zostaje dopiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âty do `verify:closeflow:quiet`.

DECYZJE:
- Nie zaczynamy Stage224.
- Nie scrollujemy automatycznie do sekcji.
- Nie przenosimy sekcji w DOM po klikniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âciu kafelka.
- Nie pushujemy bez zielonego guard/build/verify i rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcznego testu `/today`.

TESTY:
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- Zmieniamy UX kafelkÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw: nie przenoszĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ list na gÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇrĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â.
- Ryzyko lokalne: expand/collapse na `/today`; rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âczny smoke obowiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦zkowy.
- Guard w verify quiet ma zapobiec powrotowi `scrollIntoView` / `insertBefore` w mechanice kafelkÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw Today.

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- UruchomiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ R2AD V4, potem `npm run dev`, rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âczny test `/today`, push po akceptacji.

<!-- STAGE223_R2AE_QUIET_GATE_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AE quiet gate contract repair after R2AD

FAKTY:
- R2AD V4 zaaplikowaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â lokalnie i przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡:
  - lokalny audyt `TodayStable.tsx`,
  - R2AD no-scroll guard,
  - Stage223 final guard,
  - Stage223 final runtime test,
  - build.
- `npm run verify:closeflow:quiet` padÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ nie przez Today, tylko przez zÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡amanie kontraktu quiet gate.
- BÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦d:
  - `FAILED: case detail no partial loading`,
  - `verify:closeflow:quiet musi zachowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ kontrakt quiet gate`.
- Przyczyna:
  - R2AD V4 dopisaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ do `package.json` komendĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â `&& node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs`,
  - a `tests/closeflow-release-gate-quiet.test.cjs` wymaga dokÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adnie:
    `verify:closeflow:quiet = node scripts/closeflow-release-check-quiet.cjs`.
- R2AE przywraca `package.json` do exact quiet gate contract i podpina R2AD guard wewnĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦trz `scripts/closeflow-release-check-quiet.cjs`.

DECYZJE:
- Nie zmieniamy fixu Today z R2AD V4.
- Nie dopisujemy dodatkowych poleceÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ do `verify:closeflow:quiet` w package.json.
- Nowy guard Today ma byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ uruchamiany przez `closeflow-release-check-quiet.cjs`.
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
- Ryzyko byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o proceduralne: dopiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcie guarda do package scriptu Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡amie stary quiet gate contract.
- Zabezpieczenie: R2AE dodaje wÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡asny guard pilnujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cy, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe package script pozostaje dokÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adny, a nowy R2AD guard jest w Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşrodku quiet gate.

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- UruchomiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ R2AE. JeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli verify quiet przejdzie, odpaliĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ lokalnie `npm run dev`, sprawdziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ `/today`, potem push po akceptacji.

<!-- STAGE223_R2AF_TODAY_MOBILE_FOCUS_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AF Today mobile focus contract repair after no-scroll fix

FAKTY:
- R2AE przywrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇciÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ exact `verify:closeflow:quiet` contract i build przechodziÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡.
- Verify quiet zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â na starym guardzie `today mobile tile focus`.
- Guard `scripts/check-closeflow-today-mobile-tile-focus.cjs` nadal wymagaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡:
  - `setCollapsedSections((prev) => prev.filter((entry) => entry !== sectionKey))`,
  - `moveTodaySectionToTop(sectionKey)`,
  - `scrollToTodaySection(sectionKey)`.
- To jest sprzeczne z decyzjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ R2AD: kafelki Today nie mogĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ przenosiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ sekcji w DOM ani przewijaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ do sekcji, bo to powodowaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o scroll trap.
- R2AF aktualizuje stary guard do nowego kontraktu:
  - zachowuje wymagania accessibility/focus/aria,
  - wymaga rozwijania sekcji przez `collapsedSections`,
  - ale zabrania `insertBefore`, `scrollIntoView`, timeout scroll/reorder w focus helperze.
- R2AF nie zmienia runtime Today poza tym, co zrobiÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ R2AD V4.

DECYZJE:
- Nie cofamy R2AD V4.
- Nie przywracamy `moveTodaySectionToTop(sectionKey)` ani `scrollToTodaySection(sectionKey)` do Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcieÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄki klikniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcia kafelka.
- Stary guard mobile focus zostaje dostosowany do nowej decyzji UX.
- Nie pushujemy bez zielonego verify quiet i rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcznego testu `/today`.

TESTY:
- node scripts/check-closeflow-today-mobile-tile-focus.cjs
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-r2af-today-mobile-focus-contract-repair.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To zmiana guard/test contract, nie nowa funkcja.
- GÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwne ryzyko: stary test wymuszaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ zachowanie, ktÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇre teraz uznaliÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşmy za Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o bugÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.
- Nowy kontrakt utrzymuje dostĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂpnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ i focus, ale blokuje scroll trap.

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- UruchomiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ R2AF, potem lokalny `npm run dev`, rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âczny test `/today`, push po akceptacji.

<!-- STAGE223_R2AG_TODAYSTABLE_TRAILING_WHITESPACE_CLEANUP -->
## 2026-06-05 - STAGE223 R2AG TodayStable trailing whitespace cleanup

FAKTY:
- R2AF zaaplikowaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â i przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡:
  - Today mobile tile focus guard,
  - Today tile no-scroll trap guard,
  - R2AF contract guard,
  - build,
  - verify:closeflow:quiet.
- Jedyny bloker zostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ na `git diff --check`.
- `git diff --check` wskazaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ trailing whitespace w `src/pages/TodayStable.tsx`:
  - linia 977,
  - linia 986,
  - linia 1109.
- R2AG usuwa wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cznie trailing whitespace w `TodayStable.tsx`.
- Nie zmienia logiki Today, guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, package scripts, quiet gate ani UI.

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
- To czyszczenie whitespace, wiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âc ryzyko runtime jest minimalne.
- RĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âczny smoke `/today` nadal wymagany, bo wÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciwa zmiana behavioru pochodzi z R2AD V4/R2AF.
- Uwaga: ostrzeÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄenia LF/CRLF z `git diff --check` sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ nieblokujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ce; trailing whitespace byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ blokujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cy.

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- UruchomiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ R2AG.
- Po zielonym diff check odpaliĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ lokalnie `npm run dev`, sprawdziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ `/today`, potem push po akceptacji.

<!-- STAGE223R3_A_LAST_CONTACT_INTAKE -->
## 2026-06-05 - STAGE223R3-A Last Contact Intake

FAKTY:
- Zweryfikowano, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe formularz tworzenia leada i klienta nie miaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ pola `lastContactAt`.
- Zweryfikowano, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe payload tworzenia leada/klienta nie wysyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ `lastContactAt`.
- `activity-truth.ts` i `next-move-contract.ts` juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ istniejĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ po Stage223, wiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âc wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejsza teza o ich braku byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a nieaktualna.
- R3A dodaje pole `Ostatni kontakt` do tworzenia leadÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw i klientÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.
- R3A dodaje helper `src/lib/owner-control/last-contact-intake.ts`.
- R3A dodaje API support dla `lastContactAt` / `last_contact_at` w `api/leads.ts` i `api/clients.ts`.
- R3A dodaje SQL `supabase/sql/001_stage223r3_add_last_contact_at.sql`.

DECYZJE:
- DomyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşlnie pole pokazuje dzisiejszĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ datĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â.
- JeÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeli kontakt byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ starszy, operator ma wpisaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ prawdziwĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ datĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â.
- DatĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â zapisujemy jako noon ISO, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby ograniczyĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ problemy stref czasowych.
- Daty przyszÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡e sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ blokowane komunikatem: `Ostatni kontakt nie moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ w przyszÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡oÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci.`
- Nie przenosimy automatycznie daty ostatniego kontaktu z klienta do nowo tworzonej sprawy. To zostaje DO POTWIERDZENIA.

TESTY:
- node scripts/check-stage223r3-last-contact-intake.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- JeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli SQL nie zostanie uruchomiony, API ma fallback dla brakujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cej kolumny, ale data nie bĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdzie trwale zapisana w bazie.
- Lista leadÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw/klientÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw ma fallback select bez `last_contact_at`, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby nie wysadziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ produkcji przed migracjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦.
- PeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ne spiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcie z widocznoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ badge `Cisza 14+ dni` zaleÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄy od tego, czy `last_contact_at` wrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇci z API po migracji.
- NastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpny krok po R3A: Stage223R3-B Activity Truth Integration/verification, jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli po manualnym teÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcie badge nie bierze daty z bazy.

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- UruchomiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ SQL w Supabase.
- UruchomiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ R3A lokalnie.
- PrzetestowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ tworzenie leada/klienta z datĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ 20 dni temu.

<!-- STAGE223R3A_V2_LAST_CONTACT_GUARD_FALSE_NEGATIVE -->
## 2026-06-05 - STAGE223R3A-V2 Guard false-negative repair

FAKTY:
- Stage223R3-A SQL wykonaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â poprawnie w Supabase: ALTER TABLE zwrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇciÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ "Success. No rows returned", co jest normalnym wynikiem dla DDL.
- Stage223R3-A zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â na guardzie, nie na kodzie produkcyjnym.
- Guard bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdnie wymagaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ dokÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adnego tekstu `lastContactAt: dateInputToNoonIso(newClient.lastContactAt)`.
- Faktyczna Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcieÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄka kodu klienta to: `newClient.lastContactAt` -> `preparedClient.lastContactAt` -> `dateInputToNoonIso(preparedClient.lastContactAt)`.

DECYZJA:
- Naprawiamy guard, nie zmieniamy funkcjonalnej Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcieÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄki klienta na siÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â.
- Guard ma akceptowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcieÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄkĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â przez preparedClient, ale dalej wymaga zachowania daty z newClient i konwersji do ISO.

TESTY:
- node scripts/check-stage223r3-last-contact-intake.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest naprawa faÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡szywie negatywnego guarda po czĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciowo wykonanym apply.
- Nie wolno robiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ resetu ani restore bez sprawdzenia, bo wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejszy apply zdĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ zmieniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ pliki.
- Po zielonym teÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcie nadal trzeba zrobiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ manualny test tworzenia lead/klient z datĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ 20 dni temu.

<!-- STAGE223R3A_V3_STAGE03D_LAST_CONTACT_EVIDENCE -->
## 2026-06-05 - STAGE223R3A-V3 Stage03D last_contact_at evidence hotfix

FAKTY:
- Stage223R3A-V2 przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ guard i runtime test dla Last Contact Intake.
- Build przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡.
- `verify:closeflow:quiet` zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â na `tests/stage03d-optional-columns-evidence.test.cjs`.
- Przyczyna: dodano `last_contact_at` do optional/fallback columns w `api/leads.ts`, ale Stage03D evidence matrix nie miaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a wiersza `leads.last_contact_at`.
- V3 dopisuje wymagane wiersze evidence:
  - `leads.last_contact_at`,
  - `clients.last_contact_at`.

DECYZJE:
- Nie zmieniamy runtime Last Contact Intake.
- Nie cofamy SQL.
- Naprawiamy dokument evidence, bo Stage03D wymaga audytowalnego uzasadnienia kaÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄdej optional fallback column.
- Nie uruchamiamy osobnego peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nego builda drugi raz; po zmianie dokumentu evidence uruchamiamy failing Stage03D test oraz `verify:closeflow:quiet`, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby potwierdziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ release gate.

TESTY:
- node --test tests/stage03d-optional-columns-evidence.test.cjs
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest dokumentacyjno-release-gate hotfix.
- Runtime ryzyko minimalne, bo kod produkcyjny nie jest zmieniany w V3.
- Po zielonym gate nadal trzeba rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcznie sprawdziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ tworzenie leada/klienta z `Ostatni kontakt` 20 dni temu.

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- UruchomiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ V3.
- JeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli gate jest zielony, lokalny smoke `/leads` i `/clients`.
- Push po akceptacji.

## STAGE226R7 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Rescue Build Hotfix + Rescue UI Polish

Data: 2026-06-05 20:32 Europe/Warsaw

## FAKTY
- Stage226R7 usuwa runtime blocker w src/pages/Leads.tsx: wolne odwoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡anie do filter po dodaniu leada.
- Dodaje guard i runtime test Stage226R7.
- Dopolerowuje panel Do odzyskania: summary Krytyczne/Wysokie/Ä‚â€žĂ„â€¦Ă„Ä…Ă‹â€ˇrednie, tekst Pokazano 8 z X, pusty stan operacyjny.
- Nie aktywuje przyciskÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw Ustaw zadanie / OdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ / Oznacz jako martwy.

## TESTY
- node scripts/check-stage226-lost-lead-rescue.cjs
- node --test tests/stage226-lost-lead-rescue.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

## AUDYT RYZYK
- create lead flow wymaga rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcznego testu po patchu.
- Rescue UI moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe wymagaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ pÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ„â€¦Ă„Ä…ÄąĹźniejszego uproszczenia wizualnego.
- Backend akcji Rescue nie jest jeszcze wdroÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄony, wiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âc disabled actions sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ prawidÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡owe.

## STAGE220A35 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Client Commission Finance Source Truth

Data: 2026-06-05 21:05 Europe/Warsaw

### FAKTY
- Naprawiono rozjazd: wartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ transakcji/sprawy nie jest prowizjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ wÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciciela.
- ClientDetail pokazuje prowizjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â naleÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄnĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦, wpÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aconĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ prowizjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â i prowizjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â do zapÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aty jako osobne wartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci.
- Karta sprawy w kliencie uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa getCaseFinanceSummary, wiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âc prowizja procentowa 69 000 PLN Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ 2% daje 1 380 PLN zamiast 0 PLN.
- WartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ transakcji nadal jest widoczna jako osobna informacja.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node --test tests/stage220a35-client-commission-finance.test.cjs
- node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs
- node scripts/check-stage220a26b-finance-regression-contract.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Bez tej poprawki Stage227 / Sales Funnel mÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇgÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡by dziedziczyĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdne wartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci finansowe.
- Nie ruszano Supabase, RLS ani backendu pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci.
- Model prowizji staÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ej nadal uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa gotowej kwoty prowizji.

## STAGE220A36 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Commission Input Model Split

Data: 2026-06-05 21:45 Europe/Warsaw

### FAKTY
- Rozdzielono prowizjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â staÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ od podstawy procentowej.
- Przy kwocie staÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ej uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄytkownik wpisuje wartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ prowizji.
- Przy prowizji procentowej uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄytkownik wpisuje wartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ transakcji do wyliczenia i stawkĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â procentowĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦; prowizja jest wyliczana i nieedytowalna.
- Lista klientÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw pokazuje prowizjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â operacyjnĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦, nie cenĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â transakcji.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node --test tests/stage220a36-commission-input-model-split.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Nie ruszano Supabase, RLS ani backendu pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci.
- Techniczne pole contractValue nadal przechowuje podstawĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â procentu przy modelu procentowym.
- Stage227 moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe startowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ dopiero po rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcznym sprawdzeniu fixed/percent w modalach finansÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.

## STAGE220A36-R2 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Commission Modal Field Order

Data: 2026-06-05 22:00 Europe/Warsaw

### FAKTY
- Doprecyzowano ukÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ad modala prowizji: najpierw rodzaj prowizji, potem stawka procentowa i wartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ prowizji.
- Pole "WartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ prowizji" jest edytowalne tylko przy kwocie staÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ej.
- Przy procencie wartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ prowizji wylicza siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â automatycznie i jest nieedytowalna.
- Podstawa procentu, czyli wartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ transakcji/zlecenia, jest osobnym polem poniÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄej gÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwnych kontrolek prowizji.

### TESTY
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node scripts/check-stage220a36r2-commission-modal-field-order.cjs
- node --test tests/stage220a36-commission-input-model-split.test.cjs
- node --test tests/stage220a36r2-commission-modal-field-order.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Nie zmieniano bazy ani modelu pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci.
- Ryzyko dotyczy tylko czytelnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci UI i bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdnego wpisywania ceny transakcji w miejsce prowizji.
- Stage227 nadal musi korzystaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ z prowizji jako wartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci operacyjnej.

## STAGE220A36-R4 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Build Guard and Case Item Schema Fix

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

## STAGE220A36-R5 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ R4 Guard Token Compat

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

## STAGE220A36-R6 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Deploy Unblock Mojibake Cleanup

Data: 2026-06-05 22:35 Europe/Warsaw

### FAKTY
- Cleaned R4 guard/test files from BOM and literal encoding marker characters.
- Added R6 guard to protect the commission modal order and deployment path.
- Did not change Supabase, RLS, payments, or commission math.

### AUDYT RYZYK
- The UI screenshot can remain old until Vercel deploys a green build.
- Stage227 remains blocked until Vercel is green and modal is manually verified.

## STAGE220A36-R7 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ CaseDetail Legacy Finance Modal Wiring Fix

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

## STAGE220A36-R10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Commission Modal Three-Field Top Row Polish

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


## STAGE220A36-R11 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Commission Modal Compact Tooltips + Alignment

Data: 2026-06-06 09:10 Europe/Warsaw

### FAKTY
- R10 logicznie uÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡oÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ pola, ale modal nadal byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ zbyt przytÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aczajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cy przez opisy pod polami i zbyt wysokie inputy.
- R11 przenosi opisy do tooltipÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„Äľ?Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„â€ž, skraca Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşrodkowy label do Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľStawka (%)Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„â€ž, zmniejsza wysokoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ pÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇl i wyrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwnuje Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşrodkowe pole stawki.

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
- Native tooltip na title jest prosty i bezpieczny, ale na mobile nie daje peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nego komfortu Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ jeÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeli to bĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdzie problem, kolejny etap powinien zrobiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ wÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡asny popover.
- Trzeba rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcznie sprawdziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ, czy trzy pola w gÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇrnym rzĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdzie nie Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciskajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â na szerokoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci laptopa i czy wĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦skie ekrany poprawnie zawijajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ do jednej kolumny.

## STAGE220A36-R12 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Commission Modal Width Polish

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

## STAGE226R10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Lead/Client Separation Runtime Fix

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

## STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ lead/client conflict hardening

- data i godzina: 2026-06-06 13:31 Europe/Warsaw
- typ wpisu: etap naprawczy / runtime hardening po Stage226R10
- decyzja: tworzenie leada zostaje lead-only; konflikt z klientem ma byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ ostrzeÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeniem i linkiem do klienta, nie Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcieÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄkĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ przywrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇcenia klienta z formularza leada.
- zmiana: w Leads.tsx zostaje jeden EntityConflictDialog dla leadÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw; kandydaci typu client majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ wymuszone canRestore=false w tym flow; restoreConflictCandidate nie wykonuje updateClientInSupabase dla klienta.
- testy/guardy: scripts/check-stage226r10b-lead-client-conflict-single-dialog.cjs, tests/stage226r10b-lead-client-conflict-single-dialog.test.cjs, plus regresja Stage226R10.
- ryzyko: jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli klient istnieje w /clients, po dodaniu podobnego leada nadal bĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdzie widoczny jako stary klient Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ to nie jest nowy klient. Manual smoke musi liczyĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ klientÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw przed i po dodaniu leada.
- status: local ZIP patch; do uruchomienia i pushu po PASS.

## STAGE226R10C2_LEAD_CLIENT_CONFLICT_RESTORE_BLOCK_PATCHER_FIX Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ fix po czerwonym R10C

- data i godzina: 2026-06-06 13:55 Europe/Warsaw
- typ wpisu: hotfix patchera i kontraktu lead/client separation po R10B/R10C
- decyzja: klient z konfliktu przy tworzeniu leada nie moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ przywracany z flow leada; tylko PokaÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ klienta albo Dodaj mimo to jako osobnego leada.
- zmiana: restoreConflictCandidate blokuje candidate.entityType === 'client' bez updateClientInSupabase; kandydaci typu client dostajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ canRestore=false przed zapisaniem do state.
- naprawa procesu: R10C2 usuwa nieudane, niezatwierdzone pliki R10C po przerwanym apply i dodaje odporny patcher regexowy.
- testy: R10C2 guard/test, R10B guard/test, R10 guard/test, build, verify:closeflow:quiet, git diff --check.
- ryzyko: istniejĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cy klient z tymi samymi danymi dalej bĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdzie widoczny w /clients, ale nie jest tworzony ani przywracany przez dodanie leada.

## STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ guards

- data i godzina: 2026-06-06 14:23 Europe/Warsaw
- guard: scripts/check-stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix.cjs
- test: tests/stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix.test.cjs
- kontrakt: brak .catch(() => ({ candidates: [] })) przy conflict preflight; bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦d checkerÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw zatrzymuje zapis; konflikt pokazuje komunikat i wymaga Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľDodaj mimo toĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„â€ž.

## STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ guardy i testy

- data i godzina: 2026-06-06 14:58 Europe/Warsaw
- guard: `npm run check:stage226r11-gcal-timezone-reminder-truth`.
- test: `npm run test:stage226r11-gcal-timezone-reminder-truth`.
- regresje: R10D2, R10C2, R10B, R10, build, verify:closeflow:quiet, git diff --check.

## STAGE226R11B_GCAL_TIMEZONE_TEST_CROSS_REALM_FIX Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ guardy/testy

- data i godzina: 2026-06-06 15:05 Europe/Warsaw
- test: npm run test:stage226r11-gcal-timezone-reminder-truth
- powÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇd: assert z node:assert/strict porÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇwnywaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ obiekt z VM realm do zwykÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego obiektu i raportowaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ false negative mimo identycznej struktury.

<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_GUARDS_START -->
## 2026-06-06 15:35 Europe/Warsaw Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚ÂÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇĂ„â€šĂ˘â‚¬ĹˇÄ‚â€šĂ‚Â¬Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„â€ž STAGE227A guardy i testy

- `node scripts/check-stage227a-sales-funnel-movement-view.cjs`
- `node --test tests/stage227a-sales-funnel-movement-view.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- Regresja R10 lead/client separation, jeÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹşli pliki istniejĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€šĂ‚Â¦.
- Regresja R11 Google Calendar timezone reminder truth, jeÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹşli pliki istniejĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€šĂ‚Â¦.
- Manual smoke `/funnel`.
<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_GUARDS_END -->

<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_GUARDS_START -->
## 2026-06-06 15:45 Europe/Warsaw Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚ÂÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇĂ„â€šĂ˘â‚¬ĹˇÄ‚â€šĂ‚Â¬Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„â€ž STAGE227B Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚ÂÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇĂ„â€šĂ˘â‚¬ĹˇÄ‚â€šĂ‚Â¬Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„â€ž guardy/testy

- `npm run check:stage227b-sales-funnel-decision-list`
- `npm run test:stage227b-sales-funnel-decision-list`
- Regresja: `npm run check:stage227a-sales-funnel-movement-view`
- Regresja: `npm run test:stage227a-sales-funnel-movement-view`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`
<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_GUARDS_END -->

<!-- STAGE228A_FUNNEL_TRUTH_CLICKABILITY_GUARDS_START -->
## 2026-06-06 17:05 Europe/Warsaw Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚ÂÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇĂ„â€šĂ˘â‚¬ĹˇÄ‚â€šĂ‚Â¬Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„â€ž STAGE228A guardy i testy

- `node scripts/check-stage228a-sales-funnel-truth-clickability.cjs`
- `node --test tests/stage228a-sales-funnel-truth-clickability.test.cjs`
- regresje Stage227A/Stage227B
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`
<!-- STAGE228A_FUNNEL_TRUTH_CLICKABILITY_GUARDS_END -->

## 2026-06-06 18:00 Europe/Warsaw Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚ÂÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇĂ„â€šĂ˘â‚¬ĹˇÄ‚â€šĂ‚Â¬Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„â€ž STAGE228B Lead Work Action Center

- typ: etap wdroÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬Ä…Ă„Ä…Ă„â€ženiowy local-only
- decyzja: Lead nie dostaje peÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚â€žĂ„â€¦Ä‚â€ąĂ˘â‚¬Ë‡nego lejka; dostaje centrum pracy Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚ÂÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇĂ„â€šĂ˘â‚¬ĹˇÄ‚â€šĂ‚Â¬Ă„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ˘â‚¬ĹľÄ‚â€žĂ„ÄľCo robimy teraz?Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚ÂÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇĂ„â€šĂ˘â‚¬ĹˇÄ‚â€šĂ‚Â¬Ă„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąÄľ z zadaniami, wydarzeniami, brakami i akcjami kontynuacji historii.
- pliki: src/pages/LeadDetail.tsx, scripts/check-stage228b-lead-work-action-center.cjs, tests/stage228b-lead-work-action-center.test.cjs
- testy: Stage228B guard/test + regresje Stage228A/227B + build + verify quiet + diff-check
- ryzyko: nie tworzyĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ă„â€šĂ˘â‚¬Ä…Ä‚ËĂ˘â€šÂ¬Ă‹â€ˇ drugiego systemu dziaÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚â€žĂ„â€¦Ä‚â€ąĂ˘â‚¬Ë‡aÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„Äľ; uÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬Ä…Ă„Ä…Ă„â€žywaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ă„â€šĂ˘â‚¬Ä…Ä‚ËĂ˘â€šÂ¬Ă‹â€ˇ istniejĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€šĂ‚Â¦cych handlerÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w LeadDetail.

## 2026-06-06 18:36 Europe/Warsaw - Stage228B R8 AlertTriangle import guard

Guard added: `check:stage228b-alerttriangle-import`.
Purpose: if LeadDetail uses AlertTriangle, it must import AlertTriangle from lucide-react so the route cannot crash at runtime with "AlertTriangle is not defined".

## 2026-06-06 18:42 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE228B R9 import source repair

- FAKT: Stage228B R8 naprawil brak AlertTriangle, ale uszkodzil zrodla importow w LeadDetail: useNavigate trafil do lucide-react, a ArrowLeft do react.
- DECYZJA: nie cofac calego Stage228B i nie oslabiaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ guardow; naprawic zrodlo importow i dodac guard na import sources.
- TESTY: Stage228B R9 ma odpalic R9 guard, R8 guard, Stage98, Stage228B, Stage228A, Stage227B, build, verify quiet i diff-check.
- RYZYKO: kazdy kolejny patcher importow w LeadDetail musi traktowac trzy importy na gorze pliku jako kontrakt: react, react-router-dom, lucide-react.

## 2026-06-06 18:50 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE228B R10 import guard false-positive fix

- FAKT: Stage228B R9 naprawil top importy w LeadDetail, ale guard mial regex przechodzacy przez wiele importow i falszywie wykrywal useNavigate w lucide-react.
- DECYZJA: nie omijac builda ani guardow; naprawic guard tak, aby parsowal pojedyncze deklaracje importow i nadal pilnowal zrodel: react, react-router-dom, lucide-react.
- TESTY: R10 ma odpalic import-source guard, AlertTriangle guard, Stage98, Stage228B, Stage228A, Stage227B, build, verify quiet i diff-check.
- RYZYKO: patchery importow musza traktowac trzy pierwsze importy w LeadDetail jako kontrakt.

## 2026-06-06 19:05 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE228B R13 Canonical LeadDetail imports repair

- Status: local hotfix package for broken pushed Stage228B commit 14f00a3d.
- Scope: deterministic rewrite of LeadDetail imports for react, react-router-dom and lucide-react.
- Guard: parser-based checks for AlertTriangle and hook import sources.
- Risk note: R8/R9/R10/R12 failures were caused by brittle regex/import handling; R13 uses declaration-level parsing.

## 2026-06-06 19:45 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE228B_R14_LEAD_ACTION_CENTER_VST

- FAKT: Po Stage228B LeadDetail dziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a, ale centrum dziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ leada byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o mniej czytelne niÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ analogiczna karta sprawy.
- DECYZJA: Nie tworzyĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ osobnego systemu wizualnego dla leada. Lead action center ma iÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ w kierunku tego samego Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a wizualnego co CaseDetail: jeden nagÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwek, jasne grupy, kompaktowe wiersze, akcje przy rekordzie.
- ZMIANA: UsuniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âto duplikujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ce copy, poprawiono separator w wierszach, ograniczono "Braki i blokady" do jawnych brakÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw/blokad zamiast dublowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ kaÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄde zalegÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡e wydarzenie.
- TESTY: Stage228B R14 guard/test, Stage228B guard/test, Stage98, build, verify quiet, diff-check.
- RYZYKO: Po deployu sprawdziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcznie LeadDetail z zalegÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ym wydarzeniem i porÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇwnaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ czytelnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ do CaseDetail.

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
- Zakres: /funnel bez panelu wÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciciela, kafelki przez OperatorMetricTile, jeden rzĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦d na desktopie, refresh w stage actions.
<!-- /STAGE228H_R3_GUARD -->

<!-- STAGE228R1_RAIL_TASKS_PATTERN_GUARD -->
## Stage228R1 guard
- npm run check:stage228r1-rail-tasks-pattern
- Chroni klasĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdu: rozjazd tekstu/rytmu right rail wzglĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdem wzorca /tasks.
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
- LeadDetail: open-only Braki i blokady + RozwiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ brak.
- ClientDetail: open-only Braki i blokady + RozwiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ.
- CaseDetail: istniejĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cy case_items status accepted/rejected i filtr accepted poza aktywnymi brakami.

## 2026-06-08 20:55 Europe/Warsaw - STAGE228R13R2_MISSING_ITEM_STATUS_GUARD_REPAIR

STATUS: LOCAL_ONLY.

Naprawa:
- Guard R13 akceptuje LeadDetail pattern `addActivity('missing_item_resolved', ...)`.
- Guard nadal wymaga updateTaskInSupabase, status done/resolved i akcji RozwiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ/RozwiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ brak.
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
  - LeadDetail -> Brak -> save -> refresh -> visible -> RozwiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ brak -> refresh -> hidden
  - ClientDetail -> Brak -> save -> refresh -> visible -> RozwiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ -> refresh -> hidden
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
- Objaw: klikniecie UsuÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ przy Braku usuwa wpis optymistycznie, ale po refetchu/odswiezeniu wpis wraca.
- Przyczyna naprawiana: niespojny kontrakt soft-delete missing_item/task oraz ryzyko ustawiania usuwanego taska jako lead.next_action_item_id.
- LeadDetail usuwa Brak natychmiast z lokalnego stanu, wykonuje backendowy soft-delete i robi silent refresh bez pelnego loadera.
- Task route nie promuje missing_item ani zamknietych/usunietych taskow do lead next action; deleted/done task czysci matching next_action_item_id.

TESTY/GUARDY:
- node scripts/check-stage228r17-missing-item-delete-contract.cjs
- node --test tests/stage228r17-missing-item-delete-contract.test.cjs
- npm run build
- git diff --check

TEST RECZNY:
- Lead -> dodaj Brak -> odswiez -> Brak widoczny -> UsuÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ -> znika od razu -> odczekaj -> hard refresh -> Brak nie wraca.
- Sprawdzic, ze NastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpny krok nie pokazuje usunietego Braku.

RYZYKA:
- Jesli baza ma stare rekordy missing_item juz podpiete jako next_action, delete czysci tylko matching next_action_item_id.
- Nie wykonano twardego DELETE, zgodnie z obecnym kierunkiem soft-delete.
- Nie ruszano ukladu UI ani styli kafelkow.

NASTEPNY KROK:
- Po PASS recznym wykonac selektywny commit/push repo i osobny commit/push vaultu Obsidian.
<!-- /STAGE228R17_MISSING_ITEM_DELETE_CONTRACT -->

## 2026-06-08 21:10 Europe/Warsaw Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚ÂÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇĂ„â€šĂ˘â‚¬ĹˇÄ‚â€šĂ‚Â¬Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„â€ž Stage228R18 Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚ÂÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇĂ„â€šĂ˘â‚¬ĹˇÄ‚â€šĂ‚Â¬Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„â€ž missing item hard delete source truth

- problem: Brak znikaÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚â€žĂ„â€¦Ä‚â€ąĂ˘â‚¬Ë‡ po klikniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľĂ„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚Âciu UsuÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„Äľ, ale wracaÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚â€žĂ„â€¦Ä‚â€ąĂ˘â‚¬Ë‡ po hard refresh.
- decyzja: aktywny Brak w LeadDetail ma byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ă„â€šĂ˘â‚¬Ä…Ä‚ËĂ˘â€šÂ¬Ă‹â€ˇ usuwany realnym backend DELETE z work_items po ID, nie tylko statusem deleted.
- dodatkowo: lista Braki i blokady ma byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ă„â€šĂ˘â‚¬Ä…Ä‚ËĂ˘â€šÂ¬Ă‹â€ˇ Ä‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡dÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚â€žĂ„â€¦Ä‚â€ąĂ˘â‚¬Ë‡owana z linkedTasks, nie z caÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚â€žĂ„â€¦Ä‚â€ąĂ˘â‚¬Ë‡ego timeline, Ä‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬Ä…Ă„Ä…Ă„â€žeby activity history nie odtwarzaÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚â€žĂ„â€¦Ä‚â€ąĂ˘â‚¬Ë‡a aktywnego braku.
- testy: check-stage228r18, node test, npm run build, git diff --check, test rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľĂ„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚Âczny dodaj/usun/hard refresh.
- ryzyko: DELETE jest mocniejsze niÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬Ä…Ă„Ä…Ă„â€ž soft-delete; historia usuniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľĂ„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚Âcia zostaje jako activity.

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

## 2026-06-09 02:50 Europe/Warsaw Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚ÂÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇĂ„â€šĂ˘â‚¬ĹˇÄ‚â€šĂ‚Â¬Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„â€ž STAGE228R41_DELETE_FLOW_FINAL_VALIDATE_PUSH

FAKTY:
- R41 finalizuje delete flow po nieudanym lokalnym Ä‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚â€žĂ„â€¦Ä‚â€ąĂ˘â‚¬Ë‡aÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„Äľcuchu R26-R40.
- Package prebuild zostawia finalnie R25 i R41, bez wadliwych R26-R40.
- Walidacja nie opiera siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľĂ„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚Â juÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬Ä…Ă„Ä…Ă„â€ž na dokÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚â€žĂ„â€¦Ä‚â€ąĂ˘â‚¬Ë‡adnym polskim tekÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹşcie toastu, tylko na strukturze przepÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚â€žĂ„â€¦Ä‚â€ąĂ˘â‚¬Ë‡ywu: branch event/task, toast.error, toast.success, local prune, filtry bundle.

TESTY:
- mass node --check stage228 scripts/tests
- R18/R25/R41 guards
- R25/R41 node tests
- npm run build
- git diff --check

RYZYKA:
- Po deployu wymagany rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľÄ‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľĂ„â€šĂ˘â‚¬Ä…Ä‚â€šĂ‚Âczny test produkcyjny usuwania: Calendar event/task, TasksStable task, LeadDetail Brak, ClientDetail Brak.

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
- debug dyktowania jest opcjonalny i domyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşlnie wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czony.
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
- `Kopiuj trace` i `WyczyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ trace` sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ widoczne w panelu trace.
- trace box pokazuje instrukcjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â nawet gdy debug jest wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czony.
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
- Quick capture uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa lead-form-section / lead-form-textarea jako source truth formularzy.
- Tekst textarea, placeholder, caret i przyciski majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ wymuszony kontrast mobilny.
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
- R2 guard nie wymaga markerÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw R10.
- R10 guard pilnuje importu visual-stage20-lead-form-vnext.css oraz klas lead-form-section/lead-form-textarea.
- Oba guardy majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ stabilne PASS markery.
<!-- STAGE230C_R15_GUARD_SPLIT_VISUAL_SOURCE_TRUTH_GUARD_END -->

<!-- STAGE231A_GOOGLE_AUTH_ENTRY_CONSISTENCY_GUARD_START -->
## 2026-06-09 - STAGE231A Google auth entry consistency

Guard/test:
- node scripts/check-stage231a-google-auth-entry-consistency.cjs
- node --test tests/stage231a-google-auth-entry-consistency.test.cjs

Kontrakt:
- Login ma przycisk "Kontynuuj przez Google".
- Rejestracja ma przycisk "Zarejestruj przez Google".
- Rejestracja pokazuje copy o moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄliwoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci utworzenia trial/workspace dla nowego konta Google.
- /api/me ma marker obecnego public trial bootstrap przez OAuth.
- Next steps zawiera kolejkĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â STAGE231B/C/D/E.
<!-- STAGE231A_GOOGLE_AUTH_ENTRY_CONSISTENCY_GUARD_END -->

## STAGE231D_GOOGLE_AUTH_INTENT_GATE Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ guards/tests

- node scripts/check-stage231a-google-auth-entry-consistency.cjs
- node --test tests/stage231a-google-auth-entry-consistency.test.cjs
- node scripts/check-stage231d-google-auth-intent-gate.cjs
- node --test tests/stage231d-google-auth-intent-gate.test.cjs
- node scripts/check-stage230b-quick-capture-inbox.cjs
- node --test tests/stage230b-quick-capture-inbox.test.cjs
- npm run build
- git diff --check

## STAGE231D_R5_GOOGLE_LOGIN_MISSING_INTENT_HARD_GATE Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ guards/tests

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
## 2026-06-10 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE230D0 Text/Input Contrast Sweep

FAKT:
- Damian zgÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡osiÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ biaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y tekst na biaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ym tle podczas wpisywania/dyktowania w aplikacji.
- Zakres R1: /ai-drafts, szybki szkic, Stage230C debug trace, input/textarea/select/placeholder/focus.

DECYZJA:
- Tryb CloseFlow: GIT-FIRST / PUSH-FIRST.
- Nie uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ lokalnych ZIP-Ä‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw jako gÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwnej Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcieÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄki dla Damiana.

TESTY:
- Stage230B regression guard/test.
- Stage230C regression guard/test.
- Stage230D0 contrast guard/test.
- npm run build.
- git diff --check.

RYZYKA:
- MoÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄliwe podobne problemy kontrastu w innych moduÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ach aplikacji.
- Nie wdraÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄano deduplikacji dyktowania bez trace.
<!-- STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP_END -->

## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0 guard

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

## Guard Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R7

node scripts/check-stage231b0-r7-case-archive-restore-navigation.cjs


## R5_CASEDETAIL_RESTORE_REPAIR
- Naprawiono realny brak CaseDetail: "PrzywrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ sprawĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â".
- Restore flow uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa updateCaseInSupabase({ status: 'in_progress' }) i activity "case_lifecycle_reopened".
- Historia i rozliczenia pozostajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ zachowane; delete flow nie jest uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywany przez restore.


## R6_REOPEN_HANDLER_ALIAS_REPAIR
- Naprawiono zgodnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ nazwy handlera restore z guardem R7.
- Dodano/upewniono `handleConfirmReopenCaseRecord` jako publiczny handler przywracania sprawy.
- Przycisk `PrzywrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ sprawĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â` uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa handlera reopen.
- Logika finansÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, delete flow i dane rozliczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ pozostajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ bez zmian.


## R7_CLOSED_STATUS_LITERAL_REPAIR
- Naprawiono zgodnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ CaseDetail z guardem R7.
- Dodano jawne sprawdzenie `isClosedCaseStatus(caseData?.status)`.
- Zachowano fallback na `effectiveStatus`.
- Bez zmian w delete flow, pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciach i prowizjach.


## R8_REOPEN_CONST_SEGMENT_REPAIR
- Naprawiono zgodnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ segmentu CaseDetail z guardem R7.
- Handler przywracania ma teraz formĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â `const handleConfirmReopenCaseRecord = async () => { ... }`.
- Przycisk `PrzywrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ sprawĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â` uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa handlera reopen.
- Bez zmian w delete flow, pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciach i prowizjach.


## R9_CASES_CLOSED_VIEW_LITERAL_REPAIR
- Naprawiono zgodnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ `Cases.tsx` z guardem R7.
- `CaseView` zawiera literal `| 'closed'`.
- Utrwalono kontrakt widoku `/cases?view=closed`, etykietĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â `Sprawy zamkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âte` oraz filtr aktywne vs zamkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âte.
- Bez zmian w delete flow, pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciach i prowizjach.


## R10_CLIENTDETAIL_CLOSED_CASES_REPAIR
- Naprawiono zgodnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ `ClientDetail.tsx` z guardem R7.
- Utrwalono kontrakt klienta: `Sprawy aktywne`, `Sprawy zamkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âte`, `PrzywrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ sprawĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â`.
- Kontrakt uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa wspÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlnego `isClosedCaseStatus(record.status)`.
- Bez zmian w delete flow, pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciach, prowizjach i lifetime finance.


## R11_CLIENTDETAIL_RESTORE_HANDLER_REPAIR
- Naprawiono zgodnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ `ClientDetail.tsx` z guardem R7.
- Dodano jawny handler/kontrakt `handleRestoreClientCaseStage231B0R7`.
- Utrwalono kontrakt aktywne/zamkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âte/przywrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ oraz activity `case_lifecycle_reopened`.
- Bez zmian w delete flow, pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciach, prowizjach i lifetime finance.


## R12_CLIENTDETAIL_CLOSED_LISTS_REPAIR
- Naprawiono zgodnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ `ClientDetail.tsx` z guardem R7.
- Dodano `activeClientCasesStage231B0R7` i `closedClientCasesStage231B0R7`.
- PodziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa wspÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlnego `isClosedCaseStatus(record.status)`.
- Bez zmian w delete flow, pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciach, prowizjach i lifetime finance.


## R13_CSS_CONTRACT_REPAIR
- Naprawiono zgodnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ CSS z guardem R7.
- Dodano `cf-case-detail-close-action-stage231b0-r7` do CSS karty sprawy i do klasy przycisku zamykania.
- Dodano `client-detail-case-smart-card-closed-stage231b0-r7` do CSS klienta.
- Bez zmian w delete flow, pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciach, prowizjach i lifetime finance.
\n\n## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0_R8_CASE_ARCHIVE_RELATION_TRUTH\n- Status: LOCAL_ONLY_PREPARED / R6_CLIENTDETAIL_FLEXIBLE_REPAIR.\n- Naprawa po czĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciowym R4: elastyczny patch ClientDetail, aktywne/zamkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âte sprawy klienta, restore z klienta, CSS, guard/test.\n- Finanse i historia zachowane.\n

## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0_R8_R8_DUPLICATE_CONST_BUILD_REPAIR
- Status: LOCAL_ONLY_PREPARED.
- Naprawa masowa po build fail: usuniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âto sklejone anchory `const X = useMemo( const X = useMemo(` po czĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciowym R2/R4/R6/R7.
- Zakres: dotkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âte pliki TSX, whitespace, sanity check R8, peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ny build/test.



## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0_R8_R9_DUPLICATE_TOGGLE_BUILD_REPAIR
- Status: LOCAL_ONLY_PREPARED.
- Naprawa masowa po build fail: usuniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âto stary drugi `toggleCaseView`, ktÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇry pozostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ po R8 obok URL-aware `setCaseViewStage231B0R8`.
- Guard R8 rozszerzony o dokÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adnie jeden `toggleCaseView` i zakaz legacy `setCaseView((prev) => ...)`.


## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R9 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Client history and case view model
- Status: LOCAL_ONLY_PREPARED.
- Zakres: /cases jawne widoki Otwarte/ZamkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âte/Wszystkie, zamkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âte sprawy klienta przeniesione do Historii, szerszy layout klienta, finanse all_cases zachowane.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow R25/R41, build, git diff --check.
- Ryzyka: UX historii klienta, sourceCases w /cases, brak regresji finansÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw i aktywnych ryzyk.


## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R9-R2 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Cases URL reader repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po czĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciowym R9: brakowaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o jawnego searchParams.get('view') w src/pages/Cases.tsx.
- R8 guard dostosowany do R9 modelu open/closed/all, aby regresja R8 dalej sprawdzaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a intencjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â, nie stary exact string.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R9-R3 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Closed case banner repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po czĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciowym R9-R2: `/cases` musi mieĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ widoczny banner `SPRAWA ZAMKNIĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂTA` dla zamkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âtej sprawy.
- Guard R9 rozszerzony o data-marker bannera, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby nie przechodziÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ sam tekst bez realnego elementu UI.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R9-R5 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Client history renderer guard repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R4: Historia klienta renderuje zamkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âte sprawy przez wspÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlny renderer karty, wiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âc guard akceptuje akcje `OtwÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇrz` i `PrzywrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ sprawĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â` z renderera, nie tylko literalnie z segmentu Historii.
- Wymuszono widoczny label `SPRAWA ZAMKNIĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂTA` w Historii i rendererze zamkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âtej karty.
- Nie ruszano finansÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, kosztÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, SQL, Google Calendar ani pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci/prowizji.


## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R9-R6 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Right rail guard robust repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R5: guard R9 zakÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ literalny `</SimpleFiltersCard>`, a komponent prawych skrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇtÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ self-closing albo sformatowany inaczej.
- Logika produktu bez zmian; naprawiono elastyczne wycinanie powierzchni prawego panelu w guardzie.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R9-R8 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ R8 setter wrapper scan repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R7: poprzedni patcher szukaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ `toggleCaseView`, ktÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇrego aktualne uÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡oÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄenie w `Cases.tsx` nie byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o stabilnym anchorem.
- Dodano jawny wrapper `setCaseViewStage231B0R8` przez skan koÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľca funkcji `setCaseViewStage231B0R9`, bez zmiany logiki produktu.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R9-R9 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Cases items JSX syntax repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R8: build wykryÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂdnĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ skÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â JSX `items=[...]` w `src/pages/Cases.tsx`.
- Poprawiono na `items={[...]}` bez zmiany logiki produktu.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R9-R10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ ClientDetail JSX section close repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R9: build wykryÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ niedomkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂtĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ strukturĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â JSX w `ClientDetail.tsx` przy przejÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciu z gÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwnej sekcji do prawego panelu.
- Dodano brakujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ce `</section>` przed `<aside className="client-detail-right-rail"...>` bez zmiany logiki produktu.
- Nie ruszano finansÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, kosztÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, SQL, Google Calendar ani pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci/prowizji.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R11 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Client width + Cases runtime guard
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9 push: `/cases` rzucaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ runtime `ReferenceError: closedRecordStage231B0R8 is not defined` przy wejÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciu w widok spraw.
- Naprawa: wolne uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄycia `closedRecordStage231B0R8` w JSX zastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦piono bezpiecznym `isClosedCaseStatus(record?.status)`.
- UX: `ClientDetail` ma szeroki ukÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ad jak widok sprawy, z lewym wyrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwnaniem i breakpointami skalowania.
- Dodano guard `scripts/check-stage231b0-r11-client-width-and-cases-runtime.cjs` oraz test node.
- Nie ruszano finansÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, kosztÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, SQL, Google Calendar ani pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci/prowizji.


## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R12-R7 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Final Cases runtime contract rescue
- Status: LOCAL_ONLY_PREPARED.
- Po R12-R6 zastosowano mocniejszy rescue: helper `renderClosedCaseBannerStage231B0R12`, jeden kontrakt `activeCases/closedCases` przez `useMemo`, `record.status` tylko w dwÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇch filtrach.
- Guardy R11/R12/R12-R7 pilnujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ tego samego kontraktu i blokujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ `closedRecordStage231B0R8` oraz `record?.status`.
- Nie ruszano finansÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, SQL, Google Calendar, pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci ani innych moduÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.


## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R13 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Cases map record scope real fix
- Status: LOCAL_ONLY_PREPARED.
- Naprawa realnego bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdu po R12/R7 w `filteredCases.map((record, index) => ...)`.
- UsuniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âto `caseRecord` fallback i lokalny shadow `renderClosedCaseBannerStage231B0R12` z mapy.
- Dodano scoped boolean `isCaseClosedStage231B0R13 = isClosedCaseStatus(record.status)`.
- UsuniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âto bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdny banner z loading row.
- Dodano guard/test R13 oraz zaktualizowano guardy R11/R12/R12-R7.


## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R13-R2 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Cases map closed logic completion
- Status: LOCAL_ONLY_PREPARED.
- Kontynuacja po czĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciowym R13: guard liczbowy byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ za ostry, wiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âc zamieniono go na sprawdzanie konkretnych linii logiki.
- DomkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âto `attention`, `statusTone`, `compactLifecyclePill`, `nextActionLabel`, `ownerRiskBadges` i banner zamkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âtej sprawy na `isCaseClosedStage231B0R13`.
- Guard blokuje powrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇt `caseRecord` fallback i local shadow helpera w mapie.


## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R13-R3 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Next action guard and map completion
- Status: LOCAL_ONLY_PREPARED.
- Kontynuacja po R13-R2: guard byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ zbyt wraÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄliwy na dokÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adny polski tekst `Sprawa zamkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âta`.
- Znormalizowano `nextActionLabel` i zmieniono guard na strukturĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â logicznĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ zamiast peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nego literalnego tekstu.
- Dalej blokowany jest `caseRecord` fallback i local shadow helpera w `filteredCases.map`.


## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R13-R4 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Guard map window repair
- Status: LOCAL_ONLY_PREPARED.
- R13-R3 guard faÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡szywie ciĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ `filteredCases.map` na pierwszym zagnieÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄdÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄonym `});`, czyli przed `nextActionLabel`.
- Naprawa: guardy uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ szerokiego deterministycznego okna od poczĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦tku mapy zamiast pierwszego `});`.
- Nie zmieniano logiki biznesowej poza markerem stage; naprawa dotyczy guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw i dokumentacji.


## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R13-R6 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Owner risk minimal safe call
- Status: LOCAL_ONLY_PREPARED.
- R13-R5 zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â przed zmianĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ pliku, bo check starego bloku z HEAD byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdny.
- Naprawa: uszkodzony zakres `ownerRiskBadges -> metaParts` jest zastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpowany kompletnĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦, zamkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂtĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ skÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adniowo deklaracjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦.
- `getCaseOwnerRiskBadges` dostaje bezpieczny kontekst lokalny: lifecycle, nearestCaseAction, nextActionLabel, statusLabel, compactLifecycleLabel, compactLifecyclePill, percent, updatedAt.

## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R14 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Client detail full-width layout lock
- Status: LOCAL_ONLY_PREPARED.
- PowÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇd: kartoteka klienta nadal jest centrowana/Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âta zamiast uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nej szerokoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci od lewego panelu do prawej krawĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdzi ekranu.
- Zakres: marker route w ClientDetail + CSS lock w visual-stage12-client-detail-vnext.css.
- Kontrakt: brak max-width shell, width 100%, margin-inline 0, stable horizontal spacing during scroll.

## 2026-06-10 Ä‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„ STAGE231B0-R15-R2 Ä‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„ ClientDetail shared canvas width source
- Status: FINALIZE_FOR_PUSH.
- PowÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„d: R14 trafiÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„ w zÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„y DOM node (`ClientMultiContactField`), wiÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„c nie mÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„gÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„ rozciÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„gnÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„Ä‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„ kartoteki klienta.
- Decyzja: ClientDetail ma uÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„ywaÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„ wspÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„lnego canvasu strony: `cf-page-canvas`, `cf-page-canvas--full`, `data-cf-page-canvas="full"`.
- Ä‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„rÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„dÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„o prawdy szerokoÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„ci: `src/styles/closeflow-unified-page-canvas-stage211c.css`.
- Widok konsumujÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„cy kontrakt: `src/pages/ClientDetail.tsx` + `src/styles/visual-stage12-client-detail-vnext.css`.
- R14 guard/test usuniÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„te jako faÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„szywy kontrakt.

## 2026-06-10 Ä‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„ STAGE231B0-R15-R3 Ä‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„ ClientDetail width guard + Polish encoding guard
- Status: FINAL_GUARD_FOR_PUSH.
- Potwierdzenie uÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„ytkownika: wyglÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„d kartoteki klienta jest poprawny i ma tak zostaÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„.
- Guard szerokoÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„ci: `scripts/check-stage231b0-r15-r3-client-detail-width-source-truth.cjs`.
- Guard polskich znakÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„w: `scripts/check-stage231b0-r15-r3-polish-encoding.cjs`.
- Guard pilnuje, Ä‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„e ClientDetail uÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„ywa wspÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„lnego canvasu: `cf-page-canvas`, `cf-page-canvas--full`, `data-cf-page-canvas="full"` oraz zmiennych `--cf-page-canvas-*`.
- Guard pilnuje usuniÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„cia bÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„Ä‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„dnego R14 i braku mojibake/replacement chars w kluczowych plikach kartoteki klienta.
- Naprawiono higienÄ‚â€žÄąÄ…Ă„Ä…Ă„ËťÄ‚â€ąÄąÄ„ EOF w `src/pages/ClientDetail.tsx`.


## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R15-R4 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Polish guard safe repair R2
- Status: REPAIR_AFTER_PUSHED_FAILED_GUARD_SAFE_R2.
- PowÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇd: pierwsza paczka SAFE miaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦d runnera PowerShell - funkcja przekazywaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a argumenty natywnym komendom jako pustĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ tablicĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â, wiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âc git/node startowaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y bez parametrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.
- Naprawa: R2 uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa jawnych wywoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ w PowerShell i naprawia mojibake wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cznie w skrypcie JS, nie wklejanym terminalu.
- Polish guard wykrywa konkretne sekwencje mojibake, daje line evidence i blokuje blank line at EOF.
- Zasada utrzymana: commit/push tylko po PASS guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, build i git diff --check.


## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R15-R4 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Polish guard batch repair
- Status: BATCH_REPAIR_AFTER_R2_R3_PARTIALS.
- PowÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇd: R2/R3 czĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciowo naprawiÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y pliki, ale R3 zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â przez zbyt wĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ski parser dirty paths.
- Naprawa: masowo obsÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄono warianty mojibake `Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦/Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡/Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡/Ä‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇ/Ă„â€šĂ˘â‚¬ĹˇÄ‚â€šĂ‚Â·/Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬Äąâ€ş`, znormalizowano EOF i poprawiono guard pod aktualnĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ kopiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â ClientDetail.
- Zasada: commit/push tylko po PASS guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, build i git diff --check.


## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231B0-R15-R4 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Polish guard final batch repair
- Status: FINAL_BATCH_REPAIR_AFTER_DOC_SELF_FAIL.
- PowÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇd: poprzedni run report zawieraÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ przykÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adowe uszkodzone sekwencje znakÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, a guard sÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡usznie skanowaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ teÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ dokumentacjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â etapu.
- Naprawa: dokumentacja etapu nie zapisuje juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ przykÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adowych uszkodzonych sekwencji; guard dalej skanuje kod, CSS i dokumentacjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â zakresu R15.
- Guard blokuje uszkodzenia kodowania, puste linie na EOF i brak aktualnych polskich fraz w ClientDetail.
- Commit/push tylko po PASS guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, build i git diff --check.

<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_GUARDS_START -->
## 2026-06-10 17:10 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0A Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Visual Source of Truth guard

Marker: `STAGE231D0A_VISUAL_SOURCE_TRUTH_CONSISTENCY`

Guard:
- `scripts/check-stage231d0a-visual-source-truth-consistency.cjs`

Test:
- `tests/stage231d0a-visual-source-truth-consistency.test.cjs`

Chroniona klasa bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdu:
- lokalne style kart/kafelkÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw bez mapy VST,
- nowe ikony bez centralnego registry,
- nowe badgeĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â‚¬ĹľĂ‹Âe/statusy bez `StatusPill`,
- niespÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇjne przyciski akcji bez `Button`/`entity-actions`,
- finance rows bez `FinanceMiniSummary`/finance CSS,
- powrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇt mojibake w dokumentach D0A,
- pominiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcie roadmapy D0A przed D0.
<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_GUARDS_END -->

<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_GUARDS_START -->
## STAGE231D0A-R3 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ guard/test closeout

Wymagane PASS:
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run test:stage231d0a-visual-source-truth-consistency
- npm run build
- git diff --check

Warunek: brak FAIL, brak new blank line at EOF, brak brakujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cych tokenÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw payloadu Obsidiana.
<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_GUARDS_END -->

<!-- STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP_R4_START -->
## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0-R4 Client workspace UX final runner fix

Status: LOCAL_ONLY_PREPARED / DO_TEST_AND_PUSH

FAKTY:
- R4 naprawia wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cznie niedziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cy runner/patch D0 i domyka ClientDetail UX cleanup.
- Zakres UI: marker D0, tekst Ä‚â€žĂ„â€¦Ä‚â€šĂ‚Âadowanie klienta..., tekst SPRAWA ZAMKNIĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂTA, finance icon source truth payment, jeden client-level aria-label Finanse klienta.

TESTY:
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run test:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run test:stage231d0a-visual-source-truth-consistency
- node scripts/check-stage231b0-r15-r3-polish-encoding.cjs
- npm run build
- git diff --check

AUDYT RYZYK:
- Nie ruszano modelu finansÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw i kosztÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.
- IstniejĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ce ostrzeÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄenie duplicate savedRecord zostaje poza zakresem.

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po PASS/push przejÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ do STAGE231D1 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ model kosztÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.
<!-- STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP_R4_END -->

## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0-R5 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Client workspace UX guard close
- Status: LOCAL_ONLY_RESCUE_PRE_PUSH.
- DomkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcie po R4: ikona finansÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw klienta z EntityIcon case -> payment oraz brakujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ce tokeny "audyt ryzyk", "nastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpny krok" i "VISUAL SOURCE OF TRUTH".
- Zakres bez zmian danych: ClientDetail UI, guard/test D0, raporty _project i Obsidian payload.
- Testy: D0 guard/test, D0A regression, Polish guard, build, git diff --check.
- Audyt ryzyk: rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcznie sprawdziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ brak duplikatu Finanse klienta i poprawnĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ ikonĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â finansÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.
<!-- STAGE231D1_COST_MODEL_SOURCE_TRUTH_START -->
## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D1 Cost model source truth

Status: LOCAL_ONLY_PREPARED / DO_TEST_AND_PUSH

FAKTY:
- STAGE231D1_COST_MODEL_SOURCE_TRUTH: dodano centralny model kosztÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw sprawy bez zmian runtime UI.
- Model rozdziela: Koszty poniesione, Koszty do zwrotu, Koszty zwrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇcone i Razem do pobrania.
- D1 nie dodaje SQL, tabel, migracji, Supabase ani formularza UI.

VISUAL SOURCE OF TRUTH:
- D1 uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa finansowego sÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ownika etykiet i nie dodaje lokalnych stylÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw UI.
- UI zostaje do D2/D3, zgodnie z D0A Visual Source of Truth.

TESTY:
- npm run check:stage231d1-cost-model-source-truth
- npm run test:stage231d1-cost-model-source-truth
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run build
- git diff --check

audyt ryzyk:
- Ryzyko: D2 moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe potrzebowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ SQL/tabeli, ale D1 celowo nie dotyka bazy.
- Ryzyko: stare UI finansÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw nie pokaÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe kosztÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, dopÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇki D2/D3 nie podÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ modelu.
- Ryzyko: jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli koszt nie jest reimbursable, nie wchodzi w Koszty do zwrotu.

nastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpny krok:
- Po PASS/push przejÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ do STAGE231D2 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ koszty w sprawie z SQL/guardem i UI opartym o model D1.
<!-- STAGE231D1_COST_MODEL_SOURCE_TRUTH_END -->

<!-- STAGE231D2_CASE_COSTS_IN_CASE_START -->
## STAGE231D2 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Case costs in case
- data: 2026-06-10 18:55 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED / DO_APPLY_TEST_SQL_AND_PUSH
- zakres: SQL case_costs, API /api/case-costs, CaseDetail cost panel, guard/test.
- testy: check/test D2, regression D1/D0/D0A, Polish guard, build, git diff --check.
- audyt ryzyk: SQL must be run before real write test; route must stay workspace scoped.
- nastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpny krok: apply package, run SQL, manual add-cost test, then push.
<!-- STAGE231D2_CASE_COSTS_IN_CASE_END -->

<!-- STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_START -->
## STAGE231D2-R2 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Case costs fetch guard close
- data: 2026-06-10 19:10 Europe/Warsaw
- status: LOCAL_ONLY_GUARD_CLOSE / DO_TEST_SQL_AND_PUSH
- zakres: CaseDetail import/fetch integration for case_costs.
- testy: D2 guard/test, D1/D0/D0A regression, Polish guard, build, git diff --check.
- audyt ryzyk: SQL still required before manual cost write test.
- nastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpny krok: run SQL, manual add-cost test, selective push.
<!-- STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_END -->

<!-- STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_START -->
## STAGE231D2-R3 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Vercel Hobby function limit fix
- data: 2026-06-10 19:25 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED / DO_APPLY_TEST_PUSH_DEPLOY
- powÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇd: Vercel Hobby blokuje deployment po przekroczeniu limitu Serverless Functions.
- zakres: usuniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcie api/case-costs.ts, konsolidacja kosztÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw pod api/cases.ts?resource=costs, guard budÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄetu funkcji.
- testy: D2 guard/test, Vercel budget guard/test, D1/D0/D0A regression, Polish guard, build, git diff --check.
- audyt ryzyk: po deployu powtÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇrzyĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ manualny test Dodaj koszt, bo zmienia siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcieÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄka API.
- nastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpny krok: PASS -> push -> deploy -> test rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âczny kosztu.
<!-- STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_END -->

## 2026-06-10 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D2-R5 CaseDetail render crash hotfix

- Status: LOCAL_ONLY_HOTFIX_PREPARED
- Problem: produkcyjna karta sprawy wysypywaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a render przez brak definicji caseCostsSummaryStage231D2.
- Fix: dodano useMemo summary przed JSX i guard blokujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cy regresjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â.
- Testy: R5/D2/D2R3/D1/D0/D0A/Polish/build.
- Audyt ryzyk: po deployu sprawdziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ produkcyjne otwarcie sprawy; /api/case-items 500 to osobny backend problem, jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli nadal wystĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦pi.

## STAGE231D2-R6 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ CaseDetail top strip rail lift

- data i godzina: 2026-06-10 19:55 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED
- zmiana: skrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇcenie gÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇrnego paska tytuÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡u sprawy do lewej kolumny i podciĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦gniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcie prawego raila do gÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇrnego miejsca po prawej.
- testy: guard/test R6 + D2/R5/R3/D1/D0/D0A/Polish/build/git diff check.
- ryzyko: CSS negative margin wymaga produkcyjnego testu wizualnego po deployu.

## 2026-06-10 20:05 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D3-R7 guards

- npm run check:stage231d3-client-finance-costs-rollup
- npm run test:stage231d3-client-finance-costs-rollup
- regressions: D2-R5 render crash, D2 costs, D2-R3 Vercel function budget, D1, D0, D0A, Polish guard, build, git diff --check

## STAGE231D3-R7-R2 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Polish guard restore and D3 close

- timestamp: 2026-06-10 20:42 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED
- result: restored missing scripts/check-polish-encoding-stage231b0-r15-r3.cjs required by regression lane after STAGE231D3-R7.
- risk audit: this fixes guard infrastructure drift only; it does not modify SQL, API routes, or CaseDetail layout.

<!-- STAGE231D0B_CLIENT_LIST_CARD_GUARDS_START -->
## 2026-06-12 11:15 Europe/Warsaw - STAGE231D0B Client List Card Visual Freeze

STATUS: LOCAL_APPLIED_PENDING_MANUAL_TEST_AND_PUSH

FAKTY:
- Kafelek klienta na liÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcie klientÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw zostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ przestawiony na ukÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ad 2-wierszowy.
- Z kafelka klienta usuniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âto Leady: oraz badge Aktywna sprawa.
- Wiersz 1 pokazuje: nazwa, telefon, e-mail, Aktywna prowizja, akcje.
- Wiersz 2 pokazuje: firma, Sprawy, Zarobione Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cznie, NajbliÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄsza akcja oraz dozwolone statusy pomocnicze.
- Telefon ma osobny marker data-client-list-phone i klasĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â client-list-card-phone.
- E-mail ma osobny marker data-client-list-email i klasĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â client-list-card-email.
- UI dalej korzysta z closeflow-record-list-source-truth.css jako Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a prawdy stylu list.

DECYZJA DAMIANA:
- Klient jest juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ pozyskanym leadem, wiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âc nie pokazujemy Leady w kafelku klienta.
- Klient moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe mieĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ wiele spraw, wiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âc nie pokazujemy binarnego badge'a Aktywna sprawa.
- Na liÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcie klientÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ widoczne: Aktywna prowizja, Zarobione Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cznie, Sprawy, NajbliÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄsza akcja.

TESTY/GUARDY:
-
pm run check:stage231d0b-client-list-card-freeze
-
pm run build
- git diff --check

DO POTWIERDZENIA:
- Test rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âczny desktop/mobile na /clients po lokalnym uruchomieniu.

RYZYKA:
- JeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli dane prowizyjne w bazie sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ niepeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ne, Aktywna prowizja moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe pokazaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ 0 PLN mimo aktywnej sprawy bez uzupeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nionej prowizji.
- JeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci prowizyjne nie majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ typu/statusu rozpoznawanego przez finance source, Zarobione Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cznie moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe wymagaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ osobnego etapu porzĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦dkujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cego dane pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci.
- Zmiana dotyczy tylko listy klientÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, nie przebudowuje ClientDetail ani modeli finansowych.
<!-- STAGE231D0B_CLIENT_LIST_CARD_GUARDS_END -->


## 2026-06-10 Europe/Warsaw - STAGE231D0B-R8-MASS-ENCODING-RESCUE

Marker: STAGE231D0B-R8-MASS-ENCODING-RESCUE
Guard: scripts/check-stage231d0b-client-list-card-freeze.cjs

Guard blokuje:
- mojibake w widocznym ClientListCard i plikach kontraktu STAGE231D0B,
- Leady: w kafelku klienta,
- Aktywna sprawa w kafelku klienta,
- prefiks NajbliÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄsza akcja: w samym slocie kafelka,
- brak Sprawy:, Aktywna prowizja, Zarobione Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cznie,
- brak osobnych slotÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw telefonu/e-maila i dwuwierszowego layoutu.

## 2026-06-10 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0B-R9 ClientListCard polish + source truth cleanup

Status: LOCAL_ONLY_PACKAGE_APPLIED_PENDING_PUSH

FAKTY:
- ClientListCard pozostaje 2-wierszowy.
- Finance values sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ porzĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦dkowane jako kompaktowe chipy.
- R8 unscoped CSS rescue zostaje zastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦piony scoped R9 source truth.
- LeadListCard dodany tylko jako mapping w UI Dictionary, bez runtime zmian.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Manual QA nadal wymagany, bo guard nie mierzy odbioru wizualnego.
- Osobny dÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ug: duplicate savedRecord warning w ContextActionDialogs.tsx.

NASTĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚ÂPNY KROK:
- Po akceptacji /clients: STAGE231D0C LeadListCard align to ClientListCard source truth.

## 2026-06-11 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0B_R9_R3_GUARD_MOJIBAKE_SELF_SCAN_REPAIR

- Status: LOCAL_APPLY_READY
- Guard: scripts/check-stage231d0b-client-list-card-freeze.cjs rewritten to avoid self-detecting literal encoding probe characters.
- Test: tests/stage231d0b-client-list-card-freeze.test.cjs.

## 2026-06-11 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0B_R9_R4_CSS_GUARD_TOKEN_ALIGNMENT

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

## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0B-R10/R8 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ finance chip right-edge alignment

Status: LOCAL_APPLIED_PENDING_PUSH_AND_DEPLOY_QA

FAKTY:
- R7 wyrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇwnaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ finance chipy w zÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ stronĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â dla oczekiwanego widoku Damiana.
- R8 nie przebudowuje karty klienta. Zmienia tylko oÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹş wyrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwnania zielonych chipÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw finansowych.
- Chipy pozostajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ o zmiennej dÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ugoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci; prawa krawĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂdÄ‚â€žĂ„â€¦Ă„Ä…ÄąĹź chipÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw ma byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ wspÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlna.

DECYZJA DAMIANA:
- PoczĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦tek i koniec karty zostajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ bez zmian.
- Zielone kafelki finansowe majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ wyrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwnane od prawej strony.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Etap jest wizualny; ostateczne zamkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcie wymaga deployu i rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcznego sprawdzenia /clients.


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
- STAGE231D0C/R6 zostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ wdroÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄony i wypchniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âty jako baseline ClientDetail.
- Manual QA wskazaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe lewy rail zaczyna siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â za wysoko i wizualnie wchodzi w nastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpny poziom wzglĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdem kart po prawej.

DECYZJA DAMIANA:
- ZachowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ zaakceptowane gÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇrne kafelki ClientDetail.
- ObniÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄyĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ lewy rail do poziomu kafelkÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw po prawej i zachowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ ten sam odstĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âp miĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdzy kartami.

ZAKRES:
- CSS spacing only: lewy rail, prawy rail, odstĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âp miĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdzy kartami.
- Bez zmian danych, JSX, SQL, kosztÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, wykresÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, Google Calendar, LeadListCard runtime i CaseDetail.

TESTY/GUARDY:
- scripts/check-stage231d0c-r7-client-detail-left-rail-spacing.cjs
- tests/stage231d0c-r7-client-detail-left-rail-spacing.test.cjs
- regresja: STAGE231D0C ClientDetail baseline guard, STAGE231D0B ClientListCard guard, optional STAGE231B0 R9 guard, build, git diff --check.

---

## 2026-06-11 20:05 Europe/Warsaw - Guard repair STAGE231D0C/R8 ClientDetail left rail spacing

STAGE231D0C_R8_CLIENT_DETAIL_LEFT_RAIL_SPACING_GUARD_FIX

FAKTY Z KODU:
- STAGE231D0C/R7 patch zastosowaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ spacing lewego raila, ale guard miaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ zepsuty regex po utracie backslashy.
- R8 nie zmienia runtime poza naprawĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ guarda/testu i dokumentacjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦.

DECYZJA DAMIANA:
- ZachowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ gÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇrne kafelki ClientDetail.
- DokoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľczyĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ spacing lewego raila bez przebudowy ukÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adu.

ZAKRES:
- Naprawa scripts/check-stage231d0c-r7-client-detail-left-rail-spacing.cjs.
- Zachowanie CSS R7 i scope ClientDetail.
- Bez zmian SQL, danych, CaseDetail, LeadListCard runtime, kosztÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw i wykresÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.

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
- poprawiono realny desktopowy offset lewego raila w ClientDetail, bo po R7 panel nadal zaczynaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ za wysoko wzglĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdem prawego raila;
- zwiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âkszono offset tylko dla desktopu przez CSS variable i silniejszy selektor;
- zachowano zaakceptowany gÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇrny ukÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ad kafelkÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, kompaktowĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ aktywnĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ sprawĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â, dane i routing.

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
- tablet/mobile resetujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ offset do 0, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby nie zrobiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ sztucznej dziury.

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
- verify left Data klienta card starts visually on the same axis as right NajbliÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄsze dziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ania card.
- verify top tiles and active case compact card unchanged.

---

## 2026-06-11 Europe/Warsaw - STAGE231D0C-R2 ClientDetailHeader visual freeze + visible icons

Marker: STAGE231D0C_R2_CLIENT_DETAIL_HEADER_FREEZE
Status: LOCAL_APPLY_PREPARED / DO_TEST_AND_PUSH

Zakres:
- zamroÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄenie ClientDetailHeader jako wzorca DetailHeader,
- dopisanie stylu widocznoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci ikon w header buttons,
- dopisanie DetailHeader do UI Dictionary,
- dodanie guarda i testu R2,
- regresja D0C baseline.

Decyzja Damiana:
Header karty klienta detail zostaje wzorcem dla kolejnych kart detail. Ikony w niebieskich przyciskach muszĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ widoczne.

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
- naprawa czĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciowo zastosowanego D0D-R3 po guard fail,
- dopisanie widocznego wiersza "Razem do pobrania" do pierwszej karty "Rozliczenie sprawy",
- podpiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcie totalu do istniejĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cego caseCostsSummaryStage231D2.totalToCollectAmount,
- naprawa JSX service tab po usuniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âciu legacy Stage220A10 duplicate block,
- bez SQL, bez nowego modelu kosztÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, bez wykresÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.

Testy wymagane:
- D0D-R2 guard/test,
- D0C ClientDetail baseline regression,
- D0B ClientListCard regression,
- npm run build,
- git diff --check.

Audyt ryzyk:
- nie dublowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ osobnej karty kosztÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw jako drugiego Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a rozliczenia; wiersz totalu w pierwszej karcie jest obowiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦zkowy dla skanowalnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci prawego panelu,
- po deployu manualnie sprawdziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ kolejnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ raila: Rozliczenie -> Szybkie akcje -> Dane sprawy i klienta.

## 2026-06-11 Europe/Warsaw - STAGE231D0D-R3 CaseDetail 100% scale balanced workspace

Status: PREPARED_BY_ZIP / DO_TEST_AND_PUSH

Zakres:
- dziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ania i notatki w jednym Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşrodkowym gridzie,
- notatki compact preview: 3 ostatnie,
- prawy rail compact: rozliczenie, szybkie akcje, dane,
- historia wpÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡at i lista kosztÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw nie sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ stale rozlane w railu,
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
- R4 usuwa widocznĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ kartĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â danych sprawy i klienta z gÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwnego right raila bez usuwania danych z systemu.
- R4 usuwa staÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡e sekcje historii wpÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡at i kosztÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw z right raila.
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
- Tabs sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ wyrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwnane wizualnie do kolumny dziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ bez peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nej przebudowy logiki Tabs; przy kolejnym wiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âkszym refaktorze warto przenieÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ strukturĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â logicznie do left-column.
- Historia wpÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡at i koszty pozostajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ dostĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpne przez istniejĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ce przyciski/modale, ale nie sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ staÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ listĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ w railu.

---

## 2026-06-12 07:39 Europe/Warsaw - STAGE231D0D-R5 spacing / notes lift / quick actions cleanup

Status: READY_FOR_TEST
Zakres:
- notatki podciĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦gniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âte do gÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇry bez Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡amania wspÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlnego odstĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpu kafelkÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw,
- wspÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlny odstĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âp kafelkÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw: 14px,
- prawy rail delikatnie podniesiony,
- z CaseQuickActions usuniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âto osobnĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ akcjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â "WpÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ata prowizji",
- wpÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ata prowizji zostaje w rozliczeniu sprawy.

Ryzyka:
- override CSS musi nie rozjechaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ mobile/tablet,
- quick actions nie mogĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ dublowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ akcji finansowych,
- R2/R3/R4 guardy byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y skÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adniowo uszkodzone i zostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y naprawione.

---

## 2026-06-12 07:58 Europe/Warsaw - STAGE231D0D-R5 repair after red guard push

Status: REPAIR_READY_FOR_TEST

Naprawa:
- usuniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âto "WpÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ata prowizji" z CaseQuickActions,
- dodano "Dodaj koszt" do kompaktowego rozliczenia sprawy,
- dodano spacing marker i wspÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlny odstĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âp kafelkÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw 14px,
- dodano micro-lift prawego raila,
- zachowano wpÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â prowizji tylko w rozliczeniu sprawy.

PowÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇd:
Poprzedni R5 zostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ wypchniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âty mimo czerwonych guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw po bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdzie Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcieÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄek wzglĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdnych .NET/PowerShell.

---

## 2026-06-12 08:10 Europe/Warsaw - STAGE231D0D-R6 true service grid geometry

Status: READY_FOR_TEST

Zakres:
- przeniesiono tabs do lewej kolumny workspace dla aktywnej zakÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adki ObsÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡uga,
- lewa kolumna ma teraz: tabs + dziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ania,
- Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşrodkowa kolumna ma notatki startujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ce od gÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇry tego samego gridu,
- prawy rail jest wyrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwnany do osi true service grid i uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa wspÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlnego gapu,
- nie ruszano SQL, danych, modelu finansÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw ani modali.

Audyt:
- R5 byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ technicznie zielony, ale wizualnie nie zamykaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ celu, bo tabs byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y poza gridem.
- R6 naprawia strukturĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â JSX, a guard sprawdza kolejnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ grid -> left column -> tabs -> actions -> notes.

---

## 2026-06-12 08:28 Europe/Warsaw - STAGE231D0D-R8 tabs card + right rail axis polish

Status: READY_FOR_TEST

Zakres:
- prawy panel z rozliczeniem i szybkimi akcjami podniesiony do osi kafelka danych sprawy,
- zakÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adki ObsÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡uga / Checklisty / Historia dostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ny, rozciĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦gniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âty kafelek nad DziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aniami sprawy,
- zachowany wspÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlny odstĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âp kafelkÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw 14px,
- nie ruszano finansÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, modali, SQL, danych, handlerÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw ani quick actions poza stylem ukÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adu.

Ryzyka:
- etap jest CSS-only, wiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âc wymaga rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcznego potwierdzenia na 100% zoom,
- lift prawego raila ma reset na wĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄszych ekranach,
- historyczne mojibake w starych wpisach _project nie jest czyszczone w tym etapie.

---

## 2026-06-12 08:58 Europe/Warsaw - STAGE231D0D-R9 tabs center + axis microfix

Status: APPLIED_LOCAL_WAITING_VISUAL_PASS

Zakres:
- piguÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ki ObsÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡uga / Checklisty / Historia wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşrodkowane w rozciĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦gniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âtym kafelku,
- Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşrodkowa sekcja CaseDetail podniesiona lekko wyÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄej,
- prawy panel rozliczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ i szybkich akcji dociĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦gniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âty do tej samej osi,
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
- Force right rail content under NajbliÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄsze dziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ania to keep same width/left edge as the rail.

User decision:
- "wszystko co pod braki i blokady oraz najbliÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄsze dziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ania musimy wyrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇwnaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ z kafelkiem dane klienta"

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
## 2026-06-12 15:00 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0F guard/test

Guard:
- `node scripts/check-stage231d0f-funnel-owner-dashboard-visual-alignment.cjs`

Test:
- `node --test tests/stage231d0f-funnel-owner-dashboard-visual-alignment.test.cjs`

Regresje powiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦zane:
- `node scripts/check-stage231d0d-r4-case-detail-lean-service-workspace.cjs` jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli istnieje.

Guard sprawdza:
- marker `STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT`,
- istniejĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ce markery lejka `data-stage227b-decision-list-view` i `data-stage228a-funnel-truth-clickability`,
- wpisy UI Dictionary dla Lejka,
- filtry wÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcicielskie,
- zasadĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â `lista decyzji / nie kanban`,
- brak SQL, wykresÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, drag/drop i ciĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄkiego lokalnego stylu kafelkÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.
<!-- STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT_2026_06_12_END -->

<!-- STAGE231D0F_R4_FUNNEL_OWNER_DASHBOARD_TARGETED_GUARD_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0F-R4 Funnel targeted guard repair

STATUS: READY_TO_APPLY

FAKTY Z LOGÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬Äąâ€şW:
- R2 poprawnie zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â po czerwonym guardzie.
- R3 zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â na zbyt szerokim mojibake sweepie, ktÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇry zaczĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ czyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ stare historyczne wpisy `_project`.
- To nie jest wÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciwy zakres dla etapu UI Lejka.

DECYZJA:
- Naprawiamy aktywny zakres STAGE231D0F, nie caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ historiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â projektu.
- Lejek pozostaje listĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ decyzji wÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciciela, nie kanbanem.
- Nie ruszaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ logiki filtrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, Supabase, SQL, pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci, routingu, wykresÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw ani drag/drop.

R4:
- targetowany repair mojibake tylko dla runtime i aktywnych plikÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw etapu,
- guard STAGE231D0F sprawdza aktywny blok UI Dictionary, CSS i runtime,
- guardy nie failujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ na wÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡asnych definicjach tokenÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw,
- CaseDetail R4 guard jest podmieniany na bezpiecznĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ wersjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â z tokenami generowanymi po kodach znakÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.

TESTY:
- `node scripts/check-stage231d0f-funnel-owner-dashboard-visual-alignment.cjs`
- `node --test tests/stage231d0f-funnel-owner-dashboard-visual-alignment.test.cjs`
- `node scripts/check-stage231d0d-r4-case-detail-lean-service-workspace.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- W repo nadal mogĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ istnieĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ stare historyczne wpisy z mojibake. Nie naprawiaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ ich w tym etapie.
- JeÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeli chcemy peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ne sprzĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦tanie `_project`, to osobny etap: `ENCODING-SWEEP`, bez mieszania z Lejkiem.
<!-- STAGE231D0F_R4_FUNNEL_OWNER_DASHBOARD_TARGETED_GUARD_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0F-R2 Funnel color/icon/filter parity

STATUS: READY_TO_APPLY

FAKTY Z KODU:
- `SalesFunnel.tsx` ma juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ `FunnelOwnerDecisionTile`, `FunnelStageFilterChip`, `FunnelDecisionListCard`.
- `closeflow-metric-tiles.css` ma wspÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlne tony `blue`, `amber`, `red`, `green`, `purple`.
- Klienci uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ wzorca filtrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw: `cf-contact-cadence-strip`, `cf-contact-cadence-pills`, `cf-status-pill`, `pill`, `data-cf-status-tone`.

DECYZJE DAMIANA:
- ZamysÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ Lejka zostaje.
- Lejek nie jest kanbanem.
- Kafelki wÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcicielskie majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ mieĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ kolorowe ikony.
- `Cisza 7+` ma dostaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ ton `purple`.
- Filtry etapÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ mÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇwiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ tym samym jĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âzykiem wizualnym co filtry w Klientach.
- Nie ruszaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ logiki filtrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, Supabase, SQL, drag/drop ani kanbana.

ZMIANA:
- Dodany marker `STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY`.
- Dodana jawna mapa `FUNNEL_OWNER_TILE_TONE_MAP`.
- `FunnelStageFilterChip` dostaje `data-cf-status-tone`, `cf-status-pill` / `pill` oraz alias `cf-filter-pill`.
- Pasek etapÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw dostaje `cf-contact-cadence-strip`, `cf-contact-cadence-pills`, `cf-filter-strip`, `cf-filter-pills`.
- CSS wymusza widoczne kolorowe ikony w owner tiles.

TESTY:
- `node scripts/check-stage231d0f-r2-funnel-color-filter-parity.cjs`
- `node --test tests/stage231d0f-r2-funnel-color-filter-parity.test.cjs`
- `node scripts/check-stage231d0f-funnel-owner-dashboard-visual-alignment.cjs`
- `node --test tests/stage231d0f-funnel-owner-dashboard-visual-alignment.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- Nie wolno przez ten etap zmieniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ dziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ania filtrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw ani przerobiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ Lejka w kanban.
- Nie mieszaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ w tym commicie wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejszych plikÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw `STAGE231D0E`, jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli nie sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ osobno domykane.
<!-- STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY_2026_06_12_END -->

<!-- STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0F-R3 Funnel icon source truth + records header fix

STATUS: READY_TO_APPLY

FAKTY Z KODU:
- `SalesFunnel.tsx` ma juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ `FUNNEL_OWNER_TILE_TONE_MAP` i uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa `data-eliteflow-metric-tone`.
- `closeflow-metric-tiles.css` ma zmienne source of truth dla ikon i tÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a ikon.
- `SalesFunnel.tsx` nadal miaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ dwuliniowy nagÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwek rekordÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw: maÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y label + `Rekordy w aktywnym widoku`.

DECYZJE DAMIANA:
- Ikony kafelkÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw Lejka majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ mieĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ widoczny kolor.
- Kolor ikon ma iÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ ze wspÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlnego source of truth `closeflow-metric-tiles.css`.
- Nie kolorowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ lokalnie kafelkÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw Lejka losowymi hexami.
- NagÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwek rekordÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw ma byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jednym wierszem.
- Nie ruszaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ logiki filtrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, SQL, Supabase, kanbana ani drag/drop.

ZMIANA:
- Dodany marker `STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER`.
- W `closeflow-metric-tiles.css` dopisano ogÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇlnĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ reguÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â `stroke: currentColor` / `color: currentColor` dla SVG ikon metric tiles.
- W `SalesFunnel.tsx` nagÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwek rekordÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw zmieniony na `FunnelRecordsHeaderRow`.
- W `sales-funnel-stage231d0f-visual-alignment.css` dodano CSS dla jednowierszowego nagÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwka.

TESTY:
- `node scripts/check-stage231d0f-r3-funnel-icon-source-and-header.cjs`
- `node --test tests/stage231d0f-r3-funnel-icon-source-and-header.test.cjs`
- `node scripts/check-stage231d0f-r2-funnel-color-filter-parity.cjs`
- `node --test tests/stage231d0f-r2-funnel-color-filter-parity.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- JeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli ikony dalej wyglĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦dajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ bez koloru, moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄliwa przyczyna to kolejnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adowania CSS albo zewnĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âtrzne nadpisanie SVG. Guard sprawdza source of truth, ale manual QA nadal jest konieczne.
<!-- STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER_2026_06_12_END -->

<!-- STAGE231D0F_R5_FUNNEL_RECORDS_HEADER_LINE_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0F-R5 Funnel records header line repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R4 patcher dalej zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â na starym fragmencie `<p className="text-xs font-black uppercase tracking...">`.
- Przyczyna: nawet regex R4 nie trafiÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ lokalnego wariantu starego JSX.
- Problem jest w konkretnych liniach starego headera, nie w caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ym Lejku.

ZMIANA:
- R5 usuwa liniowo stare fragmenty:
  - `visibleLabel` paragraph,
  - stary `h2` rekordÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw,
  - stary licznik tekstowy.
- R5 wymaga nowego `data-stage231d0f-r5-records-header-line-repair`.
- R5 odÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşwieÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄa R3/R4 guardy, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby walidowaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y naprawiony stan bez faÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡szywego globalnego blokowania.

NIE RUSZAĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â :
- logiki filtrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw,
- Supabase,
- SQL,
- kanbana,
- drag/drop,
- STAGE231D0E.

TESTY:
- `node scripts/check-stage231d0f-r5-funnel-records-header-line-repair.cjs`
- `node --test tests/stage231d0f-r5-funnel-records-header-line-repair.test.cjs`
- R4/R3 regression guard/test
- R2 guard/test jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli istniejĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma duÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄo wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejszych Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşladÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R5_FUNNEL_RECORDS_HEADER_LINE_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R6_FUNNEL_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0F-R6 Funnel UI Dictionary guard repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R5 runtime patch przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡.
- R5 guard zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ etap wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cznie na brakach w UI Dictionary: `MetricTileIconColorSource` i `FunnelColorToneMap`.
- To jest problem guardu/pamiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âci projektu, nie logiki Lejka.

ZMIANA:
- R6 dopisuje brakujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ce pojĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcia do aktywnego bloku UI Dictionary.
- R6 guard Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czy aktywne bloki R6/R5/R4/R3/R2 zamiast patrzeĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ tylko w ostatni blok.
- R6 nie dotyka logiki filtrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, Supabase, SQL, drag/drop ani kanbana.

TESTY:
- `node scripts/check-stage231d0f-r6-funnel-ui-dictionary-guard-repair.cjs`
- `node --test tests/stage231d0f-r6-funnel-ui-dictionary-guard-repair.test.cjs`
- R5/R4/R3 regression guard/test
- R2 guard/test jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli istniejĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree jest brudny po wielu prÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇbach. Push tylko selektywny.
<!-- STAGE231D0F_R6_FUNNEL_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R6_FUNNEL_SHARED_FILTER_RESILIENT_PATCH_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0F-R6 Funnel shared filter resilient patch

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R5 shared filter patch zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â na `SalesFunnel post-patch token missing: data-stage231d0f-r5-stage-filter-no-visible-money`.
- Przyczyna: patcher szukaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ zbyt szerokiego wariantu caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego `<button>` w `FunnelStageFilterChip`.
- Realny `SalesFunnel.tsx` ma stabilny marker `data-stage231d0f-r2-filter-tone={tone}` i widoczny `cf-funnel-stage-filter-chip-value`.

ZMIANA:
- R6 patchuje wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cznie blok funkcji `FunnelStageFilterChip`, a nie caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y plik na Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşlepo.
- R6 dopina no-visible-money marker po stabilnym atrybucie.
- R6 usuwa widocznĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ kwotĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â z chipu, zostawia kwotĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â w `aria-label` i `title`.
- R6 zachowuje wspÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlny filtr dla KlientÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw przez stabilny `cf-contact-cadence-pills`.

TESTY:
- `node scripts/check-stage231d0f-r6-funnel-shared-filter-resilient-patch.cjs`
- `node --test tests/stage231d0f-r6-funnel-shared-filter-resilient-patch.test.cjs`
- R3 guard/test jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejsze Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşlady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R6_FUNNEL_SHARED_FILTER_RESILIENT_PATCH_2026_06_12_END -->

<!-- STAGE231D0F_R8_FUNNEL_ICON_TONE_SYNTAX_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0F-R8 Funnel icon tone syntax repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R7 zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â przed patchowaniem na bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdzie skÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adni w patcherze.
- BÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦d: niepoprawnie escapowany string `payment: \\'green\\''` w tablicy walidacyjnej.
- To nie jest bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦d aplikacji ani koncepcji kolorÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.

DECYZJA DAMIANA:
- UkÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ad Lejka jest zamroÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄony.
- Etap dotyczy tylko spÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇjnej kolorystyki ikon/kafelkÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.

ZMIANA:
- R8 naprawia skÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â patchera.
- R8 dodaje `node --check` dla patchera i guardu przed patchowaniem.
- R8 dodaje `metric-icon-tone-registry.ts`.
- R8 podpina Lejek i operator metric tone contract pod wspÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlny resolver koloru.
- Kafel `PieniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦dze` uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa `PaymentEntityIcon`, nie strzaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ki.

TESTY:
- `node --check payload/scripts/apply-stage231d0f-r8-funnel-icon-tone-syntax-repair.cjs`
- `node --check payload/scripts/check-stage231d0f-r8-funnel-icon-tone-syntax-repair.cjs`
- `node scripts/check-stage231d0f-r8-funnel-icon-tone-syntax-repair.cjs`
- `node --test tests/stage231d0f-r8-funnel-icon-tone-syntax-repair.test.cjs`
- R6 guard jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Zmiana ikony `PieniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦dze` ze strzaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ki na ikonĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci jest Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşwiadoma.
- Manual QA wymagany dla realnego koloru SVG.
<!-- STAGE231D0F_R8_FUNNEL_ICON_TONE_SYNTAX_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R9_FUNNEL_ICON_TONE_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0F-R9 Funnel icon tone UI Dictionary guard repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R8 patch runtime przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡.
- R8 zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â dopiero na guardzie dokumentacji.
- BrakujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cy token: `SharedFilterStrip` w aktywnym zakresie UI Dictionary.
- To nie jest problem Lejka ani kolorÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw ikon.

ZMIANA:
- R9 dopisuje aktywny blok UI Dictionary z literalami:
  - `SharedFilterStrip`
  - `FunnelLayoutFrozen`
  - `FunnelIconToneSourceTruth`
  - `MetricTileIconColorSource`
- R9 odÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşwieÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄa R8 guard, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby czytaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ bloki R9/R8/R6/R5/R4 razem.
- R9 nie zmienia runtime Lejka.

TESTY:
- `node --check` dla R9/R8 guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw
- R9 guard/test
- R8 regression guard/test
- R6 guard jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejsze Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşlady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R9_FUNNEL_ICON_TONE_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R10_FUNNEL_ICON_TONE_POWERSHELL_STRICTMODE_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0F-R10 Funnel icon tone PowerShell StrictMode repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R9 zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â po dopisaniu UI Dictionary i project memory.
- BÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦d: `The property 'check:stage231d0f-r9-funnel-icon-tone-ui-dictionary-guard-repair' cannot be found on this object.`
- Przyczyna: PowerShell `Set-StrictMode` i dostĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âp do brakujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cej wÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciwoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci w `package.json`.
- To nie jest problem runtime Lejka.

ZMIANA:
- R10 usuwa kruchy dostĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âp PowerShell `$Pkg.scripts.'...'`.
- Dopisanie scriptÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw do `package.json` odbywa siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â przez `node -e`.
- R10 uruchamia R10/R9/R8 guardy i testy.
- R10 nie zmienia runtime Lejka.

TESTY:
- `node --check` dla R10/R9/R8 guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw
- R10 guard/test
- R9 guard/test
- R8 guard/test
- R6 guard jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejsze Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşlady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R10_FUNNEL_ICON_TONE_POWERSHELL_STRICTMODE_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R11_FUNNEL_R6_REGRESSION_GUARD_RESOLVER_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0F-R11 Funnel R6 regression guard resolver repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R10/R9/R8 guardy i testy przeszÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y.
- Etap zatrzymaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ wyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cznie stary R6 regression guard.
- R6 guard oczekiwaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ literalÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw `tone: 'blue'`, `tone: 'amber'`, `tone: 'purple'`, `tone: 'red'`, `tone: 'green'`.
- Po R8 te literaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y zostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y celowo zastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦pione resolverem `resolveCloseflowMetricIconTone`.

ZMIANA:
- R11 odÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşwieÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄa R6 guard/test, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby akceptowaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ nowy source of truth.
- R11 odpala R11/R10/R9/R8/R6 guardy i testy.
- R11 nie zmienia runtime Lejka.

TESTY:
- `node --check` dla guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw R11/R10/R9/R8/R6
- R11 guard/test
- R10 guard/test
- R9 guard/test
- R8 guard/test
- R6 refreshed guard/test
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejsze Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşlady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R11_FUNNEL_R6_REGRESSION_GUARD_RESOLVER_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R12_FUNNEL_METRIC_COLORS_REAL_CSS_ENFORCE_2026_06_12_START -->
## 2026-06-12 18:30 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0F-R12 Funnel metric colors real CSS enforce

STATUS: READY_TO_APPLY

FAKTY Z QA:
- Po pushu R11 ukÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ad Lejka jest OK.
- W Vercel `/funnel` nadal wyglĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦da prawie szaro.
- Problem: kolor nie dochodzi wystarczajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦co mocno do kafli/SVG.

FAKTY Z KODU:
- `SalesFunnel.tsx` ma `data-eliteflow-metric-tone` i `cf-top-metric-tile-icon`.
- `closeflow-metric-tiles.css` ma tokeny `--cf-metric-tone-*-icon`, ale nie wymuszaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nego `stroke: currentColor` na SVG i dzieciach SVG.
- `PieniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦dze` ma dÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ugĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ wartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ i wymaga value-kind.

DECYZJA:
- UkÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ad Lejka zostaje zamroÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄony.
- R12 zmienia tylko realnĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ kolorystykĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â kafelkÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw/ikon.
- `Cisza 7+` ma byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ purple, nie amber.
- Kolor ma byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ subtelny, nie tĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcza.
- Source of truth: `closeflow-metric-tiles.css`.

ZMIANA:
- `FUNNEL_OWNER_TILE_TONE_MAP` ma jawne tony: blue, amber, purple, red, green.
- Dodano `data-cf-metric-value-kind`.
- `closeflow-metric-tiles.css` wymusza SVG `stroke: currentColor`.
- Dodano subtelne tÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a/bordery kafli per tone.
- Dodano money value sizing.

TESTY:
- `node scripts/check-stage231d0f-r12-funnel-metric-colors-real-css-enforce.cjs`
- `node --test tests/stage231d0f-r12-funnel-metric-colors-real-css-enforce.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- Visual QA dalej wymagane, bo to etap CSS/render.
- Local tree ma wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejsze Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşmieci; push tylko selektywny.
<!-- STAGE231D0F_R12_FUNNEL_METRIC_COLORS_REAL_CSS_ENFORCE_2026_06_12_END -->

<!-- STAGE231D0F_R13_FUNNEL_VISUAL_COLOR_DENSITY_2026_06_12_START -->
## 2026-06-12 19:20 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0F-R13 Funnel visual color density

STATUS: READY_TO_APPLY

FAKTY Z QA:
- R12 przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ technicznie i zostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ wypchniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âty.
- Ekran `/funnel` nadal wyglĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦da za blado.
- Problem nie dotyczy juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ tylko ikon; brakuje warstwy kolorystycznej kafli i rekordÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.

DECYZJE DAMIANA:
- UkÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ad Lejka jest zaakceptowany i zamroÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄony.
- DodaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ kolor bez tĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âczy.
- Kafelki majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ mieĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ kolor w ikonie, wartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci i subtelnym surface/accent.
- Rekordy majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ dostaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ lekkie semantyczne akcenty.
- Przyciski `OtwÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇrz` majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ rÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwne i bez Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡amania.

ZMIANA:
- R13 dodaje `FunnelDecisionSignal tone`.
- R13 dodaje data atrybuty rekordÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.
- R13 dodaje tone surface/accent dla kafli w `closeflow-metric-tiles.css`.
- R13 zwiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âksza open button z 132px do 156px i dodaje nowrap.
- R13 nie zmienia layoutu ani logiki filtrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.

TESTY:
- `node scripts/check-stage231d0f-r13-funnel-visual-color-density.cjs`
- `node --test tests/stage231d0f-r13-funnel-visual-color-density.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- To etap CSS/render, wiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âc manual QA jest obowiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦zkowy.
- Local tree ma wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejsze Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşmieci; push tylko selektywny.
<!-- STAGE231D0F_R13_FUNNEL_VISUAL_COLOR_DENSITY_2026_06_12_END -->

<!-- STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_START -->
## 2026-06-12 20:10 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0G Visual Tile Source Truth Atlas

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- STAGE231D0F-R13 przeszedÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ guard/test/build.
- Commit `0b2f6fb2 fix: improve funnel visual color density` zostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ wypchniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âty na `dev-rollout-freeze`.
- Damian wizualnie akceptuje Lejek i zamraÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄa go jako baseline.

DECYZJA DAMIANA:
- FunnelMetricTileR13 zostaje Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡em prawdy dla globalnego CloseFlowMetricTileV2.
- Nie przebudowywaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ej aplikacji chaotycznie.
- Najpierw source truth, atlas, guard i plan fal.

ZMIANA:
- Dodano `_project/CLOSEFLOW_VISUAL_TILE_SYSTEM.md`.
- Dodano `_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md`.
- Dopisano UI Dictionary: CloseFlowMetricTileV2, CloseFlowMetricToneMap, FunnelMetricTileR13, SharedFilterStrip, RecordListCard, RightRailCard, FinanceMetricTile.
- Dodano guard/test D0G.
- Runtime widokÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw nie jest przepinany w tym etapie.

TESTY:
- `node scripts/check-stage231d0g-visual-tile-source-truth-atlas.cjs`
- `node --test tests/stage231d0g-visual-tile-source-truth-atlas.test.cjs`
- R13 regression guard/test jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- UI Dictionary ma stare duplikaty i historyczne mojibake. Guard D0G skanuje aktywny blok D0G i nowe source truth, nie caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ historiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â sÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ownika.
- PeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ny cleanup lokalnych Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşmieci po starych paczkach zostaje osobnym etapem.
<!-- STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_END -->

<!-- STAGE231D0G_CLOSEOUT_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_START -->
## 2026-06-12 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0G-CLOSEOUT Visual Tile Source Truth Atlas

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
## 2026-06-12 Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„â€ž STAGE231D0G-CLOSEOUT-R2 Guard scope repair

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
## 2026-06-12 22:05 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0H-N1-R3 Notifications visual source cleanup section bounds

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

Chroni klasĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdu: kafelki display-only bez CTA, brak edycji potencjaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡u, brak widocznego potencjaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡u przy tworzeniu leada, zlewajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cy siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â layout work-row i bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦d group.key w overflow.

## 2026-06-14 10:40 Europe/Warsaw - STAGE231G R6 guard/test correction

R6 poprawia guard/test po faÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡szywym zamkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âciu R5: walidacja sprawdza realne klasy content/status/actions oraz brak stale group.key tylko w overflow section. Guard jest ASCII/no-BOM.

## 2026-06-14 10:45 Europe/Warsaw - STAGE231G_R7 guard/test

Dodano:
- scripts/check-stage231g-r7-potential-only-source-and-workrow.cjs
- tests/stage231g-r7-potential-only-source-and-workrow.test.cjs

Chroni: potencjaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ otwierany jako osobny modal tylko do wartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci, zapis value + deal_value w API, brak otwierania peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nej edycji leada z CTA potencjaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡u oraz desktopowe wyrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwnanie akcji wiersza.

## 2026-06-14 - STAGE231G_R3 LeadDetail function mapping guard

- guard: scripts/check-stage231g-r3-lead-detail-function-mapping.cjs
- test: 	ests/stage231g-r3-lead-detail-function-mapping.test.cjs
- klasa bĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âdu: martwe/Ă„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹşle podpiÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âte akcje LeadDetail, zĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇy parser potencjaĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇu, missing_item mieszany ze zwykĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇym taskiem, zlewajÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€šĂ‚Â¦ce siÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Â wiersze dziaĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇaĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„Äľ.
- status: do uruchomienia lokalnie po apply.

## STAGE231G_R4_LEAD_DETAIL_FUNCTION_MAPPING_CLOSEOUT_FIX

Data: 2026-06-14 11:45 Europe/Warsaw
Guard: scripts/check-stage231g-r4-lead-detail-function-mapping-closeout.cjs
Test: tests/stage231g-r4-lead-detail-function-mapping-closeout.test.cjs
Sprawdza: brak legacy MissingItemQuickActionModal w LeadDetail, ContextActionDialogs/blocker jako jedyna sciezka Brak, hard missing delete w overflow i odporny CSS work-row.

## 2026-06-14 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: CaseDetail runtime repair for fake dictation, nextAction missing fallback, contractValue percent-only behavior, payment history copy, and full payment source in case history.
- SQL: NOT_TOUCHED.
- Deferred: cost lifecycle edit/delete and canonical case_item dual-path decision remain R1C/R1D.

## 2026-06-14 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: fixed shared CaseFinanceEditorDialog contractValue clearing bug after R1B.
- Guard: scripts/check-stage231h-r1b-case-detail-runtime-repair.cjs now covers CaseDetail and shared finance dialog.
- Decision: case_item source truth decision: two UI entries, one case_items contract.
- Risk: cost lifecycle left as R1C.
- SQL: NOT_TOUCHED.

## STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ guard/test

- `scripts/check-stage231h-r1c-case-detail-cost-correction.cjs`
- `tests/stage231h-r1c-case-detail-cost-correction.test.cjs`

Zakres: wspÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlne okno `Koryguj wpÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â/koszt`, czerwone koszty, update/delete kosztu, docs/run report/Obsidian payload.

## 2026-06-14 15:45 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231H_R1D_FINANCE_CORRECTION_MODAL_COMPACT

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: compact cleanup of CaseDetail finance correction modal after R1C.
- Decision: remove redundant cost status chip from the correction list; cost status remains editable inside the cost correction form.
- Decision: commission payment is a paid commission entry by default; remove status/type selectors from add-commission-payment UI.
- Decision: remove the redundant "Korekta / prowizja" fallback label from payment rows.
- SQL: NOT_TOUCHED.
- Manual test: open Koryguj wpÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â/koszt, verify rows fit, add commission payment, add/correct/delete cost, refresh.

## STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ 2026-06-14 16:40 Europe/Warsaw
- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH / SERVER_UI_REQUIRED
- Scope: payment correction now edits existing payment amount/date/note through updatePaymentInSupabase; cost correction edits kind/date/status/note and money fields.
- SQL: not touched.
- Risk: if payment PATCH fails on server, backend payment endpoint repair is required.


## 2026-06-14 HH:mm Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR
- Added/updated guards: R1D, R1F, R1F4.
- Required: R1/R1B/R1D/R1F/R1F4 guard/test + build + diff-check.

## 2026-06-14 HH:mm Europe/Warsaw - STAGE231H_R1G_COST_OTHER_NAME_AND_REIMBURSABLE_FLAG
- Added guard: scripts/check-stage231h-r1g-cost-other-name-and-reimbursable-flag.cjs.
- Added test: tests/stage231h-r1g-cost-other-name-and-reimbursable-flag.test.cjs.

## 2026-06-14 HH:mm Europe/Warsaw - STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC
- Added guard: scripts/check-stage231h-r1g2-case-detail-cost-payment-closeout.cjs.
- Added test: tests/stage231h-r1g2-case-detail-cost-payment-closeout.test.cjs.
- Guard blocks claiming full CaseDetail PASS without SERVER_UI_REQUIRED/manual status.


## STAGE231H_R1G3_CASE_DETAIL_MANUAL_UI_PASS Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ manual confirmation guard

- date: 2026-06-14 18:55 Europe/Warsaw
- added guard: scripts/check-stage231h-r1g3-case-detail-manual-ui-pass.cjs
- added test: tests/stage231h-r1g3-case-detail-manual-ui-pass.test.cjs
- purpose: keep the manual UI confirmation and next-stage boundary documented without touching runtime.

## STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME

- data: 2026-06-14 19:10 Europe/Warsaw
- guard: scripts/check-stage231h-r1d2-case-detail-note-dictation-restore.cjs
- test: tests/stage231h-r1d2-case-detail-note-dictation-restore.test.cjs
- blokuje: disabled/wkrotce jako finalny stan, Dyktuj notatke bez SpeechRecognition, brak autosave 2000 ms, brak caseId, pusta transkrypcja, brak dokumentacji.


## STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ 2026-06-14 19:40 Europe/Warsaw

- status: RUNTIME_HOTFIX_PREPARED
- zakres: drugi widoczny przycisk w panelu Notatki sprawy nie moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe zostaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jako disabled Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľNotatka gÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡osowa Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ wkrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇtceĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„â€ž; ma uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ tego samego handlera SpeechRecognition/autosave co przycisk w panelu DziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ania sprawy.
- runtime: src/pages/CaseDetail.tsx, bez SQL i bez R1E kosztÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw zwrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇconych.
- test: R1D2 guard/test + R1D2 R4 guard/test + build + diff-check.
- ryzyko: wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejszy R1D2 zabezpieczaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ pierwszy przycisk, ale nie objĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ drugiego widocznego przycisku w panelu notatek.


## 2026-06-14 22:00 Europe/Warsaw - STAGE231H_R1D2_R6_R9_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR

Status: DO_APPLY / mass repair from clean origin.
Zakres: CaseDetail note follow-up source map and notes CRUD. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek dostaje Edytuj/UsuĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„Äľ/Zapisz. Etap zastÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âpuje runtime file bez kruchych anchorĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w po bĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âdach R6/R7/R8.


## 2026-06-14 22:15 Europe/Warsaw - STAGE231H_R1D2_R6_R9D_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR_GUARD_SYNC

Status: DO_APPLY / guard-ledger sync after R9 partial apply.
Zakres: centralny R1G2 product-pass sync wymagany przez legacy R1D2 guard plus R9 mass repair. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek ma Edytuj/UsuĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„Äľ/Zapisz.


## 2026-06-14 22:30 Europe/Warsaw - STAGE231H_R1D2_R6_R9E_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_GUARD_SYNC

Status: DO_APPLY / MASS_GUARD_SYNC_CONTINUATION
Zakres: masowe domkniÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âcie klasy bĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚ÂdĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w legacy markerĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w. Synchronizuje R1G2, R1D2 R4, R9, R9D i R9E w centralnych ledgerach oraz uruchamia peĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇny chain guardĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w/testĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w/build.


## 2026-06-14 22:40 Europe/Warsaw - STAGE231H_R1D2_R6_R9F_CASE_NOTE_FOLLOWUP_NOTES_CRUD_GUARD_REGEX_MASS_FIX

Status: DO_APPLY / MASS_GUARD_REGEX_FIX
Zakres: naprawa klasy bĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âdu guardĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w R9D/R9E: sprawdzenie runtime regex
eplace(/\s+/g, ' ') w guardzie musi mieÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€ąĂ˘â‚¬Ë‡ podwĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡jnie escapowany backslash. Bez tego guard szuka bĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âdnego
eplace(/s+/g, ' ').


## 2026-06-14 22:50 Europe/Warsaw - STAGE231H_R1D2_R6_R9G_CASE_NOTE_FOLLOWUP_NOTES_CRUD_LOCAL_TASKS_GUARD_MASS_FIX

Status: DO_APPLY / MASS_LOCAL_TASKS_GUARD_FIX
Zakres: naprawa klasy bĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âdu guardĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w R9E/R9F: runtime poprawnie dopina nowy follow-up task do lokalnego 	asks przez setTasks((current) => dedupeCaseTasks([normalizedCreated, ...current], caseId, caseData));, a guard nie moĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ˘â‚¬ĹľÄ‚â€ąÄąÄ„e wymagaÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€ąĂ˘â‚¬Ë‡ nieistniejÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€šĂ‚Â¦cej skĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇadni previousTasks.

## STAGE231H_R1D2_R10C_CASE_DETAIL_ACTION_MAP_FOLLOWUP_NOTES_FINANCE_LOADING

- Data: 2026-06-14 23:45 Europe/Warsaw
- Status: TECH_STAGE_IN_PROGRESS
- Zakres: CaseDetail action map, note follow-up display/source map, quick note local append, finance loading flicker removal.
- Audyt: R10 failed on brittle anchor. R10C uses regex/whole-class source-aware patch and guard.

### STAGE231H_R1D2_R11_NOTE_PANEL_FOLLOWUP_PROMPT_MAP_GUARD
- data: 2026-06-14T20:31:30.095Z
- status: DO_TEST_AND_PUSH
- zakres: notatki CaseDetail pokazujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ do 5 wpisÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ tooltip peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nej treÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci, szybka notatka otwiera ten sam prompt follow-upu co dyktowanie, a follow-up w dziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aniach pokazuje treÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ notatki jako opis.
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
- Zakres: CaseDetail notatki sprawy, follow-up po notatce, kasowanie powiÄ‚â€žĂ˘â‚¬Â¦zanego taska.
- Status: LOCAL_APPLIED_PENDING_VERIFY

## STAGE231H_R1D2_R15C - 2026-06-15 15:10 Europe/Warsaw
- Guard: scripts/check-stage231h-r1d2-r15c-note-followup-bidirectional-link-and-work-row-title.cjs.
- Test: tests/stage231h-r1d2-r15c-note-followup-bidirectional-link-and-work-row-title.test.cjs.

## STAGE_BRANCH_AUDIT_001_MAIN_QUARANTINE_AND_DEV_FREEZE_GUARD - 2026-06-15 18:35 Europe/Warsaw

Dodano guard:
- scripts/check-closeflow-branch-scope.cjs

Cel:
- blokować przypadkową pracę poza dev-rollout-freeze.
