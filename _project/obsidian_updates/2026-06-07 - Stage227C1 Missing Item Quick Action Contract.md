# Stage227C1 — Missing Item Quick Action Contract

Data: 2026-06-07 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Typ wpisu: future/runtime contract + guard

## Decyzja

Brak ma być szybką akcją w LeadDetail / ClientDetail / CaseDetail, ale Stage227C1 nie buduje jeszcze pełnego UI.

## Zakres C1

- kontrakt `Brak`,
- routing persystencji:
  - Lead/Client -> task/activity missing_item albo blocker,
  - Case -> case_items,
- guard i test zakresu,
- bez SQL,
- bez nowej tabeli.

## Dlaczego tak

To minimalizuje ryzyko i nie tworzy ciężkiego systemu checklist przed walidacją użycia.

## Następny krok

Stage227C2 — mały modal runtime dla Brak, tylko po zielonym C1.
