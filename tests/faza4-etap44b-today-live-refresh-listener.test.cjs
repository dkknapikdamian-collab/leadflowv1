const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const nodeTest = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

nodeTest('Faza 4 Etap 4.4B TodayStable listens to mutation bus', () => {
  const today = read('src/pages/TodayStable.tsx');

  assert.match(today, /subscribeCloseflowDataMutations/);
  assert.match(today, /FAZA4_ETAP44B_TODAY_LIVE_REFRESH/);
  assert.match(today, /subscribeCloseflowDataMutations\(\(detail\)[\s\S]*refreshData\(\)/);

  for (const entity of ['task', 'event', 'lead', 'case', 'client', 'aiDraft', 'activity', 'payment']) {
    assert.match(today, new RegExp("'" + entity + "'"));
  }

  assert.doesNotMatch(today, /window\.location\.reload\(/);
});

nodeTest('Faza 4 Etap 4.4B docs and package wiring exist', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const releaseDoc = read('docs/release/FAZA4_ETAP44B_TODAY_LIVE_REFRESH_LISTENER_2026-05-04.md');
  const technicalDoc = read('docs/technical/TODAY_LIVE_REFRESH_LISTENER_STAGE44B_2026-05-04.md');

  assert.equal(pkg.scripts['check:faza4-etap44b-today-live-refresh-listener'], 'node scripts/check-faza4-etap44b-today-live-refresh-listener.cjs');
  assert.equal(pkg.scripts['test:faza4-etap44b-today-live-refresh-listener'], 'node --test tests/faza4-etap44b-today-live-refresh-listener.test.cjs');
  assert.match(quiet, /tests\/faza4-etap44b-today-live-refresh-listener\.test\.cjs/);
  assert.match(releaseDoc, /FAZA 4 - Etap 4\.4C - mutation bus coverage smoke \/ manual live refresh evidence/);
  assert.match(technicalDoc, /TODAY LIVE REFRESH LISTENER/);
});
