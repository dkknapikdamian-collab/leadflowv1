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
