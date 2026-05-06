const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const STAGE = 'STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_V1';
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel){ return fs.existsSync(path.join(root, rel)); }

test('Stage20 package scripts are registered without BOM', () => {
  const buffer = fs.readFileSync(path.join(root, 'package.json'));
  assert.notDeepEqual([...buffer.slice(0,3)], [0xef,0xbb,0xbf]);
  const pkg = JSON.parse(buffer.toString('utf8'));
  assert.equal(pkg.scripts['audit:stage20-context-action-real-button-trigger'], 'node scripts/audit-stage20-context-action-real-button-trigger.cjs');
  assert.equal(pkg.scripts['check:stage20-context-action-real-button-trigger-v1'], 'node scripts/check-stage20-context-action-real-button-trigger.cjs');
  assert.equal(pkg.scripts['test:stage20-context-action-real-button-trigger-v1'], 'node --test tests/stage20-context-action-real-button-trigger.test.cjs');
  assert.equal(pkg.scripts['verify:stage20-context-action-real-button-trigger'], 'npm.cmd run audit:stage20-context-action-real-button-trigger && npm.cmd run check:stage20-context-action-real-button-trigger-v1 && npm.cmd run test:stage20-context-action-real-button-trigger-v1');
});

test('Stage20 evidence files exist', () => {
  assert.equal(exists('scripts/audit-stage20-context-action-real-button-trigger.cjs'), true);
  assert.equal(exists('scripts/check-stage20-context-action-real-button-trigger.cjs'), true);
  assert.equal(exists('docs/release/STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_V1_2026-05-06.md'), true);
  assert.match(read('scripts/audit-stage20-context-action-real-button-trigger.cjs'), new RegExp(STAGE));
  assert.match(read('docs/release/STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_V1_2026-05-06.md'), new RegExp(STAGE));
});

test('Stage20 keeps real detail buttons on shared context action route', () => {
  const host = read('src/components/ContextActionDialogs.tsx');
  assert.match(host, /data-context-action-kind/);
  assert.match(host, /buildContextFromExplicitClick/);
  assert.match(host, /resolveActionKindFromClick/);
  for (const rel of ['src/pages/LeadDetail.tsx','src/pages/ClientDetail.tsx','src/pages/CaseDetail.tsx']) {
    const text = read(rel);
    assert.match(text, /openContextQuickAction/);
    assert.doesNotMatch(text, /from '\.\.\/components\/TaskCreateDialog'/);
    assert.doesNotMatch(text, /from '\.\.\/components\/EventCreateDialog'/);
  }
  assert.match(read('src/pages/LeadDetail.tsx'), /openLeadContextAction\('task'\)|data-context-action-kind="task"|kind: 'task'/);
  assert.match(read('src/pages/LeadDetail.tsx'), /openLeadContextAction\('event'\)|data-context-action-kind="event"|kind: 'event'/);
  assert.match(read('src/pages/LeadDetail.tsx'), /openLeadContextAction\('note'\)|data-context-action-kind="note"|kind: 'note'/);
  assert.match(read('src/pages/CaseDetail.tsx'), /openCaseContextAction\('task'\)|data-context-action-kind="task"|kind: 'task'/);
  assert.match(read('src/pages/CaseDetail.tsx'), /openCaseContextAction\('event'\)|data-context-action-kind="event"|kind: 'event'/);
  assert.match(read('src/pages/CaseDetail.tsx'), /openCaseContextAction\('note'\)|data-context-action-kind="note"|kind: 'note'/);
});