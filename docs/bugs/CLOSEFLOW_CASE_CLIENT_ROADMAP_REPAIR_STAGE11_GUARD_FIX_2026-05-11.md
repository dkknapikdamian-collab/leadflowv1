# CloseFlow — Stage 11 guard repair2 — 2026-05-11

## Cel

Domknąć dwa problemy wykryte po wdrożeniu ETAPU 11:

1. agregujący guard pakietu nie przechodził, bo brakowało pliku:
   - `scripts/check-closeflow-client-case-delete-confirm.cjs`

2. `verify:closeflow:quiet` odpadał na teście:
   - `tests/calendar-entry-relation-links.test.cjs`

## Naprawa

- Dodano brakujący guard:
  - `scripts/check-closeflow-client-case-delete-confirm.cjs`
- Dodano wpis w `package.json`:
  - `check:closeflow-client-case-delete-confirm`
- Rozdzielono import w `src/pages/Calendar.tsx`, żeby stary test rozpoznawał standalone import:
  - `import { Link } from 'react-router-dom';`
  - `import { useSearchParams } from 'react-router-dom';`

## Guardy po naprawie

```powershell
npm.cmd run check:closeflow-case-client-roadmap-repair
npm.cmd run build
npm.cmd run verify:closeflow:quiet
```

## Kryterium zakończenia

- agregujący guard ETAPU 11 przechodzi,
- build przechodzi,
- quiet verify przechodzi,
- zmiana nie rusza logiki UI ani danych.
