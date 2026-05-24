# CloseFlow Stage179 — Tasks Polish Copy + Remove Focus Card

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Obsidian folder: `10_PROJEKTY/CloseFlow_LeadFlow`

## Decision

After Stage178B, fix `/tasks` before push:
- correct Polish characters in the tasks right rail and grouped task labels,
- remove the `Szybki fokus` card,
- keep `Filtry zadań` and `Najpilniejsze zadania`,
- update guards so focus card is no longer required.

## Important

The Stage179 guard requires Polish labels to be encoded with unicode escapes in `TasksStable.tsx`. This avoids future mojibake from PowerShell/file encoding quirks.

## Tests

```powershell
node scripts/check-stage179-tasks-polish-copy-remove-focus.cjs
node scripts/check-stage178b-tasks-rail-guard-repair.cjs
node scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs
npm.cmd run build
```
