# STAGE231E2_R6_R2_GUARD_COMPAT_AFTER_R5 â€” Obsidian payload

- data i godzina: 2026-06-13 Europe/Warsaw
- typ wpisu: guard compatibility / trial 14d
- status: local-only package, push only after PASS
- opis: R5 centralized trial bootstrap through PLAN_IDS.trial and TRIAL_MS. Older R2 guard expected literal trial_14d and explicit 14-day milliseconds, so it failed despite the stronger central contract.
- testy: run the R5/R4/R2/R3 guard chain, build and git diff --check.
- ryzyko: none in runtime; guard-only patch.
- czego nie ruszano: runtime trial logic, SQL, Google Calendar, Billing runtime, Stripe.