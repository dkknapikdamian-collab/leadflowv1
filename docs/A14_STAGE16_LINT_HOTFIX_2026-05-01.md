# A14 — hotfix lint: przywrócenie importu Stage16

## Cel

Domknąć A14 business type hardening po częściowym wdrożeniu v4, gdy `lint` zatrzymał się na starym guardzie wizualnym wymagającym importu Stage16 w `src/index.css`.

## Zakres

- Przywrócono import `./styles/visual-stage16-today-html-reset.css` w `src/index.css`.
- Nie zmieniano logiki biznesowej.
- Nie zmieniano UI poza utrzymaniem istniejącego importu CSS wymaganego przez guard.
- Nie włączano `strict: true`.

## Po wdrożeniu

Po wdrożeniu uruchamiane są:

```powershell
npm.cmd run check:a13-critical-regressions
npm.cmd run check:a14-business-types
npm.cmd run test:critical
npm.cmd run lint
npm.cmd run build
```

## Kryterium zakończenia

Guardy A13/A14, testy krytyczne, lint i build przechodzą bez błędów.
