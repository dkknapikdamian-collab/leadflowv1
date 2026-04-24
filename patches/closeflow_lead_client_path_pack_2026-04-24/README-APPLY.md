# CloseFlow — Lead ↔ Klient ↔ Sprawa path pack

## Cel

Domknąć praktyczną ścieżkę:

- lead tworzony w aplikacji zawsze ma `client_id`,
- klient pokazuje swoje leady i sprawy przez API filtrowane po `clientId`,
- sprawa może być filtrowana po `clientId` i `leadId`,
- ekran klienta nie musi już pobierać wszystkich leadów/spraw i filtrować ich dopiero w przeglądarce.

## Pliki zmieniane

- `api/leads.ts`
- `api/cases.ts`
- `src/lib/supabase-fallback.ts`
- `src/pages/ClientDetail.tsx`
- `docs/LEAD_CLIENT_CASE_PATH_2026-04-24.md`
- `tests/lead-client-path-contract.test.cjs`

## Testy

Po zastosowaniu paczki uruchom:

```powershell
npm.cmd run build
node --test tests/lead-client-path-contract.test.cjs
```
