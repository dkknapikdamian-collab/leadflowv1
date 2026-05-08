# CLOSEFLOW_STAGE16A_V10_BOM_MOJIBAKE_REPAIR

## Cel

Naprawa po Stage16A V9: build nie może przechodzić do commita po błędzie, a pliki tekstowe nie mogą mieć UTF-8 BOM ani mojibake.

## Naprawione

- Usunięto BOM z `package.json`.
- Naprawiono polskie znaki w `src/pages/TasksStable.tsx`.
- Dodano guard `check:stage16a-v10-no-bom-mojibake`.
- W skrypcie aplikującym V10 każdy command jest sprawdzany przez exit code, więc czerwony `npm run build` zatrzymuje commit i push.

## Kryterium

`npm run build` musi przejść przed commitem i pushem. Brak wyjątków.
