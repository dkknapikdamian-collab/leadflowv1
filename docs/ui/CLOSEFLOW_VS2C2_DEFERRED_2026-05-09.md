# CloseFlow VS-2C-2 â€” Action icons in list pages â€” deferred â€” 2026-05-09

## Status

DEFERRED. Not shipped.

## Decision

VS-2C-2 list icon migration was stopped and rolled back from runtime files.

## Why

The value of migrating several action icons in list pages was lower than the risk introduced by repeated import rewrites in legacy-heavy files:

- `src/pages/Leads.tsx`
- `src/pages/Clients.tsx`
- `src/pages/Cases.tsx`

Repeated repair attempts kept destabilizing React import blocks before build. The safe choice is to preserve the working baseline and continue with smaller visual-system steps.

## What remains shipped

These previous stages stay valid:

- VS-2C-mini action icon registry foundation
- VS-2C-1 global component action icons
- VS-2B entity icon registry
- VS-2 component registry
- VS-1 design tokens
- VS-0 visual inventory

## Next rule

Do not touch large legacy page imports with broad regex scripts.

Future icon migration must be manual/file-specific or implemented by adapter components at the component boundary, not by mass rewriting page imports.

## Checks for baseline

```bash
npm run check:closeflow-action-icon-registry
npm run check:closeflow-vs2c1-action-icons-components
npm run check:closeflow-entity-icon-registry
npm run build
```
