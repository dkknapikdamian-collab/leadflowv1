# 2026-06-24 23:30 Europe/Warsaw â€” STAGE232G_R1I_R3_CALENDAR_DELETE_RELEASES_COMPLETED_RETENTION

canonical_name: CloseFlow / LeadFlow
stage: STAGE232G_R1I_R3_CALENDAR_DELETE_RELEASES_COMPLETED_RETENTION
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local_path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
obsidian_folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

APPLIED_LOCAL_PENDING_GUARDS_AND_OWNER_SMOKE

## Smoke finding

Completed event deleted from Calendar stayed visible because local completed-retention cache resurrected it after refresh. Backend delete looked successful because later restore/update returned 404.

## Fix

Delete flow now releases completed retention for event/task after successful backend delete.

## Tests

Required before close:
- guard PASS,
- node test PASS,
- CF runtime source truth PASS,
- build PASS,
- verify:closeflow:quiet PASS,
- diff-check PASS,
- owner smoke: completed event/task delete no longer returns after F5.

## Not touched

Owner Control, A35B, LeadDetail, ClientDetail, CaseDetail, finance, billing, Google OAuth/sync, SQL/RLS/migrations, AI Drafts, DudekHome, .tmp.driveupload.

## Separate risk

Google inbound sync duplicate key 500 is separate and should be fixed later as idempotent upsert/ignore-on-conflict for (workspace_id, source_provider, source_external_id).
