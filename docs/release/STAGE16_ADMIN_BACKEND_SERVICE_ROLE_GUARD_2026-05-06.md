# STAGE16 — Admin backend guard + service-role scoped mutation guard

## Cel
Domknąć pozostałą część bezpieczeństwa po Stage15: admin routes mają być chronione backendowo, a service-role mutation helpers mają mieć osobną warstwę guardów przeciw niescopowanym zapisom danych biznesowych.

## Zakres
- `src/server/ai-config.ts`
- `src/pages/AdminAiSettings.tsx`
- `src/server/_supabase.ts`
- główne endpointy biznesowe:
  - `api/leads.ts`
  - `api/clients.ts`
  - `api/cases.ts`
  - `api/activities.ts`
  - `api/work-items.ts`
- nowe guardy i testy:
  - `scripts/check-admin-backend-guard.cjs`
  - `scripts/check-service-role-scoped-mutations.cjs`
  - `tests/admin-backend-guard.test.cjs`
  - `tests/service-role-scoped-mutations.test.cjs`

## Zasada
Frontend może ukrywać admin UI, ale decyzja o dostępie musi być na backendzie. Service role omija RLS, więc endpointy workspace-owned muszą używać resolvera workspace i scoped mutation helpers.

## Po wdrożeniu
Uruchomić:

```powershell
npm.cmd run check:admin-backend-guard
npm.cmd run check:service-role-scoped-mutations
npm.cmd run test:admin-backend-guard
npm.cmd run test:service-role-scoped-mutations
npm.cmd run build
```

## Kryterium zakończenia
Admin diagnostics nie są dostępne bez backend admin auth, a główne endpointy biznesowe nie mają prostych niescopowanych `updateById/deleteById` dla danych workspace-owned.
