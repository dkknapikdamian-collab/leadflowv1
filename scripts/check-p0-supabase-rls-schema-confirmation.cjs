#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const failures = [];

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function push(condition, message) {
  if (!condition) failures.push(message);
}

const migration = 'supabase/migrations/20260501194000_p0_supabase_rls_schema_confirmation.sql';
push(exists(migration), 'missing P0 Supabase RLS/schema confirmation migration');

const requiredTables = [
  'profiles',
  'workspaces',
  'workspace_members',
  'leads',
  'clients',
  'cases',
  'work_items',
  'activities',
  'ai_drafts',
  'response_templates',
  'case_templates',
  'case_items',
  'client_portal_tokens',
  'billing_events',
];

const businessTables = [
  'leads',
  'clients',
  'cases',
  'work_items',
  'activities',
  'ai_drafts',
  'response_templates',
  'case_templates',
  'case_items',
  'client_portal_tokens',
  'billing_events',
];

if (exists(migration)) {
  const sqlRaw = read(migration);
  const sql = sqlRaw.toLowerCase();

  for (const table of requiredTables) {
    push(
      sql.includes(`create table if not exists public.${table}`) ||
        sql.includes(`alter table if exists public.${table}`) ||
        sql.includes(`alter table public.${table}`),
      `migration must create/repair public.${table}`,
    );
  }

  for (const table of requiredTables) {
    push(sql.includes(`public.${table}`), `migration must reference public.${table}`);
  }

  for (const table of businessTables) {
    push(sql.includes(`'${table}'`), `RLS scoped table list missing ${table}`);
  }

  push(sql.includes('enable row level security'), 'migration must enable row level security');
  push(sql.includes('force row level security'), 'migration must force row level security');
  push(sql.includes('workspace_id::text'), 'migration policies must scope by workspace_id::text');
  push(sql.includes('closeflow_is_workspace_member(workspace_id::text)'), 'migration policies must use closeflow_is_workspace_member(workspace_id::text)');
  push(sql.includes('for select using'), 'migration must define select policies');
  push(sql.includes('for insert with check'), 'migration must define insert policies');
  push(sql.includes('for update using'), 'migration must define update policies');
  push(sql.includes('for delete using'), 'migration must define delete policies');

  const requiredColumns = {
    workspaces: ['plan_id', 'subscription_status', 'trial_ends_at', 'next_billing_at', 'daily_digest_enabled'],
    profiles: ['auth_user_id', 'workspace_id', 'role', 'is_admin', 'force_logout_after'],
    leads: ['workspace_id', 'client_id', 'linked_case_id', 'next_action_at', 'lead_visibility', 'sales_outcome'],
    clients: ['workspace_id', 'source_primary', 'last_activity_at', 'archived_at'],
    cases: ['workspace_id', 'lead_id', 'client_id', 'portal_ready', 'service_started_at'],
    work_items: ['workspace_id', 'record_type', 'show_in_tasks', 'show_in_calendar', 'scheduled_at', 'start_at'],
    activities: ['workspace_id', 'event_type', 'payload', 'lead_id', 'case_id'],
    ai_drafts: ['workspace_id', 'status', 'payload', 'raw_text'],
    response_templates: ['workspace_id', 'name', 'body', 'category'],
    case_templates: ['workspace_id', 'name', 'items'],
    client_portal_tokens: ['workspace_id', 'case_id', 'token_hash', 'expires_at'],
    billing_events: ['workspace_id', 'provider', 'event_type', 'payload'],
  };

  for (const [table, columns] of Object.entries(requiredColumns)) {
    for (const column of columns) {
      push(sql.includes(column), `migration missing expected column ${table}.${column}`);
    }
  }
}

const layout = exists('src/components/Layout.tsx') ? read('src/components/Layout.tsx') : '';
const today = exists('src/pages/Today.tsx') ? read('src/pages/Today.tsx') : '';
push(layout.includes('useSupabaseSession'), 'Layout must use Supabase session');
push(layout.includes('signOutFromSupabase'), 'Layout must sign out through Supabase');
push(!layout.includes("../firebase") && !layout.includes("'../firebase'") && !layout.includes('"../firebase"'), 'Layout must not import Firebase runtime');
push(!layout.includes('auth.currentUser') && !layout.includes('auth.signOut'), 'Layout must not use Firebase auth runtime');

push(today.includes('useSupabaseSession'), 'Today must use Supabase session');
push(!today.includes("../firebase") && !today.includes("'../firebase'") && !today.includes('"../firebase"'), 'Today must not import Firebase runtime');
push(!today.includes('auth.currentUser') && !today.includes('auth.signOut'), 'Today must not use Firebase auth runtime');

const accessGate = exists('src/server/_access-gate.ts') ? read('src/server/_access-gate.ts') : '';
push(accessGate.includes('fetchWorkspaceWriteAccess'), '_access-gate must expose fetchWorkspaceWriteAccess');
push(accessGate.includes('assertWorkspaceWriteAccess'), '_access-gate must expose assertWorkspaceWriteAccess');
push(accessGate.includes('buildPlanAccessModel'), '_access-gate must use shared plan access model');

const requestScope = exists('src/server/_request-scope.ts') ? read('src/server/_request-scope.ts') : '';
push(requestScope.includes('resolveRequestWorkspaceId'), '_request-scope must expose resolveRequestWorkspaceId');
push(requestScope.includes('requireScopedRow'), '_request-scope must expose requireScopedRow');
push(requestScope.includes('withWorkspaceFilter'), '_request-scope must expose withWorkspaceFilter');

if (failures.length) {
  console.error('P0 Supabase RLS/schema confirmation guard failed.');
  for (const item of failures) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: P0 Supabase RLS/schema confirmation guard passed.');
