# CloseFlow Alert Severity Contract - Stage 9 - 2026-05-08

## Cel

Stage 9 tworzy jedno zrodlo prawdy dla alertow systemowych, bledow, ostrzezen i severity surfaces.

## Jedno zrodlo prawdy

- `src/styles/closeflow-alert-severity.css`

## Kontrakt klas

- `cf-alert`
- `cf-alert-error`
- `cf-alert-warning`
- `cf-alert-info`
- `cf-alert-success`
- `cf-severity-pill`
- `cf-severity-dot`
- `cf-severity-panel`

## Tokeny

- `--cf-alert-error-text`
- `--cf-alert-error-bg`
- `--cf-alert-error-border`
- `--cf-alert-warning-text`
- `--cf-alert-warning-bg`
- `--cf-alert-warning-border`
- `--cf-alert-info-text`
- `--cf-alert-info-bg`
- `--cf-alert-info-border`
- `--cf-alert-success-text`
- `--cf-alert-success-bg`
- `--cf-alert-success-border`
- `--cf-alert-muted-text`

## Co przepieto

- `src/components/AppChunkErrorBoundary.tsx` - realny blad renderowania widoku uzywa teraz `cf-alert cf-alert-error`.
- `src/pages/Dashboard.tsx` - kafelek `Blokuja` uzywa teraz `cf-severity-panel`, `cf-severity-dot` i `cf-severity-text-error`.

## Czego nie ruszano

- logika danych
- API
- Supabase
- auth
- billing
- AI
- routing
- zachowanie klikniec
- delete/trash/destructive actions
- list row status/progress
- metric tiles
- form footer
- page header
- right-card
- card readability

## Swiadome wyjatki po Stage 9

Zostaja jako osobne passy:

- `NotificationsCenter` - miesza severity z centrum powiadomien i metrykami, wymaga osobnego passu.
- `Calendar` - overdue/status kalendarza wymaga osobnego passu, zeby nie popsuc status list.
- `Activity` - czesc klas oznacza raportowe statusy, nie realne alerty.
- `Today` i `TodayStable` - risk/overdue sa czescia decision engine, nie zwyklego alert surface.
- `Leads` i `TasksStable` - status/progress zostaja pod osobny kontrakt statusow.

## Guard

- `scripts/check-closeflow-alert-severity-contract.cjs`
- `npm run check:closeflow-alert-severity-contract`

## Jak zmienic kolory globalnie

Kolor bledow:

- `--cf-alert-error-text`
- `--cf-alert-error-bg`
- `--cf-alert-error-border`

Kolor ostrzezen:

- `--cf-alert-warning-text`
- `--cf-alert-warning-bg`
- `--cf-alert-warning-border`

## Etap 10

Rekomendowany nastepny etap: `NotificationsCenter severity pass` albo `Calendar/Today risk severity pass`, ale nie oba naraz.
