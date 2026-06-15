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

Granice:

- nie budować generycznej bazy firm,
- nie kopiować Apollo/Clay/Lusha,
- nie robić scrapera bez powodu kontaktu,
- nie robić osobnej aplikacji DealGram.

Status:

```txt
Ważny kierunek growth, ale dopiero po stabilizacji CRM, szkiców, kalendarza i owner-control core.
```

### 6. Digest / Weekly Report jako lista decyzji

Digest nie ma być newsletterem.

Ma pokazywać:

- co dziś ruszyć,
- kto nie ma następnego kroku,
- kto ma 7/14 dni ciszy,
- które sprawy stoją,
- jakie pieniądze wymagają ruchu,
- jakie braki i blokady wymagają decyzji,
- jakie szkice czekają na decyzję.

Weekly report ma mówić, co wydarzyło się w tygodniu i co wymaga reakcji, nie produkować ozdobnego dashboardu.

## Czego nie robić teraz

Nie robić teraz:

- ERP,
- KSeF,
- fakturowania,
- magazynu,
- własnego VoIP,
- ciężkiego BI,
- rozbudowanego automation buildera,
- 10 branż naraz,
- pełnego marketplace'u playbooków,
- pełnego DMS przed uporządkowaniem braków/blokad,
- pełnego AI prospectingu przed stabilnym owner-control core.

## Najbliższy kierunek priorytetowy

Priorytet główny:

```txt
STAGE232A Missing & Blocker Source of Truth dla LeadDetail
```

Dlaczego:

- bez tego `Braki`, `Blokady`, historia i działania leada są niespójne,
- to bezpośrednio odpowiada na pytanie właściciela: co stoi i czego brakuje,
- porządkuje fundament pod późniejsze dokumenty, checklisty, digest i owner-control,
- usuwa ryzyko, że aplikacja wygląda bogato, ale nie daje produkcyjnego zaufania.

Po STAGE232A wrócić do kolejki zapisanej w `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`.

## Warunek zmiany kierunku

Kierunek można zmienić, jeśli:

- test sprzedażowy pokaże, że właściciele nie rozumieją owner-control,
- użytkownicy bardziej płacą za inny, konkretny moduł,
- podstawowy CRM nie jest jeszcze wystarczająco stabilny,
- techniczne ryzyko blokuje wdrożenie owner-control szybciej niż alternatywny etap.

Bez takiego dowodu nie rozpraszać roadmapy na przypadkowe funkcje.
