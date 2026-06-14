# STAGE231G R8 - R7 guard/test syntax and EOF hotfix

Data: 2026-06-14 Europe/Warsaw

## FAKTY

- R7 runtime patch completed and build passed.
- R7 guard/test failed because regex literals were generated with broken `[sS]` and a line break.
- `git diff --check` failed on trailing blank line at EOF in `src/styles/visual-stage14-lead-detail-vnext.css`.

## ZMIANY

- Rewrote R7 guard/test as ASCII-only checks without brittle regex literals.
- Trimmed CSS EOF whitespace.
- No runtime feature change beyond already-applied R7 patch.

## AUDYT RYZYK

- Manual UI test still required to confirm Supabase persistence and visual alignment in real browser.
- Working tree still contains unrelated 231D0D/E/F/H changes; commit must remain selective.