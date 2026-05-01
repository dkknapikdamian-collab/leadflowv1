# A19 v2: Admin z Supabase i naprawa schematu profiles

## Cel

Admin nie może wynikać z hardcoded e-maila w kodzie frontendu ani z danych podanych przez klienta.

Docelowy model:

- `public.profiles.role = 'admin'`,
- opcjonalnie kompatybilnie `public.profiles.is_admin = true`,
- `/api/me` zwraca `profile.isAdmin` na podstawie danych z Supabase,
- frontend pokazuje admin UI tylko na podstawie odpowiedzi backendu.

## Naprawiony problem SQL

Błąd:

```text
ERROR: column "role" of relation "profiles" does not exist
```

oznacza, że tabela `profiles` nie miała jeszcze kolumny `role`.

Dodano migrację:

```text
supabase/migrations/2026-05-01_stageA19v2_admin_role_schema_repair.sql
```

## Ręczne ustawienie admina po migracji

Po uruchomieniu migracji można ustawić admina:

```sql
update public.profiles
set role = 'admin',
    is_admin = true
where lower(email) = lower('twoj-email@example.com');
```

## Czego nie wolno

- Nie dodawać admina przez hardcoded e-mail w `src/lib/admin.ts`.
- Nie ufać `email`, `isAdmin`, `role`, `adminSecret` z request body albo query.
- Nie dawać admin UI bez backendowego `/api/me`.

## Poprawka wizualna

Dodano CSS:

```text
src/styles/stageA19v2-sidebar-nav-contrast-fix.css
```

Naprawia białe, słabo widoczne przyciski w lewym menu po starcie aplikacji.
