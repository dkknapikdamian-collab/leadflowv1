# CloseFlow Phase 0 — lead write access gate final

Cel: domknąć ostatni czerwony release guard po poprawkach request identity i Vercel typecheck.

Zakres:
- przywrócony jawny paid/trial/free access contract w `src/server/_access-gate.ts`,
- zachowany marker `isPastDate(nextBillingAt)` wymagany przez `tests/lead-write-access-gate.test.cjs`,
- zachowane eksporty `assertWorkspaceAiAllowed` oraz `assertWorkspaceEntityLimit`, których używają API/server handlery,
- utrzymana kompatybilność request-scope dla handlerów Vercel.

Nie zmieniać:
- gałęzi roboczej `dev-rollout-freeze`,
- modelu: AI zapisuje szkice, nie finalne rekordy bez zatwierdzenia,
- Supabase-first runtime.

Manualny smoke po deployu:
1. Zaloguj się.
2. Sprawdź Today, Leads, Tasks, Calendar, Clients, Cases.
3. Dodaj leada i zadanie.
4. Odśwież stronę i sprawdź, czy dane zostają.
5. Sprawdź konsolę: brak 500 dla `/api/leads`, `/api/tasks`, `/api/events`, `/api/system?kind=ai-drafts`.
