# 2026-05-20 - Stage125A fresh Supabase core API smoke status correction

## Status

SKORYGOWANE / NIE ZAMKNIETE.

Poprzedni wpis tego pliku byl zbyt szeroki. Damian doprecyzowal, ze `dziala` nie oznaczalo pelnego zamkniecia wszystkich integracji ani pelnego smoke calej aplikacji.

## Korekta

FAKT POTWIERDZONY:

- Do Vercel przepieto nowy Supabase projekt / podstawowa konfiguracje Supabase.
- Haslo/rejestracja oraz czesc core API mogly dzialac po hotfixie `currency`.

NIEPOTWIERDZONE / DO POPRAWY:

- Google login po nowym Supabase.
- Google Calendar reconnect i sync.
- Resend/digest.
- Stripe/billing.
- Portal uploads/storage.
- AI/Gemini/Cloudflare.
- Import leadow ze starego Supabase.
- Pelny runtime smoke calej aplikacji.

## Zakres migracji, ktora pozostaje faktem

Po fresh restore nowego Supabase endpointy listowe wykladaly sie na brakujacych kolumnach:

- `leads.currency`
- `cases.currency`

Naprawa zostala wykonana przez migracje repo:

- `supabase/migrations/20260520171000_leads_cases_currency_prereq.sql`

Commit hotfixa:

- `6d975bd Add Supabase currency columns for leads and cases`

## Diagnoza po korekcie Damiana

Nalezy przyjac, ze przepieto tylko podstawowe Supabase env-y w Vercel, a reszta integracji wymaga osobnego przejscia.

Kod potwierdza rozdzial konfiguracji:

- frontend Supabase Auth wymaga `VITE_SUPABASE_URL` i `VITE_SUPABASE_ANON_KEY`,
- backend Supabase REST wymaga `SUPABASE_URL` / `VITE_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL` oraz `SUPABASE_SERVICE_ROLE_KEY`,
- Google Calendar wymaga osobno `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` albo `GOOGLE_CALENDAR_REDIRECT_URI`, oraz `GOOGLE_TOKEN_ENCRYPTION_KEY` albo fallback `CRON_SECRET`.

Samo przepiecie Supabase URL nie naprawia Google login, Google Calendar, Resend, Stripe, storage ani AI.

## Następny prawidlowy etap

Stage125B - fresh Supabase integration repair audit.

Cel:

1. Spisac komplet env-ow wymaganych przez runtime.
2. Oddzielic: Supabase Auth, Supabase REST/service role, Google Auth provider w Supabase, Google Calendar OAuth, Resend, Stripe, Storage, AI.
3. Przygotowac liste wartosci do ustawienia w Vercel/Supabase/Google Cloud bez wklejania sekretow do czatu.
4. Zrobic testy endpointow status/config, zaczynajac od Google Calendar status.
5. Dopiero po status check przechodzic do naprawy konkretnych integracji.

## Decyzje

- Nie uznajemy Stage125A za pelne zamkniecie integracji.
- Nie robimy recznych SQL napraw jako sposobu pracy.
- Nie importujemy leadow, dopoki nowa produkcja nie ma stabilnego core i konfiguracji integracji.
- Nie zakladamy, ze stare tokeny Google Calendar dzialaja po fresh Supabase.

## Czego nie ruszano

- Nie zmieniono runtime kodu.
- Nie zrobiono migracji.
- Nie importowano danych.
- Nie zmieniano sekretow Vercel/Supabase/Google.

## Zapis do Obsidiana

Wymagany wpis korygujacy:

- `10_PROJEKTY/CloseFlow_Lead_App/2026-05-20 - CloseFlow fresh Supabase integration correction.md`
