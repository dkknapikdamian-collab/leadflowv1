# P9 — Usunięcie legacy plaintext portal token handler

## Cel

W repo ma zostać tylko portal token hash flow.

## Co zmieniono

- Usunięto stary blok `handleClientPortalTokens` z `api/system.ts`.
- Usunięto legacy generowanie i zapis plaintext pola `token` w starym handlerze.
- Aktywny flow portalu zostaje w:
  - `api/portal.ts`,
  - `src/server/portal-tokens-handler.ts`,
  - `src/server/_portal-token.ts`.
- Dodano guard `check:p9-portal-plaintext-legacy-removed`.

## Czego nie zmieniono

- Nie zmieniono `api/portal.ts`.
- Nie zmieniono `vercel.json`.
- Nie zmieniono UX portalu.
- Nie zmieniono długości tokenów.

## Kryterium

Jedyny portal flow to:

1. plain token widoczny tylko przy tworzeniu linku,
2. zapis w bazie jako `token_hash`,
3. walidacja przez hash,
4. dalszy dostęp przez HMAC portal session.
