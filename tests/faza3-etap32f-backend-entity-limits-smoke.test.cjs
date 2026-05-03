const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/^\uFEFF/, '');
}

test('Faza 3 Etap 3.2F access gate auto-counts Free entity limits', () => {
  const gate = read('src/server/_access-gate.ts');

  assert.match(gate, /getPlanLimits\(readPlanId\(workspace\), status\)/);
  assert.match(gate, /PLAN_IDS\.free/);
  assert.match(gate, /async function countWorkspaceEntitiesForLimit/);
  assert.match(gate, /selectFirstAvailable\(queries\)/);
  assert.match(gate, /WORKSPACE_ENTITY_LIMIT_REACHED/);
  assert.match(gate, /leads\?select=id/);
  assert.match(gate, /work_items\?select=id/);
  assert.match(gate, /ai_drafts\?select=id/);
});

test('Faza 3 Etap 3.2F critical create paths call entity limit guard', () => {
  const leads = read('api/leads.ts');
  const workItems = read('api/work-items.ts');
  const aiDrafts = read('src/server/ai-drafts.ts');

  assert.match(leads, /assertWorkspaceEntityLimit\(\s*workspaceId\s*,\s*['"]lead['"]\s*\)/);
  assert.match(workItems, /assertWorkspaceEntityLimit\(\s*finalWorkspaceId\s*,\s*kind === ['"]events['"] \? ['"]event['"] : ['"]task['"]\s*\)/);
  assert.match(aiDrafts, /assertWorkspaceEntityLimit\(\s*workspaceId\s*,\s*['"]ai_draft['"]\s*\)/);
});

test('Faza 3 Etap 3.2F package and quiet release gate are wired', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');

  assert.equal(pkg.scripts['check:faza3-etap32f-backend-entity-limits-smoke'], 'node scripts/check-faza3-etap32f-backend-entity-limits-smoke.cjs');
  assert.equal(pkg.scripts['test:faza3-etap32f-backend-entity-limits-smoke'], 'node --test tests/faza3-etap32f-backend-entity-limits-smoke.test.cjs');
  assert.match(quiet, /tests\/faza3-etap32f-backend-entity-limits-smoke\.test\.cjs/);
});
