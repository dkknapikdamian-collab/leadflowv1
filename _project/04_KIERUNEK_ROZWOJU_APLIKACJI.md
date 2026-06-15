# 04_KIERUNEK_ROZWOJU_APLIKACJI - CloseFlow / LeadFlow

Data utworzenia: 2026-06-12 23:59 Europe/Warsaw
Ostatnia aktualizacja: 2026-06-15 Europe/Warsaw
Status: ACTIVE / CANONICAL
Typ: centralny kierunek rozwoju aplikacji
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Canonical name: CloseFlow / LeadFlow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Cel pliku

Ten plik odpowiada na pytanie:

```txt
W jakim kierunku rozwijamy aplikację i dlaczego?
```

Ten plik nie jest historią etapów, ledgerem ani listą wszystkich starych poprawek. Ma być krótki, aktualny i decyzyjny.

Powiązane pliki centralne:

- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` - co wdrażamy i w jakiej kolejności,
- `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md` - problemy znalezione przez AI/audyt do decyzji Damiana,
- `_project/07_NEXT_STEPS.md` - stary plik pomocniczy z historią i wieloma blokami; nie powinien być jedynym miejscem prawdy.

## Główna teza produktu

CloseFlow / LeadFlow nie ma być tanią kopią CRM.

Budujemy system właścicielskiej kontroli sprzedaży i obsługi:

```txt
Kto ucieka?
Kto nie ma następnego kroku?
Gdzie jest cisza?
Która sprawa stoi?
Gdzie leżą pieniądze?
Co trzeba ruszyć dzisiaj?
Czego brakuje?
Co realnie blokuje ruch?
```

Sprzedajemy efekt operacyjny, nie listę funkcji CRM.

## Pozycjonowanie

Nie pozycjonować jako:

- tani CRM,
- druga kopia Pipedrive/HubSpot/Firmao,
- rozbudowany ERP,
- narzędzie BI z wykresami dla ozdoby,
- chatbot AI.

Pozycjonować jako:

- prosty system pilnowania leadów, klientów, spraw, zadań, kalendarza, braków, blokad i follow-upów,
- owner control system dla małej firmy usługowej,
- narzędzie, które mówi właścicielowi, co wymaga ruchu,
- furtka do wdrożenia procesu sprzedaży i obsługi.

## Model biznesowy

Kierunek komercyjny:

```txt
SaaS = furtka.
Proces, porządek danych, playbooki, wdrożenie i miesięczny review = realna renta.
```

Najważniejsza oferta wspierająca:

```txt
CloseFlow Control Sprint
```

Zakres Control Sprint:

- readiness audit,
- import/porządkowanie danych,
- ustawienie etapów,
- next-step discipline,
- contact cadence,
- owner digest,
- podstawowy finance watchlist,
- jedno szkolenie.

## Aktywne filary rozwoju

### 1. Owner Control Core

Najważniejszy rdzeń aplikacji.

Funkcje:

- Readiness Audit / Owner Control Baseline,
- Mandatory Next Step Contract,
- Contact Cadence Grid,
- Sales Funnel Movement View,
- Lost Lead Rescue,
- Finance Watchlist,
- Owner Digest / Weekly Report,
- Missing & Blocker Source of Truth.

Cel:

```txt
Właściciel w kilka sekund widzi, co stoi, co ucieka, czego brakuje i co trzeba zrobić teraz.
```

### 2. Braki i blokady jako kontrola ruchu, nie ozdobna historia

To jest aktywny kierunek produktowy od STAGE232A.

Definicje:

```txt
Brak = aktywny element pracy, który czegoś wymaga, ale nie musi zatrzymywać procesu.
Blokada = brak albo problem, który realnie zatrzymuje następny ruch.
Historia = dziennik zdarzeń, nie źródło prawdy dla aktywnych braków.
```

Zasady:

- aplikacja nie zgaduje po tytule, że dokument, spotkanie albo informacja blokuje proces,
- użytkownik lub szablon/checklista musi jawnie oznaczyć, czy dany brak blokuje ruch,
- aktywne braki i blokady muszą pochodzić z work items/tasks/checklist source of truth, nie z historii,
- historia pokazuje, co się wydarzyło, ale nie liczy aktywnych braków,
- top card `Blokada` pokazuje tylko prawdziwe blokady,
- sekcja `Działania leada` / odpowiednik w sprawie ma być jednym centrum pracy, nie trzema kopiami tej samej listy,
- rozwiązany albo usunięty brak nie może wracać po hard refresh.

Minimalny model danych, jeśli nie ma jeszcze migracji SQL:

```txt
type/kind = missing_item
status = open/todo/done/deleted
payload.blocksProgress = true/false
payload.blockScope = lead_next_action/offer/case_start/case_completion/payment/other/none
payload.missingKind = document/information/decision/payment/meeting/other
```

To jest warunek jakości produktu. Bez tego aplikacja udaje kontrolę procesu, ale nie mówi prawdy o tym, co realnie stoi.

### 3. Dokumenty jako blokery ruchu, nie martwe załączniki

Dokumenty mają być rozwijane jako część kontroli procesu:

- dokument wymagany,
- dokument otrzymany,
- dokument do poprawy,
- dokument blokuje sprawę/leada,
- przypomnienie/follow-up po brakujący dokument,
- widoczność w leadzie, kliencie, sprawie, digestach i auditach.

Nie budować na start ciężkiego DMS. Dokumenty mają odpowiadać na pytanie:

```txt
Czego brakuje, przez co temat stoi?
```

### 4. AI Drafts / szybkie szkice confirm-first

AI ma działać wyłącznie w granicach aplikacji.

Dozwolone obszary:

- leady,
- klienci,
- sprawy,
- zadania,
- wydarzenia,
- notatki,
- braki / missing items,
- follow-upy,
- aktywność / historia.

Kontrakt:

1. Najpierw zapis surowego szkicu.
2. AI proponuje akcję.
3. Użytkownik zatwierdza.
4. Dopiero po zatwierdzeniu powstaje finalny rekord.
5. Każda akcja z AI ma audit trail.

AI nie ma być chatbotem ogólnym, nie ma sprawdzać pogody, internetu ani wykonywać akcji poza CloseFlow.

### 5. AI Opportunity Finder / Smart Prospecting

To jest ważny późniejszy kierunek, który nie może zginąć.

Teza:

```txt
Nie: znajdź firmy.
Tak: znajdź firmy z konkretnym problemem i powodem kontaktu.
```

Docelowy moduł:

- użytkownik wybiera branżę, miasto i sygnał problemu,
- system znajduje firmy pasujące do tego sygnału,
- system ocenia potencjał,
- system tworzy konkretny powód kontaktu,
- system zapisuje leady do LeadFlow,
- system ustawia follow-up,
- użytkownik pracuje na tych leadach w tym samym CRM.

Przykładowe sygnały:

- firma bez formularza kontaktowego,
- stara strona,
- brak SSL,
- sklep z ryzykiem regulaminu/EAA,
- restauracja z małą liczbą opinii,
- firma bez strony,
- nieaktualne dane kontaktowe,
- widoczny problem konwersji albo zaufania.

### 6. Zakładka Dziś jako prawdziwe centrum decyzji, nie worek rekordów

To jest aktywny kierunek produktowy od STAGE232B.

Teza:

```txt
Dziś ma mówić właścicielowi, co wymaga ruchu teraz, co jest zaległe, co jest dzisiaj i co jest najbliżej.
Nie może udawać kalendarza, jeśli pokazuje pełny portfel Owner Control.
```

Zasady:

- każdy kafelek w `Dziś` musi mieć jawny selektor danych,
- licznik kafelka musi odpowiadać sekcji, którą kafelek otwiera,
- nazwa kafelka musi opisywać rzeczywiste źródło danych,
- `Co masz zrobić dzisiaj` nie może liczyć pełnego `ownerControlBaseline.items`, jeśli nie ma dopisku, że to pełny portfel rzeczy wymagających ruchu,
- rekomendowana nazwa dla pełnego portfela Owner Control to `Wymaga ruchu` albo `Do obsługi`,
- czyste dzisiejsze terminy mają zostać w `Zadania do wykonania dziś` i `Wydarzenia dziś`,
- zaległe zadania powinny być jawnie opisane jako zaległe albo `do obsługi`,
- `Najbliższe 7 dni` może pokazywać preview, ale musi jasno odróżniać pełny count od listy top 10,
- aktywna trasa `/today` ma dalej używać `TodayStable`, a legacy `Today.tsx` nie jest powierzchnią aktywnego refactoru.

Warunek jakości produktu:

```txt
Użytkownik ma w 5 sekund wiedzieć, czy patrzy na:
- terminy dzisiejsze,
- zaległości,
- brak next stepu,
- ciszę / waiting,
- pełny owner-control backlog,
- szkice do decyzji.
```

### 7. Zakładka Klienci jako relacyjna kontrola ruchu, nie katalog kontaktów

To jest aktywny kierunek produktowy od STAGE232C.

Teza:

```txt
Klienci mają pokazywać stan relacji: kto ma sprawę, kto nie ma sprawy, gdzie jest aktywna prowizja, gdzie nie ma ruchu i jaki jest najbliższy krok.
To nie może być katalog kontaktów z ozdobnymi licznikami.
```

Zasady:

- lista klientów startuje z `clients`, a leady/sprawy/płatności/zadania/wydarzenia są tylko kontekstem relacji,
- `Aktywni` = niearchiwalni klienci, chyba że powstaje osobny kafelek `Z aktywną sprawą`,
- `Bez sprawy` musi mieć realny filtr i pokazywać tylko klientów bez spraw,
- `Bez ruchu` nie może oznaczać `brak leadów`; ma wynikać z activity-truth/contact cadence/braku następnej akcji,
- `Prowizja` musi mieć jedną definicję wspólną dla kafelka, listy i prawego raila,
- jeśli pokazujemy aktywną prowizję, nie mieszamy jej z lifetime earned ani fallbackiem płatności,
- jeżeli pokazujemy wartość relacji, tak ją nazywamy,
- filtry kontaktu klientów muszą widzieć aktywność z klienta, leadów, spraw, zadań, wydarzeń i płatności powiązanych z relacją,
- top kafelki i prawy rail nie mogą być martwymi przyciskami,
- kolorystyka musi iść przez globalny system `StatShortcutCard` / `OperatorMetricTile`, bez lokalnego malowania kafelków.

Warunek jakości produktu:

```txt
Właściciel w 5 sekund ma wiedzieć:
- ilu klientów faktycznie obsługujemy,
- którzy są tylko kontaktami bez spraw,
- gdzie jest pieniądz do zarobienia,
- kto wymaga kontaktu,
- gdzie kliknąć, żeby zobaczyć dokładnie tę listę.
```

### 8. Zakładka Sprawy jako realne centrum obsługi, nie lista statusów

To jest aktywny kierunek produktowy od STAGE232D.

Teza:

```txt
Zakładka Sprawy ma mówić właścicielowi i operatorowi, które sprawy są otwarte, które realnie stoją, które czekają na klienta, które są zablokowane, które mają najbliższy termin i gdzie jest ryzyko.
Nie może mieszać blokady, czekania, braku ruchu, portalu klienta i powiązania z leadem w tych samych licznikach.
```

Zasady:

- `Czeka na klienta` nie może liczyć wszystkich blokad ani akceptacji,
- `Zablokowane` wymaga realnego blokera albo statusu blokującego,
- `Sprawy bez ruchu` musi wynikać z activity-truth/contact/activity silence, nie ze statusu `waiting`,
- `Portal klienta` liczy `portalReady` albo realny stan portalu, nie `leadId`,
- `Bez zaplanowanej akcji` liczy brak otwartego task/event z poprawną datą,
- `Blokery i ryzyko` pokazuje najważniejsze ryzyka, nie pierwsze rekordy aktualnej listy,
- `Braki 0` nie może być renderowane, jeśli lista nie ma źródła checklist/items,
- badge `Brak następnego ruchu` i `Pieniądze bez ruchu` muszą korzystać z tego samego najbliższego ruchu, który widzi użytkownik w wierszu,
- `Najbliższy termin w sprawie` pokazuje termin task/event, nie `updatedAt`,
- kolorystyka zostaje w globalnym systemie: blue/amber/red/green bez lokalnych wyjątków.

Warunek jakości produktu:

```txt
W 5 sekund użytkownik ma wiedzieć:
- które sprawy robi teraz,
- które stoją przez klienta,
- które stoją przez blokadę,
- gdzie nie ma następnego ruchu,
- gdzie jest pieniądz/ryzyko,
- gdzie kliknąć, żeby zobaczyć dokładnie tę listę.
```

### 9. Zakładka Lejek jako lista decyzji właściciela, nie kanban

To jest aktywny kierunek produktowy od STAGE232E.

Teza:

```txt
Lejek ma być listą decyzji właściciela: ruch, cisza, ryzyko i pieniądze.
Nie ma być kanbanem i nie ma udawać CRM-owego boardu, jeśli realna wartość jest w szybkim wskazaniu, gdzie przepada ruch sprzedażowy.
```

Zasady:

- `Do ruchu teraz` musi mieć jawny kontrakt: brak kroku, cisza 7+ albo wysokie ryzyko; jeśli nazwa jest za szeroka, zmienić na `Wymaga decyzji`.
- `Bez kroku` oznacza brak przyszłego/aktywnego następnego ruchu, nie brak dowolnej historycznej aktywności.
- `Cisza 7+` oznacza realne 7+ dni od kontaktu/aktywności kontaktowej, nie sam brak daty.
- `Wysokie ryzyko` musi wynikać z deterministycznego risk modelu, a nie osobnego ręcznego licznika.
- `Pieniądze` może mieszać wartość leadów i prowizję spraw, ale wtedy musi być nazwane jako `Wartość/prowizja`, nie czysta prowizja.
- Etapy są filtrem, nie kolumnami kanbana.
- Klik owner kafelka i klik etapu mogą działać jako single-filter w R1, ale UI nie może sugerować compound filter, jeśli go nie ma.
- `Priorytet teraz` oznacza priorytet w aktywnym filtrze; jeśli ma być globalny, trzeba go osobno nazwać.
- Kolorystyka zostaje w globalnym metric/signal systemie, bez lokalnego nowego systemu.

Warunek jakości produktu:

```txt
W 5 sekund użytkownik ma wiedzieć:
- co wymaga decyzji,
- gdzie nie ma kroku,
- gdzie jest cisza,
- gdzie jest wysokie ryzyko,
- gdzie jest pieniądz,
- który rekord otworzyć jako pierwszy.
```

### 10. Zakładka Zadania jako operacyjna kolejka pracy

To jest aktywny kierunek produktowy od STAGE232F.

Teza:

```txt
Zadania mają być kolejką pracy operatora: zaległe, dzisiejsze, nadchodzące, bez terminu, wysokiego priorytetu i bez powiązania.
Nie mogą być tylko listą tasków z przyciskami.
```

Zasady:

- `Aktywne` = wszystkie niezrobione zadania; UI ma to wyjaśniać.
- `Dziś` = lokalna dzisiejsza data zadania, nie UTC przypadkowo pocięte `slice(0,10)`.
- `Zaległe` = niezrobione zadania z terminem przed dzisiaj.
- `Bez terminu` ma być osobną grupą operacyjną, nie ma znikać bez śladu.
- `Najpilniejsze zadania` może być globalne, ale musi być tak nazwane; jeśli ma zależeć od filtra, trzeba to wdrożyć jawnie.
- `Bez powiązania` ma sprawdzać wszystkie obsługiwane pola relacji, nie tylko trzy najprostsze ID, jeśli baza używa payload/meta.
- `Zrobione` nie powinno na zawsze mieszać `cancelled` i `completed`; R1 może zostawić, ale ryzyko ma zostać zapisane.
- Akcje `Zrobione`, `Edytuj`, `Usuń` muszą być stabilne, bez przypadkowego reloadu/utracenia scrolla i z confirmem dla delete.
- Kolorystyka: red = zaległe/usuń, blue = dziś/aktywne, green = zrobione, amber = wysoki priorytet, neutral = bez powiązania.

Warunek jakości produktu:

```txt
W 5 sekund użytkownik ma wiedzieć:
- co jest spóźnione,
- co trzeba zrobić dzisiaj,
- co jest kolejne,
- co nie ma terminu,
- co nie jest podpięte do żadnej relacji,
- które zadanie ruszyć jako pierwsze.
```

### 11. Zakładka Kalendarz jako źródło prawdy czasu operatora

To jest aktywny kierunek produktowy od STAGE232G.

Teza:

```txt
Kalendarz ma być źródłem prawdy czasu operatora: co jest w danym dniu, co przesuwamy, co kończymy i co usuwamy.
Nie może pokazywać fałszywych sukcesów ani udawać zmiany tygodnia, jeśli zakres danych się nie zmienił.
```

Zasady:

- `Miesiąc` pokazuje preview dnia; `Wybrany dzień` pokazuje pełną listę.
- `+ X więcej` musi odpowiadać pełnej liczbie wpisów minus preview.
- `Tydzień` musi bazować na aktywnym anchor date, nie zawsze na `new Date()`.
- `+1H/+1D/+1W` aktualizuje realny rekord i widoczny stan bez fałszywego sukcesu.
- `Zrobione` działa tylko dla typów, które naprawdę można zakończyć; dla lead/unknown ma być blokada albo prawdziwa obsługa lead next action.
- `Usuń` działa tylko dla event/task; lead nie może być usunięty z kalendarza jako zwykły wpis.
- Relacje lead/case/client nie mogą ginąć przy tworzeniu i edycji wpisów.
- Completed entries mają być widoczne, ale zgaszone/przekreślone.
- Kolorystyka ma zostać w systemie VST/tone: task/event/lead/done/delete bez lokalnych nowych wyjątków.
- DEV seed nie może wpływać na produkcję.

Warunek jakości produktu:

```txt
W 5 sekund użytkownik ma wiedzieć:
- co jest w wybranym dniu,
- co jest tylko preview w miesiącu,
- czy tydzień naprawdę się zmienił,
- czy wpis został realnie przesunięty,
- czy wpis jest zrobiony,
- czy można go bezpiecznie edytować/usunąć.
```

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
Status: WDROZONE_ZIP_DO_SPRAWDZENIA / TEST_RECZNY_DAMIANA
Typ: hotfix UX + dokumentacja kolejki

FAKTY:
- Damian odrzucil dopisek w UI: `To nie jest kalendarz. To lista tematow, ktore wymagaja decyzji/ruchu.`
- Dopisek byl zbyt techniczny i wygladal jak komentarz dla developera, nie jak produktowy interfejs.
- STAGE232B zostaje jako kontrakt zrodla prawdy kafelka `Wymaga ruchu`, ale bez dodatkowego objasnienia pod lista.

ZAKRES:
- usunac dopisek z `src/pages/TodayStable.tsx`,
- zaktualizowac guard/test tak, zeby blokowaly powrot tego copy,
- utrzymac kontrakty STAGE232B: `Wymaga ruchu`, `actionRequiredRows`, `upcomingRowsAll/upcomingRowsPreview`, dynamiczna nazwa zadan,
- dopisac payload Obsidiana w repo.

NIE RUSZAC:
- LeadDetail / STAGE232A,
- CaseDetail,
- Google Calendar,
- SQL,
- finanse,
- globalny layout.

NASTEPNY LOGICZNY ETAP PO R6:
- STAGE232A_LEAD_MISSING_BLOCKER_SOURCE_OF_TRUTH.

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

## STAGE232A_R5_MISSING_ITEM_MODAL_VISUAL_SOURCE_TRUTH

Data: 2026-06-15 23:55 Europe/Warsaw
Status: WDROZONE_ZIP_DO_SPRAWDZENIA / TEST_RECZNY_DAMIANA

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
