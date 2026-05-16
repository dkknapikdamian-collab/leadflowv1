const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/^\uFEFF/, '');
}

test('Faza 3 Etap 3.1 plan source of truth is documented and wired', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const doc = read('docs/release/FAZA3_ETAP31_PLAN_SOURCE_OF_TRUTH_2026-05-03.md');
  const technical = read('docs/technical/PLAN_SOURCE_OF_TRUTH_STAGE31_2026-05-03.md');
  const guard = read('scripts/check-faza3-etap31-plan-source-of-truth.cjs');

  assert.equal(pkg.scripts['check:faza3-etap31-plan-source-of-truth'], 'node scripts/check-faza3-etap31-plan-source-of-truth.cjs');
  assert.equal(pkg.scripts['test:faza3-etap31-plan-source-of-truth'], 'node --test tests/faza3-etap31-plan-source-of-truth.test.cjs');
  assert.match(quiet, /tests\/faza3-etap31-plan-source-of-truth\.test\.cjs/);

  assert.match(doc, /FAZA 3 - Etap 3\.1 - Jedno \u017Ar\u00F3d\u0142o prawdy dla plan\u00F3w/);
  assert.match(doc, /src\/lib\/plans\.ts/);
  assert.match(doc, /FAZA 3 - Etap 3\.2 - Backendowe blokady funkcji/);

  assert.match(technical, /Plan Source of Truth/);
  assert.match(technical, /TRIAL_DAYS = 21/);
  assert.match(technical, /activeLeads = 5/);
  assert.match(technical, /activeDrafts = 3/);

  assert.match(guard, /PASS FAZA 3 - Etap 3\.1 plan source-of-truth guard/);
});

test('Runtime plan consumers use src/lib/plans.ts as canonical source', () => {
  const plans = read('src/lib/plans.ts');
  const access = read('src/lib/access.ts');
  const useWorkspace = read('src/hooks/useWorkspace.ts');
  const accessGate = read('src/server/_access-gate.ts');
  const meApi = read('api/me.ts');

  for (const marker of [
    'export const TRIAL_DAYS = 21',
    'export const PLAN_IDS',
    'export const ACCESS_STATUSES',
    'export const FREE_LIMITS',
    'export const PLAN_DEFINITIONS',
    'export function normalizePlanId',
    'export function buildPlanAccessModel',
  ]) {
    assert.match(plans, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(access, /from '\.\/plans'/);
  assert.match(access, /TRIAL_DAYS/);

  assert.match(useWorkspace, /from '\.\.\/lib\/plans'/);
  assert.match(useWorkspace, /buildPlanAccessModel/);

  assert.match(meApi, /from '\.\.\/src\/lib\/plans\.js'/);
  assert.match(meApi, /buildPlanAccessModel/);
  assert.match(meApi, /normalizePlanId as normalizeAccessPlanId/);

  assert.match(accessGate, /from '\.\.\/lib\/plans\.js'/);
  assert.match(accessGate, /FREE_LIMITS as PLAN_FREE_LIMITS/);
  assert.match(accessGate, /export const FREE_LIMITS = PLAN_FREE_LIMITS;/);
  assert.doesNotMatch(accessGate, /export const FREE_LIMITS\s*=\s*\{\s*activeLeads:\s*5,\s*activeTasks:\s*5,\s*activeEvents:\s*5,\s*activeDrafts:\s*3,\s*\}\s*as const/s);
});
