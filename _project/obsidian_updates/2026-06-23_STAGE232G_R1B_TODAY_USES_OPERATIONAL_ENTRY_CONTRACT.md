# 2026-06-23 STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT

Status: R1B_READY_TO_APPLY / LOCAL_SYNC_PENDING
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Summary

R1B wires TodayStable date/moment helpers to the shared Calendar/Today operational entry contract created in R1A.

## Scope

- Add Today adapter for shared operational entries.
- Convert TodayStable local moment/date helpers into wrapper calls.
- Keep visual UI unchanged.
- Add guard and node test.

## Test plan

- R1B guard
- R1B node test
- build
- verify:closeflow:quiet
- git diff --check
- manual smoke: Today loads, Calendar loads, no red console errors

## Risk audit

Today/Calendar parity improves but is not fully closed. R1C must handle lead shadow entry policy and deduplication.

## Sync

Obsidian GitHub sync: pending until commit/push
Obsidian local sync: LOCAL_SYNC_PENDING
