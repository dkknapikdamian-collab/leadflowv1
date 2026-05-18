# Stage121 V8 - calendar shift Stage114 contract compatibility

## Scan-first confirmation

- Project: CloseFlow / LeadFlow.
- Branch expected: `dev-rollout-freeze`.
- Source of truth reviewed: `Calendar.tsx`, Stage121 V6/V7 results, Stage104 guard, Stage114 shift persistence guard, quiet release gate, Obsidian update requirement.

## FAKTY Z KODU / LOGU

- Stage121 V6/V7 product direction passed earlier guards and build far enough to reach `verify:closeflow:quiet`.
- Stage104 false-positive was repaired in V7.
- Current blocking failure is `tests/stage114-calendar-shift-persistence-contract.test.cjs`.
- Stage114 expects task shift PATCH payload to keep literal contract:
  - `scheduledAt: taskPayload.dueAt,`
  - `dueAt: taskPayload.dueAt,`
- Stage121 used an equivalent `shiftedStartAt` value, but the older contract guard is textual and rejects it.

## DECYZJE DAMIANA

- The P0 target remains calendar shift actions: `+1H`, `+1D`, `+1W` must actually move entries.
- All ZIP work must update Obsidian and project memory.

## ZMIANY

- Stage121 patcher updated so task shift persistence uses the Stage114-compatible literal payload while preserving Stage121 lead branch and optimistic state.
- V8 applies over existing local Stage121 state or re-applies from clean `origin/dev-rollout-freeze` if Stage121 marker is missing.
- Stage114 shift persistence guard is run explicitly before full quiet verify.

## TESTY AUTOMATYCZNE

Expected apply checks:
- `node --test tests/stage104-calendar-loading-performance-contract.test.cjs`
- `node --test tests/stage121-calendar-shift-lead-branch-contract.test.cjs`
- `node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- `node --test tests/stage114-calendar-hard-refresh-data-load-contract.test.cjs`
- `node --test tests/stage114-calendar-shift-persistence-contract.test.cjs`
- `node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`

## TEST RĘCZNY

- Lead / następna akcja: `+1D`, `+1W`, `+1H`, hard refresh.
- Task: `+1D`, `+1W`, `+1H`, hard refresh.
- Event: `+1D`, `+1W`, `+1H`, hard refresh.

## RYZYKA

- If UI moves immediately but hard refresh reverts, the next issue is backend/Google overwrite, not local Calendar state.
- Do not use `git add .`; this stage uses selective adds only.

## NASTĘPNY KROK

Run V8 apply package with `-DoPush`, then manual calendar shift QA.
