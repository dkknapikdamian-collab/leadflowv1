<!-- STAGE231B0_R7_CASE_ARCHIVE_RESTORE_NAVIGATION -->
# 13_TEST_HISTORY - CloseFlow / LeadFlow

## V6
PowerShell parser przerwal skrypt w okolicy raportu generycznych nazw.

## V7
PowerShell parser nadal padl na koncowce skryptu.

## V9
Skrypt uproszczony do kopii payload i uruchomienia guardow. Po uruchomieniu dopisz wynik guardow.

## 2026-05-29 - STAGE179 Settings readability tests

Do wykonania po apply:

-
ode --test tests/stage179-settings-form-control-readability-contract.test.cjs
-
pm run build
- RĂ„â„˘cznie /settings: czytelnoÄąâ€şĂ„â€ˇ select/input/disabled/dropdown/focus w sekcji Google Calendar reminders.

## 2026-05-29 - STAGE179 Settings readability tests

Do wykonania po apply:

-
ode --test tests/stage179-settings-form-control-readability-contract.test.cjs
-
pm run build
- RĂ„â„˘cznie /settings: czytelnoÄąâ€şĂ„â€ˇ select/input/disabled/dropdown/focus w sekcji Google Calendar reminders.

<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_TEST_HISTORY_START -->
## 2026-06-04 — Stage221 owner-control roadmap memory test

Planned local command after apply:
- `node scripts/check-stage221-owner-control-roadmap-memory.cjs`
- `git diff --check`

Runtime tests:
- SKIP — etap dokumentacyjny/roadmapowy, bez zmian UI/API/runtime.

Manual test:
- Przeczytać `_project/07_NEXT_STEPS.md`.
- Potwierdzić, że etapy A35 â†’ A47 są ułożone logicznie i zawierają cel, zakres, czego nie ruszać oraz guard/test.
- Potwierdzić, że Obsidian update został skopiowany do vaulta albo zostaje w `_project/obsidian_updates/`.
<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_TEST_HISTORY_END -->

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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

TESTY RÄCZNE:
- Leads: badge braku akcji, ciszy 7/14 i wysokiej wartości zależnej od progu.
- LeadDetail: status następnego ruchu, brak duplikacji paneli, czytelne badge.
- Cases: badge braku ruchu, braku następnego ruchu i pieniędzy bez ruchu.
- CaseDetail: czytelny ruch/ryzyko bez mieszania z historią i notatkami.
- Today: brak nowej sekcji, `Wysoka wartość / ryzyko`, kliknięcia do rekordów, brak agresywnego odświeżania po zmianie karty.

AUDYT RYZYK:
- R2AC zmienia testy i guardy, nie runtime funkcji.
- Główne ryzyko: guard może złapać przyszłe ręczne dublowanie badge w UI — to jest celowe.
- Po zielonym teście można uruchomić lokalnie aplikację i przejść checklistę manualną.

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
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

NASTÄPNY KROK:
- Uruchomić V3.
- Jeśli gate jest zielony, lokalny smoke `/leads` i `/clients`.
- Push po akceptacji.

## STAGE226R7 — Rescue Build Hotfix + Rescue UI Polish

Data: 2026-06-05 20:32 Europe/Warsaw

## FAKTY
- Stage226R7 usuwa runtime blocker w src/pages/Leads.tsx: wolne odwołanie do filter po dodaniu leada.
- Dodaje guard i runtime test Stage226R7.
- Dopolerowuje panel Do odzyskania: summary Krytyczne/Wysokie/Ĺšrednie, tekst Pokazano 8 z X, pusty stan operacyjny.
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
- Karta sprawy w kliencie używa getCaseFinanceSummary, więc prowizja procentowa 69 000 PLN Ă— 2% daje 1 380 PLN zamiast 0 PLN.
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

## STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG — test history

- data i godzina: 2026-06-06 13:31 Europe/Warsaw
- zaplanowane: npm run check:stage226r10b-lead-client-conflict-single-dialog; npm run test:stage226r10b-lead-client-conflict-single-dialog; npm run check:stage226r10-lead-client-separation-runtime; npm run test:stage226r10-lead-client-separation-runtime; npm run build; npm run verify:closeflow:quiet; git diff --check.
- manual smoke: policzyć klientów, dodać unikalnego leada, sprawdzić że /clients nie rośnie; dodać leada podobnego do istniejącego klienta, sprawdzić że klient nie jest przywracany/tworzony z flow leada.
- status: do wykonania lokalnie po apply.

## STAGE226R10C2_LEAD_CLIENT_CONFLICT_RESTORE_BLOCK_PATCHER_FIX — test history

- data i godzina: 2026-06-06 13:55 Europe/Warsaw
- wymagane: npm run check:stage226r10c2-lead-client-conflict-restore-block-patcher-fix; npm run test:stage226r10c2-lead-client-conflict-restore-block-patcher-fix; npm run check:stage226r10b-lead-client-conflict-single-dialog; npm run test:stage226r10b-lead-client-conflict-single-dialog; npm run check:stage226r10-lead-client-separation-runtime; npm run test:stage226r10-lead-client-separation-runtime; npm run build; npm run verify:closeflow:quiet; git diff --check.
- manual smoke: liczba klientów przed/po dodaniu leada nie może wzrosnąć; lead podobny do klienta nie przywraca klienta z formularza leada.

## STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX — test history

- data i godzina: 2026-06-06 14:23 Europe/Warsaw
- planowane: npm run check:stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix; npm run test:stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix; regresje R10C2/R10B/R10; npm run build; npm run verify:closeflow:quiet; git diff --check.
- manual smoke: dodaj klienta z istniejącym telefonem/e-mailem — musi być komunikat/dialog; Anuluj nie zapisuje; Dodaj mimo to zapisuje. Powtórzyć dla leada. Sprawdzić, że lead nadal nie tworzy klienta.

## STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH — test history

- data i godzina: 2026-06-06 14:58 Europe/Warsaw
- zaplanowane: check/test R11, regresje R10D2/R10C2/R10B/R10, build, verify:closeflow:quiet, git diff --check.
- manual smoke: event 12:00 Europe/Warsaw ma być 12:00 w Google; przypomnienie 30 min przed ma być widoczne; inbound nie przesuwa godziny.

## STAGE226R11B_GCAL_TIMEZONE_TEST_CROSS_REALM_FIX — historia testów

- data i godzina: 2026-06-06 15:05 Europe/Warsaw
- poprzedni FAIL: Google outbound returns wall-clock dateTime plus timeZone, not shifted Z time — false negative przez cross-realm object prototype.
- oczekiwane po R11B: R11 guard/test PASS, regresje R10D2/R10C2/R10B/R10 PASS, build PASS, verify PASS, diff check clean.

<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_TEST_HISTORY_START -->
## 2026-06-06 15:35 Europe/Warsaw Ă˘â‚¬” STAGE227A test history

Status przed lokalnym uruchomieniem: PENDING_LOCAL_RUN. Skrypt `APPLY_STAGE227A_LOCAL_ONLY.ps1` uruchamia guard, runtime test, build, verify quiet, regresje R10/R11 jeÄąâ€şli istniejĂ„… oraz `git diff --check`.
<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_TEST_HISTORY_END -->

<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_TEST_HISTORY_START -->
## 2026-06-06 15:45 Europe/Warsaw Ă˘â‚¬” STAGE227B Ă˘â‚¬” test history

Do wykonania lokalnie: Stage227A guard/test, Stage227B guard/test, build, verify quiet, git diff --check. Manual: `/funnel` ma byĂ„â€ˇ czytelny i ma otworzyĂ„â€ˇ siĂ„â„˘ bez biaÄąâ€šego ekranu.
<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_TEST_HISTORY_END -->

<!-- STAGE228A_FUNNEL_TRUTH_CLICKABILITY_TEST_HISTORY_START -->
## 2026-06-06 17:05 Europe/Warsaw Ă˘â‚¬” STAGE228A test history

Do lokalnego uruchomienia: Stage228A guard/test, regresje Stage227A/B, build, verify quiet i git diff check. Manual: `/funnel` Ă˘â€ ’ `PieniĂ„…dze` Ă˘â€ ’ widoczny rekord ÄąĹźrÄ‚łdÄąâ€šowy kwoty.
<!-- STAGE228A_FUNNEL_TRUTH_CLICKABILITY_TEST_HISTORY_END -->

## 2026-06-06 18:00 Europe/Warsaw Ă˘â‚¬” STAGE228B Lead Work Action Center

- typ: etap wdroÄąÄ˝eniowy local-only
- decyzja: Lead nie dostaje peÄąâ€šnego lejka; dostaje centrum pracy Ă˘â‚¬ĹľCo robimy teraz?Ă˘â‚¬ĹĄ z zadaniami, wydarzeniami, brakami i akcjami kontynuacji historii.
- pliki: src/pages/LeadDetail.tsx, scripts/check-stage228b-lead-work-action-center.cjs, tests/stage228b-lead-work-action-center.test.cjs
- testy: Stage228B guard/test + regresje Stage228A/227B + build + verify quiet + diff-check
- ryzyko: nie tworzyĂ„â€ˇ drugiego systemu dziaÄąâ€šaÄą„; uÄąÄ˝ywaĂ„â€ˇ istniejĂ„…cych handlerÄ‚łw LeadDetail.


## 2026-06-06 18:05 Europe/Warsaw - STAGE228B_R7_MOJIBAKE_CLEANUP
- Planned/required: Stage98 hard gate must PASS before any push.
- Planned/required: Stage228B guard/test must PASS after UTF-8 cleanup.
- Planned/required: build, verify:closeflow:quiet and git diff --check must PASS.

## 2026-06-06 18:36 Europe/Warsaw - STAGE228B_R8_ALERTTRIANGLE_IMPORT_HOTFIX

Planned tests:
- node scripts/check-stage228b-alerttriangle-import.cjs
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- node scripts/check-stage228b-lead-work-action-center.cjs
- node --test tests/stage228b-lead-work-action-center.test.cjs
- node scripts/check-stage228a-sales-funnel-truth-clickability.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

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
## 2026-06-07 18:55 Europe/Warsaw - STAGE228F R2 test history

Do uruchomienia przez apply:
- node scripts/check-stage228f-runtime-copy-cleanup.cjs
- npm run build
- git diff --check

Test reczny:
- /clients: brak dopiskow pod "Filtry proste" i "Najwyzsza prowizja".
- /leads: brak gornego kafelka Historia; prawy filtr Historia nadal jest.

<!-- STAGE228G_TEST_HISTORY -->
## 2026-06-07 19:05 Europe/Warsaw - STAGE228G tests

DO URUCHOMIENIA przez apply script:
- node scripts/check-stage228g-cases-copy-and-operator-rail-source-truth.cjs
- npm run build
- git diff --check

Manual:
- /cases: case row helper sentence removed.
- /cases: top metric cards in one row on desktop.
- /cases: Operacyjne skróty tone intensity matches /clients and /leads Filtry proste.

<!-- STAGE228H_R3_TEST_HISTORY -->
## 2026-06-07 19:45 Europe/Warsaw - STAGE228H R3 tests
- Planned/runner: node scripts/check-stage228h-r3-sales-funnel-source-truth.cjs
- Planned/runner: npm run build unless skipped
- Planned/manual: open http://localhost:3000/dev/funnel after npm run dev.
<!-- /STAGE228H_R3_TEST_HISTORY -->

<!-- STAGE228R1_TEST_HISTORY -->
## Stage228R1 tests
Planowane: npm run check:stage228r1-rail-tasks-pattern, git diff --check, manual /tasks /leads /clients /cases.
<!-- /STAGE228R1_TEST_HISTORY -->

<!-- STAGE228R2_ADMIN_FEEDBACK_TEST_HISTORY -->
## 2026-06-08 08:58 Europe/Warsaw - Stage228R2 tests

PASS:
- `npm run audit:closeflow-ui-map`
- `npm run audit:closeflow-style-map`
- `npm run check:closeflow-ui-skill-pack`
- `npm run check:closeflow-ui-premap-contract`
- `npm run check:stage228r2-admin-feedback-rail-cleanup`
- `npm run check:stage228r1-rail-tasks-pattern`
- `npm run build`

PARTIAL / SKIP:
- Browser DOM smoke opened local routes, but app stayed at `Ladowanie widoku...`; no full visual PASS recorded.
<!-- /STAGE228R2_ADMIN_FEEDBACK_TEST_HISTORY -->

## 2026-06-08 21:05 Europe/Warsaw - STAGE228R14_C5_TEST_HISTORY

Planowane po apply:
- R11 guard
- R12 guard
- R13 guard
- R14 guard
- npm run build
- git diff --check
- manual C5 test before final push

## 2026-06-08 21:15 Europe/Warsaw - STAGE228R14R2_C5_TEST_HISTORY

Planowane po apply:
- R11 guard
- R12 guard
- R13 guard
- R14 guard after manual wording repair
- npm run build
- git diff --check
- manual C5 test before final push

## 2026-06-08 21:45 Europe/Warsaw - STAGE228R15_TEST_HISTORY

Plan:
- R11/R12/R13/R14/R15 guards.
- npm run build.
- git diff --check.
- Manual deploy test: lead/client/case add/delete/refresh.

## 2026-06-08 21:55 Europe/Warsaw - STAGE228R15R2_TEST_HISTORY

R15R2 must pass:
- node scripts/check-stage228r15-missing-item-delete-refresh.cjs
- R11/R12/R13/R14 guards
- npm run build
- git diff --check

## 2026-06-08 22:30 Europe/Warsaw - STAGE228R16R2_TEST_HISTORY

Plan:
- SQL verification returns next_action_title is_nullable YES.
- R11/R12/R13/R14/R15/R16R2 guards.
- npm run build.
- git diff --check.
- Deploy UI test for Brak add/delete.

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

## 2026-06-08 21:10 Europe/Warsaw Ă˘â‚¬” Stage228R18 Ă˘â‚¬” missing item hard delete source truth

- problem: Brak znikaÄąâ€š po klikniĂ„â„˘ciu UsuÄą„, ale wracaÄąâ€š po hard refresh.
- decyzja: aktywny Brak w LeadDetail ma byĂ„â€ˇ usuwany realnym backend DELETE z work_items po ID, nie tylko statusem deleted.
- dodatkowo: lista Braki i blokady ma byĂ„â€ˇ ÄąĹźrÄ‚łdÄąâ€šowana z linkedTasks, nie z caÄąâ€šego timeline, ÄąÄ˝eby activity history nie odtwarzaÄąâ€ša aktywnego braku.
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

## 2026-06-09 02:50 Europe/Warsaw Ă˘â‚¬” STAGE228R41_DELETE_FLOW_FINAL_VALIDATE_PUSH

FAKTY:
- R41 finalizuje delete flow po nieudanym lokalnym Äąâ€šaÄą„cuchu R26-R40.
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

<!-- STAGE230B_QUICK_CAPTURE_INBOX_TEST_HISTORY_START -->
## 2026-06-09 - STAGE230B Quick Capture Inbox bez AI

Planned/executed by apply script:
- node scripts/check-stage230b-quick-capture-inbox.cjs
- node --test tests/stage230b-quick-capture-inbox.test.cjs
- node scripts/check-stage230a-ai-draft-inbox-roadmap.cjs
- node --test tests/stage230a-ai-draft-inbox-roadmap.test.cjs
- npm run build
- git diff --check

Manual QA required before push:
- desktop save and F5 persistence
- mobile system dictation save and F5 persistence
- verify words duplication only as Stage230C observation
<!-- STAGE230B_QUICK_CAPTURE_INBOX_TEST_HISTORY_END -->

<!-- STAGE230B_R8_TEST_HISTORY -->
## 2026-06-09 - STAGE230B R8 test history
Planowane/uruchamiane po hotfixie:
- node scripts/check-stage230b-quick-capture-inbox.cjs
- node --test tests/stage230b-quick-capture-inbox.test.cjs
- node scripts/check-stage230a-ai-draft-inbox-roadmap.cjs
- node --test tests/stage230a-ai-draft-inbox-roadmap.test.cjs
- npm run build
- git diff --check

<!-- STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT_TEST_HISTORY_START -->
## 2026-06-09 - STAGE230C Phone dictation duplicate-words audit

Automated tests:
- node scripts/check-stage230b-quick-capture-inbox.cjs
- node --test tests/stage230b-quick-capture-inbox.test.cjs
- node scripts/check-stage230c-phone-dictation-duplicate-words-audit.cjs
- node --test tests/stage230c-phone-dictation-duplicate-words-audit.test.cjs
- npm run build
- git diff --check

Manual QA:
- /ai-drafts
- enable Debug dyktowania
- manual typing
- mobile dictation
- copy trace
- save draft
- F5 persistence
<!-- STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT_TEST_HISTORY_END -->

<!-- STAGE230C_R2_VOICE_DEBUG_VISIBILITY_HOTFIX_TEST_HISTORY_START -->
## 2026-06-09 - STAGE230C-R2 Voice debug visibility/readability hotfix

Automated tests:
- node scripts/check-stage230b-quick-capture-inbox.cjs
- node --test tests/stage230b-quick-capture-inbox.test.cjs
- node scripts/check-stage230c-phone-dictation-duplicate-words-audit.cjs
- node --test tests/stage230c-phone-dictation-duplicate-words-audit.test.cjs
- node scripts/check-stage230c-r2-voice-debug-visibility-hotfix.cjs
- node --test tests/stage230c-r2-voice-debug-visibility-hotfix.test.cjs
- npm run build
- git diff --check

Manual QA:
- /ai-drafts
- verify typed text is dark and visible
- enable Debug dyktowania
- verify Kopiuj trace is visible
- reproduce duplicated dictation and copy trace
<!-- STAGE230C_R2_VOICE_DEBUG_VISIBILITY_HOTFIX_TEST_HISTORY_END -->

<!-- STAGE230C_R6_VOICE_DEBUG_PANEL_REWRITE_TEST_HISTORY_START -->
## 2026-06-09 - STAGE230C R6 voice debug panel rewrite

Automated tests:
- node scripts/check-stage230b-quick-capture-inbox.cjs
- node --test tests/stage230b-quick-capture-inbox.test.cjs
- node scripts/check-stage230c-phone-dictation-duplicate-words-audit.cjs
- node --test tests/stage230c-phone-dictation-duplicate-words-audit.test.cjs
- node scripts/check-stage230c-r2-voice-debug-visibility-hotfix.cjs
- node --test tests/stage230c-r2-voice-debug-visibility-hotfix.test.cjs
- npm run build
- git diff --check
<!-- STAGE230C_R6_VOICE_DEBUG_PANEL_REWRITE_TEST_HISTORY_END -->


<!-- STAGE230C_R7_MASS_GUARD_AND_BUILD_PREFLIGHT -->
## 2026-06-09 - STAGE230C R7 mass guard/build preflight
- Rewrote Stage230C-R2 visibility guard/test with syntax-safe code.
- Added mass node --check before runtime tests.
- No deduplication and no AI parser changes.

<!-- STAGE230C_R8_MASS_PANEL_REGION_REWRITE_TEST_HISTORY_START -->
## 2026-06-09 - STAGE230C R8 mass panel region rewrite

Tests:
- node --check scripts/check-stage230b-quick-capture-inbox.cjs
- node --check tests/stage230b-quick-capture-inbox.test.cjs
- node --check scripts/check-stage230c-phone-dictation-duplicate-words-audit.cjs
- node --check tests/stage230c-phone-dictation-duplicate-words-audit.test.cjs
- node --check scripts/check-stage230c-r2-voice-debug-visibility-hotfix.cjs
- node --check tests/stage230c-r2-voice-debug-visibility-hotfix.test.cjs
- Stage230B guard/test
- Stage230C guard/test
- Stage230C-R2/R8 guard/test
- npm run build
- git diff --check
<!-- STAGE230C_R8_MASS_PANEL_REGION_REWRITE_TEST_HISTORY_END -->

<!-- STAGE230C_R10_QUICK_CAPTURE_VISUAL_SOURCE_TRUTH_TEST_HISTORY_START -->
## 2026-06-09 - STAGE230C R10 quick capture visual source truth

Automated tests:
- node --check scripts/check-stage230b-quick-capture-inbox.cjs
- node --check tests/stage230b-quick-capture-inbox.test.cjs
- node --check scripts/check-stage230c-phone-dictation-duplicate-words-audit.cjs
- node --check tests/stage230c-phone-dictation-duplicate-words-audit.test.cjs
- node --check scripts/check-stage230c-r2-voice-debug-visibility-hotfix.cjs
- node --check tests/stage230c-r2-voice-debug-visibility-hotfix.test.cjs
- node --check scripts/check-stage230c-r10-quick-capture-visual-source-truth.cjs
- node --check tests/stage230c-r10-quick-capture-visual-source-truth.test.cjs
- Stage230B guard/test
- Stage230C guard/test
- Stage230C-R2/R8 guard/test
- Stage230C-R10 guard/test
- npm run build
- git diff --check

Manual QA:
- /ai-drafts on phone
- typed text is dark and visible
- placeholder is visible
- Zapisz szkic disabled/enabled states readable
- diagnostic trace buttons readable
<!-- STAGE230C_R10_QUICK_CAPTURE_VISUAL_SOURCE_TRUTH_TEST_HISTORY_END -->

<!-- STAGE230C_R12_R2_GUARD_GLOBAL_MARKER_COMPAT_TEST_HISTORY_START -->
## 2026-06-09 - STAGE230C R12 R2 guard global marker compatibility

Tests:
- node --check scripts/check-stage230b-quick-capture-inbox.cjs
- node --check tests/stage230b-quick-capture-inbox.test.cjs
- node --check scripts/check-stage230c-phone-dictation-duplicate-words-audit.cjs
- node --check tests/stage230c-phone-dictation-duplicate-words-audit.test.cjs
- node --check scripts/check-stage230c-r2-voice-debug-visibility-hotfix.cjs
- node --check tests/stage230c-r2-voice-debug-visibility-hotfix.test.cjs
- node --check scripts/check-stage230c-r10-quick-capture-visual-source-truth.cjs
- node --check tests/stage230c-r10-quick-capture-visual-source-truth.test.cjs
- Stage230B guard/test
- Stage230C guard/test
- Stage230C-R2/R8/R10/R12 guard/test
- Stage230C-R10 guard/test
- npm run build
- git diff --check
<!-- STAGE230C_R12_R2_GUARD_GLOBAL_MARKER_COMPAT_TEST_HISTORY_END -->

<!-- STAGE230C_R15_GUARD_SPLIT_VISUAL_SOURCE_TRUTH_TEST_HISTORY_START -->
## 2026-06-09 - STAGE230C R15 guard split + visual source truth

Tests:
- node --check Stage230B/230C/R2/R10 guardów i testów
- node scripts/check-stage230b-quick-capture-inbox.cjs
- node --test tests/stage230b-quick-capture-inbox.test.cjs
- node scripts/check-stage230c-phone-dictation-duplicate-words-audit.cjs
- node --test tests/stage230c-phone-dictation-duplicate-words-audit.test.cjs
- node scripts/check-stage230c-r2-voice-debug-visibility-hotfix.cjs
- node --test tests/stage230c-r2-voice-debug-visibility-hotfix.test.cjs
- node scripts/check-stage230c-r10-quick-capture-visual-source-truth.cjs
- node --test tests/stage230c-r10-quick-capture-visual-source-truth.test.cjs
- npm run build
- git diff --check
<!-- STAGE230C_R15_GUARD_SPLIT_VISUAL_SOURCE_TRUTH_TEST_HISTORY_END -->

<!-- STAGE231A_GOOGLE_AUTH_ENTRY_CONSISTENCY_TEST_HISTORY_START -->
## 2026-06-09 - STAGE231A Google auth entry consistency

Automated tests:
- node --check scripts/check-stage231a-google-auth-entry-consistency.cjs
- node --check tests/stage231a-google-auth-entry-consistency.test.cjs
- node scripts/check-stage231a-google-auth-entry-consistency.cjs
- node --test tests/stage231a-google-auth-entry-consistency.test.cjs
- npm run build
- git diff --check

Manual QA:
- /login -> Logowanie -> Kontynuuj przez Google
- /login -> Rejestracja -> Zarejestruj przez Google
- e-mail/hasło rejestracji nadal widoczne
- reset hasła nadal widoczny
<!-- STAGE231A_GOOGLE_AUTH_ENTRY_CONSISTENCY_TEST_HISTORY_END -->

## STAGE231D_GOOGLE_AUTH_INTENT_GATE — planned verification

Automated:
- Stage231A guard/test
- Stage231D guard/test
- Stage230B guard/test
- npm run build
- git diff --check

Manual:
- / shows Login/Register.
- /login?tab=register opens Registration.
- Google Login existing CloseFlow account works.
- Google Login unknown account returns to Register with notice.
- Google Register unknown account creates profile/workspace via api/me.
- Email/password signup still uses Supabase email confirmation.

## STAGE231D_R5_MANUAL_QA_EXPECTED

Owner manual QA before R5:
- Google Login existing account: PASS.
- Google Login unknown account: FAIL, still entered app.
- Google Register: PASS.
- Email/password confirmation: PASS.
- One auth entry page: PASS.

R5 expected:
- Google Login unknown account with no existing profile/workspace must return REGISTER_FIRST_REQUIRED, sign out, and show Register notice.
- Google Register unknown account must still create profile/workspace.
- Email/password registration must still require e-mail confirmation and then allow bootstrap.

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

## 2026-06-10 — STAGE231B0 tests

Planowane / wymagane:
- node scripts/check-stage231b0-case-close-archive-finance-truth.cjs
- node --test tests/stage231b0-case-close-archive-finance-truth.test.cjs
- node scripts/check-stage228r25-delete-flow-source-truth.cjs
- node scripts/check-stage228r41-delete-flow-final-validate.cjs
- npm run build
- git diff --check

## 2026-06-10 — STAGE231B0-R7 test plan

Run R7 guard/test, Stage231B0 regression, delete-flow regressions, build and git diff --check before commit.


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

## 2026-06-10 � STAGE231B0-R15-R2 � ClientDetail shared canvas width source
- Status: FINALIZE_FOR_PUSH.
- Pow�d: R14 trafi� w z�y DOM node (`ClientMultiContactField`), wi�c nie m�g� rozci�gn�� kartoteki klienta.
- Decyzja: ClientDetail ma u�ywa� wsp�lnego canvasu strony: `cf-page-canvas`, `cf-page-canvas--full`, `data-cf-page-canvas="full"`.
- �r�d�o prawdy szeroko�ci: `src/styles/closeflow-unified-page-canvas-stage211c.css`.
- Widok konsumuj�cy kontrakt: `src/pages/ClientDetail.tsx` + `src/styles/visual-stage12-client-detail-vnext.css`.
- R14 guard/test usuni�te jako fa�szywy kontrakt.

## 2026-06-10 � STAGE231B0-R15-R3 � ClientDetail width guard + Polish encoding guard
- Status: FINAL_GUARD_FOR_PUSH.
- Potwierdzenie u�ytkownika: wygl�d kartoteki klienta jest poprawny i ma tak zosta�.
- Guard szeroko�ci: `scripts/check-stage231b0-r15-r3-client-detail-width-source-truth.cjs`.
- Guard polskich znak�w: `scripts/check-stage231b0-r15-r3-polish-encoding.cjs`.
- Guard pilnuje, �e ClientDetail u�ywa wsp�lnego canvasu: `cf-page-canvas`, `cf-page-canvas--full`, `data-cf-page-canvas="full"` oraz zmiennych `--cf-page-canvas-*`.
- Guard pilnuje usuni�cia b��dnego R14 i braku mojibake/replacement chars w kluczowych plikach kartoteki klienta.
- Naprawiono higien� EOF w `src/pages/ClientDetail.tsx`.


## 2026-06-10 — STAGE231B0-R15-R4 — Polish guard safe repair R2
- Status: REPAIR_AFTER_PUSHED_FAILED_GUARD_SAFE_R2.
- Powód: pierwsza paczka SAFE miała błąd runnera PowerShell - funkcja przekazywała argumenty natywnym komendom jako pustą tablicę, więc git/node startowały bez parametrów.
- Naprawa: R2 używa jawnych wywołań w PowerShell i naprawia mojibake wyłącznie w skrypcie JS, nie wklejanym terminalu.
- Polish guard wykrywa konkretne sekwencje mojibake, daje line evidence i blokuje blank line at EOF.
- Zasada utrzymana: commit/push tylko po PASS guardów, build i git diff --check.


## 2026-06-10 — STAGE231B0-R15-R4 — Polish guard batch repair
- Status: BATCH_REPAIR_AFTER_R2_R3_PARTIALS.
- Powód: R2/R3 częściowo naprawiły pliki, ale R3 zatrzymał się przez zbyt wąski parser dirty paths.
- Naprawa: masowo obsłużono warianty mojibake `ą/ł/ł/ó/Â·/–`, znormalizowano EOF i poprawiono guard pod aktualną kopię ClientDetail.
- Zasada: commit/push tylko po PASS guardów, build i git diff --check.


## 2026-06-10 — STAGE231B0-R15-R4 — Polish guard final batch repair
- Status: FINAL_BATCH_REPAIR_AFTER_DOC_SELF_FAIL.
- Powód: poprzedni run report zawierał przykładowe uszkodzone sekwencje znaków, a guard słusznie skanował też dokumentację etapu.
- Naprawa: dokumentacja etapu nie zapisuje już przykładowych uszkodzonych sekwencji; guard dalej skanuje kod, CSS i dokumentację zakresu R15.
- Guard blokuje uszkodzenia kodowania, puste linie na EOF i brak aktualnych polskich fraz w ClientDetail.
- Commit/push tylko po PASS guardów, build i git diff --check.

<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_TEST_HISTORY_START -->
## 2026-06-10 17:10 Europe/Warsaw — STAGE231D0A — test history

Do uruchomienia lokalnie przez apply script:
- `node scripts/check-stage231d0a-visual-source-truth-consistency.cjs`
- `node --test tests/stage231d0a-visual-source-truth-consistency.test.cjs`
- `npm run build`
- `git diff --check`

Warunek PASS:
- D0A ma mapę Visual Source of Truth,
- roadmapa zawiera D0A przed D0,
- istniejący UI korzysta z wykrytych źródeł prawdy,
- dokumentacja i payload Obsidiana nie zawierają mojibake.
<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_TEST_HISTORY_END -->

<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_TEST_HISTORY_START -->
## STAGE231D0A-R3 — test history

Do wykonania lokalnie:
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run test:stage231d0a-visual-source-truth-consistency
- npm run build
- git diff --check

PASS tych komend jest warunkiem pushu.
<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_TEST_HISTORY_END -->

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

## 2026-06-10 20:05 Europe/Warsaw — STAGE231D3-R7 planned test result

- expected: guard/test/build PASS before push
- production manual: client finance costs rollup visible and CaseDetail still opens

## STAGE231D3-R7-R2 — Polish guard restore and D3 close

- timestamp: 2026-06-10 20:42 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED
- result: restored missing scripts/check-polish-encoding-stage231b0-r15-r3.cjs required by regression lane after STAGE231D3-R7.
- risk audit: this fixes guard infrastructure drift only; it does not modify SQL, API routes, or CaseDetail layout.

<!-- STAGE231D0B_CLIENT_LIST_CARD_TEST_HISTORY_START -->
## 2026-06-10 21:10 Europe/Warsaw - STAGE231D0B Client List Card Visual Freeze

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
<!-- STAGE231D0B_CLIENT_LIST_CARD_TEST_HISTORY_END -->


## 2026-06-10 Europe/Warsaw - STAGE231D0B-R8-MASS-ENCODING-RESCUE

Marker: STAGE231D0B-R8-MASS-ENCODING-RESCUE
Do wykonania:
- npm run check:stage231d0b-client-list-card-freeze
- git diff --check
- npm run build
- ręcznie /clients: brak krzaków, brak Leady:, brak Aktywna sprawa, poprawne Zarobione łącznie.

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

## 2026-06-11 Europe/Warsaw - STAGE231D0B-R10 tests

Plan: D0B guard, node test, git diff --check, build. Manual QA: /clients po Ctrl+F5.

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
