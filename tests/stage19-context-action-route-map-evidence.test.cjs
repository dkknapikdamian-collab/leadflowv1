const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const exists = (rel) => fs.existsSync(path.join(root, rel));
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('Stage19 route map audit exists and covers all context action types', () => {
  assert.equal(exists('scripts/audit-context-action-route-map.cjs'), true);
  const src = read('scripts/audit-context-action-route-map.cjs');
  assert.match(src, /STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_V1/);
  assert.match(src, /task -> TaskCreateDialog -> tasks/);
  assert.match(src, /event -> EventCreateDialog -> events/);
  assert.match(src, /note -> ContextNoteDialog -> activities/);
});

test('Stage19 keeps one host and no local detail-page dialog imports', () => {
  const host = read('src/components/ContextActionDialogs.tsx');
  assert.match(host, /ContextActionDialogsHost/);
  assert.match(host, /data-context-action-kind/);
  assert.equal((host.match(/<TaskCreateDialog/g) || []).length, 1);
  assert.equal((host.match(/<EventCreateDialog/g) || []).length, 1);
  assert.equal((host.match(/<ContextNoteDialog/g) || []).length, 1);
  for (const rel of ['src/pages/LeadDetail.tsx', 'src/pages/ClientDetail.tsx', 'src/pages/CaseDetail.tsx']) {
    const text = read(rel);
    assert.match(text, /openContextQuickAction/);
    assert.doesNotMatch(text, /from ['"]\.\.\/components\/TaskCreateDialog['"]/);
    assert.doesNotMatch(text, /from ['"]\.\.\/components\/EventCreateDialog['"]/);
  }
});

test('Stage19 route map documents persistence and relation targets', () => {
  const src = read('scripts/audit-context-action-route-map.cjs');
  assert.match(src, /insertTaskToSupabase/);
  assert.match(src, /insertEventToSupabase/);
  assert.match(src, /insertActivityToSupabase/);
  assert.match(src, /leadId, caseId, clientId, workspaceId/);
  assert.match(src, /No parallel local dialog path is allowed/);
});

test('Stage19 scripts are registered and package.json has no BOM', () => {
  const buffer = fs.readFileSync(path.join(root, 'package.json'));
  assert.notEqual(buffer[0], 0xef);
  const pkg = JSON.parse(buffer.toString('utf8'));
  assert.equal(pkg.scripts['audit:stage19-context-action-route-map'], 'node scripts/audit-context-action-route-map.cjs');
  assert.equal(pkg.scripts['check:stage19-context-action-route-map-evidence-v1'], 'node scripts/check-stage19-context-action-route-map-evidence.cjs');
  assert.equal(pkg.scripts['test:stage19-context-action-route-map-evidence-v1'], 'node --test tests/stage19-context-action-route-map-evidence.test.cjs');
});
