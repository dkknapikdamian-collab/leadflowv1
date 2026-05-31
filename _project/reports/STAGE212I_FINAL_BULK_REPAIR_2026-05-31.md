# STAGE212I Final Bulk Repair

- date: 2026-05-31
- branch: dev-rollout-freeze
- scope: import order, mojibake final sweep, visual foundation runtime, sidebar active icon

## Changed files

- scripts/check-stage212i-final-bulk-repair.cjs
- src/components/Layout.tsx
- src/components/VisualFoundationRuntimeStage212G.tsx
- src/index.css
- src/styles/closeflow-visual-foundation-stage212g.css
- src/styles/visual-stage01-shell.css

## Notes

- @import rules in src/index.css are hoisted to the beginning.
- Stage212G runtime is the only visual foundation runtime in Layout.tsx.
- Known mojibake patterns in Layout.tsx, Today.tsx and TasksStable.tsx are repaired.
- Active sidebar icon no longer uses a white square background.
- Canvas token remains #f1f5f9 and cards remain #ffffff.
