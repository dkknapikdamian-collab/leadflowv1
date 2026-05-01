# A19 — Admin bez hardcoded emaila

## Cel

Admin nie wynika z hardcoded e-maila w kodzie frontendu ani z podmienialnych danych request body.

Docelowy model:

- główne źródło prawdy: `profiles.role = 'admin'` w Supabase,
- backend zwraca `profile.isAdmin` przez `/api/me`,
- frontend tylko pokazuje lub ukrywa narzędzia admina na podstawie odpowiedzi backendu,
- endpointy admin-only sprawdzają rolę po stronie serwera.

## Zakres wdrożenia

- `src/lib/admin.ts`
  - usunięty client-side allowlist e-maili,
  - dodany bezpieczny helper profilu,
  - stara funkcja `isAdminEmail` zostaje tylko jako kompatybilny no-op zwracający `false`.

- `src/hooks/useWorkspace.ts`
  - admin nie jest liczony z e-maila,
  - admin jest liczony z `profile.role === 'admin'` albo `profile.isAdmin === true`.

- `api/me.ts`
  - brak hardcoded admin e-maila,
  - `isAdmin` powstaje z Supabase `profiles.role` / `profiles.is_admin`,
  - opcjonalny bootstrap może użyć tylko server-only env `CLOSEFLOW_SERVER_ADMIN_EMAILS`.

- `src/server/_request-scope.ts`
  - dodany `requireAdminAuthContext(req)`,
  - endpointy admin-only mogą używać jednej serwerowej bramki.

- `api/system.ts`
  - usunięty `adminSecret` z query/body,
  - workspace recovery używa serwerowego sprawdzenia roli admina.

- `src/server/ai-config.ts`
  - diagnostyka AI używa `requireAdminAuthContext(req)`,
  - nie bazuje na e-mailu w kodzie.

- `supabase/migrations/2026-05-01_stageA19_admin_role_policy.sql`
  - zapewnia kolumnę `profiles.role`,
  - stabilizuje legacy `is_admin`,
  - porządkuje wartości roli.

## Ręczne sprawdzenie

1. Zwykły użytkownik z `profiles.role = 'member'` nie widzi narzędzi admina.
2. Podmiana e-maila w request body nic nie daje.
3. Użytkownik z `profiles.role = 'admin'` wchodzi do paneli admin.
4. Endpoint `/api/system?kind=ai-config` zwraca dane tylko adminowi.
5. Nie ma `VITE_*` zmiennej nadającej admina.

## Uwaga

`CLOSEFLOW_SERVER_ADMIN_EMAILS` jest opcjonalnym serwerowym bootstrapem, nie client-side źródłem prawdy. Preferowane ustawienie produkcyjne to nadanie roli w Supabase:

```sql
update public.profiles
set role = 'admin', is_admin = true
where email = 'adres-admina@example.com';
```
