# STAGE226-R6 — Leads UI Wiring Hotfix

Data: 2026-06-05 20:20 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## FAKTY

- R6 dopina brakujące UI Stage226 w src/pages/Leads.tsx.
- Poprzednie R2/R3/R4/R5 nie zamknęły etapu, bo patchery albo nie trafiały w anchor, albo kończyły bez realnego diffu.
- R6 używa stabilnych anchorów strukturalnych i sprawdza tokeny po zapisie.

## TESTY WYMAGANE

- node scripts/check-stage226-lost-lead-rescue.cjs
- node --test tests/stage226-lost-lead-rescue.test.cjs
- node --test tests/stage225-contact-cadence-grid.test.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
- git status --short

## AUDYT RYZYK

- Ryzyko fałszywego PASS z poprzednich runnerów: R6 przerywa, jeśli Leads.tsx nie ma wymaganych tokenów.
- Ryzyko przypadkowych zmian poza zakresem: R6 dotyka tylko src/pages/Leads.tsx i raportu R6.
- Ryzyko udawania backendu: akcje Ustaw zadanie/Odłóż/Oznacz jako martwy są disabled.

Generated at: 2026-06-05T18:16:42.198Z
