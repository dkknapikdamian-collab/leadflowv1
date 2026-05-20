# 2026-05-20 - CloseFlow Supabase new project migration normalization

## Status

WYKONANO.

Nowy projekt Supabase został podlinkowany i otrzymał komplet migracji CloseFlow.

## FAKTY

- Lokalny repo path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- Branch: dev-rollout-freeze
- Supabase CLI link: wykonany
- supabase db push --include-all: wykonany
- supabase migration list: lokalne i remote wersje zsynchronizowane
- supabase db push --dry-run: Remote database is up to date
- supabase db push --include-all --dry-run: Remote database is up to date

## CO NAPRAWIONO

- Znormalizowano stare nazwy migracji do formatu timestamp.
- Przeniesiono stare nazwy migracji do supabase/_legacy_migration_filenames_20260519.
- Dodano prereq migracje dla świeżego Supabase:
  - core tables bootstrap
  - profiles/workspace_members prereq
  - profile digest columns prereq
  - client_portal_tokens prereq
  - cases.expected_revenue prereq
- Usunięto BOM z migracji SQL.
- Naprawiono błędny delimiter do $ ... end $; w A22.
- Naprawiono PostgreSQL-incompatible dd constraint if not exists w FIN-4.

## DECYZJE

- Nie przenosimy użytkowników ani danych ze starego Supabase.
- Nie przenosimy starych tokenów Google Calendar.
- Repo ma być źródłem prawdy dla migracji, nie ręczne SQL-e w Supabase SQL Editor.
- Supabase SQL Editor może być użyty do sanity check, nie do napraw migracyjnych.

## DO POTWIERDZENIA

- Supabase SQL Editor sanity check tabel.
- Supabase Auth: Email provider, Site URL, Redirect URLs.
- Vercel env switch na nowe Supabase keys.
- Rejestracja nowego konta i bootstrap workspace.
- Google Calendar, Resend, Stripe, AI po osobnych testach.

## NEXT STEP

1. Sanity check tabel w Supabase SQL Editor.
2. Commit selektywny migracji i raportu.
3. Aktualizacja Obsidiana.
4. Vercel env switch.
5. Redeploy.
6. Test rejestracji/logowania/workspace/core CRUD.
