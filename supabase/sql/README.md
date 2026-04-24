# Supabase SQL — CloseFlow / leadflowv1

Ten folder jest repozytoryjnym źródłem prawdy dla SQL uruchamianych ręcznie w Supabase SQL Editor.

## Aktualne pliki

- `2026-04-24_live_schema_probe.sql`  
  Diagnostyka read-only live schematu Supabase. Nie zmienia danych.

- `2026-04-24_workspace_context_repair_v5_fk_safe.sql`  
  Naprawa kontekstu workspace po przejściu Firebase -> Supabase. Wersja FK-safe:
  - nie wstawia losowego `owner_user_id` do `workspaces`,
  - najpierw dopina `public.users`,
  - dopiero potem naprawia `profiles.workspace_id` i `workspace_members`.

## Ważne

W live bazie istnieje constraint:

```text
workspaces.owner_user_id -> public.users.id
```

Dlatego skrypty repair muszą zawsze naprawiać `public.users` przed tworzeniem lub uzupełnianiem `workspaces`.
