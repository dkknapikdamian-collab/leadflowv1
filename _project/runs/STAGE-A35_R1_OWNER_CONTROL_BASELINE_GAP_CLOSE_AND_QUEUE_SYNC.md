# STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC

Date/time: 2026-06-24 08:00 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
project_id: closeflow_lead_app
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

APPLIED_LOCAL_PENDING_GUARDS_BUILD_VERIFY_OWNER_SMOKE_PUSH

## Scope

This stage is a gap-close for the existing Owner Control baseline in /today.
It does not create a new Today redesign, new tiles, SQL, billing, finance or Calendar runtime.

Implemented:
- added stage marker STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC,
- extended OwnerControlEntityType with client for source-linked gap rows,
- added ownerless lead/case signal: Brak odpowiedzialnego,
- added note-without-follow-up rows sourced from existing work items/notes,
- excluded notes from generic due-task rows to avoid duplicate rows,
- kept Today Wymaga ruchu reading ownerControlBaseline.items,
- added dedicated guard and node test,
- added CF runtime allowlist scope.

## Files touched

- src/lib/owner-control/owner-control-baseline.ts
- src/pages/TodayStable.tsx
- scripts/check-cf-runtime-00-source-truth.cjs
- scripts/check-stage-a35-r1-owner-control-baseline-gap-close-and-queue-sync.cjs
- tests/stage-a35-r1-owner-control-baseline-gap-close-and-queue-sync.test.cjs
- _project/runs/STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC.md
- _project/obsidian_updates/2026-06-24_STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC.md
- _project/CODEX_CONTEXT_INDEX.md
- _project/04_ETAPY_ROZWOJU_APLIKACJI.md
- _project/06_GUARDS_AND_TESTS.md
- _project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md
- _project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md

## Tests to run

```powershell
node scripts/check-stage-a35-r1-owner-control-baseline-gap-close-and-queue-sync.cjs
node --test tests/stage-a35-r1-owner-control-baseline-gap-close-and-queue-sync.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

## Manual smoke required

1. Open /today.
2. Confirm Wymaga ruchu opens and still uses one baseline list.
3. Confirm existing rows still show lead/case/task/event problems.
4. Prepare lead without owner and confirm row/signal Brak odpowiedzialnego appears.
5. Prepare case without owner and confirm row/signal Brak odpowiedzialnego appears.
6. Prepare note linked to lead/case/client without planned task/follow-up and confirm [Lead]/[Sprawa]/[Klient] Notatka bez follow-upu appears.
7. Add a task/follow-up to the same source and confirm the note-without-follow-up row disappears after refresh.
8. Press F5 and confirm counts match visible lists.

## Risk audit

- Risk: ownerless detection can surface many old records if old data has no owner fields. If too noisy, next patch should threshold by status/date or workspace owner mapping.
- Risk: notes are detected from existing task/work-item feed only. If notes live in a separate table not loaded by Today, this stage will not see them without a future data-source decision.
- Risk: source client rows route to /clients/:id but Today does not fetch full clients. This is intentional source routing only, not a client data fetch.
- Risk avoided: no SQL/RLS, no Calendar/finance/billing, no duplicate tiles, no case_items active source.

## Closure criteria

Close only after guard PASS, node test PASS, build PASS, verify quiet PASS or explicit unrelated skip, git diff --check PASS, and Damian owner smoke OK.
