# Obsidian update — STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON

- data: 2026-06-14 19:40 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- status: DO_APPLY
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze

## Aktualizacja do centralnych notatek

Dopisać, że R1D2 wymagał hotfixa R4, ponieważ drugi widoczny przycisk w panelu `Notatki sprawy` nadal był disabled i wyświetlał `Notatka głosowa — wkrótce`. R4 przepina go na ten sam handler SpeechRecognition/autosave co przycisk w panelu działań.

## Testy

- R1G2 regression guard/test
- R1D2 guard/test
- R1D2 R4 guard/test
- build
- manualny test dyktowania po deployu

## Ryzyka

- deploy/cache może nadal pokazywać stary bundle do czasu przebudowy albo hard refreshu.
- Web Speech API zależy od przeglądarki i zgody mikrofonu.
