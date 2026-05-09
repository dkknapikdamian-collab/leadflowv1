# CloseFlow VS-3 — CSS import order cleanup — 2026-05-09

## Status

SHIPPED BY PACKAGE WHEN CHECK PASSES.

## Cel

`src/index.css` ma przestać być śmietnikiem importów, hotfixów i inline napraw. Ten etap nie usuwa istniejących CSS-ów. On porządkuje wejście do kaskady, żeby następne etapy mogły bezpiecznie migrować style bez grzebania w dużych legacy stronach.

## Zakres

Dodano:

- `src/styles/legacy/legacy-imports.css`
- `src/styles/temporary/temporary-overrides.css`
- `src/styles/emergency/emergency-hotfixes.css`
- `docs/ui/CLOSEFLOW_CSS_IMPORT_ORDER_2026-05-09.md`
- `scripts/check-closeflow-css-import-order.cjs`

Zmieniono:

- `src/index.css`
- `package.json`

## Docelowa kolejność importów

1. `tailwind/base`
2. `design-system/index.css`
3. layout primitives
4. component contracts
5. page adapters
6. legacy imports
7. temporary overrides
8. emergency hotfixes

## Decyzje

### 1. Nie usuwamy istniejących CSS-ów

Ten etap nie jest refaktorem wizualnym. Nie zmieniamy selektorów w plikach stage, hotfix ani eliteflow. Przenosimy tylko importy do czytelnej struktury.

### 2. Hotfixy są jawnie opisane

Każdy hotfix w `src/styles/emergency/emergency-hotfixes.css` musi mieć:

- `owner`
- `reason`
- `scope`
- `remove_after_stage`

Bez tego check ma paść.

### 3. Legacy i temporary to dług techniczny, nie nowy standard

Nowe style nie powinny trafiać do:

- `legacy/legacy-imports.css`
- `temporary/temporary-overrides.css`
- `emergency/emergency-hotfixes.css`

bez świadomej decyzji i opisu usunięcia.

## Nie zmieniono

- stron `Leads.tsx`, `Clients.tsx`, `Cases.tsx`
- ikon
- routing
- logiki biznesowej
- tokenów semantycznych VS-2D
- klas Tailwind w widokach

## Kryterium zakończenia

Etap jest zakończony, jeśli przechodzą:

```bash
npm run check:closeflow-css-import-order
npm run build
```

## Następny sensowny etap

VS-3A — CSS debt map: policzyć importy legacy/temporary/emergency i stopniowo usuwać po jednym bezpiecznym pliku na etap.
