# CloseFlow - Lead Detail feedback P1 Repair7 - 2026-05-13

## Cel

Repair6 zatrzymal sie na verify:closeflow:quiet, bo stary test ai-next-action-create-task nadal wymagal renderu LeadAiNextAction w LeadDetail.

## Decyzja

Nie przywracamy LeadAiNextAction do LeadDetail, bo to cofneloby feedback P1 o usunieciu halasliwego AI/wsparcia/centrum pracy leada.

## Nowy kontrakt

- LeadAiNextAction nadal istnieje jako komponent i jego logika tworzenia zadania po kliknieciu pozostaje testowana.
- LeadDetail nie renderuje LeadAiNextAction po P1.
- LeadDetail zachowuje bezpieczny LeadAiFollowupDraft draft-only.
- verify:closeflow:quiet dalej uruchamia tests/ai-next-action-create-task.test.cjs, ale test jest dopasowany do nowej decyzji UI.

## Weryfikacja

- npm.cmd run check:lead-detail-feedback-p1
- npm.cmd run test:lead-detail-feedback-p1
- node --test tests/ai-followup-draft.test.cjs
- node --test tests/ai-next-action-create-task.test.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet