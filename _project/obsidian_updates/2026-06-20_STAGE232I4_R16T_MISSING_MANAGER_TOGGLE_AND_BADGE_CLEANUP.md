# Obsidian update payload — STAGE232I4_R16T

Date/time: 2026-06-20 Europe/Warsaw
Project: CloseFlow / LeadFlow
Stage: STAGE232I4_R16T_MISSING_MANAGER_TOGGLE_AND_BADGE_CLEANUP

## Summary
R16S_R2 improved layout but smoke found two issues: visible `Klient`/`Blokuje` badges are unnecessary and checkbox toggle fails with `existing is not defined`. R16T removes the visible badges and fixes the ClientDetail missing-item blocker toggle by using a full normalized task patch.

## Tests to record
- R16T guard PASS/PENDING
- R16T node tests PASS/PENDING
- npm run build PASS/PENDING
- git diff --check PASS/PENDING
- manual smoke PASS/PENDING

## Risk
Shared manager affects client and lead missing-item views. Client toggle fix affects ClientDetail only.
