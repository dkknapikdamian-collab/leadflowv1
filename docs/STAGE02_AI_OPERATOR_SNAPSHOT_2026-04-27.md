# Stage 02 — AI Application Operator Snapshot

Cel: asystent ma mieć prawdziwy snapshot aplikacji, ale bez dokładania nowych funkcji Vercel i bez automatycznego zapisu.

Wdrożenie:

- rozbudowuje `src/server/assistant-context.ts`,
- używa istniejącej trasy `/api/system?kind=assistant-context`,
- zwraca leady, klientów, sprawy, zadania, wydarzenia i szkice AI,
- dodaje `summary`, `relations`, `searchIndex` i `operatorSnapshot`,
- przekazuje snapshot do `TodayAiAssistant`,
- dopina wyszukiwanie szkiców AI do serwerowego asystenta regułowego.

Zasada bezpieczeństwa:

- bez komendy zapisu asystent tylko czyta,
- z komendą zapisu tworzy szkic,
- finalne rekordy są obsługiwane dopiero w Stage 03.
