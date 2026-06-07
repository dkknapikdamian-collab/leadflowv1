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
## F5R7 — build/guard hotfix
- data i godzina: 2026-06-07 16:45 Europe/Warsaw
- naprawiono: BOM w package.json blokujący build
- naprawiono: F3 guard oczekiwał starego selektora .case-detail-card-page-header zamiast aktualnego .case-detail-header
- zakres: guard/build hotfix, bez zmian SQL/Supabase/runtime danych
- wymagane testy: F5/F4/F3/C2/build/diff-check