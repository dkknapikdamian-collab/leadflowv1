# 2026-06-25_STAGE232G_R2_GOOGLE_INBOUND_SYNC_IDEMPOTENCY

canonical_name: CloseFlow / LeadFlow
stage: STAGE232G_R2_GOOGLE_INBOUND_SYNC_IDEMPOTENCY
status: APPLIED_LOCAL_PENDING_GUARDS_AND_OWNER_SMOKE

## Streszczenie

Naprawa idempotencji Google inbound sync. Ten sam Google Calendar event nie moĹĽe powodowaÄ‡ duplicate-key 500 na idx_work_items_google_calendar_source_external.

## Granice

Nie ruszano Calendar retention R1I/R3, Owner Control, A35B, finansĂłw, billing, AI Drafts, SQL/RLS/migrations.

## Testy

Do wpisania po wykonaniu.
