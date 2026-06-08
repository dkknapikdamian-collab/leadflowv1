# STAGE228F R2 - runtime copy cleanup

Data: 2026-06-07 18:55 Europe/Warsaw

## FAKTY
- R1 ZIP zatrzymał się na parserze PowerShell przez regex z polskimi znakami.
- R2 przenosi patchowanie do Node.js i zostawia PowerShell jako prosty runner.
- `/clients`: usunięto dopiski:
  - `Bez przesady, tylko najpotrzebniejsze.`
  - `5 klientów z największą prowizją należną.`
- `/leads`: usunięto tylko górny kafelek `Historia`.
- Prawy filtr `Historia` w `/leads` zostaje.

## TESTY
- `node scripts/check-stage228f-runtime-copy-cleanup.cjs`
- `npm run build`
- `git diff --check`

## AUDYT RYZYK
- R1 ujawnił klasę błędu: PowerShell + regex + polskie znaki w paczkach ZIP.
- R2 ogranicza PowerShell do uruchamiania Node patchera.
- Główne ryzyko regresji: zbyt szerokie usunięcie Historii. Guard pilnuje, że filtr Historia w prawym railu leadów zostaje.
- Brak zmian w backendzie, SQL, CSS, routingu i liczeniu prowizji/wartości.

## NASTĘPNY KROK
- Test ręczny `/clients` i `/leads` lokalnie.
- Po akceptacji selektywny commit/push bez `git add .`.
