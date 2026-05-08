# CloseFlow UI Premap — 2026-05-08

Status: seed map prepared from repo-level inspection and current working direction. This is not the final generated map. Always refresh with `npm run audit:closeflow-ui-map` and `npm run audit:closeflow-style-map` before changing UI.

## Current hard truth

The main product problem is not just that individual screens look imperfect. The real problem is inconsistent visual ownership: the same UI meaning can be styled or placed differently across pages.

Target rule:

> One function = one logical placement. One visual meaning = one source of style truth.

## Metric tiles / kafelki

Current source-of-truth candidate:

- Component: `src/components/StatShortcutCard.tsx`
- Global style: `src/styles/closeflow-metric-tiles.css`
- Global import: `src/App.tsx`

Required direction:

- Metric tiles should use `StatShortcutCard` where possible.
- Local page-specific tile styles are legacy or temporary unless explicitly added as official variants.
- Changes like radius, shadow, min-height, font size, value layout, icon shape must happen in `closeflow-metric-tiles.css` or central props/variants, not per page.

## Buttons / przyciski

Base source-of-truth candidate:

- `src/components/ui/button.tsx`

Missing product-level source-of-truth:

- `EntityActionButton`
- `EntityActionIcon`
- `EntityActionCluster`

Required direction:

- Base Button is not enough for product-level consistency.
- Entity actions must be wrapped by a shared action contract so the same action type looks and lives the same across ClientDetail, LeadDetail, CaseDetail, lists, and panels.

## Icons / ikonki

Current issue:

- Icons are imported locally from `lucide-react` across pages.
- There is no explicit action-icon style contract.

Required direction:

- Add a shared icon/action style source before broad migrations.
- Delete/trash/destructive must not rely on local `text-red-*`, `text-rose-*`, `bg-red-*`, or `bg-rose-*` sprinkled across files.

## Delete / Trash2 / Usuń / destructive

Existing base semantics:

- `src/components/ui/button.tsx` has `variant: destructive`.
- `src/components/confirm-dialog.tsx` has `confirmTone?: 'default' | 'destructive'` and maps destructive tone to destructive Button variant.

Missing layer:

- A global product-level destructive/delete action contract.

Target:

- `delete`, `trash`, `Usuń`, `Trash2`, `destructive` must use one shared source of visual truth.
- Changing delete/danger token in one place should update all delete/trash UI.

## Add note / Dodaj notatkę

Target logical region:

- `activity-panel-header`

Screens to compare and normalize:

- `src/pages/ClientDetail.tsx`
- `src/pages/LeadDetail.tsx`
- `src/pages/CaseDetail.tsx`

Known direction:

- ClientDetail may contain duplicated note entry points.
- LeadDetail currently has a local contact/history note form pattern.
- CaseDetail has a more operational panel pattern.

Target:

- Same action should live in the same logical region across entity detail screens.
- Do not delete note functionality. Move or normalize entry points only when behavior is preserved.

## Suggested first implementation stage

Do not start by refactoring all cards. Start with a smaller test of the rule:

### Stage: destructive/delete source of truth

Goal:

- Trash2 / Usuń / destructive use one visual source of truth.
- Changing delete/danger styling in one file changes the UI globally.
- Add a guard preventing local danger styles next to delete/trash actions.

Why first:

- Small scope.
- Easy to verify.
- Tests the most important design-system promise.

## Non-goals for the first refactor

- Do not rebuild all entity detail screens.
- Do not redesign all cards.
- Do not change delete behavior.
- Do not touch Supabase/API/auth/billing/AI.
- Do not replace working logic with visual-only placeholders.
