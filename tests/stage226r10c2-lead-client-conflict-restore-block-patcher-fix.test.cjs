const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(path) { return fs.readFileSync(path, 'utf8'); }
function blockBetween(text, start, endRegex) {
  const s = text.indexOf(start);
  assert.notEqual(s, -1, 'missing start: ' + start);
  const rest = text.slice(s + start.length);
  const m = rest.match(endRegex);
  assert.ok(m && typeof m.index === 'number', 'missing end regex: ' + endRegex);
  return text.slice(s, s + start.length + m.index);
}

const leads = read('src/pages/Leads.tsx');
const pkg = read('package.json');

test('client candidates cannot be restored by lead conflict restore handler', () => {
  const block = blockBetween(leads, 'const restoreConflictCandidate = async (candidate: EntityConflictCandidate) => {', /\r?\n\s*const\s+handleCreateLead\s*=\s*async\s*\(/);
  assert.equal(block.includes("candidate.entityType === 'client'"), true);
  assert.equal(block.includes('Otwórz klienta albo utwórz osobnego leada'), true);
  assert.equal(block.includes('await updateClientInSupabase'), false);
  assert.equal(block.includes('await updateLeadInSupabase'), true);
});

test('client candidates are marked non-restorable before state is opened', () => {
  assert.equal(leads.includes("candidate.entityType === 'client' ? { ...candidate, canRestore: false } : candidate"), true);
});

test('lead conflict dialog is still single instance', () => {
  assert.equal((leads.match(/<EntityConflictDialog\b/g) || []).length, 1);
});

test('package wires R10C2 scripts and prebuild guard', () => {
  assert.equal(pkg.includes('check:stage226r10c2-lead-client-conflict-restore-block-patcher-fix'), true);
  assert.equal(pkg.includes('test:stage226r10c2-lead-client-conflict-restore-block-patcher-fix'), true);
  assert.equal(pkg.includes('node scripts/check-stage226r10c2-lead-client-conflict-restore-block-patcher-fix.cjs'), true);
});
