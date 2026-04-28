# Stage 10 — domknięcie przycisku `Przejrzyj` dla Szkiców AI w Dziś

Data: 2026-04-28

## Cel

Domknąć Stage 04 po zielonych bramkach głównych. `Dziś` ma zawierać widoczne wejście `Przejrzyj` do `/ai-drafts`, żeby szkice AI były tylko do przeglądu z poziomu `Dziś`, a finalny zapis nadal następował wyłącznie w ekranie `Szkice AI`.

## Zakres

- `src/pages/Today.tsx`
- `tests/today-ai-drafts-stage04.test.cjs`

## Nie zmieniaj

- Nie dodawać nowych endpointów API.
- Nie przenosić finalnego zatwierdzania szkiców do `Dziś`.
- Nie usuwać istniejącego szybkiego dodawania leada w `Dziś`.

## Po wdrożeniu sprawdź

```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/today-ai-drafts-stage04.test.cjs
```

## Kryterium zakończenia

- Główne bramki są zielone.
- Test Stage 04 jest zielony.
- W `Dziś` widoczna jest akcja `Przejrzyj` prowadząca do `Szkice AI`.
