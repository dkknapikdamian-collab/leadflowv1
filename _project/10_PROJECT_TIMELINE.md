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
## 2026-05-16 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Stage104 / Paczka F Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Calendar loading performance

STATUS: WDROÄąÂ»ONE LOKALNIE PO APPLY, TEST R\u00c4\u0098CZNY DO WYKONANIA.

FAKTY:
- Kalendarz nie powinien juÄąÄ˝ liczyĂ„â€ˇ `combineScheduleEntries` wprost w renderze.
- Dni miesiĂ„â€¦ca i tygodnia korzystajĂ„â€¦ z `entriesByDayKey` / `weekEntriesByDayKey`.
- `Calendar.tsx` nie powinien juÄąÄ˝ uÄąÄ˝ywaĂ„â€ˇ `getEntriesForDay(...)` w render path.
- `cases` idĂ„â€¦ z `fetchCalendarBundleFromSupabase()`, bez drugiego `fetchCasesFromSupabase()` w `Calendar.tsx`.
- PeÄąâ€šnostronicowy loader zostaÄąâ€š zastĂ„â€¦piony maÄąâ€šym skeletonem danych.

TESTY:
- `node tests/stage104-calendar-loading-performance-contract.test.cjs`
- `npm run build` jeÄąâ€şli nie uÄąÄ˝yto `-SkipBuild`.

RYZYKA:
- Range fetch backendowy jest DO POTWIERDZENIA.
- Stare DOM-normalizatory miesiĂ„â€¦ca zostaÄąâ€šy nietkniĂ„â„˘te i wymagajĂ„â€¦ osobnego audytu w Paczce G.

NAST\u00c4\u0098PNY KROK:
- Test rĂ„â„˘czny `/calendar`: start, tydzieÄąâ€ž, miesiĂ„â€¦c, wybrany dzieÄąâ€ž, edycja, +1H/+1D/+1W, zrobione, usuÄąâ€ž.
<!-- /STAGE104_CALENDAR_PERFORMANCE_F -->


---
## Stage105 / Paczka G Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Templates delete + visual contract Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ 2026-05-16

STATUS: WDROÄąÂ»ONE LOKALNIE Z PACZKI ZIP, BEZ COMMITA I BEZ PUSHA.

FAKTY:
- /templates dostaÄąâ€š widoczny przycisk UsuÄąâ€ž na karcie szablonu.
- Delete uÄąÄ˝ywa EntityTrashButton i shared trash action source of truth.
- Delete wymaga window.confirm oraz dodatkowego potwierdzenia, jeÄąâ€şli szablon ma pozycje checklisty.
- Karta szablonu uÄąÄ˝ywa cf-template-card cf-readable-card i markerÄ‚Ĺ‚w
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
- Ten etap nie dodaje backendowego sprawdzania, czy szablon zostaÄąâ€š uÄąÄ˝yty w aktywnych sprawach. Wymusza Äąâ€şwiadome potwierdzenie usuwania wzorca i jego pozycji.

NAST\u00c4\u0098PNY KROK:
- PrzetestowaĂ„â€ˇ /templates; dopiero potem zdecydowaĂ„â€ˇ, czy robimy kolejny lokalny etap czy wspÄ‚Ĺ‚lny commit/push Stage104+Stage105.
<!-- STAGE105_TEMPLATES_DELETE_VISUAL_G -->

<!-- STAGE222_R4_V3_LEAD_CLIENT_OPERATIONAL_BADGES -->
## 2026-06-05 - STAGE222 R4 V3 lead/client operational badges robust fix

FAKTY:
- R4 V1/V2 zatrzymaÄąâ€šy siĂ„â„˘ na kruchych anchorach w Clients.tsx.
- V3 uÄąÄ˝ywa elastycznych regexÄ‚Ĺ‚w i naprawia czĂ„â„˘Äąâ€şciowy lokalny stan.
- Docelowy wzÄ‚Ĺ‚r: [Oferta wysÄąâ€šana] [Sprawa] [14+ dni bez ruchu] [brak akcji].
- Nie ruszano Today i nie dodano nowego CSS.

TESTY:
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs
- npm run build
- git diff --check

<!-- STAGE222_R2B_SETTINGS_CASES_HOTFIX -->
## 2026-06-05 - STAGE222 R2B Settings/Cases hotfix

FAKTY:
- Commit 7ff0bc08 zostaÄąâ€š wypchniĂ„â„˘ty mimo czerwonego guard/test Stage222 R2.
- Przyczyna: apply script nie wykonaÄąâ€š patcha Settings/Cases, wiĂ„â„˘c helper i guard weszÄąâ€šy bez sekcji ustawieÄąâ€ž i bez case badges.
- R2B dopina brakujĂ„â€¦ce elementy: Settings threshold section i Cases owner risk badges.
- Build wczeÄąâ€şniej przechodziÄąâ€š, ale Stage222 guard/test nie.

DECYZJE:
- Nie robimy rollbacku, bo build przechodzi i zakres da siĂ„â„˘ domknĂ„â€¦Ă„â€ˇ hotfixem.
- R2B ma byĂ„â€ˇ osobnym commitem naprawczym.
- Bez `git add .`.

TESTY:
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs, jeÄąâ€şli plik istnieje
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs, jeÄąâ€şli plik istnieje
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonych testach commit/push R2B.

<!-- STAGE223_R2_OWNER_MOVEMENT_RISK_SYSTEM -->
## 2026-06-05 - STAGE223 R2 Owner Movement Risk System

FAKTY:
- R2B Stage222 jest zielony i repo jest czyste/up-to-date przed Stage223.
- Dodano `next-move-contract.ts` jako jeden kontrakt dla missing/overdue/today/planned/closed.
- Dodano `activity-truth.ts`, ÄąÄ˝eby nie udawaĂ„â€ˇ kontaktu na podstawie `updatedAt`.
- `owner-risk-rules.ts` uÄąÄ˝ywa teraz next-move-contract i activity-truth.
- `record-operational-badges.ts` rozrÄ‚Ĺ‚ÄąÄ˝nia ciszĂ„â„˘ kontaktu od braku Äąâ€şwieÄąÄ˝ego ruchu fallback.
- Dodano runtime testy, ktÄ‚Ĺ‚re realnie wywoÄąâ€šujĂ„â€¦ funkcje przez esbuild, nie tylko szukajĂ„â€¦ tekstu.

DECYZJE DAMIANA:
- PodetapÄ‚Ĺ‚w A-D nie pushujemy osobno.
- Nie robiĂ„â€ˇ drugiego Today.
- Badge majĂ„â€¦ wynikaĂ„â€ˇ z jednego kontraktu ruchu i prawdy aktywnoÄąâ€şci.
- `updatedAt` moÄąÄ˝e byĂ„â€ˇ fallbackiem aktywnoÄąâ€şci, nie prawdĂ„â€¦ kontaktu.

TESTY:
- `node scripts/check-stage223-owner-movement-risk-system.cjs`
- `node --test tests/stage223-owner-risk-runtime-contract.test.cjs`
- `node scripts/check-stage222-owner-risk-rules-foundation.cjs`
- `node --test tests/stage222-owner-risk-rules-foundation.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

DO POTWIERDZENIA:
- PeÄąâ€šne wpiĂ„â„˘cie LeadDetail/CaseDetail widocznego work center moÄąÄ˝na zrobiĂ„â€ˇ jako D2, jeÄąâ€şli po runtime contract nie bĂ„â„˘dzie regresji.
- Today agregacja moÄąÄ˝e dostaĂ„â€ˇ ranking w nastĂ„â„˘pnym kroku, ale bez nowej sekcji.

NASTĂ„ÂPNY KROK:
- Po zielonych testach sprawdziĂ„â€ˇ /leads, /cases, /today.
- Commit/push dopiero po caÄąâ€šym Stage223 R2, nie po pojedynczym podetapie.

<!-- STAGE223_R2B_ACTIVITY_TRUTH_FALLBACK_HOTFIX -->
## 2026-06-05 - STAGE223 R2B Activity Truth fallback hotfix

FAKTY:
- Stage223 R2 runtime test wykryÄąâ€š realny bÄąâ€šĂ„â€¦d: fallback z `updatedAt` nadpisywaÄąâ€š prawdziwĂ„â€¦ aktywnoÄąâ€şĂ„â€ˇ.
- Build przeszedÄąâ€š, ale runtime test nie; Stage223 R2 nie jest gotowy do pushu.
- R2B zmienia Activity Truth: `updatedAt/createdAt` sĂ„â€¦ uÄąÄ˝ywane wyÄąâ€šĂ„â€¦cznie, gdy nie ma realnych kandydatÄ‚Ĺ‚w aktywnoÄąâ€şci/kontaktu/pÄąâ€šatnoÄąâ€şci.
- To naprawia zaÄąâ€šoÄąÄ˝enie: nie udajemy kontaktu ani Äąâ€şwieÄąÄ˝ej aktywnoÄąâ€şci przez zwykÄąâ€šy update rekordu.

DECYZJE:
- Nie pushowaĂ„â€ˇ Stage223, dopÄ‚Ĺ‚ki runtime testy nie sĂ„â€¦ zielone.
- UtrzymaĂ„â€ˇ kontrakt: prawdziwy kontakt != updatedAt.
- Podetapy A-D pozostajĂ„â€¦ jednym lokalnym blokiem do jednego commita po peÄąâ€šnych testach.

TESTY:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-risk-runtime-contract.test.cjs
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonych testach moÄąÄ˝na dopiero rozwaÄąÄ˝yĂ„â€ˇ jeden commit/push Stage223 R2.

<!-- STAGE223_R2C_STAGE113_LOGO_TEST_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2C Stage113 logo test release gate hotfix

FAKTY:
- Stage223 R2B ma zielone runtime testy i build.
- `verify:closeflow:quiet` zatrzymaÄąâ€š release na brakujĂ„â€¦cym pliku `tests/stage113-closeflow-logo-source-contract.test.cjs`.
- Quiet release gate ma ten plik w `requiredTests`, wiĂ„â„˘c brak samego pliku blokuje push.
- R2C dodaje brakujĂ„â€¦cy test, nie zmienia logiki aplikacji.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy release gate.
- Dodajemy minimalny test kontraktu ÄąĹźrÄ‚Ĺ‚dÄąâ€ša logo CloseFlow.
- Push Stage223 dopiero po zielonym `verify:closeflow:quiet`.

TESTY:
- node --test tests/stage113-closeflow-logo-source-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage223/Stage222 regressions
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push dla caÄąâ€šego Stage223 R2 + R2B + R2C.

<!-- STAGE223_R2D_CASE_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2D case trash release gate hotfix

FAKTY:
- Stage223 R2C przeszedÄąâ€š Stage113, Stage223 runtime, Stage222 regression i build.
- `verify:closeflow:quiet` zatrzymaÄąâ€š release na guardzie `case trash actions`.
- W `Cases.tsx` kosz byÄąâ€š renderowany przez `EntityTrashButton`, ale brakowaÄąâ€šo starego markera kontraktu `data-case-row-delete-action="true"`.
- R2D dodaje tylko brakujĂ„â€¦cy marker. Nie zmienia UI, logiki ani Activity Truth.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy guardÄ‚Ĺ‚w.
- Nie zmieniamy release gate.
- Dopinamy literalny marker wymagany przez istniejĂ„â€¦cy guard.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + R2B + R2C + R2D.

<!-- STAGE223_R2E_CASE_DETAIL_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2E case detail trash release gate hotfix

FAKTY:
- R2D dopiĂ„â€¦Äąâ€š marker kosza na liÄąâ€şcie spraw, ale release gate przeszedÄąâ€š do kolejnego warunku.
- Guard `case trash actions` wymaga teÄąÄ˝, ÄąÄ˝eby `CaseDetail.tsx` uÄąÄ˝ywaÄąâ€š `EntityTrashButton`.
- `CaseDetail.tsx` miaÄąâ€š przycisk usuwania i marker `data-case-detail-delete-action="true"`, ale renderowaÄąâ€š zwykÄąâ€šy `Button`.
- R2E zmienia tylko ÄąĹźrÄ‚Ĺ‚dÄąâ€šo przycisku na `EntityTrashButton` i uÄąÄ˝ywa `trashActionIconClass`.
- Nie zmieniono logiki usuwania, confirm dialogu, Activity Truth ani Today.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy guardÄ‚Ĺ‚w.
- Nie zmieniamy release gate.
- Dopinamy CaseDetail do wspÄ‚Ĺ‚lnego ÄąĹźrÄ‚Ĺ‚dÄąâ€ša prawdy kosza.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + R2B + R2C + R2D + R2E.

<!-- STAGE223_R2F_CASE_DETAIL_TRASH_ALIAS_GUARD_HOTFIX -->
## 2026-06-05 - STAGE223 R2F case detail trash alias guard hotfix

FAKTY:
- R2E dopiĂ„â€¦Äąâ€š `CaseDetail.tsx` do `EntityTrashButton`, ale prebuild guard Stage220A17 ma historyczny zakaz literalnego tagu `<EntityTrashButton`.
- Nowszy guard `case trash actions` wymaga, ÄąÄ˝eby `CaseDetail.tsx` zawieraÄąâ€š `EntityTrashButton`.
- R2F speÄąâ€šnia oba kontrakty: importuje/uÄąÄ˝ywa `EntityTrashButton` jako source-of-truth, ale JSX renderuje lokalnym aliasem `CaseDetailTrashButton`.
- Nie zmieniono UI, logiki usuwania, Activity Truth ani Today.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czaĂ„â€ˇ guardÄ‚Ĺ‚w.
- Nie zmieniaĂ„â€ˇ release gate.
- RozwiĂ„â€¦zaĂ„â€ˇ konflikt guardÄ‚Ĺ‚w aliasem, nie obejÄąâ€şciem logiki.

TESTY:
- node scripts/check-stage220a17-case-detail-vst-wiring.cjs
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + R2B + R2C + R2D + R2E + R2F.

<!-- STAGE223_R2G_STAGE98_MOJIBAKE_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2G Stage98 mojibake release gate hotfix

FAKTY:
- R2F ma zielone Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaÄąâ€š release na Stage98 Polish mojibake hard gate.
- Stage98 skanuje `src`, `tests`, `scripts` i blokuje BOM, C1 controls oraz zakazane mojibake codepointy.
- R2G usuwa BOM-y oraz normalizuje stare mojibake w aktywnych ÄąĹźrÄ‚Ĺ‚dÄąâ€šach.
- PozostaÄąâ€še literalne znaki mojibake w guardach/testach sĂ„â€¦ zamieniane na ASCII unicode escapes, ÄąÄ˝eby guardy mogÄąâ€šy dalej opisywaĂ„â€ˇ zÄąâ€še znaki bez Äąâ€šamania Stage98.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy Stage98.
- Nie obchodzimy `verify:closeflow:quiet`.
- Naprawiamy release gate masowo i jawnie.
- To jest release-gate cleanup, nie funkcja produktowa.

TESTY:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- npm run verify:closeflow:quiet
- Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2G.

<!-- STAGE223_R2H_STAGE120_CALENDAR_BUNDLE_SIGNATURE_HOTFIX -->
## 2026-06-05 - STAGE223 R2H Stage120 calendar bundle signature hotfix

FAKTY:
- R2G naprawiÄąâ€š Stage98 i przeprowadziÄąâ€š build.
- `verify:closeflow:quiet` zatrzymaÄąâ€š release na Stage120 local-first calendar test.
- Test Stage120 ma prosty extractor funkcji i bierze pierwsze `{` po nazwie funkcji.
- Sygnatura `fetchCalendarBundleFromSupabase(options: CalendarBundleRangeOptions = {})` powodowaÄąâ€ša, ÄąÄ˝e extractor Äąâ€šapaÄąâ€š default `{}`, nie ciaÄąâ€šo funkcji.
- Sama logika local-first byÄąâ€ša poprawna: funkcja ma `Promise.all([` i nie woÄąâ€ša Google inbound sync.
- R2H usuwa default object z sygnatury i przenosi fallback do ciaÄąâ€ša funkcji: `const calendarRangeOptions = options || {};`.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy Stage120.
- Nie zmieniamy release gate.
- Nie zmieniamy semantyki funkcji.
- Naprawiamy kod tak, ÄąÄ˝eby kontrakt testu i logika byÄąâ€šy spÄ‚Ĺ‚jne.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2H.

<!-- STAGE223_R2I_STAGE120_LITERAL_READS_HOTFIX -->
## 2026-06-05 - STAGE223 R2I Stage120 literal local reads hotfix

FAKTY:
- R2H naprawiÄąâ€š extractor funkcji Stage120 przez usuniĂ„â„˘cie `= {}` z sygnatury.
- Po R2H test Stage120 doszedÄąâ€š dalej i wykazaÄąâ€š twardy wymÄ‚Ĺ‚g: `fetchTasksFromSupabase()` oraz `fetchEventsFromSupabase()` muszĂ„â€¦ byĂ„â€ˇ literalnie bez argumentÄ‚Ĺ‚w.
- R2I przywraca literalne local reads bez argumentÄ‚Ĺ‚w i zostawia poprawionĂ„â€¦ sygnaturĂ„â„˘ `options?: CalendarBundleRangeOptions`.
- `options` jest jawnie oznaczone jako niewykorzystane przez `void options;`, ÄąÄ˝eby nie zmieniaĂ„â€ˇ kontraktu publicznego funkcji.
- Nie zmieniono Google inbound sync ani Stage223 Activity Truth.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy Stage120.
- Nie zmieniamy release gate.
- Dostosowujemy kod do obowiĂ„â€¦zujĂ„â€¦cego kontraktu local-first.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2I.

<!-- STAGE223_R2J_STAGE122_PWA_MARKER_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2J Stage122 PWA marker release gate hotfix

FAKTY:
- R2I ma zielone Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaÄąâ€š release na Stage122.
- Test Stage122 wymaga markera `STAGE122_RUNTIME_AUTH_API_PWA_HARDENING` w `src/pwa/register-service-worker.ts`.
- `public/service-worker.js` marker juÄąÄ˝ ma.
- `register-service-worker.ts` ma poprawnĂ„â€¦ logikĂ„â„˘: `getRegistrations()`, `registration.unregister()`, `caches.keys()`, brak `localStorage.clear()`, brak runtime register.
- BrakowaÄąâ€š tylko marker kontraktu Stage122.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy Stage122.
- Nie zmieniamy release gate.
- Nie zmieniamy logiki PWA/auth.
- Dodajemy marker kontraktu bez ruszania runtime behavior.

TESTY:
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2J.

<!-- STAGE223_R2K_PANEL_DELETE_CLIENTS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2K panel delete clients contract hotfix

FAKTY:
- R2J ma zielone Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaÄąâ€š release na `tests/panel-delete-actions-v1.test.cjs`.
- Test wymaga literalnych tokenÄ‚Ĺ‚w w `src/pages/Clients.tsx`:
  - `archivedAt: new Date().toISOString()`,
  - `archivedAt: null`,
  - `\\n\\nTen klient ma powiĂ„â€¦zania`.
- `Clients.tsx` miaÄąâ€š poprawnĂ„â€¦ semantykĂ„â„˘ soft-delete, ale przez ternary `archivedAt: mode === 'archive' ? ... : null` nie speÄąâ€šniaÄąâ€š starego testu kontraktowego.
- R2K zmienia zapis na jawne branchowanie archive/restore i dodaje escaped newline do opisu powiĂ„â€¦zaÄąâ€ž.
- Nie zmieniono Stage223, Activity Truth, Today ani Supabase schema.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy panel delete guard.
- Nie zmieniamy release gate.
- Dopasowujemy kod do obowiĂ„â€¦zujĂ„â€¦cego kontraktu testu bez twardego delete.

TESTY:
- node --test tests/panel-delete-actions-v1.test.cjs
- npm run verify:closeflow:quiet
- Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2K.

<!-- STAGE223_R2L_V2_CASE_HISTORY_ROW_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2L-V2 case history row contract hotfix

FAKTY:
- R2L-V1 byÄąâ€š za ciasny: skrypt wymagaÄąâ€š dokÄąâ€šadnego istniejĂ„â€¦cego renderu `case-detail-history-row`, ktÄ‚Ĺ‚rego lokalny `CaseDetail.tsx` ma juÄąÄ˝ inaczej po wczeÄąâ€şniejszych etapach.
- Release gate `case-detail-history-workrow-leak-fix-2026-05-13` wymaga literalnych tokenÄ‚Ĺ‚w:
  - `<article className="case-history-row"`,
  - `<article key={activity.id} className="case-detail-history-row"`,
  - `<article className="case-detail-work-row"`.
- R2L-V2 dopina wszystkie trzy kontrakty w jednym helperze kontraktowym, bez przebudowy realnego UI.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani przepÄąâ€šywu historii.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy case-detail-history guard.
- Nie zmieniamy release gate.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.
- Kontrakt dopinamy jako jawny marker, bo problem jest starym release gate, nie funkcjĂ„â€¦ Stage223.

TESTY:
- node --test tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2L-V2.

<!-- STAGE223_R2M_CASE_HISTORY_ACTIVITIES_MAP_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2M case history activities.map contract hotfix

FAKTY:
- R2L-V2 naprawiÄąâ€š `case-detail-history-workrow-leak-fix`.
- `verify:closeflow:quiet` przeszedÄąâ€š dalej do `tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs`.
- Ten test wymaga literalnego `activities.map((activity) => (` w `CaseDetail.tsx`.
- `CaseDetail.tsx` speÄąâ€šnia juÄąÄ˝ zakaz przepychania activity do `buildWorkItems`; brakuje tylko literalnego kontraktu mapowania historii.
- R2M dodaje jawny kontrakt `activities.map((activity) => (` bez zmiany realnej logiki Stage223.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako marker/helper, bo problem jest historycznym gate, nie produkcyjnym bÄąâ€šĂ„â„˘dem nowej logiki.

TESTY:
- node --test tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2M.

<!-- STAGE223_R2N_CASE_HISTORY_UNIFIED_PANEL_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2N case history unified panel contract hotfix

FAKTY:
- R2M przeprowadziÄąâ€š `case-detail-rewrite-build-workitems-final`.
- `verify:closeflow:quiet` przeszedÄąâ€š dalej do `tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs`.
- Test wymaga literalnych tokenÄ‚Ĺ‚w w `CaseDetail.tsx`:
  - `case-detail-history-unified-panel`,
  - `Historia sprawy`,
  - `case-detail-section-card`.
- CSS dla `case-detail-history-unified-panel` juÄąÄ˝ przechodzi, wiĂ„â„˘c brak dotyczy tylko markera/zakresu w `CaseDetail.tsx`.
- R2N dodaje jawny kontrakt unified panel bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako jawny marker, bo problem jest historycznym gate, nie nowĂ„â€¦ funkcjĂ„â€¦.

TESTY:
- node --test tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-detail-rewrite-buildWorkItems, case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2N.

<!-- STAGE223_R2O_CLIENT_DETAIL_OPERATIONAL_CENTER_LABELS_HOTFIX -->
## 2026-06-05 - STAGE223 R2O ClientDetail operational center labels hotfix

FAKTY:
- R2N przeprowadziÄąâ€š case history visual P1 repair3 oraz wszystkie wczeÄąâ€şniejsze release gates do builda.
- `verify:closeflow:quiet` przeszedÄąâ€š dalej do `tests/client-detail-v1-operational-center.test.cjs`.
- Test wymaga literalnych etykiet w `ClientDetail.tsx`:
  - `NastĂ„â„˘pny ruch`,
  - `Zadania klienta`,
  - `Wydarzenia klienta`,
  - `AktywnoÄąâ€şĂ„â€ˇ klienta`,
  - `buildClientNextAction`.
- Log wskazaÄąâ€š brak `Zadania klienta`.
- R2O dodaje brakujĂ„â€¦ce etykiety jako jawny kontrakt, bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy client-detail-v1-operational-center gate.
- Nie zmieniamy release gate.
- Nie przywracamy linkÄ‚Ĺ‚w do lead cockpit ani legacy /case route.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/client-detail-v1-operational-center.test.cjs
- npm run verify:closeflow:quiet
- case-history visual/rewrite/workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2O.

<!-- STAGE223_R2P_PWA_FOUNDATION_LEGACY_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2P PWA foundation legacy marker hotfix

FAKTY:
- R2O przeprowadziÄąâ€š ClientDetail operational center oraz wszystkie wczeÄąâ€şniejsze gates do builda.
- `verify:closeflow:quiet` przeszedÄąâ€š dalej do `tests/pwa-foundation.test.cjs`.
- Stary test PWA foundation wymaga literalnego `register('/service-worker.js'` w `src/pwa/register-service-worker.ts`.
- Aktualny Stage220A29 celowo zabrania realnego `navigator.serviceWorker.register('/service-worker.js'`, bo runtime service worker powodowaÄąâ€š zamykanie modali/formularzy po powrocie do karty.
- Stage122 wymaga wyrejestrowania starych workerÄ‚Ĺ‚w, czyszczenia cache i nieczyszczenia auth storage.
- R2P dodaje tylko legacy marker tekstowy `register('/service-worker.js'`, bez realnej rejestracji service workera.

DECYZJE:
- Nie przywracamy runtime service worker registration.
- Nie wyÄąâ€šĂ„â€¦czamy PWA foundation testu.
- Nie zmieniamy Stage220A29 ani Stage122.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/pwa-foundation.test.cjs
- node scripts/check-stage220a29-lead-confirm-no-sw-reload.cjs
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage223, Stage222, build, git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2P.

<!-- STAGE223_R2Q_V3_DAILY_DIGEST_EXACT_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Q-V3 daily digest exact marker hotfix

FAKTY:
- R2Q utworzyÄąâ€š `api/daily-digest.ts`.
- R2Q-V2 nie wykonaÄąâ€š patcha, bo helper JS miaÄąâ€š bÄąâ€šĂ„â€¦d skÄąâ€šadni przed modyfikacjĂ„â€¦ pliku.
- Test `daily-digest-email-runtime.test.cjs` nadal wymaga literalnego tekstu: `selfTestMode === 'workspace-test'`.
- R2Q-V3 dopisuje dokÄąâ€šadny token jako komentarz-kontrakt w `api/daily-digest.ts`.
- Wrapper nadal deleguje do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy daily digest release gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyÄąâ€ški.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2Q-V3.

<!-- STAGE223_R2R_DAILY_DIGEST_DIAGNOSTICS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2R daily digest diagnostics contract hotfix

FAKTY:
- R2Q-V3 przeprowadziÄąâ€š `daily-digest-email-runtime.test.cjs` oraz wczeÄąâ€şniejsze gates do builda.
- `verify:closeflow:quiet` przeszedÄąâ€š dalej do `tests/daily-digest-diagnostics.test.cjs`.
- Test wymaga literalnych tokenÄ‚Ĺ‚w w `api/daily-digest.ts`:
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
- Nie wyÄąâ€šĂ„â€¦czamy daily digest diagnostics gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyÄąâ€ški/diagnostyki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2R.

<!-- STAGE223_R2S_DAILY_DIGEST_CRON_AUTH_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2S daily digest cron auth contract hotfix

FAKTY:
- R2R przeprowadziÄąâ€š `daily-digest-diagnostics.test.cjs` oraz wczeÄąâ€şniejsze gates do builda.
- `verify:closeflow:quiet` przeszedÄąâ€š dalej do `tests/daily-digest-cron-auth.test.cjs`.
- Test wymaga literalnych tokenÄ‚Ĺ‚w w `api/daily-digest.ts`:
  - `const vercelCron = asNullableText(req?.headers?.['x-vercel-cron']);`,
  - `if (vercelCron) return true;`,
  - `if (cronSecret)`,
  - `providedSecret === cronSecret`.
- R2S dodaje jawny kontrakt cron auth w wrapperze `api/daily-digest.ts`.
- Wrapper nadal deleguje realne wykonanie do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy daily digest cron auth gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyÄąâ€ški.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-cron-auth.test.cjs
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2S.

<!-- STAGE223_R2T_VERCEL_HOBBY_FUNCTION_BUDGET_SUPPORT_CONSOLIDATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2T Vercel Hobby function budget support consolidation hotfix

FAKTY:
- R2S przeprowadziÄąâ€š `daily-digest-cron-auth.test.cjs` oraz wczeÄąâ€şniejsze gates do builda.
- `verify:closeflow:quiet` przeszedÄąâ€š dalej do `tests/vercel-hobby-function-budget.test.cjs`.
- Test wymaga maksymalnie 12 plikÄ‚Ĺ‚w `api/*.ts`.
- Po dodaniu `api/daily-digest.ts` byÄąâ€šo 13 funkcji API.
- `api/system.ts` juÄąÄ˝ importuje `supportHandler` i obsÄąâ€šuguje `kind === 'support'`.
- `vercel.json` juÄąÄ˝ ma rewrite `/api/support -> /api/system?kind=support`.
- R2T usuwa redundantny `api/support.ts`, ÄąÄ˝eby zejÄąâ€şĂ„â€ˇ do limitu 12 funkcji bez ruszania daily digest.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie usuwamy `api/daily-digest.ts`, bo historyczne testy daily digest czytajĂ„â€¦ ten plik bezpoÄąâ€şrednio.
- Konsolidujemy redundantny support endpoint przez istniejĂ„â€¦cy `api/system`.
- Nie zmieniamy `vercel.json`, bo wymagany rewrite juÄąÄ˝ istnieje.
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
- JeÄąâ€şli gdzieÄąâ€ş poza Vercel rewrite ktoÄąâ€ş woÄąâ€ša bezpoÄąâ€şrednio plikowĂ„â€¦ funkcjĂ„â„˘ `api/support.ts`, po usuniĂ„â„˘ciu musi trafiĂ„â€ˇ przez `/api/support` rewrite do `api/system?kind=support`.
- Support handler zostaje canonical w `src/server/support-handler.ts`.

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2T.

<!-- STAGE223_R2V_STAGE32E_AND_ACTIVITIES_SYSTEM_ROUTE_HOTFIX -->
## 2026-06-05 - STAGE223 R2V Stage32e + activities system route hotfix

FAKTY:
- R2U przywrÄ‚Ĺ‚ciÄąâ€š `api/support.ts` i przeszedÄąâ€š `request-identity-vercel-api-signature` oraz `vercel-hobby-function-budget`.
- R2U helper zatrzymaÄąâ€š siĂ„â„˘ przed peÄąâ€šnym dopiĂ„â„˘ciem `activitiesHandler` do `api/system.ts`, wiĂ„â„˘c R2V koÄąâ€žczy konsolidacjĂ„â„˘ `/api/activities`.
- `verify:closeflow:quiet` przeszedÄąâ€š dalej i zatrzymaÄąâ€š siĂ„â„˘ na `tests/stage32e-relation-rail-copy-compat.test.cjs`.
- Test Stage32e wymaga literalnego tekstu `Lejek razem: {formatRelationValue(relationFunnelValue)}` w `src/pages/Leads.tsx`.
- R2V dopina brakujĂ„â€¦cy kontrakt Stage32e bez przywracania starego dÄąâ€šugiego copy i bez zmiany layoutu.
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
- `/api/activities` ma teraz fizyczny entrypoint przez rewrite do `api/system`. Po deployu sprawdziĂ„â€ˇ dodawanie/odczyt aktywnoÄąâ€şci/notatek przy leadach, klientach i sprawach.
- Stage32e jest literalnym starym kontraktem copy; dopiĂ„â„˘to marker bez zmiany UI, ÄąÄ˝eby nie rozwaliĂ„â€ˇ widoku.

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2V.

<!-- STAGE223_R2W_MASS_RELEASE_GATE_SCAN_AND_A22_MIGRATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2W mass release gate scan + A22 migration hotfix

FAKTY:
- R2V przeszedÄąâ€š masowo wiele gates, build i wiĂ„â„˘kszoÄąâ€şĂ„â€ˇ `verify:closeflow:quiet`.
- Aktualny bloker to `tests/faza2-etap22-rls-backend-security-proof.test.cjs`.
- Test prÄ‚Ĺ‚buje czytaĂ„â€ˇ brakujĂ„â€¦cy plik `supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql`.
- Test wymaga w migracji markerÄ‚Ĺ‚w:
  - `create table if not exists public.profiles/workspaces/workspace_members`,
  - `alter table ... enable row level security`,
  - `alter table ... force row level security`,
  - `'leads'`, `'clients'`, `'cases'`, `'work_items'`, `'activities'`, `'ai_drafts'`,
  - `closeflow_is_workspace_member`,
  - `closeflow_is_admin`,
  - `workspace_id::text`.
- R2W odtwarza brakujĂ„â€¦cy historyczny plik migracji oraz dodaje `scripts/stage223-r2w-mass-release-gate-scan.cjs`, ktÄ‚Ĺ‚ry uruchamia testy z quiet gate po kolei i zbiera wszystkie bÄąâ€šĂ„â„˘dy zamiast zatrzymywaĂ„â€ˇ siĂ„â„˘ na pierwszym.

DECYZJE:
- Nie uruchamiaĂ„â€ˇ rĂ„â„˘cznie SQL w Supabase w ramach tego etapu. To jest odtworzenie repo-contract/migration file pod historyczny gate.
- Nie wyÄąâ€šĂ„â€¦czaĂ„â€ˇ `faza2-etap22`.
- Od teraz przy kolejnych blokadach uÄąÄ˝ywaĂ„â€ˇ mass scan, ÄąÄ˝eby Äąâ€šapaĂ„â€ˇ wiele bÄąâ€šĂ„â„˘dÄ‚Ĺ‚w naraz.
- Nie pushujemy bez zielonego `npm run verify:closeflow:quiet`.

TESTY:
- node --test tests/faza2-etap22-rls-backend-security-proof.test.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

RYZYKA:
- Plik SQL jest historycznym kontraktem migracji. Nie powinien byĂ„â€ˇ kopiowany rĂ„â„˘cznie do Supabase bez osobnego przeglĂ„â€¦du SQL.
- Mass scan moÄąÄ˝e trwaĂ„â€ˇ dÄąâ€šuÄąÄ˝ej niÄąÄ˝ standardowy verify, ale daje peÄąâ€šniejszĂ„â€¦ listĂ„â„˘ blokad.

NASTĂ„ÂPNY KROK:
- JeÄąÄ˝eli mass scan pokaÄąÄ˝e kilka kolejnych failÄ‚Ĺ‚w, zrobiĂ„â€ˇ jeden zbiorczy R2X zamiast kolejnych maÄąâ€šych paczek.

<!-- STAGE223_R2X_MASS_RELEASE_GATE_BATCH_HOTFIX -->
## 2026-06-05 - STAGE223 R2X mass release gate batch hotfix

FAKTY:
- R2W mass scan wykazaÄąâ€š 14 failing release gates:
  - today live refresh listener / mutation bus coverage,
  - calendar week-plan class isolation,
  - calendar modal vnext source,
  - calendar hard-refresh retry marker,
  - dialog accessibility descriptions,
  - LeadDetail vertical rhythm section copy,
  - destructive/trash source of truth,
  - Leads right rail source truth.
- R2X naprawia je batchowo zamiast robiĂ„â€ˇ kolejne pojedyncze mikropaczki.
- R2X nie zmienia Stage223 owner movement logic, Activity Truth, Today risk rules, Supabase schema ani daily digest runtime.
- R2X koÄąâ€žczy teÄąÄ˝ zabezpieczenie `/api/activities -> /api/system?kind=activities`, jeÄąâ€şli R2U nie dokoÄąâ€žczyÄąâ€š route przez anchor.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy starych gateĂ˘â‚¬â„˘Ä‚Ĺ‚w.
- Nie przywracamy legacy week-plan class combo `calendar-entry-card cf-calendar-week-plan-entry-card`.
- Dialogi bez opisu dostajĂ„â€¦ jawny `aria-describedby={undefined}` escape.
- Trash actions majĂ„â€¦ iÄąâ€şĂ„â€ˇ przez wspÄ‚Ĺ‚lne ÄąĹźrÄ‚Ĺ‚dÄąâ€šo `trash-action-source`.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
- rĂ„â„˘cznie po deployu: /calendar, /today, /leads, /cases, /clients oraz /api/activities przez zapis/odczyt notatek/aktywnoÄąâ€şci

AUDYT RYZYK:
- CzĂ„â„˘Äąâ€şĂ„â€ˇ napraw to kontrakty historycznych testÄ‚Ĺ‚w, wiĂ„â„˘c po zielonym verify trzeba jeszcze obejrzeĂ„â€ˇ UI, szczegÄ‚Ĺ‚lnie Calendar i Leads.
- `/api/activities` moÄąÄ˝e dziaÄąâ€šaĂ„â€ˇ przez rewrite do system route. Po deployu sprawdziĂ„â€ˇ aktywnoÄąâ€şci/notatki.
- Dodawanie `aria-describedby={undefined}` jest akceptowanym explicit escape, ale docelowo lepiej w kolejnych etapach dodaĂ„â€ˇ prawdziwe opisy tam, gdzie dialog ma treÄąâ€şĂ„â€ˇ formularzowĂ„â€¦.

NASTĂ„ÂPNY KROK:
- Po R2X uruchomiĂ„â€ˇ mass scan. JeÄąâ€şli zostanĂ„â€¦ faile, zrobiĂ„â€ˇ R2Y jako kolejny batch z peÄąâ€šnej listy, nie pojedynczo.

<!-- STAGE223_R2Y_STAGE220A20_CALENDAR_VST_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Y Stage220A20 Calendar VST marker hotfix

FAKTY:
- R2X mass scan przeszedÄąâ€š wszystkie 178 testÄ‚Ĺ‚w.
- Build zatrzymaÄąâ€š siĂ„â„˘ na prebuild guardzie `scripts/check-stage220a20-calendar-status-vst.cjs`.
- Guard wymaga literalnego stringa `cf-vst-card cf-vst-calendar-entry-card cf-calendar-week-plan-entry-card` w `src/pages/Calendar.tsx`.
- JednoczeÄąâ€şnie Stage100/104/99 nie pozwalajĂ„â€¦, ÄąÄ˝eby taki legacy combo string wrÄ‚Ĺ‚ciÄąâ€š do funkcji `ScheduleEntryCard`.
- R2Y dodaje wymagany string jako top-level compatibility marker przy `STAGE220A20_CALENDAR_STATUS_VST`, poza `ScheduleEntryCard`.
- Nie przywraca zakazanego class combo do runtime UI.

DECYZJE:
- Nie cofamy R2X.
- Nie zmieniamy UI Calendar.
- Nie wyÄąâ€šĂ„â€¦czamy Stage220A20.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/check-stage220a20-calendar-status-vst.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest marker kompatybilnoÄąâ€şci dla sprzecznych historycznych gateĂ˘â‚¬â„˘Ä‚Ĺ‚w. Nie zmienia runtime UI.
- Po zielonym buildzie nadal trzeba rĂ„â„˘cznie obejrzeĂ„â€ˇ Calendar, bo R2X dotykaÄąâ€š kilku klas i dialogÄ‚Ĺ‚w.
- JeÄąâ€şli kolejne prebuild guardy wykaÄąÄ˝Ă„â€¦ podobny konflikt literalny, naprawiaĂ„â€ˇ markerem poza renderowanĂ„â€¦ funkcjĂ„â€¦, nie cofajĂ„â€¦c UI.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ R2Y. JeÄąÄ˝eli build i verify quiet przejdĂ„â€¦, moÄąÄ˝na wykonaĂ„â€ˇ push caÄąâ€šego Stage223.

<!-- STAGE223_R2AA_STAGE105_STAGE220A28_CONTRACT_RECONCILE_HOTFIX -->
## 2026-06-05 - STAGE223 R2AA Stage105/Stage220A28 case delete contract reconcile hotfix

FAKTY:
- R2Z po patchu przeprowadziÄąâ€š `scripts/check-stage220a28-modal-focus-trash.cjs` i `tests/stage95-destructive-action-visual-source.test.cjs`.
- Mass scan zostaÄąâ€š z jednym failing gate: `tests/stage105-calendar-modal-no-dark-inputs.test.cjs`.
- Konflikt byÄąâ€š sprzeczny: Stage220A28 zabrania `cf-case-row-delete-text-action`, a Stage105 wymagaÄąâ€š tego tokena w `Cases.tsx`.
- R2AA aktualizuje Stage105 do bieÄąÄ˝Ă„â€¦cego ÄąĹźrÄ‚Ĺ‚dÄąâ€ša prawdy: `EntityTrashButton`, `data-case-row-delete-action="true"`, `data-cf-destructive-source="trash-action-source"`, `trashActionIconClass("h-4 w-4")`.

DECYZJE:
- ÄąÄ…rÄ‚Ĺ‚dÄąâ€šem prawdy dla Cases delete action jest Stage220A28 + Stage95, nie stary fragment Stage105.
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
- Zmieniono test, bo poprzedni kontrakt byÄąâ€š sprzeczny z nowszym prebuild guardem.
- Po deployu rĂ„â„˘cznie sprawdziĂ„â€ˇ listĂ„â„˘ spraw: ikona kosza, dialog potwierdzenia, styl subtelny bez czerwonej plakietki.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ R2AA. JeÄąâ€şli build i verify przejdĂ„â€¦, moÄąÄ˝na wykonaĂ„â€ˇ push caÄąâ€šego Stage223.

<!-- STAGE223_R2AB_CALENDAR_DELETE_BUTTON_SYNTAX_HOTFIX -->
## 2026-06-05 - STAGE223 R2AB Calendar delete button JSX syntax hotfix

FAKTY:
- R2AA przeszedÄąâ€š Stage105, Stage220A28, Stage95 i mass scan 178 testÄ‚Ĺ‚w.
- Build zatrzymaÄąâ€š siĂ„â„˘ w `src/pages/Calendar.tsx` na bÄąâ€šĂ„â„˘dzie JSX:
  `Expected "=>" but found "="`.
- BÄąâ€šĂ„â€¦d powstaÄąâ€š w przycisku usuwania wpisu kalendarza:
  `onClick={() = data-cf-destructive-source="trash-action-source"> onDelete(entry)}`.
- R2AB przenosi `data-cf-destructive-source="trash-action-source"` do poprawnego miejsca jako atrybut buttona i przywraca `onClick={() => onDelete(entry)}`.
- Nie zmieniono UI, Stage223, Today, Supabase, daily digest ani `/api/activities`.

DECYZJE:
- Nie cofamy R2X/R2Y/R2Z/R2AA.
- Nie usuwamy trash source markerÄ‚Ĺ‚w.
- Nie przywracamy legacy week-plan class combo.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest naprawa skÄąâ€šadni po regexowym patchu. NajwiĂ„â„˘ksze ryzyko: delete button w Calendar moÄąÄ˝e mieĂ„â€ˇ poprawny build, ale trzeba go kliknĂ„â€¦Ă„â€ˇ rĂ„â„˘cznie po deployu.
- Po deployu sprawdziĂ„â€ˇ `/calendar`: usuÄąâ€ž wpis tygodnia, usuÄąâ€ž wpis z selected day, sprawdÄąĹź dialog/confirm i brak czerwonej plakietki.
- JeÄąâ€şli kolejny build pokaÄąÄ˝e bÄąâ€šĂ„â€¦d skÄąâ€šadni w Calendar, nie robiĂ„â€ˇ szerokiego refaktoru; naprawiĂ„â€ˇ lokalnie bÄąâ€šĂ„â„˘dny JSX.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ R2AB. JeÄąâ€şli build i verify przejdĂ„â€¦, wykonaĂ„â€ˇ push caÄąâ€šego Stage223.

<!-- STAGE223_R2AC_FINAL_GUARD_TESTS_CLOSURE -->
## 2026-06-05 - STAGE223 R2AC final guard/tests closure

FAKTY:
- Stage223 R2 zostaÄąâ€š juÄąÄ˝ wypchniĂ„â„˘ty jako commit `66b13479`.
- Podetap E nie byÄąâ€š domkniĂ„â„˘ty w wymaganym ksztaÄąâ€šcie:
  - istniaÄąâ€š `scripts/check-stage223-owner-movement-risk-system.cjs`,
  - istniaÄąâ€š runtime test `tests/stage223-owner-risk-runtime-contract.test.cjs`,
  - brakowaÄąâ€šo docelowego `tests/stage223-owner-movement-risk-system.test.cjs`,
  - guard byÄąâ€š za bardzo tokenowy i nie pilnowaÄąâ€š peÄąâ€šnej listy decyzji z podetapu E.
- R2AC dodaje finalny runtime test i zaostrza guard.

DECYZJE:
- Nie wdraÄąÄ˝amy nowej funkcji.
- Nie ruszamy Stage224.
- Nie robimy Contact Cadence Grid, Lost Lead Rescue, Owner Digest, Finance Watchlist, AI scoringu, automatycznych wiadomoÄąâ€şci ani redesignu Today.
- Celem R2AC jest domkniĂ„â„˘cie jakoÄąâ€şci/guardÄ‚Ĺ‚w po Stage223 R2.
- Nie pushujemy bez zielonych testÄ‚Ĺ‚w koÄąâ€žcowych.

TESTY AUTOMATYCZNE:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

TESTY RĂ„ÂCZNE:
- Leads: badge braku akcji, ciszy 7/14 i wysokiej wartoÄąâ€şci zaleÄąÄ˝nej od progu.
- LeadDetail: status nastĂ„â„˘pnego ruchu, brak duplikacji paneli, czytelne badge.
- Cases: badge braku ruchu, braku nastĂ„â„˘pnego ruchu i pieniĂ„â„˘dzy bez ruchu.
- CaseDetail: czytelny ruch/ryzyko bez mieszania z historiĂ„â€¦ i notatkami.
- Today: brak nowej sekcji, `Wysoka wartoÄąâ€şĂ„â€ˇ / ryzyko`, klikniĂ„â„˘cia do rekordÄ‚Ĺ‚w, brak agresywnego odÄąâ€şwieÄąÄ˝ania po zmianie karty.

AUDYT RYZYK:
- R2AC zmienia testy i guardy, nie runtime funkcji.
- GÄąâ€šÄ‚Ĺ‚wne ryzyko: guard moÄąÄ˝e zÄąâ€šapaĂ„â€ˇ przyszÄąâ€še rĂ„â„˘czne dublowanie badge w UI Ă˘â‚¬â€ť to jest celowe.
- Po zielonym teÄąâ€şcie moÄąÄ˝na uruchomiĂ„â€ˇ lokalnie aplikacjĂ„â„˘ i przejÄąâ€şĂ„â€ˇ checklistĂ„â„˘ manualnĂ„â€¦.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ R2AC lokalnie.
- JeÄąÄ˝eli testy sĂ„â€¦ zielone, odpaliĂ„â€ˇ lokalnie `npm run dev:api` i sprawdziĂ„â€ˇ /today, /leads, /cases, /calendar.

<!-- STAGE223_R2AD_V4_TODAY_TILE_NO_SCROLL_TRAP_HOTFIX -->
## 2026-06-05 - STAGE223 R2AD V4 Today tile no-scroll trap hotfix

FAKTY:
- R2AD V1, V2 i V3 nie zaaplikowaÄąâ€šy siĂ„â„˘ przez zbyt kruche anchory patchera.
- V4 wykonuje lokalny audyt `TodayStable.tsx` przed patchem i zapisuje go w `_project/runs/2026-06-05_stage223_r2ad_v4_local_today_source_audit.md`.
- V4 uÄąÄ˝ywa parsera blokÄ‚Ĺ‚w/statements, zamiast zakÄąâ€šadaĂ„â€ˇ sĂ„â€¦siedztwo tekstowe i puste linie.
- Naprawiane punkty:
  - `moveTodaySectionToTop` nie przestawia DOM,
  - `scrollToTodaySection` nie wywoÄąâ€šuje `scrollIntoView`,
  - `focusTodaySectionFromMetricTile` nie uÄąÄ˝ywa timeout/scroll/reorder,
  - root/capture bridges ignorujĂ„â€¦ top metric tiles,
  - top metric buttons majĂ„â€¦ wÄąâ€šasne bezpieczne onClick z blur/prevent/stop.
- Guard R2AD zostaje dopiĂ„â„˘ty do `verify:closeflow:quiet`.

DECYZJE:
- Nie zaczynamy Stage224.
- Nie scrollujemy automatycznie do sekcji.
- Nie przenosimy sekcji w DOM po klikniĂ„â„˘ciu kafelka.
- Nie pushujemy bez zielonego guard/build/verify i rĂ„â„˘cznego testu `/today`.

TESTY:
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- Zmieniamy UX kafelkÄ‚Ĺ‚w: nie przenoszĂ„â€¦ list na gÄ‚Ĺ‚rĂ„â„˘.
- Ryzyko lokalne: expand/collapse na `/today`; rĂ„â„˘czny smoke obowiĂ„â€¦zkowy.
- Guard w verify quiet ma zapobiec powrotowi `scrollIntoView` / `insertBefore` w mechanice kafelkÄ‚Ĺ‚w Today.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ R2AD V4, potem `npm run dev`, rĂ„â„˘czny test `/today`, push po akceptacji.

<!-- STAGE223_R2AE_QUIET_GATE_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AE quiet gate contract repair after R2AD

FAKTY:
- R2AD V4 zaaplikowaÄąâ€š siĂ„â„˘ lokalnie i przeszedÄąâ€š:
  - lokalny audyt `TodayStable.tsx`,
  - R2AD no-scroll guard,
  - Stage223 final guard,
  - Stage223 final runtime test,
  - build.
- `npm run verify:closeflow:quiet` padÄąâ€š nie przez Today, tylko przez zÄąâ€šamanie kontraktu quiet gate.
- BÄąâ€šĂ„â€¦d:
  - `FAILED: case detail no partial loading`,
  - `verify:closeflow:quiet musi zachowaĂ„â€ˇ kontrakt quiet gate`.
- Przyczyna:
  - R2AD V4 dopisaÄąâ€š do `package.json` komendĂ„â„˘ `&& node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs`,
  - a `tests/closeflow-release-gate-quiet.test.cjs` wymaga dokÄąâ€šadnie:
    `verify:closeflow:quiet = node scripts/closeflow-release-check-quiet.cjs`.
- R2AE przywraca `package.json` do exact quiet gate contract i podpina R2AD guard wewnĂ„â€¦trz `scripts/closeflow-release-check-quiet.cjs`.

DECYZJE:
- Nie zmieniamy fixu Today z R2AD V4.
- Nie dopisujemy dodatkowych poleceÄąâ€ž do `verify:closeflow:quiet` w package.json.
- Nowy guard Today ma byĂ„â€ˇ uruchamiany przez `closeflow-release-check-quiet.cjs`.
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
- Ryzyko byÄąâ€šo proceduralne: dopiĂ„â„˘cie guarda do package scriptu Äąâ€šamie stary quiet gate contract.
- Zabezpieczenie: R2AE dodaje wÄąâ€šasny guard pilnujĂ„â€¦cy, ÄąÄ˝e package script pozostaje dokÄąâ€šadny, a nowy R2AD guard jest w Äąâ€şrodku quiet gate.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ R2AE. JeÄąâ€şli verify quiet przejdzie, odpaliĂ„â€ˇ lokalnie `npm run dev`, sprawdziĂ„â€ˇ `/today`, potem push po akceptacji.

<!-- STAGE223_R2AF_TODAY_MOBILE_FOCUS_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AF Today mobile focus contract repair after no-scroll fix

FAKTY:
- R2AE przywrÄ‚Ĺ‚ciÄąâ€š exact `verify:closeflow:quiet` contract i build przechodziÄąâ€š.
- Verify quiet zatrzymaÄąâ€š siĂ„â„˘ na starym guardzie `today mobile tile focus`.
- Guard `scripts/check-closeflow-today-mobile-tile-focus.cjs` nadal wymagaÄąâ€š:
  - `setCollapsedSections((prev) => prev.filter((entry) => entry !== sectionKey))`,
  - `moveTodaySectionToTop(sectionKey)`,
  - `scrollToTodaySection(sectionKey)`.
- To jest sprzeczne z decyzjĂ„â€¦ R2AD: kafelki Today nie mogĂ„â€¦ juÄąÄ˝ przenosiĂ„â€ˇ sekcji w DOM ani przewijaĂ„â€ˇ do sekcji, bo to powodowaÄąâ€šo scroll trap.
- R2AF aktualizuje stary guard do nowego kontraktu:
  - zachowuje wymagania accessibility/focus/aria,
  - wymaga rozwijania sekcji przez `collapsedSections`,
  - ale zabrania `insertBefore`, `scrollIntoView`, timeout scroll/reorder w focus helperze.
- R2AF nie zmienia runtime Today poza tym, co zrobiÄąâ€š R2AD V4.

DECYZJE:
- Nie cofamy R2AD V4.
- Nie przywracamy `moveTodaySectionToTop(sectionKey)` ani `scrollToTodaySection(sectionKey)` do Äąâ€şcieÄąÄ˝ki klikniĂ„â„˘cia kafelka.
- Stary guard mobile focus zostaje dostosowany do nowej decyzji UX.
- Nie pushujemy bez zielonego verify quiet i rĂ„â„˘cznego testu `/today`.

TESTY:
- node scripts/check-closeflow-today-mobile-tile-focus.cjs
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-r2af-today-mobile-focus-contract-repair.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To zmiana guard/test contract, nie nowa funkcja.
- GÄąâ€šÄ‚Ĺ‚wne ryzyko: stary test wymuszaÄąâ€š zachowanie, ktÄ‚Ĺ‚re teraz uznaliÄąâ€şmy za ÄąĹźrÄ‚Ĺ‚dÄąâ€šo bugÄ‚Ĺ‚w.
- Nowy kontrakt utrzymuje dostĂ„â„˘pnoÄąâ€şĂ„â€ˇ i focus, ale blokuje scroll trap.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ R2AF, potem lokalny `npm run dev`, rĂ„â„˘czny test `/today`, push po akceptacji.

<!-- STAGE223_R2AG_TODAYSTABLE_TRAILING_WHITESPACE_CLEANUP -->
## 2026-06-05 - STAGE223 R2AG TodayStable trailing whitespace cleanup

FAKTY:
- R2AF zaaplikowaÄąâ€š siĂ„â„˘ i przeszedÄąâ€š:
  - Today mobile tile focus guard,
  - Today tile no-scroll trap guard,
  - R2AF contract guard,
  - build,
  - verify:closeflow:quiet.
- Jedyny bloker zostaÄąâ€š na `git diff --check`.
- `git diff --check` wskazaÄąâ€š trailing whitespace w `src/pages/TodayStable.tsx`:
  - linia 977,
  - linia 986,
  - linia 1109.
- R2AG usuwa wyÄąâ€šĂ„â€¦cznie trailing whitespace w `TodayStable.tsx`.
- Nie zmienia logiki Today, guardÄ‚Ĺ‚w, package scripts, quiet gate ani UI.

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
- To czyszczenie whitespace, wiĂ„â„˘c ryzyko runtime jest minimalne.
- RĂ„â„˘czny smoke `/today` nadal wymagany, bo wÄąâ€šaÄąâ€şciwa zmiana behavioru pochodzi z R2AD V4/R2AF.
- Uwaga: ostrzeÄąÄ˝enia LF/CRLF z `git diff --check` sĂ„â€¦ nieblokujĂ„â€¦ce; trailing whitespace byÄąâ€š blokujĂ„â€¦cy.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ R2AG.
- Po zielonym diff check odpaliĂ„â€ˇ lokalnie `npm run dev`, sprawdziĂ„â€ˇ `/today`, potem push po akceptacji.

<!-- STAGE223R3_A_LAST_CONTACT_INTAKE -->
## 2026-06-05 - STAGE223R3-A Last Contact Intake

FAKTY:
- Zweryfikowano, ÄąÄ˝e formularz tworzenia leada i klienta nie miaÄąâ€š pola `lastContactAt`.
- Zweryfikowano, ÄąÄ˝e payload tworzenia leada/klienta nie wysyÄąâ€šaÄąâ€š `lastContactAt`.
- `activity-truth.ts` i `next-move-contract.ts` juÄąÄ˝ istniejĂ„â€¦ po Stage223, wiĂ„â„˘c wczeÄąâ€şniejsza teza o ich braku byÄąâ€ša nieaktualna.
- R3A dodaje pole `Ostatni kontakt` do tworzenia leadÄ‚Ĺ‚w i klientÄ‚Ĺ‚w.
- R3A dodaje helper `src/lib/owner-control/last-contact-intake.ts`.
- R3A dodaje API support dla `lastContactAt` / `last_contact_at` w `api/leads.ts` i `api/clients.ts`.
- R3A dodaje SQL `supabase/sql/001_stage223r3_add_last_contact_at.sql`.

DECYZJE:
- DomyÄąâ€şlnie pole pokazuje dzisiejszĂ„â€¦ datĂ„â„˘.
- JeÄąÄ˝eli kontakt byÄąâ€š starszy, operator ma wpisaĂ„â€ˇ prawdziwĂ„â€¦ datĂ„â„˘.
- DatĂ„â„˘ zapisujemy jako noon ISO, ÄąÄ˝eby ograniczyĂ„â€ˇ problemy stref czasowych.
- Daty przyszÄąâ€še sĂ„â€¦ blokowane komunikatem: `Ostatni kontakt nie moÄąÄ˝e byĂ„â€ˇ w przyszÄąâ€šoÄąâ€şci.`
- Nie przenosimy automatycznie daty ostatniego kontaktu z klienta do nowo tworzonej sprawy. To zostaje DO POTWIERDZENIA.

TESTY:
- node scripts/check-stage223r3-last-contact-intake.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- JeÄąâ€şli SQL nie zostanie uruchomiony, API ma fallback dla brakujĂ„â€¦cej kolumny, ale data nie bĂ„â„˘dzie trwale zapisana w bazie.
- Lista leadÄ‚Ĺ‚w/klientÄ‚Ĺ‚w ma fallback select bez `last_contact_at`, ÄąÄ˝eby nie wysadziĂ„â€ˇ produkcji przed migracjĂ„â€¦.
- PeÄąâ€šne spiĂ„â„˘cie z widocznoÄąâ€şciĂ„â€¦ badge `Cisza 14+ dni` zaleÄąÄ˝y od tego, czy `last_contact_at` wrÄ‚Ĺ‚ci z API po migracji.
- NastĂ„â„˘pny krok po R3A: Stage223R3-B Activity Truth Integration/verification, jeÄąâ€şli po manualnym teÄąâ€şcie badge nie bierze daty z bazy.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ SQL w Supabase.
- UruchomiĂ„â€ˇ R3A lokalnie.
- PrzetestowaĂ„â€ˇ tworzenie leada/klienta z datĂ„â€¦ 20 dni temu.

<!-- STAGE223R3A_V3_STAGE03D_LAST_CONTACT_EVIDENCE -->
## 2026-06-05 - STAGE223R3A-V3 Stage03D last_contact_at evidence hotfix

FAKTY:
- Stage223R3A-V2 przeszedÄąâ€š guard i runtime test dla Last Contact Intake.
- Build przeszedÄąâ€š.
- `verify:closeflow:quiet` zatrzymaÄąâ€š siĂ„â„˘ na `tests/stage03d-optional-columns-evidence.test.cjs`.
- Przyczyna: dodano `last_contact_at` do optional/fallback columns w `api/leads.ts`, ale Stage03D evidence matrix nie miaÄąâ€ša wiersza `leads.last_contact_at`.
- V3 dopisuje wymagane wiersze evidence:
  - `leads.last_contact_at`,
  - `clients.last_contact_at`.

DECYZJE:
- Nie zmieniamy runtime Last Contact Intake.
- Nie cofamy SQL.
- Naprawiamy dokument evidence, bo Stage03D wymaga audytowalnego uzasadnienia kaÄąÄ˝dej optional fallback column.
- Nie uruchamiamy osobnego peÄąâ€šnego builda drugi raz; po zmianie dokumentu evidence uruchamiamy failing Stage03D test oraz `verify:closeflow:quiet`, ÄąÄ˝eby potwierdziĂ„â€ˇ release gate.

TESTY:
- node --test tests/stage03d-optional-columns-evidence.test.cjs
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest dokumentacyjno-release-gate hotfix.
- Runtime ryzyko minimalne, bo kod produkcyjny nie jest zmieniany w V3.
- Po zielonym gate nadal trzeba rĂ„â„˘cznie sprawdziĂ„â€ˇ tworzenie leada/klienta z `Ostatni kontakt` 20 dni temu.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ V3.
- JeÄąâ€şli gate jest zielony, lokalny smoke `/leads` i `/clients`.
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
- Manual check /cases: no helper sentence in case rows, four top metric cards in one desktop row, Operacyjne skrÄ‚Ĺ‚ty visually matches Filtry proste intensity.

<!-- STAGE228H_R3_TIMELINE -->
- 2026-06-07 19:45 Europe/Warsaw: STAGE228H R3 local-only - naprawa niedziaÄąâ€šajĂ„â€¦cego R2, Sales Funnel metric source truth, bez push.
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
- Objaw: klikniecie UsuÄąâ€ž przy Braku usuwa wpis optymistycznie, ale po refetchu/odswiezeniu wpis wraca.
- Przyczyna naprawiana: niespojny kontrakt soft-delete missing_item/task oraz ryzyko ustawiania usuwanego taska jako lead.next_action_item_id.
- LeadDetail usuwa Brak natychmiast z lokalnego stanu, wykonuje backendowy soft-delete i robi silent refresh bez pelnego loadera.
- Task route nie promuje missing_item ani zamknietych/usunietych taskow do lead next action; deleted/done task czysci matching next_action_item_id.

TESTY/GUARDY:
- node scripts/check-stage228r17-missing-item-delete-contract.cjs
- node --test tests/stage228r17-missing-item-delete-contract.test.cjs
- npm run build
- git diff --check

TEST RECZNY:
- Lead -> dodaj Brak -> odswiez -> Brak widoczny -> UsuÄąâ€ž -> znika od razu -> odczekaj -> hard refresh -> Brak nie wraca.
- Sprawdzic, ze NastĂ„â„˘pny krok nie pokazuje usunietego Braku.

RYZYKA:
- Jesli baza ma stare rekordy missing_item juz podpiete jako next_action, delete czysci tylko matching next_action_item_id.
- Nie wykonano twardego DELETE, zgodnie z obecnym kierunkiem soft-delete.
- Nie ruszano ukladu UI ani styli kafelkow.

NASTEPNY KROK:
- Po PASS recznym wykonac selektywny commit/push repo i osobny commit/push vaultu Obsidian.
<!-- /STAGE228R17_MISSING_ITEM_DELETE_CONTRACT -->

## 2026-06-08 21:10 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Stage228R18 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ missing item hard delete source truth

- problem: Brak znikaĂ„Ä…Ă˘â‚¬Ĺˇ po klikniÄ‚â€žĂ˘â€žËciu UsuĂ„Ä…Ă˘â‚¬Ĺľ, ale wracaĂ„Ä…Ă˘â‚¬Ĺˇ po hard refresh.
- decyzja: aktywny Brak w LeadDetail ma byÄ‚â€žĂ˘â‚¬Ë‡ usuwany realnym backend DELETE z work_items po ID, nie tylko statusem deleted.
- dodatkowo: lista Braki i blokady ma byÄ‚â€žĂ˘â‚¬Ë‡ Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇowana z linkedTasks, nie z caĂ„Ä…Ă˘â‚¬Ĺˇego timeline, Ă„Ä…Ă„Ëťeby activity history nie odtwarzaĂ„Ä…Ă˘â‚¬Ĺˇa aktywnego braku.
- testy: check-stage228r18, node test, npm run build, git diff --check, test rÄ‚â€žĂ˘â€žËczny dodaj/usun/hard refresh.
- ryzyko: DELETE jest mocniejsze niĂ„Ä…Ă„Ëť soft-delete; historia usuniÄ‚â€žĂ˘â€žËcia zostaje jako activity.

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

## 2026-06-09 02:50 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE228R41_DELETE_FLOW_FINAL_VALIDATE_PUSH

FAKTY:
- R41 finalizuje delete flow po nieudanym lokalnym Ă„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺľcuchu R26-R40.
- Package prebuild zostawia finalnie R25 i R41, bez wadliwych R26-R40.
- Walidacja nie opiera siÄ‚â€žĂ˘â€žË juĂ„Ä…Ă„Ëť na dokĂ„Ä…Ă˘â‚¬Ĺˇadnym polskim tekĂ„Ä…Ă˘â‚¬Ĺźcie toastu, tylko na strukturze przepĂ„Ä…Ă˘â‚¬Ĺˇywu: branch event/task, toast.error, toast.success, local prune, filtry bundle.

TESTY:
- mass node --check stage228 scripts/tests
- R18/R25/R41 guards
- R25/R41 node tests
- npm run build
- git diff --check

RYZYKA:
- Po deployu wymagany rÄ‚â€žĂ˘â€žËczny test produkcyjny usuwania: Calendar event/task, TasksStable task, LeadDetail Brak, ClientDetail Brak.

<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_TIMELINE_START -->
## 2026-06-10 17:10 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0A Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Visual Source of Truth Inventory + UI Consistency Guard

Dodano:
- centralny raport `_project/VISUAL_SOURCE_OF_TRUTH.md`,
- run report `_project/runs/STAGE231D0A_VISUAL_SOURCE_TRUTH_INVENTORY_RUN.md`,
- payload Obsidian `_project/obsidian_payloads/STAGE231D0A_VISUAL_SOURCE_TRUTH_OBSIDIAN_PAYLOAD.md`,
- guard i test D0A,
- wpis roadmapy D0A przed D0.

Nie zmieniano runtime UI, danych, SQL, finansĂ„â€šÄąâ€šw, Google Auth ani Google Calendar.
<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_TIMELINE_END -->

<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_TIMELINE_START -->
## 2026-06-10 Ă˘â‚¬â€ť STAGE231D0A-R3

Rescue po bÄąâ€šĂ„â„˘dnym runnerze R2 i wczeÄąâ€şniejszym pushu D0A mimo FAIL. R3 domyka guard, test i higienĂ„â„˘ plikÄ‚Ĺ‚w przed D0.
<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_TIMELINE_END -->

<!-- STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP_R4_START -->
## 2026-06-10 Ă˘â‚¬â€ť STAGE231D0-R4 Client workspace UX final runner fix

Status: LOCAL_ONLY_PREPARED / DO_TEST_AND_PUSH

FAKTY:
- R4 naprawia wyÄąâ€šĂ„â€¦cznie niedziaÄąâ€šajĂ„â€¦cy runner/patch D0 i domyka ClientDetail UX cleanup.
- Zakres UI: marker D0, tekst ÄąÂadowanie klienta..., tekst SPRAWA ZAMKNIĂ„ÂTA, finance icon source truth payment, jeden client-level aria-label Finanse klienta.

TESTY:
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run test:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run test:stage231d0a-visual-source-truth-consistency
- node scripts/check-stage231b0-r15-r3-polish-encoding.cjs
- npm run build
- git diff --check

AUDYT RYZYK:
- Nie ruszano modelu finansÄ‚Ĺ‚w i kosztÄ‚Ĺ‚w.
- IstniejĂ„â€¦ce ostrzeÄąÄ˝enie duplicate savedRecord zostaje poza zakresem.

NASTĂ„ÂPNY KROK:
- Po PASS/push przejÄąâ€şĂ„â€ˇ do STAGE231D1 Ă˘â‚¬â€ť model kosztÄ‚Ĺ‚w.
<!-- STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP_R4_END -->

## 2026-06-10 Ă˘â‚¬â€ť STAGE231D0-R5 Ă˘â‚¬â€ť Client workspace UX guard close
- Status: LOCAL_ONLY_RESCUE_PRE_PUSH.
- DomkniĂ„â„˘cie po R4: ikona finansÄ‚Ĺ‚w klienta z EntityIcon case -> payment oraz brakujĂ„â€¦ce tokeny "audyt ryzyk", "nastĂ„â„˘pny krok" i "VISUAL SOURCE OF TRUTH".
- Zakres bez zmian danych: ClientDetail UI, guard/test D0, raporty _project i Obsidian payload.
- Testy: D0 guard/test, D0A regression, Polish guard, build, git diff --check.
- Audyt ryzyk: rĂ„â„˘cznie sprawdziĂ„â€ˇ brak duplikatu Finanse klienta i poprawnĂ„â€¦ ikonĂ„â„˘ finansÄ‚Ĺ‚w.
<!-- STAGE231D1_COST_MODEL_SOURCE_TRUTH_START -->
## 2026-06-10 Ă˘â‚¬â€ť STAGE231D1 Cost model source truth

Status: LOCAL_ONLY_PREPARED / DO_TEST_AND_PUSH

FAKTY:
- STAGE231D1_COST_MODEL_SOURCE_TRUTH: dodano centralny model kosztÄ‚Ĺ‚w sprawy bez zmian runtime UI.
- Model rozdziela: Koszty poniesione, Koszty do zwrotu, Koszty zwrÄ‚Ĺ‚cone i Razem do pobrania.
- D1 nie dodaje SQL, tabel, migracji, Supabase ani formularza UI.

VISUAL SOURCE OF TRUTH:
- D1 uÄąÄ˝ywa finansowego sÄąâ€šownika etykiet i nie dodaje lokalnych stylÄ‚Ĺ‚w UI.
- UI zostaje do D2/D3, zgodnie z D0A Visual Source of Truth.

TESTY:
- npm run check:stage231d1-cost-model-source-truth
- npm run test:stage231d1-cost-model-source-truth
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run build
- git diff --check

audyt ryzyk:
- Ryzyko: D2 moÄąÄ˝e potrzebowaĂ„â€ˇ SQL/tabeli, ale D1 celowo nie dotyka bazy.
- Ryzyko: stare UI finansÄ‚Ĺ‚w nie pokaÄąÄ˝e kosztÄ‚Ĺ‚w, dopÄ‚Ĺ‚ki D2/D3 nie podÄąâ€šĂ„â€¦czĂ„â€¦ modelu.
- Ryzyko: jeÄąâ€şli koszt nie jest reimbursable, nie wchodzi w Koszty do zwrotu.

nastĂ„â„˘pny krok:
- Po PASS/push przejÄąâ€şĂ„â€ˇ do STAGE231D2 Ă˘â‚¬â€ť koszty w sprawie z SQL/guardem i UI opartym o model D1.
<!-- STAGE231D1_COST_MODEL_SOURCE_TRUTH_END -->

<!-- STAGE231D2_CASE_COSTS_IN_CASE_START -->
## STAGE231D2 Ă˘â‚¬â€ť Case costs in case
- data: 2026-06-10 18:55 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED / DO_APPLY_TEST_SQL_AND_PUSH
- zakres: SQL case_costs, API /api/case-costs, CaseDetail cost panel, guard/test.
- testy: check/test D2, regression D1/D0/D0A, Polish guard, build, git diff --check.
- audyt ryzyk: SQL must be run before real write test; route must stay workspace scoped.
- nastĂ„â„˘pny krok: apply package, run SQL, manual add-cost test, then push.
<!-- STAGE231D2_CASE_COSTS_IN_CASE_END -->

<!-- STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_START -->
## STAGE231D2-R2 Ă˘â‚¬â€ť Case costs fetch guard close
- data: 2026-06-10 19:10 Europe/Warsaw
- status: LOCAL_ONLY_GUARD_CLOSE / DO_TEST_SQL_AND_PUSH
- zakres: CaseDetail import/fetch integration for case_costs.
- testy: D2 guard/test, D1/D0/D0A regression, Polish guard, build, git diff --check.
- audyt ryzyk: SQL still required before manual cost write test.
- nastĂ„â„˘pny krok: run SQL, manual add-cost test, selective push.
<!-- STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_END -->

<!-- STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_START -->
## STAGE231D2-R3 Ă˘â‚¬â€ť Vercel Hobby function limit fix
- data: 2026-06-10 19:25 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED / DO_APPLY_TEST_PUSH_DEPLOY
- powÄ‚Ĺ‚d: Vercel Hobby blokuje deployment po przekroczeniu limitu Serverless Functions.
- zakres: usuniĂ„â„˘cie api/case-costs.ts, konsolidacja kosztÄ‚Ĺ‚w pod api/cases.ts?resource=costs, guard budÄąÄ˝etu funkcji.
- testy: D2 guard/test, Vercel budget guard/test, D1/D0/D0A regression, Polish guard, build, git diff --check.
- audyt ryzyk: po deployu powtÄ‚Ĺ‚rzyĂ„â€ˇ manualny test Dodaj koszt, bo zmienia siĂ„â„˘ Äąâ€şcieÄąÄ˝ka API.
- nastĂ„â„˘pny krok: PASS -> push -> deploy -> test rĂ„â„˘czny kosztu.
<!-- STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_END -->

## 2026-06-10 Ă˘â‚¬â€ť STAGE231D2-R5 CaseDetail render crash hotfix

- Status: LOCAL_ONLY_HOTFIX_PREPARED
- Problem: produkcyjna karta sprawy wysypywaÄąâ€ša render przez brak definicji caseCostsSummaryStage231D2.
- Fix: dodano useMemo summary przed JSX i guard blokujĂ„â€¦cy regresjĂ„â„˘.
- Testy: R5/D2/D2R3/D1/D0/D0A/Polish/build.
- Audyt ryzyk: po deployu sprawdziĂ„â€ˇ produkcyjne otwarcie sprawy; /api/case-items 500 to osobny backend problem, jeÄąâ€şli nadal wystĂ„â€¦pi.

## STAGE231D2-R6 Ă˘â‚¬â€ť CaseDetail top strip rail lift

- data i godzina: 2026-06-10 19:55 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED
- zmiana: skrÄ‚Ĺ‚cenie gÄ‚Ĺ‚rnego paska tytuÄąâ€šu sprawy do lewej kolumny i podciĂ„â€¦gniĂ„â„˘cie prawego raila do gÄ‚Ĺ‚rnego miejsca po prawej.
- testy: guard/test R6 + D2/R5/R3/D1/D0/D0A/Polish/build/git diff check.
- ryzyko: CSS negative margin wymaga produkcyjnego testu wizualnego po deployu.

## 2026-06-10 20:05 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D3-R7 prepared

- D3-R1..R6 failed because patchers/guards used brittle anchors. R7 switches to controlled file replacement and mass guard.

## STAGE231D3-R7-R2 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Polish guard restore and D3 close

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

Etap przygotowany jako lokalny ZIP R2 po bÄąâ€šĂ„â„˘dzie parsera PowerShell w R1. Zakres rozszerzony o jawny potencjaÄąâ€š w formularzu tworzenia leada.

## 2026-06-14 10:45 Europe/Warsaw - STAGE231G R7 - potential-only modal and value source

Hotfix po rĂ„â„˘cznym teÄąâ€şcie Damiana. Przyczyna: UX byÄąâ€š za szeroki, a source of truth wartoÄąâ€şci leada byÄąâ€š niespÄ‚Ĺ‚jny pomiĂ„â„˘dzy value i deal_value. Warunek zamkniĂ„â„˘cia: R7 guard, R7 node test, STAGE231G guard, build, git diff --check i test rĂ„â„˘czny potencjaÄąâ€šu.

## 2026-06-14 - STAGE231G_R3 LeadDetail function mapping and operational closeout

Status: DO TESTU LOKALNEGO
Cel: domknÄ‚â€žĂ˘â‚¬Â¦Ä‚â€žĂ˘â‚¬Ë‡ kartÄ‚â€žĂ˘â€žË leada jako operacyjne centrum pracy: potencjaĂ„Ä…Ă˘â‚¬Ĺˇ, nastÄ‚â€žĂ˘â€žËpny krok, cisza/ryzyko, blokada, szybkie akcje, finanse, missing_item i czytelne wiersze dziaĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺľ.
Run report: _project/runs/STAGE231G_R3_LEAD_DETAIL_FUNCTION_MAPPING_AND_OPERATIONAL_CLOSEOUT.md
Guard: scripts/check-stage231g-r3-lead-detail-function-mapping.cjs
Test: 	ests/stage231g-r3-lead-detail-function-mapping.test.cjs
SQL: nie ruszano.

## STAGE231G_R4_LEAD_DETAIL_FUNCTION_MAPPING_CLOSEOUT_FIX

Data: 2026-06-14 11:45 Europe/Warsaw
Status: LOCAL_PACKAGE_PREPARED
Opis: przygotowano R4 closeout LeadDetail po R3. Etap zostanie zamkniety po lokalnym PASS i pushu.

## 2026-06-14 Ă˘â‚¬â€ť STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: CaseDetail runtime repair for fake dictation, nextAction missing fallback, contractValue percent-only behavior, payment history copy, and full payment source in case history.
- SQL: NOT_TOUCHED.
- Deferred: cost lifecycle edit/delete and canonical case_item dual-path decision remain R1C/R1D.

## 2026-06-14 Ă˘â‚¬â€ť STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: fixed shared CaseFinanceEditorDialog contractValue clearing bug after R1B.
- Guard: scripts/check-stage231h-r1b-case-detail-runtime-repair.cjs now covers CaseDetail and shared finance dialog.
- Decision: case_item source truth decision: two UI entries, one case_items contract.
- Risk: cost lifecycle left as R1C.
- SQL: NOT_TOUCHED.

## 2026-06-14 Ă˘â‚¬â€ť STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL

Po manualnym teÄąâ€şcie R1B wykryto brak edycji kosztÄ‚Ĺ‚w. Dodano etap R1C: wspÄ‚Ĺ‚lne okno korekty wpÄąâ€šat i kosztÄ‚Ĺ‚w.

## 2026-06-14 15:45 Europe/Warsaw Ă˘â‚¬â€ť STAGE231H_R1D_FINANCE_CORRECTION_MODAL_COMPACT

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: compact cleanup of CaseDetail finance correction modal after R1C.
- Decision: remove redundant cost status chip from the correction list; cost status remains editable inside the cost correction form.
- Decision: commission payment is a paid commission entry by default; remove status/type selectors from add-commission-payment UI.
- Decision: remove the redundant "Korekta / prowizja" fallback label from payment rows.
- SQL: NOT_TOUCHED.
- Manual test: open Koryguj wpÄąâ€šatĂ„â„˘/koszt, verify rows fit, add commission payment, add/correct/delete cost, refresh.

## STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION Ă˘â‚¬â€ť 2026-06-14 16:40 Europe/Warsaw
- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH / SERVER_UI_REQUIRED
- Scope: payment correction now edits existing payment amount/date/note through updatePaymentInSupabase; cost correction edits kind/date/status/note and money fields.
- SQL: not touched.
- Risk: if payment PATCH fails on server, backend payment endpoint repair is required.


## 2026-06-14 HH:mm Europe/Warsaw Ă˘â‚¬â€ť STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR
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

## 2026-06-14 19:10 Europe/Warsaw Ă˘â‚¬â€ť STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME

- R1G2 finance/cost pozostaje PRODUCT_PASS.
- R1D2 przywraca realne dyktowanie notatki w CaseDetail.
- Nastepny logiczny etap po manual PASS: R1E koszt zwrocony/czesciowo zwrocony.


## STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON Ă˘â‚¬â€ť 2026-06-14 19:40 Europe/Warsaw

- status: RUNTIME_HOTFIX_PREPARED
- zakres: drugi widoczny przycisk w panelu Notatki sprawy nie moÄąÄ˝e zostaĂ„â€ˇ jako disabled Ă˘â‚¬ĹľNotatka gÄąâ€šosowa Ă˘â‚¬â€ť wkrÄ‚Ĺ‚tceĂ˘â‚¬ĹĄ; ma uÄąÄ˝ywaĂ„â€ˇ tego samego handlera SpeechRecognition/autosave co przycisk w panelu DziaÄąâ€šania sprawy.
- runtime: src/pages/CaseDetail.tsx, bez SQL i bez R1E kosztÄ‚Ĺ‚w zwrÄ‚Ĺ‚conych.
- test: R1D2 guard/test + R1D2 R4 guard/test + build + diff-check.
- ryzyko: wczeÄąâ€şniejszy R1D2 zabezpieczaÄąâ€š pierwszy przycisk, ale nie objĂ„â€¦Äąâ€š drugiego widocznego przycisku w panelu notatek.


## 2026-06-14 22:00 Europe/Warsaw - STAGE231H_R1D2_R6_R9_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR

Status: DO_APPLY / mass repair from clean origin.
Zakres: CaseDetail note follow-up source map and notes CRUD. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek dostaje Edytuj/UsuĂ„Ä…Ă˘â‚¬Ĺľ/Zapisz. Etap zastÄ‚â€žĂ˘â€žËpuje runtime file bez kruchych anchorĂ„â€šÄąâ€šw po bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdach R6/R7/R8.


## 2026-06-14 22:15 Europe/Warsaw - STAGE231H_R1D2_R6_R9D_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR_GUARD_SYNC

Status: DO_APPLY / guard-ledger sync after R9 partial apply.
Zakres: centralny R1G2 product-pass sync wymagany przez legacy R1D2 guard plus R9 mass repair. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek ma Edytuj/UsuĂ„Ä…Ă˘â‚¬Ĺľ/Zapisz.


## 2026-06-14 22:30 Europe/Warsaw - STAGE231H_R1D2_R6_R9E_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_GUARD_SYNC

Status: DO_APPLY / MASS_GUARD_SYNC_CONTINUATION
Zakres: masowe domkniÄ‚â€žĂ˘â€žËcie klasy bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdĂ„â€šÄąâ€šw legacy markerĂ„â€šÄąâ€šw. Synchronizuje R1G2, R1D2 R4, R9, R9D i R9E w centralnych ledgerach oraz uruchamia peĂ„Ä…Ă˘â‚¬Ĺˇny chain guardĂ„â€šÄąâ€šw/testĂ„â€šÄąâ€šw/build.


## 2026-06-14 22:40 Europe/Warsaw - STAGE231H_R1D2_R6_R9F_CASE_NOTE_FOLLOWUP_NOTES_CRUD_GUARD_REGEX_MASS_FIX

Status: DO_APPLY / MASS_GUARD_REGEX_FIX
Zakres: naprawa klasy bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdu guardĂ„â€šÄąâ€šw R9D/R9E: sprawdzenie runtime regex
eplace(/\s+/g, ' ') w guardzie musi mieÄ‚â€žĂ˘â‚¬Ë‡ podwĂ„â€šÄąâ€šjnie escapowany backslash. Bez tego guard szuka bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdnego
eplace(/s+/g, ' ').


## 2026-06-14 22:50 Europe/Warsaw - STAGE231H_R1D2_R6_R9G_CASE_NOTE_FOLLOWUP_NOTES_CRUD_LOCAL_TASKS_GUARD_MASS_FIX

Status: DO_APPLY / MASS_LOCAL_TASKS_GUARD_FIX
Zakres: naprawa klasy bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdu guardĂ„â€šÄąâ€šw R9E/R9F: runtime poprawnie dopina nowy follow-up task do lokalnego 	asks przez setTasks((current) => dedupeCaseTasks([normalizedCreated, ...current], caseId, caseData));, a guard nie moĂ„Ä…Ă„Ëťe wymagaÄ‚â€žĂ˘â‚¬Ë‡ nieistniejÄ‚â€žĂ˘â‚¬Â¦cej skĂ„Ä…Ă˘â‚¬Ĺˇadni previousTasks.

## STAGE231H_R1D2_R10C_CASE_DETAIL_ACTION_MAP_FOLLOWUP_NOTES_FINANCE_LOADING

- Data: 2026-06-14 23:45 Europe/Warsaw
- Status: TECH_STAGE_IN_PROGRESS
- Zakres: CaseDetail action map, note follow-up display/source map, quick note local append, finance loading flicker removal.
- Audyt: R10 failed on brittle anchor. R10C uses regex/whole-class source-aware patch and guard.

### STAGE231H_R1D2_R11_NOTE_PANEL_FOLLOWUP_PROMPT_MAP_GUARD
- data: 2026-06-14T20:31:30.095Z
- status: DO_TEST_AND_PUSH
- zakres: notatki CaseDetail pokazujĂ„â€¦ do 5 wpisÄ‚Ĺ‚w, majĂ„â€¦ tooltip peÄąâ€šnej treÄąâ€şci, szybka notatka otwiera ten sam prompt follow-upu co dyktowanie, a follow-up w dziaÄąâ€šaniach pokazuje treÄąâ€şĂ„â€ˇ notatki jako opis.
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
- Zakres: CaseDetail notatki sprawy, follow-up po notatce, kasowanie powiÄ…zanego taska.
- Status: LOCAL_APPLIED_PENDING_VERIFY

## STAGE231H_R1D2_R15C - 2026-06-15 15:10 Europe/Warsaw
- CaseDetail: naprawiono dwukierunkowe powiązanie notatka/follow-up, ostrzeżenie przy kasowaniu follow-upu z działań i hierarchię tekstu w karcie działania.
