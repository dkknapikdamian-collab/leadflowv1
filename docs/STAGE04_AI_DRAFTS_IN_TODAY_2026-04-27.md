# Stage 04 — Szkice AI widoczne w Dziś

## Cel

Dodać do zakładki `Dziś` widoczną informację o szkicach AI czekających na sprawdzenie.

## Zakres

- kafelek `Szkice AI` w górnym skrócie `Dziś`,
- licznik szkiców w statusie `draft`,
- lista 3 najnowszych szkiców,
- przycisk `Przejrzyj` prowadzący do `/ai-drafts`,
- brak finalnego zapisu z poziomu `Dziś`.

## Zasada bezpieczeństwa

`Dziś` tylko pokazuje i kieruje do `Szkice AI`. Finalny rekord powstaje dopiero w etapie zatwierdzania szkicu.

## Test

```powershell
node tests/today-ai-drafts-stage04.test.cjs
```
