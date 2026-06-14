# STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON

- data: 2026-06-14 19:40 Europe/Warsaw
- project: CloseFlow / LeadFlow
- status: LOCAL_PACKAGE_PREPARED / DO_TEST_AND_PUSH / SERVER_UI_REQUIRED
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze

## Cel

Naprawić lukę po R1D2: pierwszy przycisk dyktowania w panelu działań został przywrócony, ale drugi widoczny przycisk w panelu `Notatki sprawy` nadal był disabled i pokazywał `Notatka głosowa — wkrótce`.

## Zakres

- `src/pages/CaseDetail.tsx`
- `scripts/check-stage231h-r1d2-r4-notes-panel-dictation-button.cjs`
- `tests/stage231h-r1d2-r4-notes-panel-dictation-button.test.cjs`
- centralne pliki `_project`
- Obsidian payload

## Nie ruszano

- SQL
- Google Calendar
- billing/trial
- AI Drafts
- R1E koszt zwrócony
- LeadDetail runtime

## Testy

- R1G2 guard/test
- R1D2 guard/test
- R1D2 R4 guard/test
- `npm run build`
- `git diff --check`

## Manual UI

Po pushu/deployu trzeba sprawdzić, że przycisk w panelu `Notatki sprawy` ma tekst `Dyktuj notatkę`, nie jest disabled i zapisuje notatkę po dyktowaniu oraz około 2 sekundach ciszy.
