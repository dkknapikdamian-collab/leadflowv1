# CloseFlow Stage179C — Tasks Polish Final Guard Repair

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Obsidian folder: `10_PROJEKTY/CloseFlow_LeadFlow`

## Problem

Stage179B build passed, but Stage179B and Stage179 guards still failed:
- `TasksStable.tsx` still contained mojibake marker `Ĺ‚`,
- Stage179 guard expected the escaped JSX marker `<h2>{'Filtry zada\u0144'}</h2>`,
- Stage178 and Stage178B guards already passed.

## Fix

Stage179C:
- performs final Polish mojibake cleanup in `TasksStable.tsx`,
- keeps literal headings required by Stage178/178B guards,
- rewrites Stage179 and Stage179B guards to the final accepted contract,
- keeps `Szybki fokus` removed,
- adds a final Stage179C guard.

## Tests

```powershell
node scripts/check-stage179c-tasks-polish-final-guard-repair.cjs
node scripts/check-stage179b-tasks-polish-guard-alignment.cjs
node scripts/check-stage179-tasks-polish-copy-remove-focus.cjs
node scripts/check-stage178b-tasks-rail-guard-repair.cjs
node scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs
npm.cmd run build
```
