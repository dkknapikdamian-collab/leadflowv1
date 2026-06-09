# Stage228R53 - LeadDetail savedRecord no-flicker guard repair

Date: 2026-06-09 09:45 Europe/Warsaw

## Summary

R53 continues the partially applied R50/R51/R52 no-flicker work item stage. The failing guard required a literal savedRecord token in LeadDetail, while the runtime patch did not yet consume the saved record locally. This stage adds the real LeadDetail savedRecord handler.

## Changes

- LeadDetail consumes savedRecord from closeflow:context-action-saved.
- LeadDetail locally appends saved task/blocker/event records to linkedTasks/linkedEvents before silent refresh.
- TasksStable delete remains optimistic with rollback and without immediate refreshData after delete.
- ContextActionDialogs emits savedRecord in event detail.
- softDeleteTaskInSupabase emits scalar input.id for no-flicker delete.
- R50 guard rewritten to validate behavior markers instead of brittle formatting.

## Manual test

- CF_DEL_TEST_4 on lead card:
  - add missing item/task,
  - it appears without section flicker,
  - delete,
  - it disappears without section flicker,
  - hard refresh,
  - it does not return.

## Risk audit

- Silent refresh remains after local update to prevent stale data.
- If duplicated rows appear, dedupeById is the first line of defense.
- If a saved record lacks leadId, the handler allows local insert because context-action-saved is already scoped by recordType/recordId.
- Calendar baseline was not changed.
