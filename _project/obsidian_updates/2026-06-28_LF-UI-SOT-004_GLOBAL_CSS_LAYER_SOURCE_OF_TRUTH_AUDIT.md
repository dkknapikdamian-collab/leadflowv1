# LF-UI-SOT-004_GLOBAL_CSS_LAYER_SOURCE_OF_TRUTH_AUDIT

Date: 2026-06-28 04:00 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

AUDIT_MATRIX_RECORDED / DOCS_ONLY / RUNTIME_NOT_TOUCHED / NEEDS_LOCAL_VERIFY

## Summary

LF-UI-SOT-004 was executed as an audit/matrix stage only.
No CSS cleanup was performed.
No UI/layout/runtime code was touched.

## Findings

`src/App.tsx` currently has 45 active global CSS imports and one disabled legacy layer:

```txt
closeflow-viewport-zoom-80-source-truth-stage157.css
```

The anti-patch guard currently has:

```txt
APP_STYLES_IMPORT_MAX src/App.tsx = 45
```

This means the current guard baseline matches the current App CSS import count. The limit must not be increased without a scoped stage decision.

## CSS conflict areas

- page header
- modal/dialog
- right rail
- search
- density/scale
- finance modal
- cards/lists

## Output

```txt
_project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-004_GLOBAL_CSS_LAYER_SOURCE_OF_TRUTH_AUDIT.md
_project/runs/LF-UI-SOT-004_GLOBAL_CSS_LAYER_SOURCE_OF_TRUTH_AUDIT.md
```

## Required local verify

```powershell
npm run guard:ui:patch-layers
node --test tests/ui-patch-layers-guard.test.cjs
npm run guard:routes:canonical
npm run guard:config:status-source-of-truth
node --test tests/config-status-source-of-truth.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

If `verify:closeflow:quiet` is red because of the previously known dirty workspace, record:

```txt
VERIFY_BLOCKED_BY_UNRELATED_DIRTY_WORKSPACE
```

## Next recommendation

Do not start CSS cleanup yet.
Next planning stage:

```txt
LF-UI-SOT-005_ACTIVE_VISUAL_TEMPLATE_DICTIONARY
```
