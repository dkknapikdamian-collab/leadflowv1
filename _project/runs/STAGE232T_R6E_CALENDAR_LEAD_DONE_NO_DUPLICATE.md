# STAGE232T_R6E_CALENDAR_LEAD_DONE_NO_DUPLICATE

Status:
IMPLEMENTED / VERIFY_REQUIRED / PROD_SMOKE_REQUIRED

Bug:
- After clicking "Zrobione" on a lead calendar action, Calendar could show two rows:
  - completed/zrobione
  - still planned/zaplanowane
- Root cause: visible entries were merged from lead shadow + completed shadow/durable task without a final dedupe pass.

Fix:
- Adds a final dedupe pass after relation enrichment.
- Dedupe key: lead id + start minute + title.
- Completed entry wins over active planned duplicate.
- Completed durable task wins over completed shadow when both exist.
- Applies to both month scheduleEntries and week weekEntries.

Manual smoke:
1. Calendar -> lead action.
2. Click Zrobione.
3. Only one completed row should remain.
4. F5 / CTRL+F5.
5. The row should not duplicate.
