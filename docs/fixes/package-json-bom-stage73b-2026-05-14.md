# CloseFlow Stage73B - package.json BOM repair

Date: 2026-05-14

## Problem

Stage73 committed package.json with an UTF-8 BOM at the beginning of the file. npm tolerated it, but Vite/Tailwind failed during production build through enhanced-resolve JSON.parse:

```text
Unexpected token '﻿', "﻿{" is not valid JSON
```

## Fix

- Strip BOM from package.json.
- Keep package.json valid JSON.
- Add a prebuild guard that fails fast if critical JSON files start with BOM.
- Ensure the deploy script stops before commit/push when build or verify fails.

## Manual test

Run:

```text
npm run check:json-no-bom-stage73b
npm run build
npm run verify:closeflow:quiet
```

Expected: all commands pass and production build no longer fails on package.json.
