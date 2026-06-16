

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
