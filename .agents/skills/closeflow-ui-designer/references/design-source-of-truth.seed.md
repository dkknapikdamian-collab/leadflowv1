# Design Source of Truth Seed

## Current central sources

- Metric cards: `StatShortcutCard.tsx` + `closeflow-metric-tiles.css`.
- Base buttons: `ui/button.tsx`.
- Destructive confirm: `confirm-dialog.tsx`.

## Missing central sources

- Action icon style contract.
- Entity action cluster contract.
- Delete/danger product-level token contract.

## Direction

Do not add more local styling. Reduce local styling by migrating repeated actions and visuals into central primitives.
