const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

test('Supabase workspace auth context documents the actual live schema', () => {
  const doc = read('docs/AI_CONTEXT_SUPABASE_AUTH_WORKSPACE_2026-04-24.md');

  assert.match(doc, /public\.workspaces\.owner_user_id -> auth\.users\.id/i);
  assert.match(doc, /public\.profiles\.user_id/i);
  assert.match(doc, /public\.workspace_members\.user_id/i);
  assert.match(doc, /public\.users is not/i);
});

test('Active workspace repair SQL uses auth.users as workspace owner source', () => {
  const sql = read('supabase/sql/2026-04-24_workspace_context_repair_v11_auth_users_schema_safe_casts.sql');

  assert.match(sql, /join auth\.users au on au\.id = p\.user_id/i);
  assert.match(sql, /owner_user_id,\s*\n\s*s\.user_id/i);
  assert.doesNotMatch(sql, /references public\.users/i);
  assert.doesNotMatch(sql, /create table if not exists public\.users/i);
});

test('Supabase SQL README points to the active auth-users repair file', () => {
  const readme = read('supabase/sql/README.md');

  assert.match(readme, /2026-04-24_workspace_context_repair_v11_auth_users_schema_safe_casts\.sql/);
  assert.match(readme, /auth\.users\.id/);
});
