# P0 — Supabase RLS/schema confirmation

## Cel

Potwierdzić, że projekt ma migrację, która naprawia i utrwala schemat Supabase wymagany przez aktualny kod oraz wymusza RLS jako drugą warstwę ochrony obok ręcznego scope w API.

## Co dodano

- `supabase/migrations/20260501194000_p0_supabase_rls_schema_confirmation.sql`
- `scripts/check-p0-supabase-rls-schema-confirmation.cjs`
- `npm run check:p0-supabase-rls-schema-confirmation`

## Tabele objęte potwierdzeniem

- `profiles`
- `workspaces`
- `workspace_members`
- `leads`
- `clients`
- `cases`
- `work_items`
- `activities`
- `ai_drafts`
- `response_templates`
- `case_templates`
- `case_items`
- `client_portal_tokens`
- `billing_events`

## Zasada

API dalej używa service role, więc RLS nie jest jedyną ochroną. RLS ma być drugą tarczą. Pierwszą tarczą zostaje:

- `resolveRequestWorkspaceId(req)`
- `assertWorkspaceWriteAccess(workspaceId, req)`
- `requireScopedRow(...)`
- `withWorkspaceFilter(...)`

## Fallbacki schema

Nie usuwamy schema fallbacków z API w tym etapie. Usunięcie fallbacków ma sens dopiero po zastosowaniu migracji na produkcyjnej bazie i po ręcznym teście user A / user B.

## Ręczny test po wdrożeniu migracji na Supabase

1. Zaloguj usera A.
2. Utwórz lead, klienta, sprawę i zadanie.
3. Zaloguj usera B.
4. Spróbuj podmienić `workspaceId`, `leadId`, `caseId`, `clientId` z usera A.
5. Oczekiwany wynik:
   - GET nie pokazuje cudzych danych,
   - POST nie zapisuje do cudzego workspace,
   - PATCH/DELETE nie dotyka cudzego rekordu,
   - API zwraca 401/403/404 zależnie od ścieżki.
