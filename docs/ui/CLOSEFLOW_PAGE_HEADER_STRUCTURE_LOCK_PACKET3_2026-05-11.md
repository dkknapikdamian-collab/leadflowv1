# CloseFlow — Page Header Structure Lock Packet 3

## Cel

Naprawić ostatni widoczny problem:
- tekst w headerach dalej potrafi iść w prawo albo do środka,
- kicker typu `CENTRUM DNIA`, `ZADANIA`, `AKTYWNOŚĆ` ma być zawsze dokładnie nad tytułem,
- kolor kickera ma być jeden dla wszystkich,
- układ ma być jak w `Dziś`.

## Diagnoza

Problem nie jest już tylko w kolorach. Problem jest w strukturze:

### Activity
`Activity.tsx` miało header:

`className="cf-page-header activity-page-header"`

A lokalny plik `visual-stage8-activity-vnext.css` nadal styluje `.activity-page-header`, `h1`, `p`, `.activity-kicker`.
To jest aktywne stare źródło layoutu.

### Templates
`Templates.tsx` miało `data-cf-page-header-part="copy"` na zewnętrznym wrapperze, który zawierał i copy, i actions. Czyli source truth nie wiedział, gdzie kończy się tekst, a gdzie zaczynają przyciski.

## Co robi pakiet

1. Dodaje nowy plik:
   `src/styles/closeflow-page-header-structure-lock.css`

2. Ten plik jest finalnym źródłem prawdy dla:
   - położenia copy,
   - położenia kickera,
   - tytułu,
   - opisu,
   - działań po prawej.

3. Usuwa konflikt z Activity:
   - z top headera usuwa lokalną klasę `activity-page-header`,
   - zostaje `className="cf-page-header"`.

4. Naprawia Templates:
   - zewnętrzny row staje się tylko layoutem `cf-page-header-row`,
   - prawdziwa kolumna tekstowa dostaje `data-cf-page-header-part="copy"`,
   - badge/kicker dostaje `data-cf-page-header-part="kicker"`.

5. Importuje structure lock w każdym ekranie jako ostatni CSS import.

6. Dopina structure lock na końcu `emergency-hotfixes.css`.

## Czego nie rusza

- API
- modali
- list
- metryk
- zapisu
- routingu
- treści poza headerem

## Ręczny test po wdrożeniu

1. `/activity`
   - `AKTYWNOŚĆ` ma być nad `Aktywność`, po lewej.
2. `/tasks`
   - `ZADANIA` ma być nad `Lista zadań`, po lewej.
3. `/templates`
   - `SZABLONY SPRAW` ma być nad tytułem, po lewej.
4. `/today`
   - zostaje wzorem, nie może się pogorszyć.
