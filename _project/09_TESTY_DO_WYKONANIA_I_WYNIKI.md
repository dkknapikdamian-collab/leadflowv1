

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
