const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const lead = fs.readFileSync(path.join(repoRoot, 'src', 'pages', 'LeadDetail.tsx'), 'utf8').replace(/^\uFEFF/, '');
const caseQuick = fs.readFileSync(path.join(repoRoot, 'src', 'components', 'CaseQuickActions.tsx'), 'utf8').replace(/^\uFEFF/, '');
const quickBar = fs.readFileSync(path.join(repoRoot, 'src', 'components', 'detail', 'QuickActionsBar.tsx'), 'utf8').replace(/^\uFEFF/, '');
const css = fs.readFileSync(path.join(repoRoot, 'src', 'styles', 'closeflow-shared-quick-actions-bar-stage227e3.css'), 'utf8').replace(/^\uFEFF/, '');

test('Stage227E3 uses one shared QuickActionsBar for case and lead actions', () => {
  assert.ok(quickBar.includes('STAGE227E3_SHARED_QUICK_ACTIONS_BAR'));
  assert.ok(quickBar.includes('export type QuickActionItem'));
  assert.ok(quickBar.includes('actions:'));
  assert.ok(css.includes('cf-shared-quick-actions-bar__button'));
  assert.ok(caseQuick.includes("import QuickActionsBar from './detail/QuickActionsBar';"));
  assert.ok(caseQuick.includes('<QuickActionsBar'));
  assert.ok(!caseQuick.includes('case-quick-actions__grid'));
  assert.ok(lead.includes("import QuickActionsBar from '../components/detail/QuickActionsBar';"));
  assert.ok(lead.includes('<QuickActionsBar'));
  assert.ok(lead.includes('recordType="lead"'));
});

test('Stage227E3 lead action labels match required action set', () => {
  for (const label of ['Notatka', 'Zadanie', 'Wydarzenie', 'Brak', 'Oznacz utracony', 'Rozpocznij obs\u0142ug\u0119']) {
    assert.ok(lead.includes(label), 'missing lead action label: ' + label);
  }
});