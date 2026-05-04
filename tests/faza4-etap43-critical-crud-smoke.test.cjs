const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const nodeTest = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

nodeTest('Faza 4 Etap 4.3 critical CRUD smoke script covers live API paths', () => {
  const smoke = read('scripts/smoke-critical-crud.cjs');

  for (const marker of [
    'CLOSEFLOW_SMOKE_BASE_URL',
    'CLOSEFLOW_SMOKE_ACCESS_TOKEN',
    '/api/me',
    '/api/leads',
    '/api/tasks',
    '/api/events',
    '/api/system?kind=ai-drafts',
    "action: 'start_service'",
    "action: 'confirm'",
    "action: 'cancel'",
    'PASS critical CRUD smoke',
  ]) {
    assert.match(smoke, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

nodeTest('Faza 4 Etap 4.3 static wiring and docs are present', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const releaseDoc = read('docs/release/FAZA4_ETAP43_CRITICAL_CRUD_RELOAD_SMOKE_2026-05-04.md');
  const technicalDoc = read('docs/technical/CRITICAL_CRUD_RELOAD_SMOKE_STAGE43_2026-05-04.md');

  assert.equal(pkg.scripts['smoke:critical-crud'], 'node scripts/smoke-critical-crud.cjs');
  assert.equal(pkg.scripts['check:faza4-etap43-critical-crud-smoke'], 'node scripts/check-faza4-etap43-critical-crud-smoke.cjs');
  assert.equal(pkg.scripts['test:faza4-etap43-critical-crud-smoke'], 'node --test tests/faza4-etap43-critical-crud-smoke.test.cjs');
  assert.match(quiet, /tests\/faza4-etap43-critical-crud-smoke\.test\.cjs/);
  assert.match(releaseDoc, /Manualny reload UI nadal zostaje wymagany/);
  assert.match(technicalDoc, /CRITICAL CRUD \/ RELOAD SMOKE/);
});

nodeTest('Faza 4 Etap 4.3 keeps task/event API rewrite and stage42 syntax clean', () => {
  const vercel = read('vercel.json');
  const workItems = read('api/work-items.ts');

  assert.match(vercel, /"source":\s*"\/api\/tasks"[\s\S]*"destination":\s*"\/api\/work-items\?kind=tasks"/);
  assert.match(vercel, /"source":\s*"\/api\/events"[\s\S]*"destination":\s*"\/api\/work-items\?kind=events"/);
  assert.doesNotMatch(workItems, /^\uFEFF/);
  assert.doesNotMatch(workItems, /function isEventRow\(row: any\) \{function isEventRow/);
  assert.doesNotMatch(workItems, /syncLeadNextActionasync function syncLeadNextAction/);
});
