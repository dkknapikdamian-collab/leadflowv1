# STAGE232I4_R16Z_R8_LEAD_MISSING_BLOCKER_TOGGLE_PRIORITY_FIX

Date/time: 2026-06-21 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Scope: LeadDetail Braki/Blokady manager blocker toggle persistence.

## Owner smoke finding

Manual smoke found a real LeadDetail bug:
- in Lead missing manager, unchecking Blokuje displayed a success toast,
- after silent reload / refresh the item returned checked,
- root cause: LeadDetail created missing items with unconditional priority high and the shared manager treats priority high as blocker source truth.

## Fix

- LeadDetail add missing item now writes priority high only when leadMissingManagerBlocksProgress is true, otherwise medium.
- LeadDetail toggle now persists status + priority + blocksProgress + payload together.
- Optimistic linkedTasks state now also updates priority.
- Added guard/test for this bug.

## Not touched

SQL / RLS, finance, Google Calendar, billing/trial, Owner Control runtime, CaseDetail runtime, MissingItemsManagerDialog layout.

## Manual smoke required

Lead:
1. Open lead with active missing item marked Blokuje.
2. Open Braki / Blokady manager.
3. Uncheck Blokuje.
4. Confirm row remains visible but checkbox stays unchecked after silent reload.
5. Press F5 and confirm checkbox remains unchecked.
6. Re-check Blokuje, F5, confirm checked.
7. Resolve/delete still works.

Client regression:
1. Client manager still toggles Blokuje both ways.
2. Client tile updates.

## Status

LOCAL_APPLY_PENDING_TESTS_AND_OWNER_SMOKE until guards/build/verify/smoke pass.
