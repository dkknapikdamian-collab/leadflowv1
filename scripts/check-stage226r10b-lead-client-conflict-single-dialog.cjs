const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(rel) {
  const fullPath = path.join(root, rel);
  if (!fs.existsSync(fullPath)) throw new Error('Missing file: ' + rel);
  return fs.readFileSync(fullPath, 'utf8');
}
function fail(message) {
  throw new Error('STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG_GUARD_FAIL: ' + message);
}
function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(label + ' missing token: ' + needle);
}
function forbidText(text, needle, label) {
  if (text.includes(needle)) fail(label + ' forbidden token present: ' + needle);
}
function between(text, start, end, label) {
  const s = text.indexOf(start);
  if (s < 0) fail(label + ' missing start: ' + start);
  const e = text.indexOf(end, s);
  if (e < 0) fail(label + ' missing end: ' + end);
  return text.slice(s, e);
}
function countMatches(text, needle) {
  return text.split(needle).length - 1;
}

const leads = read('src/pages/Leads.tsx');
const pkg = JSON.parse(read('package.json'));

requireText(leads, 'STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG', 'Leads R10B marker');
const conflictDialogCount = countMatches(leads, '<EntityConflictDialog');
if (conflictDialogCount !== 1) fail('Leads.tsx must render exactly one EntityConflictDialog, found ' + conflictDialogCount);
requireText(leads, 'data-closeflow-lead-conflict-dialog-v25="true"', 'single retained lead conflict wrapper');
requireText(
  leads,
  "leadConflictCandidates.map((candidate) => candidate.entityType === 'client' ? { ...candidate, canRestore: false } : candidate)",
  'client candidates cannot expose restore action in lead-create conflict dialog',
);

const restoreBlock = between(leads, 'const restoreConflictCandidate = async', 'const handleCreateLead = async', 'restore conflict block');
forbidText(restoreBlock, "await updateClientInSupabase({ id: candidate.id, archivedAt: null });", 'lead create conflict must not restore clients');
forbidText(restoreBlock, "toast.success('Klient przywrócony');", 'lead create conflict must not report restored client');
requireText(restoreBlock, 'To nie jest ten sam rekord', 'client conflict copy distinguishes client from lead');
requireText(restoreBlock, 'Otwórz klienta albo utwórz osobnego leada', 'client conflict copy gives safe actions');
requireText(leads, 'onRestore={restoreConflictCandidate}', 'lead restore flow remains wired for lead candidates');

const createLeadBlock = between(leads, 'const createLeadFromPreparedInput = async', 'const restoreConflictCandidate = async', 'create lead block');
forbidText(createLeadBlock, 'createClientInSupabase', 'lead create path must not create client');
forbidText(createLeadBlock, 'createCaseInSupabase', 'lead create path must not create case');
requireText(createLeadBlock, 'delete sanitizedPreparedLead.clientId;', 'clientId stripped');
requireText(createLeadBlock, 'delete sanitizedPreparedLead.client_id;', 'client_id stripped');
requireText(createLeadBlock, 'delete sanitizedPreparedLead.linkedCaseId;', 'linkedCaseId stripped');
requireText(createLeadBlock, 'delete sanitizedPreparedLead.linked_case_id;', 'linked_case_id stripped');
requireText(createLeadBlock, 'delete sanitizedPreparedLead.caseId;', 'caseId stripped');
requireText(createLeadBlock, 'delete sanitizedPreparedLead.case_id;', 'case_id stripped');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage226r10b-lead-client-conflict-single-dialog.cjs', 'prebuild includes R10B guard');
if (pkg.scripts['check:stage226r10b-lead-client-conflict-single-dialog'] !== 'node scripts/check-stage226r10b-lead-client-conflict-single-dialog.cjs') fail('missing package check script');
if (pkg.scripts['test:stage226r10b-lead-client-conflict-single-dialog'] !== 'node --test tests/stage226r10b-lead-client-conflict-single-dialog.test.cjs') fail('missing package test script');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG',
  guard: 'check:stage226r10b-lead-client-conflict-single-dialog',
}, null, 2));
