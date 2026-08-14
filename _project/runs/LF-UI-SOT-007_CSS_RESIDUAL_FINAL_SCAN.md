# LF-UI-SOT-007 — CSS runtime residual final scan

Status: `EXECUTION_EVIDENCE_READY / CONTROLLER_CLOSEOUT_REQUIRED`

This receipt supersedes the historical residual classification for terminal
runtime counts. It does not change workflow state, accept the stage, write
Vault state, or activate a next stage.

## Exact result

| Measure | Before migration | Final runtime scan |
|---|---:|---:|
| Active patch layers from the baseline ledger | 84 | **0** |
| Conflict groups | 12 | **0** |
| Conflicting selector/property keys | not terminal | **0** |
| Runtime-reachable CSS files | baseline map | 49 |
| Runtime-global CSS files | baseline map | 14 |
| Route/component-scoped CSS files | baseline map | 35 |
| Canonical owner blocks | 60 | **164** |
| CSS parse errors | not terminal | **0** |

The final scan was executed from `src/main.tsx`. `src/App.tsx` is the single
application bootstrap for `src/index.css` and the canonical owner
`src/styles/closeflow-visual-source-truth.css`. CSS imports reachable through
route/component modules remain scoped unless they are reached from a global
root; this prevents falsely treating every page-local stylesheet as a global
cascade layer.

## Scan method

1. Resolve local TS/TSX/JS/CSS imports from `src/main.tsx`.
2. Follow CSS `@import` edges and classify global roots from `App.tsx` plus
   recursive global CSS imports.
3. Parse every reachable stylesheet with PostCSS.
4. Compare normalized `selector @@ property` keys and their normalized
   declaration values across reachable files. Equivalent duplicate values do
   not create a conflict.
5. Compare the exact 84-file baseline ledger against the final reachable graph;
   no filename allowlist or scan-disable switch is used.

The scan completed with `reachableModuleCount=277`, `activeCssFiles=49`,
`activeGlobalCssFiles=14`, `activeBaselinePatchLayerCount=0`,
`conflictKeyCount=0`, `conflictGroups=0`, `canonicalMarkerCount=164`, and no
parse errors.

## Retained global owners

These are retained because they are bootstrap/contract owners or bounded
unique owners with no conflicting selector/property keys in the final graph;
they are not counted as active patch layers:

- `src/index.css`
- `src/styles/closeflow-visual-source-truth.css`
- `src/styles/core/core-contracts.css`
- `src/styles/design-system/index.css`
- `src/styles/design-system/closeflow-components.css`
- `src/styles/design-system/closeflow-icons.css`
- `src/styles/design-system/closeflow-layout.css`
- `src/styles/design-system/closeflow-utilities.css`
- `src/styles/page-adapters/page-adapters.css`
- `src/styles/legacy/legacy-imports.css`
- `src/styles/temporary/temporary-overrides.css`
- `src/styles/closeflow-entity-type-tokens.css`
- `src/styles/closeflow-vnext-ui-contract.css`
- `src/styles/stage216m-r7-entity-data-card-source-truth.css`

The last two remain explicit bounded contracts, not unclassified residue:
`closeflow-vnext-ui-contract.css` owns the `.cfv-*` contract and
`stage216m-r7-entity-data-card-source-truth.css` owns the entity data-card
contract. Neither participates in a final conflict group.

## Reversible checkpoints

Source files were retained; imports were disabled with auditable comments and
the source content was copied into separately marked canonical blocks. Backup
manifests with SHA-256 values are outside the repository:

- `C:\Users\malim\AppData\Local\Temp\lf-ui-sot-007-css-migration-backup-20260812-1\MANIFEST.json`
- `C:\Users\malim\AppData\Local\Temp\lf-ui-sot-007-merged-import-backup-20260812-1\MANIFEST.json`
- `C:\Users\malim\AppData\Local\Temp\lf-ui-sot-007-canvas-merge-backup-20260812-1\MANIFEST.json`
- `C:\Users\malim\AppData\Local\Temp\lf-ui-sot-007-current-global-sources-backup-20260812-1\MANIFEST.json`

No source stylesheet was deleted. No secret, production credential, provider,
database, auth, billing, or business logic path was touched by this CSS
consolidation.

## Remaining closeout boundary

This receipt records the terminal CSS graph result. Guard, typecheck, lint,
build, final browser proof, and final Guardian are recorded in the linked
stage evidence. Remote CI was not run; exact local runtime proof was used.
The controller must perform the stage acceptance/closeout; the executor does
not self-close LF-UI-SOT-007.
