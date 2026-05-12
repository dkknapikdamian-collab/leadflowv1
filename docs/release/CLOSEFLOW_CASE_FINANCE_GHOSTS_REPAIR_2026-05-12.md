# CLOSEFLOW_CASE_FINANCE_GHOSTS_REPAIR_2026-05-12

## Cel

Naprawa błędu, w którym pełny panel rozliczeń sprawy potrafił pojawić się jako duch podczas przechodzenia między klientem, leadem i sprawą albo w stanie ładowania rekordu.

## Zmiany

- Dodano \`src/components/finance/CaseSettlementSection.tsx\` jako jedyną bramkę dla pełnego panelu rozliczenia sprawy.
- \`CaseDetail.tsx\` ma używać \`CaseSettlementSection\`, nie bezpośrednio \`CaseSettlementPanel\`.
- Wrapper blokuje render, jeśli:
  - sprawa jeszcze się ładuje,
  - rekord nie ma \`id\`,
  - \`routeCaseId\` nie zgadza się z \`record.id\`.
- Dodano check wykrywający pełne akcje finansowe w \`ClientDetail\` i \`LeadDetail\`.
- Dodano diagnostykę miejsc, gdzie występują teksty i komponenty finansowe.

## Zakres świadomie nietknięty

- Brak zmian bazy danych.
- Brak zmian API płatności.
- Brak zmian globalnego modułu Rozliczenia.
- Brak zmian flow lead -> sprawa.

## Test ręczny

1. Klient -> sprawa -> klient -> inna sprawa.
2. Podczas ładowania sprawy nie może pojawić się karta finansów z zerami.
3. Pełne przyciski \`Dodaj wpłatę\`, \`Dodaj płatność prowizji\`, \`Edytuj prowizję\` mają być tylko na CaseDetail.
4. ClientDetail i LeadDetail mogą pokazywać tylko skróty finansowe albo wartość leada, bez pełnego edytora rozliczeń sprawy.
