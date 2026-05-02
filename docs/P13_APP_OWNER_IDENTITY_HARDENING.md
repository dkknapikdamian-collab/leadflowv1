# P13 — App owner identity hardening

## Cel

Pełny dostęp właściciela/developera aplikacji ma być produkcyjny, stabilny i oddzielony od roli admina workspace.

## Decyzja

Kolejność rozpoznawania app ownera:

1. tabela Supabase `public.app_owners`,
2. UID z env:
   - `CLOSEFLOW_APP_OWNER_UIDS`,
   - `CLOSEFLOW_SERVER_APP_OWNER_UIDS`,
3. email z env jako fallback:
   - `CLOSEFLOW_SERVER_ADMIN_EMAILS`,
   - `CLOSEFLOW_ADMIN_EMAILS`.

## Dlaczego UID i tabela

Email może się zmienić. Rola `admin` może w przyszłości oznaczać admina workspace/grupy. App owner to osobna warstwa systemowa.

## Co wdrożono

- `api/me.ts` sprawdza `app_owners`, UID env i email fallback.
- `api/me.ts` zwraca:
  - `isAppOwner`,
  - `appRole`,
  - `appOwnerSource`.
- Dodano migrację:
  - `supabase/migrations/20260502_p13_app_owners.sql`,
  - `sql/p13_app_owners.sql`.
- RLS dla `app_owners` blokuje dostęp klienta. Tabela jest czytana backendowo przez service role.
- Dodano guard `check:p13-app-owner-identity-hardening`.

## Produkcyjne ustawienie

Preferowane:

```text
CLOSEFLOW_APP_OWNER_UIDS=twoj_supabase_auth_uid
```

Fallback:

```text
CLOSEFLOW_SERVER_ADMIN_EMAILS=twoj@email.pl
```

## SQL grant

```sql
insert into public.app_owners (auth_uid, email, role, status, note)
values ('YOUR_SUPABASE_AUTH_UID', 'you@example.com', 'owner', 'active', 'initial app owner')
on conflict do nothing;
```

## Test

1. UID właściciela jest w `app_owners` albo `CLOSEFLOW_APP_OWNER_UIDS`.
2. Konto ma pełny dostęp mimo planu Pro.
3. Konto z `role=admin`, ale bez wpisu ownera, nie dostaje pełnego override.
4. Po revoke w `app_owners` pełny dostęp znika po odświeżeniu sesji.


## P13B finish

P13 expanded app owner identity from email-only to production identity:

1. Supabase table `app_owners`.
2. UID env `CLOSEFLOW_APP_OWNER_UIDS` / `CLOSEFLOW_SERVER_APP_OWNER_UIDS`.
3. Email env only as fallback.

P13B updates the previous P12C guard so it validates the new production identity model instead of the old email-only expectation.
