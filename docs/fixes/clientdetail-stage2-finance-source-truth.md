# ETAP 2 — ClientDetail finance source truth

Data: 2026-05-14
Tryb: lokalna poprawka bez commit/push/deploy.

## Cel

ClientDetail ma czytać finanse klienta z jednego źródła prawdy: `src/lib/finance/case-finance-source.ts`.

## Zakres

- dodanie/wykorzystanie `getClientCasesFinanceSummary`,
- przepięcie lokalnych totalizatorów ClientDetail na `clientFinanceSummary`,
- ochrona przed głównym kaflem 0 PLN, gdy sprawa ma wartość i prowizję procentową,
- guard statyczny dla scenariusza 100 000 PLN × 2% = 2 000 PLN.

## Notatki z patchera

- getClientCasesFinanceSummary już istnieje
- dodano import case-finance-source po importach
- dodano clientFinanceSummary przed lokalnymi totalami (cases, payments)
- podmieniono lokalne totalizatory na clientFinanceSummary
- ujednolicono copy kafli finansowych

## Nie zrobiono

- nie zmieniono API,
- nie zmieniono formularza finansów sprawy,
- nie zrobiono commita,
- nie zrobiono pusha,
- nie zrobiono deployu.
