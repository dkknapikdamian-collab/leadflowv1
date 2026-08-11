-- C1: fail-closed Data API privilege boundary for the private CloseFlow schema.
-- RLS remains the row-level boundary; this migration removes the broader
-- PUBLIC/anon ACL so anonymous access cannot depend on RLS alone.
-- This file is intentionally not applied by C1; provider backup evidence is
-- required before any live migration.

begin;

revoke all on schema public from public, anon;
revoke all on all tables in schema public from public, anon;
revoke all on all sequences in schema public from public, anon;
revoke all on all functions in schema public from public, anon;

revoke all on schema storage from public, anon;
revoke all on all tables in schema storage from public, anon;
revoke all on all sequences in schema storage from public, anon;
revoke all on all functions in schema storage from public, anon;

alter default privileges for role postgres in schema public
  revoke all on tables from public, anon;
alter default privileges for role postgres in schema public
  revoke all on sequences from public, anon;
alter default privileges for role postgres in schema public
  revoke all on functions from public, anon;

alter default privileges for role postgres in schema storage
  revoke all on tables from public, anon;
alter default privileges for role postgres in schema storage
  revoke all on sequences from public, anon;
alter default privileges for role postgres in schema storage
  revoke all on functions from public, anon;

alter default privileges for role supabase_admin in schema public
  revoke all on tables from public, anon;
alter default privileges for role supabase_admin in schema public
  revoke all on sequences from public, anon;
alter default privileges for role supabase_admin in schema public
  revoke all on functions from public, anon;

alter default privileges for role supabase_admin in schema storage
  revoke all on tables from public, anon;
alter default privileges for role supabase_admin in schema storage
  revoke all on sequences from public, anon;
alter default privileges for role supabase_admin in schema storage
  revoke all on functions from public, anon;

alter default privileges for role supabase_storage_admin in schema storage
  revoke all on tables from public, anon;
alter default privileges for role supabase_storage_admin in schema storage
  revoke all on sequences from public, anon;
alter default privileges for role supabase_storage_admin in schema storage
  revoke all on functions from public, anon;

commit;
