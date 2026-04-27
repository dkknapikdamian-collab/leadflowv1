# CloseFlow — plan uproszczenia widoku sprawy

Data: 2026-04-27
Repo: `dkknapikdamian-collab/leadflowv1`
Gałąź: `dev-rollout-freeze`
Zakres: widok `CaseDetail` / obsługa sprawy

## Cel

Zakładka sprawy ma być zrozumiała w 5 sekund. Po wejściu użytkownik ma od razu widzieć:

1. co blokuje sprawę,
2. jaka jest najbliższa akcja,
3. jaki jest postęp,
4. jakie są najważniejsze szybkie akcje.

Nie budujemy drugiego CRM-a. Sprawa ma być miejscem pracy operacyjnej po pozyskaniu tematu.

## Zasada kolorystyki

Nie przenosimy kolorystyki z makiety HTML 1:1.

Nowy wygląd ma używać aktualnych tokenów aplikacji:

- `--app-bg`,
- `--app-surface`,
- `--app-surface-strong`,
- `--app-surface-muted`,
- `--app-border`,
- `--app-text`,
- `--app-muted`,
- `--color-primary`,
- `--color-primary-foreground`.

Dzięki temu widok sprawy działa w skórkach:

- `forteca-light`,
- `forteca-dark`,
- `midnight`,
- `sandstone`.

## Docelowy układ widoku sprawy

### 1. Nagłówek

Pokazuje tylko:

- nazwę sprawy,
- status operacyjny,
- klienta,
- źródło z leada,
- datę utworzenia,
- podstawowe akcje: wróć, portal, dodaj akcję.

Nie upychać w nagłówku pełnej historii, checklist, notatek ani listy zadań.

### 2. Centrum decyzji na górze

Trzy główne kafle:

#### Co teraz blokuje?

Pokazuje jeden najważniejszy problem:

- brak materiału,
- brak decyzji,
- brak akceptacji,
- element odrzucony,
- sprawa stoi bez dalszego ruchu.

#### Najbliższa akcja

Pokazuje najbliższy element z:

- zadań,
- wydarzeń,
- terminowych działań powiązanych ze sprawą.

To nie jest ręczne pole tekstowe. To podgląd z realnych rekordów.

#### Postęp sprawy

Pokazuje:

- procent kompletności,
- liczbę braków,
- liczbę oczekujących akceptacji,
- liczbę otwartych akcji.

### 3. Główna sekcja `Obsługa`

Domyślna zakładka ma pokazywać:

- najważniejsze działania,
- najbliższe zadania,
- najbliższe wydarzenia,
- status operacyjny,
- prosty komunikat, czy czekamy na klienta, czy sprawa jest po naszej stronie.

### 4. Sekcja `Materiały`

Checklisty i braki mają być pokazane jako prosta lista:

- gotowe,
- czeka,
- bloker.

Nie robić ciężkiej tabeli z dużą liczbą kolumn.

### 5. Sekcja `Historia`

Historia ma być pomocnicza. Nie jest centrum pracy.

Pokazuje:

- utworzenie sprawy,
- notatki,
- zmiany statusów,
- utworzone zadania,
- utworzone wydarzenia,
- akcje klienta z portalu.

### 6. Prawy panel

Prawy panel ma zawierać:

- szybkie akcje,
- skrót klienta,
- krótką ostatnią notatkę.

Klient jest kontekstem, nie głównym ekranem pracy.

## Szybkie akcje

W widoku sprawy powinny być proste akcje:

- dodaj zadanie,
- dodaj wydarzenie,
- dodaj notatkę,
- poproś klienta o brak,
- oznacz jako gotowe,
- otwórz portal klienta.

Nazwy mają mówić dokładnie, co się stanie. Nie używać ogólnych tekstów typu `Akcja`, `Zarządzaj`, `Proces`.

## Czego nie zmieniać w tym etapie

Nie zmieniać:

- modelu danych,
- API,
- routingu,
- obecnych statusów bez konieczności,
- działania zadań,
- działania wydarzeń,
- działania portalu klienta.

Ten etap jest wizualno-UX-owy i ma uporządkować istniejące funkcje.

## Etapy wdrożenia

### Etap 1 — dopasowanie kolorystyki do aplikacji

Cel: usunąć beżowy mockup look i oprzeć widok na tokenach skórek.

Pliki:

- `src/index.css`,
- `src/styles/case-detail-simplified.css`,
- `src/styles/case-detail-stage2.css`,
- `src/styles/visual-stage3-pipeline-and-case.css`.

Kryterium: widok sprawy wygląda spójnie w obecnej aplikacji i nie odstaje kolorystycznie.

### Etap 2 — przebudowa górnego centrum decyzji

Cel: zrobić układ 3 kafli: blokada, najbliższa akcja, postęp.

Pliki:

- `src/pages/CaseDetail.tsx`,
- `src/lib/case-lifecycle-v1.ts`.

Kryterium: po wejściu w sprawę widać w 5 sekund, co jest najważniejsze.

### Etap 3 — uproszczenie głównej sekcji obsługi

Cel: połączyć zadania i wydarzenia w jeden czytelny blok najbliższych działań.

Pliki:

- `src/pages/CaseDetail.tsx`,
- helpery task/event sorting.

Kryterium: użytkownik nie szuka po ekranie, gdzie ma dodać albo otworzyć najbliższą akcję.

### Etap 4 — checklisty i blokery

Cel: pokazać materiały i braki jako listę operacyjną.

Pliki:

- `src/pages/CaseDetail.tsx`,
- helpery kompletności.

Kryterium: każdy element ma status `gotowe`, `czeka` albo `bloker`.

### Etap 5 — mobile polish

Cel: sprawa ma być wygodna na telefonie.

Kryterium: najważniejsze akcje są dostępne bez zoomowania i bez szukania po ekranie.

## Kryterium końcowe całego pakietu

Widok sprawy ma spełniać zasadę:

> 5 sekund i wiem, co blokuje sprawę, co mam zrobić dalej i czy temat może iść do przodu.
