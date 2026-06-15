# STAGE231H_R1D2_R15C_NOTE_FOLLOWUP_BIDIRECTIONAL_LINK_AND_WORK_ROW_TITLE

Data: 2026-06-15 15:10 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Problem
- Follow-up po notatce mógł zostać w działaniach po skasowaniu notatki, bo helper kasowania notatki nie używał mapy aktywności taskId/notePreview.
- Kasowanie follow-upu z działań nie mówiło, że jest przypięty do notatki.
- Karta działania miała złą hierarchię: "Follow-up po notatce" jako tytuł, a treść notatki pod spodem.

## Zmiana
- Treść notatki jest tytułem karty działania, a "Follow-up po notatce" jest pod spodem.
- Helper kasowania notatki używa task payload oraz activity map case_note_follow_up_added -> taskId/notePreview.
- Kasowanie follow-upu z działań pokazuje komunikat, że notatka zostanie w panelu.

## Testy
- R11, R12G, R13B, R14F, R15C guards.
- R15C node test.
- npm run build.
- git diff --check.

## Ryzyka
- Historyczne rekordy bez taskId/noteId mogą nadal zależeć od fallbacku po notePreview.
- Do testu manualnego: świeża notatka + follow-up, kasowanie notatki razem z follow-upem, kasowanie follow-upu z działań.
