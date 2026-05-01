# A19 v3 - admin role guard completion

## Cel

Domkniecie A19 po A19 v2. Poprzedni pakiet naprawil backend i UI, ale glowny guard nadal wymagal dwoch jawnych kontraktow:

- helpera `isAdminProfile(...)` w `src/lib/admin.ts`,
- jawnego zwracania `profile.role` z backendowego `/api/me`.

## Zakres

- Frontend nie ma allowlisty admin e-maili.
- `src/lib/admin.ts` interpretuje tylko profil zwrocony przez backend.
- `/api/me` zwraca `profile.role` oraz `profile.isAdmin`.
- Admin UI korzysta z backendowego `isAdmin`.
- Admin-only endpointy zostaja zabezpieczone server-side.

## Nie zmieniano

- Notatek glosowych.
- Zapisow leadow, klientow i spraw.
- Billingu.
- Layoutu poza wczesniejszym A19 v2 sidebar hotfix.

## Reczne sprawdzenie

1. Wykonaj migracje A19 v2 albo recznie dodaj kolumny `profiles.role` i `profiles.is_admin`.
2. Ustaw swoj profil:

```sql
update public.profiles
set role = 'admin',
    is_admin = true
where lower(email) = lower('twoj-email@example.com');
```

3. Wyloguj sie i zaloguj ponownie.
4. `/api/me` powinno zwrocic `profile.role = admin` oraz `profile.isAdmin = true`.
5. Zwykly uzytkownik bez roli admin nie powinien widziec ani uzywac narzedzi admin-only.

## Kryterium zakonczenia

`npm run check:a19-admin-role` przechodzi razem z pozostalymi guardami krytycznymi.