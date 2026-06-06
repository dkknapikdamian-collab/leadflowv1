const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const repoRoot = process.cwd();
const lead = fs.readFileSync(path.join(repoRoot, 'src/pages/LeadDetail.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repoRoot, 'src/styles/visual-stage14-lead-detail-vnext.css'), 'utf8');

test('Stage228B R14 maps lead action center to visual source truth without duplicate copy', () => {
  assert.ok(lead.includes('data-stage228b-r14-lead-action-center-vst="true"'));
  assert.ok(lead.includes('Najbliższe zadania, wydarzenia i braki przypięte do tego leada.'));
  assert.ok(!lead.includes('Działania leada: zadania, wydarzenia i braki w jednym miejscu.'));
  assert.ok(css.includes('STAGE228B_R14_LEAD_ACTION_CENTER_VST_CSS'));
});

test('Stage228B R14 does not duplicate overdue events as blockers by default', () => {
  assert.ok(!lead.includes('return entry.isOverdue || title.includes'));
  assert.ok(lead.includes("status.includes('block')") || lead.includes("status.includes('missing')"));
});

test('Stage228B R14 keeps work actions actionable and clean UTF-8', () => {
  for (const token of ['Edytuj', 'Jutro', 'Zrobione', 'Usuń', 'handleRescheduleLinkedEvent', 'handleDeleteLinkedEvent']) {
    assert.ok(lead.includes(token), 'missing token: ' + token);
  }
  assert.ok(!lead.includes('â€˘'));
  assert.ok(!lead.includes('â€¢'));
});
