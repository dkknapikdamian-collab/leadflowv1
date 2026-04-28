const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('Stage19 AI drafts SQL creates shared Supabase table safely', () => {
  const sql = read('sql/2026-04-28_ai_drafts_supabase_ready.sql');
  assert.match(sql, /create table if not exists public\.ai_drafts/);
  assert.match(sql, /workspace_id uuid/);
  assert.match(sql, /enable row level security/);
  assert.match(sql, /ai_drafts_service_role_all/);
  assert.match(sql, /workspace_members/);
});

test('Stage19 AI drafts SQL is idempotent and complete for draft lifecycle', () => {
  const sql = read('sql/2026-04-28_ai_drafts_supabase_ready.sql');
  assert.match(sql, /add column if not exists converted_at/);
  assert.match(sql, /create index if not exists ai_drafts_workspace_status_created_idx/);
  assert.match(sql, /touch_ai_drafts_updated_at/);
});

test('Stage19 docs have clean encoding', () => {
  const doc = read('docs/STAGE19_SUPABASE_AI_DRAFTS_SQL_2026-04-28.md');
  for (const token of ['\u00c4', '\u00c5', '\u00c3', '\u00c2', '\ufffd']) assert.equal(doc.includes(token), false, token);
});
