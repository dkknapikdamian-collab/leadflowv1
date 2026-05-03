# Admin AI role gate consistency hotfix v4 - 2026-05-03

## Problem

Ekran Admin AI wpuszczal uzytkownika jako admina, ale endpoint:

`/api/system?kind=ai-config`

zwracal:

`ADMIN_ROLE_REQUIRED`

## Przyczyna

Frontend sprawdza admina przez `useWorkspace()`:

- `profile.role === admin`
- albo `profile.isAdmin === true`

Backend `requireAdminAuthContext()` sprawdzal glownie:

- admin email z ENV
- Supabase app metadata role

Brakowalo spojnego sprawdzenia tabeli `profiles`.

## Naprawa

Backend admin gate akceptuje teraz rowniez profil admina z tabeli `profiles`, ale tylko po zweryfikowanym Supabase context.

To wazne: admin-only API nie moze opierac uprawnien na samym naglowku `x-user-email`, bo ten naglowek bylby podmienialny przez klienta.

Akceptowane role/flagi:

- `profiles.role = admin`
- `profiles.role = owner`
- `profiles.is_admin = true`
- `profiles.app_role = admin`
- `profiles.app_role = owner`
- `profiles.app_role = creator`
- `profiles.app_role = app_owner`
- `profiles.is_app_owner = true`

## Widocznosc dla zwyklych uzytkownikow

UI nadal blokuje normalnego uzytkownika przez `isAdmin`.

Nawet gdyby ktos recznie wpisal URL, backend dalej wymaga admina i zwroci 403.

## v4

Patcher nie uzywa regexa do wymiany funkcji. Bierze blok od:

`export async function requireAdminAuthContext`

do:

`async function selectRows`

i wymienia go w calosci.

## Kryterium zakonczenia

Przechodzi:

- `npm run check:admin-ai-role-gate`
- `npm run check:vercel-hobby-function-budget`
- `npm run check:ui-truth`
- `npm run build`
