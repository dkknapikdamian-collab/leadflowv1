# CloseFlow — Page Header Copy + Actions Stage 5

## Cel

Dokończyć porządek w głównych kafelkach / top headerach:
- usunąć duplikaty opisów,
- poprawić treści wybranych opisów,
- ustawić wspólny niebieski kolor akcji jak w górnym pasku poleceń,
- ustawić przyciski w prawym rogu obok siebie,
- zapisać układ akcji jako jedno źródło prawdy.

## Zakres

### 1. Źródło prawdy dla tekstów
Plik: `src/lib/page-header-content.ts`

Poprawki treści:
- `responseTemplates`: zostaje tylko jedno źródło tekstu,
- `aiDrafts`: końcówka `w CRM` usunięta,
- `notifications`: skrócony opis bez starego długiego dubla,
- `adminAi`: jeden finalny opis bez dubla.

### 2. Źródło prawdy dla akcji i ich ułożenia
Plik: `src/styles/closeflow-page-header-card-source-truth.css`

Dopisany blok:
`CLOSEFLOW_PAGE_HEADER_COPY_ACTIONS_STAGE5_2026_05_11`

Ustala:
- kolor tekstu i ikon przycisków: ten sam niebieski jak górny pasek poleceń,
- obramowanie i hover,
- układ akcji: prawa strona, obok siebie,
- gap między przyciskami,
- zachowanie mobile.

## Zasady

- Nie ruszać tła kafelka.
- Nie ruszać logiki przycisków.
- Nie ruszać modali i list.
- Nie dodawać runtime ani MutationObserver.

## Kryterium końca etapu

1. W headerach nie ma zdublowanych opisów.
2. `Szkice AI` nie mają końcówki `w CRM`.
3. `Powiadomienia` nie mają starego długiego dubla.
4. `Admin AI` nie ma starego dubla provider/klucze.
5. Przyciski w głównym kafelku są w prawym rogu i w jednym rzędzie na desktopie.
6. Kolor tekstu i ikon akcji jest spójny z niebieskim górnego paska.
