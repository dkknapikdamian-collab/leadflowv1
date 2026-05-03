-- CLOSEFLOW RLS WORKSPACE SECURITY PROOF
-- Date: 2026-05-03
-- Purpose: manual Supabase evidence query for FAZA 2 - Etap 2.2.
-- How to use:
-- 1) Open Supabase SQL Editor.
-- 2) Paste this whole file.
-- 3) Run it.
-- 4) Save the result table as screenshot/log in release evidence.
--
-- This query does not modify data.

with required_tables(table_name, expected_kind) as (
  values
    ('profiles', 'core'),
    ('workspaces', 'core'),
    ('workspace_members', 'core'),
    ('leads', 'business'),
    ('clients', 'business'),
    ('cases', 'business'),
    ('work_items', 'business'),
    ('activities', 'business'),
    ('ai_drafts', 'business'),
    ('response_templates', 'business'),
    ('case_items', 'business'),
    ('payments', 'business'),
    ('notifications', 'business'),
    ('workspace_settings', 'business'),
    ('client_portal_items', 'business'),
    ('portal_items', 'business'),
    ('portal_access_tokens', 'business'),
    ('files', 'business'),
    ('documents', 'business')
),
table_state as (
  select
    rt.table_name,
    rt.expected_kind,
    c.oid,
    c.relrowsecurity as rls_enabled,
    c.relforcerowsecurity as rls_forced,
    exists (
      select 1
      from information_schema.columns col
      where col.table_schema = 'public'
        and col.table_name = rt.table_name
        and col.column_name = 'workspace_id'
    ) as has_workspace_id
  from required_tables rt
  left join pg_class c
    on c.relname = rt.table_name
   and c.relnamespace = 'public'::regnamespace
),
policy_state as (
  select
    schemaname,
    tablename,
    count(*) as policy_count,
    bool_or(qual ilike '%closeflow_is_workspace_member%' or with_check ilike '%closeflow_is_workspace_member%') as has_workspace_member_policy,
    string_agg(policyname, ', ' order by policyname) as policies
  from pg_policies
  where schemaname = 'public'
  group by schemaname, tablename
),
function_state as (
  select
    exists (
      select 1
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public'
        and p.proname = 'closeflow_is_workspace_member'
    ) as has_closeflow_is_workspace_member,
    exists (
      select 1
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public'
        and p.proname = 'closeflow_is_admin'
    ) as has_closeflow_is_admin
)
select
  ts.expected_kind,
  ts.table_name,
  case
    when ts.oid is null then 'table_missing'
    when ts.rls_enabled is not true then 'fail_rls_not_enabled'
    when ts.rls_forced is not true then 'fail_rls_not_forced'
    when ts.expected_kind = 'business' and ts.has_workspace_id is not true then 'manual_review_no_workspace_id'
    when ts.expected_kind = 'business' and coalesce(ps.has_workspace_member_policy, false) is not true then 'fail_missing_workspace_member_policy'
    when ts.expected_kind = 'core' and coalesce(ps.policy_count, 0) = 0 then 'fail_missing_core_policy'
    else 'ok'
  end as rls_workspace_status,
  ts.rls_enabled,
  ts.rls_forced,
  ts.has_workspace_id,
  coalesce(ps.policy_count, 0) as policy_count,
  coalesce(ps.has_workspace_member_policy, false) as has_workspace_member_policy,
  ps.policies,
  fs.has_closeflow_is_workspace_member,
  fs.has_closeflow_is_admin
from table_state ts
left join policy_state ps
  on ps.schemaname = 'public'
 and ps.tablename = ts.table_name
cross join function_state fs
order by
  case ts.expected_kind when 'core' then 0 else 1 end,
  ts.table_name;
