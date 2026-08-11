-- C1: fail-closed Data API privilege boundary for the application-owned public schema.
-- RLS remains the row-level boundary; this migration removes the broader
-- PUBLIC/anon ACL so anonymous access cannot depend on RLS alone.
-- Supabase Storage is provider-managed: its schema, ACLs, defaults and helper
-- functions are intentionally outside this migration. Storage authorization
-- remains owned by storage.objects RLS and the Storage API.
-- This file is intentionally not applied by C1; provider migration execution
-- is outside the current contract.

begin;

revoke all on schema public from public, anon;
revoke all on all tables in schema public from public, anon;
revoke all on all sequences in schema public from public, anon;
revoke all on all functions in schema public from public, anon;

alter default privileges for role postgres in schema public
  revoke all on tables from public, anon;
alter default privileges for role postgres in schema public
  revoke all on sequences from public, anon;
alter default privileges for role postgres in schema public
  revoke all on functions from public, anon;

commit;
