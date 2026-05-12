# CLOSEFLOW_CLIENTDETAIL_LOADING_NULL_SAFE_2026-05-12

## Goal

Fix the production ClientDetail runtime error: Cannot read properties of null (reading 'length').

## Finding

After hook-order stabilization, the loading branch still rendered ClientFinanceRelationSummary while client can be null. That summary can read list lengths from nullable data before the client record is loaded.

## Change

- Remove ClientFinanceRelationSummary from the loading branch only.
- Keep the loaded ClientDetail view unchanged.
- Repair the hook-order stabilizer check so it counts the marker inside the loading branch, not the top file comment.
- Add a guard ensuring the loading branch cannot render the nullable finance summary again.

## Scope

- src/pages/ClientDetail.tsx
- scripts/check-closeflow-clientdetail-hook-order-stabilizer-repair1.cjs
- scripts/check-closeflow-clientdetail-loading-null-safe.cjs
- package.json

## Completion criteria

- npm run check:closeflow-clientdetail-hook-order-stabilizer-repair1 passes.
- npm run check:closeflow-clientdetail-loading-null-safe passes.
- npm run build passes.
- /clients/:id no longer crashes on loading/null client state.
