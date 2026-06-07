const assert = require('assert');
const fs = require('fs');
const test = require('node:test');

const quick = fs.readFileSync('src/components/detail/QuickActionsBar.tsx', 'utf8');
const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const caseQuick = fs.readFileSync('src/components/CaseQuickActions.tsx', 'utf8');
const css = fs.readFileSync('src/styles/closeflow-shared-quick-actions-bar-stage227e3.css', 'utf8');

test('Stage227E4 makes QuickActionsBar the shared visual source of truth', () => {
  assert.ok(quick.includes('STAGE227E4_QUICK_ACTIONS_SOURCE_OF_TRUTH'));
  assert.ok(quick.includes('data-stage227e4-quick-actions-source-of-truth="true"'));
  assert.ok(quick.includes("recordType: 'lead' | 'case'"));
  assert.ok(quick.includes('actions: QuickActionsBarAction[]'));
});

test('Stage227E4 keeps LeadDetail and CaseQuickActions on the shared bar', () => {
  assert.ok(lead.includes('<QuickActionsBar'));
  assert.ok(lead.includes('recordType="lead"'));
  assert.ok(caseQuick.includes('<QuickActionsBar'));
  assert.ok(caseQuick.includes('recordType="case"'));
});

test('Stage227E4 preserves shared action tones and action keys', () => {
  for (const tone of ['note', 'task', 'event', 'missing', 'lost', 'service', 'payment']) {
    assert.ok(css.includes(`cf-shared-quick-actions-bar__button--${tone}`), `missing tone ${tone}`);
  }
  for (const key of ["key: 'note'", "key: 'task'", "key: 'event'"]) {
    assert.ok(lead.includes(key), `lead missing ${key}`);
    assert.ok(caseQuick.includes(key), `case missing ${key}`);
  }
});