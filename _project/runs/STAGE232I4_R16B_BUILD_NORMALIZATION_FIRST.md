# STAGE232I4_R16B_BUILD_NORMALIZATION_FIRST

Date/time: 2026-06-19 20:40 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Reason

R16/R16A should not continue until build performance is normalized. A timeout wrapper is not the fix. The normal path must be plain `npm run build` again.

## Scope

- Remove failed untracked R16/R16A guard/test/report artifacts from the local repo workspace.
- Keep `package.json` build command as `vite build`.
- Keep `@tailwindcss/vite` plugin enabled.
- Change Tailwind v4 import in `src/index.css` from unscoped detection to `@import "tailwindcss" source("./");`, limiting source detection to `src` because the stylesheet is in `src/index.css`.
- Add a guard and test for the build normalization contract.

## Not touched

- SQL / RLS
- Owner Control I3 runtime
- ClientDetail missing manager UI implementation
- LeadDetail
- CaseDetail
- finance, billing/trial, Google Calendar

## Required checks

```powershell
node scripts/check-stage232i4-r16b-build-normalization.cjs
node --test tests/stage232i4-r16b-build-normalization.test.cjs
npm run build
git diff --check
```

## Result

TO_BE_FILLED_BY_LOCAL_RUN
