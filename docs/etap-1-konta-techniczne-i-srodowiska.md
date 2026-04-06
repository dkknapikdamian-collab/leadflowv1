# ETAP 1 - KONTA TECHNICZNE I SRODOWISKA

## Cel
Przygotowac bazowa infrastrukture pod prawdziwa aplikacje online.

## Konta techniczne
- Vercel: hosting aplikacji
- Supabase: auth, baza, RLS
- Resend: maile produkcyjne
- Google Cloud Project: Sign in with Google

## Srodowiska
- local
- preview / staging
- production

## Co jest juz przygotowane w repo
- `.env.example`
- rozdzial kluczy publicznych i prywatnych
- pola pod SMTP i billing config

## Klucze publiczne
- `NEXT_PUBLIC_APP_ENV`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Klucze prywatne
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`
- `GOOGLE_CLIENT_SECRET`
- `RESEND_API_KEY`
- `SMTP_*`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Tego jeszcze nie robimy
- platnosci produkcyjne
- afiliacja
- publiczne demo

## Kryterium zakonczenia
- istnieje szablon `.env.example`
- istnieje podzial local / preview / production
- istnieje podzial public / private
- checklista kont technicznych jest gotowa

## Uczciwy status
Z tego srodowiska nie da sie automatycznie zalozyc kont w Vercel, Supabase, Resend i Google Cloud.
Repo i dokumentacja pod ten etap sa przygotowane, a same konta trzeba zalozyc juz w panelach tych uslug.
