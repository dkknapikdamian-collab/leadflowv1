const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(repoRoot, 'src/pages/LeadDetail.tsx'), 'utf8');

test('FIN-15 removes lead payment editor and payment persistence', () => {
  const forbidden = [
    'createPaymentInSupabase',
    'fetchPaymentsFromSupabase',
    'leadPayments',
    'setLeadPayments',
    'isLeadPaymentOpen',
    'setIsLeadPaymentOpen',
    'leadPaymentDraft',
    'setLeadPaymentDraft',
    'leadPaymentSubmitting',
    'setLeadPaymentSubmitting',
  ];

  for (const token of forbidden) {
    assert.equal(source.includes(token), false, `LeadDetail must not contain ${token}`);
  }
});

test('FIN-15 keeps lead as service archive with direct case handoff', () => {
  assert.ok(source.includes('const leadOperationalArchive = Boolean'));
  assert.ok(source.includes('leadMovedToService || associatedCase || startServiceSuccess'));
  assert.ok(source.includes('navigate(`/case/${startServiceSuccess.caseId}`);'));
  assert.equal(source.includes('navigate(`/cases/${startServiceSuccess.caseId}`);'), false);
  assert.ok(source.includes('Ten temat jest ju\u017C w obs\u0142udze'));
  assert.ok(source.includes('Otw\u00F3rz spraw\u0119'));
});

test('FIN-15 preserves quick action blockers after handoff', () => {
  const taskStart = source.indexOf('const handleCreateQuickTask');
  const eventStart = source.indexOf('const handleCreateQuickEvent');
  const editorStart = source.indexOf('const openLinkedTaskEditor');

  assert.notEqual(taskStart, -1, 'Brak handleCreateQuickTask.');
  assert.notEqual(eventStart, -1, 'Brak handleCreateQuickEvent.');
  assert.notEqual(editorStart, -1, 'Brak openLinkedTaskEditor.');

  const taskRegion = source.slice(taskStart, eventStart);
  const eventRegion = source.slice(eventStart, editorStart);

  assert.match(taskRegion, /leadOperationalArchive/);
  assert.match(taskRegion, /Dodawaj dalsze zadania w sprawie/);
  assert.match(eventRegion, /leadOperationalArchive/);
  assert.match(eventRegion, /Dodawaj dalsze wydarzenia w sprawie/);
});
