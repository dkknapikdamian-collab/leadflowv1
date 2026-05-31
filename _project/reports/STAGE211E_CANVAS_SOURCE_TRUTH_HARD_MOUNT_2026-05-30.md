# Stage211E - Canvas source truth hard mount

## Cel
Ujednolicenie tla/canvasu we wszystkich zakladkach CloseFlow wedlug wzoru z / (Dzis).

## Fakt z diagnostyki
Stage211D przeszedl build, ale log pokazal: Imported files: 0 oraz Normalized CSS files: 0. Oznaczalo to, ze source truth nie zostal realnie podlaczony do kaskady stron.

## Zmiany
- Dodano: src/styles/closeflow-canvas-source-truth-stage211e.css
- Podpieto import globalny w src/index.css.
- Podpieto import po lokalnych CSS w stronach/operator route files, zeby wygrac z lazy CSS chunks.
- Canvas ustawiony tokenem --cf-canvas-bg: #f8fafc.
- Karty i panele nie byly przebudowywane.

## Touched files
- src/styles/closeflow-canvas-source-truth-stage211e.css
- src/index.css
- src/components/Layout.tsx
- src/pages/TodayStable.tsx
- src/pages/Today.tsx
- src/pages/Leads.tsx
- src/pages/Clients.tsx
- src/pages/Cases.tsx
- src/pages/TasksStable.tsx
- src/pages/Calendar.tsx
- src/pages/Templates.tsx
- src/pages/ResponseTemplates.tsx
- src/pages/Activity.tsx
- src/pages/AiDrafts.tsx
- src/pages/NotificationsCenter.tsx
- src/pages/Billing.tsx
- src/pages/SupportCenter.tsx
- src/pages/Settings.tsx
- src/pages/AdminAiSettings.tsx

## Testy
- node scripts/check-stage211e-canvas-source-truth-hard-mount.cjs
- npm run build

## Nie ruszano
Supabase, RLS, routing, formularze, listy, deployment, push.
