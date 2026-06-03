# STAGE220A23 - Task dialogs VST - 2026-06-03

## Cel

Usunąć brzydkie natywne komunikaty przeglądarki z aktywnych flow zadań i zastąpić je produkcyjnymi modalami VST.

## Zmienione pliki

- src/pages/Tasks.tsx
- src/styles/closeflow-visual-source-truth.css
- docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md
- scripts/check-stage220a23-task-dialogs-vst.cjs
- package.json

## Co zmieniono

- Usunięto native window.confirm z usuwania zadania.
- Usunięto native window.prompt z flow kolejnego kroku po wykonaniu zadania.
- Dodano ConfirmDialog dla usuwania zadania.
- Dodano modal VST dla ustawiania kolejnego kroku.
- Selecty w modalach zadań dostały cf-vst-input.

## Nie ruszano

- Supabase
- SQL
- RLS
- API
- routing
- logika list
- schema danych

## Testy

- node scripts/check-stage220a23-task-dialogs-vst.cjs
- npm run build
