
# Obsidian update — STAGE231D_GOOGLE_AUTH_INTENT_GATE

Update central CloseFlow auth/workflow notes with:
- STAGE231C SQL decision: auth.users trigger functions are no-op; api/me bootstraps profile/workspace.
- STAGE231D decision: Google Login requires existing CloseFlow profile; Google Register may create trial/workspace.
- Future stage STAGE231E_EMAIL_COPY_REPAIR.
- Future stage STAGE231F_INVITE_ONLY_TEST_MODE.
- Manual QA checklist for Google login/register and email/password confirmation.

## STAGE231D_R5_GOOGLE_LOGIN_MISSING_INTENT_HARD_GATE

Update Obsidian CloseFlow auth notes:
- R4 manual QA found Google Login unknown account still entering app.
- R5 hardens the rule: Google OAuth can bootstrap missing profile/workspace only with authIntent=register.
- Existing Google login, Google register, e-mail/password confirmation, and one auth page remain preserved.
- Warn that previously auto-created test Google profiles count as registered unless cleaned manually.
