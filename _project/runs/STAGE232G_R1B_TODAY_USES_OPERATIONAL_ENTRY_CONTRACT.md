# STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT

Date: 2026-06-23 08:20 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

READY_TO_APPLY_ZIP / TODAY_RUNTIME_CONTRACT_WIRING / REVIEW_REQUIRED

## Context

R0 confirmed that Calendar/Today source truth is PARTIAL.
R1A added the shared operational entry contract.
R1A work-items hotfix restored build health after the contract commit.
R1B now wires TodayStable date/moment helpers to the shared operational contract without rebuilding the UI.

## Scope

This stage may touch only:

- `src/pages/TodayStable.tsx`
- `src/lib/calendar-operational-entry-today-adapter.ts`
- `scripts/check-stage232g-r1b-today-uses-operational-entry-contract.cjs`
- `tests/stage232g-r1b-today-uses-operational-entry-contract.test.cjs`
- `scripts/check-cf-runtime-00-source-truth.cjs`
- central `_project` / Obsidian status files

## Runtime change

TodayStable local helper bodies are converted into wrappers over the R1B adapter:

- `getTaskMomentRaw(...)` -> `getTodayTaskMomentRaw(...)`
- `getEventMomentRaw(...)` -> `getTodayEventMomentRaw(...)`
- `getLeadMomentRaw(...)` -> `getTodayLeadMomentRaw(...)`
- `getDateKey(...)` -> `getTodayOperationalDayKey(...) ?? ""`

This keeps Today UI structure intact while moving date/moment priority into the shared Calendar/Today contract layer.

## Guard / tests

- `node scripts/check-stage232g-r1b-today-uses-operational-entry-contract.cjs`
- `node --test tests/stage232g-r1b-today-uses-operational-entry-contract.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

## Not touched

- Calendar UI
- Calendar DOM normalizers
- SQL / migrations / RLS
- finance / commission logic
- Owner Control runtime
- Google OAuth / Google sync
- work-items API hotfix area

## Risk audit after R1B

Risk: Today lists may rely on local helper edge cases not covered by R1B adapter.
Mitigation: adapter keeps original function names as wrappers and does not change row rendering.

Risk: lead shadow entries still need dedicated rules.
Mitigation: R1C remains the stage for lead shadow entry policy and deduplication.

Risk: date string/time split edge cases can appear in manual smoke.
Mitigation: R1B keeps `parseTime` untouched and changes only date/moment source-of-truth wrappers.

## Next recommended stage

STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP
