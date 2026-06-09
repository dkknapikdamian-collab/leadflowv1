
# STAGE231D_GOOGLE_AUTH_INTENT_GATE run report

Status: LOCAL_ONLY_PACKAGE_PREPARED / DO_TEST_AND_PUSH

Scan-first source facts:
- src/pages/Login.tsx had one shared handleGoogleLogin for both login and register Google buttons.
- api/me owns application profile/workspace bootstrap after STAGE231C no-op SQL repair.
- App routes showed PublicLanding for logged-out / and /start before this stage.

Implementation:
- Added auth intent storage helper.
- Added Google intent to OAuth start.
- Added x-closeflow-auth-intent header.
- Added api/me REGISTER_FIRST_REQUIRED gate.
- Added App signout/notice handling.
- Added one auth entry for logged-out / and /start.

No commit. No push.

## STAGE231D_R5_GOOGLE_LOGIN_MISSING_INTENT_HARD_GATE

Status: LOCAL_ONLY_PACKAGE_PREPARED / DO_TEST_AND_PUSH

Manual QA input:
- Existing Google login works.
- Unknown Google login still entered app after R4.
- Google register works.
- Email/password confirmation works.
- One auth page works.

R5 action:
- Hardened intent persistence and server gate.
- Missing intent no longer allows Google OAuth to create a new app profile.
