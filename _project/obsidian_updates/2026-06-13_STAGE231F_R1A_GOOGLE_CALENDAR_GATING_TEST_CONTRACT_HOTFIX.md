# STAGE231F_R1A_GOOGLE_CALENDAR_GATING_TEST_CONTRACT_HOTFIX â€” Obsidian payload

- data i godzina: 2026-06-13 Europe/Warsaw
- typ wpisu: guard/test hotfix
- etap: STAGE231F_R1A
- status: local-only package, push only after PASS
- opis: `test:google-calendar-gating` was still expecting the older exact 409 body. STAGE231F_R1 adds `reason: app_not_configured`, so the test was updated to verify the expanded contract instead of blocking a valid response.
- testy: run gating test, STAGE231F_R1 guard/test, sync contract, build and git diff --check.
- ryzyko: no runtime change.
- czego nie ruszano: Google Calendar runtime, plans, trial, SQL, UI layout.