const fs = require('node:fs');

function read(path) { return fs.readFileSync(path, 'utf8'); }
function fail(message) { throw new Error('STAGE226R10C2_LEAD_CLIENT_CONFLICT_RESTORE_BLOCK_PATCHER_FIX_GUARD_FAIL: ' + message); }
function requireText(text, token, label) { if (!text.includes(token)) fail(label + ' missing token: ' + token); }
function forbidText(text, token, label) { if (text.includes(token)) fail(label + ' forbidden token present: ' + token); }
function blockBetween(text, start, endRegex, label) {
  const s = text.indexOf(start);
  if (s < 0) fail(label + ' start missing');
  const rest = text.slice(s + start.length);
  const m = rest.match(endRegex);
  if (!m || typeof m.index !== 'number') fail(label + ' end missing');
  return text.slice(s, s + start.length + m.index);
}

const leads = read('src/pages/Leads.tsx');
const pkg = read('package.json');

const restoreBlock = blockBetween(
  leads,
  'const restoreConflictCandidate = async (candidate: EntityConflictCandidate) => {',
  /\r?\n\s*const\s+handleCreateLead\s*=\s*async\s*\(/,
  'restoreConflictCandidate'
);

requireText(restoreBlock, "candidate.entityType === 'client'", 'client conflict restore block');
requireText(restoreBlock, 'Otwórz klienta albo utwórz osobnego leada', 'client conflict restore UX copy');
requireText(restoreBlock, 'await updateLeadInSupabase', 'lead restore remains available');
forbidText(restoreBlock, 'await updateClientInSupabase', 'lead create conflict must not restore clients');
forbidText(leads, 'await updateClientInSupabase({ id: candidate.id, archivedAt: null });', 'client restore exact forbidden call');

requireText(leads, "candidate.entityType === 'client' ? { ...candidate, canRestore: false } : candidate", 'client conflict candidates are sanitized before state');
requireText(leads, 'STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG', 'R10B marker remains');

const conflictDialogCount = (leads.match(/<EntityConflictDialog\b/g) || []).length;
if (conflictDialogCount !== 1) fail('expected exactly one EntityConflictDialog in Leads.tsx, got ' + conflictDialogCount);

requireText(pkg, 'check:stage226r10c2-lead-client-conflict-restore-block-patcher-fix', 'package check script');
requireText(pkg, 'test:stage226r10c2-lead-client-conflict-restore-block-patcher-fix', 'package test script');
requireText(pkg, 'node scripts/check-stage226r10c2-lead-client-conflict-restore-block-patcher-fix.cjs', 'prebuild R10C2 guard');

console.log(JSON.stringify({ ok: true, stage: 'STAGE226R10C2_LEAD_CLIENT_CONFLICT_RESTORE_BLOCK_PATCHER_FIX' }, null, 2));
