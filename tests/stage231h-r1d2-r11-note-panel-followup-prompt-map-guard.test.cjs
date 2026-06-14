const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

test('STAGE231H_R1D2_R11 guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231h-r1d2-r11-note-panel-followup-prompt-map-guard.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('STAGE231H_R1D2_R11 maps all note sources into one follow-up prompt contract', () => {
  const caseText = fs.readFileSync(path.join(process.cwd(), 'src/pages/CaseDetail.tsx'), 'utf8');
  assert.match(caseText, /setPendingNoteFollowUp\(\{ note: cleanNote, createdAt \}\)/, 'dictation note must still open follow-up prompt');
  assert.match(caseText, /setPendingNoteFollowUp\(\{ note: savedNotePreviewStage231H_R1D2_R11/, 'shared quick note must open follow-up prompt');
  assert.match(caseText, /caseNoteItems\.slice\(0, 5\)/, 'notes panel must show five notes');
  assert.match(caseText, /noteFollowUpPreviewByTaskStage231H_R1D2_R11/, 'follow-up preview must be mapped from activity payload to task UI');
});
