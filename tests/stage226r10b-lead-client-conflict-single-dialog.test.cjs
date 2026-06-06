const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}
function between(text, start, end) {
  const s = text.indexOf(start);
  assert.notEqual(s, -1, 'missing start: ' + start);
  const e = text.indexOf(end, s);
  assert.notEqual(e, -1, 'missing end: ' + end);
  return text.slice(s, e);
}
function countMatches(text, needle) {
  return text.split(needle).length - 1;
}

const leads = read('src/pages/Leads.tsx');
const pkg = JSON.parse(read('package.json'));

test('lead conflict dialog is rendered once only', () => {
  assert.equal(countMatches(leads, '<EntityConflictDialog'), 1);
  assert.equal(leads.includes('data-closeflow-lead-conflict-dialog-v25="true"'), true);
});

test('client conflict candidates cannot be restored from lead creation flow', () => {
  assert.equal(
    leads.includes("leadConflictCandidates.map((candidate) => candidate.entityType === 'client' ? { ...candidate, canRestore: false } : candidate)"),
    true,
  );
  const restoreBlock = between(leads, 'const restoreConflictCandidate = async', 'const handleCreateLead = async');
  assert.equal(restoreBlock.includes('updateClientInSupabase({ id: candidate.id, archivedAt: null })'), false);
  assert.equal(restoreBlock.includes("toast.success('Klient przywrócony');"), false);
  assert.equal(restoreBlock.includes('To nie jest ten sam rekord'), true);
});

test('lead create remains lead-only and strips stale relation ids', () => {
  const createLeadBlock = between(leads, 'const createLeadFromPreparedInput = async', 'const restoreConflictCandidate = async');
  ['clientId', 'client_id', 'linkedCaseId', 'linked_case_id', 'caseId', 'case_id'].forEach((token) => {
    assert.equal(createLeadBlock.includes('delete sanitizedPreparedLead.' + token + ';'), true, token);
  });
  assert.equal(createLeadBlock.includes('createClientInSupabase'), false);
  assert.equal(createLeadBlock.includes('createCaseInSupabase'), false);
});

test('package wires R10B guard and test', () => {
  assert.equal(pkg.scripts['check:stage226r10b-lead-client-conflict-single-dialog'], 'node scripts/check-stage226r10b-lead-client-conflict-single-dialog.cjs');
  assert.equal(pkg.scripts['test:stage226r10b-lead-client-conflict-single-dialog'], 'node --test tests/stage226r10b-lead-client-conflict-single-dialog.test.cjs');
  assert.equal(String(pkg.scripts.prebuild || '').includes('node scripts/check-stage226r10b-lead-client-conflict-single-dialog.cjs'), true);
});
