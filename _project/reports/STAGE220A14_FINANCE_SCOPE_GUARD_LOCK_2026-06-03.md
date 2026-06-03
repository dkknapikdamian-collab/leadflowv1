# STAGE220A14 - Finance scope guard lock - 2026-06-03

## Cel

Zablokować regresję po Stage220A13.

## Pilnowane zasady

- Finanse klienta sumują wszystkie sprawy klienta.
- Finanse sprawy dotyczą tylko jednej sprawy.
- Oba panele korzystają ze wspólnego wzorca wizualnego cf-finance-scope-card.
- Stary kafel klienta liczony bezpośrednio z payments.reduce nie może wrócić.
- Stary panel Rozliczenie sprawy w CaseDetail nie może wrócić.
- Guard Stage220A13 i Stage220A14 są wpięte w prebuild.

## Zmienione pliki

- package.json
- scripts/check-stage220a14-finance-scope-guard-lock.cjs
- _project/reports/STAGE220A14_FINANCE_SCOPE_GUARD_LOCK_2026-06-03.md

## Nie ruszano

- Supabase
- SQL
- RLS
- API
- routing
- logika tworzenia płatności

## Testy

- node scripts/check-stage220a13-finance-scope-source-truth.cjs
- node scripts/check-stage220a14-finance-scope-guard-lock.cjs
- npm run build


## R3

Guard R2 zatrzymał etap, bo w ClientDetail nadal istniał stary tekst:
`<small>Podsumowanie finansów</small>`.

R3 podmienia ten tekst na:
`<small>Finanse klienta</small>`.

Cel: utrzymać rozdział języka:
- finanse klienta = suma spraw klienta,
- finanse sprawy = pojedyncza sprawa.
