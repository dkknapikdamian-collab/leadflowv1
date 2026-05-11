# CLOSEFLOW LEAD DETAIL POLISH COPY 2026-05-11

Status: LEAD-COPY-1 repair6.

Cel:
- wyczyscic widoczne bledy polskich znakow w src/pages/LeadDetail.tsx,
- blokowac klasyczne oraz konsolowe sekwencje mojibake w karcie leada,
- raportowac wieksza paczke miejsc, domyslnie do 200 trafien.

Guard:
- npm run check:closeflow-lead-detail-polish-copy
- sprawdza tylko src/pages/LeadDetail.tsx,
- detekcja jest oparta na kodach Unicode, nie na literalnych popsutych znakach w plikach narzedziowych.

Zakres:
- karta leada,
- komunikaty i etykiety w LeadDetail,
- statusy, zrodlo, platnosci, aktywnosci, service handoff.

Poza zakresem:
- globalne stare skrypty naprawcze,
- ETAP9,
- migracje danych.
