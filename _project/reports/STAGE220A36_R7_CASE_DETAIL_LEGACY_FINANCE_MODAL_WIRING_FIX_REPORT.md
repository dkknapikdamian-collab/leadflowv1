# STAGE220A36-R7 — CaseDetail Legacy Finance Modal Wiring Fix — REPORT

Data: 2026-06-06 07:55 Europe/Warsaw

## WERDYKT
R7 naprawia wlasciwy komponent: inline FIN-11 modal w src/pages/CaseDetail.tsx.

## AUDYT RYZYK
- Wczesniejsze etapy sprawdzaly CaseFinanceEditorDialog, ale widoczny modal byl w CaseDetail.
- Po deployu sprawdzic bundle w konsoli: hasOldTitle=false, hasNewTitle=true.
- API /case-items 500 wymaga osobnego Response, jesli nadal wystepuje.
