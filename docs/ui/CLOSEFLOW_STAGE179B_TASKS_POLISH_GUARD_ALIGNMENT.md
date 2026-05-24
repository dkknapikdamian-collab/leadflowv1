# CloseFlow Stage179B — Tasks Polish Guard Alignment

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Obsidian folder: `10_PROJEKTY/CloseFlow_LeadFlow`

## Problem

Stage179 applied but guards failed:
- `TasksStable.tsx` still contained mojibake fragment `zadaĹ`,
- Stage178 and Stage178B guards still expected literal `Filtry zadań` while Stage179 had converted some copy to escaped expressions.

## Fix

Stage179B:
- removes leftover mojibake fragments in `TasksStable.tsx`,
- restores literal rail headings needed by existing guards,
- keeps task labels/hints as unicode-escaped JS strings,
- keeps `Szybki fokus` removed,
- aligns Stage178 and Stage178B guards.

## Tests

```powershell
node scripts/check-stage179b-tasks-polish-guard-alignment.cjs
node scripts/check-stage179-tasks-polish-copy-remove-focus.cjs
node scripts/check-stage178b-tasks-rail-guard-repair.cjs
node scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs
npm.cmd run build
```
