const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const nodeTest = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

nodeTest('Faza 4 Etap 4.4A mutation bus is exported from supabase-fallback', () => {
  const fallback = read('src/lib/supabase-fallback.ts');

  assert.match(fallback, /CLOSEFLOW_DATA_MUTATED_EVENT = 'closeflow:data-mutated'/);
  assert.match(fallback, /emitCloseflowDataMutation/);
  assert.match(fallback, /subscribeCloseflowDataMutations/);
  assert.match(fallback, /new CustomEvent\(CLOSEFLOW_DATA_MUTATED_EVENT/);
  assert.match(fallback, /clearApiGetCache\(\);[\s\S]*emitCloseflowDataMutation\(path,\s*method\);/);
});

nodeTest('Faza 4 Etap 4.4A Tasks and Calendar listen without full reload', () => {
  const tasks = read('src/pages/Tasks.tsx');
  const calendar = read('src/pages/Calendar.tsx');

  assert.match(tasks, /FAZA4_ETAP44A_TASKS_LIVE_REFRESH/);
  assert.match(tasks, /subscribeCloseflowDataMutations\(\(detail\)[\s\S]*refreshSupabaseData\(\)/);
  assert.doesNotMatch(tasks, /window\.location\.reload\(/);

  assert.match(calendar, /FAZA4_ETAP44A_CALENDAR_LIVE_REFRESH/);
  assert.match(calendar, /subscribeCloseflowDataMutations\(\(detail\)[\s\S]*refreshSupabaseBundle\(\)/);
  assert.doesNotMatch(calendar, /window\.location\.reload\(/);
});

nodeTest('Faza 4 Etap 4.4A docs and package wiring exist', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const releaseDoc = read('docs/release/FAZA4_ETAP44A_LIVE_REFRESH_MUTATION_BUS_2026-05-04.md');

  assert.equal(pkg.scripts['check:faza4-etap44a-live-refresh-mutation-bus'], 'node scripts/check-faza4-etap44a-live-refresh-mutation-bus.cjs');
  assert.equal(pkg.scripts['test:faza4-etap44a-live-refresh-mutation-bus'], 'node --test tests/faza4-etap44a-live-refresh-mutation-bus.test.cjs');
  assert.match(quiet, /tests\/faza4-etap44a-live-refresh-mutation-bus\.test\.cjs/);
  assert.match(releaseDoc, /FAZA 4 - Etap 4\.4B - Today live refresh listener/);
});
