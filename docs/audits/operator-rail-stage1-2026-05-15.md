# ETAP 1 — Jedno źródło prawdy dla right rail

Data: 2026-05-15
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Co zmieniono

- Dodano wspólną warstwę prezentacyjną w `src/components/operator-rail/`.
- `/clients` używa teraz `SimpleFiltersCard` dla `Filtry proste`.
- `/clients` używa teraz `OperatorSideCard` dla `Leady do spięcia`.
- `/leads` używa teraz `TopValueRecordsCard` dla `Najcenniejsze leady`.
- Zachowano istniejące klasy `right-card`, `quick-list`, `lead-right-card`, `lead-top-relations` i data-markery, żeby nie robić nowego CSS ani nie łamać stage CSS.
- Dodano guard `scripts/check-operator-rail-stage1.cjs` i skrypt npm `check:operator-rail-stage1`.

## Czego nie zmieniono

- Nie zmieniono logiki danych.
- Nie zmieniono limitu `slice(0, 5)`.
- Nie zmieniono sortowania wartości.
- Nie dodano klas typu `right-card-new`, `lead-top-relations-v2`, `clients-top-relations-v2`.
- Nie ruszano `Today`, `LeadDetail`, `ClientDetail`, formularzy ani routingu.

## Test ręczny

1. Wejść na `/clients`.
2. Sprawdzić kafel `Filtry proste`.
3. Kliknąć: `Aktywni`, `Bez sprawy`, `Bez ruchu`, `Kosz`.
4. Sprawdzić kafel `Leady do spięcia` i linki do leadów.
5. Wejść na `/leads`.
6. Sprawdzić kafel `Najcenniejsze leady`.
7. Sprawdzić, czy pokazuje maksymalnie 5 pozycji i linki działają.

## Guardy

```powershell
npm.cmd run check:operator-rail-stage1
npm.cmd run lint
npm.cmd run build
npm.cmd run verify:closeflow:quiet
```
