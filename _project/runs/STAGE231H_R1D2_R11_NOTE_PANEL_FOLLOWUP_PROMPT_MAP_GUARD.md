# STAGE231H_R1D2_R11_NOTE_PANEL_FOLLOWUP_PROMPT_MAP_GUARD

Data: 2026-06-14 23:59 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Cel

Naprawić mapę notatek w CaseDetail po manualnym teście R10C:
- panel Notatki sprawy ma pokazywać do 5 ostatnich notatek,
- pełna treść ma być dostępna po hover przez `title`,
- szybka akcja Notatka ma otwierać ten sam follow-up prompt co notatka głosowa,
- follow-up po notatce ma w karcie działania pokazywać treść/preview notatki, nie tylko stały opis.

## Zakres runtime

- `src/pages/CaseDetail.tsx`
- `src/components/ContextNoteDialog.tsx`

## Guardy/testy

- `scripts/check-stage231h-r1d2-r11-note-panel-followup-prompt-map-guard.cjs`
- `tests/stage231h-r1d2-r11-note-panel-followup-prompt-map-guard.test.cjs`

## Ryzyka

- Preview notatki dla follow-upu po odświeżeniu zależy od eventu `case_note_follow_up_added` i payload `notePreview`; dlatego R11 wzmacnia mapowanie z activities do tasków.
- Szybka notatka i notatka z panelu używają wspólnego hosta ContextActionDialogs; R11 dopina prompt follow-upu w CaseDetail na event `closeflow:context-action-saved`.
