# Stage87G - Admin toolbar UTF-8 portal force

Data: 2026-05-05  
Branch: dev-rollout-freeze

## Problem

Stage87F miał dobry kierunek techniczny, ale Windows PowerShell potrafił zepsuć polskie znaki przy wklejaniu source przez here-string. Przez to `check:admin-button-matrix` widział brak akcji QA, bo zamiast `Nie działa / Przenieść / Zły tekst` w pliku mogły zostać krzaki.

## Zmiana

- `AdminDebugToolbar.tsx` jest kopiowany jako osobny plik UTF-8 z paczki
- zachowany jest portal `createPortal(..., document.body)`
- quick editor otwiera się niżej, od `top: 136px`
- quick editor można przeciągnąć za nagłówek
- dodany jest `Reset pozycji`
- guard sprawdza brak mojibake i obecność polskich labeli Button Matrix

## Kryterium zakończenia

- `check:admin-button-matrix` PASS
- `check:admin-toolbar-utf8-portal-force` PASS
- `test:admin-toolbar-utf8-portal-force` PASS
- `verify:admin-tools` PASS
- build PASS
