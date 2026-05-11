# CloseFlow — Page Header V2 Surgery

## Cel

Naprawić realny problem zamiast dokładać kolejne locki CSS.

Problem:
- `Tasks`,
- `Templates`,
- `Activity`,
- `Clients`

nadal łapały stare klasy i stare adaptery, przez co tekst headera przesuwał się do środka/prawej.

## Decyzja

Te 4 ekrany odpinamy od starego systemu headerów.

Nie używają już dla top headera:
- `data-cf-page-header="true"`,
- `cf-page-header`,
- `page-head`,
- `cf-page-header-row`,
- `cf-page-hero-layout`,
- `activity-page-header`.

## Nowe źródło prawdy

### Komponent

`src/components/CloseFlowPageHeaderV2.tsx`

Renderuje:

- `cf-page-header-v2`
- `cf-page-header-v2__copy`
- `cf-page-header-v2__kicker`
- `cf-page-header-v2__title`
- `cf-page-header-v2__description`
- `cf-page-header-v2__actions`

### Styl

`src/styles/closeflow-page-header-v2.css`

Ustala:
- copy zawsze po lewej,
- kicker zawsze bezpośrednio nad title,
- title pod kickerem,
- description pod title,
- actions po prawej,
- AI fiolet,
- neutralne akcje niebieskie,
- danger/trash czerwone.

## Zakres zmiany

Zmienia tylko top headery w:

- `src/pages/TasksStable.tsx`
- `src/pages/Templates.tsx`
- `src/pages/Activity.tsx`
- `src/pages/Clients.tsx`

Nie zmienia:
- logiki,
- modali,
- API,
- list,
- metryk,
- zapisów,
- routingu.

## Kryterium

Po wdrożeniu:

- `/tasks` — `ZADANIA`, `Lista zadań`, opis po lewej.
- `/templates` — `SZABLONY SPRAW`, tytuł, opis po lewej.
- `/activity` — `AKTYWNOŚĆ`, `Aktywność`, opis po lewej.
- `/clients` — `BAZA RELACJI`, `Klienci`, opis po lewej.
- przyciski w tych headerach dalej działają.
