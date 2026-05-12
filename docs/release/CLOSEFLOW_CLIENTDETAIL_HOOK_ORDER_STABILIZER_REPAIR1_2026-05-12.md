# CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_STABILIZER_REPAIR1_2026-05-12

## Cel

Przywrocic dzialanie ekranu /clients/:id po powrocie React error #310.

## Decyzja

To jest stabilizacja produkcyjna, nie finalny refactor architektury. Finalny etap powinien rozdzielic ClientDetail na route shell oraz loaded view.

## Zakres

- src/pages/ClientDetail.tsx
- scripts/check-closeflow-clientdetail-hook-order-stabilizer-repair1.cjs
- package.json

## Kryterium

- npm run check:closeflow-clientdetail-hook-order-stabilizer-repair1 przechodzi
- npm run build przechodzi
- /clients/:id nie wywala React #310
