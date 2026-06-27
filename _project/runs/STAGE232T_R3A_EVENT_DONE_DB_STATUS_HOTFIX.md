# STAGE232T_R3A_EVENT_DONE_DB_STATUS_HOTFIX

Status:
HOTFIX_PUSHED / SOURCE_GUARDED / PROD_RETEST_REQUIRED

Production symptom:
- Marking a newly created Calendar event as done returned HTTP 500 from `PATCH /api/events`.
- UI showed: `Nie udało się zapisać wydarzenia. Spróbuj ponownie.`

Root cause:
- Calendar UI used `status: completed` for completed events.
- The event status domain uses `done`, not `completed`.
- The event route previously wrote the incoming status directly during PATCH.

Fix:
- `src/server/event-route-stage124f.ts` now normalizes event status aliases before write.
- completed/complete/finished/closed/zrobione/wykonane map to `done`.
- cancelled maps to `canceled`.
- open/todo/pending map to `scheduled`.
- PATCH and POST both use the normalizer.

Guard/test:
- `tests/stage232t-r3a-event-completed-alias.test.cjs` verifies the event route has the alias normalizer and does not write raw `body.status` directly.

Out of scope:
- SQL/RLS
- billing/finance/commission
- Obsidian
- CSS/UI hiding

Required production retest after deploy:
1. Create event in Calendar.
2. Click `Zrobione`.
3. Verify no 500 on `PATCH /api/events`.
4. Verify event becomes struck/completed in UI.
5. Refresh.
6. Verify no active duplicate appears.
7. Click restore.
8. Verify same event returns active.
9. Delete and hard refresh.
