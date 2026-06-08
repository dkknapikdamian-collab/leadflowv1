const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) fail('missing file: ' + rel);
  return fs.readFileSync(full, 'utf8').replace(/^\\uFEFF/, '');
}

function fail(message) {
  console.error('STAGE228R16R2_TASK_DELETE_SQL_BRAK_BUTTON_FAIL:', message);
  process.exit(1);
}

function requireText(text, token, label) {
  if (!text.includes(token)) fail(label + ' missing token: ' + token);
}

function forbidText(text, token, label) {
  if (text.includes(token)) fail(label + ' forbidden token: ' + token);
}

const fallback = read('src/lib/supabase-fallback.ts');
const lead = read('src/pages/LeadDetail.tsx');
const client = read('src/pages/ClientDetail.tsx');
const packageJson = JSON.parse(read('package.json'));
const sql = read('sql/001_stage228r16_leads_next_action_title_nullable.sql').toLowerCase();

[
  'STAGE228R16_GLOBAL_TASK_SOFT_DELETE_NO_DELETE',
  'softDeleteTaskInSupabase',
  "method: 'PATCH'",
  "status: 'deleted'",
  'stage228r16_delete_task_from_supabase_soft_delete',
].forEach((token) => requireText(fallback, token, 'supabase-fallback R16R2'));

const deleteTaskIndex = fallback.indexOf('export async function deleteTaskFromSupabase');
if (deleteTaskIndex < 0) fail('deleteTaskFromSupabase missing');
const deleteTaskSlice = fallback.slice(deleteTaskIndex, deleteTaskIndex + 500);
forbidText(deleteTaskSlice, "method: 'DELETE'", 'deleteTaskFromSupabase must not use DELETE');

[
  'STAGE228R16_TASK_DELETE_SQL_AND_DIRECT_BRAK',
  'data-stage228r16-lead-direct-brak-button="true"',
  'openContextQuickAction',
  "kind: 'blocker'",
  'data-context-action-kind="blocker"',
  'stage228r16_lead_linked_task_soft_delete',
  "status: 'deleted'",
].forEach((token) => requireText(lead, token, 'LeadDetail R16R2'));

forbidText(lead, 'deleteTaskFromSupabase', 'LeadDetail R16R2');

[
  'STAGE228R16_CLIENT_DIRECT_BRAK_POINTERDOWN',
  'data-stage228r16-client-direct-brak-pointerdown="true"',
  "openClientContextAction('blocker')",
].forEach((token) => requireText(client, token, 'ClientDetail R16R2'));

[
  'alter table public.leads',
  'alter column next_action_title drop not null',
  'alter column next_action_title set default',
  'information_schema.columns',
].forEach((token) => requireText(sql, token, 'SQL R16R2'));

const command = 'node scripts/check-stage228r16r2-task-delete-sql-brak-button.cjs';
if (packageJson.scripts['check:stage228r16r2-task-delete-sql-brak-button'] !== command) {
  fail('package.json missing check:stage228r16r2-task-delete-sql-brak-button script');
}
if (!String(packageJson.scripts.prebuild || '').includes(command)) {
  fail('package.json prebuild missing Stage228R16R2 guard');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R16R2_TASK_DELETE_SQL_BRAK_BUTTON',
  contract: {
    sql: 'leads.next_action_title nullable SQL is present',
    taskDelete: 'deleteTaskFromSupabase no longer sends DELETE /api/tasks',
    leadDelete: 'LeadDetail linked task delete soft-deletes with status=deleted',
    brakButton: 'Lead and Client Brak buttons open through explicit action handlers'
  },
  sqlRequired: true
}, null, 2));
