# Stage29: kafelek Szkice w Dziś

Data: 2026-04-28

## Cel

Dodać do zakładki Dziś kafelek **Szkice**, który pokazuje szkice AI oczekujące na decyzję operatora.

## Zakres

- kafelek liczy tylko szkice ze statusem `draft`,
- szkice zatwierdzone, zarchiwizowane albo skasowane nie są liczone,
- kafelek pokazuje do trzech ostatnich szkiców jako podgląd,
- kliknięcie kafelka prowadzi do `/ai-drafts`,
- finalne zatwierdzanie nadal odbywa się w Szkicach AI, nie w Dziś.

## Zmienione pliki

- `src/pages/Today.tsx`
- `tests/today-ai-drafts-tile-stage29.test.cjs`
- `scripts/closeflow-release-check-quiet.cjs`
- opcjonalnie `scripts/closeflow-release-check.cjs`, jeśli plik istnieje lokalnie

## SQL

Brak zmian SQL.

## Testy

```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/today-ai-drafts-tile-stage29.test.cjs
```
