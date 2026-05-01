# CloseFlow - Supabase Auth, RLS i workspace

## Decyzja

CloseFlow używa Supabase jako docelowego źródła prawdy dla prywatnych danych użytkownika i workspace.

## Model V1

- Jeden użytkownik ma jeden workspace.
- `profiles` przechowuje profil użytkownika i rolę.
- `workspaces` przechowuje workspace oraz stan planu/dostępu.
- `workspace_members` jest warstwą techniczną pod przyszłe zespoły, ale V1 nie uruchamia team collaboration.

## Tabele core

### `profiles`

Najważniejsze pola:

- `id`,
- `auth_user_id`,
- `email`,
- `full_name`,
- `workspace_id`,
- `role`,
- `is_admin`.

### `workspaces`

Najważniejsze pola:

- `id`,
- `owner_user_id`,
- `name`,
- `plan_id`,
- `subscription_status`,
- `trial_ends_at`.

### `workspace_members`

Najważniejsze pola:

- `workspace_id`,
- `user_id`,
- `role`.

## Bootstrap po pierwszym loginie

Trigger `closeflow_bootstrap_user_after_auth_insert` na `auth.users` tworzy:

1. workspace,
2. profil,
3. członkostwo ownera w `workspace_members`.

## RLS

RLS jest włączone na:

- `profiles`,
- `workspaces`,
- `workspace_members`,
- istniejących tabelach biznesowych z kolumną `workspace_id`.

Reguła dostępu: użytkownik widzi i zapisuje tylko dane workspace, którego jest członkiem, właścicielem albo adminem.

## Backend API

API musi wymagać Supabase JWT. Brak tokena oznacza `401`.

Frontend nie jest źródłem prawdy dla:

- `workspaceId`,
- `userId`,
- `email`,
- `role`,
- admina.

## Firebase

Firebase nie jest docelowym auth ani docelowym storage/danymi biznesowymi. Może zostać w repo tylko jako legacy kompatybilność do czasu pełnego wygaszenia.
