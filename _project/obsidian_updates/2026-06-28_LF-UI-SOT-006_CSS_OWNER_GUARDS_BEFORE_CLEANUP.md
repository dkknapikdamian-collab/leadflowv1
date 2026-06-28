# Obsidian update - LF-UI-SOT-006_CSS_OWNER_GUARDS_BEFORE_CLEANUP

Date: 2026-06-28 19:20 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Status to record

LF-UI-SOT-006_CSS_OWNER_GUARDS_BEFORE_CLEANUP:
APPLIED_PARTIAL / GUARD_AND_TEST_ADDED / PACKAGE_SCRIPT_PENDING / LOCAL_VERIFY_PENDING / NO_UI_CSS_CLEANUP

## Paths

- scripts/check-lf-ui-sot-006-css-owner-guards-before-cleanup.cjs
- tests/lf-ui-sot-006-css-owner-guards-before-cleanup.test.cjs
- _project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-006_CSS_OWNER_GUARDS_BEFORE_CLEANUP.md
- _project/runs/LF-UI-SOT-006_CSS_OWNER_GUARDS_BEFORE_CLEANUP.md
- _project/obsidian_updates/2026-06-28_LF-UI-SOT-006_CSS_OWNER_GUARDS_BEFORE_CLEANUP.md

## Results

Remote files added: DONE
package.json npm script: PENDING
local guard/test/build: PENDING
Vercel: NOT_CHECKED

## Required package.json script

guard:ui:css-owner-before-cleanup -> node scripts/check-lf-ui-sot-006-css-owner-guards-before-cleanup.cjs

## Next step

Add package.json script locally, run verify commands, then close SOT-006 only if guard/test/build/diff are green.

## Do not touch

- UI runtime
- CSS contents
- CSS import order
- layout behavior
- SQL/API/Supabase/Firebase
- APP_STYLES_IMPORT_MAX
- hotfix/stage CSS files

## Obsidian sync

Obsidian GitHub sync: TO_UPDATE_AFTER_LOCAL_VERIFY_OR_STATUS_SYNC
Obsidian local sync: LOCAL_SYNC_PENDING
