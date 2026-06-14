const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');

test('STAGE231H_R1D2_R4 guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231h-r1d2-r4-notes-panel-dictation-button.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test('STAGE231H_R1D2_R4 removes the visible deprecated notes-panel dictation copy', () => {
  const caseDetail = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');
  assert.equal(caseDetail.includes('Notatka głosowa — wkrótce'), false);
  assert.equal(caseDetail.includes('data-stage231h-r1d2-notes-panel-voice-note-button="true"'), true);
});
