const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('B5 support handlers derive actor and workspace from verified server context', () => {
  const handler = read('src/server/support-handler.ts');
  assert.match(handler, /requireSupabaseRequestContext/);
  assert.match(handler, /requireAdminAuthContext/);
  assert.match(handler, /resolveRequestWorkspaceId/);
  assert.match(handler, /closeflow_support_(create_request|reply_request|set_status)/);
  assert.doesNotMatch(handler, /body\.ownerId|body\.ownerEmail|body\.actorType|body\.authorType|body\.authorLabel/);
  assert.doesNotMatch(handler, /updateById\(/);
});

test('B5 support status and input boundaries are explicit', () => {
  const handler = read('src/server/support-handler.ts');
  const migration = read('supabase/migrations/20260810160000_b5_support_actor_authority_audit.sql');
  assert.match(handler, /SUPPORT_STATUSES/);
  assert.match(handler, /SUPPORT_MAX_MESSAGE_LENGTH/);
  assert.match(handler, /SUPPORT_REQUEST_CLOSED/);
  assert.match(handler, /SUPPORT_ADMIN_REQUIRED/);
  assert.match(migration, /support_audit_events/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /closeflow_support_record_audit/);
  assert.match(migration, /for update/);
  assert.match(migration, /workspace_id = p_workspace_id/);
});

test('B5 audit and support mutation functions are server-only', () => {
  const migration = read('supabase/migrations/20260810160000_b5_support_actor_authority_audit.sql');
  assert.match(migration, /revoke all on table public\.support_audit_events from public, anon, authenticated/);
  assert.match(migration, /revoke all on table public\.support_audit_events from service_role/);
  assert.match(migration, /grant insert on table public\.support_audit_events to service_role/);
  assert.match(migration, /support_audit_events_immutable_trigger/);
  assert.match(migration, /grant execute on function public\.closeflow_support_create_request/);
  assert.match(migration, /grant execute on function public\.closeflow_support_reply_request/);
  assert.match(migration, /grant execute on function public\.closeflow_support_set_status/);
});
