# 10_ZIPY_WDROZENIA_PUSH

## 2026-06-24 HH:mm Europe/Warsaw — STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT

ZIP/local package: STAGE_A35B_MANDATORY_NEXT_STEP_CONTRACT_REPAIR_R2_2026_06_24.zip
Push: wykonany po guard/test/build/verify i po sciezce owner-smoke-ok.
Commit runtime: 3a1bd164 fix(closeflow): enforce mandatory next step owner control contract.

## 2026-06-24 21:30 Europe/Warsaw — STAGE-A35B_CLOSEOUT_STATUS_SYNC_R2

Status: PASS_PUSHED / CLOSED / MANUAL_SMOKE_OK
Zakres: docs/status sync only po nieudanym lokalnym PowerShell closeout R1.
Commits docs-only:
- 0e76c511 docs(closeflow): close a35b mandatory next step status
- 22d4ad85 docs(closeflow): close a35b obsidian payload status

Granice: bez runtime, bez SQL, bez finansow, bez billing, bez Google Calendar, bez AI Drafts, bez DudekHome, bez .tmp.driveupload.

## 2026-06-24 23:30 Europe/Warsaw â€” STAGE232G_R1I_R3_CALENDAR_DELETE_RELEASES_COMPLETED_RETENTION
- Status: APPLIED_LOCAL_PENDING_GUARDS_AND_OWNER_SMOKE.
- Zakres: Calendar delete must release completed retention so a deleted completed event/task is not resurrected after refresh.
- Testy: R1I guard/test, CF runtime, build, verify quiet, diff-check, owner smoke.

## 2026-06-25 12:20 Europe/Warsaw â€” STAGE232G_R2_GOOGLE_INBOUND_SYNC_IDEMPOTENCY

Status: APPLIED_LOCAL_PENDING_GUARDS_AND_OWNER_SMOKE.
ZIP/local package: STAGE232G_R2_GOOGLE_INBOUND_SYNC_IDEMPOTENCY_V4_2026_06_25.zip.
Push: do wykonania po PASS guard/test/build/verify/diff-check i smoke.

## 2026-06-25 13:40 Europe/Warsaw â€” STAGE232G_R3_GOOGLE_CALENDAR_USER_ONBOARDING_AND_OWNER_STAMP

ZIP/local package: STAGE232G_R3_GOOGLE_CALENDAR_USER_ONBOARDING_OWNER_STAMP_V4_2026_06_25.zip.
Status: APPLIED_LOCAL_PENDING_FULL_GATE_AND_OWNER_SMOKE.
Push: dopiero po PASS guard/test/build/verify/diff-check.

## 2026-06-25 13:35 Europe/Warsaw â€” STAGE232G_R4_GOOGLE_CALENDAR_OUTBOUND_TIMEZONE_NO_SHIFT

ZIP/local package: STAGE232G_R4_GOOGLE_CALENDAR_OUTBOUND_TIMEZONE_NO_SHIFT_2026_06_25.zip.
Status: APPLIED_LOCAL_PENDING_FULL_GATE_AND_OWNER_SMOKE.
Push: dopiero po PASS guard/test/build/verify/diff-check.

## 2026-06-25 14:10 Europe/Warsaw â€” STAGE232G_R6_GOOGLE_DELETE_TOMBSTONE_AND_REMOTE_DELETE

ZIP/local package: STAGE232G_R6_GOOGLE_DELETE_TOMBSTONE_GUARD_2026_06_25.zip.
Status: APPLIED_LOCAL_PENDING_FULL_GATE_AND_OWNER_SMOKE.
Push: dopiero po PASS guard/test/build/verify/diff-check.

## 2026-06-25 16:45 Europe/Warsaw â€” STAGE232G_R7A_CALENDAR_ACTION_SOURCE_IDENTITY_DEDUPE

ZIP/local package: STAGE232G_R7A_CALENDAR_ACTION_SOURCE_IDENTITY_DEDUPE_2026_06_25.zip.
