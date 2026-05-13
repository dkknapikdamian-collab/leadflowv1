# CloseFlow - Lead Detail feedback P1 Repair4 - 2026-05-13

## Cel

Repair3 zakladal konkretna klase aside.lead-detail-right-rail, ktorej nie ma juz w aktualnym LeadDetail.tsx.

Repair4 uzywa wielu bezpiecznych anchorow i nie robi falszywego commita, jesli nie znajdzie miejsca wstawienia.

## Zasada

- przywrocic bezpieczny LeadAiFollowupDraft,
- nadal blokowac LeadAiNextAction / centrum pracy AI,
- guard sprawdza JSX, nie stare markery tekstowe,
- historia kontaktu zostaje pod wspolnym formatterem activity-timeline.

## Weryfikacja

- npm.cmd run check:lead-detail-feedback-p1
- npm.cmd run test:lead-detail-feedback-p1
- node --test tests/ai-followup-draft.test.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet