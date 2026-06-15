const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const cp = require('node:child_process');

test('R15C guard passes', () => {
  cp.execFileSync(process.execPath, ['scripts/check-stage231h-r1d2-r15c-note-followup-bidirectional-link-and-work-row-title.cjs'], { stdio: 'pipe' });
});

test('R15C runtime keeps note text above follow-up label and warns on linked delete', () => {
  const text = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');
  assert.match(text, /title:\s*isNoteFollowUpStage231H_R1D2_R10C\s*\?\s*\(noteFollowUpPreviewStage231H_R1D2_R11/);
  assert.ok(text.includes("subtitle: isNoteFollowUpStage231H_R1D2_R10C ? 'Follow-up po notatce'"));
  assert.ok(text.includes('linkedTaskIdsFromActivitiesStage231H_R1D2_R15C'));
  assert.ok(text.includes('To jest follow-up przypięty do notatki.'));
  assert.ok(text.includes('Notatka zostanie w panelu notatek.'));
});