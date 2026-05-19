# 2026-05-19 - Supabase Private SQL snippets rescue

## FAKTY Z LOKALNEGO LOGU

- Projekt Supabase: LeadFlow.
- Project ref: ydntsbkiqwkabhjjlkew.
- Pobrano 10 Private SQL snippets z Supabase SQL Editor.
- Folder: supabase/rescue/snippets/20260519_192150/downloaded_sql_v2.
- Secret scan nie wykazał realnych sekretów.
- Trafienia service_role dotyczą roli SQL w RLS policy, nie klucza SUPABASE_SERVICE_ROLE_KEY.

## KLASYFIKACJA

- NOT_SQL_POWERSHELL_SNIPPET: nie uruchamiać w Supabase SQL Editor.
- DATA_SPECIFIC_WORKSPACE_FIX: nie uruchamiać na nowym projekcie bez przepisania ID.
- SCHEMA_MIGRATION_CANDIDATE: wymaga porównania z repo migrations i remote schema dump.
- DIAGNOSTIC_SELECT_ONLY: zapytanie diagnostyczne, read-only po review.

## DECYZJE

- Private SQL snippets mają zostać zapisane w repo jako artefakty rescue.
- Nie commitować stderrów z Supabase CLI.
- Nie commitować sekretów.
- Nie traktować pobranych snippetów jako gotowej kolejności migracji.

## DO POTWIERDZENIA

- Remote schema dump.
- Supabase db pull.
- Porównanie snippetów z supabase/migrations.
- Mapa Vercel env / Google / Resend / Supabase Auth.

## TESTY / GUARDY

- Manualny secret scan wykonany.
- Klasyfikacja _CLASSIFICATION.md wygenerowana.
- Dedicated automated guard: BRAK, bo to etap inventory/rescue bez zmian runtime.

## NEXT STEP

Supabase rescue stage 2:
1. supabase link --project-ref ydntsbkiqwkabhjjlkew
2. supabase db pull
3. schema dump
4. data dump, jeśli potrzebny
5. role dump
6. mapa odtworzenia na drugim koncie Supabase.
