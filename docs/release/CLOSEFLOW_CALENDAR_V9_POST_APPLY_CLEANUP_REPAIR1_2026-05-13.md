# CLOSEFLOW_CALENDAR_V9_POST_APPLY_CLEANUP_REPAIR1_2026-05-13

Cleanup after selected-day calendar V9 massfix.

Scope:
- Remove obsolete tracked V4 calendar artifacts that were accidentally included in the V9 massfix commit.
- Remove known untracked failed calendar repair leftovers from V2/V4 attempts.
- Normalize package scripts so the active guard is V9 only.
- Keep the selected-day V9 tile runtime intact.

Do not change unrelated dirty local files from ClientDetail, visual preview, mobile trim, or other unfinished workstreams.
