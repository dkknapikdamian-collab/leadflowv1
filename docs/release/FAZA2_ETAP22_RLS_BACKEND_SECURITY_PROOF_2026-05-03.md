# FAZA 2 - Etap 2.2 - RLS / backend security proof

**Data:** 2026-05-03  
**Branch:** `dev-rollout-freeze`  
**Zakres:** RLS/backend security proof gate + SQL evidence query, bez zmian runtime aplikacji.

## Cel

Udowodnić, że izolacja workspace jest wymuszana nie tylko przez UI, ale także przez backend i Supabase RLS.

To jest P0 przed płatną wersją.

## Co już istnieje

Repo zawiera migrację:

```text
supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql
```

Ta migracja tworzy/naprawia:

```text
profiles
workspaces
workspace_members
```

oraz definiuje:

```text
public.closeflow_is_workspace_member(target_workspace_id text)
public.closeflow_is_admin()
```

i nakłada RLS na tabele biznesowe posiadające `workspace_id`.

## Co dodaje Etap 2.2

Ten etap dodaje:

1. static proof guard,
2. SQL evidence query do odpalenia w Supabase,
3. dokumentację, jak zebrać dowód,
4. test podpięty do `verify:closeflow:quiet`.

## Ważne ograniczenie

Ten etap nie udaje, że lokalny build sprawdził live Supabase.

Static guard mówi:

```text
Repo ma migrację, SQL proof i backendowe markery.
```

Dopiero ręczne odpalenie SQL w Supabase daje dowód live:

```text
RLS jest włączone w aktualnej bazie.
Polityki istnieją w aktualnej bazie.
Helpery istnieją w aktualnej bazie.
```

## SQL do Supabase

Plik:

```text
docs/sql/CLOSEFLOW_RLS_WORKSPACE_SECURITY_PROOF_2026-05-03.sql
```

Wklej go do Supabase SQL Editor i uruchom.

Wynik trzeba zapisać jako screenshot albo skopiowany wynik tabeli do release evidence.

## Tabele wymagane w proof

Core auth/workspace:

```text
profiles
workspaces
workspace_members
```

Business tables:

```text
leads
clients
cases
work_items
activities
ai_drafts
response_templates
case_items
payments
notifications
workspace_settings
client_portal_items
portal_items
portal_access_tokens
files
documents
```

Jeżeli tabela nie istnieje w danym środowisku, wynik SQL powinien pokazać `table_missing`. To nie musi blokować release, jeśli funkcja nie jest aktywna, ale musi być świadomie opisane w release evidence.

Jeżeli tabela istnieje i ma `workspace_id`, musi mieć:

```text
rls_enabled
rls_forced
workspace policies
```

## Backend proof

Etap 2.2 wymaga, żeby obecne helpery backendowe były widoczne:

```text
requireSupabaseRequestContext
resolveRequestWorkspaceId
requireScopedRow
fetchSingleScopedRow
withWorkspaceFilter
assertWorkspaceWriteAccess
```

oraz żeby `getRequestIdentity` nie ufało frontendowym identity headers/body/query.


## Evidence status marker

```text
manual_evidence_required
```

This marker means the repository has static RLS/backend proof and SQL evidence tooling, but live Supabase evidence must still be captured manually before final release sign-off.

## Manual evidence required

Przed finalnym release wymagane są:

```text
screen/log: wynik SQL proof z Supabase
screen/log: User B nie widzi danych User A
screen/log: bezpośredni URL do rekordu A nie działa dla User B
screen/log: zwykły user nie widzi admin-only route
screen/log: po reload workspace pozostaje poprawny
```

## Kryterium zakończenia Etapu 2.2

Etap 2.2 w repo jest zakończony, gdy:

- istnieje ten dokument,
- istnieje SQL proof,
- istnieje `scripts/check-faza2-etap22-rls-backend-security-proof.cjs`,
- istnieje `tests/faza2-etap22-rls-backend-security-proof.test.cjs`,
- `package.json` ma:
  - `check:faza2-etap22-rls-backend-security-proof`,
  - `test:faza2-etap22-rls-backend-security-proof`,
- `verify:closeflow:quiet` wymaga testu Etapu 2.2,
- przechodzi A22 guard,
- przechodzi P0 workspace scope guard,
- przechodzi build.

## Czego ten etap NIE robi

Ten etap nie dodaje nowej funkcji.

Ten etap nie uruchamia SQL automatycznie w Supabase.

Ten etap nie zastępuje manualnego testu dwóch kont.

## Następny etap

Po Etapie 2.2 przechodzimy do:

```text
FAZA 3 - Etap 3.1 - Jedno źródło prawdy dla planów
```

albo, jeśli SQL proof pokaże braki:

```text
FAZA 2 - Etap 2.2B - RLS hardening SQL fix
```
