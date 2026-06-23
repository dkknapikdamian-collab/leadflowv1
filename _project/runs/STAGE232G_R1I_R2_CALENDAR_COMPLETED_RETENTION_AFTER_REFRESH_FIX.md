# STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX

Date: 2026-06-23 20:05 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Status

APPLIED_PENDING_GUARDS_AND_MANUAL_SMOKE

## Problem

R1G was a false-positive. It sorted entries already present in Calendar, but the owner smoke showed completed entries disappear after clicking `Zrobione`.

## Real finding

`Calendar.tsx` already had completed styling and completed-last sorting. `calendar-items.ts` hides only deleted/archived/removed rows or explicit hidden flags. The disappearing entry happens after `handleCompleteEntry()` updates status and calls `refreshSupabaseBundle()`.

## Fix

R1I_R2 cleans R1G and adds Calendar completed retention:

- on `Zrobione`, retain the event/task row in workspace-scoped localStorage/in-memory cache;
- after refresh, merge retained completed rows if the refreshed bundle omits them;
- on `Przywróć`, release retention;
- preserve existing completed-last sorting and completed styling;
- add static guard and node test.

## Manual smoke required

Calendar -> Zrobione -> entry visible, crossed out, at bottom -> F5 -> still visible -> Przywróć -> F5 -> active.

## Risk audit

- Retention is an undo safety net for entries completed from Calendar in this browser.
- If backend/API bundle starts returning done/completed rows correctly, merge de-dupes by source ID and removes retention when the active restored row returns.
- Does not change SQL/RLS/Google/billing/finance/Today.
