# OBSIDIAN UPDATE MANIFEST - STAGE211C UNIFIED APP CANVAS

- project: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- report: _project/reports/STAGE211C_UNIFIED_APP_CANVAS_2026-05-30.md
- type: local UI CSS source-truth update
- status: prepared in ZIP / local apply required

## Summary

Stage211C introduces one global app canvas CSS source of truth so all operator tabs share the same background behind and between cards.

## Files changed by patch

- src/styles/closeflow-unified-page-canvas-stage211c.css
- src/components/Layout.tsx
- src/pages/*.tsx files that import Layout
- scripts/check-stage211c-unified-app-canvas.cjs
- _project/reports/STAGE211C_UNIFIED_APP_CANVAS_2026-05-30.md

## Tests

- node scripts/check-stage211c-unified-app-canvas.cjs
- npm run build

## Do not touch

- Supabase
- RLS
- deployment
- secrets
