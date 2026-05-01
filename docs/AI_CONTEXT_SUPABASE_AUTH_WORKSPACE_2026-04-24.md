# CloseFlow / leadflowv1 — obowiązujący kontekst Supabase, auth i workspace

**Data ustalenia:** 2026-04-24  
**Repo:** `dkknapikdamian-collab/leadflowv1`  
**Gałąź robocza:** `dev-rollout-freeze`  
**Status:** obowiązujące źródło prawdy dla kolejnych prac nad bazą, API i workspace.

---

## 1. Decyzja główna

Od tego miejsca zakładamy, że aplikacja działa docelowo na:

- **Supabase Auth** jako źródle użytkowników,
- **Supabase Postgres** jako źródle danych aplikacji,
- **jednym workspace na użytkownika** w V1,
- **bez Firebase jako aktywnego źródła prawdy**.

Stare pola typu `firebase_uid`, `auth_uid`, `external_auth_uid` mogą istnieć tylko jako pola kompatybilności / migracji. Nie wolno już projektować nowych przepływów na Firebase.

---

## 2. Zweryfikowany live schemat Supabase

Na podstawie diagnostyki wykonanej w Supabase SQL Editor ustalono:

```text
public.workspaces.owner_user_id -> auth.users.id ON DELETE CASCADE
```

To jest krytyczne.

### Obowiązujące tabele i pola

#### `auth.users`

Canonical auth user table.

Najważniejsze pole:

```text
auth.users.id uuid
```

To jest właściwe ID użytkownika.

#### `public.profiles`

Realny profil aplikacji.

Najważniejsze pola:

```text
user_id uuid NOT NULL
normalized_email text NOT NULL
email text
display_name text
workspace_id uuid
created_at timestamptz
updated_at timestamptz
timezone text
```

`public.profiles.user_id` mapuje się do `auth.users.id`.

#### `public.workspaces`

Realny workspace aplikacji.

Najważniejsze pola:

```text
id uuid
owner_user_id uuid NOT NULL
name text
created_at timestamptz
updated_at timestamptz
timezone text
plan_id text
subscription_status text
trial_ends_at timestamptz
```

`owner_user_id` musi wskazywać na istniejący rekord w `auth.users.id`.

#### `public.workspace_members`

Realne członkostwo użytkownika w workspace.

Najważniejsze pola:

```text
workspace_id uuid NOT NULL
user_id uuid NOT NULL
role text NOT NULL DEFAULT 'owner'
created_at timestamptz
```

`workspace_members.user_id` też mapuje się do `auth.users.id`.

---

## 3. Czego NIE wolno już zakładać

Nie wolno zakładać, że:

```text
public.users.id
```

jest właścicielem workspace.

Nie wolno tworzyć workspace z:

```text
owner_user_id = gen_random_uuid()
```

bo `owner_user_id` musi istnieć w `auth.users`.

Nie wolno traktować:

```text
profiles.id
```

jako głównego identyfikatora użytkownika, jeśli realny schemat ma:

```text
profiles.user_id
```

Nie wolno naprawiać tego przez losowe UUID-y. To łamie FK i tworzy martwe workspace.

---

## 4. Obowiązująca kolejność resolve workspace

Każdy endpoint API i helper frontu powinien iść w tej kolejności:

1. Pobierz aktualny `uid` z requestu / sesji.
2. Uznaj `uid` za `auth.users.id`.
3. Znajdź profil po:

```text
public.profiles.user_id = uid
```

4. Jeśli profil ma `workspace_id`, użyj go.
5. Jeśli profil nie ma `workspace_id`, sprawdź:

```text
public.workspace_members.user_id = uid
```

6. Jeśli nadal brak, sprawdź:

```text
public.workspaces.owner_user_id = uid
```

7. Jeśli user istnieje w `auth.users`, ale nie ma workspace:
   - utwórz workspace z `owner_user_id = uid`,
   - utwórz membership z `user_id = uid`,
   - zapisz `profiles.workspace_id`.

8. Jeśli user nie istnieje w `auth.users`, nie twórz workspace.

---

## 5. Bootstrap nowego użytkownika

Nowy użytkownik po logowaniu Supabase Auth powinien dostać:

1. rekord w `public.profiles` z:
   - `user_id = auth.users.id`,
   - `normalized_email`,
   - `email`,
   - `display_name`,
   - `workspace_id`.

2. rekord w `public.workspaces` z:
   - `owner_user_id = auth.users.id`,
   - `name`,
   - `plan_id = trial_14d`,
   - `subscription_status = trial_active`,
   - `trial_ends_at`,
   - `timezone = Europe/Warsaw`.

3. rekord w `public.workspace_members` z:
   - `workspace_id`,
   - `user_id = auth.users.id`,
   - `role = owner`.

---

## 6. SQL w repo

Wszystkie SQL-e mają być trzymane w repo w:

```text
supabase/sql/
```

Aktywne SQL-e produkcyjne mają mieć nazwę z datą i jasnym opisem.

Nieudane iteracje mogą zostać w:

```text
supabase/sql/archive_failed_iterations/
```

ale muszą być oznaczone jako archiwalne i nie wolno ich odpalać bez przepisania.

---

## 7. Aktualny aktywny repair SQL

Aktualny repair oparty o prawdziwy schemat to:

```text
supabase/sql/2026-04-24_workspace_context_repair_v11_auth_users_schema_safe_casts.sql
```

Ten SQL zakłada:

```text
public.workspaces.owner_user_id -> auth.users.id
public.profiles.user_id
public.workspace_members.user_id
```

i nie używa `public.users` jako źródła właściciela workspace.

---

## 8. Reguła dla AI / kolejnych modeli

Jeżeli kolejny model AI pracuje nad repo, ma zacząć od tego pliku.

Nie wolno mu zgadywać schematu workspace. Obowiązuje:

```text
auth.users.id
profiles.user_id
profiles.workspace_id
workspaces.owner_user_id
workspace_members.user_id
```

Jeśli kod w API nadal używa `profiles.id`, `public.users` albo tekstowego `workspace_members.user_id`, to jest to legacy do wyczyszczenia, a nie nowy kierunek.

---

## 9. Kolejny techniczny etap po tym pliku

Następny etap wdrożeniowy:

```text
Utwardzić /api/me, resolver workspace i useWorkspace pod realny schemat auth.users/profiles.user_id/workspace_members.user_id.
```

Zakres następnego etapu:

- `api/me.ts`
- `api/_supabase.ts`
- `api/_request-scope.ts`, jeśli istnieje lokalnie
- `src/hooks/useWorkspace.ts`
- `src/lib/supabase-fallback.ts`

Cel: usunąć chaos fallbacków i oprzeć workspace context na prawdziwym schemacie.


> `public.users is not` the workspace owner source. Właścicielem workspace jest `auth.users.id`, a nie `public.users.id`.
