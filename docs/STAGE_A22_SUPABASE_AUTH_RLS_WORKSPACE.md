# A22 - Supabase Auth + RLS + workspace

## Cel

Zbudować fundament prywatnych danych dla CloseFlow:

- Supabase Auth jako docelowy auth,
- `profiles`,
- `workspaces`,
- `workspace_members`,
- RLS na danych biznesowych,
- bootstrap workspace po pierwszym loginie.

## Zakres wdrożenia

A22 dodaje migrację:

- `supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql`

Migracja jest idempotentna i robi:

1. tworzy lub naprawia tabele `profiles`, `workspaces`, `workspace_members`,
2. dodaje indeksy i check constraints,
3. dodaje funkcje pomocnicze RLS:
   - `closeflow_is_admin()`,
   - `closeflow_is_workspace_member(target_workspace_id text)`,
   - `closeflow_touch_updated_at()`,
   - `closeflow_bootstrap_user()`,
4. dodaje trigger na `auth.users`,
5. włącza RLS na core tabelach,
6. włącza RLS na istniejących tabelach biznesowych z kolumną `workspace_id`.

## V1 product rule

W V1 obowiązuje model:

- jeden użytkownik,
- jeden workspace,
- `workspace_members` istnieje technicznie pod przyszłość,
- nie wdrażamy team collaboration.

## Ważne ograniczenie

Serwerowe API CloseFlow nadal używa service role do komunikacji z Supabase i musi egzekwować auth/workspace po stronie backendu. RLS jest warstwą bezpieczeństwa dla Supabase i przyszłego bezpośredniego dostępu klienta, ale nie zastępuje backendowego sprawdzania JWT i workspace.

## Ręczne kroki Supabase

Po commicie i pushu trzeba uruchomić migrację w Supabase.

Opcja SQL Editor:

1. Otwórz Supabase Dashboard.
2. Wejdź w SQL Editor.
3. Wklej treść pliku:
   `supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql`
4. Uruchom.

Opcja CLI, jeśli projekt Supabase jest podpięty lokalnie:

```powershell
supabase db push
```

## Sprawdzenie ręczne

1. Wyloguj się i zaloguj nowym użytkownikiem.
2. Sprawdź, czy powstał rekord w `profiles`.
3. Sprawdź, czy powstał rekord w `workspaces`.
4. Sprawdź, czy powstał rekord w `workspace_members` z rolą `owner`.
5. W API bez JWT oczekuj `401`.
6. User A nie powinien zobaczyć danych workspace Usera B.
7. Podanie cudzego `workspaceId` z klienta nie może dać dostępu do cudzych danych.

## Nie zmieniono

- Nie dodano team collaboration w UI.
- Nie usunięto Firebase dependency, bo część kodu nadal używa legacy kompatybilności.
- Nie zmieniono notatek głosowych.
- Nie zmieniono flow lead -> klient -> sprawa.
- Nie zmieniono UI.

## Kryterium zakończenia

Supabase ma fundament multi-user SaaS: Auth, profile, workspace, membership i RLS.
