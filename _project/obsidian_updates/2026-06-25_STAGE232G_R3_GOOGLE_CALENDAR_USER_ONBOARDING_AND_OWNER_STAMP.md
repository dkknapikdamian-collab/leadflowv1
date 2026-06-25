# 2026-06-25_STAGE232G_R3_GOOGLE_CALENDAR_USER_ONBOARDING_AND_OWNER_STAMP

canonical_name: CloseFlow / LeadFlow
stage: STAGE232G_R3_GOOGLE_CALENDAR_USER_ONBOARDING_AND_OWNER_STAMP
status: APPLIED_LOCAL_PENDING_FULL_GATE_AND_OWNER_SMOKE

## Zakres runtime

- Settings: disconnected user gets `Polacz Google Calendar` CTA block.
- Settings: connected user sees account label and `Rozlacz`.
- Existing sync button remains in this safety patch.
- Task/Event POST: created_by_user_id is stamped from verified request identity.
- Outbound sync remains user-scoped and fail-closed.
- Calendar OAuth remains consent-based and separate from Supabase Google auth login/register.

## Testy

Required:
- node scripts/check-stage232g-r3-google-calendar-user-onboarding-owner-stamp.cjs
- node --test tests/stage232g-r3-google-calendar-user-onboarding-owner-stamp.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

## Manual smoke

1. Account without Google Calendar connection.
2. Settings -> Integracje shows `Polacz Google Calendar`.
3. Click opens Google consent.
4. Callback returns and shows connected Google account.
5. Create new task/event.
6. `Synchronizuj teraz` pushes the new item to that user's Google Calendar.
7. Repeat sync does not duplicate.
8. Disconnect blocks sync but app still works.

## Ryzyka

- Do not use workspace fallback token for ordinary users.
- Do not silently connect Calendar from Google login token.
- Do not touch SQL/RLS in this stage.
