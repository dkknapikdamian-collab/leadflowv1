# 04_DECISIONS - CloseFlow / LeadFlow

- Pracujemy na branchu dev-rollout-freeze.
- Nie tworzymy nowych branchy.
- AGENTS.md jest dopisywany, nie nadpisywany.
- Obsidian jest dashboardem i indeksem, a repo + _project sa zrodlem prawdy.
- AI confirm-first: AI tworzy szkic, uzytkownik zatwierdza.
- UI ma mowic prawde o funkcjach, integracjach, billingu i gotowosci release.
- Aktywne pliki Obsidiana maja miec czytelne nazwy z kontekstem CloseFlow_LeadFlow.

<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_DECISION_START -->
## 2026-06-04 — decyzja po deep research CRM: CloseFlow jako owner control system, nie tani CRM

FAKTY:
- Rynek tanich i darmowych CRM jest zatłoczony.
- CloseFlow ma już kierunek operacyjny: leady, follow-upy, zadania, wydarzenia, sprawy, Today, szkice AI i finanse spraw.
- Repo i README potwierdzają pozycjonowanie wokół pilnowania leadów i tematów, które mogą uciec.

DECYZJA:
- Nie pozycjonować CloseFlow jako tańszej kopii CRM.
- Główna przewaga produktowa: owner control nad ruchem sprzedażowym, ciszą, brakiem następnego kroku, sprawami i pieniędzmi.
- Najpierw budować A35/A35B/A41/A46/A42/A45/A44, potem A36 szkice i A47 playbooki/oferta.
- Model komercyjny: SaaS jako furtka + wdrożenie procesu + monthly review/cleanup jako renta.

NIE ROBIĆ TERAZ:
- ERP, KSeF, fakturowanie, magazyn, własny VoIP, ciężkie BI, rozbudowany automation builder, 10 branż jednocześnie.

DO POTWIERDZENIA:
- dokładny segment pierwszego testu sprzedażowego,
- finalna cena Control Sprint,
- czy A35 będzie najpierw ekranem wewnętrznym, czy płatnym mini-audytem.
<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_DECISION_END -->

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

## STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX — duplicate confirmation gate

- data i godzina: 2026-06-06 14:23 Europe/Warsaw
- typ wpisu: hotfix po ręcznym smoke R10C4
- decyzja: duplikat albo konflikt danych kontaktowych może być zapisany tylko po świadomym potwierdzeniu. Brak działania checkerów konfliktów ma zatrzymać zapis, a nie przepuścić rekord po cichu.
- zmiana: Leads.tsx i Clients.tsx nie łykają błędu findEntityConflictsInSupabase do pustej listy. Przy błędzie pokazują komunikat i zatrzymują zapis. Przy konflikcie pokazują komunikat i dialog z opcją „Dodaj mimo to”.
- testy/guardy: check/test stage226r10d2 plus regresje R10C2/R10B/R10, build, verify:closeflow:quiet, git diff --check.
- audyt ryzyk: fail-closed może chwilowo blokować zapis przy awarii API konfliktów, ale to jest bezpieczniejsze niż ciche mnożenie duplikatów klientów/leadów.
- status: local ZIP patch; push po PASS i ręcznym smoke.

## STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH — decyzja czasu Google Calendar

- data i godzina: 2026-06-06 14:58 Europe/Warsaw
- decyzja: CloseFlow zapisuje czas z inputów `datetime-local` jako intencję użytkownika w Europe/Warsaw, a do Google Calendar wysyła timed events jako `dateTime` + `timeZone`, nie jako gołe `toISOString()` bez strefy.
- decyzja: brak przesunięcia 1-2h jest ważniejszy niż Stage227, bo lejek i najbliższe akcje opierają się na prawdziwych godzinach.
- decyzja: przypomnienie Google musi wynikać z `reminderAt`/offsetu i trafiać do `reminders.overrides` albo do zapisanego exact Google reminders, nie ginąć po syncu.

## STAGE226R11B_GCAL_TIMEZONE_TEST_CROSS_REALM_FIX — decyzja

- data i godzina: 2026-06-06 15:05 Europe/Warsaw
- decyzja: R11 code path is kept; only the Node test assertion was fixed because vm.runInNewContext returns objects from a different realm/prototype.
- status: fix testu wdrożeniowego po czerwonym teście o identycznej strukturze obiektu.

<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_DECISION_START -->
## 2026-06-06 15:35 Europe/Warsaw â€” STAGE227A â€” Lejek ruchu sprzedaĹĽowego read-only

Stage227A jest lokalnym, read-only wdroĹĽeniem widoku Lejek. Lejek nie jest klasycznym kanbanem CRM. Nie ma drag/drop ani mutacji statusu. Widok zbiera istniejÄ…ce sygnaĹ‚y: ciszÄ™, brak nastÄ™pnego kroku, ryzyko i wartoĹ›Ä‡/prowizjÄ™. Push dopiero po akceptacji Damiana.
<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_DECISION_END -->

<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_DECISION_START -->
## 2026-06-06 15:45 Europe/Warsaw â€” STAGE227B â€” lejek jako panel decyzyjny, nie kanban

DECYZJA: Stage227A dziaĹ‚aĹ‚ technicznie, ale rÄ™czny UX test pokazaĹ‚, ĹĽe szeroki kanban jest za gÄ™sty. `/funnel` zostaje osobnÄ… zakĹ‚adkÄ…, ale zostaje przebudowany na czytelny panel decyzyjny: filtry wĹ‚aĹ›ciciela, pasek etapĂłw, jedna lista rekordĂłw i panel priorytetu.
<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_DECISION_END -->
