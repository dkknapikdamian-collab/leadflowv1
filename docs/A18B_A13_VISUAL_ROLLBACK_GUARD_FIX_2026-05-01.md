# A18B — poprawka guarda A13 po rollbacku wizualnym

## Cel

Domknąć A18 po tym, jak rollback usunął globalny import `stage36-unified-light-pages.css`, ale A13 dalej wymagał tego importu.

## Przyczyna

`stage36-unified-light-pages.css` był dodany jako awaryjny lock dla zakładek Szablony/Szkice AI, ale po aktywacji globalnej skórki rozwalał szerzej wygląd aplikacji. A18 słusznie usunął import z `src/index.css`, jednak A13 nadal traktował obecność importu jako wymaganie.

## Zmiana

- A13 nie wymaga już importu `stage36-unified-light-pages.css`.
- A13 pilnuje teraz, żeby ten plik nie był importowany globalnie.
- Sam plik CSS może zostać w repo jako referencja, ale nie może być aktywną globalną warstwą.

## Walidacja

Skrypt uruchamia:

```powershell
npm.cmd run check:a13-critical-regressions
npm.cmd run check:a14-business-types
npm.cmd run test:critical
npm.cmd run build
```
