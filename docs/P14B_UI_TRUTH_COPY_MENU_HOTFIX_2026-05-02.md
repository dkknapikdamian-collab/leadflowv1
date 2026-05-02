# P14B — hotfix UI truth, copy i menu admin

## Cel
Domknąć pakiet P14 po błędzie wzorca w `Billing.tsx`.

## Zmieniono
- `Admin AI` w menu jest warunkowe po `isAdmin`.
- Login nie może wrócić do komunikatu `14 dni`.
- Billing nie udaje gotowości integracji:
  - Stripe: `Wymaga konfiguracji`,
  - Google Calendar: `W przygotowaniu`,
  - AI: `Beta` / `Wymaga konfiguracji`.
- Poprawiono copy bez polskich znaków w sprawdzanych plikach.
- Admin AI nie pokazuje pustego `-` jako stanu providera.

## Guard
Dodano `scripts/check-p14-ui-truth-copy-menu.cjs` oraz npm script:

```bash
npm run check:p14-ui-truth-copy-menu
```

## Kryterium zakończenia
- zwykły user nie widzi `Admin AI`,
- login mówi 21 dni,
- billing i AI pokazują prawdziwe stany konfiguracji,
- nie ma `Uzupelnij` ani `obsluga` w sprawdzanych plikach UI/API,
- build przechodzi.