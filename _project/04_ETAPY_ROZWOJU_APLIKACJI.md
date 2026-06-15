# 04_ETAPY_ROZWOJU_APLIKACJI - CloseFlow / LeadFlow

Data utworzenia: 2026-06-12 23:59 Europe/Warsaw
Ostatnia regulacja kolejki: 2026-06-15 Europe/Warsaw
Status: ACTIVE / CANONICAL
Typ: centralna kolejność etapów rozwoju aplikacji
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Canonical name: CloseFlow / LeadFlow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Cel pliku

Ten plik odpowiada na pytanie:

```txt
Co wdrażamy teraz, co później i w jakiej kolejności?
```

To jest **jedyne aktywne źródło prawdy dla kolejki etapów**.
Run reporty w `_project/runs/` i payloady w `_project/obsidian_updates/` są szczegółami etapu, dowodami skanu, testami i historią, ale **nie zastępują tej kolejki**.

Nie wdrażać etapów z luźnej rozmowy, jeśli nie są wpisane albo potwierdzone w tym pliku.

## Powiązane pliki centralne

- `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md` - kierunek i uzasadnienie rozwoju,
- `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md` - problemy znalezione przez AI/audyt do decyzji Damiana,
- `_project/06_GUARDS_AND_TESTS.md` - rejestr guardów/testów,
- `_project/08_CHANGELOG_AI.md` - historia zmian,
- `_project/10_PROJECT_TIMELINE.md` - timeline projektu,
- `_project/13_TEST_HISTORY.md` - wyniki testów,
- `_project/15_SQL_LEDGER_AND_TESTED_SQL.md` - spis SQL, migracji i testów SQL,
- `_project/07_NEXT_STEPS.md` - stary plik pomocniczy; nie powinien być jedyną kolejką.

## Zasada etapów

Każdy etap musi mieć:

- audyt przed etapem,
- sprawdzenie, czy nie istnieje już częściowo,
- zakres,
- czego nie ruszać,
- guard/test,
- test ręczny dla Damiana,
- audyt po etapie,
- update `_project` i Obsidiana albo payload do synchronizacji,
- selektywny commit/push po PASS.

Statusy dopuszczalne:

- DO_WDROZENIA,
- W_TRAKCIE,
- LOCAL_ONLY,
- PASS_LOCAL,
- TECH_PUSHED,
- PRODUCT_PASS,
- PASS_WITH_EXPLICIT_RISK,
- BLOCKED,
- ODLOZONE,
- ZAMKNIETE.

## AKTUALNA KANONICZNA KOLEJKA - od 2026-06-15 Europe/Warsaw

### 0. STAGE231L_STAGE_QUEUE_CANONICAL_SYNC

Status: WYKONANE_W_TYM_COMMICIE / DOCS_ONLY

Cel: uporządkować wszystkie ostatnie etapy w tym jednym centralnym pliku.
Zakres: kolejka etapów, bez runtime, bez SQL, bez UI.
Warunek zamknięcia: ten plik zawiera aktualną kolejność; przyszłe etapy nie mogą być tylko w run reports albo payloadach.

---

### 1. STAGE232A_LEAD_MISSING_BLOCKER_SOURCE_OF_TRUTH

Status: NAJBLIŻSZY ETAP DO WDROŻENIA / PRIORYTET PRODUKTOWY

Powód priorytetu:

- Damian zgłosił realny błąd produkcyjny: dodany `Brak` pojawia się w historii, ale nie pojawia się w sekcji braków ani w blokadach.
- Historia pokazuje tytuł dwa razy zamiast czytelnego formatu `Brak: tytuł` + opis/typ pod spodem.
- LeadDetail ma wizualnie kilka miejsc pokazujących podobne działania, przez co użytkownik może widzieć duplikację zamiast jednego centrum pracy.
- To dotyka głównej obietnicy produktu: właściciel ma widzieć, co stoi, czego brakuje i co realnie blokuje ruch.

Cel:

Ustawić produkcyjny model `Brak` / `Blokada` w LeadDetail tak, żeby:

```txt
Brak = aktywny element pracy, który czegoś wymaga, ale nie musi blokować procesu.
Blokada = brak albo problem, który realnie zatrzymuje następny ruch.
Historia = dziennik zdarzeń, nie źródło prawdy dla aktywnych braków.
```

Kontrakt produktu:

- aktywne `Braki` w LeadDetail pochodzą z jednego źródła prawdy: powiązane work items / tasks z `leadId` i `type/kind = missing_item`,
- historia nie może być używana do liczenia aktywnych braków ani do odtwarzania usuniętych braków,
- dodanie braku ma utworzyć realny aktywny rekord pracy oraz wpis historii,
- `Brak` domyślnie nie jest blokadą,
- `Blokada` musi mieć jawne pole `blocksProgress = true` albo równoważny zapis w payloadzie,
- aplikacja nie może zgadywać po tytule, że dokument albo spotkanie blokuje proces,
- modal dodawania braku musi pozwolić określić, czy brak blokuje dalszy ruch i co blokuje,
- top card `Blokada` pokazuje tylko prawdziwe blokady, nie każdy brak,
- sekcja `Działania leada` staje się jednym centrum pracy z filtrami, a nie trzecią kopią tej samej listy,
- historia pokazuje czytelny wpis `Brak:` / `Blokada:` i nie powiela tytułu jako opisu.

Miejsca do audytu przed wdrożeniem:

- `src/pages/LeadDetail.tsx`,
- `src/components/ContextActionDialogs.tsx`,
- `src/lib/activity-timeline.ts`,
- helpery `insertTaskToSupabase`, `insertActivityToSupabase`, `emitCloseflowWorkItemNoFlickerMutation`,
- filtry `linkedTasks`, `activeMissingItemEntries`, `leadBlockerEntries`,
- komponent/sekcja `LeadActionGroup` albo odpowiednik `Działania leada`,
- testy/guardy Stage227/Stage228 dotyczące `missing_item`, `Braki i blokady`, no-flicker i delete/resolve.

Minimalny zakres wdrożenia R1:

1. Naprawić zapis `Brak` z modala tak, żeby zwracał i przekazywał realny `createdMissingTask` do lokalnego update/no-flicker i do `handleSaved`.
2. Ujednolicić aktywne źródło braków: `linkedTasks` / work items z `type/kind = missing_item`, `leadId`, statusem otwartym.
3. Dodać jawny model blokowania w payloadzie, jeśli nie ma jeszcze osobnej kolumny:
   - `blocksProgress: boolean`,
   - `blockScope: lead_next_action | offer | case_start | case_completion | payment | other | none`,
   - `missingKind: document | information | decision | payment | meeting | other`.
4. W modalu `Brak` dodać decyzję użytkownika:
   - `Czy to blokuje dalszy ruch?` Tak/Nie,
   - jeśli Tak: `Co blokuje?`.
5. Rozdzielić w UI:
   - `Braki` = wszystkie otwarte missing items,
   - `Blokady` = tylko missing/problem items z `blocksProgress=true`.
6. Naprawić formatter historii dla:
   - `missing_item_created`,
   - `missing_item_resolved`,
   - `missing_item_deleted`,
   - przyszłościowo `missing_item_blocking_changed`.
7. Ograniczyć duplikację list:
   - top cards = stan i decyzja,
   - `Działania leada` = jedyna lista operacyjna,
   - historia = dziennik,
   - prawy rail nie może być kolejną kopią tej samej listy.

Czego nie ruszać w R1:

- SQL, jeśli obecne pola da się obsłużyć payloadem; osobna migracja dopiero po schema check,
- Google Calendar,
- finanse,
- AI Drafts poza ewentualnym zachowaniem kompatybilności akcji `create_missing_item`,
- CaseDetail checklist rewrite,
- globalny layout aplikacji,
- pełne DMS/dokumenty jako osobny moduł.

Guardy/testy wymagane:

- `node scripts/check-stage232a-lead-missing-blocker-source-truth.cjs`,
- `node --test tests/stage232a-lead-missing-blocker-source-truth.test.cjs`,
- regresje Stage227/Stage228 missing item, jeśli istnieją,
- `npm run build`,
- `npm run verify:closeflow:quiet`, jeśli istnieje,
- `git diff --check`.

Test ręczny Damiana:

1. Wejdź w konkretnego leada.
2. Dodaj brak `TEST BRAK 123`, nieblokujący.
3. Sprawdź, że:
   - pojawia się w `Braki`,
   - nie pojawia się w top card `Blokada`,
   - historia pokazuje `Brak: TEST BRAK 123`, bez powtórzonego tytułu jako opisu.
4. Dodaj brak `TEST BLOKADA 123` i oznacz jako blokujący.
5. Sprawdź, że:
   - pojawia się w `Braki`,
   - pojawia się w `Blokady` i top card `Blokada`,
   - pokazuje, co blokuje.
6. Oznacz pierwszy brak jako rozwiązany.
7. Sprawdź, że znika z aktywnych braków, ale zostaje w historii jako rozwiązany.
8. Zrób hard refresh i potwierdź, że stan się nie rozjechał.

Warunek zamknięcia:

- brak dodany z LeadDetail jest widoczny w aktywnych brakach bez reloadu i po hard refresh,
- blokada jest jawnie oznaczona i nie jest zgadywana po tytule,
- historia nie dubluje tytułu,
- UI ma jedno centrum pracy, a nie trzy kopie tej samej listy,
- guardy i build są zielone,
- `_project`, changelog, test history, ryzyka i Obsidian payload są zaktualizowane.

Run decision do utworzenia: `_project/runs/STAGE232A_LEAD_MISSING_BLOCKER_SOURCE_OF_TRUTH.md`

---

### 2. STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH

Status: DO_WDROZENIA PO STAGE232A / PRIORYTET PRODUKTOWY P1

Powód priorytetu:

- Damian zgłosił podejrzenie, że zakładka `Dziś` pokazuje nielogiczne liczniki, np. kafelek `Co masz zrobić dzisiaj` ma 129 wpisów i wygląda, jakby lądowało tam wszystko.
- Aktywna trasa `/` i `/today` używa `src/pages/TodayStable.tsx`, a nie legacy `src/pages/Today.tsx`.
- `TodayStable` ma dobry kierunek owner-control, ale część nazw kafelków nie odpowiada dokładnie temu, co liczy kod.
- Największy problem: kafelek `Co masz zrobić dzisiaj` liczy `ownerControlBaseline.items.length`, czyli pełną listę Owner Control: leady, sprawy, zadania i wydarzenia wymagające ruchu; to nie jest czyste `dzisiaj`.
- To może obniżyć zaufanie użytkownika, bo ekran `Dziś` ma być centrum decyzji, a nie wysypiskiem wszystkich problemów.

Cel:

Ustawić produkcyjny kontrakt zakładki `Dziś` tak, żeby każdy kafelek odpowiadał na jedno jasne pytanie i liczył dokładnie tę samą kolekcję, którą pokazuje po kliknięciu.

```txt
Dziś = centrum decyzji operacyjnej właściciela.
Kafelek = licznik konkretnej listy.
Lista = jawne źródło danych i jawny filtr.
Owner Control = portfel wymagający ruchu, nie zawsze tylko dzisiejszy termin.
```

Audyt faktycznego stanu:

- Aktywny ekran: `src/pages/TodayStable.tsx`.
- Legacy ekran: `src/pages/Today.tsx`; nie ruszać go w tym etapie poza guardem, który ma potwierdzić, że aktywna trasa nadal używa `TodayStable`.
- Dane ładowane przez `loadStableTodayData()`:
  - `fetchTasksFromSupabase()`,
  - `fetchLeadsFromSupabase()`,
  - `fetchEventsFromSupabase()`,
  - `fetchCasesFromSupabase()`,
  - `getAiLeadDraftsAsync()`.
- Kafelki w `TodayStable`:
  - `Leady bez najbliższej akcji` = `noActionLeads.length`,
  - `Wysoka wartość / ryzyko` = `highValueAtRiskRows.length`,
  - `Leady czekające` = `waitingLeadRows.length`,
  - `Co masz zrobić dzisiaj` = `ownerControlBaseline.items.length`,
  - `Zadania do wykonania dziś` = `operatorTasks.length`,
  - `Wydarzenia dziś` = `todayEvents.length`,
  - `Najbliższe 7 dni` = `upcomingRows.length`,
  - `Szkice AI do sprawdzenia` = `pendingDrafts.length`.

Werdykt audytu:

- `Leady bez najbliższej akcji` jest logicznie sensowne, bo filtruje sygnał `Brak następnego kroku` z Owner Control.
- `Wysoka wartość / ryzyko` jest częściowo sensowne, ale wymaga doprecyzowania, czy sama wysoka wartość wystarczy, czy musi być wysoka wartość + ryzyko/ruch.
- `Leady czekające` jest sensowne, jeśli ustawienia `warningDays` są prawidłowe i liczone z realnej aktywności/contact truth.
- `Co masz zrobić dzisiaj` jest źle nazwane albo źle podpięte. Obecnie to nie jest tylko `dzisiaj`, tylko cały `ownerControlBaseline.items`.
- `Zadania do wykonania dziś` faktycznie obejmuje zadania zaległe i dzisiejsze, bo `operatorTasks` filtruje `dateKey <= todayKey`; nazwa może zostać, ale lepsza produkcyjnie to `Zadania zaległe i dziś` albo tytuł dynamiczny z istniejącej funkcji `getFb4TodayTasksSectionTitle`.
- `Wydarzenia dziś` jest najczystsze, bo filtruje wydarzenia z datą równą `todayKey`.
- `Najbliższe 7 dni` ucina listę do 10 rekordów przez `slice(0, 10)`, więc licznik pokazuje liczbę pokazanych rekordów, nie pełne obciążenie 7 dni. To trzeba jawnie oznaczyć albo zmienić na licznik pełny + lista top 10.
- `Szkice AI do sprawdzenia` jest sensowne, bo liczy status `draft`.

Kontrakt produkcyjny kafelków:

1. `Leady bez najbliższej akcji`
   - Źródło: `ownerControlBaseline.items` zawężone do `entityType=lead` i sygnału `Brak następnego kroku`.
   - Nie liczyć spraw, zadań i wydarzeń.
   - Klik pokazuje dokładnie tę samą kolekcję.

2. `Wysoka wartość / ryzyko`
   - Źródło: rekordy Owner Control z `valuePln >= threshold` oraz realnym ryzykiem: brak next step, zaległy ruch albo cisza.
   - Nie liczyć samej wysokiej wartości, jeśli rekord ma bezpieczny następny ruch i świeżą aktywność.
   - W opisie pokazać próg i powód.

3. `Leady czekające`
   - Źródło: leady z realną ciszą/contact truth >= `warningDays`.
   - Nie liczyć tylko `updatedAt`, jeśli istnieje realny kontakt/aktywność.
   - Nazwa alternatywna: `Cisza / czekają za długo`.

4. `Co masz zrobić dzisiaj`
   - Nie może liczyć pełnego `ownerControlBaseline.items.length`, jeśli zostaje taka nazwa.
   - Dwa dopuszczalne kierunki:
     - A: zmienić filtr na `ownerControlBaseline.items` tylko ze statusem `Dzisiaj` albo zaległe/dzisiaj, bez przyszłych planowanych rekordów,
     - B: zmienić nazwę na `Wymaga ruchu` / `Do obsługi` i jawnie opisać, że to pełna lista owner-control, nie tylko dzisiejszy kalendarz.
   - Rekomendacja: B jako R1, bo lepiej pasuje do produktu owner-control i nie ukrywa problemów tylko dlatego, że nie mają daty dzisiejszej.

5. `Zadania do wykonania dziś`
   - Źródło: `tasks` otwarte z datą `<= todayKey`.
   - Nazwa powinna być dynamiczna: jeśli są zaległe, `Zaległe zadania` albo `Zadania do obsługi`.
   - Klik pokazuje wyłącznie te zadania, nie całą listę tasks.

6. `Wydarzenia dziś`
   - Źródło: `events` otwarte z datą `== todayKey`.
   - Klik pokazuje dokładnie dzisiejsze wydarzenia.

7. `Najbliższe 7 dni`
   - Źródło: przyszłe tasks/events/leads z datą `> todayKey && <= todayKey+7`.
   - Licznik powinien oznaczać pełną liczbę rekordów w 7 dni albo kafelek powinien mówić `Najbliższe 10 z 7 dni`.
   - Rekomendacja: liczyć pełny zbiór, a listę nadal ograniczyć do top 10 z opisem `pokazano 10 z X`.

8. `Szkice AI do sprawdzenia`
   - Źródło: `drafts.status === draft`.
   - Finalny zapis nadal tylko w centrum szkiców, nie w Dziś.

Minimalny zakres wdrożenia R1:

1. Dodać w `TodayStable.tsx` jawne selektory/zmienne dla każdej kolekcji kafelka, np. `todayDueOwnerItems`, `ownerControlActionItems`, `upcomingRowsAll`, `upcomingRowsPreview`.
2. Zmienić nazwę kafelka `Co masz zrobić dzisiaj` na produkcyjnie prawdziwą nazwę, rekomendowane: `Wymaga ruchu` albo `Do obsługi`.
3. Jeżeli nazwa zostaje `Co masz zrobić dzisiaj`, zmienić źródło na tylko dzisiejsze/zaległe rekordy Owner Control.
4. Ujednolicić licznik kafelka z listą po kliknięciu: tile count === section count === liczba renderowanych rekordów albo jawnie oznaczony preview/full count.
5. Dodać helper copy przy głównej liście owner-control: `To nie jest kalendarz. To lista tematów, które wymagają decyzji/ruchu.`
6. Naprawić `Najbliższe 7 dni`: licznik pełny, lista preview top 10, tekst `pokazano 10 z X`, jeśli X > 10.
7. Upewnić się, że click kafelka otwiera dokładnie tę sekcję i nie tworzy scroll trap/reorder DOM.
8. Nie ruszać runtime starego `Today.tsx` poza ewentualnym guardem, że nie jest aktywną trasą.

Czego nie ruszać w R1:

- SQL/Supabase schema,
- płatności,
- Google Calendar sync,
- LeadDetail / STAGE232A,
- CaseDetail,
- pełny refactor Owner Control,
- legacy `src/pages/Today.tsx`,
- global layout aplikacji.

Guardy/testy wymagane:

- `node scripts/check-stage232b-today-owner-control-tiles.cjs`,
- `node --test tests/stage232b-today-owner-control-tiles.test.cjs`,
- `npm run build`,
- `npm run verify:closeflow:quiet` albo jawny SKIP z powodem, jeśli globalny gate blokują historyczne niezwiązane guardy,
- `git diff --check`.

Guard ma sprawdzić minimum:

- `src/App.tsx` nadal routuje `Today` z `./pages/TodayStable`,
- `src/pages/Today.tsx` ma marker legacy/inactive i nie jest aktywną trasą,
- każdy kafelek w `todayTiles` ma osobną, nazwaną kolekcję źródłową,
- kafelek `Co masz zrobić dzisiaj` nie może bez opisu liczyć `ownerControlBaseline.items.length`,
- jeśli używamy `upcomingRows.slice(0, 10)`, musi istnieć pełny count i tekst preview,
- tile count i section header count muszą korzystać z tej samej kolekcji albo jawnie opisanej pary `full/preview`.

Test ręczny Damiana:

1. Wejdź w `/today` albo ekran `Dziś`.
2. Sprawdź kafelek głównej listy owner-control:
   - jeśli nazywa się `Wymaga ruchu` / `Do obsługi`, liczba może być większa niż same zadania na dziś,
   - jeśli nazywa się `Co masz zrobić dzisiaj`, liczba nie może obejmować wszystkich problemów bez daty dzisiejszej.
3. Kliknij każdy kafelek i sprawdź, że otwiera właściwą sekcję:
   - Leady bez najbliższej akcji,
   - Wysoka wartość / ryzyko,
   - Leady czekające,
   - Wymaga ruchu / Do obsługi,
   - Zadania,
   - Wydarzenia,
   - Najbliższe 7 dni,
   - Szkice AI.
4. Porównaj licznik kafelka z licznikiem nagłówka sekcji.
5. Sprawdź `Najbliższe 7 dni`: jeśli jest więcej niż 10 rekordów, UI ma jasno powiedzieć, że pokazuje preview.
6. Oznacz zadanie jako zrobione i potwierdź, że znika z aktywnej listy po refreshu.
7. Przeładuj stronę i potwierdź, że stan się nie rozjeżdża.

Warunek zamknięcia:

- żaden kafelek nie udaje innej listy niż liczy,
- `Co masz zrobić dzisiaj` nie pokazuje pełnego owner-control bez prawdziwej nazwy/opisu,
- licznik kafelka i lista są zgodne,
- `Najbliższe 7 dni` ma pełny count albo jawny preview count,
- aktywna trasa nadal używa `TodayStable`,
- guardy i build są zielone,
- `_project`, changelog, test history, ryzyka i Obsidian payload są zaktualizowane.

Run decision do utworzenia: `_project/runs/STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH.md`

---

### 3. STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME

Status: PO STAGE232A/STAGE232B ALBO WCZEŚNIEJ, JEŚLI DYKTOWANIE SPRAW BLOKUJE TESTY UŻYTKOWNIKA

Cel: przywrócić realne dyktowanie notatki w CaseDetail.

Kontrakt:

- przycisk `Dyktuj notatkę` nie może być disabled ani `wkrótce`,
- używa SpeechRecognition / webkitSpeechRecognition,
- transkrypcja trafia do notatki sprawy,
- autosave po około 2 sekundach ciszy,
- zapis jako activity/note z `caseId`,
- po hard refresh notatka zostaje,
- nie zapisuje pustych notatek,
- nie tworzy duplikatów autosave,
- brak wsparcia przeglądarki / odmowa mikrofonu ma jasny komunikat.

Nie ruszać:

- Google Calendar,
- SQL,
- billing/trial,
- AI Drafts,
- koszty zwrócone R1E,
- global layout.

Run decision: `_project/runs/STAGE231H_R1D_CASE_DETAIL_NOTE_DICTATION_RESTORE.md`
