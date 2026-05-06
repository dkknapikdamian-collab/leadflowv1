# STAGE16V - AI global search order repair - 2026-05-06

Cel: domknąć ostatni czerwony test `ai-assistant-global-app-search.test.cjs` po Stage16U.

Zakres:
- `src/server/ai-assistant.ts`
- uporządkowanie statycznego kontraktu kolejności:
  1. `if (wantsFunnelValue(query))`
  2. `if (wantsLookup(query))`
  3. `return buildGlobalAppSearchAnswer(context, rawText);`

Nie zmienia:
- danych,
- billing,
- Google Calendar,
- final direct-write AI,
- push/commit.

Po wdrożeniu:
- `npm.cmd run build`
- `node --test tests/ai-assistant-global-app-search.test.cjs`
- `npm.cmd run verify:closeflow:quiet`
- `npm.cmd run test:critical`
- opcjonalnie focused collector, jeśli jest dostępny.
