# Supabase SQL — CloseFlow / leadflowv1

Ten folder jest repozytoryjnym źródłem prawdy dla SQL uruchamianych ręcznie w Supabase SQL Editor.

## Stan potwierdzony 2026-04-24

Live Supabase działa na Supabase Auth jako źródle użytkownika.

```text
public.workspaces.owner_user_id -> auth.users.id
public.profiles.user_id -> auth.users.id
public.workspace_members.user_id -> auth.users.id
```

Nie używać już założenia:

```text
public.workspaces.owner_user_id -> public.users.id
```

To była błędna ścieżka z wcześniejszych iteracji naprawczych.

## Aktywny plik repair

- `2026-04-24_workspace_context_repair_v11_auth_users_schema_safe_casts.sql`

To jest aktualny repair pod realny schemat:

- nie tworzy sztucznych użytkowników,
- nie używa `public.users` jako ownera workspace,
- opiera workspace wyłącznie o prawdziwe `auth.users.id`,
- dopina `profiles.workspace_id`,
- dopina `workspace_members`,
- uzupełnia brakujące kolumny workspace/billing/digest,
- kończy diagnostyką.

## Diagnostyka

- `2026-04-24_live_schema_probe.sql`

Ten plik jest read-only. Służy do sprawdzenia live schematu i constraintów.

## Archiwum błędnych iteracji

Folder `archive_failed_iterations/` zawiera wcześniejsze podejścia, które są zostawione tylko jako historia problemu.

Nie odpalać ich w Supabase.

## Zasada dla kolejnych AI/koderów

Jeżeli zmieniasz SQL albo API workspace/auth, najpierw przeczytaj:

- `docs/ARCHITEKTURA_SUPABASE_AUTH_WORKSPACE_2026-04-24.md`
- ten plik README
- aktualny repair SQL v11

Dla tej aplikacji jedno źródło prawdy to:

```text
auth.users -> profiles.user_id -> workspace_members.user_id -> workspaces.owner_user_id
```
