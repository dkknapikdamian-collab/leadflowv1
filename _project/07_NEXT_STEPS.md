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

STATUS: WDROĹ»ONE LOKALNIE PO APPLY, TEST RÄCZNY DO WYKONANIA.

FAKTY:
- Kalendarz nie powinien juĹĽ liczyÄ‡ `combineScheduleEntries` wprost w renderze.
- Dni miesiÄ…ca i tygodnia korzystajÄ… z `entriesByDayKey` / `weekEntriesByDayKey`.
- `Calendar.tsx` nie powinien juĹĽ uĹĽywaÄ‡ `getEntriesForDay(...)` w render path.
- `cases` idÄ… z `fetchCalendarBundleFromSupabase()`, bez drugiego `fetchCasesFromSupabase()` w `Calendar.tsx`.
- PeĹ‚nostronicowy loader zostaĹ‚ zastÄ…piony maĹ‚ym skeletonem danych.

TESTY:
- `node tests/stage104-calendar-loading-performance-contract.test.cjs`
- `npm run build` jeĹ›li nie uĹĽyto `-SkipBuild`.

RYZYKA:
- Range fetch backendowy jest DO POTWIERDZENIA.
- Stare DOM-normalizatory miesiÄ…ca zostaĹ‚y nietkniÄ™te i wymagajÄ… osobnego audytu w Paczce G.

NASTÄPNY KROK:
- Test rÄ™czny `/calendar`: start, tydzieĹ„, miesiÄ…c, wybrany dzieĹ„, edycja, +1H/+1D/+1W, zrobione, usuĹ„.
<!-- /STAGE104_CALENDAR_PERFORMANCE_F -->


---
## Stage105 / Paczka G â€” Templates delete + visual contract â€” 2026-05-16

STATUS: WDROĹ»ONE LOKALNIE Z PACZKI ZIP, BEZ COMMITA I BEZ PUSHA.

FAKTY:
- /templates dostaĹ‚ widoczny przycisk UsuĹ„ na karcie szablonu.
- Delete uĹĽywa EntityTrashButton i shared trash action source of truth.
- Delete wymaga window.confirm oraz dodatkowego potwierdzenia, jeĹ›li szablon ma pozycje checklisty.
- Karta szablonu uĹĽywa cf-template-card cf-readable-card i markerĂłw ecord-list-source-truth.
- Stary marker data-a16-template-light-ui nie jest aktywnym source of truth dla stylu.

TESTY:
- 
ode tests/stage105-templates-delete-and-visual-contract.test.cjs
- 
pm run build

TEST RÄCZNY:
- DO WYKONANIA na /templates: create/edit/duplicate/delete z confirmami.

RYZYKO:
- Ten etap nie dodaje backendowego sprawdzania, czy szablon zostaĹ‚ uĹĽyty w aktywnych sprawach. Wymusza Ĺ›wiadome potwierdzenie usuwania wzorca i jego pozycji.

NASTÄPNY KROK:
- PrzetestowaÄ‡ /templates; dopiero potem zdecydowaÄ‡, czy robimy kolejny lokalny etap czy wspĂłlny commit/push Stage104+Stage105.
<!-- STAGE105_TEMPLATES_DELETE_VISUAL_G -->
