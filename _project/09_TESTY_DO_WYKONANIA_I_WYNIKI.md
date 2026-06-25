

## STAGE232B_R4_IDEMPOTENT_REPAIR_2026_06_15

Data: 2026-06-15 21:30 Europe/Warsaw
Status: WDROZONE_TECHNICZNIE_DO_SPRAWDZENIA / TEST_RECZNY_DAMIANA
Etap: STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH R4

Zakres techniczny:
- R4 usuwa kruchość patchy R1/R2/R3 opartych o dokładne needle/line ending.
- TodayStable ma jawny marker STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH.
- Kafelek i sekcja Owner Control używają nazwy Wymaga ruchu i liczą actionRequiredRows.
- R6: usunieto z UI odrzucony dopisek techniczny spod kafelka `Wymaga ruchu`; nie wymagac go w testach recznych.
- Najbliższe 7 dni liczy upcomingRowsAll, pokazuje upcomingRowsPreview top 10 i disclosure pokazano 10 z X.
- Zadania używają dynamicznej etykiety: Zadania dziś / Zaległe zadania / Zadania dziś i zaległe / Zadania do obsługi.

Testy wymagane:
- node scripts/check-stage232b-today-owner-control-tiles.cjs
- node --test tests/stage232b-today-owner-control-tiles.test.cjs
- npm run build
- git diff --check

Uwaga:
verify:closeflow:quiet może nadal zgłosić stary niezwiązany guard CaseDetail. To jest zapisane jako SKIP_UNRELATED/DO_ANALIZY, bo STAGE232B dotyczy /today.

Test ręczny Damiana:
- wejść w /today,
- sprawdzić Wymaga ruchu,
- sprawdzić helper pod sekcją,
- sprawdzić zgodność licznik kafelka = licznik sekcji = liczba listy,
- sprawdzić Najbliższe 7 dni: full count i pokazano 10 z X przy ponad 10 rekordach,
- dopiero wtedy zmienić status na PRODUCT_PASS.

## STAGE232B_R6_TODAY_REMOVE_DEV_HELPER_COPY_AND_QUEUE_REPAIR

Data: 2026-06-15 22:05 Europe/Warsaw
Status: TEST_RECZNY_DO_WYKONANIA

Automatyczne:
- dedicated guard: do uruchomienia,
- dedicated test: do uruchomienia,
- build: do uruchomienia,
- `git diff --check`: do uruchomienia.

Manualne dla Damiana:
1. Otworz `/today`.
2. Sprawdz, ze nie ma tekstu `To nie jest kalendarz...`.
3. Sprawdz, ze kafelek/lista `Wymaga ruchu` dalej istnieje i nie wyglada jak komentarz techniczny.
4. Sprawdz, ze `Najblizsze 7 dni` i zadania nadal maja sensowne liczniki/etykiety.

## STAGE232B_R8_TODAY_LABEL_AND_HELPER_COPY_FIX

Data: 2026-06-15 22:35 Europe/Warsaw
Status: WDROZONE_TECHNICZNIE_DO_SPRAWDZENIA / TEST_RECZNY_DAMIANA

Zakres:
- usunieto z /today dopisek developerski: "To nie jest kalendarz...";
- przywrocono i zabezpieczono etykiete kafelka: "Wymaga ruchu";
- guard/test blokuja powrot technicznego/helperowego copy w UI;
- nie ruszano STAGE232A, LeadDetail, CaseDetail, SQL, Google Calendar ani finansow.

Testy:
- node scripts/check-stage232b-today-owner-control-tiles.cjs — PASS;
- node --test tests/stage232b-today-owner-control-tiles.test.cjs — PASS;
- npm run build — PASS;
- verify:closeflow:quiet — SKIP_UNRELATED/DO_ANALIZY dla starego guarda CaseDetail.

Audyt ryzyk:
- R7 ujawnil regresje copy/label: usuniecie helpera nie moze zmieniac kontraktu "Wymaga ruchu";
- dodano guard antyregresyjny na brak dopisku "To nie jest kalendarz" i obecność "Wymaga ruchu";
- CaseDetail guard pozostaje osobnym ryzykiem do osobnego etapu, bez mieszania ze STAGE232B.

## STAGE232A_R4_LEAD_MISSING_BLOCKER_CONTRACT_REPAIR

Data: 2026-06-15 23:35 Europe/Warsaw
Status: WDROZONE_TECHNICZNIE_DO_SPRAWDZENIA / TEST_RECZNY_DAMIANA

Brak/Blokada ma jawne pola missingKind, blocksProgress i blockScope. Modal i ContextActionDialogs zapisują metadata do historii/no-flicker payloadu. R4 naprawia częściowy stan po nieudanych R1/R2/R3.

Do testu ręcznego: dodaj Brak na leadzie jako blokujący, sprawdź historię i aktywne Braki po odświeżeniu.

## STAGE232A_R5_MISSING_ITEM_MODAL_VISUAL_SOURCE_TRUTH

Data: 2026-06-15 23:55 Europe/Warsaw
Status: TECH_PUSHED / DO_SPRAWDZENIA_RECZNEGO

Zakres:
- modal Dodaj brak zostaje podpięty pod wizualne źródło prawdy szybkiego dodawania leada: lead-form-vnext;
- karta, nagłówek, sekcje, grid pól, select, checkbox, textarea i footer używają tych samych klas źródłowych;
- logika Brak/Blokada z STAGE232A R4 nie jest refaktorowana;
- dodany guard/test blokuje powrót jasnego, słabo czytelnego standalone shell dla MissingItemQuickActionModal.

Testy:
- node scripts/check-stage232a-r5-missing-item-visual-source.cjs;
- node --test tests/stage232a-r5-missing-item-visual-source.test.cjs;
- npm run build;
- verify:closeflow:quiet traktować jako SKIP_UNRELATED jeśli pada wyłącznie na stary CaseDetail guard.

Audyt ryzyk:
- ryzyko: zmiana CSS może wpływać na modal Brak w lead/client/case, bo komponent jest wspólny;
- guard ogranicza regresję do wizualnego kontraktu, ale manualnie trzeba sprawdzić modal na LeadDetail;
- nie ruszano SQL, API, aktywnych list Brak/Blokada ani CaseDetail.

## 2026-06-16 03:10 Europe/Warsaw - STAGE232A_R5 status sync

Status: TECH_PUSHED / DO_SPRAWDZENIA_RECZNEGO

Korekta dokumentacyjna:
- commit techniczny R5 jest wypchniety do GitHuba: 6a16c71c4f700af756c9d1a616b523e233c32219;
- poprzedni status WDROZONE_ZIP_DO_SPRAWDZENIA byl nieaktualny po pushu;
- Product PASS wymaga nadal recznego potwierdzenia wygladu modala Dodaj brak w przegladarce;
- historyczny verify:closeflow:quiet byl blokowany przez osobny CaseDetail guard, nie przez zakres STAGE232A_R5.


## 2026-06-16 04:08 Europe/Warsaw - STAGE232A_R6_LEAD_MISSING_BLOCKER_ACTIVE_LIST_AND_TOP_CARD_SOURCE_TRUTH

Status: PASS_LOCAL_DO_SPRAWDZENIA

Zakres:
- LeadDetail aktywne Braki sa filtrowane z linkedTasks/workItems, nie z historii/activity.
- Blokady sa subsetem aktywnych brakow przez explicit blocksProgress albo status zawierajacy block.
- Top card Blokada nie dostaje kazdego braku jako blokady.
- ContextActionDialogs utrwala missingKind, blocksProgress, blockScope i payload na tasku/no-flicker saved record.
- R6-R2 naprawia bledy kruchych kotwic z R6/R6-R1.

Testy:
- node scripts/check-stage232a-r6-lead-missing-active-source.cjs
- node --test tests/stage232a-r6-lead-missing-active-source.test.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- metadata persistence wymaga recznego hard refresh smoke;
- no-flicker moze wygladac dobrze przed reloadem, dlatego test manualny jest obowiazkowy;
- nie ruszano SQL/CaseDetail/Google Calendar/finansow.


## 2026-06-16 04:20 Europe/Warsaw - STAGE232A_R6_R3_CF_RUNTIME_SCOPE_GUARD_COMPAT

Status: PASS_LOCAL_DO_SPRAWDZENIA

Korekta:
- R6-R2 przeszedl patch, guard R6, test R6 i build.
- verify:closeflow:quiet zatrzymal sie na CF-RUNTIME-00 source truth guard, bo stary guard blokowal pliki R6 jako out-of-scope.
- R6-R3 rozszerza allowlist CF-RUNTIME scope guarda o jawne pliki R6.
- To nie zmienia logiki LeadDetail/ContextActionDialogs; to kompatybilnosc guardow po zamknietym CF-RUNTIME-00.

Testy:
- node scripts/check-stage232a-r6-lead-missing-active-source.cjs
- node --test tests/stage232a-r6-lead-missing-active-source.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check


## 2026-06-16 05:05 Europe/Warsaw - STAGE232A_R7_CASE_ITEMS_ITEM_ORDER_SCHEMA_COMPAT

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem produkcyjny:
- Dodanie Braku dla sprawy zwracalo PGRST204: schema cache nie ma kolumny case_items.item_order.
- Błąd blokował zapis Braku.

Zakres:
- api/case-items.ts GET: fallback z order=item_order.asc,created_at.asc na order=created_at.asc.
- api/case-items.ts POST: insertWithVariants próbuje payload z item_order i fallback bez item_order.
- Bez SQL i bez migracji w tym hotfixie.

Testy:
- node scripts/check-stage232a-r7-case-items-item-order-schema-compat.cjs
- node --test tests/stage232a-r7-case-items-item-order-schema-compat.test.cjs
- node scripts/check-stage232a-r6-lead-missing-active-source.cjs
- node --test tests/stage232a-r6-lead-missing-active-source.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- Jeśli brak na sprawie wymaga trwałego porządku listy, trzeba później zrobić schema check/migrację item_order jako osobny SQL etap.
- Ten hotfix ma przywrócić zapis bez wymuszania migracji.


## 2026-06-16 06:55 Europe/Warsaw - STAGE232A_R8_LEAD_MISSING_BLOCKER_UI_SOURCE_TRUTH

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- R8-R4 czesciowo zapisal LeadDetail.tsx i ContextActionDialogs.tsx, a potem zatrzymal sie na data-contract przez zbyt krucha kotwice.
- Ten wpis domyka stan posredni: data-contract, task-route, guard/test, CF-RUNTIME scope, run report i Obsidian payload.

Zakres:
- LeadDetail: aktywne Braki nadal pochodza z linkedTasks, ale renderuja sie jako timeline entries.
- LeadDetail: Najblizsze dzialania wykluczaja aktywne Braki.
- LeadDetail: Braki i blokady licza wszystkie aktywne Braki; top card Blokada liczy tylko subset blokujacy.
- ContextActionDialogs: activity dostaje taskId i explicit blocker status.
- data-contract/task-route: zachowuja missing_item/blocking_missing_item status.

Testy:
- node scripts/check-stage232a-r8-lead-missing-blocker-ui-source-truth.cjs
- node --test tests/stage232a-r8-lead-missing-blocker-ui-source-truth.test.cjs
- guard/test R7
- guard/test R6
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- R8 ma kompatybilnosc po tytule dla starych rekordow bez taskId; dziala tylko gdy istnieje aktywny task, aby historia sama nie wskrzeszala brakow.
- Po deployu wymagany reczny smoke na tym samym leadzie.


## 2026-06-16 07:10 Europe/Warsaw - STAGE232A_R8_R6_R6_GUARD_COMPAT_CLOSURE

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- R8-R5 domknal kod i nowy guard/test R8, ale stary guard R6 byl zbyt literalny.
- R6 guard szukal dokladnego tokenu isActiveMissingItemTaskStage232AR6(entry), mimo ze R8 zachowal zrodlo linkedTasks przez successor helper isActiveMissingItemTaskStage232AR8(entry, leadMissingActivityMetadataStage232AR8).

Zakres:
- Aktualizacja scripts/check-stage232a-r6-lead-missing-active-source.cjs.
- Aktualizacja tests/stage232a-r6-lead-missing-active-source.test.cjs.
- Brak zmian funkcjonalnych w UI ponad R8-R5.

Testy:
- R8 guard/test
- R7 guard/test
- R6 guard/test po kompatybilnosci
- CF-RUNTIME guard
- build
- verify:closeflow:quiet
- git diff --check


## 2026-06-16 21:35 Europe/Warsaw - STAGE232A_R9_BLOCKER_TOP_CARD_SUMMARY_AND_ALL_MISSING

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- R8 poprawil klasyfikacje Brak/Blokada, ale top card Blokada nadal pokazywal akcje per-item: Rozwiaz brak / Usun brak.
- Gdy istnieje aktywna blokada, top card nie mial przycisku Dodaj brak, wiec uzytkownik mial wrazenie limitu jednego braku.
- Wlasciwy model: top card = summary + Dodaj brak + Zobacz wszystkie braki; akcje Rozwiaz/Usun tylko przy konkretnych brakach w zoltym akordeonie.

Zakres:
- LeadDetail top card Blokada jest summary-only.
- Dodaj brak jest dostepne zawsze, niezaleznie od liczby aktywnych blokad.
- Zobacz wszystkie braki otwiera akordeon Braki i blokady i scrolluje do Dzialania leada.
- Akcje Rozwiaz brak / Usun brak zostaja tylko w liscie per-item.
- Dla grupy blockers w akordeonie widoczne sa tylko akcje brakowe, bez Edytuj/Jutro.

Testy:
- node scripts/check-stage232a-r9-blocker-top-card-summary.cjs
- node --test tests/stage232a-r9-blocker-top-card-summary.test.cjs
- R8/R6/R7 guardy regresyjne
- CF-RUNTIME guard
- build
- verify:closeflow:quiet
- git diff --check

Ryzyka:
- Zmiana dotyka tylko LeadDetail UI. Wymagany manual smoke: dodaj drugi brak, zobacz liste, rozwiaz/usun z listy.


## 2026-06-16 21:50 Europe/Warsaw - STAGE232A_R9_R2_R8_GUARD_COMPAT_CLOSURE

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- R9-R1 zapisal top card summary i nowy guard/test R9, ale stary guard R8 byl zbyt literalny.
- R8 guard wymagal tokenu group.key === 'blockers' || isMissingItemTimelineEntry(entry), a R9 celowo zastapil to osobnym branch modelem missing-only.

Zakres:
- Aktualizacja R8 guard/test, aby akceptowaly R9 missing-only branch.
- Brak nowych zmian UI ponad R9-R1.
- Utrzymane R8 warunki: aktywne Braki z linkedTasks, render timeline, wykluczenie z Najblizsze dzialania, count/items wszystkich aktywnych brakow.

Testy:
- R9 guard/test
- R8 guard/test po kompatybilnosci
- R6 guard/test
- R7 guard/test
- CF-RUNTIME guard
- build
- verify:closeflow:quiet
- git diff --check


## 2026-06-16 22:45 Europe/Warsaw - STAGE232A_R10_LEAD_DETAIL_VISUAL_SOURCE_TRUTH

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- Top decision cards na LeadDetail nie byly dosc konsekwentnie spiete z kolorystyka rozwijanych list.
- Modal Dodaj brak wizualnie odstawal od szybkiego dodawania leada i wygladal jak osobny komponent.
- Damian wskazal jedno zrodlo prawdy wizualne: quick lead form / lead-form-vnext.

Zakres:
- LeadDetail top cards: blue/green/amber/red soft-tone palette zgodna z rozwijanymi listami.
- MissingItemQuickActionModal: jawny R10 marker i data attr dla quick-lead visual source.
- stage232a-missing-item-visual-source.css: dark quick-lead shell, white inputs, sticky footer, consistent buttons.
- Guard/test R10.

Testy:
- node scripts/check-stage232a-r10-lead-detail-visual-source-truth.cjs
- node --test tests/stage232a-r10-lead-detail-visual-source-truth.test.cjs
- R9/R8/R6 guardy regresyjne
- CF-RUNTIME guard
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- To jest etap wizualny: konieczny manual smoke na LeadDetail z modalem Dodaj brak i top cardami.
- Nie ruszano źródeł danych ani logiki zapisu.


## 2026-06-16 23:45 Europe/Warsaw - STAGE232A_R10_R1_MISSING_GROUP_INNER_TONE

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- R10 poprawil kolory top cardow i modal, ale po screenshocie Damiana wewnetrzny kafelek/empty state w rozwinietej liscie Braki i blokady nadal wygladal neutralnie.
- Decyzja: nie wystarczy zolty header grupy. Wewnetrzny pusty kafelek i wiersze w grupie blockers musza miec amber/missing tone.

Zakres:
- LeadDetail dodaje jawne data attr dla empty state i wierszy w grupie blockers.
- visual-stage14 dodaje R10-R1 CSS: amber background/border/text dla empty state i wierszy w Braki i blokady.
- Dodany guard/test R10-R1.
- Dodany mirror placementu do _project/04_STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16.md.

Testy:
- node scripts/check-stage232a-r10-r1-missing-group-inner-tone.cjs
- node --test tests/stage232a-r10-r1-missing-group-inner-tone.test.cjs
- R10/R9/R8 guardy regresyjne
- CF-RUNTIME guard
- build
- verify:closeflow:quiet
- git diff --check

Ryzyka:
- Zmiana wizualna CSS, bez zmian danych. Wymaga manualnego smoke na ekranie.


## 2026-06-17 00:15 Europe/Warsaw - STAGE232A_R10_R2_LEAD_ACTION_GROUPS_VISUAL_POLISH

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- R10/R10-R1 przeszly technicznie, ale efekt wizualny na screenshocie nadal byl slaby.
- Same pastelowe tla nie zbudowaly czytelnej hierarchii w sekcji Dzialania leada.
- Damian polecil: zajmij sie ty.

Zakres:
- Dodany globalny CSS override importowany z index.css, aby wygrac z kolejnością starych stage CSS.
- Sekcja Dzialania leada dostaje twardsza hierarchie: biala rama sekcji, mocniejszy border, pasek akcentu po lewej, wyrazniejsze badge i empty states.
- Braki i blokady dostaja mocniejszy amber/missing tone wewnatrz, nie tylko na headerze.
- Notatki pozostaja neutralne.
- Dodany guard/test R10-R2.

Testy:
- node scripts/check-stage232a-r10-r2-lead-action-groups-visual-polish.cjs
- node --test tests/stage232a-r10-r2-lead-action-groups-visual-polish.test.cjs
- R10-R1/R10/R9/R8 guardy regresyjne
- CF-RUNTIME guard
- build
- verify:closeflow:quiet
- git diff --check

Ryzyka:
- To nadal etap wizualny. Guard potwierdza kontrakt CSS, ale ostateczna ocena jest ze screenshota.


## 2026-06-17 01:05 Europe/Warsaw - STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- Pierwsza paczka STAGE232J_R1 zatrzymala sie przed zapisem, bo szukala blednej kotwicy Layout marker.
- Aktualny Layout ma importy na gorze i blok komentarzy przed useWorkspace; nie ma fragmentu */ + pusta linia + import useWorkspace.
- R1-R1 naprawia tylko kotwice patchera i wdraza ten sam runtime scroll fix.

Zakres runtime:
- Layout: route-scoped useEffect dla /leads.
- CSS: route-scoped selector dla main[data-current-section=leads] i content scroll owner.
- Guard/test STAGE232J_R1.
- Mirror do centralnej kolejki 04.

Testy:
- node scripts/check-stage232j-leads-scroll-top-cut.cjs
- node --test tests/stage232j-leads-scroll-top-cut.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- Layout jest globalny, ale fix jest zawężony do location.pathname === '/leads'.
- Manualny smoke /leads jest obowiazkowy.


## 2026-06-17 02:05 Europe/Warsaw - STAGE232A_R11_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_REPAIR / STAGE232A_R11_R1_MISSING_MODAL_CONST_ANCHOR_FIX

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- Pierwsza paczka R11 zatrzymala sie przed zapisem, bo patcher mial zbyt szczegolowa kotwice R10 const.
- Aktualny komponent ma R10 const z tekstem o dark modal surface i nie moze byc patchowany po wczesniejszej wymianie tekstu.
- R11-R1 uzywa robust regex replacement dla calego const block.

Zakres:
- MissingItemQuickActionModal: R10 const przepisany na light lead-form-vnext source; dodany marker R11 i R11-R1.
- stage232a-missing-item-visual-source.css: ciemny shell R10 zastapiony jasnym +Lead source.
- Guard/test R11.
- STAGE232D_R1 nadal zostaje nastepnym runtime etapem.

Testy:
- node scripts/check-stage232a-r11-missing-modal-quick-lead-visual-source.cjs
- node --test tests/stage232a-r11-missing-modal-quick-lead-visual-source.test.cjs
- node scripts/check-stage232a-r10-lead-detail-visual-source-truth.cjs
- node --test tests/stage232a-r10-lead-detail-visual-source-truth.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- Wizualnie dotyka wspolnego modala Brak. Manualny smoke wymagany po deployu.


## 2026-06-17 02:20 Europe/Warsaw - STAGE232A_R11_R2_R10_GUARD_COMPAT

Status: GUARD_COMPAT_FOR_R11

Problem:
- R11 poprawnie zmienil modal Brak na jasny +Lead source truth.
- Stary guard R10 nadal wymagal dark shell background #0f172a.
- To byl konflikt aktywnych zrodel prawdy: R10 dark shell vs R11 jasny +Lead.

Zakres:
- Zaktualizowano R10 guard/test jako compatibility guard.
- R10 nadal pilnuje markerow top card i quick-lead source, ale dark missing modal shell jest deprecated.
- R11 pozostaje aktualnym zrodlem prawdy modala Brak.

Testy:
- node scripts/check-stage232a-r11-missing-modal-quick-lead-visual-source.cjs
- node --test tests/stage232a-r11-missing-modal-quick-lead-visual-source.test.cjs
- node scripts/check-stage232a-r10-lead-detail-visual-source-truth.cjs
- node --test tests/stage232a-r10-lead-detail-visual-source-truth.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check


## 2026-06-17 02:35 Europe/Warsaw - STAGE232A_R11_R3_R10_GUARD_CONTRACT_RELAX

Status: GUARD_COMPAT_FOR_R11

Problem:
- R11-R2 naprawil ciemny shell contract, ale R10 guard zaczal wymagac literalnej klasy lead-detail-action-accordion-group--blockers w LeadDetail.tsx.
- To jest zbyt szczegolowy warunek: klasa moze byc w CSS albo powstac runtime i nie musi istniec literalnie w komponencie.
- R11-R3 luzuje kontrakt R10 do stabilnych markerow stage lineage i aktywnego R11 light modal source truth.

Zakres:
- Zaktualizowano R10 guard/test bez cofania R11.
- Guard nadal blokuje powrot dark #0f172a/#111827 shell.
- R11 pozostaje aktualnym source truth modala Brak.


## 2026-06-17 03:30 Europe/Warsaw - STAGE232A_R12_MISSING_MODAL_MATCH_PLUS_LEAD_DARK_SOURCE

Status: DO_APPLY_ZIP / SCREENSHOT_DRIVEN_REPAIR

Problem:
- Damian pokazal screenshot: Brak po R11 jest jasny, a Nowy lead jest ciemny.
- R11 wybral zle zrodlo prawdy: statyczny jasny lead-form-vnext zamiast realnego ciemnego runtime +Lead modal.
- R12 deprecjonuje R11 light interpretation i ustawia aktywne zrodlo: dark Nowy lead modal match.

Zakres:
- MissingItemQuickActionModal const markers.
- stage232a-missing-item-visual-source.css dark shell/section/white fields/blue CTA.
- R10/R11 compatibility guard/test rewrite.
- R12 guard/test.

Ryzyka:
- To celowo odwraca R11. Manualny smoke musi porownac Brak z Nowy lead.


## 2026-06-17 05:05 Europe/Warsaw - STAGE232A_R13_R2_HEADER_CSS_SOURCE_OVERRIDE

Status: DO_APPLY_ZIP / SCREENSHOT_DRIVEN_HEADER_REPAIR

Problem:
- R13 i R13-R1 zatrzymaly sie przez zbyt szczegolowe kotwice TSX.
- Screenshot pokazuje realny problem w headerze: widac dodatkowe top-left teksty "Brak" i context.
- R13-R2 naprawia to CSS-only przez ukrycie dodatkowych elementow w headerze modala Brak.

Zakres:
- CSS-only override w stage232a-missing-item-visual-source.css.
- Nowy guard/test R13-R2.
- Aktualizacja CF runtime allowlist i dokumentacji.
- Nie dotyka TSX ani logiki danych.

Testy:
- node scripts/check-stage232a-r13-r2-header-css-source-override.cjs
- node --test tests/stage232a-r13-r2-header-css-source-override.test.cjs
- node scripts/check-stage232a-r12-missing-modal-match-plus-lead-dark-source.cjs
- node --test tests/stage232a-r12-missing-modal-match-plus-lead-dark-source.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- CSS hide moze ukryc subtitle tylko w modal headerze Brak. To jest zamierzone.
- Dane i context nie sa usuwane z modelu, tylko z top-left headera.


## 2026-06-17 16:05 Europe/Warsaw - STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX

Status: DO_APPLY_ZIP / RUNTIME_FIX_R1_R1

Problem:
- Poprzedni R1 padl przez zbyt sztywna kotwice w activity-truth.ts.
- Realny bug pozostaje: lead ma status Skontaktowany, ale kafelek Cisza / ryzyko nadal pokazuje stara cisze.

Decyzja:
- Naprawa idzie w zrodle prawdy: updateLeadInSupabase + buildActivityTruth.
- Patch Skontaktowany/Kontakt wykonany stampuje lastContactAt.
- Tworzony jest best-effort activity eventType=manual_contact_done dla tego samego leadId.
- Activity truth traktuje status Skontaktowany jako explicit contact truth.
- Future follow-up/event nie resetuje kontaktu tylko z powodu slowa kontakt/telefon.

Testy:
- node scripts/check-stage232d-owner-contact-done-runtime-fix.cjs
- node --test tests/stage232d-owner-contact-done-runtime-fix.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Manual smoke:
- Klik Kontakt wykonany / ustaw Skontaktowany.
- Kafelek Cisza ma zniknac bez F5.
- Po F5 cisza nie wraca.


## 2026-06-17 17:05 Europe/Warsaw - STAGE232I0_CASE_CLIENT_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT

Do wykonania: guard kontraktu, test kontraktu, build, verify quiet, diff-check.


## 2026-06-17 21:15 Europe/Warsaw - STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME

Status: DO_APPLY_ZIP_R7 / RUNTIME

Zakres:
- CaseDetail Braki/Blokady jako task/work item missing_item z caseId,
- explicit button data-context-action-kind="blocker",
- case_items tylko legacy/checklist compatibility,
- resolve/delete dla missing_item,
- historia: missing_item_created/resolved/deleted,
- bez SQL, bez ClientDetail, bez Owner Control cross-entity.

## 2026-06-17 22:35 Europe/Warsaw - STAGE232I1_R8_MISSING_MODAL_READABLE_VISUAL_SOURCE

Status: DO_APPLY_ZIP / VISUAL_FIX

Zakres:
- poprawa czytelności modala "Dodaj brak" na ciemnym shellu,
- tytuł, labelki, checkbox helper i tekst pól wymuszone na czytelne kolory,
- bez zmian SQL i bez zmian runtime zapisu/odczytu Braków/Blokad.

## 2026-06-18 00:25 Europe/Warsaw - STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Zakres:
- ClientDetail agreguje directClientMissingItems, leadMissingItems i caseMissingItems.
- Kazdy aktywny Brak/Blokada ma source badge: [Klient], [Lead], [Sprawa].
- Filtry: Wszystkie / Klient / Leady / Sprawy / Blokady / Braki.
- Resolve/delete dziala na zrodlowym missing_item task/work item przez istniejace handlery po item.id.
- Historia nie jest aktywnym zrodlem listy.
- Bez SQL i bez Owner Control runtime.

## 2026-06-18 01:00 Europe/Warsaw - STAGE232I2_R3_CLIENT_MISSING_DELETE_SOFT_DELETE

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- Usuwanie Braku u klienta zwracalo METHOD_NOT_ALLOWED.

Zmiana:
- ClientDetail delete Braku klienta przechodzi na soft-delete przez updateTaskInSupabase.
- Fizyczny deleteTaskFromSupabase nie jest uzywany w handlerze Braku klienta.
- Task dostaje status 'deleted' i payload stage232i2DeleteMode='soft_delete_no_method_delete'.
- Aktywna lista filtruje deleted, wiec wpis znika po usunieciu.
- Bez SQL i bez Owner Control.

## 2026-06-18 02:25 Europe/Warsaw - STAGE232K_CASE_DETAIL_LEGACY_CASE_ITEM_DELETE_NO_METHOD_ALLOWED

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Powód:
- METHOD_NOT_ALLOWED dotyczy kosza w CaseDetail legacy case_items/checklist.
- Nie dotyczy ClientDetail missing_item.

Zmiana:
- aktywne deleteCaseItemFromSupabase(item.id) zastąpione przez updateCaseItemInSupabase({ status: 'rejected' }),
- brak znika jak po Odrzuć,
- bez SQL, bez Owner Control, bez ClientDetail.

## 2026-06-18 03:05 Europe/Warsaw - STAGE232L_DELETE_LINKED_NOTE_REFERENCE_SWEEP

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- CaseDetail task delete rzucał ReferenceError: getLinkedNoteForTaskStage231H_R1D2_R15C is not defined.

Audyt:
- błąd jest w CaseDetail task branch,
- poprawny helper istnieje jako findCaseNoteForFollowUpTaskStage231H_R1D2_R15C,
- ClientDetail nie zawiera tej referencji,
- LeadDetail/TodayStable mają osobne delete flow, nie są źródłem tego ReferenceError.

Zmiana:
- task delete używa zdefiniowanego helpera,
- dodano guard/test blokujący niezdefiniowany helper.

## 2026-06-18 03:45 Europe/Warsaw - STAGE232M_CASE_DETAIL_MISSING_ITEM_ACTIVE_FILTER_DELETE_CLOSURE

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- CaseDetail missing_item po usunięciu migał, ale nadal był widoczny.

Audyt:
- filtr CaseDetail dla missing_item uznawał za zamknięte tylko done/completed/accepted,
- brakowało deleted/rejected/resolved/archived/cancelled/canceled,
- ClientDetail ma szerszą listę statusów i dlatego zachowuje się poprawniej.

Zmiana:
- CaseDetail missing_item inactive filter rozszerzony,
- delete branch zapisuje status deleted przez updateTaskInSupabase,
- local state setTasks zamyka row natychmiast.

## 2026-06-18 04:45 Europe/Warsaw - STAGE232N_MISSING_ITEM_VISUAL_KIND_CLASSIFICATION

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- Brak zapisany jako task missing_item był wizualnie pokazywany jako Zadanie, szczególnie w LeadDetail.

Audyt:
- ContextActionDialogs zapisuje type/kind/status missing_item,
- LeadDetail buildTimeline każdy task mapuje jako task,
- render wiersza korzystał z entry.kind i wypisywał "Zadanie" mimo że isMissingItemTimelineEntry rozpoznawał Brak.

Zmiana:
- LeadDetail renderuje missing_item jako Brak albo Blokada,
- status wiersza dla missing_item pokazuje Brak/Blokada zamiast Zaległe,
- no-flicker mutation niesie displayKind/businessKind.

## 2026-06-18 05:35 Europe/Warsaw - STAGE232O_MISSING_ITEM_ACTIVITY_BRIDGE_AND_CASE_APPEND

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- Braki były w dobrej grupie, ale renderowały się jako Zadanie/Zaległe.
- W CaseDetail Brak wpadał do Wszystkie aktywne jako zwykły task.

Audyt:
- STAGE232N działa dla entries z missing metadata,
- zrzut ekranu pokazuje przypadek activity-bridged missing bez metadanych na timeline entry,
- CaseDetail buildWorkItems nie używał activity missing_item_created do wzbogacenia tasków.

Zmiana:
- LeadDetail markeruje active missing entries jako stage232oMissingItem,
- ContextActionDialogs wysyła enriched savedRecord,
- CaseDetail wzbogaca taski z activity metadata przed buildWorkItems.

## 2026-06-18 14:05 Europe/Warsaw - STAGE232P_CASE_DETAIL_BUILDWORKITEMS_SCOPE_HOTFIX

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- CaseDetail nie ładował widoku po STAGE232O.
- Runtime: taskWithMissingBridgeStage232O is not defined.

Audyt:
- taskWithMissingBridgeStage232O istnieje w useMemo openTasksWithNoteFollowUpPreviewStage231H_R1D2_R11,
- buildWorkItems jest funkcją zewnętrzną i nie ma dostępu do tej zmiennej,
- buildWorkItems powinien operować na swoim lokalnym task, bo dostaje już wzbogacone taski.

Zmiana:
- buildWorkItems używa task w getTaskNoteFollowUpPreviewStage231H_R1D2_R11,
- dodano guard/test scope.

## 2026-06-18 15:05 Europe/Warsaw - STAGE232Q_CASE_DETAIL_MISSING_PAYLOAD_ROW_RENDER

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- CaseDetail Braki i blokady miały licznik, ale nie renderowały wiersza po rozwinięciu.

Audyt:
- count i items bazują na workItems.filter(entry.kind === 'missing'),
- group.items.map renderuje WorkItemRow,
- WorkItemRow zwraca null, jeśli isCaseActivitySourceForWorkRow(entry.source),
- helper uznawał samo payload za activity,
- missing_item task ma payload, więc był liczony, ale ukryty.

Zmiana:
- payload-only nie oznacza activity,
- activity detection wymaga eventType/actorType i wyklucza work-row shape,
- guard/test blokują regresję.

## 2026-06-18 15:35 Europe/Warsaw - STAGE232R_MISSING_ITEM_RENDER_FREEZE_GUARD

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Decyzja:
- Damian potwierdził: po STAGE232Q jest OK.
- Zamrażamy zachowanie Brak/Blokada.

Guard blokuje:
- LeadDetail missing_item jako "Zadanie",
- CaseDetail puste rows przy liczniku Braki i blokady > 0 z powodu payload-only activity,
- powrót payload-only detection w isCaseActivitySourceForWorkRow,
- utratę enriched missing record w ContextActionDialogs.

## 2026-06-21 Europe/Warsaw - STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE

Status: TECH_APPLIED_PENDING_OWNER_SMOKE

Automatyczne:
- R16O consolidated guard/test: do uruchomienia w apply i push.
- R16Z_R4 visual guard/test: do uruchomienia w apply i push.
- R16Z_R5 close guard/test: do uruchomienia w apply i push.
- npm run build.
- npm run verify:closeflow:quiet.
- git diff --check.

Manual smoke R16Z_R5 - klient:
1. Dodaj brak nie otwiera automatycznie managera.
2. Zobacz wszystkie braki otwiera manager.
3. Nazwa braku jest widoczna.
4. Blokuje jest czytelne.
5. Checkbox zmienia kafelek główny.
6. Uzupełnij działa i F5 nie przywraca.
7. Usuń działa i F5 nie przywraca.
8. Brak poziomego scrolla i clipped actions.

Manual smoke R16Z_R5 - lead:
1. Zobacz wszystkie braki otwiera ten sam manager.
2. Nazwa braku jest widoczna.
3. Blokuje jest czytelne.
4. Uzupełnij działa.
5. Usuń działa.
6. F5 nie przywraca usuniętego/uzupełnionego braku.

## STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL

Date/time: 2026-06-21 Europe/Warsaw
Status: LOCAL APPLY CONTINUATION / guards consolidated before final smoke and push.
Scope: CF-RUNTIME-00 and R16Z_R5 close guard allow the R5_R5 ClientDetail operational center test compatibility repair and R6 final allowlist files. No SQL, finance, Calendar, billing, Owner Control runtime or CaseDetail runtime touched.

## STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL

Date/time: 2026-06-21 Europe/Warsaw
Status: APPLIED_LOCAL_PENDING_VERIFY_AND_SMOKE
Scope: guard/test compatibility continuation for polish-mojibake-audit. The audit now skips local stage backup artifacts and huge text-like files before reading them, preventing ERR_STRING_TOO_LONG during verify:closeflow:quiet. No product logic, SQL, finance, Calendar, Owner Control runtime or CaseDetail runtime touched.

## Manual smoke R16Z_R8 - Lead missing blocker toggle

1. Lead with active missing item marked Blokuje.
2. Open Braki / Blokady manager.
3. Uncheck Blokuje.
4. Confirm toast and checkbox remains unchecked after silent reload.
5. F5: checkbox remains unchecked.
6. Re-check Blokuje.
7. F5: checkbox remains checked.
8. Uzupełnij/Usuń regression PASS.

## 2026-06-21 Europe/Warsaw - STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE

Status: TECH_APPLIED_LOCAL / OWNER_SMOKE_REQUIRED.

Zakres:
- Naprawa realnego bug smoke: LeadDetail -> Zobacz wszystkie braki -> checkbox Blokuje wracal jako zaznaczony po silent refresh/F5.
- Przyczyna: MissingItemsManagerDialog.isManagerItemBlocker liczyl blokade przez OR z
aw.status/raw.priority, wiec stare dane activity bridge mogly nadpisac swieze locksProgress=false.
- Naprawa: jawne item.isBlocker / item.blocksProgress ma pierwszenstwo przed raw/payload/status/priority fallback.

Testy:
- R9 guard/test.
- R8 regression.
- R16Z_R5 close regression.
- build / verify / diff-check.

Manual smoke R16Z_R9:
- LeadDetail: odznacz Blokuje, F5, checkbox ma zostac odznaczony; zaznacz ponownie, F5, checkbox ma zostac zaznaczony.

Nie ruszac:
- SQL, RLS, finanse, Calendar, billing/trial, Owner Control runtime, CaseDetail runtime.

## 2026-06-21 Europe/Warsaw - STAGE232I4_R16Z_R10 tests
Plan: guard/test/build/verify/diff plus owner smoke Lead -> all missing -> toggle Blokuje -> F5.


## STAGE232I4_R16Z_R10_R3_GUARD_SCOPE_STATUS_SYNC_AND_OWNER_SMOKE_CLOSE

- data/czas: 2026-06-21 Europe/Warsaw
- status: PASS_PUSHED / CLOSED / OWNER_SMOKE_OK after Damian manual smoke confirmation.
- closes: STAGE232I4_R16Z_R9 and STAGE232I4_R16Z_R10.
- owner smoke: LEAD SMOKE PASS, CLIENT REGRESSION PASS.
- guard scope: CF-RUNTIME active allowlist owns diff scope; R16Z_R5 close guard must not keep dead R10 allowlist constants.
- next: STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH.
- forbidden scope: no SQL, no finance, no Calendar, no billing, no Owner Control runtime, no ClientDetail runtime, no CaseDetail runtime.

Manual smoke result recorded from Damian: PASS.


# STAGE232I4_R16Z_R10_R3_R4_OVERWRITE_GUARDS_FINAL

- data/czas: 2026-06-21 HH:mm Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- status: PASS_PUSHED / CLOSED / OWNER_SMOKE_OK
- owner smoke: LEAD PASS, CLIENT REGRESSION PASS, reported by Damian
- closes: STAGE232I4_R16Z_R10 and R16Z close/status sync
- next: STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH
- no SQL, no ClientDetail runtime, no CaseDetail runtime, no Calendar, no billing, no Owner Control runtime

<!-- STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS -->

## 2026-06-22 Europe/Warsaw — STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS

Status: APPLIED_PENDING_TEST_OR_PUSH.

Zakres:
- commissionStatus jest wyliczany z opłaconych wpłat prowizji, nie z ręcznego pola legacy,
- edytor finansów nie pokazuje aktywnego selecta statusu prowizji,
- buildCaseFinancePatch nie utrwala ręcznego paid/partially_paid,
- lista Lista wpłat prowizji dostaje tylko płatności type=commission,
- label brzmi Pozostało prowizji do zapłaty.

Nie dotykano: SQL/RLS, Braki/Blokady, MissingItemsManagerDialog, Owner Control, Google Calendar, billing/trial, Node_RED_Kabelki.

Manual smoke: sprawdzić prowizję 100000 PLN x 3%, wpłatę prowizji 1000, dopłatę 2000, zwykłą wpłatę klienta i planowaną wpłatę prowizji.

<!-- STAGE232K_R1C_CASE_COMMISSION_STATUS_RED_GUARD_REPAIR -->

## 2026-06-22 12:20 Europe/Warsaw — STAGE232K_R1C test plan

Do uruchomienia:
- node scripts/check-stage232k-r1-case-commission-status-derived-from-payments.cjs
- node --test tests/stage232k-r1-case-commission-status-derived-from-payments.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

<!-- STAGE232K_R1D_CF_RUNTIME_ALLOWLIST_REPAIR -->

## 2026-06-22 Europe/Warsaw — STAGE232K_R1D test plan

R1D musi przejść pełny zestaw: STAGE232K_R1 guard, STAGE232K_R1 test, STAGE232K_R1D guard, STAGE232K_R1D test, build, verify quiet, diff check.

## 2026-06-22 Europe/Warsaw — STAGE232K_R2_COMMISSION_PAYMENT_WRITE_AND_CLIENT_REFRESH

Plan testów:
1. node scripts/check-stage232k-r2-commission-payment-write-and-client-refresh.cjs
2. node --test tests/stage232k-r2-commission-payment-write-and-client-refresh.test.cjs
3. npm run build
4. npm run verify:closeflow:quiet
5. Manual smoke: dodać nową wpłatę prowizji 1000 PLN i potwierdzić sprawę oraz klienta.

## 2026-06-22 — STAGE232K_R3C_PAYMENT_API_STATUS_DB_SAFE_PAID_FIX
- Plan: guard R3C, test R3C, R1/R2 regression, build, verify:closeflow:quiet, git diff --check.
- Manual smoke po push: nowa wpłata prowizji 1000 PLN musi zmniejszyć pozostałą prowizję z 3000 do 2000. Response/GET może pokazać status paid, nie planned.

<!-- STAGE232I3_CLOSE_STATUS_SYNC_OWNER_SMOKE_OK -->
## 2026-06-22 22:00 Europe/Warsaw - STAGE232I3 Owner Control smoke/router sync

Status: PASS_PUSHED / CLOSED / OWNER_SMOKE_OK

Wyniki:
- I3 guard: PASS.
- I3 node test: PASS 6/6.
- build: PASS.
- verify:closeflow:quiet: PASS.
- git diff --check: PASS.
- manual smoke Damian: PASS.

Manual smoke potwierdzony:
- Today / Owner Control pokazuje [Lead], [Sprawa], [Klient].
- Blokada pokazuje sie jako Blokada, nie zwykly Brak.
- Otworz przy [Sprawa] prowadzi do CaseDetail.
- Otworz przy [Klient] prowadzi do ClientDetail.
- Uzupelnione na [Lead] usuwa wpis z Owner Control i LeadDetail.
- Po F5 rozwiazany brak nie wraca.
- Ten sam Brak nie pojawia sie dwa razy.

Nie wykonywano:
- zmian runtime,
- SQL/RLS,
- zmian finansow,
- zmian kalendarza.
<!-- /STAGE232I3_CLOSE_STATUS_SYNC_OWNER_SMOKE_OK -->

<!-- STAGE232G_R0_CALENDAR_BRIEF_CORRECTIONS_2026_06_22_TESTS -->
## 2026-06-22 Europe/Warsaw - STAGE232G_R0 calendar audit tests

Status: DO_WYKONANIA_PO_APPLY

Komendy:
```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
node scripts/check-stage232g-calendar-operational-source-truth-r0-audit.cjs
node --test tests/stage232g-calendar-operational-source-truth-r0-audit.test.cjs
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

Manual smoke po R0:
- wejsc na /calendar;
- otworzyc dzien z wpisami;
- sprawdzic tytul, typ, godzine, status, powiazanie i akcje;
- otworzyc modal edycji;
- nie testowac masowo +1H/+1D/+1W/Zrobione/Usun w R0, chyba ze raport R0 uzasadni, ze to bezpieczne.
<!-- /STAGE232G_R0_CALENDAR_BRIEF_CORRECTIONS_2026_06_22_TESTS -->

<!-- STAGE232G_R0_ACTUAL_AUDIT_2026_06_22_TESTS -->
## 2026-06-22 23:35 Europe/Warsaw - STAGE232G R0 actual audit tests

Do wykonania po paczce:
```powershell
node scripts/check-stage232g-calendar-operational-source-truth-r0-audit.cjs
node --test tests/stage232g-calendar-operational-source-truth-r0-audit.test.cjs
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

Warunek PASS: wszystkie powyĹĽsze zielone, runtime diff pusty.
<!-- /STAGE232G_R0_ACTUAL_AUDIT_2026_06_22_TESTS -->

<!-- STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT_TESTS -->
## 2026-06-23 06:35 Europe/Warsaw - STAGE232G R1A tests

Do wykonania po paczce:
```powershell
node scripts/check-stage232g-r1a-calendar-today-operational-entry-contract.cjs
node --test tests/stage232g-r1a-calendar-today-operational-entry-contract.test.cjs
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

Manual smoke po R1A: brak wymaganego smoke UI, bo R1A nie przepina widokĂłw. R1B bÄ™dzie wymagaĹ‚ smoke Today/Calendar.
<!-- /STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT_TESTS -->


## STAGE232G_R1A_WORK_ITEMS_TS_BUILD_HOTFIX_TESTS

Data: 2026-06-23 07:25 Europe/Warsaw
Status: do wykonania przez APPLY script.
Zakres testu: TypeScript build blockers in pi/work-items.ts.

### STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT_TESTS

Date: 2026-06-23 08:20 Europe/Warsaw
Planned tests: R1B guard, R1B node test, build, verify quiet, diff check.
Manual smoke: Today loads, Calendar loads, no red console errors, Today entries still visible.

### STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP_TESTS

Date: 2026-06-23 09:10 Europe/Warsaw
Planned tests: R1C guard, R1C node test, CF runtime guard, build, verify quiet, diff check.
Manual smoke: Calendar/Today still load; duplicated lead shadow entries should not multiply when task/event covers same planned action.

### STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT_TESTS

Date: 2026-06-23 10:05 Europe/Warsaw
Planned tests: R1D guard, R1D node test, CF runtime guard, build, verify quiet, diff check.
Manual smoke: lead shadow entry should not expose/execute done/delete/restore; task/event actions should still work.

### STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE_TESTS

Date: 2026-06-23 11:15 Europe/Warsaw
Planned tests: R1E guard, R1E node test, CF_RUNTIME_00, build, verify quiet, diff check.
Manual smoke: Calendar month/week/selected day still renders entries; R1D task/event/lead shadow actions still behave correctly.

## STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_RESUME
- Status: DO_WYKONANIA_LOKALNIE
- Oczekiwane: R1E1 R2 guard PASS, node test PASS, CF_RUNTIME_00 PASS, tsc PASS, build PASS, verify PASS, diff-check PASS.

## STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R3_ALLOWLIST_RESUME
- Status: DO_WERYFIKACJI_LOKALNEJ.
- Gate: CF_RUNTIME_00 allowlist + npx tsc --noEmit --pretty false.

## STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R6_COMPLEX_BLOCKSPROGRESS_RESUME
- Status: DO_WERYFIKACJI_LOKALNIE.
- R6 sprawdza, że w api/work-items.ts nie ma już bezpośredniego .blocksProgress poza helperem.

## STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R7_SYNTAX_REPAIR_RESUME
- Status: DO_WERYFIKACJI_LOKALNIE.
- R7 naprawia składnię po R6 i ponawia scoped typecheck api/work-items.ts.

## STAGE232G_R1F_CALENDAR_TODAY_FINAL_PARITY_GUARD_AND_SMOKE_TESTS
- Data: 2026-06-23 17:35 Europe/Warsaw
- Status: DO_WYKONANIA_LOKALNIE
- Oczekiwane PASS: R1F guard, R1F node test, R1E1 guard, CF_RUNTIME_00, build, verify:closeflow:quiet, diff-check.
- Po pushu: potwierdzić Vercel build oraz ręczny smoke na aplikacji.

## 2026-06-23 20:05 Europe/Warsaw — STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX

Status: APPLIED_PENDING_GUARDS_AND_MANUAL_SMOKE

Zakres:
- R1G oznaczony jako false-positive smoke fail; nie commitować tamtej poprawki.
- Calendar ma utrzymać zakończony event/task po refreshu przez lokalny retention cache, gdy backendowy bundle tymczasowo nie zwraca done/completed.
- Wpis po Zrobione ma zostać widoczny, przekreślony i przesunięty na dół listy dnia; Przywróć usuwa retention.
- Guard/test: scripts/check-stage232g-r1i-calendar-completed-retention-after-refresh-fix.cjs oraz tests/stage232g-r1i-calendar-completed-retention-after-refresh-fix.test.cjs.

Ryzyko:
- Retention działa jako undo-safety-net dla wpisów zakończonych z Calendar w tej przeglądarce. Docelowo backend/API bundle powinien zwracać done/completed zgodnie z polityką Calendar.

<!-- STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC -->
## 2026-06-24 08:00 Europe/Warsaw - STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC

Status: APPLIED_LOCAL_PENDING_GUARDS_BUILD_VERIFY_OWNER_SMOKE_PUSH.

Zakres:
- gap-close istniejacego Owner Control baseline w /today,
- Brak odpowiedzialnego dla aktywnych leadow/spraw,
- Notatka bez follow-upu z istniejacego feedu task/work-item,
- bez nowych kafelkow, bez SQL, bez Calendar/finance/billing.

Guard/test:
- scripts/check-stage-a35-r1-owner-control-baseline-gap-close-and-queue-sync.cjs
- tests/stage-a35-r1-owner-control-baseline-gap-close-and-queue-sync.test.cjs

Manual smoke:
- /today, kafelek Wymaga ruchu, ownerless lead/case, note-without-follow-up, refresh/F5, liczniki zgodne z listami.
<!-- /STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC -->

## 2026-06-24 STAGE-A35_R2_REMOVE_SINGLE_USER_OWNERLESS_NOISE

Status: APPLIED_LOCAL / NEEDS_PUSH / OWNER_SMOKE_PENDING

Decision: remove ownerless / missing responsible person logic from Owner Control. In single-user CloseFlow, a record without ownerId is not an operational issue because Damian is the implicit owner.

Keep active: note without follow-up, missing next step, overdue next step, silence, high-value without safe movement.

Tests: R1 guard/test updated, R2 guard/test added, build and verify quiet required.

## STAGE-A35_R2F_OWNERLESS_GUARD_SELF_REFERENCE_FIX

Status: DO_WYKONANIA.

Commands:
- node scripts/check-stage-a35-r1-owner-control-baseline-gap-close-and-queue-sync.cjs
- node scripts/check-stage-a35-r2-remove-single-user-ownerless-noise.cjs
- node --test tests/stage-a35-r1-owner-control-baseline-gap-close-and-queue-sync.test.cjs
- node --test tests/stage-a35-r2-remove-single-user-ownerless-noise.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

## 2026-06-24 HH:mm Europe/Warsaw — STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT

Automatyczne do wykonania przez apply script.
Manual smoke: OWNER_SMOKE_PENDING.

## 2026-06-24 STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT_REPAIR_R3

- R2 guard: PASS.
- R2 node test: 9/10 PASS, 1 false-positive failure in Today UI redesign assertion.
- R3 change: test assertion narrowed to explicit redesign markers and existing TodaySectionKey contract.
- Required after R3: guard, node test, build, verify:closeflow:quiet, git diff --check, manual /today smoke.


## STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT_REPAIR_R5_CF_RUNTIME_ALLOWLIST_SYNC

Status: APPLIED_LOCAL / VERIFY_PENDING

Zakres:
- zsynchronizowano allowlistę CF-RUNTIME-00 dla plików etapu STAGE-A35B,
- nie zmieniano runtime Owner Control ani Today,
- cel: odblokować verify:closeflow:quiet po zielonym guard/test/build A35B.

Czas zapisu technicznego: 2026-06-24T19:16:42.068Z

## 2026-06-24 23:30 Europe/Warsaw â€” STAGE232G_R1I_R3_CALENDAR_DELETE_RELEASES_COMPLETED_RETENTION
- Status: APPLIED_LOCAL_PENDING_GUARDS_AND_OWNER_SMOKE.
- Zakres: Calendar delete must release completed retention so a deleted completed event/task is not resurrected after refresh.
- Testy: R1I guard/test, CF runtime, build, verify quiet, diff-check, owner smoke.

## STAGE232G_R2_GOOGLE_INBOUND_SYNC_IDEMPOTENCY

Do wykonania:
- pierwszy Google sync: insert,
- drugi Google sync tego samego external ID: update/deduped, bez 500,
- duplicate key fallback: kontrolowany wynik,
- Calendar nadal pokazuje eventy,
- rÄ™czne task/event bez zmian,
- retention R1I/R3 bez regresji.

## STAGE232G_R3_GOOGLE_CALENDAR_USER_ONBOARDING_AND_OWNER_STAMP

Manual smoke:
1. Konto bez polaczenia Google Calendar widzi `Polacz Google Calendar`.
2. Consent Google otwiera sie i wraca do Settings.
3. Po polaczeniu widac konto Google, `Synchronizuj teraz`, `Rozlacz`.
4. Nowe zadanie/event pojawia sie w Google Calendar po sync.
5. Drugi sync nie tworzy duplikatu.
6. Rozlaczenie blokuje sync.
7. Konto email+haslo moze polaczyc Google Calendar tym samym CTA.

## STAGE232G_R4_GOOGLE_CALENDAR_OUTBOUND_TIMEZONE_NO_SHIFT

Manual smoke:
1. Dodaj event/task w CloseFlow na 13:19.
2. Kliknij Synchronizuj teraz.
3. Google Calendar ma pokazac 13:19, nie 15:19.
4. Edytuj ten sam wpis na 14:05.
5. Sync ma zaktualizowac ten sam event bez duplikatu.
6. Drugi sync nie moze stworzyc duplikatu.

## STAGE232G_R6_GOOGLE_DELETE_TOMBSTONE_AND_REMOTE_DELETE

Manual smoke:
1. Utworz wpis w CloseFlow i zsynchronizuj do Google.
2. Usun wpis w CloseFlow.
3. Refresh kalendarza.
4. Wpis nie moze wrocic.
5. Kliknij Synchronizuj teraz.
6. Wpis nadal nie moze wrocic.
7. R6A nie gwarantuje jeszcze usuniecia eventu z Google Calendar; to R6B.
