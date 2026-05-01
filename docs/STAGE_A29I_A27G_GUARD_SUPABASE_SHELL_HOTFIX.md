# A29I - A27G guard accepts Supabase shell user name

## Cel

Kontynuować niedokończone A29F/A29G/A29H bez cofania zmian.

## Problem

`check:a27g-response-template-encoding` był starym guardem z etapu A27G i wymagał dosłownego markera:

```text
const userName = user?.displayName || 'Użytkownik';
```

Po A29 runtime shell działa już Supabase-first i `Layout.tsx` ma poprawną linię:

```text
const userName = profile?.fullName || supabaseUser?.displayName || userEmail || 'Użytkownik';
```

Stary guard blokował poprawny kod.

## Zmiana

Guard A27G akceptuje teraz jeden z dwóch wariantów:

- legacy Firebase shell,
- nowy Supabase-first shell.

W aktualnym kierunku wymagany i poprawny jest Supabase-first.

## Nie zmieniono

- Nie cofnięto A26/A27/A28/A29.
- Nie przywrócono Firebase jako docelowego runtime auth.
- Nie przywrócono osobnych API stubów Vercel.
- Nie zmieniono UI.
- Nie zmieniono Supabase schema.

## Kryterium

Aktualny `HEAD` przechodzi guardy i może zostać wypchnięty z kompletem zmian.
