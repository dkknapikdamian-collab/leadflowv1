const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');

test('STAGE231H_R1D2_R6_R9 guard passes', () => {
  execFileSync(process.execPath, ['scripts/check-stage231h-r1d2-r6-r9-case-note-followup-notes-crud-mass-repair.cjs'], { stdio: 'pipe' });
});

test('STAGE231H_R1D2_R6_R9 uses one source map for notes and follow-up', () => {
  const text = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');
  assert.match(text, /noteSource: 'activities'/);
  assert.match(text, /taskSource: 'tasks'/);
  assert.match(text, /workspaceId: workspaceIdStage231H_R1D2_R6 \|\| undefined/);
  assert.match(text, /setTasks\(\(current\) => dedupeCaseTasks\(\[normalizedCreated, \.\.\.current\], caseId, caseData\)\)/);
  assert.doesNotMatch(text, /replace\(\/s\+\/g, ' '\)/);
});
