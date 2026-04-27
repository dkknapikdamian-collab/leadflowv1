# Zakres patcha

Ten ZIP jest poprawką wdrożeniową, nie pełnym klonem repo. Powód: w środowisku wykonania nie było dostępu sieciowego do klonowania GitHuba, więc paczka zawiera skrypt patchujący aktualne lokalne repo użytkownika.

## Pliki dotykane przez skrypt

- `api/ai-drafts.ts` — nowy endpoint szkiców AI.
- `api/assistant-context.ts` — nowy endpoint snapshotu danych aplikacji dla asystenta.
- `src/lib/ai-drafts.ts` — Supabase + local fallback.
- `src/lib/supabase-fallback.ts` — funkcje API dla szkiców i kontekstu asystenta.
- `src/lib/ai-assistant.ts` — typ kontekstu rozszerzony o `drafts`.
- `src/lib/ai-usage-guard.ts` — flaga `VITE_AI_USAGE_UNLIMITED=true`.
- `src/components/GlobalAiAssistant.tsx` — pobieranie pełniejszego kontekstu z backendu.
- `src/components/TodayAiAssistant.tsx` — czyszczenie starej treści przy starcie dyktowania i przekazanie drafts.
- `src/pages/AiDrafts.tsx` — async Supabase dla listy szkiców.
- `src/pages/Today.tsx` — top kafelki jako realne skróty do sekcji.

## Ryzyko

Największe ryzyko to istniejące różnice schematu Supabase, szczególnie nazwa tabeli zadań/wydarzeń (`work_items`). Endpoint assistant-context używa obecnego kierunku repo. Jeśli u Ciebie zadania/events są w osobnych tabelach, trzeba dopisać fallback w `api/assistant-context.ts`.
