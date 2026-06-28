# LF-UI-SOT-004_GLOBAL_CSS_LAYER_SOURCE_OF_TRUTH_AUDIT - run report

Date: 2026-06-28 15:35 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Result

LOCAL_PASS / CSS_MATRIX_COMPLETED / DOCS_ONLY / RUNTIME_NOT_TOUCHED / CSS_NOT_TOUCHED

## Generated artifacts

- _project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-004_GLOBAL_CSS_LAYER_SOURCE_OF_TRUTH_AUDIT.md
- _project/runs/LF-UI-SOT-004_GLOBAL_CSS_LAYER_SOURCE_OF_TRUTH_AUDIT.md
- _project/obsidian_updates/2026-06-28_LF-UI-SOT-004_GLOBAL_CSS_LAYER_SOURCE_OF_TRUTH_AUDIT.md

## Matrix coverage

- aktywne importy CSS z App.tsx: 45
- wyłączone importy CSS z App.tsx: 1
- pliki aktywne z !important: 41
- pliki aktywne z display:none: 10
- pliki aktywne z z-index: 11
- pliki aktywne z position fixed/absolute: 8

## Tests

- npm run guard:ui:patch-layers: PASS
- node --test tests/ui-patch-layers-guard.test.cjs: PASS
- npm run guard:routes:canonical: PASS
- npm run guard:config:status-source-of-truth: PASS
- node --test tests/config-status-source-of-truth.test.cjs: PASS
- npm run build: PASS
- npm run verify:closeflow:quiet: PASS
- git diff --check: PASS

## Git rules

- no git add .
- no force push
- selective docs-only staging

## Next

Run local Test-Path verification. Do not start LF-UI-SOT-005 before that.
