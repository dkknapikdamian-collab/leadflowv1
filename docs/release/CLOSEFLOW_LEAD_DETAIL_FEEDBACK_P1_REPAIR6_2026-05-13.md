# CloseFlow - Lead Detail feedback P1 Repair6 - 2026-05-13

## Cel

Repair5 prawidlowo zatrzymal commit przed czerwonym testem. Ten etap domyka pozostale bledy w tescie P1.

## Naprawiono

- pozostale niepoprawne regexy w tests/lead-detail-feedback-p1-2026-05-13.test.cjs,
- idempotentne ustawienie LeadAiFollowupDraft jako pierwszego dziecka aside.lead-detail-right-rail,
- sanity check: dokladnie jeden LeadAiFollowupDraft i zero LeadAiNextAction,
- commit dopiero po zielonym check, test, ai-followup test, build i verify.

## Weryfikacja

- npm.cmd run check:lead-detail-feedback-p1
- npm.cmd run test:lead-detail-feedback-p1
- node --test tests/ai-followup-draft.test.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet