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

### 3. STAGE232C_CLIENTS_RELATION_TILE_SOURCE_OF_TRUTH

Status: DO_WDROZENIA PO STAGE232A/STAGE232B ALBO WCZEŚNIEJ, JEŚLI ZAKŁADKA KLIENCI BLOKUJE TESTY PRODUKTOWE / PRIORYTET PRODUKTOWY P1

Powód priorytetu:

- Damian zlecił szczegółowy audyt zakładki `Klienci`: każdy kafelek, źródła danych, kliknięcia, spójność kolorystyki, styl i produkcyjne podpięcie.
- Zakładka `Klienci` jest jedną z głównych powierzchni owner-control: ma mówić, gdzie są relacje, pieniądze, brak sprawy, brak ruchu i najbliższy krok.
- Aktualny kod ma dobry fundament, bo lista klientów startuje z `clients`, a leady/sprawy/płatności/zadania/wydarzenia są kontekstem relacji, nie źródłem wierszy.
- Jednocześnie kilka kafelków i filtrów jest mylących:
  - `Aktywni` liczy wszystkich niearchiwalnych klientów, ale helper mówi `z otwartą sprawą`.
  - `Bez sprawy` liczy klientów bez spraw, ale kliknięcie nie ustawia realnego filtra `bez sprawy`.
  - `Prowizja` miesza aktywną prowizję, fallback z leadów i czasem płatności, mimo że helper mówi `do zarobienia`.
  - `Bez ruchu` liczy klientów bez leadów, a nie realną ciszę/brak aktywności.
  - `Filtry kontaktu` dla klientów nie dostają pełnego `relatedRecordsById`, więc mogą opierać się głównie na `lastContactAt`, zamiast na prawdziwej aktywności relacji.
  - Prawy rail `Filtry proste` dubluje kafelki, ale nie zawsze ma realny stan filtra.
  - `Najwyższa prowizja` używa własnego mapowania wartości, a importowany helper `buildTopClientValueEntries` nie jest faktycznie użyty.

Cel:

Ustawić produkcyjny kontrakt zakładki `Klienci` tak, żeby każdy kafelek, filtr, lista i prawy rail odpowiadały na jedno konkretne pytanie biznesowe:

```txt
Którzy klienci są aktywni?
Którzy nie mają żadnej sprawy?
Gdzie jest aktywna prowizja do zarobienia?
Który klient nie ma ruchu / kontaktu?
Jaka jest najbliższa akcja klienta?
Czy lista po kliknięciu pokazuje dokładnie to, co obiecuje kafelek?
```

Audyt faktycznego stanu:

- Aktywna trasa `/clients` używa `src/pages/Clients.tsx`.
- `Clients.tsx` ładuje:
  - `fetchClientsFromSupabase()`,
  - `fetchLeadsFromSupabase()`,
  - `fetchCasesFromSupabase()`,
  - `fetchPaymentsFromSupabase()`,
  - `fetchTasksFromSupabase()`,
  - `fetchEventsFromSupabase()`.
- Główna lista `filtered` startuje z `clients`, nie z leadów. To jest właściwy kierunek.
- `countersByClientId` liczy powiązane leady, sprawy i płatności po `clientId`.
- `nearestActionByClientId` bierze zadania/wydarzenia powiązane bezpośrednio z klientem oraz przez powiązane leady/sprawy.
- `operationalRecordsByClientId` dodaje klienta, leady, sprawy, płatności, taski i eventy, ale taski/eventy tylko jeśli mają bezpośredni `clientId`; trzeba sprawdzić powiązania po `leadId/caseId`.
- `contactCadenceGrid` dla klientów jest budowany bez `relatedRecordsById`, więc filtry ciszy mogą nie widzieć realnej aktywności w leadach/sprawach/zadaniach/wydarzeniach.
- `activeCount` = wszyscy niearchiwalni klienci.
- `clientsWithoutCases` = niearchiwalni klienci z `cases === 0`.
- `relationValue` = suma `clientValueByClientId`, gdzie `clientValueByClientId` może używać: aktywnej wartości ze spraw, wartości leadów, wartości z klienta albo fallbacku płatności.
- `staleClients` = klienci bez powiązanych leadów. To nie jest poprawna definicja `bez ruchu`.
- Kafelek `Bez sprawy` i prawy filtr `Bez sprawy` tylko wywołują `setShowArchived(false)`, więc nie zawężają listy do klientów bez sprawy.
- Kolorystyka kafelków używa `StatShortcutCard` i `OperatorMetricTile`, więc kierunek jest spójny z systemem, ale konkretne tony wymagają mapy semantycznej:
  - aktywni / relacje = blue,
  - bez sprawy / uwaga miękka = amber albo neutral,
  - aktywna prowizja = green,
  - brak ruchu / ryzyko = red,
  - kosz = neutral/amber, nie czerwony blok.
- Lista klientów korzysta z `closeflow-record-list-source-truth.css` wspólnego dla leadów i klientów, więc styl jest zasadniczo spójny z LeadListCard.
- `clients-next-action-layout.css` zawiera wiele reguł dla starego układu `:not(.cf-client-row-two-line)`, podczas gdy aktywny wiersz ma `cf-client-row-two-line`. Trzeba usunąć martwe/nieaktywne zależności tylko po guardzie, nie na ślepo.

Kontrakt produkcyjny kafelków:

1. `Aktywni`
   - Źródło: wszyscy niearchiwalni klienci.
   - Helper: `niearchiwalni klienci`, nie `z otwartą sprawą`.
   - Klik: filtr `active` albo reset do aktywnych.
   - Nie mylić z `Klienci z aktywną sprawą`.

2. `Bez sprawy`
   - Źródło: niearchiwalni klienci, dla których liczba spraw = 0.
   - Klik: ustawia realny filtr `without-case`.
   - Lista po kliknięciu pokazuje tylko klientów bez sprawy.
   - Helper: `tylko kontakt`.

3. `Prowizja`
   - Źródło R1: suma `activeCommission` z `clientFinanceByClientId`, nie fallback z płatności.
   - Helper: `aktywna prowizja`, nie ogólne `do zarobienia`, jeśli w liczbie nie ma tylko aktywnej prowizji.
   - Prawy rail `Najwyższa prowizja` ma używać tej samej definicji co kafelek i wiersz.
   - Lifetime earned zostaje osobnym polem w wierszu, ale nie miesza się z aktywną prowizją.

4. `Bez ruchu`
   - Źródło: contact cadence / activity truth, nie `brak leadów`.
   - Minimalnie w R1: klienci z bucketami `silent_7`, `silent_14_plus`, `unknown` albo bez najbliższej akcji, zgodnie z ustawieniami.
   - Lepsza nazwa, jeśli zakres jest szeroki: `Wymaga kontaktu`.
   - Klik: ustawia realny filtr `stale` / `needs-contact`.

5. `Filtry kontaktu`
   - Źródło: `buildContactCadenceGrid` z `relatedRecordsById` dla klienta.
   - `relatedRecordsById` musi zawierać:
     - klienta,
     - powiązane leady,
     - powiązane sprawy,
     - taski/eventy powiązane bezpośrednio z klientem,
     - taski/eventy powiązane przez leadId/caseId,
     - płatności powiązane z klientem/sprawą, jeśli activity-truth ich używa.
   - Kliknięcie bucketu ma realnie filtrować listę.

6. `Prawy rail - Filtry proste`
   - Nie może być martwą kopią top kafelków.
   - Każdy element musi ustawić taki sam stan filtra jak odpowiadający kafelek.
   - Jeśli filtr nie istnieje, element z raila nie powinien udawać przycisku filtra.

7. `Najwyższa prowizja`
   - Źródło: top 5 klientów wg tej samej aktywnej prowizji co kafelek `Prowizja`.
   - Jeśli pokazywana jest wartość relacji, nazwa musi brzmieć `Najwyższa wartość relacji`, nie `Najwyższa prowizja`.

Minimalny zakres wdrożenia R1:

1. Dodać jawny stan filtra klientów:
   - `all`,
   - `without_case`,
   - `needs_contact` albo `stale`,
   - opcjonalnie `high_value`.
2. Ujednolicić kliknięcia top kafelków i prawego raila:
   - `Aktywni` resetuje do aktywnych/all,
   - `Bez sprawy` filtruje tylko klientów bez spraw,
   - `Bez ruchu` filtruje klientów wymagających kontaktu,
   - `Prowizja` może sortować po aktywnej prowizji albo ustawić filtr/sortowanie, ale musi to pokazać helperem.
3. Zmienić helper `Aktywni` z `z otwartą sprawą` na `niearchiwalni klienci`, chyba że powstaje osobny kafelek `Z aktywną sprawą`.
4. Zmienić definicję `staleClients`; nie może oznaczać `brak leadów`.
5. Dodać `relatedRecordsByClientId` i przekazać do `buildContactCadenceGrid`.
6. Ujednolicić definicję aktywnej prowizji:
   - kafelek `Prowizja`,
   - wiersz klienta `Aktywna prowizja`,
   - prawy rail `Najwyższa prowizja`.
7. Uporządkować nazwy:
   - jeśli liczba pokazuje prowizję aktywną, nazwa/helper mówią `Aktywna prowizja`,
   - jeśli liczba pokazuje wartość relacji, nazwa mówi `Wartość relacji`.
8. Sprawdzić kolorystykę:
   - używać `StatShortcutCard`/`OperatorMetricTile`,
   - nie dodawać lokalnych kolorów poza systemem,
   - tony zgodne z semantyką.
9. Dodać guard i test kontraktu źródeł danych.
10. Nie usuwać legacy CSS bez osobnego guardu, ale zablokować dodawanie nowych styli poza wspólnym source-of-truth.

Czego nie ruszać w R1:

- SQL / Supabase schema,
- ClientDetail,
- CaseDetail,
- LeadDetail / STAGE232A,
- TodayStable / STAGE232B,
- płatności runtime,
- Google Calendar,
- globalny layout aplikacji,
- duży redesign całej listy,
- migracja finansów.

Guardy/testy wymagane:

- `node scripts/check-stage232c-clients-relation-tiles.cjs`
- `node --test tests/stage232c-clients-relation-tiles.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet` albo jawny SKIP z powodem, jeśli globalny gate blokują historyczne niezwiązane guardy
- `git diff --check`

Guard ma sprawdzić minimum:

- `/clients` nadal routuje do `src/pages/Clients.tsx`,
- lista `filtered` startuje z `clients`, nie z leadów,
- `Aktywni` nie ma helpera `z otwartą sprawą`, jeśli licznik = wszyscy niearchiwalni,
- `Bez sprawy` ma realny filtr stanu, nie tylko `setShowArchived(false)`,
- `Bez ruchu` nie może być liczone jako `clients with leads === 0`,
- `buildContactCadenceGrid({ entityType: 'client' })` dostaje `relatedRecordsById`,
- `Prowizja`/`Najwyższa prowizja` korzystają z tej samej definicji aktywnej prowizji co wiersz klienta,
- top kafelki i prawy rail nie są martwymi przyciskami,
- tony kafelków są z systemu `StatShortcutCard`/`OperatorMetricTile`,
- nie dodano nowego lokalnego systemu kolorów dla klientów.

Test ręczny Damiana:

1. Wejdź w `/clients`.
2. Sprawdź kafelek `Aktywni`:
   - liczba = wszyscy niearchiwalni,
   - opis nie mówi `z otwartą sprawą`, jeśli nie jest to prawda.
3. Kliknij `Bez sprawy`:
   - lista ma pokazać tylko klientów bez spraw,
   - licznik kafelka i liczba w filtrze/listingu mają się zgadzać.
4. Kliknij `Bez ruchu` / `Wymaga kontaktu`:
   - lista ma pokazać klientów z ciszą/brakiem kontaktu/brakiem następnej akcji według activity-truth,
   - nie może to oznaczać tylko `brak leadów`.
5. Porównaj kafelek `Prowizja`, wiersze klientów i prawy rail `Najwyższa prowizja`:
   - wszystkie używają tej samej definicji aktywnej prowizji.
6. Sprawdź kolorystykę:
   - kafelki mają ten sam styl jak Leady/Dziś,
   - brak czerwonych plam poza realnym ryzykiem,
   - przyciski kosza są subtelne, nie dominują listy.
7. Sprawdź mobile:
   - wiersz klienta nie rozjeżdża telefonu, e-maila, prowizji i najbliższej akcji.
8. Hard refresh:
   - filtr i lista nie pokazują pustych/losowych danych,
   - nie pojawiają się rekordy z kosza w aktywnych.

Warunek zamknięcia:

- każdy kafelek liczy dokładnie to, co mówi,
- klik każdego kafelka i każdego prostego filtra zmienia realny widok,
- `Bez ruchu` bazuje na activity-truth/contact cadence, nie na braku leadów,
- `Prowizja` jest spójna między kafelkiem, wierszem i prawym railem,
- kolorystyka jest zgodna z globalnym UI systemem,
- guardy, testy, build i `git diff --check` są zielone,
- `_project`, changelog, test history, ryzyka i Obsidian payload są zaktualizowane.

Run decision do utworzenia: `_project/runs/STAGE232C_CLIENTS_RELATION_TILE_SOURCE_OF_TRUTH.md`

---

### 4. STAGE232D_CASES_OPERATIONAL_TILES_SOURCE_OF_TRUTH

Status: DO_WDROZENIA PO STAGE232A/STAGE232B/STAGE232C ALBO WCZEŚNIEJ, JEŚLI ZAKŁADKA SPRAWY BLOKUJE TESTY PRODUKTOWE / PRIORYTET PRODUKTOWY P1

Powód priorytetu:

- Damian zlecił szczegółowy audyt zakładki `Sprawy`: każdy kafelek, prawy rail, lista, kolorystyka, styl i produkcyjne źródła danych.
- Zakładka `Sprawy` jest głównym panelem obsługi spraw. Ma pokazywać: co jest otwarte, co czeka na klienta, co jest zablokowane, co jest gotowe, gdzie brakuje ruchu, gdzie są akceptacje, gdzie jest ryzyko.
- Aktualny ekran ma dobry fundament: `/cases` używa `src/pages/Cases.tsx`, pobiera sprawy, leady, klientów, zadania i wydarzenia, a filtrowanie opiera się na `caseView`.
- Jednocześnie audyt wykazał kilka błędów kontraktu produktu:
  - `Czeka na klienta` liczy `blocked` albo `waiting_approval`, a nie czysto sprawy czekające na klienta.
  - `Sprawy bez ruchu` w prawym railu używa `stats.waiting`, czyli tej samej liczby co `Czeka na klienta`, a to nie jest to samo.
  - `Portal klienta` używa `stats.linked`, czyli spraw z `leadId`, a nie spraw z gotowym portalem klienta.
  - `Blokery i ryzyko` pokazuje `filteredCases.slice(0, 4)`, czyli pierwsze sprawy z aktualnej listy, nie najważniejsze ryzyka.
  - `Braki 0` w railu może być fałszywe, bo `resolveCaseListLifecycle()` nie dostaje checklist/items, tylko tasks/events.
  - `Brak następnego ruchu` / `Pieniądze bez ruchu` może pojawiać się mimo najbliższego terminu, bo `getCaseOwnerRiskBadges()` nie dostaje poprawnego `nextMove` ani `nearestAction`; obecnie przekazywane pola `nearestCaseAction`, `lifecycle`, `nextActionLabel` nie są czytane przez helper.
  - Wiersz pokazuje etykietę `Najbliższy termin w sprawie`, ale gdy nie ma terminu, fallbackiem jest instrukcja typu `Dodaj zadanie...`, a pod spodem bywa `updatedAt`, co udaje datę terminu.
  - `Postęp` bazuje na `record.completenessPercent`, a lifecycle liczy completeness z `items`, których lista nie przekazuje. Źródło postępu nie jest jawne.

Cel:

Ustawić produkcyjny kontrakt zakładki `Sprawy` tak, żeby każdy kafelek, filtr, wiersz i prawy rail odpowiadały na konkretne pytanie biznesowe:

```txt
Które sprawy są otwarte?
Które realnie czekają na klienta?
Które są zablokowane?
Które są gotowe do startu/zakończenia?
Które nie mają zaplanowanego następnego ruchu?
Które są bez ruchu / bez świeżej aktywności?
Które mają portal klienta gotowy?
Które mają największe realne ryzyko?
```

Audyt faktycznego stanu:

- `src/App.tsx` routuje `/cases` do lazy page `src/pages/Cases.tsx`.
- `src/pages/Cases.tsx` pobiera:
  - `fetchCasesFromSupabase()`,
  - `fetchLeadsFromSupabase()`,
  - `fetchClientsFromSupabase()`,
  - `fetchTasksFromSupabase()`,
  - `fetchEventsFromSupabase()`.
- `CaseView` obejmuje:
  - `open`,
  - `closed`,
  - `all`,
  - `waiting`,
  - `blocked`,
  - `approval`,
  - `ready`,
  - `needs_next_step`,
  - `linked`.
- `activeCases` = sprawy niezamknięte.
- `closedCases` = sprawy zamknięte.
- `stats.open` = `activeCases.length`.
- `stats.all` = `cases.length`.
- `stats.closed` = `closedCases.length`.
- `stats.waiting` = lifecycle bucket `blocked` albo `waiting_approval`.
- `stats.blocked` = lifecycle bucket `blocked`.
- `stats.approval` = lifecycle bucket `waiting_approval`.
- `stats.ready` = lifecycle bucket `ready_to_start`.
- `stats.needsNextStep` = lifecycle bucket `needs_next_step`.
- `stats.linked` = aktywne sprawy z `leadId`.
- `filteredCases` wybiera source po `caseView`: closed/all/active, a potem filtruje po search i lifecycle.
- `resolveCaseListLifecycle()` dostaje tylko tasks/events, nie dostaje checklist/items.
- Wiersz liczy `nearestCaseAction` z tasks/events powiązanych z caseId.
- `getCaseOwnerRiskBadges()` w wierszu dostaje parametry niezgodne z kontraktem helpera; helper oczekuje `nextMove`, `activityTruth`, `relatedRecords` albo `hasNextStep`, a nie `nearestCaseAction`.
- Prawy rail `Blokery i ryzyko` bierze `filteredCases.slice(0, 4)`, nie sortuje po ryzyku.

Kontrakt produkcyjny kafelków:

1. `Otwarte sprawy`
   - Źródło: `activeCases.length`.
   - Klik: view `open`.
   - Status: OK.

2. `Czeka na klienta`
   - Źródło: tylko sprawy, które realnie czekają na klienta:
     - status `waiting_on_client`,
     - albo jawny lifecycle bucket `waiting_on_client`, jeśli powstanie,
     - albo brak/blokada oznaczona jako zależna od klienta.
   - Nie mieszać z `blocked` i `approval`.
   - Klik: view `waiting_client` albo `waiting_on_client`.

3. `Zablokowane`
   - Źródło: status `blocked` albo jawne `blocksProgress=true`.
   - W R1 można użyć lifecycle `blocked`, ale tylko jeśli lifecycle dostaje prawdziwe braki/checklist/items.
   - Nie liczyć każdej sprawy czekającej na klienta jako blokady, jeśli nie ma jawnego blokera.

4. `Gotowe`
   - Źródło: status `ready_to_start` albo kompletność wymaganych elementów 100% z prawdziwego checklist/source.
   - Jeśli checklist/items nie są dostępne na liście, nie udawać gotowości z pustych danych.

5. `Bez zaplanowanej akcji`
   - Źródło: brak otwartego task/event z poprawną datą dla caseId.
   - Może pozostać jako `needs_next_step`, ale nazwa i filtr muszą być konsekwentne.

6. `Sprawy bez ruchu`
   - Źródło: activity-truth / brak świeżej aktywności / brak kontaktu według progów owner-risk.
   - Nie może używać `stats.waiting`.
   - Osobny view: `no_movement` albo `stale`.

7. `Portal klienta`
   - Źródło: `portalReady === true` albo osobny stan portalu.
   - Jeśli licznik ma oznaczać sprawy powiązane z leadem, nazwa musi brzmieć `Z leada` / `Powiązane z leadem`, nie `Portal klienta`.

8. `Akceptacje`
   - Źródło: `waitingApprovalCount > 0` albo status `to_approve`.
   - Musi dostać prawdziwe checklist/items/uploaded, nie pustą listę.

Kontrakt produkcyjny wiersza sprawy:

- Lewa część: tytuł, klient, statusy i ryzyka.
- `Postęp`:
  - jeśli źródło = `record.completenessPercent`, nazwać `Postęp zapisany`,
  - docelowo źródło = checklist/items + finanse/obsługa według CaseDetail.
- `Najbliższy termin w sprawie`:
  - pokazywać tylko realny najbliższy task/event z datą,
  - jeśli go nie ma: `Brak zaplanowanego terminu`,
  - nie pokazywać `updatedAt` jako terminu sprawy,
  - `updatedAt` może być pokazany jako `Ostatnia aktualizacja`.
- Owner-risk badges:
  - muszą używać tego samego `nearestCaseAction` co wiersz,
  - do `getCaseOwnerRiskBadges()` przekazać jawny `nextMove = buildNextMoveContract({ entityType: 'case', entityId, status, nearestAction })`,
  - przekazać `relatedRecords` albo `activityTruth`, żeby `Sprawa bez ruchu` nie była liczona z pustego kontekstu.
- Badge `Pieniądze bez ruchu` może pojawić się tylko wtedy, gdy sprawa ma wysoką wartość i naprawdę brakuje następnego ruchu albo jest zaległy.

Kontrakt prawego raila:

1. `Operacyjne skróty`
   - każdy element musi ustawiać realny view/filtr, który pokazuje dokładnie tę samą kolekcję co licznik.
   - `Sprawy bez ruchu` dostaje osobny licznik i osobny view.
   - `Portal klienta` nie może liczyć `leadId`.

2. `Blokery i ryzyko`
   - nie może pokazywać pierwszych 4 spraw z `filteredCases`.
   - ma zbudować `riskRows` z aktywnych spraw i sortować:
     1. high risk,
     2. blocked,
     3. money-without-motion,
     4. overdue/missing next move,
     5. missing required count,
     6. high value.
   - jeśli ryzyka brak, pokazać `Brak aktywnych ryzyk`, nie losowe pierwsze sprawy.

Kolorystyka i styl:

- Top kafelki mogą zostać na `StatShortcutCard`:
  - otwarte = blue,
  - czeka na klienta = amber,
  - zablokowane = red,
  - gotowe = green.
- Prawy rail ma używać `SimpleFiltersCard` i `data-cf-operator-rail-tone`, bez lokalnego nowego systemu kolorów.
- Wiersze spraw powinny korzystać ze wspólnego systemu list albo osobnego jawnego `cases-list-source-truth`; aktualny `closeflow-record-list-source-truth.css` opisuje scope `/leads and /clients`, a `Cases.tsx` używa klas `lead-main-cell`, `lead-value-cell`, `lead-action-cell`. To jest techniczny dług: działa wizualnie, ale nazewnictwo nie jest czyste.
- Nie robić dużego redesignu. Najpierw naprawić prawdę danych i nazwy.

Minimalny zakres wdrożenia R1:

1. Dodać jawne kolekcje:
   - `openCaseRows`,
   - `closedCaseRows`,
   - `waitingOnClientRows`,
   - `blockedCaseRows`,
   - `readyCaseRows`,
   - `needsNextStepRows`,
   - `noMovementCaseRows`,
   - `portalReadyCaseRows`,
   - `approvalCaseRows`,
   - `riskRows`.
2. `stats` ma być budowane z tych kolekcji, nie z niejawnego mieszania bucketów.
3. Top card `Czeka na klienta` przestaje liczyć `blocked || waiting_approval`.
4. Prawy rail `Sprawy bez ruchu` przestaje używać `stats.waiting`.
5. Prawy rail `Portal klienta` przestaje używać `leadId`; używa `portalReady`.
6. `getCaseOwnerRiskBadges()` dostaje prawdziwy `nextMove` z `nearestCaseAction`.
7. `activityTruth` / `relatedRecords` dla spraw ma zawierać tasks/events/case/payments, jeśli dostępne.
8. `Blokery i ryzyko` sortuje po realnym ryzyku, nie po kolejności listy.
9. `Braki 0` nie może być pokazane, jeśli lista nie ma source dla checklist/items. Albo podpiąć items, albo ukryć/zmienić etykietę.
10. `Najbliższy termin w sprawie` nie używa `updatedAt` jako daty terminu.
11. Dodać guard i test kontraktu źródeł danych.
12. Zaktualizować `_project`, run report, guard registry, test history, risks, changelog i Obsidian payload.

Czego nie ruszać w R1:

- CaseDetail layout freeze STAGE231D0D-R4,
- SQL/migracje bez osobnego schema check,
- finanse CaseDetail,
- Google Calendar sync,
- LeadDetail braki/blokady STAGE232A,
- TodayStable STAGE232B,
- Clients STAGE232C,
- duży redesign globalnego layoutu,
- masowe usuwanie CSS bez guardu.

Guardy/testy wymagane:

- `node scripts/check-stage232d-cases-operational-tiles.cjs`
- `node --test tests/stage232d-cases-operational-tiles.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet` albo jawny SKIP z powodem, jeśli blokuje historyczny niezwiązany gate
- `git diff --check`

Guard ma sprawdzić minimum:

- `/cases` nadal używa `src/pages/Cases.tsx`,
- `stats.waiting` nie liczy `blocked || waiting_approval`,
- `Sprawy bez ruchu` nie używa `stats.waiting`,
- `Portal klienta` nie używa `leadId`,
- `riskRows` nie jest `filteredCases.slice(0, 4)`,
- `getCaseOwnerRiskBadges()` dostaje `nextMove` albo `activityTruth/relatedRecords`,
- badge `Brak następnego ruchu` nie pojawia się, jeśli `nearestCaseAction` istnieje i ma poprawną datę,
- `Najbliższy termin w sprawie` nie pokazuje `updatedAt` jako terminu,
- `Braki 0` nie jest renderowane z pustego source checklist/items,
- top cardy i rail mają spójne liczniki z tymi samymi kolekcjami,
- nie dodano lokalnego, niespójnego systemu kolorów.

Test ręczny Damiana:

1. Wejdź w `/cases`.
2. Sprawdź top cardy:
   - `Otwarte sprawy` = aktywne niezamknięte sprawy,
   - `Czeka na klienta` = tylko sprawy realnie zależne od klienta,
   - `Zablokowane` = tylko realne blokady,
   - `Gotowe` = tylko gotowe do startu/zamknięcia według source.
3. Kliknij każdy top card i sprawdź, czy lista pokazuje dokładnie to, co licznik.
4. Kliknij prawy rail:
   - `Bez zaplanowanej akcji`,
   - `Portal klienta`,
   - `Sprawy bez ruchu`,
   - `Akceptacje`.
5. Dla sprawy z najbliższym terminem sprawdź, czy nie ma badge `Brak następnego ruchu`.
6. Dla sprawy bez terminu sprawdź, czy widzisz `Brak zaplanowanego terminu`, a nie datę `updatedAt` jako termin.
7. Sprawdź `Blokery i ryzyko`: na górze mają być najpoważniejsze ryzyka, nie pierwsze sprawy z listy.
8. Sprawdź kolory:
   - amber = oczekiwanie/uwaga,
   - red = realna blokada/ryzyko,
   - green = gotowe/zamknięte,
   - blue = neutralne/otwarte.
9. Hard refresh i zmiana filtra nie mogą zmienić liczników losowo.
10. Mobile: wiersz sprawy nie może ucinać tytułu, klienta, postępu i akcji w sposób uniemożliwiający obsługę.

Warunek zamknięcia:

- każdy kafelek liczy to, co mówi,
- każdy klik pokazuje tę samą kolekcję co licznik,
- badge ryzyka nie kłamią względem realnego najbliższego terminu,
- `Sprawy bez ruchu` ma osobną definicję, nie kopię `Czeka na klienta`,
- `Portal klienta` liczy portal, nie leadId,
- `Blokery i ryzyko` jest posortowane po ryzyku,
- brak fałszywych `Braki 0` z pustego source,
- kolorystyka pozostaje w globalnym systemie,
- guardy, testy, build i `git diff --check` są zielone,
- `_project` i Obsidian payload są zaktualizowane.

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
