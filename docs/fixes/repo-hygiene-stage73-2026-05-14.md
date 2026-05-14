# CloseFlow Stage73 - repo hygiene guard

Date: 2026-05-14

## Problem

The local working tree collected stale untracked repair files, preview files, temporary diagnostics and old patch scripts after several emergency UI/runtime fixes.

This made the repo hard to read and increased the risk of accidentally committing old repair artifacts in a later patch.

## Fix

- Quarantined known stale untracked artifacts outside the repository under Downloads.
- Added a repo hygiene guard for stale repair artifacts that should not come back into the working tree.
- Added the guard to prebuild so a production build catches the same class of clutter before it grows again.

## Safety rule

The cleanup script moves files to a quarantine folder instead of deleting them. It skips tracked files.

## Manual check

Run:

```powershell
git status --short
npm run check:closeflow-repo-hygiene-stage73
npm run build
npm run verify:closeflow:quiet
```

Expected:

- no old untracked repair scripts in `tools/`, `scripts/`, `docs/release`, `patches`, or preview leftovers,
- guard passes,
- build passes,
- quiet release gate passes.
