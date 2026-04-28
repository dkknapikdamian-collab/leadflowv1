# Stage29d: mały dolny kafelek Szkice w Dziś

Data: 2026-04-28

## Cel

Przerobić widok szkiców AI w zakładce Dziś z dużej sekcji na jeden mały kafelek na dole strony.

## Zakres

- kafelek nadal pokazuje liczbę szkiców oczekujących na zatwierdzenie,
- kliknięcie prowadzi do `/ai-drafts`,
- nie ma dużej listy podglądów w zakładce Dziś,
- istniejące zwijane kafelki i skróty w Dziś zostają bez zmian,
- zatwierdzanie i kasowanie szkiców dalej odbywa się w Szkicach AI.

## SQL

Brak zmian SQL.

## Testy

```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/today-ai-drafts-tile-stage29.test.cjs
node tests/stage29c-today-ai-drafts-compact-tile.test.cjs
```

## Uwaga techniczna

Skrypt odzyskuje repo z bieżącego katalogu, jeśli PowerShell przekaże błędną ścieżkę.
