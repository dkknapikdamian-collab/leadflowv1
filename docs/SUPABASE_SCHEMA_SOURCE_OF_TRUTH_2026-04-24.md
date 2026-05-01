# CloseFlow — Supabase schema source of truth

**Data:** 2026-04-24  
**Repo:** `dkknapikdamian-collab/leadflowv1`  
**Branch:** `dev-rollout-freeze`  
**Status:** obowiązujące źródło prawdy po naprawie workspace context.

## Decyzja główna

Projekt działa wyłącznie na **Supabase** jako źródle prawdy dla auth, workspace, profili, danych leadów, zadań, wydarzeń, spraw i billingu.

Nie używamy już Firebase jako źródła prawdy. Pola typu `firebase_uid`, `auth_uid`, `external_auth_uid` mogą istnieć tylko jako warstwa kompatybilności / historia migracji. Nowe wdrożenia nie mogą opierać logiki na Firebase.

## Potwierdzony live schema

### Auth

Źródłem tożsamości użytkownika jest:

```text
auth.users.id
```

To jest jedyny prawidłowy identyfikator użytkownika dla relacji workspace.

### Profiles

Potwierdzony model:

```text
public.profiles.user_id uuid NOT NULL
public.profiles.normalized_email text NOT NULL
public.profiles.email text NULL
public.profiles.display_name text NULL
public.profiles.auth_provider text NULL
public.profiles.created_at timestamptz NOT NULL default now()
public.profiles.updated_at timestamptz NOT NULL default now()
public.profiles.timezone text NOT NULL default 'Europe/Warsaw'
public.profiles.is_email_verified boolean NOT NULL default false
public.profiles.signup_source text NOT NULL default 'unknown'
```

Po naprawie do kompatybilności dodane jest też:

```text
public.profiles.workspace_id uuid NULL
```

### Workspaces

Potwierdzony model:

```text
public.workspaces.id uuid NOT NULL default gen_random_uuid()
public.workspaces.owner_user_id uuid NOT NULL
public.workspaces.name text NOT NULL default 'CloseFlow'
public.workspaces.created_at timestamptz NOT NULL default now()
public.workspaces.updated_at timestamptz NOT NULL default now()
public.workspaces.timezone text NULL default 'Europe/Warsaw'
```

Najważniejszy constraint:

```text
public.workspaces.owner_user_id -> auth.users.id ON DELETE CASCADE
```

To oznacza:

- nie wolno tworzyć sztucznego `owner_user_id`,
- nie wolno podpinać `owner_user_id` do `public.users`,
- workspace może wskazywać tylko realny rekord z `auth.users`.

### Workspace members

Potwierdzony model:

```text
public.workspace_members.workspace_id uuid NOT NULL
public.workspace_members.user_id uuid NOT NULL
public.workspace_members.role text NOT NULL default 'owner'
public.workspace_members.created_at timestamptz NOT NULL default now()
```

`workspace_members.user_id` musi być tym samym typem identity co `auth.users.id`.

## Wynik walidacji po naprawie

Ostatnia diagnostyka po SQL repair pokazała:

```text
auth_users: 3
profiles: 3
profiles_with_auth_user: 3
workspace_members: 3
workspaces: 3
profiles.without_workspace_id: 0
profiles.without_matching_auth_user: 0
profiles.orphan_workspace_reference: 0
workspaces.owner_user_without_auth_user: 0
```

Ten stan oznacza, że auth/profile/workspace/membership są spięte poprawnie.

## Twarde zasady dla kolejnych AI / agentów kodujących

### Wolno

- używać `auth.users.id` jako identyfikatora użytkownika,
- używać `profiles.user_id` jako profilu użytkownika,
- używać `profiles.workspace_id` jako szybkiego kontekstu workspace,
- używać `workspace_members` do walidacji członkostwa,
- filtrować dane biznesowe po `workspace_id`,
- robić dodatki SQL jako addytywne migracje, bez kasowania danych.

### Nie wolno

- zakładać, że `profiles.id` istnieje,
- zakładać, że `public.users` jest źródłem prawdy,
- tworzyć sztucznych userów w `public.users`,
- wstawiać losowego UUID do `workspaces.owner_user_id`,
- zmieniać FK `workspaces.owner_user_id`,
- wracać do Firebase jako SoT,
- rozwiązywać workspace przez „pierwszy workspace w bazie”, poza wyraźnym trybem diagnostycznym/adminowym,
- maskować błędów schematu przez kolejne fallbacki bez dopisania SQL/migracji.

## Docelowy flow identyfikacji requestu

1. Frontend ma znać usera z Supabase Auth.
2. Backend/API dostaje `user_id` z sesji albo z kontrolowanego nagłówka/testowego kontekstu.
3. API znajduje profil:

```sql
select *
from public.profiles
where user_id = :auth_user_id
limit 1;
```

4. API znajduje workspace:

```sql
select workspace_id
from public.profiles
where user_id = :auth_user_id;
```

5. Jeżeli profil nie ma `workspace_id`, API może użyć membership:

```sql
select workspace_id
from public.workspace_members
where user_id = :auth_user_id
limit 1;
```

6. Dane biznesowe są zawsze filtrowane po:

```text
workspace_id
```

## Kontrakt dla endpointów

Każdy endpoint zapisujący lub odczytujący dane użytkownika musi znać:

```text
authUserId
workspaceId
```

Minimalny kontekst requestu:

```ts
type RequestWorkspaceContext = {
  authUserId: string;
  workspaceId: string;
  role: 'owner' | 'admin' | 'member';
};
```

## RLS / bezpieczeństwo

Docelowe polityki RLS mają być oparte o:

```sql
exists (
  select 1
  from public.workspace_members wm
  where wm.workspace_id = <table>.workspace_id
    and wm.user_id = auth.uid()
)
```

Dla V1 obowiązuje założenie:

```text
jeden użytkownik = jeden workspace
```

ale struktura może już przewidywać `workspace_members`, żeby nie przepisywać wszystkiego później.

## Kolejny etap techniczny

Po tej decyzji następny sensowny etap to:

1. uszczelnić `/api/me`,
2. uszczelnić resolver workspace,
3. ograniczyć fallbacki w `api/_supabase.ts`,
4. uporządkować `useWorkspace`,
5. zostawić tylko kontrolowaną kompatybilność legacy,
6. nie zmieniać UI w tym samym etapie.

## Aktywny SQL naprawczy

Aktywny SQL do naprawy / kontroli schematu:

```text
supabase/sql/2026-04-24_workspace_context_repair_v11_auth_users_schema_safe_casts.sql
```

Nie uruchamiać starych iteracji z `archive_failed_iterations` bez świadomej decyzji.
