# Stage227F2R1 — Client/Case Header Stretch + Lead Copy Fix

Data: 2026-06-07 Europe/Warsaw
Tryb: local-only do weryfikacji, potem selektywny push.

## Cel

- Naprawić widoczne ucięcie Telefon/Kopiuj w LeadDetail.
- Rozciągnąć Kartotekę klienta i Kartotekę sprawy tak, aby trzymały wspólną szerokość detail shell.
- Zablokować boczne fosy/auto-centering dla ClientDetail i CaseDetail.

## Zakres

- CSS LeadDetail dla wierszy z przyciskiem Kopiuj.
- CSS ClientDetail dla header/shell.
- CSS CaseDetail dla header/top-grid/shell.
- Wspólny kontrakt w closeflow-unified-page-canvas-stage211c.css.

## Czego nie ruszano

- SQL.
- Supabase.
- Logika danych.
- Akcje, notatki, finanse i kalendarz.

## Testy

- check/test Stage227F2R1.
- regresja Stage227F2.
- regresja Stage227F1.
- regresja Stage227E0.
- npm run build.
- git diff --check.
