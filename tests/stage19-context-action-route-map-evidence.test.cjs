const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const STAGE = 'STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_V1';
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel){ return fs.existsSync(path.join(root, rel)); }

test('Stage19 package scripts are registered without BOM', () => {
  const buffer = fs.readFileSync(path.join(root, 'package.json'));
  assert.notDeepEqual([...buffer.slice(0,3)], [0xef,0xbb,0xbf]);
  const pkg = JSON.parse(buffer.toString('utf8'));
  assert.equal(pkg.scripts['audit:stage19-context-action-route-map-evidence'], 'node scripts/audit-stage19-context-action-route-map-evidence.cjs');
  assert.equal(pkg.scripts['check:stage19-context-action-route-map-evidence-v1'], 'node scripts/check-stage19-context-action-route-map-evidence.cjs');
  assert.equal(pkg.scripts['test:stage19-context-action-route-map-evidence-v1'], 'node --test tests/stage19-context-action-route-map-evidence.test.cjs');
  assert.equal(pkg.scripts['verify:stage19-context-action-route-map-evidence'], 'npm.cmd run audit:stage19-context-action-route-map-evidence && npm.cmd run check:stage19-context-action-route-map-evidence-v1 && npm.cmd run test:stage19-context-action-route-map-evidence-v1');
});

test('Stage19 route map evidence files exist', () => {
  assert.equal(exists('scripts/audit-stage19-context-action-route-map-evidence.cjs'), true);
  assert.equal(exists('scripts/check-stage19-context-action-route-map-evidence.cjs'), true);
  assert.equal(exists('docs/release/STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_V1_2026-05-06.md'), true);
  assert.match(read('scripts/audit-stage19-context-action-route-map-evidence.cjs'), new RegExp(STAGE));
  assert.match(read('docs/release/STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_V1_2026-05-06.md'), new RegExp(STAGE));
});

test('Stage19 maps detail pages to the shared context action host', () => {
  for (const rel of ['src/pages/LeadDetail.tsx','src/pages/ClientDetail.tsx','src/pages/CaseDetail.tsx']) {
    const text = read(rel);
    assert.match(text, /openContextQuickAction/);
    assert.doesNotMatch(text, /from '\.\.\/components\/TaskCreateDialog'/);
    assert.doesNotMatch(text, /from '\.\.\/components\/EventCreateDialog'/);
  }
  assert.match(read('src/components/ContextActionDialogs.tsx'), /data-context-action-kind/);
  assert.match(read('src/lib/context-action-contract.ts'), /CONTEXT_ACTION_KIND_VALUES/);
});
