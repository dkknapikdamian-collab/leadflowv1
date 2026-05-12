# CloseFlow Stage14H Repair1 — calendar nearest-7 dedupe launcher root fix

Date: 2026-05-12
Branch: dev-rollout-freeze

## Goal

Finish Stage14H: remove the duplicated lower compact list under the weekly Calendar right-rail panel "Najbliższe 7 dni".

## Repair reason

The original Stage14H package failed before patching because the PowerShell launcher resolved package root inside a nested scriptblock and produced a null Copy-Item source path.

## Scope

Expected changes:

- `src/pages/Calendar.tsx`
- `package.json`
- `scripts/check-stage14h-calendar-week-nearest7-dedupe.cjs`
- `tools/repair-stage14h-calendar-week-nearest7-dedupe-repair1.cjs`
- `docs/release/CLOSEFLOW_STAGE14H_REPAIR1_LAUNCHER_ROOT_FIX_2026-05-12.md`

## Guard

Adds/uses:

```text
npm.cmd run check:stage14h-calendar-week-nearest7-dedupe
```

The guard blocks the old compact duplicated weekly summary while keeping the main readable "Najbliższe 7 dni" panel.
