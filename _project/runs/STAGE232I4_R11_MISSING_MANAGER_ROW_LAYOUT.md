# STAGE232I4_R11_MISSING_MANAGER_ROW_LAYOUT

Date: 2026-06-19 13:50 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Scope

R11 fixes the visual layout of `Braki / Blokady` manager rows after R10.

The confirmed functional flow from R8/R9/R10 remains unchanged:
- client missing item is saved,
- tile shows the missing item,
- manager opens,
- source truth remains in `work_items` with DB-safe status.

## Visual fix

Each missing item row now uses a three-column layout on wider screens:
1. blocker checkbox/status column,
2. visible missing item name column,
3. separate action buttons column.

This avoids the cramped R10 layout where checkbox, missing name and `Uzupełnione`/`Usuń` could visually collide.

## Files

- `src/components/detail/MissingItemsManagerDialog.tsx`
- `scripts/check-stage232i4-r11-missing-manager-row-layout.cjs`
- `tests/stage232i4-r11-missing-manager-row-layout.test.cjs`

## Expected checks

- `node scripts/check-stage232i4-r11-missing-manager-row-layout.cjs`
- `node --test tests/stage232i4-r11-missing-manager-row-layout.test.cjs`
- R10/R14/R6/R9/R8 regression guards/tests where available
- `npm run build`
- `git diff --check`

## Manual smoke

After Vercel deploy:
1. Client -> `Zobacz wszystkie braki`.
2. Add or keep 2-3 missing items.
3. Verify each row has checkbox/status, title and actions separated.
4. Verify title is visible without selecting text.
5. Verify Lead manager uses same style.

## Risk audit

- Backend and SQL are not touched.
- R8/R9 source truth remains unchanged.
- The change is visual, but can regress small-screen layout; grid falls back to stacked layout before `lg`.
- Manual Vercel visual smoke remains required.
