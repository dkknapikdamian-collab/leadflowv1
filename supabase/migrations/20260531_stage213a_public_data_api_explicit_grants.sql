-- STAGE213A_SUPABASE_PUBLIC_DATA_API_GRANTS
-- Cel:
-- - przygotować CloseFlow na zmianę Supabase dotyczącą jawnych GRANT-ów dla Data API
-- - nie otwierać prywatnych tabel dla anon
-- - utrzymać dostęp aplikacji dla zalogowanych użytkowników przez rolę authenticated
-- - utrzymać backendowy dostęp przez service_role
--
-- WAŻNE:
-- GRANT != RLS policy.
-- GRANT daje techniczną możliwość zapytania przez Data API.
-- RLS/policies nadal decydują, które rekordy użytkownik realnie widzi.

begin;

-- 1) Schemat public może być używany przez role Supabase.
grant usage on schema public to anon, authenticated, service_role;

-- 2) Istniejące tabele: CloseFlow jest aplikacją prywatną/loginową.
-- Nie dajemy anon pełnych praw do tabel.
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to service_role;

-- 3) Sekwencje potrzebne przy insertach / id.
grant usage, select on all sequences in schema public to authenticated;
grant usage, select on all sequences in schema public to service_role;

-- 4) Funkcje/RPC w public, jeśli aplikacja ich używa.
grant execute on all functions in schema public to authenticated;
grant execute on all functions in schema public to service_role;

-- 5) Przyszłe tabele tworzone przez postgres.
alter default privileges for role postgres in schema public
  grant select, insert, update, delete on tables to authenticated;

alter default privileges for role postgres in schema public
  grant select, insert, update, delete on tables to service_role;

alter default privileges for role postgres in schema public
  grant usage, select on sequences to authenticated;

alter default privileges for role postgres in schema public
  grant usage, select on sequences to service_role;

alter default privileges for role postgres in schema public
  grant execute on functions to authenticated;

alter default privileges for role postgres in schema public
  grant execute on functions to service_role;

commit;

-- STAGE213A AUDYT PO WDROŻENIU
-- Odpal osobno w Supabase SQL Editor po migracji, żeby zobaczyć tabele bez RLS.
-- To jest tylko SELECT, nic nie zmienia.
--
-- select
--   n.nspname as schema_name,
--   c.relname as table_name,
--   c.relrowsecurity as rls_enabled
-- from pg_class c
-- join pg_namespace n on n.oid = c.relnamespace
-- where n.nspname = 'public'
--   and c.relkind in ('r', 'p')
-- order by c.relname;
