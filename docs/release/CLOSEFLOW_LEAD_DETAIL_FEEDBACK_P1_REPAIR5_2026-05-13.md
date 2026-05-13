# CloseFlow - Lead Detail feedback P1 Repair5 - 2026-05-13

## Cel

Naprawa po Repair4, ktory zrobil commit mimo czerwonego builda.

## Co bylo zepsute

- LeadAiFollowupDraft byl wstawiony bez wrappera tuz przed aside w ternary JSX.
- Test P1 mial niepoprawny regex z nieescapowana sciezka ../lib/activity-timeline.
- Skrypt PowerShell nie sprawdzal jawnie exit code po npm/build.

## Co naprawiono

- LeadAiFollowupDraft przeniesiony jako pierwsze dziecko aside.lead-detail-right-rail.
- Test regex zastapiony bezpiecznym includes().
- Ten skrypt uzywa RunStep i przerywa przed commitem, jesli jakikolwiek check/build/verify zwroci blad.

## Weryfikacja

- npm.cmd run check:lead-detail-feedback-p1
- npm.cmd run test:lead-detail-feedback-p1
- node --test tests/ai-followup-draft.test.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet