# STAGE231D0D-R9 - tabs center + axis microfix

- data: 2026-06-12 08:58 Europe/Warsaw
- status: APPLIED_LOCAL_WAITING_VISUAL_PASS
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Zakres
- CSS-only visual microfix.
- Center tabs pills inside the stretched tabs card.
- Lift middle service section slightly.
- Pull right finance/quick actions rail upward to the same visual axis.

## Nie ruszano
- SQL / Supabase / RLS.
- Finance logic.
- Modals.
- Case handlers.
- Quick action logic.
- JSX structure.

## Testy
- R9 guard/test.
- R8/R6/R5/R4/R3/R2/D0C/D0B regression guards/tests.
- git diff --check.
- npm run build.

## Manual
Check CaseDetail at 100% scale before push.
