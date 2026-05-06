const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));

test('Stage20 adds an audit for real button labels and shared context action routing', () => {
  assert.equal(exists('scripts/audit-context-action-real-button-triggers.cjs'), true);
  const src = read('scripts/audit-context-action-real-button-triggers.cjs');
  assert.match(src, /STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_AUDIT_V1/);
  assert.match(src, /Dodaj zadanie/);
  assert.match(src, /Dodaj wydarzenie/);
  assert.match(src, /Dodaj notat/);
  assert.match(src, /data-context-action-kind/);
  assert.match(src, /openContextQuickAction/);
});

test('Stage20 keeps context actions on shared dialogs and shared persistence paths', () => {
  const host = read('src/components/ContextActionDialogs.tsx');
  assert.match(host, /TaskCreateDialog/);
  assert.match(host, /EventCreateDialog/);
  assert.match(host, /ContextNoteDialog/);
  assert.match(read('src/components/TaskCreateDialog.tsx'), /insertTaskToSupabase/);
  assert.match(read('src/components/EventCreateDialog.tsx'), /insertEventToSupabase/);
  assert.match(read('src/components/ContextNoteDialog.tsx'), /insertActivityToSupabase/);
});

test('Stage20 package scripts and release note are registered', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['audit:stage20-context-action-real-button-triggers'], 'node scripts/audit-context-action-real-button-triggers.cjs');
  assert.equal(pkg.scripts['check:stage20-context-action-real-button-trigger-audit-v1'], 'node scripts/check-stage20-context-action-real-button-trigger-audit.cjs');
  assert.equal(pkg.scripts['test:stage20-context-action-real-button-trigger-audit-v1'], 'node --test tests/stage20-context-action-real-button-trigger-audit.test.cjs');
  const doc = read('docs/release/STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_AUDIT_V1_2026-05-06.md');
  assert.match(doc, /STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_AUDIT_V1/);
  assert.match(doc, /realne przyciski/);
});
