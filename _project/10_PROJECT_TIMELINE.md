# 10_PROJECT_TIMELINE - CloseFlow / LeadFlow

## 2026-05-16 - memory protocol and Obsidian mapping closeout
- Remote GitHub closeout added minimal project memory protocol, minimal stage template, required 08:54 run checkpoint and AGENTS marker.
- Obsidian dashboard mapping was prepared as the canonical high-level section: `10_PROJEKTY/CloseFlow_Lead_App/`.
- This was an organizational stage only. No runtime app files were changed.
- Next step after confirmed pulls: separate archive/merge stage for old CloseFlow paths.

## 2026-05-15
Paczka V9 odbudowuje pamiec projektu, Obsidiana i guardy po bledach parsera w V6/V7.

## 2026-05-15 - v14 runtime React StrictMode fix
- Fixed white-page runtime error source: React.StrictMode without React binding in main.tsx.

## 2026-05-15 - v14 runtime React StrictMode fix
- Fixed white-page runtime error source: React.StrictMode without React binding in main.tsx.

## 2026-05-15 - v15 runtime lazy page default fix
- Hardened lazy route imports after APP_ROUTE_RENDER_FAILED with default export read error.

## 2026-05-15 - v16 runtime lazy page default fix
- Stabilized lazy route loading after APP_ROUTE_RENDER_FAILED default export runtime error.

## 2026-05-15 - v17 runtime lazy page duplicate cleanup
- Fixed build blocker after partial lazyPage hotfix application.

## 2026-05-15 - v18 runtime lazy page default fix
- Fixed duplicate lazyPage build blocker after failed v15/v16/v17 local runs.

## 2026-05-15 - v19 lazy page runtime fix
- Fixed duplicate lazyPage build blocker left by failed local hotfix runs before committing/pushing.

## 2026-05-15 - v19 lazy page runtime fix
- Fixed duplicate lazyPage build blocker left by failed local hotfix runs before committing/pushing.


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
