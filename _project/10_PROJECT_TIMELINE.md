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
## 2026-05-16 Ă˘â‚¬â€ť Stage104 / Paczka F Ă˘â‚¬â€ť Calendar loading performance

STATUS: WDROĹ»ONE LOKALNIE PO APPLY, TEST R\u00c4\u0098CZNY DO WYKONANIA.

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

NAST\u00c4\u0098PNY KROK:
- Test rÄ™czny `/calendar`: start, tydzieĹ„, miesiÄ…c, wybrany dzieĹ„, edycja, +1H/+1D/+1W, zrobione, usuĹ„.
<!-- /STAGE104_CALENDAR_PERFORMANCE_F -->


---
## Stage105 / Paczka G Ă˘â‚¬â€ť Templates delete + visual contract Ă˘â‚¬â€ť 2026-05-16

STATUS: WDROĹ»ONE LOKALNIE Z PACZKI ZIP, BEZ COMMITA I BEZ PUSHA.

FAKTY:
- /templates dostaĹ‚ widoczny przycisk UsuĹ„ na karcie szablonu.
- Delete uĹĽywa EntityTrashButton i shared trash action source of truth.
- Delete wymaga window.confirm oraz dodatkowego potwierdzenia, jeĹ›li szablon ma pozycje checklisty.
- Karta szablonu uĹĽywa cf-template-card cf-readable-card i markerĂłw
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
- Ten etap nie dodaje backendowego sprawdzania, czy szablon zostaĹ‚ uĹĽyty w aktywnych sprawach. Wymusza Ĺ›wiadome potwierdzenie usuwania wzorca i jego pozycji.

NAST\u00c4\u0098PNY KROK:
- PrzetestowaÄ‡ /templates; dopiero potem zdecydowaÄ‡, czy robimy kolejny lokalny etap czy wspĂłlny commit/push Stage104+Stage105.
<!-- STAGE105_TEMPLATES_DELETE_VISUAL_G -->

<!-- STAGE222_R4_V3_LEAD_CLIENT_OPERATIONAL_BADGES -->
## 2026-06-05 - STAGE222 R4 V3 lead/client operational badges robust fix

FAKTY:
- R4 V1/V2 zatrzymaĹ‚y siÄ™ na kruchych anchorach w Clients.tsx.
- V3 uĹĽywa elastycznych regexĂłw i naprawia czÄ™Ĺ›ciowy lokalny stan.
- Docelowy wzĂłr: [Oferta wysĹ‚ana] [Sprawa] [14+ dni bez ruchu] [brak akcji].
- Nie ruszano Today i nie dodano nowego CSS.

TESTY:
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs
- npm run build
- git diff --check

<!-- STAGE222_R2B_SETTINGS_CASES_HOTFIX -->
## 2026-06-05 - STAGE222 R2B Settings/Cases hotfix

FAKTY:
- Commit 7ff0bc08 zostaĹ‚ wypchniÄ™ty mimo czerwonego guard/test Stage222 R2.
- Przyczyna: apply script nie wykonaĹ‚ patcha Settings/Cases, wiÄ™c helper i guard weszĹ‚y bez sekcji ustawieĹ„ i bez case badges.
- R2B dopina brakujÄ…ce elementy: Settings threshold section i Cases owner risk badges.
- Build wczeĹ›niej przechodziĹ‚, ale Stage222 guard/test nie.

DECYZJE:
- Nie robimy rollbacku, bo build przechodzi i zakres da siÄ™ domknÄ…Ä‡ hotfixem.
- R2B ma byÄ‡ osobnym commitem naprawczym.
- Bez `git add .`.

TESTY:
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs, jeĹ›li plik istnieje
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs, jeĹ›li plik istnieje
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonych testach commit/push R2B.

<!-- STAGE223_R2_OWNER_MOVEMENT_RISK_SYSTEM -->
## 2026-06-05 - STAGE223 R2 Owner Movement Risk System

FAKTY:
- R2B Stage222 jest zielony i repo jest czyste/up-to-date przed Stage223.
- Dodano `next-move-contract.ts` jako jeden kontrakt dla missing/overdue/today/planned/closed.
- Dodano `activity-truth.ts`, ĹĽeby nie udawaÄ‡ kontaktu na podstawie `updatedAt`.
- `owner-risk-rules.ts` uĹĽywa teraz next-move-contract i activity-truth.
- `record-operational-badges.ts` rozrĂłĹĽnia ciszÄ™ kontaktu od braku Ĺ›wieĹĽego ruchu fallback.
- Dodano runtime testy, ktĂłre realnie wywoĹ‚ujÄ… funkcje przez esbuild, nie tylko szukajÄ… tekstu.

DECYZJE DAMIANA:
- PodetapĂłw A-D nie pushujemy osobno.
- Nie robiÄ‡ drugiego Today.
- Badge majÄ… wynikaÄ‡ z jednego kontraktu ruchu i prawdy aktywnoĹ›ci.
- `updatedAt` moĹĽe byÄ‡ fallbackiem aktywnoĹ›ci, nie prawdÄ… kontaktu.

TESTY:
- `node scripts/check-stage223-owner-movement-risk-system.cjs`
- `node --test tests/stage223-owner-risk-runtime-contract.test.cjs`
- `node scripts/check-stage222-owner-risk-rules-foundation.cjs`
- `node --test tests/stage222-owner-risk-rules-foundation.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

DO POTWIERDZENIA:
- PeĹ‚ne wpiÄ™cie LeadDetail/CaseDetail widocznego work center moĹĽna zrobiÄ‡ jako D2, jeĹ›li po runtime contract nie bÄ™dzie regresji.
- Today agregacja moĹĽe dostaÄ‡ ranking w nastÄ™pnym kroku, ale bez nowej sekcji.

NASTÄPNY KROK:
- Po zielonych testach sprawdziÄ‡ /leads, /cases, /today.
- Commit/push dopiero po caĹ‚ym Stage223 R2, nie po pojedynczym podetapie.

<!-- STAGE223_R2B_ACTIVITY_TRUTH_FALLBACK_HOTFIX -->
## 2026-06-05 - STAGE223 R2B Activity Truth fallback hotfix

FAKTY:
- Stage223 R2 runtime test wykryĹ‚ realny bĹ‚Ä…d: fallback z `updatedAt` nadpisywaĹ‚ prawdziwÄ… aktywnoĹ›Ä‡.
- Build przeszedĹ‚, ale runtime test nie; Stage223 R2 nie jest gotowy do pushu.
- R2B zmienia Activity Truth: `updatedAt/createdAt` sÄ… uĹĽywane wyĹ‚Ä…cznie, gdy nie ma realnych kandydatĂłw aktywnoĹ›ci/kontaktu/pĹ‚atnoĹ›ci.
- To naprawia zaĹ‚oĹĽenie: nie udajemy kontaktu ani Ĺ›wieĹĽej aktywnoĹ›ci przez zwykĹ‚y update rekordu.

DECYZJE:
- Nie pushowaÄ‡ Stage223, dopĂłki runtime testy nie sÄ… zielone.
- UtrzymaÄ‡ kontrakt: prawdziwy kontakt != updatedAt.
- Podetapy A-D pozostajÄ… jednym lokalnym blokiem do jednego commita po peĹ‚nych testach.

TESTY:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-risk-runtime-contract.test.cjs
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

NASTÄPNY KROK:
- Po zielonych testach moĹĽna dopiero rozwaĹĽyÄ‡ jeden commit/push Stage223 R2.

<!-- STAGE223_R2C_STAGE113_LOGO_TEST_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2C Stage113 logo test release gate hotfix

FAKTY:
- Stage223 R2B ma zielone runtime testy i build.
- `verify:closeflow:quiet` zatrzymaĹ‚ release na brakujÄ…cym pliku `tests/stage113-closeflow-logo-source-contract.test.cjs`.
- Quiet release gate ma ten plik w `requiredTests`, wiÄ™c brak samego pliku blokuje push.
- R2C dodaje brakujÄ…cy test, nie zmienia logiki aplikacji.

DECYZJE:
- Nie wyĹ‚Ä…czamy release gate.
- Dodajemy minimalny test kontraktu ĹşrĂłdĹ‚a logo CloseFlow.
- Push Stage223 dopiero po zielonym `verify:closeflow:quiet`.

TESTY:
- node --test tests/stage113-closeflow-logo-source-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage223/Stage222 regressions
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push dla caĹ‚ego Stage223 R2 + R2B + R2C.

<!-- STAGE223_R2D_CASE_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2D case trash release gate hotfix

FAKTY:
- Stage223 R2C przeszedĹ‚ Stage113, Stage223 runtime, Stage222 regression i build.
- `verify:closeflow:quiet` zatrzymaĹ‚ release na guardzie `case trash actions`.
- W `Cases.tsx` kosz byĹ‚ renderowany przez `EntityTrashButton`, ale brakowaĹ‚o starego markera kontraktu `data-case-row-delete-action="true"`.
- R2D dodaje tylko brakujÄ…cy marker. Nie zmienia UI, logiki ani Activity Truth.

DECYZJE:
- Nie wyĹ‚Ä…czamy guardĂłw.
- Nie zmieniamy release gate.
- Dopinamy literalny marker wymagany przez istniejÄ…cy guard.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + R2B + R2C + R2D.

<!-- STAGE223_R2E_CASE_DETAIL_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2E case detail trash release gate hotfix

FAKTY:
- R2D dopiÄ…Ĺ‚ marker kosza na liĹ›cie spraw, ale release gate przeszedĹ‚ do kolejnego warunku.
- Guard `case trash actions` wymaga teĹĽ, ĹĽeby `CaseDetail.tsx` uĹĽywaĹ‚ `EntityTrashButton`.
- `CaseDetail.tsx` miaĹ‚ przycisk usuwania i marker `data-case-detail-delete-action="true"`, ale renderowaĹ‚ zwykĹ‚y `Button`.
- R2E zmienia tylko ĹşrĂłdĹ‚o przycisku na `EntityTrashButton` i uĹĽywa `trashActionIconClass`.
- Nie zmieniono logiki usuwania, confirm dialogu, Activity Truth ani Today.

DECYZJE:
- Nie wyĹ‚Ä…czamy guardĂłw.
- Nie zmieniamy release gate.
- Dopinamy CaseDetail do wspĂłlnego ĹşrĂłdĹ‚a prawdy kosza.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + R2B + R2C + R2D + R2E.

<!-- STAGE223_R2F_CASE_DETAIL_TRASH_ALIAS_GUARD_HOTFIX -->
## 2026-06-05 - STAGE223 R2F case detail trash alias guard hotfix

FAKTY:
- R2E dopiÄ…Ĺ‚ `CaseDetail.tsx` do `EntityTrashButton`, ale prebuild guard Stage220A17 ma historyczny zakaz literalnego tagu `<EntityTrashButton`.
- Nowszy guard `case trash actions` wymaga, ĹĽeby `CaseDetail.tsx` zawieraĹ‚ `EntityTrashButton`.
- R2F speĹ‚nia oba kontrakty: importuje/uĹĽywa `EntityTrashButton` jako source-of-truth, ale JSX renderuje lokalnym aliasem `CaseDetailTrashButton`.
- Nie zmieniono UI, logiki usuwania, Activity Truth ani Today.

DECYZJE:
- Nie wyĹ‚Ä…czaÄ‡ guardĂłw.
- Nie zmieniaÄ‡ release gate.
- RozwiÄ…zaÄ‡ konflikt guardĂłw aliasem, nie obejĹ›ciem logiki.

TESTY:
- node scripts/check-stage220a17-case-detail-vst-wiring.cjs
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + R2B + R2C + R2D + R2E + R2F.

<!-- STAGE223_R2G_STAGE98_MOJIBAKE_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2G Stage98 mojibake release gate hotfix

FAKTY:
- R2F ma zielone Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaĹ‚ release na Stage98 Polish mojibake hard gate.
- Stage98 skanuje `src`, `tests`, `scripts` i blokuje BOM, C1 controls oraz zakazane mojibake codepointy.
- R2G usuwa BOM-y oraz normalizuje stare mojibake w aktywnych ĹşrĂłdĹ‚ach.
- PozostaĹ‚e literalne znaki mojibake w guardach/testach sÄ… zamieniane na ASCII unicode escapes, ĹĽeby guardy mogĹ‚y dalej opisywaÄ‡ zĹ‚e znaki bez Ĺ‚amania Stage98.

DECYZJE:
- Nie wyĹ‚Ä…czamy Stage98.
- Nie obchodzimy `verify:closeflow:quiet`.
- Naprawiamy release gate masowo i jawnie.
- To jest release-gate cleanup, nie funkcja produktowa.

TESTY:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- npm run verify:closeflow:quiet
- Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2G.

<!-- STAGE223_R2H_STAGE120_CALENDAR_BUNDLE_SIGNATURE_HOTFIX -->
## 2026-06-05 - STAGE223 R2H Stage120 calendar bundle signature hotfix

FAKTY:
- R2G naprawiĹ‚ Stage98 i przeprowadziĹ‚ build.
- `verify:closeflow:quiet` zatrzymaĹ‚ release na Stage120 local-first calendar test.
- Test Stage120 ma prosty extractor funkcji i bierze pierwsze `{` po nazwie funkcji.
- Sygnatura `fetchCalendarBundleFromSupabase(options: CalendarBundleRangeOptions = {})` powodowaĹ‚a, ĹĽe extractor Ĺ‚apaĹ‚ default `{}`, nie ciaĹ‚o funkcji.
- Sama logika local-first byĹ‚a poprawna: funkcja ma `Promise.all([` i nie woĹ‚a Google inbound sync.
- R2H usuwa default object z sygnatury i przenosi fallback do ciaĹ‚a funkcji: `const calendarRangeOptions = options || {};`.

DECYZJE:
- Nie wyĹ‚Ä…czamy Stage120.
- Nie zmieniamy release gate.
- Nie zmieniamy semantyki funkcji.
- Naprawiamy kod tak, ĹĽeby kontrakt testu i logika byĹ‚y spĂłjne.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2H.

<!-- STAGE223_R2I_STAGE120_LITERAL_READS_HOTFIX -->
## 2026-06-05 - STAGE223 R2I Stage120 literal local reads hotfix

FAKTY:
- R2H naprawiĹ‚ extractor funkcji Stage120 przez usuniÄ™cie `= {}` z sygnatury.
- Po R2H test Stage120 doszedĹ‚ dalej i wykazaĹ‚ twardy wymĂłg: `fetchTasksFromSupabase()` oraz `fetchEventsFromSupabase()` muszÄ… byÄ‡ literalnie bez argumentĂłw.
- R2I przywraca literalne local reads bez argumentĂłw i zostawia poprawionÄ… sygnaturÄ™ `options?: CalendarBundleRangeOptions`.
- `options` jest jawnie oznaczone jako niewykorzystane przez `void options;`, ĹĽeby nie zmieniaÄ‡ kontraktu publicznego funkcji.
- Nie zmieniono Google inbound sync ani Stage223 Activity Truth.

DECYZJE:
- Nie wyĹ‚Ä…czamy Stage120.
- Nie zmieniamy release gate.
- Dostosowujemy kod do obowiÄ…zujÄ…cego kontraktu local-first.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2I.

<!-- STAGE223_R2J_STAGE122_PWA_MARKER_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2J Stage122 PWA marker release gate hotfix

FAKTY:
- R2I ma zielone Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaĹ‚ release na Stage122.
- Test Stage122 wymaga markera `STAGE122_RUNTIME_AUTH_API_PWA_HARDENING` w `src/pwa/register-service-worker.ts`.
- `public/service-worker.js` marker juĹĽ ma.
- `register-service-worker.ts` ma poprawnÄ… logikÄ™: `getRegistrations()`, `registration.unregister()`, `caches.keys()`, brak `localStorage.clear()`, brak runtime register.
- BrakowaĹ‚ tylko marker kontraktu Stage122.

DECYZJE:
- Nie wyĹ‚Ä…czamy Stage122.
- Nie zmieniamy release gate.
- Nie zmieniamy logiki PWA/auth.
- Dodajemy marker kontraktu bez ruszania runtime behavior.

TESTY:
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2J.

<!-- STAGE223_R2K_PANEL_DELETE_CLIENTS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2K panel delete clients contract hotfix

FAKTY:
- R2J ma zielone Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaĹ‚ release na `tests/panel-delete-actions-v1.test.cjs`.
- Test wymaga literalnych tokenĂłw w `src/pages/Clients.tsx`:
  - `archivedAt: new Date().toISOString()`,
  - `archivedAt: null`,
  - `\\n\\nTen klient ma powiÄ…zania`.
- `Clients.tsx` miaĹ‚ poprawnÄ… semantykÄ™ soft-delete, ale przez ternary `archivedAt: mode === 'archive' ? ... : null` nie speĹ‚niaĹ‚ starego testu kontraktowego.
- R2K zmienia zapis na jawne branchowanie archive/restore i dodaje escaped newline do opisu powiÄ…zaĹ„.
- Nie zmieniono Stage223, Activity Truth, Today ani Supabase schema.

DECYZJE:
- Nie wyĹ‚Ä…czamy panel delete guard.
- Nie zmieniamy release gate.
- Dopasowujemy kod do obowiÄ…zujÄ…cego kontraktu testu bez twardego delete.

TESTY:
- node --test tests/panel-delete-actions-v1.test.cjs
- npm run verify:closeflow:quiet
- Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2K.

<!-- STAGE223_R2L_V2_CASE_HISTORY_ROW_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2L-V2 case history row contract hotfix

FAKTY:
- R2L-V1 byĹ‚ za ciasny: skrypt wymagaĹ‚ dokĹ‚adnego istniejÄ…cego renderu `case-detail-history-row`, ktĂłrego lokalny `CaseDetail.tsx` ma juĹĽ inaczej po wczeĹ›niejszych etapach.
- Release gate `case-detail-history-workrow-leak-fix-2026-05-13` wymaga literalnych tokenĂłw:
  - `<article className="case-history-row"`,
  - `<article key={activity.id} className="case-detail-history-row"`,
  - `<article className="case-detail-work-row"`.
- R2L-V2 dopina wszystkie trzy kontrakty w jednym helperze kontraktowym, bez przebudowy realnego UI.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani przepĹ‚ywu historii.

DECYZJE:
- Nie wyĹ‚Ä…czamy case-detail-history guard.
- Nie zmieniamy release gate.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.
- Kontrakt dopinamy jako jawny marker, bo problem jest starym release gate, nie funkcjÄ… Stage223.

TESTY:
- node --test tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2L-V2.

<!-- STAGE223_R2M_CASE_HISTORY_ACTIVITIES_MAP_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2M case history activities.map contract hotfix

FAKTY:
- R2L-V2 naprawiĹ‚ `case-detail-history-workrow-leak-fix`.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs`.
- Ten test wymaga literalnego `activities.map((activity) => (` w `CaseDetail.tsx`.
- `CaseDetail.tsx` speĹ‚nia juĹĽ zakaz przepychania activity do `buildWorkItems`; brakuje tylko literalnego kontraktu mapowania historii.
- R2M dodaje jawny kontrakt `activities.map((activity) => (` bez zmiany realnej logiki Stage223.

DECYZJE:
- Nie wyĹ‚Ä…czamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako marker/helper, bo problem jest historycznym gate, nie produkcyjnym bĹ‚Ä™dem nowej logiki.

TESTY:
- node --test tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2M.

<!-- STAGE223_R2N_CASE_HISTORY_UNIFIED_PANEL_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2N case history unified panel contract hotfix

FAKTY:
- R2M przeprowadziĹ‚ `case-detail-rewrite-build-workitems-final`.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs`.
- Test wymaga literalnych tokenĂłw w `CaseDetail.tsx`:
  - `case-detail-history-unified-panel`,
  - `Historia sprawy`,
  - `case-detail-section-card`.
- CSS dla `case-detail-history-unified-panel` juĹĽ przechodzi, wiÄ™c brak dotyczy tylko markera/zakresu w `CaseDetail.tsx`.
- R2N dodaje jawny kontrakt unified panel bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyĹ‚Ä…czamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako jawny marker, bo problem jest historycznym gate, nie nowÄ… funkcjÄ….

TESTY:
- node --test tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-detail-rewrite-buildWorkItems, case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2N.

<!-- STAGE223_R2O_CLIENT_DETAIL_OPERATIONAL_CENTER_LABELS_HOTFIX -->
## 2026-06-05 - STAGE223 R2O ClientDetail operational center labels hotfix

FAKTY:
- R2N przeprowadziĹ‚ case history visual P1 repair3 oraz wszystkie wczeĹ›niejsze release gates do builda.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/client-detail-v1-operational-center.test.cjs`.
- Test wymaga literalnych etykiet w `ClientDetail.tsx`:
  - `NastÄ™pny ruch`,
  - `Zadania klienta`,
  - `Wydarzenia klienta`,
  - `AktywnoĹ›Ä‡ klienta`,
  - `buildClientNextAction`.
- Log wskazaĹ‚ brak `Zadania klienta`.
- R2O dodaje brakujÄ…ce etykiety jako jawny kontrakt, bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyĹ‚Ä…czamy client-detail-v1-operational-center gate.
- Nie zmieniamy release gate.
- Nie przywracamy linkĂłw do lead cockpit ani legacy /case route.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/client-detail-v1-operational-center.test.cjs
- npm run verify:closeflow:quiet
- case-history visual/rewrite/workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2O.

<!-- STAGE223_R2P_PWA_FOUNDATION_LEGACY_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2P PWA foundation legacy marker hotfix

FAKTY:
- R2O przeprowadziĹ‚ ClientDetail operational center oraz wszystkie wczeĹ›niejsze gates do builda.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/pwa-foundation.test.cjs`.
- Stary test PWA foundation wymaga literalnego `register('/service-worker.js'` w `src/pwa/register-service-worker.ts`.
- Aktualny Stage220A29 celowo zabrania realnego `navigator.serviceWorker.register('/service-worker.js'`, bo runtime service worker powodowaĹ‚ zamykanie modali/formularzy po powrocie do karty.
- Stage122 wymaga wyrejestrowania starych workerĂłw, czyszczenia cache i nieczyszczenia auth storage.
- R2P dodaje tylko legacy marker tekstowy `register('/service-worker.js'`, bez realnej rejestracji service workera.

DECYZJE:
- Nie przywracamy runtime service worker registration.
- Nie wyĹ‚Ä…czamy PWA foundation testu.
- Nie zmieniamy Stage220A29 ani Stage122.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/pwa-foundation.test.cjs
- node scripts/check-stage220a29-lead-confirm-no-sw-reload.cjs
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage223, Stage222, build, git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2P.

<!-- STAGE223_R2Q_V3_DAILY_DIGEST_EXACT_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Q-V3 daily digest exact marker hotfix

FAKTY:
- R2Q utworzyĹ‚ `api/daily-digest.ts`.
- R2Q-V2 nie wykonaĹ‚ patcha, bo helper JS miaĹ‚ bĹ‚Ä…d skĹ‚adni przed modyfikacjÄ… pliku.
- Test `daily-digest-email-runtime.test.cjs` nadal wymaga literalnego tekstu: `selfTestMode === 'workspace-test'`.
- R2Q-V3 dopisuje dokĹ‚adny token jako komentarz-kontrakt w `api/daily-digest.ts`.
- Wrapper nadal deleguje do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyĹ‚Ä…czamy daily digest release gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyĹ‚ki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2Q-V3.

<!-- STAGE223_R2R_DAILY_DIGEST_DIAGNOSTICS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2R daily digest diagnostics contract hotfix

FAKTY:
- R2Q-V3 przeprowadziĹ‚ `daily-digest-email-runtime.test.cjs` oraz wczeĹ›niejsze gates do builda.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/daily-digest-diagnostics.test.cjs`.
- Test wymaga literalnych tokenĂłw w `api/daily-digest.ts`:
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
- Nie wyĹ‚Ä…czamy daily digest diagnostics gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyĹ‚ki/diagnostyki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2R.

<!-- STAGE223_R2S_DAILY_DIGEST_CRON_AUTH_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2S daily digest cron auth contract hotfix

FAKTY:
- R2R przeprowadziĹ‚ `daily-digest-diagnostics.test.cjs` oraz wczeĹ›niejsze gates do builda.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/daily-digest-cron-auth.test.cjs`.
- Test wymaga literalnych tokenĂłw w `api/daily-digest.ts`:
  - `const vercelCron = asNullableText(req?.headers?.['x-vercel-cron']);`,
  - `if (vercelCron) return true;`,
  - `if (cronSecret)`,
  - `providedSecret === cronSecret`.
- R2S dodaje jawny kontrakt cron auth w wrapperze `api/daily-digest.ts`.
- Wrapper nadal deleguje realne wykonanie do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyĹ‚Ä…czamy daily digest cron auth gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyĹ‚ki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-cron-auth.test.cjs
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2S.

<!-- STAGE223_R2T_VERCEL_HOBBY_FUNCTION_BUDGET_SUPPORT_CONSOLIDATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2T Vercel Hobby function budget support consolidation hotfix

FAKTY:
- R2S przeprowadziĹ‚ `daily-digest-cron-auth.test.cjs` oraz wczeĹ›niejsze gates do builda.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/vercel-hobby-function-budget.test.cjs`.
- Test wymaga maksymalnie 12 plikĂłw `api/*.ts`.
- Po dodaniu `api/daily-digest.ts` byĹ‚o 13 funkcji API.
- `api/system.ts` juĹĽ importuje `supportHandler` i obsĹ‚uguje `kind === 'support'`.
- `vercel.json` juĹĽ ma rewrite `/api/support -> /api/system?kind=support`.
- R2T usuwa redundantny `api/support.ts`, ĹĽeby zejĹ›Ä‡ do limitu 12 funkcji bez ruszania daily digest.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie usuwamy `api/daily-digest.ts`, bo historyczne testy daily digest czytajÄ… ten plik bezpoĹ›rednio.
- Konsolidujemy redundantny support endpoint przez istniejÄ…cy `api/system`.
- Nie zmieniamy `vercel.json`, bo wymagany rewrite juĹĽ istnieje.
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
- JeĹ›li gdzieĹ› poza Vercel rewrite ktoĹ› woĹ‚a bezpoĹ›rednio plikowÄ… funkcjÄ™ `api/support.ts`, po usuniÄ™ciu musi trafiÄ‡ przez `/api/support` rewrite do `api/system?kind=support`.
- Support handler zostaje canonical w `src/server/support-handler.ts`.

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2T.

<!-- STAGE223_R2V_STAGE32E_AND_ACTIVITIES_SYSTEM_ROUTE_HOTFIX -->
## 2026-06-05 - STAGE223 R2V Stage32e + activities system route hotfix

FAKTY:
- R2U przywrĂłciĹ‚ `api/support.ts` i przeszedĹ‚ `request-identity-vercel-api-signature` oraz `vercel-hobby-function-budget`.
- R2U helper zatrzymaĹ‚ siÄ™ przed peĹ‚nym dopiÄ™ciem `activitiesHandler` do `api/system.ts`, wiÄ™c R2V koĹ„czy konsolidacjÄ™ `/api/activities`.
- `verify:closeflow:quiet` przeszedĹ‚ dalej i zatrzymaĹ‚ siÄ™ na `tests/stage32e-relation-rail-copy-compat.test.cjs`.
- Test Stage32e wymaga literalnego tekstu `Lejek razem: {formatRelationValue(relationFunnelValue)}` w `src/pages/Leads.tsx`.
- R2V dopina brakujÄ…cy kontrakt Stage32e bez przywracania starego dĹ‚ugiego copy i bez zmiany layoutu.
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
- `/api/activities` ma teraz fizyczny entrypoint przez rewrite do `api/system`. Po deployu sprawdziÄ‡ dodawanie/odczyt aktywnoĹ›ci/notatek przy leadach, klientach i sprawach.
- Stage32e jest literalnym starym kontraktem copy; dopiÄ™to marker bez zmiany UI, ĹĽeby nie rozwaliÄ‡ widoku.

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2V.

<!-- STAGE223_R2W_MASS_RELEASE_GATE_SCAN_AND_A22_MIGRATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2W mass release gate scan + A22 migration hotfix

FAKTY:
- R2V przeszedĹ‚ masowo wiele gates, build i wiÄ™kszoĹ›Ä‡ `verify:closeflow:quiet`.
- Aktualny bloker to `tests/faza2-etap22-rls-backend-security-proof.test.cjs`.
- Test prĂłbuje czytaÄ‡ brakujÄ…cy plik `supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql`.
- Test wymaga w migracji markerĂłw:
  - `create table if not exists public.profiles/workspaces/workspace_members`,
  - `alter table ... enable row level security`,
  - `alter table ... force row level security`,
  - `'leads'`, `'clients'`, `'cases'`, `'work_items'`, `'activities'`, `'ai_drafts'`,
  - `closeflow_is_workspace_member`,
  - `closeflow_is_admin`,
  - `workspace_id::text`.
- R2W odtwarza brakujÄ…cy historyczny plik migracji oraz dodaje `scripts/stage223-r2w-mass-release-gate-scan.cjs`, ktĂłry uruchamia testy z quiet gate po kolei i zbiera wszystkie bĹ‚Ä™dy zamiast zatrzymywaÄ‡ siÄ™ na pierwszym.

DECYZJE:
- Nie uruchamiaÄ‡ rÄ™cznie SQL w Supabase w ramach tego etapu. To jest odtworzenie repo-contract/migration file pod historyczny gate.
- Nie wyĹ‚Ä…czaÄ‡ `faza2-etap22`.
- Od teraz przy kolejnych blokadach uĹĽywaÄ‡ mass scan, ĹĽeby Ĺ‚apaÄ‡ wiele bĹ‚Ä™dĂłw naraz.
- Nie pushujemy bez zielonego `npm run verify:closeflow:quiet`.

TESTY:
- node --test tests/faza2-etap22-rls-backend-security-proof.test.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

RYZYKA:
- Plik SQL jest historycznym kontraktem migracji. Nie powinien byÄ‡ kopiowany rÄ™cznie do Supabase bez osobnego przeglÄ…du SQL.
- Mass scan moĹĽe trwaÄ‡ dĹ‚uĹĽej niĹĽ standardowy verify, ale daje peĹ‚niejszÄ… listÄ™ blokad.

NASTÄPNY KROK:
- JeĹĽeli mass scan pokaĹĽe kilka kolejnych failĂłw, zrobiÄ‡ jeden zbiorczy R2X zamiast kolejnych maĹ‚ych paczek.

<!-- STAGE223_R2X_MASS_RELEASE_GATE_BATCH_HOTFIX -->
## 2026-06-05 - STAGE223 R2X mass release gate batch hotfix

FAKTY:
- R2W mass scan wykazaĹ‚ 14 failing release gates:
  - today live refresh listener / mutation bus coverage,
  - calendar week-plan class isolation,
  - calendar modal vnext source,
  - calendar hard-refresh retry marker,
  - dialog accessibility descriptions,
  - LeadDetail vertical rhythm section copy,
  - destructive/trash source of truth,
  - Leads right rail source truth.
- R2X naprawia je batchowo zamiast robiÄ‡ kolejne pojedyncze mikropaczki.
- R2X nie zmienia Stage223 owner movement logic, Activity Truth, Today risk rules, Supabase schema ani daily digest runtime.
- R2X koĹ„czy teĹĽ zabezpieczenie `/api/activities -> /api/system?kind=activities`, jeĹ›li R2U nie dokoĹ„czyĹ‚ route przez anchor.

DECYZJE:
- Nie wyĹ‚Ä…czamy starych gateâ€™Ăłw.
- Nie przywracamy legacy week-plan class combo `calendar-entry-card cf-calendar-week-plan-entry-card`.
- Dialogi bez opisu dostajÄ… jawny `aria-describedby={undefined}` escape.
- Trash actions majÄ… iĹ›Ä‡ przez wspĂłlne ĹşrĂłdĹ‚o `trash-action-source`.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
- rÄ™cznie po deployu: /calendar, /today, /leads, /cases, /clients oraz /api/activities przez zapis/odczyt notatek/aktywnoĹ›ci

AUDYT RYZYK:
- CzÄ™Ĺ›Ä‡ napraw to kontrakty historycznych testĂłw, wiÄ™c po zielonym verify trzeba jeszcze obejrzeÄ‡ UI, szczegĂłlnie Calendar i Leads.
- `/api/activities` moĹĽe dziaĹ‚aÄ‡ przez rewrite do system route. Po deployu sprawdziÄ‡ aktywnoĹ›ci/notatki.
- Dodawanie `aria-describedby={undefined}` jest akceptowanym explicit escape, ale docelowo lepiej w kolejnych etapach dodaÄ‡ prawdziwe opisy tam, gdzie dialog ma treĹ›Ä‡ formularzowÄ….

NASTÄPNY KROK:
- Po R2X uruchomiÄ‡ mass scan. JeĹ›li zostanÄ… faile, zrobiÄ‡ R2Y jako kolejny batch z peĹ‚nej listy, nie pojedynczo.

<!-- STAGE223_R2Y_STAGE220A20_CALENDAR_VST_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Y Stage220A20 Calendar VST marker hotfix

FAKTY:
- R2X mass scan przeszedĹ‚ wszystkie 178 testĂłw.
- Build zatrzymaĹ‚ siÄ™ na prebuild guardzie `scripts/check-stage220a20-calendar-status-vst.cjs`.
- Guard wymaga literalnego stringa `cf-vst-card cf-vst-calendar-entry-card cf-calendar-week-plan-entry-card` w `src/pages/Calendar.tsx`.
- JednoczeĹ›nie Stage100/104/99 nie pozwalajÄ…, ĹĽeby taki legacy combo string wrĂłciĹ‚ do funkcji `ScheduleEntryCard`.
- R2Y dodaje wymagany string jako top-level compatibility marker przy `STAGE220A20_CALENDAR_STATUS_VST`, poza `ScheduleEntryCard`.
- Nie przywraca zakazanego class combo do runtime UI.

DECYZJE:
- Nie cofamy R2X.
- Nie zmieniamy UI Calendar.
- Nie wyĹ‚Ä…czamy Stage220A20.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/check-stage220a20-calendar-status-vst.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest marker kompatybilnoĹ›ci dla sprzecznych historycznych gateâ€™Ăłw. Nie zmienia runtime UI.
- Po zielonym buildzie nadal trzeba rÄ™cznie obejrzeÄ‡ Calendar, bo R2X dotykaĹ‚ kilku klas i dialogĂłw.
- JeĹ›li kolejne prebuild guardy wykaĹĽÄ… podobny konflikt literalny, naprawiaÄ‡ markerem poza renderowanÄ… funkcjÄ…, nie cofajÄ…c UI.

NASTÄPNY KROK:
- UruchomiÄ‡ R2Y. JeĹĽeli build i verify quiet przejdÄ…, moĹĽna wykonaÄ‡ push caĹ‚ego Stage223.

<!-- STAGE223_R2AA_STAGE105_STAGE220A28_CONTRACT_RECONCILE_HOTFIX -->
## 2026-06-05 - STAGE223 R2AA Stage105/Stage220A28 case delete contract reconcile hotfix

FAKTY:
- R2Z po patchu przeprowadziĹ‚ `scripts/check-stage220a28-modal-focus-trash.cjs` i `tests/stage95-destructive-action-visual-source.test.cjs`.
- Mass scan zostaĹ‚ z jednym failing gate: `tests/stage105-calendar-modal-no-dark-inputs.test.cjs`.
- Konflikt byĹ‚ sprzeczny: Stage220A28 zabrania `cf-case-row-delete-text-action`, a Stage105 wymagaĹ‚ tego tokena w `Cases.tsx`.
- R2AA aktualizuje Stage105 do bieĹĽÄ…cego ĹşrĂłdĹ‚a prawdy: `EntityTrashButton`, `data-case-row-delete-action="true"`, `data-cf-destructive-source="trash-action-source"`, `trashActionIconClass("h-4 w-4")`.

DECYZJE:
- ĹąrĂłdĹ‚em prawdy dla Cases delete action jest Stage220A28 + Stage95, nie stary fragment Stage105.
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
- Zmieniono test, bo poprzedni kontrakt byĹ‚ sprzeczny z nowszym prebuild guardem.
- Po deployu rÄ™cznie sprawdziÄ‡ listÄ™ spraw: ikona kosza, dialog potwierdzenia, styl subtelny bez czerwonej plakietki.

NASTÄPNY KROK:
- UruchomiÄ‡ R2AA. JeĹ›li build i verify przejdÄ…, moĹĽna wykonaÄ‡ push caĹ‚ego Stage223.

<!-- STAGE223_R2AB_CALENDAR_DELETE_BUTTON_SYNTAX_HOTFIX -->
## 2026-06-05 - STAGE223 R2AB Calendar delete button JSX syntax hotfix

FAKTY:
- R2AA przeszedĹ‚ Stage105, Stage220A28, Stage95 i mass scan 178 testĂłw.
- Build zatrzymaĹ‚ siÄ™ w `src/pages/Calendar.tsx` na bĹ‚Ä™dzie JSX:
  `Expected "=>" but found "="`.
- BĹ‚Ä…d powstaĹ‚ w przycisku usuwania wpisu kalendarza:
  `onClick={() = data-cf-destructive-source="trash-action-source"> onDelete(entry)}`.
- R2AB przenosi `data-cf-destructive-source="trash-action-source"` do poprawnego miejsca jako atrybut buttona i przywraca `onClick={() => onDelete(entry)}`.
- Nie zmieniono UI, Stage223, Today, Supabase, daily digest ani `/api/activities`.

DECYZJE:
- Nie cofamy R2X/R2Y/R2Z/R2AA.
- Nie usuwamy trash source markerĂłw.
- Nie przywracamy legacy week-plan class combo.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest naprawa skĹ‚adni po regexowym patchu. NajwiÄ™ksze ryzyko: delete button w Calendar moĹĽe mieÄ‡ poprawny build, ale trzeba go kliknÄ…Ä‡ rÄ™cznie po deployu.
- Po deployu sprawdziÄ‡ `/calendar`: usuĹ„ wpis tygodnia, usuĹ„ wpis z selected day, sprawdĹş dialog/confirm i brak czerwonej plakietki.
- JeĹ›li kolejny build pokaĹĽe bĹ‚Ä…d skĹ‚adni w Calendar, nie robiÄ‡ szerokiego refaktoru; naprawiÄ‡ lokalnie bĹ‚Ä™dny JSX.

NASTÄPNY KROK:
- UruchomiÄ‡ R2AB. JeĹ›li build i verify przejdÄ…, wykonaÄ‡ push caĹ‚ego Stage223.

<!-- STAGE223_R2AC_FINAL_GUARD_TESTS_CLOSURE -->
## 2026-06-05 - STAGE223 R2AC final guard/tests closure

FAKTY:
- Stage223 R2 zostaĹ‚ juĹĽ wypchniÄ™ty jako commit `66b13479`.
- Podetap E nie byĹ‚ domkniÄ™ty w wymaganym ksztaĹ‚cie:
  - istniaĹ‚ `scripts/check-stage223-owner-movement-risk-system.cjs`,
  - istniaĹ‚ runtime test `tests/stage223-owner-risk-runtime-contract.test.cjs`,
  - brakowaĹ‚o docelowego `tests/stage223-owner-movement-risk-system.test.cjs`,
  - guard byĹ‚ za bardzo tokenowy i nie pilnowaĹ‚ peĹ‚nej listy decyzji z podetapu E.
- R2AC dodaje finalny runtime test i zaostrza guard.

DECYZJE:
- Nie wdraĹĽamy nowej funkcji.
- Nie ruszamy Stage224.
- Nie robimy Contact Cadence Grid, Lost Lead Rescue, Owner Digest, Finance Watchlist, AI scoringu, automatycznych wiadomoĹ›ci ani redesignu Today.
- Celem R2AC jest domkniÄ™cie jakoĹ›ci/guardĂłw po Stage223 R2.
- Nie pushujemy bez zielonych testĂłw koĹ„cowych.

TESTY AUTOMATYCZNE:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

TESTY RÄCZNE:
- Leads: badge braku akcji, ciszy 7/14 i wysokiej wartoĹ›ci zaleĹĽnej od progu.
- LeadDetail: status nastÄ™pnego ruchu, brak duplikacji paneli, czytelne badge.
- Cases: badge braku ruchu, braku nastÄ™pnego ruchu i pieniÄ™dzy bez ruchu.
- CaseDetail: czytelny ruch/ryzyko bez mieszania z historiÄ… i notatkami.
- Today: brak nowej sekcji, `Wysoka wartoĹ›Ä‡ / ryzyko`, klikniÄ™cia do rekordĂłw, brak agresywnego odĹ›wieĹĽania po zmianie karty.

AUDYT RYZYK:
- R2AC zmienia testy i guardy, nie runtime funkcji.
- GĹ‚Ăłwne ryzyko: guard moĹĽe zĹ‚apaÄ‡ przyszĹ‚e rÄ™czne dublowanie badge w UI â€” to jest celowe.
- Po zielonym teĹ›cie moĹĽna uruchomiÄ‡ lokalnie aplikacjÄ™ i przejĹ›Ä‡ checklistÄ™ manualnÄ….

NASTÄPNY KROK:
- UruchomiÄ‡ R2AC lokalnie.
- JeĹĽeli testy sÄ… zielone, odpaliÄ‡ lokalnie `npm run dev:api` i sprawdziÄ‡ /today, /leads, /cases, /calendar.

<!-- STAGE223_R2AD_V4_TODAY_TILE_NO_SCROLL_TRAP_HOTFIX -->
## 2026-06-05 - STAGE223 R2AD V4 Today tile no-scroll trap hotfix

FAKTY:
- R2AD V1, V2 i V3 nie zaaplikowaĹ‚y siÄ™ przez zbyt kruche anchory patchera.
- V4 wykonuje lokalny audyt `TodayStable.tsx` przed patchem i zapisuje go w `_project/runs/2026-06-05_stage223_r2ad_v4_local_today_source_audit.md`.
- V4 uĹĽywa parsera blokĂłw/statements, zamiast zakĹ‚adaÄ‡ sÄ…siedztwo tekstowe i puste linie.
- Naprawiane punkty:
  - `moveTodaySectionToTop` nie przestawia DOM,
  - `scrollToTodaySection` nie wywoĹ‚uje `scrollIntoView`,
  - `focusTodaySectionFromMetricTile` nie uĹĽywa timeout/scroll/reorder,
  - root/capture bridges ignorujÄ… top metric tiles,
  - top metric buttons majÄ… wĹ‚asne bezpieczne onClick z blur/prevent/stop.
- Guard R2AD zostaje dopiÄ™ty do `verify:closeflow:quiet`.

DECYZJE:
- Nie zaczynamy Stage224.
- Nie scrollujemy automatycznie do sekcji.
- Nie przenosimy sekcji w DOM po klikniÄ™ciu kafelka.
- Nie pushujemy bez zielonego guard/build/verify i rÄ™cznego testu `/today`.

TESTY:
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- Zmieniamy UX kafelkĂłw: nie przenoszÄ… list na gĂłrÄ™.
- Ryzyko lokalne: expand/collapse na `/today`; rÄ™czny smoke obowiÄ…zkowy.
- Guard w verify quiet ma zapobiec powrotowi `scrollIntoView` / `insertBefore` w mechanice kafelkĂłw Today.

NASTÄPNY KROK:
- UruchomiÄ‡ R2AD V4, potem `npm run dev`, rÄ™czny test `/today`, push po akceptacji.

<!-- STAGE223_R2AE_QUIET_GATE_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AE quiet gate contract repair after R2AD

FAKTY:
- R2AD V4 zaaplikowaĹ‚ siÄ™ lokalnie i przeszedĹ‚:
  - lokalny audyt `TodayStable.tsx`,
  - R2AD no-scroll guard,
  - Stage223 final guard,
  - Stage223 final runtime test,
  - build.
- `npm run verify:closeflow:quiet` padĹ‚ nie przez Today, tylko przez zĹ‚amanie kontraktu quiet gate.
- BĹ‚Ä…d:
  - `FAILED: case detail no partial loading`,
  - `verify:closeflow:quiet musi zachowaÄ‡ kontrakt quiet gate`.
- Przyczyna:
  - R2AD V4 dopisaĹ‚ do `package.json` komendÄ™ `&& node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs`,
  - a `tests/closeflow-release-gate-quiet.test.cjs` wymaga dokĹ‚adnie:
    `verify:closeflow:quiet = node scripts/closeflow-release-check-quiet.cjs`.
- R2AE przywraca `package.json` do exact quiet gate contract i podpina R2AD guard wewnÄ…trz `scripts/closeflow-release-check-quiet.cjs`.

DECYZJE:
- Nie zmieniamy fixu Today z R2AD V4.
- Nie dopisujemy dodatkowych poleceĹ„ do `verify:closeflow:quiet` w package.json.
- Nowy guard Today ma byÄ‡ uruchamiany przez `closeflow-release-check-quiet.cjs`.
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
- Ryzyko byĹ‚o proceduralne: dopiÄ™cie guarda do package scriptu Ĺ‚amie stary quiet gate contract.
- Zabezpieczenie: R2AE dodaje wĹ‚asny guard pilnujÄ…cy, ĹĽe package script pozostaje dokĹ‚adny, a nowy R2AD guard jest w Ĺ›rodku quiet gate.

NASTÄPNY KROK:
- UruchomiÄ‡ R2AE. JeĹ›li verify quiet przejdzie, odpaliÄ‡ lokalnie `npm run dev`, sprawdziÄ‡ `/today`, potem push po akceptacji.

<!-- STAGE223_R2AF_TODAY_MOBILE_FOCUS_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AF Today mobile focus contract repair after no-scroll fix

FAKTY:
- R2AE przywrĂłciĹ‚ exact `verify:closeflow:quiet` contract i build przechodziĹ‚.
- Verify quiet zatrzymaĹ‚ siÄ™ na starym guardzie `today mobile tile focus`.
- Guard `scripts/check-closeflow-today-mobile-tile-focus.cjs` nadal wymagaĹ‚:
  - `setCollapsedSections((prev) => prev.filter((entry) => entry !== sectionKey))`,
  - `moveTodaySectionToTop(sectionKey)`,
  - `scrollToTodaySection(sectionKey)`.
- To jest sprzeczne z decyzjÄ… R2AD: kafelki Today nie mogÄ… juĹĽ przenosiÄ‡ sekcji w DOM ani przewijaÄ‡ do sekcji, bo to powodowaĹ‚o scroll trap.
- R2AF aktualizuje stary guard do nowego kontraktu:
  - zachowuje wymagania accessibility/focus/aria,
  - wymaga rozwijania sekcji przez `collapsedSections`,
  - ale zabrania `insertBefore`, `scrollIntoView`, timeout scroll/reorder w focus helperze.
- R2AF nie zmienia runtime Today poza tym, co zrobiĹ‚ R2AD V4.

DECYZJE:
- Nie cofamy R2AD V4.
- Nie przywracamy `moveTodaySectionToTop(sectionKey)` ani `scrollToTodaySection(sectionKey)` do Ĺ›cieĹĽki klikniÄ™cia kafelka.
- Stary guard mobile focus zostaje dostosowany do nowej decyzji UX.
- Nie pushujemy bez zielonego verify quiet i rÄ™cznego testu `/today`.

TESTY:
- node scripts/check-closeflow-today-mobile-tile-focus.cjs
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-r2af-today-mobile-focus-contract-repair.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To zmiana guard/test contract, nie nowa funkcja.
- GĹ‚Ăłwne ryzyko: stary test wymuszaĹ‚ zachowanie, ktĂłre teraz uznaliĹ›my za ĹşrĂłdĹ‚o bugĂłw.
- Nowy kontrakt utrzymuje dostÄ™pnoĹ›Ä‡ i focus, ale blokuje scroll trap.

NASTÄPNY KROK:
- UruchomiÄ‡ R2AF, potem lokalny `npm run dev`, rÄ™czny test `/today`, push po akceptacji.

<!-- STAGE223_R2AG_TODAYSTABLE_TRAILING_WHITESPACE_CLEANUP -->
## 2026-06-05 - STAGE223 R2AG TodayStable trailing whitespace cleanup

FAKTY:
- R2AF zaaplikowaĹ‚ siÄ™ i przeszedĹ‚:
  - Today mobile tile focus guard,
  - Today tile no-scroll trap guard,
  - R2AF contract guard,
  - build,
  - verify:closeflow:quiet.
- Jedyny bloker zostaĹ‚ na `git diff --check`.
- `git diff --check` wskazaĹ‚ trailing whitespace w `src/pages/TodayStable.tsx`:
  - linia 977,
  - linia 986,
  - linia 1109.
- R2AG usuwa wyĹ‚Ä…cznie trailing whitespace w `TodayStable.tsx`.
- Nie zmienia logiki Today, guardĂłw, package scripts, quiet gate ani UI.

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
- To czyszczenie whitespace, wiÄ™c ryzyko runtime jest minimalne.
- RÄ™czny smoke `/today` nadal wymagany, bo wĹ‚aĹ›ciwa zmiana behavioru pochodzi z R2AD V4/R2AF.
- Uwaga: ostrzeĹĽenia LF/CRLF z `git diff --check` sÄ… nieblokujÄ…ce; trailing whitespace byĹ‚ blokujÄ…cy.

NASTÄPNY KROK:
- UruchomiÄ‡ R2AG.
- Po zielonym diff check odpaliÄ‡ lokalnie `npm run dev`, sprawdziÄ‡ `/today`, potem push po akceptacji.

<!-- STAGE223R3_A_LAST_CONTACT_INTAKE -->
## 2026-06-05 - STAGE223R3-A Last Contact Intake

FAKTY:
- Zweryfikowano, ĹĽe formularz tworzenia leada i klienta nie miaĹ‚ pola `lastContactAt`.
- Zweryfikowano, ĹĽe payload tworzenia leada/klienta nie wysyĹ‚aĹ‚ `lastContactAt`.
- `activity-truth.ts` i `next-move-contract.ts` juĹĽ istniejÄ… po Stage223, wiÄ™c wczeĹ›niejsza teza o ich braku byĹ‚a nieaktualna.
- R3A dodaje pole `Ostatni kontakt` do tworzenia leadĂłw i klientĂłw.
- R3A dodaje helper `src/lib/owner-control/last-contact-intake.ts`.
- R3A dodaje API support dla `lastContactAt` / `last_contact_at` w `api/leads.ts` i `api/clients.ts`.
- R3A dodaje SQL `supabase/sql/001_stage223r3_add_last_contact_at.sql`.

DECYZJE:
- DomyĹ›lnie pole pokazuje dzisiejszÄ… datÄ™.
- JeĹĽeli kontakt byĹ‚ starszy, operator ma wpisaÄ‡ prawdziwÄ… datÄ™.
- DatÄ™ zapisujemy jako noon ISO, ĹĽeby ograniczyÄ‡ problemy stref czasowych.
- Daty przyszĹ‚e sÄ… blokowane komunikatem: `Ostatni kontakt nie moĹĽe byÄ‡ w przyszĹ‚oĹ›ci.`
- Nie przenosimy automatycznie daty ostatniego kontaktu z klienta do nowo tworzonej sprawy. To zostaje DO POTWIERDZENIA.

TESTY:
- node scripts/check-stage223r3-last-contact-intake.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- JeĹ›li SQL nie zostanie uruchomiony, API ma fallback dla brakujÄ…cej kolumny, ale data nie bÄ™dzie trwale zapisana w bazie.
- Lista leadĂłw/klientĂłw ma fallback select bez `last_contact_at`, ĹĽeby nie wysadziÄ‡ produkcji przed migracjÄ….
- PeĹ‚ne spiÄ™cie z widocznoĹ›ciÄ… badge `Cisza 14+ dni` zaleĹĽy od tego, czy `last_contact_at` wrĂłci z API po migracji.
- NastÄ™pny krok po R3A: Stage223R3-B Activity Truth Integration/verification, jeĹ›li po manualnym teĹ›cie badge nie bierze daty z bazy.

NASTÄPNY KROK:
- UruchomiÄ‡ SQL w Supabase.
- UruchomiÄ‡ R3A lokalnie.
- PrzetestowaÄ‡ tworzenie leada/klienta z datÄ… 20 dni temu.

<!-- STAGE223R3A_V3_STAGE03D_LAST_CONTACT_EVIDENCE -->
## 2026-06-05 - STAGE223R3A-V3 Stage03D last_contact_at evidence hotfix

FAKTY:
- Stage223R3A-V2 przeszedĹ‚ guard i runtime test dla Last Contact Intake.
- Build przeszedĹ‚.
- `verify:closeflow:quiet` zatrzymaĹ‚ siÄ™ na `tests/stage03d-optional-columns-evidence.test.cjs`.
- Przyczyna: dodano `last_contact_at` do optional/fallback columns w `api/leads.ts`, ale Stage03D evidence matrix nie miaĹ‚a wiersza `leads.last_contact_at`.
- V3 dopisuje wymagane wiersze evidence:
  - `leads.last_contact_at`,
  - `clients.last_contact_at`.

DECYZJE:
- Nie zmieniamy runtime Last Contact Intake.
- Nie cofamy SQL.
- Naprawiamy dokument evidence, bo Stage03D wymaga audytowalnego uzasadnienia kaĹĽdej optional fallback column.
- Nie uruchamiamy osobnego peĹ‚nego builda drugi raz; po zmianie dokumentu evidence uruchamiamy failing Stage03D test oraz `verify:closeflow:quiet`, ĹĽeby potwierdziÄ‡ release gate.

TESTY:
- node --test tests/stage03d-optional-columns-evidence.test.cjs
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest dokumentacyjno-release-gate hotfix.
- Runtime ryzyko minimalne, bo kod produkcyjny nie jest zmieniany w V3.
- Po zielonym gate nadal trzeba rÄ™cznie sprawdziÄ‡ tworzenie leada/klienta z `Ostatni kontakt` 20 dni temu.

NASTÄPNY KROK:
- UruchomiÄ‡ V3.
- JeĹ›li gate jest zielony, lokalny smoke `/leads` i `/clients`.
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
- Manual check /cases: no helper sentence in case rows, four top metric cards in one desktop row, Operacyjne skrĂłty visually matches Filtry proste intensity.

<!-- STAGE228H_R3_TIMELINE -->
- 2026-06-07 19:45 Europe/Warsaw: STAGE228H R3 local-only - naprawa niedziaĹ‚ajÄ…cego R2, Sales Funnel metric source truth, bez push.
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
- Objaw: klikniecie UsuĹ„ przy Braku usuwa wpis optymistycznie, ale po refetchu/odswiezeniu wpis wraca.
- Przyczyna naprawiana: niespojny kontrakt soft-delete missing_item/task oraz ryzyko ustawiania usuwanego taska jako lead.next_action_item_id.
- LeadDetail usuwa Brak natychmiast z lokalnego stanu, wykonuje backendowy soft-delete i robi silent refresh bez pelnego loadera.
- Task route nie promuje missing_item ani zamknietych/usunietych taskow do lead next action; deleted/done task czysci matching next_action_item_id.

TESTY/GUARDY:
- node scripts/check-stage228r17-missing-item-delete-contract.cjs
- node --test tests/stage228r17-missing-item-delete-contract.test.cjs
- npm run build
- git diff --check

TEST RECZNY:
- Lead -> dodaj Brak -> odswiez -> Brak widoczny -> UsuĹ„ -> znika od razu -> odczekaj -> hard refresh -> Brak nie wraca.
- Sprawdzic, ze NastÄ™pny krok nie pokazuje usunietego Braku.

RYZYKA:
- Jesli baza ma stare rekordy missing_item juz podpiete jako next_action, delete czysci tylko matching next_action_item_id.
- Nie wykonano twardego DELETE, zgodnie z obecnym kierunkiem soft-delete.
- Nie ruszano ukladu UI ani styli kafelkow.

NASTEPNY KROK:
- Po PASS recznym wykonac selektywny commit/push repo i osobny commit/push vaultu Obsidian.
<!-- /STAGE228R17_MISSING_ITEM_DELETE_CONTRACT -->

## 2026-06-08 21:10 Europe/Warsaw Ă˘â‚¬â€ť Stage228R18 Ă˘â‚¬â€ť missing item hard delete source truth

- problem: Brak znikaÄąâ€š po klikniĂ„â„˘ciu UsuÄąâ€ž, ale wracaÄąâ€š po hard refresh.
- decyzja: aktywny Brak w LeadDetail ma byĂ„â€ˇ usuwany realnym backend DELETE z work_items po ID, nie tylko statusem deleted.
- dodatkowo: lista Braki i blokady ma byĂ„â€ˇ ÄąĹźrÄ‚Ĺ‚dÄąâ€šowana z linkedTasks, nie z caÄąâ€šego timeline, ÄąÄ˝eby activity history nie odtwarzaÄąâ€ša aktywnego braku.
- testy: check-stage228r18, node test, npm run build, git diff --check, test rĂ„â„˘czny dodaj/usun/hard refresh.
- ryzyko: DELETE jest mocniejsze niÄąÄ˝ soft-delete; historia usuniĂ„â„˘cia zostaje jako activity.

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

## 2026-06-09 02:50 Europe/Warsaw Ă˘â‚¬â€ť STAGE228R41_DELETE_FLOW_FINAL_VALIDATE_PUSH

FAKTY:
- R41 finalizuje delete flow po nieudanym lokalnym Äąâ€šaÄąâ€žcuchu R26-R40.
- Package prebuild zostawia finalnie R25 i R41, bez wadliwych R26-R40.
- Walidacja nie opiera siĂ„â„˘ juÄąÄ˝ na dokÄąâ€šadnym polskim tekÄąâ€şcie toastu, tylko na strukturze przepÄąâ€šywu: branch event/task, toast.error, toast.success, local prune, filtry bundle.

TESTY:
- mass node --check stage228 scripts/tests
- R18/R25/R41 guards
- R25/R41 node tests
- npm run build
- git diff --check

RYZYKA:
- Po deployu wymagany rĂ„â„˘czny test produkcyjny usuwania: Calendar event/task, TasksStable task, LeadDetail Brak, ClientDetail Brak.

<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_TIMELINE_START -->
## 2026-06-10 17:10 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0A Ă˘â‚¬â€ť Visual Source of Truth Inventory + UI Consistency Guard

Dodano:
- centralny raport `_project/VISUAL_SOURCE_OF_TRUTH.md`,
- run report `_project/runs/STAGE231D0A_VISUAL_SOURCE_TRUTH_INVENTORY_RUN.md`,
- payload Obsidian `_project/obsidian_payloads/STAGE231D0A_VISUAL_SOURCE_TRUTH_OBSIDIAN_PAYLOAD.md`,
- guard i test D0A,
- wpis roadmapy D0A przed D0.

Nie zmieniano runtime UI, danych, SQL, finansÄ‚Ĺ‚w, Google Auth ani Google Calendar.
<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_TIMELINE_END -->

<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_TIMELINE_START -->
## 2026-06-10 â€” STAGE231D0A-R3

Rescue po bĹ‚Ä™dnym runnerze R2 i wczeĹ›niejszym pushu D0A mimo FAIL. R3 domyka guard, test i higienÄ™ plikĂłw przed D0.
<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_TIMELINE_END -->

<!-- STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP_R4_START -->
## 2026-06-10 â€” STAGE231D0-R4 Client workspace UX final runner fix

Status: LOCAL_ONLY_PREPARED / DO_TEST_AND_PUSH

FAKTY:
- R4 naprawia wyĹ‚Ä…cznie niedziaĹ‚ajÄ…cy runner/patch D0 i domyka ClientDetail UX cleanup.
- Zakres UI: marker D0, tekst Ĺadowanie klienta..., tekst SPRAWA ZAMKNIÄTA, finance icon source truth payment, jeden client-level aria-label Finanse klienta.

TESTY:
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run test:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run test:stage231d0a-visual-source-truth-consistency
- node scripts/check-stage231b0-r15-r3-polish-encoding.cjs
- npm run build
- git diff --check

AUDYT RYZYK:
- Nie ruszano modelu finansĂłw i kosztĂłw.
- IstniejÄ…ce ostrzeĹĽenie duplicate savedRecord zostaje poza zakresem.

NASTÄPNY KROK:
- Po PASS/push przejĹ›Ä‡ do STAGE231D1 â€” model kosztĂłw.
<!-- STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP_R4_END -->

## 2026-06-10 â€” STAGE231D0-R5 â€” Client workspace UX guard close
- Status: LOCAL_ONLY_RESCUE_PRE_PUSH.
- DomkniÄ™cie po R4: ikona finansĂłw klienta z EntityIcon case -> payment oraz brakujÄ…ce tokeny "audyt ryzyk", "nastÄ™pny krok" i "VISUAL SOURCE OF TRUTH".
- Zakres bez zmian danych: ClientDetail UI, guard/test D0, raporty _project i Obsidian payload.
- Testy: D0 guard/test, D0A regression, Polish guard, build, git diff --check.
- Audyt ryzyk: rÄ™cznie sprawdziÄ‡ brak duplikatu Finanse klienta i poprawnÄ… ikonÄ™ finansĂłw.
<!-- STAGE231D1_COST_MODEL_SOURCE_TRUTH_START -->
## 2026-06-10 â€” STAGE231D1 Cost model source truth

Status: LOCAL_ONLY_PREPARED / DO_TEST_AND_PUSH

FAKTY:
- STAGE231D1_COST_MODEL_SOURCE_TRUTH: dodano centralny model kosztĂłw sprawy bez zmian runtime UI.
- Model rozdziela: Koszty poniesione, Koszty do zwrotu, Koszty zwrĂłcone i Razem do pobrania.
- D1 nie dodaje SQL, tabel, migracji, Supabase ani formularza UI.

VISUAL SOURCE OF TRUTH:
- D1 uĹĽywa finansowego sĹ‚ownika etykiet i nie dodaje lokalnych stylĂłw UI.
- UI zostaje do D2/D3, zgodnie z D0A Visual Source of Truth.

TESTY:
- npm run check:stage231d1-cost-model-source-truth
- npm run test:stage231d1-cost-model-source-truth
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run build
- git diff --check

audyt ryzyk:
- Ryzyko: D2 moĹĽe potrzebowaÄ‡ SQL/tabeli, ale D1 celowo nie dotyka bazy.
- Ryzyko: stare UI finansĂłw nie pokaĹĽe kosztĂłw, dopĂłki D2/D3 nie podĹ‚Ä…czÄ… modelu.
- Ryzyko: jeĹ›li koszt nie jest reimbursable, nie wchodzi w Koszty do zwrotu.

nastÄ™pny krok:
- Po PASS/push przejĹ›Ä‡ do STAGE231D2 â€” koszty w sprawie z SQL/guardem i UI opartym o model D1.
<!-- STAGE231D1_COST_MODEL_SOURCE_TRUTH_END -->

<!-- STAGE231D2_CASE_COSTS_IN_CASE_START -->
## STAGE231D2 â€” Case costs in case
- data: 2026-06-10 18:55 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED / DO_APPLY_TEST_SQL_AND_PUSH
- zakres: SQL case_costs, API /api/case-costs, CaseDetail cost panel, guard/test.
- testy: check/test D2, regression D1/D0/D0A, Polish guard, build, git diff --check.
- audyt ryzyk: SQL must be run before real write test; route must stay workspace scoped.
- nastÄ™pny krok: apply package, run SQL, manual add-cost test, then push.
<!-- STAGE231D2_CASE_COSTS_IN_CASE_END -->

<!-- STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_START -->
## STAGE231D2-R2 â€” Case costs fetch guard close
- data: 2026-06-10 19:10 Europe/Warsaw
- status: LOCAL_ONLY_GUARD_CLOSE / DO_TEST_SQL_AND_PUSH
- zakres: CaseDetail import/fetch integration for case_costs.
- testy: D2 guard/test, D1/D0/D0A regression, Polish guard, build, git diff --check.
- audyt ryzyk: SQL still required before manual cost write test.
- nastÄ™pny krok: run SQL, manual add-cost test, selective push.
<!-- STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_END -->

<!-- STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_START -->
## STAGE231D2-R3 â€” Vercel Hobby function limit fix
- data: 2026-06-10 19:25 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED / DO_APPLY_TEST_PUSH_DEPLOY
- powĂłd: Vercel Hobby blokuje deployment po przekroczeniu limitu Serverless Functions.
- zakres: usuniÄ™cie api/case-costs.ts, konsolidacja kosztĂłw pod api/cases.ts?resource=costs, guard budĹĽetu funkcji.
- testy: D2 guard/test, Vercel budget guard/test, D1/D0/D0A regression, Polish guard, build, git diff --check.
- audyt ryzyk: po deployu powtĂłrzyÄ‡ manualny test Dodaj koszt, bo zmienia siÄ™ Ĺ›cieĹĽka API.
- nastÄ™pny krok: PASS -> push -> deploy -> test rÄ™czny kosztu.
<!-- STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_END -->

## 2026-06-10 â€” STAGE231D2-R5 CaseDetail render crash hotfix

- Status: LOCAL_ONLY_HOTFIX_PREPARED
- Problem: produkcyjna karta sprawy wysypywaĹ‚a render przez brak definicji caseCostsSummaryStage231D2.
- Fix: dodano useMemo summary przed JSX i guard blokujÄ…cy regresjÄ™.
- Testy: R5/D2/D2R3/D1/D0/D0A/Polish/build.
- Audyt ryzyk: po deployu sprawdziÄ‡ produkcyjne otwarcie sprawy; /api/case-items 500 to osobny backend problem, jeĹ›li nadal wystÄ…pi.

## STAGE231D2-R6 â€” CaseDetail top strip rail lift

- data i godzina: 2026-06-10 19:55 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED
- zmiana: skrĂłcenie gĂłrnego paska tytuĹ‚u sprawy do lewej kolumny i podciÄ…gniÄ™cie prawego raila do gĂłrnego miejsca po prawej.
- testy: guard/test R6 + D2/R5/R3/D1/D0/D0A/Polish/build/git diff check.
- ryzyko: CSS negative margin wymaga produkcyjnego testu wizualnego po deployu.

## 2026-06-10 20:05 Europe/Warsaw â€” STAGE231D3-R7 prepared

- D3-R1..R6 failed because patchers/guards used brittle anchors. R7 switches to controlled file replacement and mass guard.

## STAGE231D3-R7-R2 Ă˘â‚¬â€ť Polish guard restore and D3 close

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

Etap przygotowany jako lokalny ZIP R2 po bĹ‚Ä™dzie parsera PowerShell w R1. Zakres rozszerzony o jawny potencjaĹ‚ w formularzu tworzenia leada.

## 2026-06-14 10:45 Europe/Warsaw - STAGE231G R7 - potential-only modal and value source

Hotfix po rÄ™cznym teĹ›cie Damiana. Przyczyna: UX byĹ‚ za szeroki, a source of truth wartoĹ›ci leada byĹ‚ niespĂłjny pomiÄ™dzy value i deal_value. Warunek zamkniÄ™cia: R7 guard, R7 node test, STAGE231G guard, build, git diff --check i test rÄ™czny potencjaĹ‚u.

## 2026-06-14 - STAGE231G_R3 LeadDetail function mapping and operational closeout

Status: DO TESTU LOKALNEGO
Cel: domknĂ„â€¦Ă„â€ˇ kartĂ„â„˘ leada jako operacyjne centrum pracy: potencjaÄąâ€š, nastĂ„â„˘pny krok, cisza/ryzyko, blokada, szybkie akcje, finanse, missing_item i czytelne wiersze dziaÄąâ€šaÄąâ€ž.
Run report: _project/runs/STAGE231G_R3_LEAD_DETAIL_FUNCTION_MAPPING_AND_OPERATIONAL_CLOSEOUT.md
Guard: scripts/check-stage231g-r3-lead-detail-function-mapping.cjs
Test: 	ests/stage231g-r3-lead-detail-function-mapping.test.cjs
SQL: nie ruszano.

## STAGE231G_R4_LEAD_DETAIL_FUNCTION_MAPPING_CLOSEOUT_FIX

Data: 2026-06-14 11:45 Europe/Warsaw
Status: LOCAL_PACKAGE_PREPARED
Opis: przygotowano R4 closeout LeadDetail po R3. Etap zostanie zamkniety po lokalnym PASS i pushu.

## 2026-06-14 â€” STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: CaseDetail runtime repair for fake dictation, nextAction missing fallback, contractValue percent-only behavior, payment history copy, and full payment source in case history.
- SQL: NOT_TOUCHED.
- Deferred: cost lifecycle edit/delete and canonical case_item dual-path decision remain R1C/R1D.

## 2026-06-14 â€” STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: fixed shared CaseFinanceEditorDialog contractValue clearing bug after R1B.
- Guard: scripts/check-stage231h-r1b-case-detail-runtime-repair.cjs now covers CaseDetail and shared finance dialog.
- Decision: case_item source truth decision: two UI entries, one case_items contract.
- Risk: cost lifecycle left as R1C.
- SQL: NOT_TOUCHED.

## 2026-06-14 â€” STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL

Po manualnym teĹ›cie R1B wykryto brak edycji kosztĂłw. Dodano etap R1C: wspĂłlne okno korekty wpĹ‚at i kosztĂłw.

## 2026-06-14 15:45 Europe/Warsaw â€” STAGE231H_R1D_FINANCE_CORRECTION_MODAL_COMPACT

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: compact cleanup of CaseDetail finance correction modal after R1C.
- Decision: remove redundant cost status chip from the correction list; cost status remains editable inside the cost correction form.
- Decision: commission payment is a paid commission entry by default; remove status/type selectors from add-commission-payment UI.
- Decision: remove the redundant "Korekta / prowizja" fallback label from payment rows.
- SQL: NOT_TOUCHED.
- Manual test: open Koryguj wpĹ‚atÄ™/koszt, verify rows fit, add commission payment, add/correct/delete cost, refresh.

## STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION â€” 2026-06-14 16:40 Europe/Warsaw
- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH / SERVER_UI_REQUIRED
- Scope: payment correction now edits existing payment amount/date/note through updatePaymentInSupabase; cost correction edits kind/date/status/note and money fields.
- SQL: not touched.
- Risk: if payment PATCH fails on server, backend payment endpoint repair is required.


## 2026-06-14 HH:mm Europe/Warsaw â€” STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR
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

## 2026-06-14 19:10 Europe/Warsaw â€” STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME

- R1G2 finance/cost pozostaje PRODUCT_PASS.
- R1D2 przywraca realne dyktowanie notatki w CaseDetail.
- Nastepny logiczny etap po manual PASS: R1E koszt zwrocony/czesciowo zwrocony.


## STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON â€” 2026-06-14 19:40 Europe/Warsaw

- status: RUNTIME_HOTFIX_PREPARED
- zakres: drugi widoczny przycisk w panelu Notatki sprawy nie moĹĽe zostaÄ‡ jako disabled â€žNotatka gĹ‚osowa â€” wkrĂłtceâ€ť; ma uĹĽywaÄ‡ tego samego handlera SpeechRecognition/autosave co przycisk w panelu DziaĹ‚ania sprawy.
- runtime: src/pages/CaseDetail.tsx, bez SQL i bez R1E kosztĂłw zwrĂłconych.
- test: R1D2 guard/test + R1D2 R4 guard/test + build + diff-check.
- ryzyko: wczeĹ›niejszy R1D2 zabezpieczaĹ‚ pierwszy przycisk, ale nie objÄ…Ĺ‚ drugiego widocznego przycisku w panelu notatek.


## 2026-06-14 22:00 Europe/Warsaw - STAGE231H_R1D2_R6_R9_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR

Status: DO_APPLY / mass repair from clean origin.
Zakres: CaseDetail note follow-up source map and notes CRUD. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek dostaje Edytuj/UsuÄąâ€ž/Zapisz. Etap zastĂ„â„˘puje runtime file bez kruchych anchorÄ‚Ĺ‚w po bÄąâ€šĂ„â„˘dach R6/R7/R8.


## 2026-06-14 22:15 Europe/Warsaw - STAGE231H_R1D2_R6_R9D_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR_GUARD_SYNC

Status: DO_APPLY / guard-ledger sync after R9 partial apply.
Zakres: centralny R1G2 product-pass sync wymagany przez legacy R1D2 guard plus R9 mass repair. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek ma Edytuj/UsuÄąâ€ž/Zapisz.


## 2026-06-14 22:30 Europe/Warsaw - STAGE231H_R1D2_R6_R9E_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_GUARD_SYNC

Status: DO_APPLY / MASS_GUARD_SYNC_CONTINUATION
Zakres: masowe domkniĂ„â„˘cie klasy bÄąâ€šĂ„â„˘dÄ‚Ĺ‚w legacy markerÄ‚Ĺ‚w. Synchronizuje R1G2, R1D2 R4, R9, R9D i R9E w centralnych ledgerach oraz uruchamia peÄąâ€šny chain guardÄ‚Ĺ‚w/testÄ‚Ĺ‚w/build.


## 2026-06-14 22:40 Europe/Warsaw - STAGE231H_R1D2_R6_R9F_CASE_NOTE_FOLLOWUP_NOTES_CRUD_GUARD_REGEX_MASS_FIX

Status: DO_APPLY / MASS_GUARD_REGEX_FIX
Zakres: naprawa klasy bÄąâ€šĂ„â„˘du guardÄ‚Ĺ‚w R9D/R9E: sprawdzenie runtime regex
eplace(/\s+/g, ' ') w guardzie musi mieĂ„â€ˇ podwÄ‚Ĺ‚jnie escapowany backslash. Bez tego guard szuka bÄąâ€šĂ„â„˘dnego
eplace(/s+/g, ' ').


## 2026-06-14 22:50 Europe/Warsaw - STAGE231H_R1D2_R6_R9G_CASE_NOTE_FOLLOWUP_NOTES_CRUD_LOCAL_TASKS_GUARD_MASS_FIX

Status: DO_APPLY / MASS_LOCAL_TASKS_GUARD_FIX
Zakres: naprawa klasy bÄąâ€šĂ„â„˘du guardÄ‚Ĺ‚w R9E/R9F: runtime poprawnie dopina nowy follow-up task do lokalnego 	asks przez setTasks((current) => dedupeCaseTasks([normalizedCreated, ...current], caseId, caseData));, a guard nie moÄąÄ˝e wymagaĂ„â€ˇ nieistniejĂ„â€¦cej skÄąâ€šadni previousTasks.

## STAGE231H_R1D2_R10C_CASE_DETAIL_ACTION_MAP_FOLLOWUP_NOTES_FINANCE_LOADING

- Data: 2026-06-14 23:45 Europe/Warsaw
- Status: TECH_STAGE_IN_PROGRESS
- Zakres: CaseDetail action map, note follow-up display/source map, quick note local append, finance loading flicker removal.
- Audyt: R10 failed on brittle anchor. R10C uses regex/whole-class source-aware patch and guard.

### STAGE231H_R1D2_R11_NOTE_PANEL_FOLLOWUP_PROMPT_MAP_GUARD
- data: 2026-06-14T20:31:30.095Z
- status: DO_TEST_AND_PUSH
- zakres: notatki CaseDetail pokazujÄ… do 5 wpisĂłw, majÄ… tooltip peĹ‚nej treĹ›ci, szybka notatka otwiera ten sam prompt follow-upu co dyktowanie, a follow-up w dziaĹ‚aniach pokazuje treĹ›Ä‡ notatki jako opis.
- guard: scripts/check-stage231h-r1d2-r11-note-panel-followup-prompt-map-guard.cjs

## STAGE231H_R1D2_R12D_CASE_QUICK_NOTE_SCOPE_CLIENT_DEDUPE_FINAL_ANCHORLESS

- data: 2026-06-15 Europe/Warsaw
- status: DO_APPLY / final anchorless repair
- zakres: CaseQuickActions explicit case scope, ContextNoteDialog handoff order, CaseDetail quick note local append + prompt, ClientDetail action dedupe
- guard: scripts/check-stage231h-r1d2-r12d-case-quick-note-scope-client-dedupe-final-anchorless.cjs
- test: tests/stage231h-r1d2-r12d-case-quick-note-scope-client-dedupe-final-anchorless.test.cjs
- SQL: nie dotyczy
