# STAGE220A27B R3 - Payment history one-line rows - 2026-06-04

## Cel

Poprawić modal Historia wpłat i korekt:
- Data i Wartość mają być w jednym wierszu z etykietą wpłaty.
- Usunąć zbędny status "Opłacone", bo sama lista dotyczy wpłat.
- Wymusić jasne tło literalnie, bez zależności od tokenu, który może być nadpisany starym stylem.
- Ukryć notatkę w kompaktowym wierszu, żeby lista była czytelna.

## Zmienione pliki

- src/pages/CaseDetail.tsx
- src/styles/visual-stage13-case-detail-vnext.css
- scripts/check-stage220a27b-r3-payment-history-one-line.cjs
- docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md
- package.json

## Nie ruszano

- SQL
- RLS
- API
- model refund
- logika korekt
- logika liczenia finansów

## Test ręczny

1. Otwórz sprawę z wpłatą.
2. Kliknij Koryguj wpłatę.
3. Wpis ma wyglądać jak jeden wiersz: Wpłata / Data / Wartość / Koryguj.
4. Status Opłacone nie powinien być widoczny.
5. Klik Koryguj otwiera modal korekty.
