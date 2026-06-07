# 2026-06-07 - Stage227F5 Lead Top Strip No-Scroll Case Row run report

Status: local repair prepared after F5R3 guard quote failure.

Checks expected:
- F5 guard/test,
- F4 compatibility guard/test,
- F3 regression guard/test,
- C2 regression guard/test,
- build,
- git diff --check.

Risk audit:
- Manual deploy check still required for browser scroll state.
- Check old URLs with #lead-actions are cleaned on entry.
- Check CaseDetail remains unchanged visually.
