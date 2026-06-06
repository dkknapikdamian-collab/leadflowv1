# STAGE220A36-R11 — Commission Modal Compact Tooltips + Alignment — REPORT

Data: 2026-06-06 09:10 Europe/Warsaw

## WERDYKT
R11 jest polish UX po R10. Nie zmienia modelu danych ani backendu.

## ZAKRES
- src/pages/CaseDetail.tsx
- src/styles/closeflow-case-finance-modal-stage220a30.css
- guardy A31/R7/R10/R11
- testy R7/R10/R11

## AUDYT RYZYK
- Tooltip native title jest lekki i bezpieczny, ale mniej wygodny na mobile.
- Mniejsze pola mogą wymagać dalszej korekty szerokości po teście na laptopie.
- /api/case-items 500 pozostaje osobnym wątkiem, jeśli nadal występuje.
