# CloseFlow Stage170 — Task Dialog Relation and Field Readability

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Obsidian folder: `10_PROJEKTY/CloseFlow_LeadFlow`

## Problem

After Stage169:
- topic/contact picker became readable,
- but normal task dialog fields still have weak/invisible text,
- global quick task modal is too tall because old event-form modal height rules leak into it,
- global task modal needs the same relation picker option as event modal.

## Facts from repo

`GlobalQuickActions.tsx` opens `TaskCreateDialog` directly for global `+ Zadanie`.  
`TaskCreateDialog.tsx` currently uses event form visual source but did not load relation options from leads/clients/cases.

## Decision

Stage170:
- adds `TopicContactPicker` to `TaskCreateDialog`,
- loads options from leads, cases and clients,
- saves `leadId`, `caseId`, `clientId` into the task payload,
- forces readable input/select/textarea text,
- resets inherited fixed height on the quick task dialog.

## Guard

`node scripts/check-stage170-task-dialog-relation-and-field-readability.cjs`
