# STAGE212G Bulk UI Repair

## Cel

Masowa naprawa po Stage212B-F: import order, mojibake, sidebar active icon, runtime visual foundation i pierwsza warstwa canvasu.

## Fakty z audytu

- src/index.css miał importy po komentarzach/blokach, co łamało guard i Tailwind/Vite.
- Layout.tsx zawierał mojibake w aria-label mobilnej nawigacji.
- Today.tsx i TasksStable.tsx zawierały mojibake w tekstach widocznych UI.
- visual-stage01-shell.css ustawiał aktywną ikonę sidebaru jako biały kwadrat.
- Layout.tsx nadal miał legacy kolor shellu #f3f6fb.
- Stare Stage211/212 runtime'y nakładały się kaskadowo.

## Zmienione pliki

- src/index.css
- src/components/Layout.tsx
- src/components/VisualFoundationRuntimeStage212G.tsx
- src/styles/closeflow-visual-foundation-stage212g.css
- src/styles/visual-stage01-shell.css
- src/pages/Today.tsx
- src/pages/TasksStable.tsx
- scripts/check-stage212g-bulk-ui-repair.cjs

## Kolory source truth

- canvas: #f1f5f9
- surface: #ffffff
- surface soft: #f8fafc
- border: #e2e8f0

## Testy

- node scripts/check-stage212g-bulk-ui-repair.cjs
- npm run build, jeśli apply uruchomiono z -Build

## Czego nie ruszano

- Supabase
- RLS
- routing danych
- formularze
- deployment
- push

## Następny krok

Po build PASS uruchomić dev server, zrobić Ctrl+F5 i sprawdzić: /, /leads, /clients, /cases, /tasks, /calendar, /activity, /ai-drafts, /notifications, /billing, /help, /settings.
