# STAGE232E_FUNNEL_OWNER_DECISION_SOURCE_OF_TRUTH - audit / run decision

Data: 2026-06-15 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: DOCS_PREPARED / DO_WDROZENIA
Tryb: audit-first / source-of-truth / no runtime changes in this package

## Scan proof

Przeczytane pliki repo:

- `src/App.tsx`
- `src/pages/SalesFunnel.tsx`
- `src/lib/owner-control/sales-funnel-movement.ts`
- `src/styles/sales-funnel-stage231d0f-visual-alignment.css`
- `src/styles/closeflow-metric-tiles.css`
- `src/styles/closeflow-record-list-source-truth.css`
- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`
- `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md`

Lokalnego Obsidiana nie aktualizowano bezpośrednio z tego pakietu. Payload do synchronizacji jest w `_project/obsidian_updates/`.

## Fakty z kodu

- `/funnel` routuje do `src/pages/SalesFunnel.tsx`.
- `SalesFunnel.tsx` pobiera leady, sprawy, klientów, taski, wydarzenia i płatności.
- Widok buduje `buildSalesFunnelMovementView()`.
- Karty są dla leadów i spraw.
- Owner filters: `move_now`, `no_next_move`, `silent_7`, `high_risk`, `money`.
- `move_now` używa `needsMovement()`.
- `needsMovement()` oznacza `!hasNextMove || silenceDays >= 7 || highRisk`.
- `no_next_move` oznacza `!hasNextMove`.
- `silent_7` oznacza `silenceDays >= 7`.
- `money` oznacza `valueAmount > 0`.
- `Pieniądze` pokazuje sumę `valueAmount` dla kart z `valueAmount > 0`.
- `ownerFilter` i `stageFilter` są single-filter: klik owner resetuje stage do `all`, klik stage resetuje owner do `all`.
- `topPriority` to `filteredCards[0]`.
- Sortowanie idzie po risk, braku next move, ciszy i wartości.
- CSS Lejka deklaruje: `Lejek is an owner decision list, not a kanban`.

## Decyzja produktu

Lejek zostaje listą decyzji właściciela, nie kanbanem. Trzeba jednak doprecyzować źródła prawdy dla kafelków, zwłaszcza:

- `Do ruchu teraz`,
- `Bez kroku`,
- `Cisza 7+`,
- `Pieniądze`,
- `Priorytet teraz`.

## Wdrożenie R1

Patrz etap `STAGE232E_FUNNEL_OWNER_DECISION_SOURCE_OF_TRUTH` w `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`.

## Ryzyka

- Zmiana nazwy `Do ruchu teraz` na `Wymaga decyzji` może być lepsza produktowo, ale trzeba sprawdzić, czy nie rozbije wcześniejszych guardów.
- Compound filter owner+stage jest użyteczny, ale nie powinien wejść bez testów UI.
- `Cisza 7+` dla spraw może zawyżać lub zaniżać wynik, jeśli activity truth traktuje płatność jako ruch.
- `Pieniądze` może być niejasne, jeśli miesza wartość leadów i prowizję spraw.
- Lokalny CSS Lejka ma dużo `!important`; nie dokładać kolejnych wyjątków bez potrzeby.

## Guardy do dodania

- `scripts/check-stage232e-funnel-owner-decision-source-truth.cjs`
- `tests/stage232e-funnel-owner-decision-source-truth.test.cjs`

## Test ręczny

Zobacz sekcję etapu w `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`.
