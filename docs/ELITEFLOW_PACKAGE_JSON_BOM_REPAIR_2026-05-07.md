# EliteFlow / CloseFlow â€” package.json BOM repair â€” 2026-05-07

## Problem

Build failed after the metric tile lock patch because `package.json` was rewritten with a UTF-8 BOM.

Vite/Tailwind resolver reported:

```text
SyntaxError: Unexpected token 'ď»ż', "ď»ż{ ... is not valid JSON
```

## Fix

- Rewrite `package.json` as UTF-8 without BOM.
- Preserve the metric tile lock script.
- Add guard: `scripts/check-package-json-no-bom.cjs`.
- Add npm script: `check:package-json-no-bom`.

## Why this is important

`package.json` is read by Node/Vite/Tailwind as strict JSON in several resolver paths. A BOM at byte 0 can break production build even when PowerShell or editors display the file as normal text.

## Verification

Run:

```powershell
node scripts/check-package-json-no-bom.cjs
npm run check:eliteflow-metric-tiles
npm run build
```