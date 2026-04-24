# CloseFlow Supabase contract next pack — 2026-04-24

## Co zawiera paczka

Ta paczka dopisuje do repo lokalne i repozytoryjne źródło prawdy dla Supabase/Auth/Workspace oraz pierwszy mały fix resolvera workspace.

Dodawane / nadpisywane pliki:

```text
docs/SUPABASE_SCHEMA_SOURCE_OF_TRUTH_2026-04-24.md
docs/AI_HANDOFF_SUPABASE_CLOSEFLOW_2026-04-24.md
src/lib/supabase-schema-contract.ts
supabase/sql/README.md
supabase/sql/2026-04-24_live_schema_auth_workspace_probe.sql
supabase/sql/2026-04-24_workspace_context_repair_v11_auth_users_schema_safe_casts.sql
api/_request-scope.js
```

## Kierunek

Potwierdzony live schema:

```text
workspaces.owner_user_id -> auth.users.id
profiles.user_id -> auth.users.id
workspace_members.user_id -> auth.users.id
```

Nie używać już założenia `public.users` jako właściciela workspace.

## Co zmienia patch

- zapisuje kierunek Supabase/Auth/Workspace w dokumentacji,
- zapisuje kontrakt schematu w kodzie,
- dodaje aktywny SQL v11 pod realny schemat,
- poprawia `api/_request-scope.js`, żeby najpierw szukał workspace po `profiles.user_id`, `workspace_members.user_id` i `workspaces.owner_user_id`, a dopiero potem po legacy polach.

## Po wdrożeniu

Uruchom:

```powershell
npm.cmd run build
```

Jeśli build lokalny jest ciężki, minimum test ręczny:

1. login,
2. odświeżenie aplikacji,
3. dodanie leada,
4. dodanie taska,
5. dodanie wydarzenia,
6. sprawdzenie Dziś / Leady / Kalendarz.
```
