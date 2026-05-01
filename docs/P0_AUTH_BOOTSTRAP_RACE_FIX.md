# P0 — Auth bootstrap race fix

## Problem

Zakładka **Dziś** potrafiła ładować dane losowo: czasem dopiero po przeklikaniu innych zakładek.

Przyczyną był wyścig startowy po wejściu do aplikacji lub po OAuth redirect:

- `useWorkspace()` korzysta z lekkiego snapshotu auth klienta,
- `useSupabaseSession()` zna prawdziwą sesję Supabase,
- snapshot auth nie był synchronizowany od razu z sesją Supabase,
- pierwsze requesty Today mogły ruszyć bez gotowego tokena/workspace.

## Zmiana

- `useSupabaseSession()` synchronizuje `closeflow:client-auth-snapshot` natychmiast po odczycie sesji i przy każdej zmianie sesji.
- `getSupabaseAccessToken()` krótko czeka na hydrację tokena Supabase przed pierwszym requestem API.

## Czego nie zmieniono

- Nie zmieniono UI.
- Nie zmieniono bramek dostępu.
- Nie wyłączono 401/403.
- Nie zmieniono modelu danych.

## Weryfikacja

- `npm.cmd run check:p0-auth-bootstrap-race`
- `npm.cmd run check:p0-today-loader-supabase-api`
- `npm.cmd run check:polish-mojibake`
- `npm.cmd run test:critical`
