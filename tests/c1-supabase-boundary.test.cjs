const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

test('C1 repository Supabase boundary guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-c1-supabase-boundary.cjs'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /C1_SUPABASE_BOUNDARY_GUARD_PASS/);
});

test('C1 consolidated activity mutations remain workspace scoped', () => {
  const records = fs.readFileSync(path.join(root, 'src/server/records.ts'), 'utf8');
  const activities = fs.readFileSync(path.join(root, 'src/server/activities-handler.ts'), 'utf8');
  assert.match(records, /updateByIdScoped/);
  assert.match(records, /deleteByIdScoped/);
  assert.doesNotMatch(records, /await\s+(?:updateById|deleteById)\s*\(\s*['"]activities['"]/);
  assert.match(activities, /updateByIdScoped/);
  assert.match(activities, /deleteByIdScoped/);
});

test('C1 migration limits ACL repair to application-owned public defaults', () => {
  const migration = fs.readFileSync(
    path.join(root, 'supabase/migrations/20260811180000_c1_revoke_public_anon_grants.sql'),
    'utf8',
  );
  const executableSql = migration
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|\s)--[^\r\n]*/g, '$1');
  assert.match(executableSql, /revoke all on schema public from public, anon/i);
  assert.match(executableSql, /alter default privileges for role postgres in schema public/i);
  assert.doesNotMatch(executableSql, /\bschema\s+storage\b/i);
  assert.doesNotMatch(executableSql, /\b(?:supabase_admin|supabase_storage_admin)\b/i);
});
