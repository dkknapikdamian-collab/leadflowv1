# CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_REAL_REFACTOR_2026-05-12

## Goal

Remove the temporary ClientDetail React #310 hook-order padding added as a hotfix.

## Decision

The previous emergency repair used empty `useMemo(() => null, [])` calls as hook-count padding. This repair removes those padding calls and adds a guard so they cannot silently return.

## Scope

- `src/pages/ClientDetail.tsx`
- `scripts/check-closeflow-clientdetail-hook-order-real-refactor.cjs`
- `package.json`

## Completion criteria

- `npm run check:closeflow-clientdetail-hook-order-real-refactor` passes.
- `npm run build` passes.
- `ClientDetail.tsx` contains no empty `useMemo(() => null, [])` padding.

## Note

If React #310 returns after deployment, the remaining issue is structural and the next step is a component split: data/container wrapper plus loaded ClientDetail view component. That is the correct surgical fix, not more hook padding.
