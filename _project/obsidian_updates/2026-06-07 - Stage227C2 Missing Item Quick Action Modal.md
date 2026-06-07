# Stage227C2 — Missing Item Quick Action Modal

Data: 2026-06-07 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Typ wpisu: contract + shared modal component

## Decyzja

Akcja Brak ma dostać mały modal z wymaganym tytułem i opcjonalną notatką. Modal nie zapisuje jeszcze bezpośrednio danych. Zapis zostaje osobnym etapem po runtime wiring.

## Zakres

- wspólny modal Brak,
- wymagane pole: Czego brakuje?,
- opcjonalne pole: Notatka,
- bez SQL,
- bez nowej tabeli,
- bez checklist.

## Następny krok

Stage227C3 — runtime hook i zapis zgodny z adapterem C1.
