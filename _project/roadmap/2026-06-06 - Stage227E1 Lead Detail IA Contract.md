# 2026-06-06 15:00 Europe/Warsaw — Stage227E1 Lead Detail IA Contract

Stage: Stage227E1
Status: przygotowane do lokalnego wdrożenia
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Cel

Zamknąć kontrakt informacyjny i wizualny LeadDetail przed przebudową UI.

## Kolejność

1. Stage227E1 — kontrakt IA + Visual Source of Truth.
2. Dopiero po PASS Stage227E1: Stage227E2 — runtime przebudowa LeadDetail według kontraktu.
3. Nie iść do Stage227E2, dopóki guard E1 nie przechodzi lokalnie.

## Zakres E1

- dodać dokument kontraktu,
- dodać guard kontraktu,
- dodać test kontraktu,
- zarejestrować skrypty w `package.json`,
- przygotować wpisy `_project` i update Obsidiana,
- nie ruszać runtime układu LeadDetail.

## Kryterium zamknięcia

- `npm run check:stage227e1-lead-detail-ia-contract` PASS,
- `npm run test:stage227e1-lead-detail-ia-contract` PASS,
- `git diff --check` PASS,
- brak zmian spoza Stage227E1.

## Następny etap po akceptacji

Stage227E2 powinien dopiero zacząć przebudowę LeadDetail na docelowy układ:

- Header,
- Quick Actions,
- Decision Cards,
- Sales Signal,
- Work Action Center,
- Notes,
- Source/History.

Stage227E2 ma użyć wspólnych klas/komponentów akcji z CaseDetail i nie tworzyć osobnego systemu wizualnego leada.
