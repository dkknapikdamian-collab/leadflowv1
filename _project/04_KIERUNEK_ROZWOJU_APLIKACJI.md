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
