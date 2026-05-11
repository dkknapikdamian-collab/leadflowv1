# CloseFlow — Cases Loader2 runtime fix — 2026-05-11

## Problem

Route `/cases` could crash in production with:

```text
ReferenceError: Loader2 is not defined
APP_ROUTE_RENDER_FAILED
```

## Cause

`src/pages/Cases.tsx` referenced `Loader2`, but the icon was not guaranteed to be imported from `lucide-react`.

## Fix

- Add `Loader2` to the `lucide-react` import in `src/pages/Cases.tsx` when the component uses it.
- Add guard: `scripts/check-closeflow-cases-loader2-import.cjs`.
- Register the guard in `package.json` as `check:closeflow-cases-loader2-import`.
- Inject the guard into `scripts/closeflow-release-check-quiet.cjs` without changing the `verify:closeflow:quiet` package script.

## Verification

Run:

```powershell
npm.cmd run check:closeflow-cases-loader2-import
npm.cmd run verify:closeflow:quiet
npm.cmd run build
```

## Manual test

After deployment, open `/cases` and confirm the route renders without `Loader2 is not defined` in the browser console.
