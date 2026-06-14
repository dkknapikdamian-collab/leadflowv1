const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');

test('STAGE231H_R1D2_R6_R9G guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231h-r1d2-r6-r9g-case-note-followup-notes-crud-local-tasks-guard-mass-fix.cjs'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('STAGE231H_R1D2_R6_R9G guard checks actual current/dedupe local task append', () => {
  const guard = fs.readFileSync('scripts/check-stage231h-r1d2-r6-r9e-case-note-followup-notes-crud-mass-guard-sync.cjs', 'utf8');
  assert.match(guard, /setTasks\(\(current\) => dedupeCaseTasks\(\[normalizedCreated, \.\.\.current\], caseId, caseData\)\);/);
  assert.doesNotMatch(guard, /need\(src\.includes\('setTasks\(\(previousTasks\)'\)/);
});
