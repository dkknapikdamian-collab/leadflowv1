# CloseFlow VS-7 Repair 1 — Client relation command copy

## Cel

Naprawić czerwony release gate po wdrożeniu VS-7 bez ruszania logiki kolorów.

## Problem

`npm run verify:closeflow:quiet` zatrzymał się na teście:

```text
tests/client-relation-command-center.test.cjs
ClientDetail exposes relation command center actions
assert.ok(file.includes('Otwórz sprawę'))
```

## Decyzja

Nie zmieniamy VS-7. To osobny, mały repair kontraktu copy w `ClientDetail.tsx`.

## Zakres zmiany

- `src/pages/ClientDetail.tsx`
- przywrócenie literalnego copy `Otwórz sprawę` dla relation command center
- marker: `CLOSEFLOW_VS7_REPAIR1_CLIENT_RELATION_COMMAND_COPY`

## Nie zmieniać

- semantycznych kolorów VS-7
- komponentów kafelków
- API
- routingu
- modeli danych
- flow lead → klient → sprawa

## Weryfikacja

Wymagane komendy po patchu:

```bash
node --test tests/client-relation-command-center.test.cjs
npm run check:vs7-semantic-metric-tones
npm run verify:closeflow:quiet
npm run build
```

## Kryterium zakończenia

- `tests/client-relation-command-center.test.cjs` przechodzi
- `verify:closeflow:quiet` przechodzi
- build produkcyjny przechodzi
- branch `dev-rollout-freeze` dostaje osobny commit repair
