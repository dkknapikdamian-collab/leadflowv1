# STAGE232I4_R12_SHARED_MODAL_VISUAL_SOURCE_TRUTH

Date: 2026-06-19 14:25 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Scope

R12 stops the repeated visual patching of `Braki / Blokady` manager and introduces one shared visual source of truth for application dialogs.

## Problem mapped

R8/R9 fixed backend/source truth and R10/R11 attempted visual repairs, but the modal still failed manual visual smoke. The root problem was not one spacing value. `MissingItemsManagerDialog` had its own local modal layout instead of using a canonical CloseFlow dialog shell.

## Change

- Adds `src/components/ui/CloseFlowDialogShell.tsx` as the shared dialog shell.
- Refactors `src/components/detail/MissingItemsManagerDialog.tsx` to use the shared shell.
- Changes each missing item card to title-first layout:
  1. visible `Nazwa braku`,
  2. blocker checkbox row below,
  3. actions row separated on the right/below depending on width.
- Updates R10/R11 guards/tests so they check the new shared-source visual contract instead of brittle Tailwind tokens.
- Adds R12 structural guard/test.

## Files

- `src/components/ui/CloseFlowDialogShell.tsx`
- `src/components/detail/MissingItemsManagerDialog.tsx`
- `scripts/check-stage232i4-r12-shared-modal-visual-source-truth.cjs`
- `tests/stage232i4-r12-shared-modal-visual-source-truth.test.cjs`
- `scripts/check-stage232i4-r10-missing-manager-readable-layout.cjs`
- `tests/stage232i4-r10-missing-manager-readable-layout.test.cjs`
- `scripts/check-stage232i4-r11-missing-manager-row-layout.cjs`
- `tests/stage232i4-r11-missing-manager-row-layout.test.cjs`

## Checks

Required:

- `node scripts/check-stage232i4-r12-shared-modal-visual-source-truth.cjs`
- `node --test tests/stage232i4-r12-shared-modal-visual-source-truth.test.cjs`
- R10/R11/R14/R6/R9/R8 regression guards/tests
- `npm run build`
- `git diff --check`

## Manual smoke

After Vercel deploy:

1. Client -> `Zobacz wszystkie braki`.
2. Verify the modal uses the same dark shell style as other application dialogs.
3. Add 2-3 missing items.
4. Verify each card shows visible `Nazwa braku` first.
5. Verify blocker checkbox is below the title, not competing with it.
6. Verify `Uzupełnione` and `Usuń` are separated from the name.
7. Repeat on Lead.

## Risk audit

- Backend, SQL, `api/work-items.ts`, R8/R9 source truth are not touched.
- Main risk is that the shared shell may later need to be adopted by more dialogs. R12 only creates the source of truth and moves the missing manager onto it.
- Manual Vercel visual smoke remains required before closing the stage.
