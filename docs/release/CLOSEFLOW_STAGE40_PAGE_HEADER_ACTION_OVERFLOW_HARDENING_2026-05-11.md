# CLOSEFLOW_STAGE40_PAGE_HEADER_ACTION_OVERFLOW_HARDENING_2026-05-11

## Cel

Utwardzić nagłówki stron po Stage39, żeby akcje w nagłówku nie robiły wizualnej kaszy przy dłuższych polskich etykietach, wielu przyciskach i małych ekranach.

## Zakres

Dodane / zmienione:

- `src/styles/stage40-page-header-action-overflow-hardening.css`
- `src/styles/page-adapters/page-adapters.css`
- `scripts/check-stage40-page-header-action-overflow-hardening.cjs`
- `package.json`
- `docs/release/CLOSEFLOW_STAGE40_PAGE_HEADER_ACTION_OVERFLOW_HARDENING_2026-05-11.md`

## Decyzja produktowa

Nagłówek CloseFlow ma być narzędziowy, nie reklamowy. Użytkownik ma od razu widzieć ekran pracy i akcje, bez efektu landing page i bez rozpychania widoku.

## Zasady

- CSS-only.
- No business logic.
- Nie ruszać danych.
- Nie zmieniać metric tiles.
- Nie dodawać nowego komponentu UI zamiast istniejących stron.

## Check

```powershell
node scripts/check-stage39-page-headers-copy-visual-system.cjs
node scripts/check-stage40-page-header-action-overflow-hardening.cjs
```
