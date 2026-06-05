# 07_NEXT_STEPS - CloseFlow / LeadFlow

## Current next step after 2026-05-16 memory closeout

1. Pull latest `dev-rollout-freeze` locally.
2. Verify presence of project memory protocol files and marker in `AGENTS.md`.
3. Verify Obsidian `PROJECTS.md` points to `10_PROJEKTY/CloseFlow_Lead_App/`.
4. Only after both app repo and Obsidian repo pushes are confirmed, run a separate archive/merge stage for old CloseFlow paths.

## Do not do yet

- Do not delete old V8/V9 blocks from `AGENTS.md`.
- Do not delete old Obsidian paths such as `10_PROJECTS`.
- Do not archive old CloseFlow notes until the new map is confirmed after pull.
- Do not change runtime UI, routing, product logic, styles or architecture in this organizational stage.

## Required closure evidence for next stage

- Scan proof in `_project/runs/`.
- App repo status after pull.
- Obsidian repo status after pull.
- Manual test status, even if the stage is organizational.
- Tests/guards status or explicit skip reason.

## 2026-05-16 — Next step po Stage92 {#STAGE92_CALENDAR_SELECTED_DAY_READABLE_ACTIONS}

1. Wykonać test ręczny na `/calendar`: dzień z wydarzeniem, zadaniem i wpisem bez powiązania.
2. Sprawdzić desktop: treść po lewej, akcje po prawej w dwóch rzędach, bez białej pustej belki.
3. Sprawdzić mobile: akcje nie rozjeżdżają wpisu i nie chowają tytułu.
4. Po potwierdzeniu Damiana dopiero łączyć z następnymi paczkami i robić zbiorczy push.

## STAGE93_MANUAL_TEST_CALENDAR_DESKTOP — 2026-05-16
- Manual test needed: open `/calendar` at desktop 2048x972 and normal zoom.
- Verify the week rail shows day label, full date label and plain text count.
- Verify no black count badge/plaque and no old week filter list.

## NEXT_STAGE_CALENDAR_BATCH_REPAIR_AFTER_SWEEP_2026_05_16

1. Przeczytać `_project/runs/STAGE94_CALENDAR_UI_SWEEP_LOCAL_REPORT.md`.
2. Na podstawie P1 zrobić jedną zbiorczą paczkę Calendar cleanup, zamiast kolejnych mikrołatek.
3. Ręcznie sprawdzić `/calendar` na desktop 2048x972 i normalnym zoomie.

## NEXT STEP: Manual Calendar consolidated cleanup test

- Open /calendar in week and month mode.
- Desktop: 2048x972 and normal zoom.
- Verify selected day renders only V9 tile, without duplicate old list and without extra badge.
- Verify week rail count is text, not a dark or pill badge.
- Verify month grid still works and compact Wyd/Zad labels stay only inside month cells.

## STAGE94_SWEEP_REGEX_FIX_V4_NEXT_2026_05_16

- Run manual /calendar test after the sweep passes: month selected day, week rail, 2048x972 desktop, normal zoom.
- Then run full quiet release gate before the planned collective GitHub push.

## Next - Stage94 weekly plan manual test - 2026-05-16

- Manual test /calendar in week view: entries must show Wydarzenie/Zadanie/Lead, time, status, full title, relation and actions.
- Verify month grid still behaves as before.

## STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V2 next
- Manual test: /calendar weekly view.
- Then run full quiet gate before collective GitHub push.

## STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V3 next
- Manual test: /calendar weekly view.
- Then run full quiet gate before collective GitHub push.

## STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V4

Next: manual /calendar week view at desktop width. Confirm no Wy/Zad-only rows and no hidden title-only entries.

## Stage95 manual test
- TEST RĘCZNY DO WYKONANIA: /tasks, /cases, /calendar.
- Verify trash icon is red, background is white/subtle, hover is subtle, and there is no red square/plaque.

## Stage95 V2 manual test
- TEST RĘCZNY DO WYKONANIA: /tasks, /cases, /calendar. Verify red trash icon, subtle white background, no red plaque.


## Stage96 leads right rail width and position
- Test ręczny: /leads na desktopie, sprawdzić czy Filtry proste są nad Najcenniejsze leady i mają szerokość jak /clients.
- Test ręczny: /clients porównać szerokość raila.
- Nie zmieniać listy leadów w tym etapie.

- Manual test: compare /leads and /clients right rail on desktop; verify Filtry proste is above Najcenniejsze leady and rail is not ~195px.

### Next - Stage96 manual check
- Open /leads and /clients on desktop.
- Confirm /leads right rail is not narrow and SimpleFiltersCard is above TopValueRecordsCard.
- Do not push until manual UI check and full quiet gate are done.

### Next - Stage96 V4 manual check
- Open /leads and /clients on desktop.
- Confirm /leads right rail width matches /clients and filters stay above top value card.
- Run full quiet gate after manual UI OK.

## STAGE96_V5_NEXT_STEPS
- Manual test /leads and /clients on desktop.
- Confirm simple filters appear above top-value rail and rail does not collapse visually.


## STAGE97_NEXT_MANUAL_TODAY_OVERDUE_TASK_DONE

- Manual test: open /, expand Zaległe zadania or Zadania do obsługi, verify every task row has Edytuj and Zrobione.
- Click Zrobione and verify the task disappears from the active Today list after completion.

## Stage97 manual test / Today

- Open /.
- Find Zalegle zadania or Zadania do obslugi.
- Verify task rows show Edytuj + Zrobione.
- Click Zrobione and confirm task disappears after completion refresh.


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

<!-- STAGE98B_100B_CALENDAR_POLISH_WEEK_PLAN_NEXT_2026_05_17 -->
## Następny krok po Stage98B-100B

1. Uruchomić paczkę lokalnie na `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`.
2. Jeżeli wszystkie testy i `verify:closeflow:quiet` przejdą, paczka wykona commit/push.
3. Otworzyć `/calendar`.
4. Zrobić screen dnia z `1 wpis` i dnia z `0 wpisów`.
5. Zamknąć etap dopiero po potwierdzeniu braku mojibake i braku pustego białego mini-kafelka.
6. Dopiero potem ruszać modal i templates.

<!-- STAGE104C_WEEK_PLAN_CARD_UNCLAMP -->

## 2026-05-17 — Stage104C: Calendar week plan card unclamp

### FAKTY Z KODU / PLIKÓW
- Poprzednia paczka Stage104B nie wykonała patchera: plik CJS miał błąd składni przez nieucieczony backtick w osadzonym teście.
- Faktyczny problem UI: w Plan najbliższych dni wpis istnieje, ale renderuje się jako wąski pionowy fragment akcji.
- Naprawa Stage104C: root week-plan card nie używa legacy klasy calendar-entry-card i dostaje anti-collapse CSS: width 100%, max-width none, min-height 92px, overflow visible, visibility visible, opacity 1.

### GUARDY
- Stage99 pilnuje klas i zakazu mieszania calendar-entry-card z cf-calendar-week-plan-entry-card.
- Stage100 pilnuje DOM modelu, pełnych labeli, braku display contents wrappera i anti-collapse CSS.
- Stage104 pilnuje widocznego payloadu karty oraz braku hidden/zero-size reguł.

### TESTY AUTOMATYCZNE
Do potwierdzenia przez run:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- node --test tests/stage99-calendar-active-class-contract.test.cjs
- node --test tests/stage100-calendar-week-plan-entry-visible.test.cjs
- node --test tests/stage104-calendar-rendered-week-plan-smoke.test.cjs
- npm run build
- npm run verify:closeflow:quiet

### TEST RĘCZNY
Status: TEST RĘCZNY DO WYKONANIA. Wejść na /calendar i sprawdzić dzień z 1 wpis oraz dzień z 0 wpisów.

## Stage104E - do rozważenia
- Audyt opóźnienia po Usuń / Zrobione: optimistic update albo refresh bez Google inbound pull po lokalnej mutacji.


## STAGE107_CLIENT_DETAIL_RUNTIME_TDZ_FINANCE_FIX_2026_05_17

- Po wdrozeniu Stage107 wykonac reczny test ClientDetail.
- Jezeli console nadal pokazuje Radix `Missing Description`, zrobic osobny etap aria-dialog-accessibility.
- Jezeli console nadal pokazuje `DEP0169 url.parse`, zrobic osobny etap backend dependency/runtime warning audit.


## Stage113 manual visual check
1. Sprawdzić logo w desktop sidebar, mobile top, mobile drawer i login.
2. Zgłosić tylko jedną korektę, jeśli potrzebna: rozmiar, kontrast, margines albo obrys.


- After Stage114A V8 passes, proceed to Stage114B: fix /calendar refresh loading behavior.

- 2026-05-17 Stage114B local-only: calendar hard-refresh data load waits for workspaceReady; added guard tests/stage114-calendar-hard-refresh-data-load-contract.test.cjs; no git add/commit/push.


## Stage114C V2 - calendar shift persistence guard fix local only
- Local-only ZIP stage.
- Guard repaired after V1 regex false negative.
- Task shifts must write date, scheduledAt, dueAt and time before success toast.
- Manual QA still required on /calendar for +1D, +1W and +1H.

## STAGE114D_NEXT_PUSH_READY

Po recznym potwierdzeniu modala Stage114 A-D spiac w jeden selektywny push. Nie uzywac git add .

## STAGE114D_V2_CALENDAR_MODAL_VIEWPORT_AND_DOC_GUARD_LOCAL_ONLY

- Status: local-only, no git add, no commit, no push.
- Scope: /calendar modal viewport, Radix DialogDescription, Stage114 docs encoding cleanup after broad Stage98 guard failed on _project reports.
- Guards: stage98 polish mojibake calendar guard, Stage114B, Stage114C, Stage114D modal viewport, Stage108 render smoke, build, verify:closeflow:quiet.
- Manual QA: edit calendar entry, title not clipped, scroll body works, sticky footer does not cover fields, no Radix description warning.

## STAGE114D_V3_NEXT_MANUAL_QA
Manual QA: /calendar edit modal, header offset, bottom scroll, sticky footer, no Radix missing description warning. If accepted, Stage114 batch can move to selective local commit/push planning.


## Stage114 manual confirmation after V5
- Damian checks /calendar hard refresh, +1D/+1W/+1H task persistence and edit modal viewport.

## Stage114 next
- Manual QA: /calendar edit modal title, scroll, footer, Radix description warning.
- If manual QA passes, prepare selective batch push later.

## STAGE114D_V8_CALENDAR_MODAL_VIEWPORT_STAGE102_GUARD_FIX_LOCAL_ONLY

- Status: LOCAL ONLY, no git add, no commit, no push.
- Zakres: /calendar modal viewport, Stage102 guard compatibility, Stage114D guard.
- Decyzja: calendar-entry-modal-viewport is allowed as a viewport safety class and is not a local dark overflow shell.
- Guardy: Stage102, Stage98, Stage114B, Stage114C, Stage114D, Stage108 smoke, build, verify:closeflow:quiet.
- Test reczny: otworzyc /calendar, edycje wpisu i tworzenie wpisu; tytul nie moze byc uciety, footer nie moze przykrywac pol, konsola bez Radix Missing Description.

## Stage114 after V9
- Manual browser QA: hard refresh calendar, shift task +1D/+1W/+1H, open calendar create/edit modals.
- If manual QA passes, prepare selective batch commit later. Do not use git add .

## Stage114D V10 next manual check
- Open /calendar.
- Open create event, create task and edit entry modals.
- Confirm header is not clipped and footer does not cover fields.
- Confirm browser console has no Radix missing description warning.

<!-- STAGE115_LEAD_CONTACT_CLIENT_PARITY -->

## Stage115 - następny krok po 3.1

1. Damian: test ręczny /leads/:id: karta kontaktowa po lewej, telefon/e-mail/firma/ostatni kontakt, copy button.
2. Jeżeli 3.1 OK: osobny podetap Stage115.2 dla notatek leada.
3. Potem osobno: Stage115.3 overdue taski i Stage115.4 finanse leada, bez mieszania przyczyn w jednym patchu.

## Stage115B next step

- Damian manual check: verify LeadDetail note section placement and content for leads with/without source note and note activity.
- Continue Stage115 with overdue and finance fixes only after this placement is accepted.

## Stage115C next step

- Damian manual check: type a note in LeadDetail Historia kontaktu and click Dodaj notatkę. Expected: inline save, no modal.
- If confirmed, continue Stage115D with overdue/task persistence.
- Keep finance repair as a separate Stage115E step.

## Stage115D next step

- Damian manual check: create or find a lead task with a date in the past and status todo/open. Expected: `Zaległe` red pill in work list and nearest action.
- If confirmed, continue Stage115E finance repair.
- Do not mix finance with overdue logic.

## Stage115E next step

- Damian manual check: click Dodaj zaliczkę and Płatność częściowa in /leads/:id. Expected: modal opens, positive amount saves, finance panel refreshes.
- After manual QA, close Stage115 LeadDetail P1 batch or schedule full finance unification.

## Stage116 - Today work item card source of truth

- Manual QA: /today task/event rows and Najbliższe 7 dni task/event rows.
- If accepted, plan Stage117 to migrate Calendar selected-day/week-plan to the same card contract.
- Do not migrate LeadDetail/ClientDetail/CaseDetail in this stage.
## Stage117 next step

- Manual QA: /leads at 80%, 90%, 100% zoom and mobile width.
- Confirm Filtry proste starts level with search, Najcenniejsze leady sits directly below, no overlap or squeezed rail.
- If accepted, continue with next P1 visual/layout item.

## Stage115 - next steps after CaseDetail crash

STAGE115_CASE_DETAIL_RUNTIME_CRASH_HOTFIX_2026_05_18

1. Damian runs the Stage115 package with `-DoPush`.
2. Damian manually opens a case and hard-refreshes the route.
3. If CaseDetail is stable, next batch: Radix Dialog Description warning + client should not show leads + lead detail spacing.
4. Do not mark Stage113/Stage114 as closed until Damian confirms their separate fixes.


<!-- STAGE119_CALENDAR_RELEASE_GATE_TRUST START -->
## Next after Stage119

1. Run ZIP apply with -DoPush.
2. Confirm verify:closeflow:quiet passes.
3. Manual QA on /calendar: hard refresh, week/month/selected day, modals, +1H/+1D/+1W, done/delete.
4. If manual QA still shows calendar P0 issues, prepare the next batch as a runtime/data patch, not another release-gate patch.
<!-- STAGE119_CALENDAR_RELEASE_GATE_TRUST END -->

<!-- STAGE119_V2_NEXT_CALENDAR_MANUAL_QA -->
## Stage119 V2 next - calendar manual QA

After Stage119 V2 passes and push completes, Damian should test `/calendar`: hard refresh, week, month, selected day, create/edit modals, +1H, +1D, +1W, Zrobione, Usun.

If manual QA exposes a real runtime issue, make the next package a narrow Calendar P0/P1 fix using the trusted gate.
<!-- /STAGE119_V2_NEXT_CALENDAR_MANUAL_QA -->

<!-- STAGE119_V3_NEXT_CALENDAR_MANUAL_QA -->
## Stage119 V3 next - calendar manual QA

After Stage119 V3 passes and push completes, Damian should test `/calendar`: hard refresh, week, month, selected day, create/edit modals, +1H, +1D, +1W, Zrobione, Usun.

If manual QA exposes a real runtime issue, make the next package a narrow Calendar P0/P1 fix using the now-trusted gate.
<!-- /STAGE119_V3_NEXT_CALENDAR_MANUAL_QA -->

<!-- STAGE119_V4_RELEASE_GATE_REQUIREDTESTS_DEDUPE -->
## 2026-05-18 - Stage119 V4 - release gate requiredTests dedupe

Status: WDROZONE PRZEZ ZIP / TESTY W TOKU.

Fakty:
- Stage98 calendar mojibake guard jest pojedynczym pre-build hard gate w erify:closeflow:quiet.
- Stage119 V4 deduplikujeequiredTests, zeby ponowione paczki V2/V3 nie zostawialy zdublowanego wpisu Stage119.
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


<!-- STAGE121_CALENDAR_SHIFT_PERSISTENCE_OPTIMISTIC_STATE -->
## 2026-05-18 - Stage121 calendar shift persistence optimistic state

Status: WDRAŻANE.

Cel: +1H/+1D/+1W musi wizualnie przesuwać wpis od razu po udanym PATCH, zamiast polegać wyłącznie na refreshSupabaseBundle().

Test ręczny: /calendar, wpis task/event, akcje +1H/+1D/+1W. Po sukcesie karta ma zmienić dzień/godzinę.
<!-- /STAGE121_CALENDAR_SHIFT_PERSISTENCE_OPTIMISTIC_STATE -->

## 2026-05-18 - STAGE122_RUNTIME_AUTH_API_PWA_HARDENING

1. Deploy Stage122 and verify /api/version returns stage marker.
2. In DevTools Network, confirm runtime marker appears and the old service worker is unregistered.
3. Retest Calendar shift actions.
4. If 401 remains, repair auth/session flow next; do not patch calendar UI again before API status is clean.

## 2026-05-18 - STAGE122_V9_SYSTEM_VERSION_ROUTE_RESILIENT_AND_MASS_GATE

1. Deploy Stage122 V9.
2. Check /api/version.
3. Check console marker and JS bundle hash.
4. Check /api/me.
5. If /api/me remains 401, fix auth/session/workspace before touching Calendar UI.

<!-- STAGE124A_SUPABASE_EGRESS_NEXT_START -->
## 2026-05-19 - Po Stage124A V3

1. Test reczny UI bez utraty danych na listach i detailach.
2. Sprawdzic Supabase Usage / Logs Top Paths po normalnej sesji.
3. Stage124B: calendar/task date-range queries oraz dalsza deduplikacja auth/workspace, jezeli Usage dalej rosnie.
4. Nie wracac do `select=*` w listach; brakujace pola dopisywac jawnie do ListDTO constants.
<!-- STAGE124A_SUPABASE_EGRESS_NEXT_END -->

## STAGE124D_TASK_EVENT_LIGHT_ROUTES - next

- After manual QA, Stage124E should make Calendar pass from/to range params to /api/tasks and /api/events.
- Check Supabase Usage Dashboard after normal app use to verify reduced API egress.

## Stage124F visible calendar range wiring

After Stage124E, wire the visible Calendar page/sidebar month/week/day range into `fetchCalendarBundleFromSupabase(options)` so task/event reads are bounded by actual UI range.

## 2026-05-29 - Next after STAGE179 Settings readability

- UruchomiÄ‡:
ode --test tests/stage179-settings-form-control-readability-contract.test.cjs.
- UruchomiÄ‡:
pm run build.
- Test rÄ™czny: /settings, sekcja â€žPrzypomnienia Google Calendarâ€ť, pola â€žTyp przypomnienia Googleâ€ť i â€žIle minut wczeĹ›niejâ€ť.
- Nie pushowaÄ‡ osobno, dopiÄ…Ä‡ do wiÄ™kszej paczki lokalnych UI poprawek po potwierdzeniu Damiana.

## 2026-05-29 - Next after STAGE179 Settings readability

- UruchomiÄ‡:
ode --test tests/stage179-settings-form-control-readability-contract.test.cjs.
- UruchomiÄ‡:
pm run build.
- Test rÄ™czny: /settings, sekcja â€žPrzypomnienia Google Calendarâ€ť, pola â€žTyp przypomnienia Googleâ€ť i â€žIle minut wczeĹ›niejâ€ť.
- Nie pushowaÄ‡ osobno, dopiÄ…Ä‡ do wiÄ™kszej paczki lokalnych UI poprawek po potwierdzeniu Damiana.

<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_START -->
## 2026-06-04 — STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH — owner control roadmap po deep research CRM

STATUS: DO WDROŻENIA JAKO ETAP PAMIĘCI/ROADMAPY. NIE ZMIENIA RUNTIME UI ANI LOGIKI APLIKACJI.

### Powód etapu

Po analizie konkurencji CRM i raportu `deep-research-report (2).md` dopinamy roadmapę CloseFlow do realnego kierunku produktu:

CloseFlow nie ma konkurować jako tani, szeroki CRM. CloseFlow ma być operacyjnym systemem pilnowania ruchu sprzedażowego, następnego kroku, ciszy, spraw i pieniędzy dla małych firm usługowych.

### Realny stan aplikacji potwierdzony przed wpisem

FAKTY Z REPO:
- Repo: `dkknapikdamian-collab/leadflowv1`.
- Aktywna gałąź projektu według pamięci projektu: `dev-rollout-freeze`.
- Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`.
- `README.md` na `dev-rollout-freeze` już pozycjonuje produkt jako aplikację do pilnowania leadów, follow-upów, zadań, wydarzeń i spraw po sprzedaży.
- Główne widoki istnieją w routingu aplikacji: Today, Leads, LeadDetail, Clients, ClientDetail, Cases, CaseDetail, Tasks, Calendar, AiDrafts, Billing, Support, Notifications, Templates.
- `package.json` ma istniejące guardy/komendy powiązane z no-next-step, nearest action, Today, billing, Google Calendar, release gate i `verify:closeflow:quiet`.
- `_project/07_NEXT_STEPS.md` jest realną listą etapów/next steps, ale zawiera też historię, duplikaty i mojibake po starszych stage’ach. Ten etap dopina nową roadmapę jako osobny blok bez kasowania historii.

### Decyzja produktowa

DECYZJA DAMIANA / KIERUNEK:
- Nie budujemy „tańszego CRM-a”.
- Nie kopiujemy Tillio/Firmao/HubSpot/Pipedrive feature-for-feature.
- Budujemy właścicielski system kontroli: kto ucieka, kto nie ma kolejnego kroku, która sprawa stoi, gdzie leżą pieniądze, co trzeba ruszyć dzisiaj.
- SaaS ma być furtką. Realna monetyzacja ma iść przez wdrożenie procesu, playbooki, cleanup i miesięczny review.

### Logiczna kolejność etapów do wdrożenia

#### A35 — Readiness Audit / Owner Control Baseline

CEL:
- Zbudować wewnętrzny i/lub półproduktowy audyt gotowości sprzedażowej.
- Audyt ma działać na realnych danych leadów/spraw z ostatnich 30 dni lub na ręcznie/importowo podanych danych.

ZAKRES:
- Policz:
  - leady bez następnego kroku,
  - leady bez kontaktu 7+ dni,
  - leady bez kontaktu 14+ dni,
  - sprawy bez ruchu,
  - sprawy z wartością finansową, ale bez następnego kroku,
  - rekordy bez właściciela/odpowiedzialnego,
  - rekordy z notatką, ale bez zadania/follow-upu.
- Dodać raport: `CloseFlow Readiness Audit`.
- Wynik ma być używalny jako:
  - wewnętrzny ekran diagnostyczny,
  - podstawa oferty `CloseFlow Control Sprint`,
  - źródło danych do kolejnych etapów.

NIE RUSZAĆ:
- Nie budować BI dashboardu.
- Nie budować pełnego scoringu AI.
- Nie rozbudowywać ERP/faktur/KSeF.

GUARD/TEST:
- Guard ma sprawdzać, że A35 dokumentuje metryki: no-next-step, 7d silence, 14d silence, stale cases, money-without-next-step.
- Test ręczny: na danych testowych/realnych porównać liczby z listą leadów/spraw.

#### A35B — Mandatory Next Step Contract

CEL:
- Każdy aktywny lead/sprawa musi mieć jasny stan kolejnego kroku albo świadomy status `brak kolejnego kroku`.

ZAKRES:
- Ujednolicić definicję `next step`.
- Na LeadDetail/ClientDetail/CaseDetail pokazywać:
  - ostatni kontakt,
  - następny krok,
  - liczba dni ciszy,
  - status ryzyka,
  - szybkie akcje: ustaw follow-up, dodaj zadanie, dodaj notatkę, oznacz jako martwy/utracony.
- Nie pozwolić, żeby historia aktywności była tylko dziennikiem. Historia ma karmić status ryzyka.

NIE RUSZAĆ:
- Nie robić jeszcze pełnej automatyzacji.
- Nie mieszać z AI drafts rebuild.

GUARD/TEST:
- Guard: detail views mają widoczny kontrakt last-contact / next-step / silence-age / risk.
- Test ręczny: lead z kontaktem, lead bez kontaktu, sprawa z płatnością, sprawa bez następnego kroku.

#### A41 — Contact Cadence Grid / Reminder Engine

CEL:
- Dodać czytelną siatkę kontaktu jako główny widok operacyjny, nie jako spam powiadomień.

ZAKRES:
- Widok/sekcja `Siatka kontaktu`.
- Bucket/filtrowanie:
  - kontakt dziś,
  - 1 dzień ciszy,
  - 2 dni ciszy,
  - 3 dni ciszy,
  - 5 dni ciszy,
  - 7 dni ciszy,
  - 14 dni ciszy.
- Każdy rekord pokazuje:
  - osoba/firma,
  - typ: lead/klient/sprawa,
  - ostatni kontakt,
  - następny krok,
  - wartość sprawy jeśli istnieje,
  - status ryzyka,
  - szybkie akcje.
- Engine ma bazować na realnej historii aktywności, zadaniach i wydarzeniach.

NIE RUSZAĆ:
- Nie zamieniać tego w zwykłe browser notifications.
- Nie budować jeszcze pełnego sekwencera mailowego.

GUARD/TEST:
- Guard: bucket 7d/14d nie może być tylko statycznym tekstem; musi być połączony z obliczaniem ostatniego kontaktu.
- Test ręczny: rekordy z różnymi datami kontaktu wpadają do właściwych bucketów.

#### A46 — Sales Funnel Movement View / Lejek ruchu sprzedażowego

CEL:
- Zbudować lejek ruchu, który pokazuje nie tylko etap, ale też ciszę, brak kroku, ryzyko i pieniądze.

ZAKRES:
- Pipeline/lejek ma pokazywać:
  - etap,
  - wiek kontaktu,
  - ostatni kontakt,
  - następny krok,
  - dni bez ruchu,
  - wartość/potencjalna prowizja,
  - risk flag,
  - szybkie akcje.
- Karta w lejku nie może być tylko nazwą i etapem.
- Lejek ma zasilać Today, Lost Lead Rescue i Owner Digest.

NIE RUSZAĆ:
- Nie kopiować klasycznego CRM kanban jako całości.
- Nie robić forecastingu enterprise.

GUARD/TEST:
- Guard: karta lejka zawiera next-step, silence-age, risk, quick actions.
- Test ręczny: leady/sprawy zmieniają etap i nadal zachowują status ruchu.

#### A42 — Lost Lead Rescue

CEL:
- Zbudować osobny ekran `Do odzyskania`, nie tylko filtr w leadach.

ZAKRES:
- Pokazuje:
  - brak ruchu 7+ dni,
  - 14 dni ciszy,
  - brak następnego kroku,
  - leady z dużą wartością bez aktywności,
  - niedokończone szkice,
  - leady bez właściciela.
- Szybkie akcje:
  - odezwij się dziś,
  - utwórz zadanie,
  - odłóż,
  - dodaj notatkę,
  - przygotuj szkic,
  - oznacz jako martwy/utracony.
- Widok ma być używalny codziennie/tygodniowo przez właściciela.

NIE RUSZAĆ:
- Nie robić rozbudowanych automatyzacji marketingowych.
- Nie wysyłać nic automatycznie bez akceptacji.

GUARD/TEST:
- Guard: ekran/rescue model wymaga kryteriów 7d, 14d, no-next-step i quick actions.
- Test ręczny: minimum 5 przypadków testowych wpada do właściwych sekcji.

#### A45 — Finance Watchlist / Money-at-Risk

CEL:
- Zbudować listę pieniędzy do ruszenia, nie pełny moduł księgowy.

ZAKRES:
- Pokazuje:
  - sprawy z wartością, ale bez następnego kroku,
  - prowizje do rozliczenia,
  - wpłaty po terminie,
  - brak daty płatności,
  - korekty do sprawdzenia,
  - duże kwoty bez ruchu 7+ dni.
- Powiązać z istniejącymi finansami sprawy: wartość, prowizja, wpłaty, korekty, usuwanie wpłat.
- Widok ma zasilać Owner Digest.

NIE RUSZAĆ:
- Nie budować KSeF.
- Nie budować fakturowania, magazynu, banków, ERP ani księgowości.
- Nie kopiować Firmao/Berg.

GUARD/TEST:
- Guard: finance watchlist nie może importować modułów księgowych/ERP ani obiecywać fakturowania.
- Test ręczny: sprawa z kwotą i brakiem next step pojawia się jako money-at-risk.

#### A44 — Owner Digest / Weekly Report

CEL:
- Dodać dzienny/tygodniowy raport właściciela jako listę decyzji, nie vanity dashboard.

ZAKRES:
- Daily:
  - co dziś ruszyć,
  - kto nie ma następnego kroku,
  - kto ma 7/14 dni ciszy,
  - które sprawy stoją,
  - jakie pieniądze wymagają ruchu.
- Weekly:
  - ile leadów weszło,
  - ile leadów bez next step,
  - ile 7d/14d ciszy,
  - ile spraw bez ruchu,
  - ile pieniędzy bez ruchu,
  - największe ryzyko tygodnia.
- Digest ma być widoczny w aplikacji i docelowo możliwy do wysyłki, ale bez automatycznego wysyłania bez konfiguracji/akceptacji.

NIE RUSZAĆ:
- Nie robić newslettera.
- Nie robić dashboardu wykresów dla samego wyglądu.
- Nie wysyłać e-maili, jeśli produkcyjny email nie jest gotowy.

GUARD/TEST:
- Guard: digest ma zawierać listę ryzyk i akcji, nie tylko metryki.
- Test ręczny: owner widzi co dziś zrobić bez przechodzenia przez 5 ekranów.

#### A36 — Drafts Rebuild / Jedna skrzynka szkiców

CEL:
- Przebudować szkice jako jedno miejsce zatwierdzania danych, ale dopiero po warstwie kontroli.

ZAKRES:
- Jedna skrzynka:
  - ręczny szkic,
  - wklejony tekst,
  - dyktowanie,
  - parser,
  - AI.
- Zatwierdź jako:
  - lead,
  - zadanie,
  - wydarzenie,
  - notatka,
  - follow-up.
- Po zatwierdzeniu wpis musi automatycznie przypisać się do lead/klient/sprawa, jeśli kontekst jest znany.
- AI dalej działa confirm-first: nie zapisuje finalnych danych bez akceptacji użytkownika.

NIE RUSZAĆ:
- Nie sprzedawać tego jako głównego wyróżnika „AI CRM”.
- Nie dodawać automatycznego wysyłania wiadomości.

GUARD/TEST:
- Guard: AI drafts confirm-first i brak automatycznego finalnego zapisu bez akceptacji.
- Test ręczny: szkic z LeadDetail/ClientDetail/CaseDetail zachowuje kontekst.

#### A47 — Branchen Playbooks / Control Sprint Offer

CEL:
- Spiąć produkt z usługą wdrożeniową, żeby nie sprzedawać samego taniego SaaS.

ZAKRES:
- Oferta startowa:
  - `CloseFlow Control Sprint`,
  - readiness audit,
  - import/porządkowanie danych,
  - ustawienie etapów,
  - next-step discipline,
  - contact cadence,
  - owner digest,
  - podstawowy finance watchlist,
  - jedno szkolenie.
- Pierwszy segment:
  - małe usługi B2B z inboundem i właścicielem blisko sprzedaży.
- Playbook V1:
  - etapy,
  - wymagane next steps,
  - progi ciszy,
  - zasady follow-upu,
  - raport ownera.

NIE RUSZAĆ:
- Nie robić 10 branż naraz.
- Nie budować marketplace’u playbooków.
- Nie robić bespoke wdrożeń bez szablonu.

GUARD/TEST:
- Guard: roadmapa nie może mieć więcej niż jednego aktywnego segmentu startowego bez oznaczenia `DO_POTWIERDZENIA`.
- Test sprzedażowy: 10 rozmów / demo na danych z ostatnich 30 dni / próba sprzedaży Control Sprint.

### Minimalny porządek wdrożenia

1. A35 Readiness Audit.
2. A35B Mandatory Next Step Contract.
3. A41 Contact Cadence Grid.
4. A46 Sales Funnel Movement View.
5. A42 Lost Lead Rescue.
6. A45 Finance Watchlist.
7. A44 Owner Digest / Weekly Report.
8. A36 Drafts Rebuild.
9. A47 Branchen Playbooks / Control Sprint Offer.

### Warunki zamknięcia tej roadmapy

- Każdy etap ma osobny run report w `_project/runs/`.
- Każdy etap ma guard/test albo jawny SKIP z powodem.
- Każdy etap aktualizuje `_project/07_NEXT_STEPS.md`, `_project/08_CHANGELOG_AI.md`, `_project/12_IMPLEMENTATION_LEDGER.md`, `_project/13_TEST_HISTORY.md`.
- Każdy etap ma aktualizację Obsidiana albo manifest.
- Nie używać `git add .`.
- Nie robić push przed testami/guardami i ręcznym potwierdzeniem, jeśli etap dotyka runtime UI.
<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_END -->

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
