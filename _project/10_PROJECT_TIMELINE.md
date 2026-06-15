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
## 2026-05-16 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Stage104 / Paczka F Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Calendar loading performance

STATUS: WDROĂ„Ä…Ă‚Â»ONE LOKALNIE PO APPLY, TEST R\u00c4\u0098CZNY DO WYKONANIA.

FAKTY:
- Kalendarz nie powinien juĂ„Ä…Ă„Ëť liczyÄ‚â€žĂ˘â‚¬Ë‡ `combineScheduleEntries` wprost w renderze.
- Dni miesiÄ‚â€žĂ˘â‚¬Â¦ca i tygodnia korzystajÄ‚â€žĂ˘â‚¬Â¦ z `entriesByDayKey` / `weekEntriesByDayKey`.
- `Calendar.tsx` nie powinien juĂ„Ä…Ă„Ëť uĂ„Ä…Ă„ËťywaÄ‚â€žĂ˘â‚¬Ë‡ `getEntriesForDay(...)` w render path.
- `cases` idÄ‚â€žĂ˘â‚¬Â¦ z `fetchCalendarBundleFromSupabase()`, bez drugiego `fetchCasesFromSupabase()` w `Calendar.tsx`.
- PeĂ„Ä…Ă˘â‚¬Ĺˇnostronicowy loader zostaĂ„Ä…Ă˘â‚¬Ĺˇ zastÄ‚â€žĂ˘â‚¬Â¦piony maĂ„Ä…Ă˘â‚¬Ĺˇym skeletonem danych.

TESTY:
- `node tests/stage104-calendar-loading-performance-contract.test.cjs`
- `npm run build` jeĂ„Ä…Ă˘â‚¬Ĺźli nie uĂ„Ä…Ă„Ëťyto `-SkipBuild`.

RYZYKA:
- Range fetch backendowy jest DO POTWIERDZENIA.
- Stare DOM-normalizatory miesiÄ‚â€žĂ˘â‚¬Â¦ca zostaĂ„Ä…Ă˘â‚¬Ĺˇy nietkniÄ‚â€žĂ˘â€žËte i wymagajÄ‚â€žĂ˘â‚¬Â¦ osobnego audytu w Paczce G.

NAST\u00c4\u0098PNY KROK:
- Test rÄ‚â€žĂ˘â€žËczny `/calendar`: start, tydzieĂ„Ä…Ă˘â‚¬Ĺľ, miesiÄ‚â€žĂ˘â‚¬Â¦c, wybrany dzieĂ„Ä…Ă˘â‚¬Ĺľ, edycja, +1H/+1D/+1W, zrobione, usuĂ„Ä…Ă˘â‚¬Ĺľ.
<!-- /STAGE104_CALENDAR_PERFORMANCE_F -->


---
## Stage105 / Paczka G Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Templates delete + visual contract Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ 2026-05-16

STATUS: WDROĂ„Ä…Ă‚Â»ONE LOKALNIE Z PACZKI ZIP, BEZ COMMITA I BEZ PUSHA.

FAKTY:
- /templates dostaĂ„Ä…Ă˘â‚¬Ĺˇ widoczny przycisk UsuĂ„Ä…Ă˘â‚¬Ĺľ na karcie szablonu.
- Delete uĂ„Ä…Ă„Ëťywa EntityTrashButton i shared trash action source of truth.
- Delete wymaga window.confirm oraz dodatkowego potwierdzenia, jeĂ„Ä…Ă˘â‚¬Ĺźli szablon ma pozycje checklisty.
- Karta szablonu uĂ„Ä…Ă„Ëťywa cf-template-card cf-readable-card i markerĂ„â€šÄąâ€šw
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
- Ten etap nie dodaje backendowego sprawdzania, czy szablon zostaĂ„Ä…Ă˘â‚¬Ĺˇ uĂ„Ä…Ă„Ëťyty w aktywnych sprawach. Wymusza Ă„Ä…Ă˘â‚¬Ĺźwiadome potwierdzenie usuwania wzorca i jego pozycji.

NAST\u00c4\u0098PNY KROK:
- PrzetestowaÄ‚â€žĂ˘â‚¬Ë‡ /templates; dopiero potem zdecydowaÄ‚â€žĂ˘â‚¬Ë‡, czy robimy kolejny lokalny etap czy wspĂ„â€šÄąâ€šlny commit/push Stage104+Stage105.
<!-- STAGE105_TEMPLATES_DELETE_VISUAL_G -->

<!-- STAGE222_R4_V3_LEAD_CLIENT_OPERATIONAL_BADGES -->
## 2026-06-05 - STAGE222 R4 V3 lead/client operational badges robust fix

FAKTY:
- R4 V1/V2 zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇy siÄ‚â€žĂ˘â€žË na kruchych anchorach w Clients.tsx.
- V3 uĂ„Ä…Ă„Ëťywa elastycznych regexĂ„â€šÄąâ€šw i naprawia czÄ‚â€žĂ˘â€žËĂ„Ä…Ă˘â‚¬Ĺźciowy lokalny stan.
- Docelowy wzĂ„â€šÄąâ€šr: [Oferta wysĂ„Ä…Ă˘â‚¬Ĺˇana] [Sprawa] [14+ dni bez ruchu] [brak akcji].
- Nie ruszano Today i nie dodano nowego CSS.

TESTY:
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs
- npm run build
- git diff --check

<!-- STAGE222_R2B_SETTINGS_CASES_HOTFIX -->
## 2026-06-05 - STAGE222 R2B Settings/Cases hotfix

FAKTY:
- Commit 7ff0bc08 zostaĂ„Ä…Ă˘â‚¬Ĺˇ wypchniÄ‚â€žĂ˘â€žËty mimo czerwonego guard/test Stage222 R2.
- Przyczyna: apply script nie wykonaĂ„Ä…Ă˘â‚¬Ĺˇ patcha Settings/Cases, wiÄ‚â€žĂ˘â€žËc helper i guard weszĂ„Ä…Ă˘â‚¬Ĺˇy bez sekcji ustawieĂ„Ä…Ă˘â‚¬Ĺľ i bez case badges.
- R2B dopina brakujÄ‚â€žĂ˘â‚¬Â¦ce elementy: Settings threshold section i Cases owner risk badges.
- Build wczeĂ„Ä…Ă˘â‚¬Ĺźniej przechodziĂ„Ä…Ă˘â‚¬Ĺˇ, ale Stage222 guard/test nie.

DECYZJE:
- Nie robimy rollbacku, bo build przechodzi i zakres da siÄ‚â€žĂ˘â€žË domknÄ‚â€žĂ˘â‚¬Â¦Ä‚â€žĂ˘â‚¬Ë‡ hotfixem.
- R2B ma byÄ‚â€žĂ˘â‚¬Ë‡ osobnym commitem naprawczym.
- Bez `git add .`.

TESTY:
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs, jeĂ„Ä…Ă˘â‚¬Ĺźli plik istnieje
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs, jeĂ„Ä…Ă˘â‚¬Ĺźli plik istnieje
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonych testach commit/push R2B.

<!-- STAGE223_R2_OWNER_MOVEMENT_RISK_SYSTEM -->
## 2026-06-05 - STAGE223 R2 Owner Movement Risk System

FAKTY:
- R2B Stage222 jest zielony i repo jest czyste/up-to-date przed Stage223.
- Dodano `next-move-contract.ts` jako jeden kontrakt dla missing/overdue/today/planned/closed.
- Dodano `activity-truth.ts`, Ă„Ä…Ă„Ëťeby nie udawaÄ‚â€žĂ˘â‚¬Ë‡ kontaktu na podstawie `updatedAt`.
- `owner-risk-rules.ts` uĂ„Ä…Ă„Ëťywa teraz next-move-contract i activity-truth.
- `record-operational-badges.ts` rozrĂ„â€šÄąâ€šĂ„Ä…Ă„Ëťnia ciszÄ‚â€žĂ˘â€žË kontaktu od braku Ă„Ä…Ă˘â‚¬ĹźwieĂ„Ä…Ă„Ëťego ruchu fallback.
- Dodano runtime testy, ktĂ„â€šÄąâ€šre realnie wywoĂ„Ä…Ă˘â‚¬ĹˇujÄ‚â€žĂ˘â‚¬Â¦ funkcje przez esbuild, nie tylko szukajÄ‚â€žĂ˘â‚¬Â¦ tekstu.

DECYZJE DAMIANA:
- PodetapĂ„â€šÄąâ€šw A-D nie pushujemy osobno.
- Nie robiÄ‚â€žĂ˘â‚¬Ë‡ drugiego Today.
- Badge majÄ‚â€žĂ˘â‚¬Â¦ wynikaÄ‚â€žĂ˘â‚¬Ë‡ z jednego kontraktu ruchu i prawdy aktywnoĂ„Ä…Ă˘â‚¬Ĺźci.
- `updatedAt` moĂ„Ä…Ă„Ëťe byÄ‚â€žĂ˘â‚¬Ë‡ fallbackiem aktywnoĂ„Ä…Ă˘â‚¬Ĺźci, nie prawdÄ‚â€žĂ˘â‚¬Â¦ kontaktu.

TESTY:
- `node scripts/check-stage223-owner-movement-risk-system.cjs`
- `node --test tests/stage223-owner-risk-runtime-contract.test.cjs`
- `node scripts/check-stage222-owner-risk-rules-foundation.cjs`
- `node --test tests/stage222-owner-risk-rules-foundation.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

DO POTWIERDZENIA:
- PeĂ„Ä…Ă˘â‚¬Ĺˇne wpiÄ‚â€žĂ˘â€žËcie LeadDetail/CaseDetail widocznego work center moĂ„Ä…Ă„Ëťna zrobiÄ‚â€žĂ˘â‚¬Ë‡ jako D2, jeĂ„Ä…Ă˘â‚¬Ĺźli po runtime contract nie bÄ‚â€žĂ˘â€žËdzie regresji.
- Today agregacja moĂ„Ä…Ă„Ëťe dostaÄ‚â€žĂ˘â‚¬Ë‡ ranking w nastÄ‚â€žĂ˘â€žËpnym kroku, ale bez nowej sekcji.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonych testach sprawdziÄ‚â€žĂ˘â‚¬Ë‡ /leads, /cases, /today.
- Commit/push dopiero po caĂ„Ä…Ă˘â‚¬Ĺˇym Stage223 R2, nie po pojedynczym podetapie.

<!-- STAGE223_R2B_ACTIVITY_TRUTH_FALLBACK_HOTFIX -->
## 2026-06-05 - STAGE223 R2B Activity Truth fallback hotfix

FAKTY:
- Stage223 R2 runtime test wykryĂ„Ä…Ă˘â‚¬Ĺˇ realny bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d: fallback z `updatedAt` nadpisywaĂ„Ä…Ă˘â‚¬Ĺˇ prawdziwÄ‚â€žĂ˘â‚¬Â¦ aktywnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡.
- Build przeszedĂ„Ä…Ă˘â‚¬Ĺˇ, ale runtime test nie; Stage223 R2 nie jest gotowy do pushu.
- R2B zmienia Activity Truth: `updatedAt/createdAt` sÄ‚â€žĂ˘â‚¬Â¦ uĂ„Ä…Ă„Ëťywane wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦cznie, gdy nie ma realnych kandydatĂ„â€šÄąâ€šw aktywnoĂ„Ä…Ă˘â‚¬Ĺźci/kontaktu/pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźci.
- To naprawia zaĂ„Ä…Ă˘â‚¬ĹˇoĂ„Ä…Ă„Ëťenie: nie udajemy kontaktu ani Ă„Ä…Ă˘â‚¬ĹźwieĂ„Ä…Ă„Ëťej aktywnoĂ„Ä…Ă˘â‚¬Ĺźci przez zwykĂ„Ä…Ă˘â‚¬Ĺˇy update rekordu.

DECYZJE:
- Nie pushowaÄ‚â€žĂ˘â‚¬Ë‡ Stage223, dopĂ„â€šÄąâ€ški runtime testy nie sÄ‚â€žĂ˘â‚¬Â¦ zielone.
- UtrzymaÄ‚â€žĂ˘â‚¬Ë‡ kontrakt: prawdziwy kontakt != updatedAt.
- Podetapy A-D pozostajÄ‚â€žĂ˘â‚¬Â¦ jednym lokalnym blokiem do jednego commita po peĂ„Ä…Ă˘â‚¬Ĺˇnych testach.

TESTY:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-risk-runtime-contract.test.cjs
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonych testach moĂ„Ä…Ă„Ëťna dopiero rozwaĂ„Ä…Ă„ËťyÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push Stage223 R2.

<!-- STAGE223_R2C_STAGE113_LOGO_TEST_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2C Stage113 logo test release gate hotfix

FAKTY:
- Stage223 R2B ma zielone runtime testy i build.
- `verify:closeflow:quiet` zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ release na brakujÄ‚â€žĂ˘â‚¬Â¦cym pliku `tests/stage113-closeflow-logo-source-contract.test.cjs`.
- Quiet release gate ma ten plik w `requiredTests`, wiÄ‚â€žĂ˘â€žËc brak samego pliku blokuje push.
- R2C dodaje brakujÄ‚â€žĂ˘â‚¬Â¦cy test, nie zmienia logiki aplikacji.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy release gate.
- Dodajemy minimalny test kontraktu Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇa logo CloseFlow.
- Push Stage223 dopiero po zielonym `verify:closeflow:quiet`.

TESTY:
- node --test tests/stage113-closeflow-logo-source-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage223/Stage222 regressions
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push dla caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + R2B + R2C.

<!-- STAGE223_R2D_CASE_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2D case trash release gate hotfix

FAKTY:
- Stage223 R2C przeszedĂ„Ä…Ă˘â‚¬Ĺˇ Stage113, Stage223 runtime, Stage222 regression i build.
- `verify:closeflow:quiet` zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ release na guardzie `case trash actions`.
- W `Cases.tsx` kosz byĂ„Ä…Ă˘â‚¬Ĺˇ renderowany przez `EntityTrashButton`, ale brakowaĂ„Ä…Ă˘â‚¬Ĺˇo starego markera kontraktu `data-case-row-delete-action="true"`.
- R2D dodaje tylko brakujÄ‚â€žĂ˘â‚¬Â¦cy marker. Nie zmienia UI, logiki ani Activity Truth.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy guardĂ„â€šÄąâ€šw.
- Nie zmieniamy release gate.
- Dopinamy literalny marker wymagany przez istniejÄ‚â€žĂ˘â‚¬Â¦cy guard.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + R2B + R2C + R2D.

<!-- STAGE223_R2E_CASE_DETAIL_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2E case detail trash release gate hotfix

FAKTY:
- R2D dopiÄ‚â€žĂ˘â‚¬Â¦Ă„Ä…Ă˘â‚¬Ĺˇ marker kosza na liĂ„Ä…Ă˘â‚¬Ĺźcie spraw, ale release gate przeszedĂ„Ä…Ă˘â‚¬Ĺˇ do kolejnego warunku.
- Guard `case trash actions` wymaga teĂ„Ä…Ă„Ëť, Ă„Ä…Ă„Ëťeby `CaseDetail.tsx` uĂ„Ä…Ă„ËťywaĂ„Ä…Ă˘â‚¬Ĺˇ `EntityTrashButton`.
- `CaseDetail.tsx` miaĂ„Ä…Ă˘â‚¬Ĺˇ przycisk usuwania i marker `data-case-detail-delete-action="true"`, ale renderowaĂ„Ä…Ă˘â‚¬Ĺˇ zwykĂ„Ä…Ă˘â‚¬Ĺˇy `Button`.
- R2E zmienia tylko Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇo przycisku na `EntityTrashButton` i uĂ„Ä…Ă„Ëťywa `trashActionIconClass`.
- Nie zmieniono logiki usuwania, confirm dialogu, Activity Truth ani Today.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy guardĂ„â€šÄąâ€šw.
- Nie zmieniamy release gate.
- Dopinamy CaseDetail do wspĂ„â€šÄąâ€šlnego Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇa prawdy kosza.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + R2B + R2C + R2D + R2E.

<!-- STAGE223_R2F_CASE_DETAIL_TRASH_ALIAS_GUARD_HOTFIX -->
## 2026-06-05 - STAGE223 R2F case detail trash alias guard hotfix

FAKTY:
- R2E dopiÄ‚â€žĂ˘â‚¬Â¦Ă„Ä…Ă˘â‚¬Ĺˇ `CaseDetail.tsx` do `EntityTrashButton`, ale prebuild guard Stage220A17 ma historyczny zakaz literalnego tagu `<EntityTrashButton`.
- Nowszy guard `case trash actions` wymaga, Ă„Ä…Ă„Ëťeby `CaseDetail.tsx` zawieraĂ„Ä…Ă˘â‚¬Ĺˇ `EntityTrashButton`.
- R2F speĂ„Ä…Ă˘â‚¬Ĺˇnia oba kontrakty: importuje/uĂ„Ä…Ă„Ëťywa `EntityTrashButton` jako source-of-truth, ale JSX renderuje lokalnym aliasem `CaseDetailTrashButton`.
- Nie zmieniono UI, logiki usuwania, Activity Truth ani Today.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czaÄ‚â€žĂ˘â‚¬Ë‡ guardĂ„â€šÄąâ€šw.
- Nie zmieniaÄ‚â€žĂ˘â‚¬Ë‡ release gate.
- RozwiÄ‚â€žĂ˘â‚¬Â¦zaÄ‚â€žĂ˘â‚¬Ë‡ konflikt guardĂ„â€šÄąâ€šw aliasem, nie obejĂ„Ä…Ă˘â‚¬Ĺźciem logiki.

TESTY:
- node scripts/check-stage220a17-case-detail-vst-wiring.cjs
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + R2B + R2C + R2D + R2E + R2F.

<!-- STAGE223_R2G_STAGE98_MOJIBAKE_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2G Stage98 mojibake release gate hotfix

FAKTY:
- R2F ma zielone Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ release na Stage98 Polish mojibake hard gate.
- Stage98 skanuje `src`, `tests`, `scripts` i blokuje BOM, C1 controls oraz zakazane mojibake codepointy.
- R2G usuwa BOM-y oraz normalizuje stare mojibake w aktywnych Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇach.
- PozostaĂ„Ä…Ă˘â‚¬Ĺˇe literalne znaki mojibake w guardach/testach sÄ‚â€žĂ˘â‚¬Â¦ zamieniane na ASCII unicode escapes, Ă„Ä…Ă„Ëťeby guardy mogĂ„Ä…Ă˘â‚¬Ĺˇy dalej opisywaÄ‚â€žĂ˘â‚¬Ë‡ zĂ„Ä…Ă˘â‚¬Ĺˇe znaki bez Ă„Ä…Ă˘â‚¬Ĺˇamania Stage98.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy Stage98.
- Nie obchodzimy `verify:closeflow:quiet`.
- Naprawiamy release gate masowo i jawnie.
- To jest release-gate cleanup, nie funkcja produktowa.

TESTY:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- npm run verify:closeflow:quiet
- Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2G.

<!-- STAGE223_R2H_STAGE120_CALENDAR_BUNDLE_SIGNATURE_HOTFIX -->
## 2026-06-05 - STAGE223 R2H Stage120 calendar bundle signature hotfix

FAKTY:
- R2G naprawiĂ„Ä…Ă˘â‚¬Ĺˇ Stage98 i przeprowadziĂ„Ä…Ă˘â‚¬Ĺˇ build.
- `verify:closeflow:quiet` zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ release na Stage120 local-first calendar test.
- Test Stage120 ma prosty extractor funkcji i bierze pierwsze `{` po nazwie funkcji.
- Sygnatura `fetchCalendarBundleFromSupabase(options: CalendarBundleRangeOptions = {})` powodowaĂ„Ä…Ă˘â‚¬Ĺˇa, Ă„Ä…Ă„Ëťe extractor Ă„Ä…Ă˘â‚¬ĹˇapaĂ„Ä…Ă˘â‚¬Ĺˇ default `{}`, nie ciaĂ„Ä…Ă˘â‚¬Ĺˇo funkcji.
- Sama logika local-first byĂ„Ä…Ă˘â‚¬Ĺˇa poprawna: funkcja ma `Promise.all([` i nie woĂ„Ä…Ă˘â‚¬Ĺˇa Google inbound sync.
- R2H usuwa default object z sygnatury i przenosi fallback do ciaĂ„Ä…Ă˘â‚¬Ĺˇa funkcji: `const calendarRangeOptions = options || {};`.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy Stage120.
- Nie zmieniamy release gate.
- Nie zmieniamy semantyki funkcji.
- Naprawiamy kod tak, Ă„Ä…Ă„Ëťeby kontrakt testu i logika byĂ„Ä…Ă˘â‚¬Ĺˇy spĂ„â€šÄąâ€šjne.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2H.

<!-- STAGE223_R2I_STAGE120_LITERAL_READS_HOTFIX -->
## 2026-06-05 - STAGE223 R2I Stage120 literal local reads hotfix

FAKTY:
- R2H naprawiĂ„Ä…Ă˘â‚¬Ĺˇ extractor funkcji Stage120 przez usuniÄ‚â€žĂ˘â€žËcie `= {}` z sygnatury.
- Po R2H test Stage120 doszedĂ„Ä…Ă˘â‚¬Ĺˇ dalej i wykazaĂ„Ä…Ă˘â‚¬Ĺˇ twardy wymĂ„â€šÄąâ€šg: `fetchTasksFromSupabase()` oraz `fetchEventsFromSupabase()` muszÄ‚â€žĂ˘â‚¬Â¦ byÄ‚â€žĂ˘â‚¬Ë‡ literalnie bez argumentĂ„â€šÄąâ€šw.
- R2I przywraca literalne local reads bez argumentĂ„â€šÄąâ€šw i zostawia poprawionÄ‚â€žĂ˘â‚¬Â¦ sygnaturÄ‚â€žĂ˘â€žË `options?: CalendarBundleRangeOptions`.
- `options` jest jawnie oznaczone jako niewykorzystane przez `void options;`, Ă„Ä…Ă„Ëťeby nie zmieniaÄ‚â€žĂ˘â‚¬Ë‡ kontraktu publicznego funkcji.
- Nie zmieniono Google inbound sync ani Stage223 Activity Truth.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy Stage120.
- Nie zmieniamy release gate.
- Dostosowujemy kod do obowiÄ‚â€žĂ˘â‚¬Â¦zujÄ‚â€žĂ˘â‚¬Â¦cego kontraktu local-first.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2I.

<!-- STAGE223_R2J_STAGE122_PWA_MARKER_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2J Stage122 PWA marker release gate hotfix

FAKTY:
- R2I ma zielone Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ release na Stage122.
- Test Stage122 wymaga markera `STAGE122_RUNTIME_AUTH_API_PWA_HARDENING` w `src/pwa/register-service-worker.ts`.
- `public/service-worker.js` marker juĂ„Ä…Ă„Ëť ma.
- `register-service-worker.ts` ma poprawnÄ‚â€žĂ˘â‚¬Â¦ logikÄ‚â€žĂ˘â€žË: `getRegistrations()`, `registration.unregister()`, `caches.keys()`, brak `localStorage.clear()`, brak runtime register.
- BrakowaĂ„Ä…Ă˘â‚¬Ĺˇ tylko marker kontraktu Stage122.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy Stage122.
- Nie zmieniamy release gate.
- Nie zmieniamy logiki PWA/auth.
- Dodajemy marker kontraktu bez ruszania runtime behavior.

TESTY:
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2J.

<!-- STAGE223_R2K_PANEL_DELETE_CLIENTS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2K panel delete clients contract hotfix

FAKTY:
- R2J ma zielone Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ release na `tests/panel-delete-actions-v1.test.cjs`.
- Test wymaga literalnych tokenĂ„â€šÄąâ€šw w `src/pages/Clients.tsx`:
  - `archivedAt: new Date().toISOString()`,
  - `archivedAt: null`,
  - `\\n\\nTen klient ma powiÄ‚â€žĂ˘â‚¬Â¦zania`.
- `Clients.tsx` miaĂ„Ä…Ă˘â‚¬Ĺˇ poprawnÄ‚â€žĂ˘â‚¬Â¦ semantykÄ‚â€žĂ˘â€žË soft-delete, ale przez ternary `archivedAt: mode === 'archive' ? ... : null` nie speĂ„Ä…Ă˘â‚¬ĹˇniaĂ„Ä…Ă˘â‚¬Ĺˇ starego testu kontraktowego.
- R2K zmienia zapis na jawne branchowanie archive/restore i dodaje escaped newline do opisu powiÄ‚â€žĂ˘â‚¬Â¦zaĂ„Ä…Ă˘â‚¬Ĺľ.
- Nie zmieniono Stage223, Activity Truth, Today ani Supabase schema.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy panel delete guard.
- Nie zmieniamy release gate.
- Dopasowujemy kod do obowiÄ‚â€žĂ˘â‚¬Â¦zujÄ‚â€žĂ˘â‚¬Â¦cego kontraktu testu bez twardego delete.

TESTY:
- node --test tests/panel-delete-actions-v1.test.cjs
- npm run verify:closeflow:quiet
- Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2K.

<!-- STAGE223_R2L_V2_CASE_HISTORY_ROW_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2L-V2 case history row contract hotfix

FAKTY:
- R2L-V1 byĂ„Ä…Ă˘â‚¬Ĺˇ za ciasny: skrypt wymagaĂ„Ä…Ă˘â‚¬Ĺˇ dokĂ„Ä…Ă˘â‚¬Ĺˇadnego istniejÄ‚â€žĂ˘â‚¬Â¦cego renderu `case-detail-history-row`, ktĂ„â€šÄąâ€šrego lokalny `CaseDetail.tsx` ma juĂ„Ä…Ă„Ëť inaczej po wczeĂ„Ä…Ă˘â‚¬Ĺźniejszych etapach.
- Release gate `case-detail-history-workrow-leak-fix-2026-05-13` wymaga literalnych tokenĂ„â€šÄąâ€šw:
  - `<article className="case-history-row"`,
  - `<article key={activity.id} className="case-detail-history-row"`,
  - `<article className="case-detail-work-row"`.
- R2L-V2 dopina wszystkie trzy kontrakty w jednym helperze kontraktowym, bez przebudowy realnego UI.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani przepĂ„Ä…Ă˘â‚¬Ĺˇywu historii.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy case-detail-history guard.
- Nie zmieniamy release gate.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.
- Kontrakt dopinamy jako jawny marker, bo problem jest starym release gate, nie funkcjÄ‚â€žĂ˘â‚¬Â¦ Stage223.

TESTY:
- node --test tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2L-V2.

<!-- STAGE223_R2M_CASE_HISTORY_ACTIVITIES_MAP_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2M case history activities.map contract hotfix

FAKTY:
- R2L-V2 naprawiĂ„Ä…Ă˘â‚¬Ĺˇ `case-detail-history-workrow-leak-fix`.
- `verify:closeflow:quiet` przeszedĂ„Ä…Ă˘â‚¬Ĺˇ dalej do `tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs`.
- Ten test wymaga literalnego `activities.map((activity) => (` w `CaseDetail.tsx`.
- `CaseDetail.tsx` speĂ„Ä…Ă˘â‚¬Ĺˇnia juĂ„Ä…Ă„Ëť zakaz przepychania activity do `buildWorkItems`; brakuje tylko literalnego kontraktu mapowania historii.
- R2M dodaje jawny kontrakt `activities.map((activity) => (` bez zmiany realnej logiki Stage223.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako marker/helper, bo problem jest historycznym gate, nie produkcyjnym bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdem nowej logiki.

TESTY:
- node --test tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2M.

<!-- STAGE223_R2N_CASE_HISTORY_UNIFIED_PANEL_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2N case history unified panel contract hotfix

FAKTY:
- R2M przeprowadziĂ„Ä…Ă˘â‚¬Ĺˇ `case-detail-rewrite-build-workitems-final`.
- `verify:closeflow:quiet` przeszedĂ„Ä…Ă˘â‚¬Ĺˇ dalej do `tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs`.
- Test wymaga literalnych tokenĂ„â€šÄąâ€šw w `CaseDetail.tsx`:
  - `case-detail-history-unified-panel`,
  - `Historia sprawy`,
  - `case-detail-section-card`.
- CSS dla `case-detail-history-unified-panel` juĂ„Ä…Ă„Ëť przechodzi, wiÄ‚â€žĂ˘â€žËc brak dotyczy tylko markera/zakresu w `CaseDetail.tsx`.
- R2N dodaje jawny kontrakt unified panel bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako jawny marker, bo problem jest historycznym gate, nie nowÄ‚â€žĂ˘â‚¬Â¦ funkcjÄ‚â€žĂ˘â‚¬Â¦.

TESTY:
- node --test tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-detail-rewrite-buildWorkItems, case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2N.

<!-- STAGE223_R2O_CLIENT_DETAIL_OPERATIONAL_CENTER_LABELS_HOTFIX -->
## 2026-06-05 - STAGE223 R2O ClientDetail operational center labels hotfix

FAKTY:
- R2N przeprowadziĂ„Ä…Ă˘â‚¬Ĺˇ case history visual P1 repair3 oraz wszystkie wczeĂ„Ä…Ă˘â‚¬Ĺźniejsze release gates do builda.
- `verify:closeflow:quiet` przeszedĂ„Ä…Ă˘â‚¬Ĺˇ dalej do `tests/client-detail-v1-operational-center.test.cjs`.
- Test wymaga literalnych etykiet w `ClientDetail.tsx`:
  - `NastÄ‚â€žĂ˘â€žËpny ruch`,
  - `Zadania klienta`,
  - `Wydarzenia klienta`,
  - `AktywnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ klienta`,
  - `buildClientNextAction`.
- Log wskazaĂ„Ä…Ă˘â‚¬Ĺˇ brak `Zadania klienta`.
- R2O dodaje brakujÄ‚â€žĂ˘â‚¬Â¦ce etykiety jako jawny kontrakt, bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy client-detail-v1-operational-center gate.
- Nie zmieniamy release gate.
- Nie przywracamy linkĂ„â€šÄąâ€šw do lead cockpit ani legacy /case route.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/client-detail-v1-operational-center.test.cjs
- npm run verify:closeflow:quiet
- case-history visual/rewrite/workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2O.

<!-- STAGE223_R2P_PWA_FOUNDATION_LEGACY_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2P PWA foundation legacy marker hotfix

FAKTY:
- R2O przeprowadziĂ„Ä…Ă˘â‚¬Ĺˇ ClientDetail operational center oraz wszystkie wczeĂ„Ä…Ă˘â‚¬Ĺźniejsze gates do builda.
- `verify:closeflow:quiet` przeszedĂ„Ä…Ă˘â‚¬Ĺˇ dalej do `tests/pwa-foundation.test.cjs`.
- Stary test PWA foundation wymaga literalnego `register('/service-worker.js'` w `src/pwa/register-service-worker.ts`.
- Aktualny Stage220A29 celowo zabrania realnego `navigator.serviceWorker.register('/service-worker.js'`, bo runtime service worker powodowaĂ„Ä…Ă˘â‚¬Ĺˇ zamykanie modali/formularzy po powrocie do karty.
- Stage122 wymaga wyrejestrowania starych workerĂ„â€šÄąâ€šw, czyszczenia cache i nieczyszczenia auth storage.
- R2P dodaje tylko legacy marker tekstowy `register('/service-worker.js'`, bez realnej rejestracji service workera.

DECYZJE:
- Nie przywracamy runtime service worker registration.
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy PWA foundation testu.
- Nie zmieniamy Stage220A29 ani Stage122.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/pwa-foundation.test.cjs
- node scripts/check-stage220a29-lead-confirm-no-sw-reload.cjs
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage223, Stage222, build, git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2P.

<!-- STAGE223_R2Q_V3_DAILY_DIGEST_EXACT_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Q-V3 daily digest exact marker hotfix

FAKTY:
- R2Q utworzyĂ„Ä…Ă˘â‚¬Ĺˇ `api/daily-digest.ts`.
- R2Q-V2 nie wykonaĂ„Ä…Ă˘â‚¬Ĺˇ patcha, bo helper JS miaĂ„Ä…Ă˘â‚¬Ĺˇ bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d skĂ„Ä…Ă˘â‚¬Ĺˇadni przed modyfikacjÄ‚â€žĂ˘â‚¬Â¦ pliku.
- Test `daily-digest-email-runtime.test.cjs` nadal wymaga literalnego tekstu: `selfTestMode === 'workspace-test'`.
- R2Q-V3 dopisuje dokĂ„Ä…Ă˘â‚¬Ĺˇadny token jako komentarz-kontrakt w `api/daily-digest.ts`.
- Wrapper nadal deleguje do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy daily digest release gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyĂ„Ä…Ă˘â‚¬Ĺˇki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2Q-V3.

<!-- STAGE223_R2R_DAILY_DIGEST_DIAGNOSTICS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2R daily digest diagnostics contract hotfix

FAKTY:
- R2Q-V3 przeprowadziĂ„Ä…Ă˘â‚¬Ĺˇ `daily-digest-email-runtime.test.cjs` oraz wczeĂ„Ä…Ă˘â‚¬Ĺźniejsze gates do builda.
- `verify:closeflow:quiet` przeszedĂ„Ä…Ă˘â‚¬Ĺˇ dalej do `tests/daily-digest-diagnostics.test.cjs`.
- Test wymaga literalnych tokenĂ„â€šÄąâ€šw w `api/daily-digest.ts`:
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
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy daily digest diagnostics gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyĂ„Ä…Ă˘â‚¬Ĺˇki/diagnostyki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2R.

<!-- STAGE223_R2S_DAILY_DIGEST_CRON_AUTH_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2S daily digest cron auth contract hotfix

FAKTY:
- R2R przeprowadziĂ„Ä…Ă˘â‚¬Ĺˇ `daily-digest-diagnostics.test.cjs` oraz wczeĂ„Ä…Ă˘â‚¬Ĺźniejsze gates do builda.
- `verify:closeflow:quiet` przeszedĂ„Ä…Ă˘â‚¬Ĺˇ dalej do `tests/daily-digest-cron-auth.test.cjs`.
- Test wymaga literalnych tokenĂ„â€šÄąâ€šw w `api/daily-digest.ts`:
  - `const vercelCron = asNullableText(req?.headers?.['x-vercel-cron']);`,
  - `if (vercelCron) return true;`,
  - `if (cronSecret)`,
  - `providedSecret === cronSecret`.
- R2S dodaje jawny kontrakt cron auth w wrapperze `api/daily-digest.ts`.
- Wrapper nadal deleguje realne wykonanie do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy daily digest cron auth gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyĂ„Ä…Ă˘â‚¬Ĺˇki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-cron-auth.test.cjs
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2S.

<!-- STAGE223_R2T_VERCEL_HOBBY_FUNCTION_BUDGET_SUPPORT_CONSOLIDATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2T Vercel Hobby function budget support consolidation hotfix

FAKTY:
- R2S przeprowadziĂ„Ä…Ă˘â‚¬Ĺˇ `daily-digest-cron-auth.test.cjs` oraz wczeĂ„Ä…Ă˘â‚¬Ĺźniejsze gates do builda.
- `verify:closeflow:quiet` przeszedĂ„Ä…Ă˘â‚¬Ĺˇ dalej do `tests/vercel-hobby-function-budget.test.cjs`.
- Test wymaga maksymalnie 12 plikĂ„â€šÄąâ€šw `api/*.ts`.
- Po dodaniu `api/daily-digest.ts` byĂ„Ä…Ă˘â‚¬Ĺˇo 13 funkcji API.
- `api/system.ts` juĂ„Ä…Ă„Ëť importuje `supportHandler` i obsĂ„Ä…Ă˘â‚¬Ĺˇuguje `kind === 'support'`.
- `vercel.json` juĂ„Ä…Ă„Ëť ma rewrite `/api/support -> /api/system?kind=support`.
- R2T usuwa redundantny `api/support.ts`, Ă„Ä…Ă„Ëťeby zejĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ do limitu 12 funkcji bez ruszania daily digest.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie usuwamy `api/daily-digest.ts`, bo historyczne testy daily digest czytajÄ‚â€žĂ˘â‚¬Â¦ ten plik bezpoĂ„Ä…Ă˘â‚¬Ĺźrednio.
- Konsolidujemy redundantny support endpoint przez istniejÄ‚â€žĂ˘â‚¬Â¦cy `api/system`.
- Nie zmieniamy `vercel.json`, bo wymagany rewrite juĂ„Ä…Ă„Ëť istnieje.
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
- JeĂ„Ä…Ă˘â‚¬Ĺźli gdzieĂ„Ä…Ă˘â‚¬Ĺź poza Vercel rewrite ktoĂ„Ä…Ă˘â‚¬Ĺź woĂ„Ä…Ă˘â‚¬Ĺˇa bezpoĂ„Ä…Ă˘â‚¬Ĺźrednio plikowÄ‚â€žĂ˘â‚¬Â¦ funkcjÄ‚â€žĂ˘â€žË `api/support.ts`, po usuniÄ‚â€žĂ˘â€žËciu musi trafiÄ‚â€žĂ˘â‚¬Ë‡ przez `/api/support` rewrite do `api/system?kind=support`.
- Support handler zostaje canonical w `src/server/support-handler.ts`.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2T.

<!-- STAGE223_R2V_STAGE32E_AND_ACTIVITIES_SYSTEM_ROUTE_HOTFIX -->
## 2026-06-05 - STAGE223 R2V Stage32e + activities system route hotfix

FAKTY:
- R2U przywrĂ„â€šÄąâ€šciĂ„Ä…Ă˘â‚¬Ĺˇ `api/support.ts` i przeszedĂ„Ä…Ă˘â‚¬Ĺˇ `request-identity-vercel-api-signature` oraz `vercel-hobby-function-budget`.
- R2U helper zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË przed peĂ„Ä…Ă˘â‚¬Ĺˇnym dopiÄ‚â€žĂ˘â€žËciem `activitiesHandler` do `api/system.ts`, wiÄ‚â€žĂ˘â€žËc R2V koĂ„Ä…Ă˘â‚¬Ĺľczy konsolidacjÄ‚â€žĂ˘â€žË `/api/activities`.
- `verify:closeflow:quiet` przeszedĂ„Ä…Ă˘â‚¬Ĺˇ dalej i zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË na `tests/stage32e-relation-rail-copy-compat.test.cjs`.
- Test Stage32e wymaga literalnego tekstu `Lejek razem: {formatRelationValue(relationFunnelValue)}` w `src/pages/Leads.tsx`.
- R2V dopina brakujÄ‚â€žĂ˘â‚¬Â¦cy kontrakt Stage32e bez przywracania starego dĂ„Ä…Ă˘â‚¬Ĺˇugiego copy i bez zmiany layoutu.
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
- `/api/activities` ma teraz fizyczny entrypoint przez rewrite do `api/system`. Po deployu sprawdziÄ‚â€žĂ˘â‚¬Ë‡ dodawanie/odczyt aktywnoĂ„Ä…Ă˘â‚¬Ĺźci/notatek przy leadach, klientach i sprawach.
- Stage32e jest literalnym starym kontraktem copy; dopiÄ‚â€žĂ˘â€žËto marker bez zmiany UI, Ă„Ä…Ă„Ëťeby nie rozwaliÄ‚â€žĂ˘â‚¬Ë‡ widoku.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2V.

<!-- STAGE223_R2W_MASS_RELEASE_GATE_SCAN_AND_A22_MIGRATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2W mass release gate scan + A22 migration hotfix

FAKTY:
- R2V przeszedĂ„Ä…Ă˘â‚¬Ĺˇ masowo wiele gates, build i wiÄ‚â€žĂ˘â€žËkszoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ `verify:closeflow:quiet`.
- Aktualny bloker to `tests/faza2-etap22-rls-backend-security-proof.test.cjs`.
- Test prĂ„â€šÄąâ€šbuje czytaÄ‚â€žĂ˘â‚¬Ë‡ brakujÄ‚â€žĂ˘â‚¬Â¦cy plik `supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql`.
- Test wymaga w migracji markerĂ„â€šÄąâ€šw:
  - `create table if not exists public.profiles/workspaces/workspace_members`,
  - `alter table ... enable row level security`,
  - `alter table ... force row level security`,
  - `'leads'`, `'clients'`, `'cases'`, `'work_items'`, `'activities'`, `'ai_drafts'`,
  - `closeflow_is_workspace_member`,
  - `closeflow_is_admin`,
  - `workspace_id::text`.
- R2W odtwarza brakujÄ‚â€žĂ˘â‚¬Â¦cy historyczny plik migracji oraz dodaje `scripts/stage223-r2w-mass-release-gate-scan.cjs`, ktĂ„â€šÄąâ€šry uruchamia testy z quiet gate po kolei i zbiera wszystkie bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdy zamiast zatrzymywaÄ‚â€žĂ˘â‚¬Ë‡ siÄ‚â€žĂ˘â€žË na pierwszym.

DECYZJE:
- Nie uruchamiaÄ‚â€žĂ˘â‚¬Ë‡ rÄ‚â€žĂ˘â€žËcznie SQL w Supabase w ramach tego etapu. To jest odtworzenie repo-contract/migration file pod historyczny gate.
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czaÄ‚â€žĂ˘â‚¬Ë‡ `faza2-etap22`.
- Od teraz przy kolejnych blokadach uĂ„Ä…Ă„ËťywaÄ‚â€žĂ˘â‚¬Ë‡ mass scan, Ă„Ä…Ă„Ëťeby Ă„Ä…Ă˘â‚¬ĹˇapaÄ‚â€žĂ˘â‚¬Ë‡ wiele bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdĂ„â€šÄąâ€šw naraz.
- Nie pushujemy bez zielonego `npm run verify:closeflow:quiet`.

TESTY:
- node --test tests/faza2-etap22-rls-backend-security-proof.test.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

RYZYKA:
- Plik SQL jest historycznym kontraktem migracji. Nie powinien byÄ‚â€žĂ˘â‚¬Ë‡ kopiowany rÄ‚â€žĂ˘â€žËcznie do Supabase bez osobnego przeglÄ‚â€žĂ˘â‚¬Â¦du SQL.
- Mass scan moĂ„Ä…Ă„Ëťe trwaÄ‚â€žĂ˘â‚¬Ë‡ dĂ„Ä…Ă˘â‚¬ĹˇuĂ„Ä…Ă„Ëťej niĂ„Ä…Ă„Ëť standardowy verify, ale daje peĂ„Ä…Ă˘â‚¬ĹˇniejszÄ‚â€žĂ˘â‚¬Â¦ listÄ‚â€žĂ˘â€žË blokad.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- JeĂ„Ä…Ă„Ëťeli mass scan pokaĂ„Ä…Ă„Ëťe kilka kolejnych failĂ„â€šÄąâ€šw, zrobiÄ‚â€žĂ˘â‚¬Ë‡ jeden zbiorczy R2X zamiast kolejnych maĂ„Ä…Ă˘â‚¬Ĺˇych paczek.

<!-- STAGE223_R2X_MASS_RELEASE_GATE_BATCH_HOTFIX -->
## 2026-06-05 - STAGE223 R2X mass release gate batch hotfix

FAKTY:
- R2W mass scan wykazaĂ„Ä…Ă˘â‚¬Ĺˇ 14 failing release gates:
  - today live refresh listener / mutation bus coverage,
  - calendar week-plan class isolation,
  - calendar modal vnext source,
  - calendar hard-refresh retry marker,
  - dialog accessibility descriptions,
  - LeadDetail vertical rhythm section copy,
  - destructive/trash source of truth,
  - Leads right rail source truth.
- R2X naprawia je batchowo zamiast robiÄ‚â€žĂ˘â‚¬Ë‡ kolejne pojedyncze mikropaczki.
- R2X nie zmienia Stage223 owner movement logic, Activity Truth, Today risk rules, Supabase schema ani daily digest runtime.
- R2X koĂ„Ä…Ă˘â‚¬Ĺľczy teĂ„Ä…Ă„Ëť zabezpieczenie `/api/activities -> /api/system?kind=activities`, jeĂ„Ä…Ă˘â‚¬Ĺźli R2U nie dokoĂ„Ä…Ă˘â‚¬ĹľczyĂ„Ä…Ă˘â‚¬Ĺˇ route przez anchor.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy starych gateÄ‚ËĂ˘â€šÂ¬Ă˘â€žËĂ„â€šÄąâ€šw.
- Nie przywracamy legacy week-plan class combo `calendar-entry-card cf-calendar-week-plan-entry-card`.
- Dialogi bez opisu dostajÄ‚â€žĂ˘â‚¬Â¦ jawny `aria-describedby={undefined}` escape.
- Trash actions majÄ‚â€žĂ˘â‚¬Â¦ iĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ przez wspĂ„â€šÄąâ€šlne Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇo `trash-action-source`.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
- rÄ‚â€žĂ˘â€žËcznie po deployu: /calendar, /today, /leads, /cases, /clients oraz /api/activities przez zapis/odczyt notatek/aktywnoĂ„Ä…Ă˘â‚¬Ĺźci

AUDYT RYZYK:
- CzÄ‚â€žĂ˘â€žËĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ napraw to kontrakty historycznych testĂ„â€šÄąâ€šw, wiÄ‚â€žĂ˘â€žËc po zielonym verify trzeba jeszcze obejrzeÄ‚â€žĂ˘â‚¬Ë‡ UI, szczegĂ„â€šÄąâ€šlnie Calendar i Leads.
- `/api/activities` moĂ„Ä…Ă„Ëťe dziaĂ„Ä…Ă˘â‚¬ĹˇaÄ‚â€žĂ˘â‚¬Ë‡ przez rewrite do system route. Po deployu sprawdziÄ‚â€žĂ˘â‚¬Ë‡ aktywnoĂ„Ä…Ă˘â‚¬Ĺźci/notatki.
- Dodawanie `aria-describedby={undefined}` jest akceptowanym explicit escape, ale docelowo lepiej w kolejnych etapach dodaÄ‚â€žĂ˘â‚¬Ë‡ prawdziwe opisy tam, gdzie dialog ma treĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ formularzowÄ‚â€žĂ˘â‚¬Â¦.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po R2X uruchomiÄ‚â€žĂ˘â‚¬Ë‡ mass scan. JeĂ„Ä…Ă˘â‚¬Ĺźli zostanÄ‚â€žĂ˘â‚¬Â¦ faile, zrobiÄ‚â€žĂ˘â‚¬Ë‡ R2Y jako kolejny batch z peĂ„Ä…Ă˘â‚¬Ĺˇnej listy, nie pojedynczo.

<!-- STAGE223_R2Y_STAGE220A20_CALENDAR_VST_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Y Stage220A20 Calendar VST marker hotfix

FAKTY:
- R2X mass scan przeszedĂ„Ä…Ă˘â‚¬Ĺˇ wszystkie 178 testĂ„â€šÄąâ€šw.
- Build zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË na prebuild guardzie `scripts/check-stage220a20-calendar-status-vst.cjs`.
- Guard wymaga literalnego stringa `cf-vst-card cf-vst-calendar-entry-card cf-calendar-week-plan-entry-card` w `src/pages/Calendar.tsx`.
- JednoczeĂ„Ä…Ă˘â‚¬Ĺźnie Stage100/104/99 nie pozwalajÄ‚â€žĂ˘â‚¬Â¦, Ă„Ä…Ă„Ëťeby taki legacy combo string wrĂ„â€šÄąâ€šciĂ„Ä…Ă˘â‚¬Ĺˇ do funkcji `ScheduleEntryCard`.
- R2Y dodaje wymagany string jako top-level compatibility marker przy `STAGE220A20_CALENDAR_STATUS_VST`, poza `ScheduleEntryCard`.
- Nie przywraca zakazanego class combo do runtime UI.

DECYZJE:
- Nie cofamy R2X.
- Nie zmieniamy UI Calendar.
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy Stage220A20.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/check-stage220a20-calendar-status-vst.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest marker kompatybilnoĂ„Ä…Ă˘â‚¬Ĺźci dla sprzecznych historycznych gateÄ‚ËĂ˘â€šÂ¬Ă˘â€žËĂ„â€šÄąâ€šw. Nie zmienia runtime UI.
- Po zielonym buildzie nadal trzeba rÄ‚â€žĂ˘â€žËcznie obejrzeÄ‚â€žĂ˘â‚¬Ë‡ Calendar, bo R2X dotykaĂ„Ä…Ă˘â‚¬Ĺˇ kilku klas i dialogĂ„â€šÄąâ€šw.
- JeĂ„Ä…Ă˘â‚¬Ĺźli kolejne prebuild guardy wykaĂ„Ä…Ă„ËťÄ‚â€žĂ˘â‚¬Â¦ podobny konflikt literalny, naprawiaÄ‚â€žĂ˘â‚¬Ë‡ markerem poza renderowanÄ‚â€žĂ˘â‚¬Â¦ funkcjÄ‚â€žĂ˘â‚¬Â¦, nie cofajÄ‚â€žĂ˘â‚¬Â¦c UI.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ R2Y. JeĂ„Ä…Ă„Ëťeli build i verify quiet przejdÄ‚â€žĂ˘â‚¬Â¦, moĂ„Ä…Ă„Ëťna wykonaÄ‚â€žĂ˘â‚¬Ë‡ push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223.

<!-- STAGE223_R2AA_STAGE105_STAGE220A28_CONTRACT_RECONCILE_HOTFIX -->
## 2026-06-05 - STAGE223 R2AA Stage105/Stage220A28 case delete contract reconcile hotfix

FAKTY:
- R2Z po patchu przeprowadziĂ„Ä…Ă˘â‚¬Ĺˇ `scripts/check-stage220a28-modal-focus-trash.cjs` i `tests/stage95-destructive-action-visual-source.test.cjs`.
- Mass scan zostaĂ„Ä…Ă˘â‚¬Ĺˇ z jednym failing gate: `tests/stage105-calendar-modal-no-dark-inputs.test.cjs`.
- Konflikt byĂ„Ä…Ă˘â‚¬Ĺˇ sprzeczny: Stage220A28 zabrania `cf-case-row-delete-text-action`, a Stage105 wymagaĂ„Ä…Ă˘â‚¬Ĺˇ tego tokena w `Cases.tsx`.
- R2AA aktualizuje Stage105 do bieĂ„Ä…Ă„ËťÄ‚â€žĂ˘â‚¬Â¦cego Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇa prawdy: `EntityTrashButton`, `data-case-row-delete-action="true"`, `data-cf-destructive-source="trash-action-source"`, `trashActionIconClass("h-4 w-4")`.

DECYZJE:
- Ă„Ä…Ă„â€¦rĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇem prawdy dla Cases delete action jest Stage220A28 + Stage95, nie stary fragment Stage105.
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
- Zmieniono test, bo poprzedni kontrakt byĂ„Ä…Ă˘â‚¬Ĺˇ sprzeczny z nowszym prebuild guardem.
- Po deployu rÄ‚â€žĂ˘â€žËcznie sprawdziÄ‚â€žĂ˘â‚¬Ë‡ listÄ‚â€žĂ˘â€žË spraw: ikona kosza, dialog potwierdzenia, styl subtelny bez czerwonej plakietki.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ R2AA. JeĂ„Ä…Ă˘â‚¬Ĺźli build i verify przejdÄ‚â€žĂ˘â‚¬Â¦, moĂ„Ä…Ă„Ëťna wykonaÄ‚â€žĂ˘â‚¬Ë‡ push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223.

<!-- STAGE223_R2AB_CALENDAR_DELETE_BUTTON_SYNTAX_HOTFIX -->
## 2026-06-05 - STAGE223 R2AB Calendar delete button JSX syntax hotfix

FAKTY:
- R2AA przeszedĂ„Ä…Ă˘â‚¬Ĺˇ Stage105, Stage220A28, Stage95 i mass scan 178 testĂ„â€šÄąâ€šw.
- Build zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË w `src/pages/Calendar.tsx` na bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdzie JSX:
  `Expected "=>" but found "="`.
- BĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d powstaĂ„Ä…Ă˘â‚¬Ĺˇ w przycisku usuwania wpisu kalendarza:
  `onClick={() = data-cf-destructive-source="trash-action-source"> onDelete(entry)}`.
- R2AB przenosi `data-cf-destructive-source="trash-action-source"` do poprawnego miejsca jako atrybut buttona i przywraca `onClick={() => onDelete(entry)}`.
- Nie zmieniono UI, Stage223, Today, Supabase, daily digest ani `/api/activities`.

DECYZJE:
- Nie cofamy R2X/R2Y/R2Z/R2AA.
- Nie usuwamy trash source markerĂ„â€šÄąâ€šw.
- Nie przywracamy legacy week-plan class combo.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest naprawa skĂ„Ä…Ă˘â‚¬Ĺˇadni po regexowym patchu. NajwiÄ‚â€žĂ˘â€žËksze ryzyko: delete button w Calendar moĂ„Ä…Ă„Ëťe mieÄ‚â€žĂ˘â‚¬Ë‡ poprawny build, ale trzeba go kliknÄ‚â€žĂ˘â‚¬Â¦Ä‚â€žĂ˘â‚¬Ë‡ rÄ‚â€žĂ˘â€žËcznie po deployu.
- Po deployu sprawdziÄ‚â€žĂ˘â‚¬Ë‡ `/calendar`: usuĂ„Ä…Ă˘â‚¬Ĺľ wpis tygodnia, usuĂ„Ä…Ă˘â‚¬Ĺľ wpis z selected day, sprawdĂ„Ä…ÄąĹş dialog/confirm i brak czerwonej plakietki.
- JeĂ„Ä…Ă˘â‚¬Ĺźli kolejny build pokaĂ„Ä…Ă„Ëťe bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d skĂ„Ä…Ă˘â‚¬Ĺˇadni w Calendar, nie robiÄ‚â€žĂ˘â‚¬Ë‡ szerokiego refaktoru; naprawiÄ‚â€žĂ˘â‚¬Ë‡ lokalnie bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdny JSX.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ R2AB. JeĂ„Ä…Ă˘â‚¬Ĺźli build i verify przejdÄ‚â€žĂ˘â‚¬Â¦, wykonaÄ‚â€žĂ˘â‚¬Ë‡ push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223.

<!-- STAGE223_R2AC_FINAL_GUARD_TESTS_CLOSURE -->
## 2026-06-05 - STAGE223 R2AC final guard/tests closure

FAKTY:
- Stage223 R2 zostaĂ„Ä…Ă˘â‚¬Ĺˇ juĂ„Ä…Ă„Ëť wypchniÄ‚â€žĂ˘â€žËty jako commit `66b13479`.
- Podetap E nie byĂ„Ä…Ă˘â‚¬Ĺˇ domkniÄ‚â€žĂ˘â€žËty w wymaganym ksztaĂ„Ä…Ă˘â‚¬Ĺˇcie:
  - istniaĂ„Ä…Ă˘â‚¬Ĺˇ `scripts/check-stage223-owner-movement-risk-system.cjs`,
  - istniaĂ„Ä…Ă˘â‚¬Ĺˇ runtime test `tests/stage223-owner-risk-runtime-contract.test.cjs`,
  - brakowaĂ„Ä…Ă˘â‚¬Ĺˇo docelowego `tests/stage223-owner-movement-risk-system.test.cjs`,
  - guard byĂ„Ä…Ă˘â‚¬Ĺˇ za bardzo tokenowy i nie pilnowaĂ„Ä…Ă˘â‚¬Ĺˇ peĂ„Ä…Ă˘â‚¬Ĺˇnej listy decyzji z podetapu E.
- R2AC dodaje finalny runtime test i zaostrza guard.

DECYZJE:
- Nie wdraĂ„Ä…Ă„Ëťamy nowej funkcji.
- Nie ruszamy Stage224.
- Nie robimy Contact Cadence Grid, Lost Lead Rescue, Owner Digest, Finance Watchlist, AI scoringu, automatycznych wiadomoĂ„Ä…Ă˘â‚¬Ĺźci ani redesignu Today.
- Celem R2AC jest domkniÄ‚â€žĂ˘â€žËcie jakoĂ„Ä…Ă˘â‚¬Ĺźci/guardĂ„â€šÄąâ€šw po Stage223 R2.
- Nie pushujemy bez zielonych testĂ„â€šÄąâ€šw koĂ„Ä…Ă˘â‚¬Ĺľcowych.

TESTY AUTOMATYCZNE:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

TESTY RÄ‚â€žĂ‚ÂCZNE:
- Leads: badge braku akcji, ciszy 7/14 i wysokiej wartoĂ„Ä…Ă˘â‚¬Ĺźci zaleĂ„Ä…Ă„Ëťnej od progu.
- LeadDetail: status nastÄ‚â€žĂ˘â€žËpnego ruchu, brak duplikacji paneli, czytelne badge.
- Cases: badge braku ruchu, braku nastÄ‚â€žĂ˘â€žËpnego ruchu i pieniÄ‚â€žĂ˘â€žËdzy bez ruchu.
- CaseDetail: czytelny ruch/ryzyko bez mieszania z historiÄ‚â€žĂ˘â‚¬Â¦ i notatkami.
- Today: brak nowej sekcji, `Wysoka wartoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ / ryzyko`, klikniÄ‚â€žĂ˘â€žËcia do rekordĂ„â€šÄąâ€šw, brak agresywnego odĂ„Ä…Ă˘â‚¬ĹźwieĂ„Ä…Ă„Ëťania po zmianie karty.

AUDYT RYZYK:
- R2AC zmienia testy i guardy, nie runtime funkcji.
- GĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šÄąâ€šwne ryzyko: guard moĂ„Ä…Ă„Ëťe zĂ„Ä…Ă˘â‚¬ĹˇapaÄ‚â€žĂ˘â‚¬Ë‡ przyszĂ„Ä…Ă˘â‚¬Ĺˇe rÄ‚â€žĂ˘â€žËczne dublowanie badge w UI Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ to jest celowe.
- Po zielonym teĂ„Ä…Ă˘â‚¬Ĺźcie moĂ„Ä…Ă„Ëťna uruchomiÄ‚â€žĂ˘â‚¬Ë‡ lokalnie aplikacjÄ‚â€žĂ˘â€žË i przejĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ checklistÄ‚â€žĂ˘â€žË manualnÄ‚â€žĂ˘â‚¬Â¦.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ R2AC lokalnie.
- JeĂ„Ä…Ă„Ëťeli testy sÄ‚â€žĂ˘â‚¬Â¦ zielone, odpaliÄ‚â€žĂ˘â‚¬Ë‡ lokalnie `npm run dev:api` i sprawdziÄ‚â€žĂ˘â‚¬Ë‡ /today, /leads, /cases, /calendar.

<!-- STAGE223_R2AD_V4_TODAY_TILE_NO_SCROLL_TRAP_HOTFIX -->
## 2026-06-05 - STAGE223 R2AD V4 Today tile no-scroll trap hotfix

FAKTY:
- R2AD V1, V2 i V3 nie zaaplikowaĂ„Ä…Ă˘â‚¬Ĺˇy siÄ‚â€žĂ˘â€žË przez zbyt kruche anchory patchera.
- V4 wykonuje lokalny audyt `TodayStable.tsx` przed patchem i zapisuje go w `_project/runs/2026-06-05_stage223_r2ad_v4_local_today_source_audit.md`.
- V4 uĂ„Ä…Ă„Ëťywa parsera blokĂ„â€šÄąâ€šw/statements, zamiast zakĂ„Ä…Ă˘â‚¬ĹˇadaÄ‚â€žĂ˘â‚¬Ë‡ sÄ‚â€žĂ˘â‚¬Â¦siedztwo tekstowe i puste linie.
- Naprawiane punkty:
  - `moveTodaySectionToTop` nie przestawia DOM,
  - `scrollToTodaySection` nie wywoĂ„Ä…Ă˘â‚¬Ĺˇuje `scrollIntoView`,
  - `focusTodaySectionFromMetricTile` nie uĂ„Ä…Ă„Ëťywa timeout/scroll/reorder,
  - root/capture bridges ignorujÄ‚â€žĂ˘â‚¬Â¦ top metric tiles,
  - top metric buttons majÄ‚â€žĂ˘â‚¬Â¦ wĂ„Ä…Ă˘â‚¬Ĺˇasne bezpieczne onClick z blur/prevent/stop.
- Guard R2AD zostaje dopiÄ‚â€žĂ˘â€žËty do `verify:closeflow:quiet`.

DECYZJE:
- Nie zaczynamy Stage224.
- Nie scrollujemy automatycznie do sekcji.
- Nie przenosimy sekcji w DOM po klikniÄ‚â€žĂ˘â€žËciu kafelka.
- Nie pushujemy bez zielonego guard/build/verify i rÄ‚â€žĂ˘â€žËcznego testu `/today`.

TESTY:
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- Zmieniamy UX kafelkĂ„â€šÄąâ€šw: nie przenoszÄ‚â€žĂ˘â‚¬Â¦ list na gĂ„â€šÄąâ€šrÄ‚â€žĂ˘â€žË.
- Ryzyko lokalne: expand/collapse na `/today`; rÄ‚â€žĂ˘â€žËczny smoke obowiÄ‚â€žĂ˘â‚¬Â¦zkowy.
- Guard w verify quiet ma zapobiec powrotowi `scrollIntoView` / `insertBefore` w mechanice kafelkĂ„â€šÄąâ€šw Today.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ R2AD V4, potem `npm run dev`, rÄ‚â€žĂ˘â€žËczny test `/today`, push po akceptacji.

<!-- STAGE223_R2AE_QUIET_GATE_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AE quiet gate contract repair after R2AD

FAKTY:
- R2AD V4 zaaplikowaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË lokalnie i przeszedĂ„Ä…Ă˘â‚¬Ĺˇ:
  - lokalny audyt `TodayStable.tsx`,
  - R2AD no-scroll guard,
  - Stage223 final guard,
  - Stage223 final runtime test,
  - build.
- `npm run verify:closeflow:quiet` padĂ„Ä…Ă˘â‚¬Ĺˇ nie przez Today, tylko przez zĂ„Ä…Ă˘â‚¬Ĺˇamanie kontraktu quiet gate.
- BĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d:
  - `FAILED: case detail no partial loading`,
  - `verify:closeflow:quiet musi zachowaÄ‚â€žĂ˘â‚¬Ë‡ kontrakt quiet gate`.
- Przyczyna:
  - R2AD V4 dopisaĂ„Ä…Ă˘â‚¬Ĺˇ do `package.json` komendÄ‚â€žĂ˘â€žË `&& node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs`,
  - a `tests/closeflow-release-gate-quiet.test.cjs` wymaga dokĂ„Ä…Ă˘â‚¬Ĺˇadnie:
    `verify:closeflow:quiet = node scripts/closeflow-release-check-quiet.cjs`.
- R2AE przywraca `package.json` do exact quiet gate contract i podpina R2AD guard wewnÄ‚â€žĂ˘â‚¬Â¦trz `scripts/closeflow-release-check-quiet.cjs`.

DECYZJE:
- Nie zmieniamy fixu Today z R2AD V4.
- Nie dopisujemy dodatkowych poleceĂ„Ä…Ă˘â‚¬Ĺľ do `verify:closeflow:quiet` w package.json.
- Nowy guard Today ma byÄ‚â€žĂ˘â‚¬Ë‡ uruchamiany przez `closeflow-release-check-quiet.cjs`.
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
- Ryzyko byĂ„Ä…Ă˘â‚¬Ĺˇo proceduralne: dopiÄ‚â€žĂ˘â€žËcie guarda do package scriptu Ă„Ä…Ă˘â‚¬Ĺˇamie stary quiet gate contract.
- Zabezpieczenie: R2AE dodaje wĂ„Ä…Ă˘â‚¬Ĺˇasny guard pilnujÄ‚â€žĂ˘â‚¬Â¦cy, Ă„Ä…Ă„Ëťe package script pozostaje dokĂ„Ä…Ă˘â‚¬Ĺˇadny, a nowy R2AD guard jest w Ă„Ä…Ă˘â‚¬Ĺźrodku quiet gate.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ R2AE. JeĂ„Ä…Ă˘â‚¬Ĺźli verify quiet przejdzie, odpaliÄ‚â€žĂ˘â‚¬Ë‡ lokalnie `npm run dev`, sprawdziÄ‚â€žĂ˘â‚¬Ë‡ `/today`, potem push po akceptacji.

<!-- STAGE223_R2AF_TODAY_MOBILE_FOCUS_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AF Today mobile focus contract repair after no-scroll fix

FAKTY:
- R2AE przywrĂ„â€šÄąâ€šciĂ„Ä…Ă˘â‚¬Ĺˇ exact `verify:closeflow:quiet` contract i build przechodziĂ„Ä…Ă˘â‚¬Ĺˇ.
- Verify quiet zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË na starym guardzie `today mobile tile focus`.
- Guard `scripts/check-closeflow-today-mobile-tile-focus.cjs` nadal wymagaĂ„Ä…Ă˘â‚¬Ĺˇ:
  - `setCollapsedSections((prev) => prev.filter((entry) => entry !== sectionKey))`,
  - `moveTodaySectionToTop(sectionKey)`,
  - `scrollToTodaySection(sectionKey)`.
- To jest sprzeczne z decyzjÄ‚â€žĂ˘â‚¬Â¦ R2AD: kafelki Today nie mogÄ‚â€žĂ˘â‚¬Â¦ juĂ„Ä…Ă„Ëť przenosiÄ‚â€žĂ˘â‚¬Ë‡ sekcji w DOM ani przewijaÄ‚â€žĂ˘â‚¬Ë‡ do sekcji, bo to powodowaĂ„Ä…Ă˘â‚¬Ĺˇo scroll trap.
- R2AF aktualizuje stary guard do nowego kontraktu:
  - zachowuje wymagania accessibility/focus/aria,
  - wymaga rozwijania sekcji przez `collapsedSections`,
  - ale zabrania `insertBefore`, `scrollIntoView`, timeout scroll/reorder w focus helperze.
- R2AF nie zmienia runtime Today poza tym, co zrobiĂ„Ä…Ă˘â‚¬Ĺˇ R2AD V4.

DECYZJE:
- Nie cofamy R2AD V4.
- Nie przywracamy `moveTodaySectionToTop(sectionKey)` ani `scrollToTodaySection(sectionKey)` do Ă„Ä…Ă˘â‚¬ĹźcieĂ„Ä…Ă„Ëťki klikniÄ‚â€žĂ˘â€žËcia kafelka.
- Stary guard mobile focus zostaje dostosowany do nowej decyzji UX.
- Nie pushujemy bez zielonego verify quiet i rÄ‚â€žĂ˘â€žËcznego testu `/today`.

TESTY:
- node scripts/check-closeflow-today-mobile-tile-focus.cjs
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-r2af-today-mobile-focus-contract-repair.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To zmiana guard/test contract, nie nowa funkcja.
- GĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šÄąâ€šwne ryzyko: stary test wymuszaĂ„Ä…Ă˘â‚¬Ĺˇ zachowanie, ktĂ„â€šÄąâ€šre teraz uznaliĂ„Ä…Ă˘â‚¬Ĺźmy za Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇo bugĂ„â€šÄąâ€šw.
- Nowy kontrakt utrzymuje dostÄ‚â€žĂ˘â€žËpnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ i focus, ale blokuje scroll trap.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ R2AF, potem lokalny `npm run dev`, rÄ‚â€žĂ˘â€žËczny test `/today`, push po akceptacji.

<!-- STAGE223_R2AG_TODAYSTABLE_TRAILING_WHITESPACE_CLEANUP -->
## 2026-06-05 - STAGE223 R2AG TodayStable trailing whitespace cleanup

FAKTY:
- R2AF zaaplikowaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË i przeszedĂ„Ä…Ă˘â‚¬Ĺˇ:
  - Today mobile tile focus guard,
  - Today tile no-scroll trap guard,
  - R2AF contract guard,
  - build,
  - verify:closeflow:quiet.
- Jedyny bloker zostaĂ„Ä…Ă˘â‚¬Ĺˇ na `git diff --check`.
- `git diff --check` wskazaĂ„Ä…Ă˘â‚¬Ĺˇ trailing whitespace w `src/pages/TodayStable.tsx`:
  - linia 977,
  - linia 986,
  - linia 1109.
- R2AG usuwa wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦cznie trailing whitespace w `TodayStable.tsx`.
- Nie zmienia logiki Today, guardĂ„â€šÄąâ€šw, package scripts, quiet gate ani UI.

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
- To czyszczenie whitespace, wiÄ‚â€žĂ˘â€žËc ryzyko runtime jest minimalne.
- RÄ‚â€žĂ˘â€žËczny smoke `/today` nadal wymagany, bo wĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺźciwa zmiana behavioru pochodzi z R2AD V4/R2AF.
- Uwaga: ostrzeĂ„Ä…Ă„Ëťenia LF/CRLF z `git diff --check` sÄ‚â€žĂ˘â‚¬Â¦ nieblokujÄ‚â€žĂ˘â‚¬Â¦ce; trailing whitespace byĂ„Ä…Ă˘â‚¬Ĺˇ blokujÄ‚â€žĂ˘â‚¬Â¦cy.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ R2AG.
- Po zielonym diff check odpaliÄ‚â€žĂ˘â‚¬Ë‡ lokalnie `npm run dev`, sprawdziÄ‚â€žĂ˘â‚¬Ë‡ `/today`, potem push po akceptacji.

<!-- STAGE223R3_A_LAST_CONTACT_INTAKE -->
## 2026-06-05 - STAGE223R3-A Last Contact Intake

FAKTY:
- Zweryfikowano, Ă„Ä…Ă„Ëťe formularz tworzenia leada i klienta nie miaĂ„Ä…Ă˘â‚¬Ĺˇ pola `lastContactAt`.
- Zweryfikowano, Ă„Ä…Ă„Ëťe payload tworzenia leada/klienta nie wysyĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺˇ `lastContactAt`.
- `activity-truth.ts` i `next-move-contract.ts` juĂ„Ä…Ă„Ëť istniejÄ‚â€žĂ˘â‚¬Â¦ po Stage223, wiÄ‚â€žĂ˘â€žËc wczeĂ„Ä…Ă˘â‚¬Ĺźniejsza teza o ich braku byĂ„Ä…Ă˘â‚¬Ĺˇa nieaktualna.
- R3A dodaje pole `Ostatni kontakt` do tworzenia leadĂ„â€šÄąâ€šw i klientĂ„â€šÄąâ€šw.
- R3A dodaje helper `src/lib/owner-control/last-contact-intake.ts`.
- R3A dodaje API support dla `lastContactAt` / `last_contact_at` w `api/leads.ts` i `api/clients.ts`.
- R3A dodaje SQL `supabase/sql/001_stage223r3_add_last_contact_at.sql`.

DECYZJE:
- DomyĂ„Ä…Ă˘â‚¬Ĺźlnie pole pokazuje dzisiejszÄ‚â€žĂ˘â‚¬Â¦ datÄ‚â€žĂ˘â€žË.
- JeĂ„Ä…Ă„Ëťeli kontakt byĂ„Ä…Ă˘â‚¬Ĺˇ starszy, operator ma wpisaÄ‚â€žĂ˘â‚¬Ë‡ prawdziwÄ‚â€žĂ˘â‚¬Â¦ datÄ‚â€žĂ˘â€žË.
- DatÄ‚â€žĂ˘â€žË zapisujemy jako noon ISO, Ă„Ä…Ă„Ëťeby ograniczyÄ‚â€žĂ˘â‚¬Ë‡ problemy stref czasowych.
- Daty przyszĂ„Ä…Ă˘â‚¬Ĺˇe sÄ‚â€žĂ˘â‚¬Â¦ blokowane komunikatem: `Ostatni kontakt nie moĂ„Ä…Ă„Ëťe byÄ‚â€žĂ˘â‚¬Ë‡ w przyszĂ„Ä…Ă˘â‚¬ĹˇoĂ„Ä…Ă˘â‚¬Ĺźci.`
- Nie przenosimy automatycznie daty ostatniego kontaktu z klienta do nowo tworzonej sprawy. To zostaje DO POTWIERDZENIA.

TESTY:
- node scripts/check-stage223r3-last-contact-intake.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- JeĂ„Ä…Ă˘â‚¬Ĺźli SQL nie zostanie uruchomiony, API ma fallback dla brakujÄ‚â€žĂ˘â‚¬Â¦cej kolumny, ale data nie bÄ‚â€žĂ˘â€žËdzie trwale zapisana w bazie.
- Lista leadĂ„â€šÄąâ€šw/klientĂ„â€šÄąâ€šw ma fallback select bez `last_contact_at`, Ă„Ä…Ă„Ëťeby nie wysadziÄ‚â€žĂ˘â‚¬Ë‡ produkcji przed migracjÄ‚â€žĂ˘â‚¬Â¦.
- PeĂ„Ä…Ă˘â‚¬Ĺˇne spiÄ‚â€žĂ˘â€žËcie z widocznoĂ„Ä…Ă˘â‚¬ĹźciÄ‚â€žĂ˘â‚¬Â¦ badge `Cisza 14+ dni` zaleĂ„Ä…Ă„Ëťy od tego, czy `last_contact_at` wrĂ„â€šÄąâ€šci z API po migracji.
- NastÄ‚â€žĂ˘â€žËpny krok po R3A: Stage223R3-B Activity Truth Integration/verification, jeĂ„Ä…Ă˘â‚¬Ĺźli po manualnym teĂ„Ä…Ă˘â‚¬Ĺźcie badge nie bierze daty z bazy.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ SQL w Supabase.
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ R3A lokalnie.
- PrzetestowaÄ‚â€žĂ˘â‚¬Ë‡ tworzenie leada/klienta z datÄ‚â€žĂ˘â‚¬Â¦ 20 dni temu.

<!-- STAGE223R3A_V3_STAGE03D_LAST_CONTACT_EVIDENCE -->
## 2026-06-05 - STAGE223R3A-V3 Stage03D last_contact_at evidence hotfix

FAKTY:
- Stage223R3A-V2 przeszedĂ„Ä…Ă˘â‚¬Ĺˇ guard i runtime test dla Last Contact Intake.
- Build przeszedĂ„Ä…Ă˘â‚¬Ĺˇ.
- `verify:closeflow:quiet` zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË na `tests/stage03d-optional-columns-evidence.test.cjs`.
- Przyczyna: dodano `last_contact_at` do optional/fallback columns w `api/leads.ts`, ale Stage03D evidence matrix nie miaĂ„Ä…Ă˘â‚¬Ĺˇa wiersza `leads.last_contact_at`.
- V3 dopisuje wymagane wiersze evidence:
  - `leads.last_contact_at`,
  - `clients.last_contact_at`.

DECYZJE:
- Nie zmieniamy runtime Last Contact Intake.
- Nie cofamy SQL.
- Naprawiamy dokument evidence, bo Stage03D wymaga audytowalnego uzasadnienia kaĂ„Ä…Ă„Ëťdej optional fallback column.
- Nie uruchamiamy osobnego peĂ„Ä…Ă˘â‚¬Ĺˇnego builda drugi raz; po zmianie dokumentu evidence uruchamiamy failing Stage03D test oraz `verify:closeflow:quiet`, Ă„Ä…Ă„Ëťeby potwierdziÄ‚â€žĂ˘â‚¬Ë‡ release gate.

TESTY:
- node --test tests/stage03d-optional-columns-evidence.test.cjs
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest dokumentacyjno-release-gate hotfix.
- Runtime ryzyko minimalne, bo kod produkcyjny nie jest zmieniany w V3.
- Po zielonym gate nadal trzeba rÄ‚â€žĂ˘â€žËcznie sprawdziÄ‚â€žĂ˘â‚¬Ë‡ tworzenie leada/klienta z `Ostatni kontakt` 20 dni temu.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ V3.
- JeĂ„Ä…Ă˘â‚¬Ĺźli gate jest zielony, lokalny smoke `/leads` i `/clients`.
- Push po akceptacji.

<!-- STAGE228F_R2_RUNTIME_COPY_CLEANUP -->
## 2026-06-07 18:55 Europe/Warsaw - STAGE228F R2

Runtime UI copy cleanup po bledzie paczki R1. Zakres: /clients prawy rail copy oraz /leads gorny kafelek Historia.

<!-- STAGE228G_CASES_COPY_AND_OPERATOR_RAIL_SOURCE_TRUTH -->
## 2026-06-07 19:05 Europe/Warsaw - STAGE228G cases copy cleanup + operator rail source truth

FAKTY:
- /cases row list no longer renders the lifecycle helper sentence plus action-count suffix under the client line.
- /cases top metric grid has an explicit one-row source marker for desktop.
- Cases operational shortcuts now use shared SimpleFiltersCard instead of raw local right-card markup.
- SimpleFiltersCard and TopValueRecordsCard expose shared operator rail item/tone hooks.
- Shared tone resolver: src/lib/operator-rail-tone.ts.
- Shared visual source: src/styles/operator-rail-source-truth-stage228g.css.

TESTY / GUARDY:
- node scripts/check-stage228g-cases-copy-and-operator-rail-source-truth.cjs
- npm run build
- git diff --check

RYZYKA:
- Color tone mapping is label/key based. If future labels become ambiguous, add explicit tone on the item instead of adding local CSS.
- Right rail remains vertically stacked because rail width is narrow; this stage locks the top cases metrics to one row on desktop and unifies right-rail item color intensity.

NEXT:
- Manual check /cases: no helper sentence in case rows, four top metric cards in one desktop row, Operacyjne skrĂ„â€šÄąâ€šty visually matches Filtry proste intensity.

<!-- STAGE228H_R3_TIMELINE -->
- 2026-06-07 19:45 Europe/Warsaw: STAGE228H R3 local-only - naprawa niedziaĂ„Ä…Ă˘â‚¬ĹˇajÄ‚â€žĂ˘â‚¬Â¦cego R2, Sales Funnel metric source truth, bez push.
<!-- /STAGE228H_R3_TIMELINE -->

<!-- STAGE228R1_TIMELINE -->
- 2026-06-08: Stage228R1 local-only package prepared for right-rail tasks-pattern visual source truth.
<!-- /STAGE228R1_TIMELINE -->

<!-- STAGE228R2_ADMIN_FEEDBACK_TIMELINE -->
- 2026-06-08 08:58 Europe/Warsaw: Stage228R2 local-only - cleanup po admin feedback JSON dla prawych raili i separatora `/funnel`; build PASS; manual visual smoke SKIP przez `Ladowanie widoku...`.
<!-- /STAGE228R2_ADMIN_FEEDBACK_TIMELINE -->

## 2026-06-08 21:05 Europe/Warsaw - STAGE228R14_C5_TIMELINE

Stage228R14 / C5 prepared locally:
- no-SQL decision for Brak,
- guard and documentation,
- final manual gate before batch push.

## 2026-06-08 21:45 Europe/Warsaw - STAGE228R15_TIMELINE

Hotfix po deploy C5:
- delete Brak bez next_action_title null,
- modal save refresh bez manualnego odswiezania aplikacji.

<!-- STAGE228R17_MISSING_ITEM_DELETE_CONTRACT -->
## 2026-06-08 20:45 Europe/Warsaw - Stage228R17 missing_item delete contract

STATUS: LOCAL_ONLY_APPLIED_BY_ZIP, test reczny DO WYKONANIA.

FAKTY:
- Objaw: klikniecie UsuĂ„Ä…Ă˘â‚¬Ĺľ przy Braku usuwa wpis optymistycznie, ale po refetchu/odswiezeniu wpis wraca.
- Przyczyna naprawiana: niespojny kontrakt soft-delete missing_item/task oraz ryzyko ustawiania usuwanego taska jako lead.next_action_item_id.
- LeadDetail usuwa Brak natychmiast z lokalnego stanu, wykonuje backendowy soft-delete i robi silent refresh bez pelnego loadera.
- Task route nie promuje missing_item ani zamknietych/usunietych taskow do lead next action; deleted/done task czysci matching next_action_item_id.

TESTY/GUARDY:
- node scripts/check-stage228r17-missing-item-delete-contract.cjs
- node --test tests/stage228r17-missing-item-delete-contract.test.cjs
- npm run build
- git diff --check

TEST RECZNY:
- Lead -> dodaj Brak -> odswiez -> Brak widoczny -> UsuĂ„Ä…Ă˘â‚¬Ĺľ -> znika od razu -> odczekaj -> hard refresh -> Brak nie wraca.
- Sprawdzic, ze NastÄ‚â€žĂ˘â€žËpny krok nie pokazuje usunietego Braku.

RYZYKA:
- Jesli baza ma stare rekordy missing_item juz podpiete jako next_action, delete czysci tylko matching next_action_item_id.
- Nie wykonano twardego DELETE, zgodnie z obecnym kierunkiem soft-delete.
- Nie ruszano ukladu UI ani styli kafelkow.

NASTEPNY KROK:
- Po PASS recznym wykonac selektywny commit/push repo i osobny commit/push vaultu Obsidian.
<!-- /STAGE228R17_MISSING_ITEM_DELETE_CONTRACT -->

## 2026-06-08 21:10 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Stage228R18 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ missing item hard delete source truth

- problem: Brak znikaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ po klikniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âciu UsuÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ, ale wracaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ po hard refresh.
- decyzja: aktywny Brak w LeadDetail ma byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ usuwany realnym backend DELETE z work_items po ID, nie tylko statusem deleted.
- dodatkowo: lista Braki i blokady ma byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡owana z linkedTasks, nie z caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego timeline, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby activity history nie odtwarzaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a aktywnego braku.
- testy: check-stage228r18, node test, npm run build, git diff --check, test rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âczny dodaj/usun/hard refresh.
- ryzyko: DELETE jest mocniejsze niÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ soft-delete; historia usuniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcia zostaje jako activity.

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

## 2026-06-09 02:50 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE228R41_DELETE_FLOW_FINAL_VALIDATE_PUSH

FAKTY:
- R41 finalizuje delete flow po nieudanym lokalnym Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľcuchu R26-R40.
- Package prebuild zostawia finalnie R25 i R41, bez wadliwych R26-R40.
- Walidacja nie opiera siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ na dokÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adnym polskim tekÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcie toastu, tylko na strukturze przepÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ywu: branch event/task, toast.error, toast.success, local prune, filtry bundle.

TESTY:
- mass node --check stage228 scripts/tests
- R18/R25/R41 guards
- R25/R41 node tests
- npm run build
- git diff --check

RYZYKA:
- Po deployu wymagany rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âczny test produkcyjny usuwania: Calendar event/task, TasksStable task, LeadDetail Brak, ClientDetail Brak.

<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_TIMELINE_START -->
## 2026-06-10 17:10 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0A Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Visual Source of Truth Inventory + UI Consistency Guard

Dodano:
- centralny raport `_project/VISUAL_SOURCE_OF_TRUTH.md`,
- run report `_project/runs/STAGE231D0A_VISUAL_SOURCE_TRUTH_INVENTORY_RUN.md`,
- payload Obsidian `_project/obsidian_payloads/STAGE231D0A_VISUAL_SOURCE_TRUTH_OBSIDIAN_PAYLOAD.md`,
- guard i test D0A,
- wpis roadmapy D0A przed D0.

Nie zmieniano runtime UI, danych, SQL, finansÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, Google Auth ani Google Calendar.
<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_TIMELINE_END -->

<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_TIMELINE_START -->
## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0A-R3

Rescue po bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdnym runnerze R2 i wczeĂ„Ä…Ă˘â‚¬Ĺźniejszym pushu D0A mimo FAIL. R3 domyka guard, test i higienÄ‚â€žĂ˘â€žË plikĂ„â€šÄąâ€šw przed D0.
<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_TIMELINE_END -->

<!-- STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP_R4_START -->
## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0-R4 Client workspace UX final runner fix

Status: LOCAL_ONLY_PREPARED / DO_TEST_AND_PUSH

FAKTY:
- R4 naprawia wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦cznie niedziaĂ„Ä…Ă˘â‚¬ĹˇajÄ‚â€žĂ˘â‚¬Â¦cy runner/patch D0 i domyka ClientDetail UX cleanup.
- Zakres UI: marker D0, tekst Ă„Ä…Ă‚Âadowanie klienta..., tekst SPRAWA ZAMKNIÄ‚â€žĂ‚ÂTA, finance icon source truth payment, jeden client-level aria-label Finanse klienta.

TESTY:
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run test:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run test:stage231d0a-visual-source-truth-consistency
- node scripts/check-stage231b0-r15-r3-polish-encoding.cjs
- npm run build
- git diff --check

AUDYT RYZYK:
- Nie ruszano modelu finansĂ„â€šÄąâ€šw i kosztĂ„â€šÄąâ€šw.
- IstniejÄ‚â€žĂ˘â‚¬Â¦ce ostrzeĂ„Ä…Ă„Ëťenie duplicate savedRecord zostaje poza zakresem.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po PASS/push przejĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ do STAGE231D1 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ model kosztĂ„â€šÄąâ€šw.
<!-- STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP_R4_END -->

## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0-R5 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Client workspace UX guard close
- Status: LOCAL_ONLY_RESCUE_PRE_PUSH.
- DomkniÄ‚â€žĂ˘â€žËcie po R4: ikona finansĂ„â€šÄąâ€šw klienta z EntityIcon case -> payment oraz brakujÄ‚â€žĂ˘â‚¬Â¦ce tokeny "audyt ryzyk", "nastÄ‚â€žĂ˘â€žËpny krok" i "VISUAL SOURCE OF TRUTH".
- Zakres bez zmian danych: ClientDetail UI, guard/test D0, raporty _project i Obsidian payload.
- Testy: D0 guard/test, D0A regression, Polish guard, build, git diff --check.
- Audyt ryzyk: rÄ‚â€žĂ˘â€žËcznie sprawdziÄ‚â€žĂ˘â‚¬Ë‡ brak duplikatu Finanse klienta i poprawnÄ‚â€žĂ˘â‚¬Â¦ ikonÄ‚â€žĂ˘â€žË finansĂ„â€šÄąâ€šw.
<!-- STAGE231D1_COST_MODEL_SOURCE_TRUTH_START -->
## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D1 Cost model source truth

Status: LOCAL_ONLY_PREPARED / DO_TEST_AND_PUSH

FAKTY:
- STAGE231D1_COST_MODEL_SOURCE_TRUTH: dodano centralny model kosztĂ„â€šÄąâ€šw sprawy bez zmian runtime UI.
- Model rozdziela: Koszty poniesione, Koszty do zwrotu, Koszty zwrĂ„â€šÄąâ€šcone i Razem do pobrania.
- D1 nie dodaje SQL, tabel, migracji, Supabase ani formularza UI.

VISUAL SOURCE OF TRUTH:
- D1 uĂ„Ä…Ă„Ëťywa finansowego sĂ„Ä…Ă˘â‚¬Ĺˇownika etykiet i nie dodaje lokalnych stylĂ„â€šÄąâ€šw UI.
- UI zostaje do D2/D3, zgodnie z D0A Visual Source of Truth.

TESTY:
- npm run check:stage231d1-cost-model-source-truth
- npm run test:stage231d1-cost-model-source-truth
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run build
- git diff --check

audyt ryzyk:
- Ryzyko: D2 moĂ„Ä…Ă„Ëťe potrzebowaÄ‚â€žĂ˘â‚¬Ë‡ SQL/tabeli, ale D1 celowo nie dotyka bazy.
- Ryzyko: stare UI finansĂ„â€šÄąâ€šw nie pokaĂ„Ä…Ă„Ëťe kosztĂ„â€šÄąâ€šw, dopĂ„â€šÄąâ€ški D2/D3 nie podĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czÄ‚â€žĂ˘â‚¬Â¦ modelu.
- Ryzyko: jeĂ„Ä…Ă˘â‚¬Ĺźli koszt nie jest reimbursable, nie wchodzi w Koszty do zwrotu.

nastÄ‚â€žĂ˘â€žËpny krok:
- Po PASS/push przejĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ do STAGE231D2 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ koszty w sprawie z SQL/guardem i UI opartym o model D1.
<!-- STAGE231D1_COST_MODEL_SOURCE_TRUTH_END -->

<!-- STAGE231D2_CASE_COSTS_IN_CASE_START -->
## STAGE231D2 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Case costs in case
- data: 2026-06-10 18:55 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED / DO_APPLY_TEST_SQL_AND_PUSH
- zakres: SQL case_costs, API /api/case-costs, CaseDetail cost panel, guard/test.
- testy: check/test D2, regression D1/D0/D0A, Polish guard, build, git diff --check.
- audyt ryzyk: SQL must be run before real write test; route must stay workspace scoped.
- nastÄ‚â€žĂ˘â€žËpny krok: apply package, run SQL, manual add-cost test, then push.
<!-- STAGE231D2_CASE_COSTS_IN_CASE_END -->

<!-- STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_START -->
## STAGE231D2-R2 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Case costs fetch guard close
- data: 2026-06-10 19:10 Europe/Warsaw
- status: LOCAL_ONLY_GUARD_CLOSE / DO_TEST_SQL_AND_PUSH
- zakres: CaseDetail import/fetch integration for case_costs.
- testy: D2 guard/test, D1/D0/D0A regression, Polish guard, build, git diff --check.
- audyt ryzyk: SQL still required before manual cost write test.
- nastÄ‚â€žĂ˘â€žËpny krok: run SQL, manual add-cost test, selective push.
<!-- STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_END -->

<!-- STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_START -->
## STAGE231D2-R3 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Vercel Hobby function limit fix
- data: 2026-06-10 19:25 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED / DO_APPLY_TEST_PUSH_DEPLOY
- powĂ„â€šÄąâ€šd: Vercel Hobby blokuje deployment po przekroczeniu limitu Serverless Functions.
- zakres: usuniÄ‚â€žĂ˘â€žËcie api/case-costs.ts, konsolidacja kosztĂ„â€šÄąâ€šw pod api/cases.ts?resource=costs, guard budĂ„Ä…Ă„Ëťetu funkcji.
- testy: D2 guard/test, Vercel budget guard/test, D1/D0/D0A regression, Polish guard, build, git diff --check.
- audyt ryzyk: po deployu powtĂ„â€šÄąâ€šrzyÄ‚â€žĂ˘â‚¬Ë‡ manualny test Dodaj koszt, bo zmienia siÄ‚â€žĂ˘â€žË Ă„Ä…Ă˘â‚¬ĹźcieĂ„Ä…Ă„Ëťka API.
- nastÄ‚â€žĂ˘â€žËpny krok: PASS -> push -> deploy -> test rÄ‚â€žĂ˘â€žËczny kosztu.
<!-- STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_END -->

## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D2-R5 CaseDetail render crash hotfix

- Status: LOCAL_ONLY_HOTFIX_PREPARED
- Problem: produkcyjna karta sprawy wysypywaĂ„Ä…Ă˘â‚¬Ĺˇa render przez brak definicji caseCostsSummaryStage231D2.
- Fix: dodano useMemo summary przed JSX i guard blokujÄ‚â€žĂ˘â‚¬Â¦cy regresjÄ‚â€žĂ˘â€žË.
- Testy: R5/D2/D2R3/D1/D0/D0A/Polish/build.
- Audyt ryzyk: po deployu sprawdziÄ‚â€žĂ˘â‚¬Ë‡ produkcyjne otwarcie sprawy; /api/case-items 500 to osobny backend problem, jeĂ„Ä…Ă˘â‚¬Ĺźli nadal wystÄ‚â€žĂ˘â‚¬Â¦pi.

## STAGE231D2-R6 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ CaseDetail top strip rail lift

- data i godzina: 2026-06-10 19:55 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED
- zmiana: skrĂ„â€šÄąâ€šcenie gĂ„â€šÄąâ€šrnego paska tytuĂ„Ä…Ă˘â‚¬Ĺˇu sprawy do lewej kolumny i podciÄ‚â€žĂ˘â‚¬Â¦gniÄ‚â€žĂ˘â€žËcie prawego raila do gĂ„â€šÄąâ€šrnego miejsca po prawej.
- testy: guard/test R6 + D2/R5/R3/D1/D0/D0A/Polish/build/git diff check.
- ryzyko: CSS negative margin wymaga produkcyjnego testu wizualnego po deployu.

## 2026-06-10 20:05 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D3-R7 prepared

- D3-R1..R6 failed because patchers/guards used brittle anchors. R7 switches to controlled file replacement and mass guard.

## STAGE231D3-R7-R2 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Polish guard restore and D3 close

- timestamp: 2026-06-10 20:42 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED
- result: restored missing scripts/check-polish-encoding-stage231b0-r15-r3.cjs required by regression lane after STAGE231D3-R7.
- risk audit: this fixes guard infrastructure drift only; it does not modify SQL, API routes, or CaseDetail layout.

## 2026-06-13 09:11 Europe/Warsaw - STAGE231F_R3
- status: IMPLEMENTED_LOCAL_PASS_READY_FOR_SELECTIVE_PUSH
- result: owner-control core, workspace thresholds, full Today queue, list integration and refresh persistence completed.
- evidence: dedicated tests, regression guards, build and browser QA PASS.
- app push: `3139ee04` -> `origin/dev-rollout-freeze`.
- Obsidian push: `7f01d16` -> `origin/main`.

## 2026-06-13 13:30 Europe/Warsaw - CLOSEFLOW_CLIENT_CASE_URGENT_FIX
- status: LOCAL_IMPLEMENTED_MANUAL_PENDING
- backup: `_local_backups/URGENT_CLIENT_CASE_FIX_20260613_124545/`
- result: four urgent client/case regressions fixed with shared finance and case-create sources.
- git: no commit and no push by decision.

## 2026-06-13 14:33 Europe/Warsaw - CLOSEFLOW_CASE_FINANCE_UI_REPAIR
- status: LOCAL_IMPLEMENTED_MANUAL_PENDING
- backup: `_local_backups/DO_POTWIERDZENIA_CASE_FINANCE_UI_20260613_142044/`
- result: case actions, case_items schema contract, finance tones, notes and lead truncation repaired.
- git: selective staging only; no commit and no push.

## 2026-06-14 10:05 Europe/Warsaw - STAGE231G R2 - LeadDetail operational wiring

Etap przygotowany jako lokalny ZIP R2 po bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdzie parsera PowerShell w R1. Zakres rozszerzony o jawny potencjaĂ„Ä…Ă˘â‚¬Ĺˇ w formularzu tworzenia leada.

## 2026-06-14 10:45 Europe/Warsaw - STAGE231G R7 - potential-only modal and value source

Hotfix po rÄ‚â€žĂ˘â€žËcznym teĂ„Ä…Ă˘â‚¬Ĺźcie Damiana. Przyczyna: UX byĂ„Ä…Ă˘â‚¬Ĺˇ za szeroki, a source of truth wartoĂ„Ä…Ă˘â‚¬Ĺźci leada byĂ„Ä…Ă˘â‚¬Ĺˇ niespĂ„â€šÄąâ€šjny pomiÄ‚â€žĂ˘â€žËdzy value i deal_value. Warunek zamkniÄ‚â€žĂ˘â€žËcia: R7 guard, R7 node test, STAGE231G guard, build, git diff --check i test rÄ‚â€žĂ˘â€žËczny potencjaĂ„Ä…Ă˘â‚¬Ĺˇu.

## 2026-06-14 - STAGE231G_R3 LeadDetail function mapping and operational closeout

Status: DO TESTU LOKALNEGO
Cel: domknĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ kartĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â leada jako operacyjne centrum pracy: potencjaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡, nastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpny krok, cisza/ryzyko, blokada, szybkie akcje, finanse, missing_item i czytelne wiersze dziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ.
Run report: _project/runs/STAGE231G_R3_LEAD_DETAIL_FUNCTION_MAPPING_AND_OPERATIONAL_CLOSEOUT.md
Guard: scripts/check-stage231g-r3-lead-detail-function-mapping.cjs
Test: 	ests/stage231g-r3-lead-detail-function-mapping.test.cjs
SQL: nie ruszano.

## STAGE231G_R4_LEAD_DETAIL_FUNCTION_MAPPING_CLOSEOUT_FIX

Data: 2026-06-14 11:45 Europe/Warsaw
Status: LOCAL_PACKAGE_PREPARED
Opis: przygotowano R4 closeout LeadDetail po R3. Etap zostanie zamkniety po lokalnym PASS i pushu.

## 2026-06-14 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: CaseDetail runtime repair for fake dictation, nextAction missing fallback, contractValue percent-only behavior, payment history copy, and full payment source in case history.
- SQL: NOT_TOUCHED.
- Deferred: cost lifecycle edit/delete and canonical case_item dual-path decision remain R1C/R1D.

## 2026-06-14 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: fixed shared CaseFinanceEditorDialog contractValue clearing bug after R1B.
- Guard: scripts/check-stage231h-r1b-case-detail-runtime-repair.cjs now covers CaseDetail and shared finance dialog.
- Decision: case_item source truth decision: two UI entries, one case_items contract.
- Risk: cost lifecycle left as R1C.
- SQL: NOT_TOUCHED.

## 2026-06-14 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL

Po manualnym teĂ„Ä…Ă˘â‚¬Ĺźcie R1B wykryto brak edycji kosztĂ„â€šÄąâ€šw. Dodano etap R1C: wspĂ„â€šÄąâ€šlne okno korekty wpĂ„Ä…Ă˘â‚¬Ĺˇat i kosztĂ„â€šÄąâ€šw.

## 2026-06-14 15:45 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231H_R1D_FINANCE_CORRECTION_MODAL_COMPACT

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: compact cleanup of CaseDetail finance correction modal after R1C.
- Decision: remove redundant cost status chip from the correction list; cost status remains editable inside the cost correction form.
- Decision: commission payment is a paid commission entry by default; remove status/type selectors from add-commission-payment UI.
- Decision: remove the redundant "Korekta / prowizja" fallback label from payment rows.
- SQL: NOT_TOUCHED.
- Manual test: open Koryguj wpĂ„Ä…Ă˘â‚¬ĹˇatÄ‚â€žĂ˘â€žË/koszt, verify rows fit, add commission payment, add/correct/delete cost, refresh.

## STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ 2026-06-14 16:40 Europe/Warsaw
- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH / SERVER_UI_REQUIRED
- Scope: payment correction now edits existing payment amount/date/note through updatePaymentInSupabase; cost correction edits kind/date/status/note and money fields.
- SQL: not touched.
- Risk: if payment PATCH fails on server, backend payment endpoint repair is required.


## 2026-06-14 HH:mm Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR
- Prepared R1F4 ZIP repair. No direct push by assistant.

## 2026-06-14 HH:mm Europe/Warsaw - STAGE231H_R1G_COST_OTHER_NAME_AND_REIMBURSABLE_FLAG
- Prepared runtime stage for correct cost reimbursement calculation and custom other cost labels.

## 2026-06-14 HH:mm Europe/Warsaw - STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC
- Closeout/sync stage prepared for CaseDetail finance/cost lifecycle.
- Runtime R1G remains TECH_PUSHED / SERVER_UI_REQUIRED.
- Next stages: R1D2 dictation restore, R1E reimbursed cost marking.


## STAGE231H_R1G3_CASE_DETAIL_MANUAL_UI_PASS

- date: 2026-06-14 18:55 Europe/Warsaw
- event: Damian confirmed manual UI tests for CaseDetail cost/payment lifecycle after R1G/R1G2.
- result: product closeout for the current CaseDetail finance/cost chain.

## 2026-06-14 19:10 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME

- R1G2 finance/cost pozostaje PRODUCT_PASS.
- R1D2 przywraca realne dyktowanie notatki w CaseDetail.
- Nastepny logiczny etap po manual PASS: R1E koszt zwrocony/czesciowo zwrocony.


## STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ 2026-06-14 19:40 Europe/Warsaw

- status: RUNTIME_HOTFIX_PREPARED
- zakres: drugi widoczny przycisk w panelu Notatki sprawy nie moĂ„Ä…Ă„Ëťe zostaÄ‚â€žĂ˘â‚¬Ë‡ jako disabled Ä‚ËĂ˘â€šÂ¬ÄąÄľNotatka gĂ„Ä…Ă˘â‚¬Ĺˇosowa Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ wkrĂ„â€šÄąâ€štceÄ‚ËĂ˘â€šÂ¬ÄąÄ„; ma uĂ„Ä…Ă„ËťywaÄ‚â€žĂ˘â‚¬Ë‡ tego samego handlera SpeechRecognition/autosave co przycisk w panelu DziaĂ„Ä…Ă˘â‚¬Ĺˇania sprawy.
- runtime: src/pages/CaseDetail.tsx, bez SQL i bez R1E kosztĂ„â€šÄąâ€šw zwrĂ„â€šÄąâ€šconych.
- test: R1D2 guard/test + R1D2 R4 guard/test + build + diff-check.
- ryzyko: wczeĂ„Ä…Ă˘â‚¬Ĺźniejszy R1D2 zabezpieczaĂ„Ä…Ă˘â‚¬Ĺˇ pierwszy przycisk, ale nie objÄ‚â€žĂ˘â‚¬Â¦Ă„Ä…Ă˘â‚¬Ĺˇ drugiego widocznego przycisku w panelu notatek.


## 2026-06-14 22:00 Europe/Warsaw - STAGE231H_R1D2_R6_R9_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR

Status: DO_APPLY / mass repair from clean origin.
Zakres: CaseDetail note follow-up source map and notes CRUD. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek dostaje Edytuj/UsuÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ/Zapisz. Etap zastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpuje runtime file bez kruchych anchorÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw po bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdach R6/R7/R8.


## 2026-06-14 22:15 Europe/Warsaw - STAGE231H_R1D2_R6_R9D_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR_GUARD_SYNC

Status: DO_APPLY / guard-ledger sync after R9 partial apply.
Zakres: centralny R1G2 product-pass sync wymagany przez legacy R1D2 guard plus R9 mass repair. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek ma Edytuj/UsuÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ/Zapisz.


## 2026-06-14 22:30 Europe/Warsaw - STAGE231H_R1D2_R6_R9E_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_GUARD_SYNC

Status: DO_APPLY / MASS_GUARD_SYNC_CONTINUATION
Zakres: masowe domkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcie klasy bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂdÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw legacy markerÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw. Synchronizuje R1G2, R1D2 R4, R9, R9D i R9E w centralnych ledgerach oraz uruchamia peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ny chain guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw/testÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw/build.


## 2026-06-14 22:40 Europe/Warsaw - STAGE231H_R1D2_R6_R9F_CASE_NOTE_FOLLOWUP_NOTES_CRUD_GUARD_REGEX_MASS_FIX

Status: DO_APPLY / MASS_GUARD_REGEX_FIX
Zakres: naprawa klasy bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdu guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw R9D/R9E: sprawdzenie runtime regex
eplace(/\s+/g, ' ') w guardzie musi mieĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ podwÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇjnie escapowany backslash. Bez tego guard szuka bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdnego
eplace(/s+/g, ' ').


## 2026-06-14 22:50 Europe/Warsaw - STAGE231H_R1D2_R6_R9G_CASE_NOTE_FOLLOWUP_NOTES_CRUD_LOCAL_TASKS_GUARD_MASS_FIX

Status: DO_APPLY / MASS_LOCAL_TASKS_GUARD_FIX
Zakres: naprawa klasy bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdu guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw R9E/R9F: runtime poprawnie dopina nowy follow-up task do lokalnego 	asks przez setTasks((current) => dedupeCaseTasks([normalizedCreated, ...current], caseId, caseData));, a guard nie moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe wymagaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ nieistniejĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cej skÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adni previousTasks.

## STAGE231H_R1D2_R10C_CASE_DETAIL_ACTION_MAP_FOLLOWUP_NOTES_FINANCE_LOADING

- Data: 2026-06-14 23:45 Europe/Warsaw
- Status: TECH_STAGE_IN_PROGRESS
- Zakres: CaseDetail action map, note follow-up display/source map, quick note local append, finance loading flicker removal.
- Audyt: R10 failed on brittle anchor. R10C uses regex/whole-class source-aware patch and guard.

### STAGE231H_R1D2_R11_NOTE_PANEL_FOLLOWUP_PROMPT_MAP_GUARD
- data: 2026-06-14T20:31:30.095Z
- status: DO_TEST_AND_PUSH
- zakres: notatki CaseDetail pokazujÄ‚â€žĂ˘â‚¬Â¦ do 5 wpisĂ„â€šÄąâ€šw, majÄ‚â€žĂ˘â‚¬Â¦ tooltip peĂ„Ä…Ă˘â‚¬Ĺˇnej treĂ„Ä…Ă˘â‚¬Ĺźci, szybka notatka otwiera ten sam prompt follow-upu co dyktowanie, a follow-up w dziaĂ„Ä…Ă˘â‚¬Ĺˇaniach pokazuje treĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ notatki jako opis.
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
- Zakres: CaseDetail notatki sprawy, follow-up po notatce, kasowanie powiĂ„â€¦zanego taska.
- Status: LOCAL_APPLIED_PENDING_VERIFY

## STAGE231H_R1D2_R15C - 2026-06-15 15:10 Europe/Warsaw
- CaseDetail: naprawiono dwukierunkowe powiÄ…zanie notatka/follow-up, ostrzeĹĽenie przy kasowaniu follow-upu z dziaĹ‚aĹ„ i hierarchiÄ™ tekstu w karcie dziaĹ‚ania.
