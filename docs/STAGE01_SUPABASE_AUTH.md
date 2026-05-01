# ETAP 01 — Supabase Auth jako docelowe logowanie

## Status

Ten etap przenosi docelowy model logowania z Firebase Auth na Supabase Auth.

Wdrożenie kodowe nie zastępuje konfiguracji w panelu Supabase. Bez konfiguracji OAuth i zmiennych środowiskowych logowanie nie zadziała produkcyjnie.

## Co zostało zmienione w kodzie

- Dodano `src/lib/supabase-auth.ts` jako klienta Supabase Auth po stronie frontu.
- Dodano `src/hooks/useSupabaseSession.ts` jako zamiennik `useFirebaseSession`.
- `App.tsx` używa Supabase Auth jako źródła sesji.
- `Login.tsx` wykonuje logowanie przez Supabase Auth:
  - Google OAuth,
  - e-mail + hasło,
  - rejestracja,
  - reset hasła.
- `src/lib/supabase-fallback.ts` wysyła do API:

```http
Authorization: Bearer <supabase_access_token>
```

- Front nie wysyła już jako docelowego modelu:
  - `x-user-id`,
  - `x-user-email`,
  - `x-user-name`,
  - `x-workspace-id`.
- Dodano `src/server/_supabase-auth.ts` do weryfikacji JWT po stronie backendu.
- `src/server/_request-scope.ts` ustala workspace z tokenu Supabase i bazy, nie z nagłówków frontu.
- `api/me.ts` ustala użytkownika z Supabase JWT.
- Dodano migrację SQL pod profile/workspace/workspace_members.

## Co musisz zrobić w Supabase

1. Wejdź w Supabase → Authentication → Providers.
2. Włącz Google OAuth.
3. Wklej Google Client ID i Client Secret.
4. Ustaw redirect URL lokalny:

```text
http://localhost:3000
http://localhost:3000/**
```

5. Ustaw redirect URL produkcji:

```text
https://TWOJA-DOMENA
https://TWOJA-DOMENA/**
```

6. W Authentication → URL Configuration ustaw Site URL produkcji.
7. Dodaj domenę aplikacji do allowed redirect URLs.

## Zmienne środowiskowe lokalnie

W `.env.local`:

```env
VITE_SUPABASE_URL=https://twoj-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=twoj_anon_key
SUPABASE_URL=https://twoj-projekt.supabase.co
SUPABASE_ANON_KEY=twoj_anon_key
SUPABASE_SERVICE_ROLE_KEY=twoj_service_role_key
```

## Zmienne środowiskowe w Vercel

Dodaj:

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

`VITE_SUPABASE_ANON_KEY` nie jest sekretem prywatnym. `SUPABASE_SERVICE_ROLE_KEY` jest sekretem serwerowym i nigdy nie może mieć prefiksu `VITE_`.

## Migracja SQL

Plik:

```text
supabase/migrations/2026-05-01_stage01_supabase_auth_identity.sql
```

Odpal w Supabase SQL Editor albo przez CLI.

### Supabase SQL Editor

1. Otwórz Supabase → SQL Editor.
2. Wklej zawartość migracji.
3. Uruchom.

### Supabase CLI

```powershell
supabase db push
```

## Rollback / cofnięcie

Zmiana kodowa:

```powershell
git revert <SHA_TEGO_COMMITA>
```

Migracja SQL jest addytywna. Bezpieczne cofnięcie polega na:

1. wyłączeniu triggera `on_auth_user_created_closeflow`,
2. zostawieniu danych profili/workspace, jeśli mogły powstać konta,
3. ewentualnym ręcznym usunięciu dodanych indeksów/funkcji dopiero po upewnieniu się, że nie są używane.

Minimalne wyłączenie triggera:

```sql
drop trigger if exists on_auth_user_created_closeflow on auth.users;
```

## Test ręczny

1. Otwórz aplikację lokalnie.
2. Wejdź na `/login`.
3. Zaloguj się przez Google Supabase.
4. Po redirect wróć do aplikacji.
5. Odśwież stronę.
6. Sesja ma zostać.
7. Wyloguj się.
8. Sesja ma zniknąć.
9. Otwórz devtools → Network.
10. Requesty do `/api/*` mają mieć:

```http
Authorization: Bearer ...
```

11. Wywołanie API bez tokenu ma zwrócić `401`.
12. Próba podstawienia cudzego `workspaceId` w body/header nie może zmienić workspace.

## Kryterium zakończenia

Aplikacja używa Supabase Auth jako docelowego modelu logowania, a backend nie ufa nagłówkom identyfikującym użytkownika lub workspace z frontu.
