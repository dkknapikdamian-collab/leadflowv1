const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

test('lead creation never sends null next_action_title', () => {
  const source = read('api/leads.ts');

  assert.match(source, /function normalizeNextActionTitle/);
  assert.match(source, /next_action_title: normalizeNextActionTitle\(body\.nextActionTitle\)/);
  assert.doesNotMatch(source, /next_action_title:\s*null,/);
});

test('lead next_action_title SQL default guard is present', () => {
  const sql = read('supabase/sql/2026-04-24_leads_next_action_title_default.sql');

  assert.match(sql, /alter table public\.leads alter column next_action_title set default/i);
  assert.match(sql, /update public\.leads set next_action_title = '''' where next_action_title is null/i);
});
