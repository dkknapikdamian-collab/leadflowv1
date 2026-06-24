# Obsidian update payload — STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC

Date/time: 2026-06-24 08:00 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
project_id: closeflow_lead_app
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Update target

Central Obsidian files:
- 02_AKTUALNY_STAN
- 04_KIERUNEK_DO_WDROZENIA / 04_ETAPY_ROZWOJU_APLIKACJI
- 08_HISTORIA_ZMIAN
- 09_TESTY_DO_WYKONANIA_I_WYNIKI
- 10_ZIPY_WDROZENIA_PUSH
- 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY

## Entry

STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC is applied locally pending tests and owner smoke.
The stage closes gaps in existing /today Owner Control baseline: ownerless records and note-without-follow-up rows.
It does not create a new source of truth, does not add SQL, and does not redesign Today.

## Tests

- node scripts/check-stage-a35-r1-owner-control-baseline-gap-close-and-queue-sync.cjs
- node --test tests/stage-a35-r1-owner-control-baseline-gap-close-and-queue-sync.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
- manual smoke /today

## Risks

- ownerless rows may be noisy on old records,
- note rows depend on notes being present in the Today work-item feed,
- do not proceed to another Owner Control feature until A35 smoke is confirmed.
