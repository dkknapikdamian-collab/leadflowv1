const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));

test('Stage16 adds a context action button parity audit script', () => {
  assert.equal(exists('scripts/audit-context-action-button-parity.cjs'), true);
  const src = read('scripts/audit-context-action-button-parity.cjs');
  assert.match(src, /STAGE16_CONTEXT_ACTION_BUTTON_PARITY_AUDIT_V1/);
  assert.match(src, /data-context-action-kind/);
  assert.match(src, /openContextQuickAction/);
  assert.match(src, /ContextActionDialogs opens one task dialog/);
  assert.match(src, /ContextActionDialogs opens one event dialog/);
});

test('Stage16 keeps detail pages on the shared context action host', () => {
  for (const rel of ['src/pages/LeadDetail.tsx', 'src/pages/ClientDetail.tsx', 'src/pages/CaseDetail.tsx']) {
    const src = read(rel);
    assert.match(src, /openContextQuickAction/, rel + ' should use openContextQuickAction');
    assert.equal(src.includes("from '../components/TaskCreateDialog'"), false, rel + ' must not import TaskCreateDialog directly');
    assert.equal(src.includes("from '../components/EventCreateDialog'"), false, rel + ' must not import EventCreateDialog directly');
  }
});

test('Stage16 package scripts are registered without BOM', () => {
  const buffer = fs.readFileSync(path.join(root, 'package.json'));
  assert.notEqual(buffer[0], 0xef);
  const pkg = JSON.parse(buffer.toString('utf8'));
  assert.equal(pkg.scripts['audit:stage16-context-action-button-parity'], 'node scripts/audit-context-action-button-parity.cjs');
  assert.equal(pkg.scripts['check:stage16-context-action-button-parity-audit-v1'], 'node scripts/check-stage16-context-action-button-parity-audit.cjs');
  assert.equal(pkg.scripts['test:stage16-context-action-button-parity-audit-v1'], 'node --test tests/stage16-context-action-button-parity-audit.test.cjs');
});
