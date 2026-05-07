# CloseFlow Today top tile focus repair - 2026-05-07

## Problem

- The top tile `Leady do obsługi dziś` did not reliably open its lower list.
- Clicking a top tile should not merely uncollapse one list in place.
- Desired behavior: click a top metric tile, move its matching lower section to the top, expand it, and collapse all remaining lower sections.

## Cause

- The previous click bridge skipped every element with `aria-expanded`. That can block tile-like buttons too broadly.
- `openTodaySection()` only removed the clicked key from collapsed state, so previously opened lists could remain open.
- The lower sections were never moved after top-tile selection.
- If a section was hidden by the view customizer/localStorage, a top tile click did not force that section back into the visible set.

## Fix

- Top tile click now ensures the section is visible.
- Top tile click expands only the selected section and collapses the others.
- The selected lower section is moved to the top of the lower section stack.
- Bottom section headers still only control collapse/expand and do not hide other cards.
- The previous `aria-expanded` skip is narrowed to real lower section headers with an `h2`.

## Verification

```powershell
node scripts/check-admin-feedback-p1-hotfix.cjs
node scripts/check-admin-feedback-p1-followup.cjs
node scripts/check-today-section-click-repair.cjs
node scripts/check-today-top-tile-focus.cjs
npm run build
```
