# STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE

Date: 2026-06-23 11:15 Europe/Warsaw
Status: APPLIED_PENDING_TEST_OR_PUSH
Canonical name: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Scope

R1E gates active Calendar DOM normalizers behind one explicit policy module before retiring/removing any of them.

## Runtime touched

- `src/pages/Calendar.tsx`
- `src/lib/calendar-dom-normalizer-policy.ts`

## Normalizers gated

- `CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_EFFECT`
- `CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_EFFECT`
- `CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_EFFECT`

## Out of scope

- SQL
- finance/commission logic
- Google OAuth/sync
- Owner Control
- api/work-items.ts
- Calendar action contract R1D logic

## Required tests

- `node scripts/check-stage232g-r1e-calendar-dom-normalizers-limit-or-retire.cjs`
- `node --test tests/stage232g-r1e-calendar-dom-normalizers-limit-or-retire.test.cjs`
- `node scripts/check-cf-runtime-00-source-truth.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

## Risk audit

R1E intentionally does not remove month DOM surgery immediately because R0 marked month normalizers as high risk and still active. This stage makes them explicit, guardable and switchable. Final retirement should happen only after manual smoke confirms month/week/selected-day rendering is stable without specific normalizers.

## Next

`STAGE232G_R1F_CALENDAR_TODAY_FINAL_PARITY_GUARD_AND_SMOKE`
