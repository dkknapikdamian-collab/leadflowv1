# Nieudane iteracje workspace repair — 2026-04-24

Ten folder dokumentuje błędne założenia, które wyszły podczas naprawy live bazy.

## Błędne założenie 1

Zakładano:

```text
public.workspaces.owner_user_id -> public.users.id
```

To było błędne.

Live baza ma:

```text
public.workspaces.owner_user_id -> auth.users.id ON DELETE CASCADE
```

## Błędne założenie 2

Zakładano, że `public.profiles` ma główne pole:

```text
profiles.id
```

Live baza ma:

```text
profiles.user_id uuid NOT NULL
```

## Błąd 23503

Powtarzający się błąd:

```text
insert or update on table "workspaces" violates foreign key constraint "workspaces_owner_user_id_fkey"
Key (owner_user_id)=... is not present in table "users".
```

Realne znaczenie:

- `users` w komunikacie PostgreSQL odnosiło się do targetu `auth.users`,
- nie do `public.users`,
- tworzenie rekordów w `public.users` nie mogło naprawić FK.

## Wniosek

Aktywne naprawy muszą używać tylko realnego `auth.users.id` jako `owner_user_id`.
