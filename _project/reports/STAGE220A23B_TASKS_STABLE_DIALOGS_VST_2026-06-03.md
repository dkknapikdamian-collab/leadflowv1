# STAGE220A23B - TasksStable dialogs VST - 2026-06-03

## Cel

Poprawić aktywny ekran zadań widoczny w produkcji:
- usunąć natywny confirm z usuwania zadania,
- przepiąć modal Edytuj zadanie na jasny VST,
- przepiąć modal Ustaw kolejny krok na jasny VST,
- usunąć zielony motyw CTA z tych modalów.

## Zmienione pliki

- src/pages/TasksStable.tsx
- src/styles/closeflow-visual-source-truth.css
- docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md
- scripts/check-stage220a23b-tasks-stable-dialogs-vst.cjs
- package.json

## Nie ruszano

- Supabase
- SQL
- RLS
- API
- routing
- schema danych

## Testy

- node scripts/check-stage220a23b-tasks-stable-dialogs-vst.cjs
- npm run build
