# CloseFlow Phase 0 runtime API workspace headers fix

## Cel

Naprawa runtime po zielonych gate'ach, gdzie produkcja zwracala 401/500 dla /api/cases, /api/leads, /api/tasks, /api/events i /api/system?kind=ai-drafts.

## Przyczyna

Frontend wysylal glownie Authorization, ale nie dosylal stalego kontekstu workspace i snapshotu uzytkownika do endpointow GET. Endpointy serwerowe wymagaly workspace_id do filtrowania danych. Bez niego zwracaly AUTH_WORKSPACE_REQUIRED albo wpadaly w blad handlera.

## Zmiana

- callApi dolacza x-user-id, x-firebase-uid, x-auth-uid, x-user-email, x-user-full-name.
- callApi dolacza x-workspace-id oraz x-closeflow-workspace-id, gdy workspace jest zapisany lokalnie.
- cache GET jest rozdzielony per workspace.
- fetchMeFromSupabase przekazuje snapshot logowania do bootstrapu workspace.
- resolveRequestWorkspaceId czyta oba naglowki workspace, body, query i dopiero potem probuje kontekst Supabase.

## Po wdrozeniu sprawdz

1. Zaloguj sie na closeflowapp.vercel.app.
2. Otworz Today, Leads, Cases, Tasks, Calendar i AI drafts.
3. W DevTools Network sprawdz, czy /api/leads, /api/cases, /api/tasks, /api/events i /api/system?kind=ai-drafts nie zwracaja 401/500.
4. Odswiez strone i sprawdz, czy dane zostaja.
