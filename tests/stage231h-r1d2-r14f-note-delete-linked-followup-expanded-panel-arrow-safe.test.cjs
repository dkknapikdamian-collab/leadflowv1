const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('fs');

test('R14F guard contains linked follow-up and expanded panel checks', () => {
  const guard = fs.readFileSync('scripts/check-stage231h-r1d2-r14f-note-delete-linked-followup-expanded-panel-arrow-safe.cjs', 'utf8');
  assert.match(guard, /sourceNoteId/);
  assert.match(guard, /deleteTaskFromSupabase/);
  assert.match(guard, /Usuń notatkę i follow-up/);
  assert.match(guard, /CASE_NOTE_PANEL_PREVIEW_LIMIT/);
});

test('R14F runtime contains noteId source mapping and no old five-note slice', () => {
  const source = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');
  assert.match(source, /CASE_NOTE_PANEL_PREVIEW_LIMIT_STAGE231H_R1D2_R14F = 10/);
  assert.doesNotMatch(source, /caseNoteItems\.slice\(0,\s*5\)/);
  assert.match(source, /sourceNoteId: noteIdStage231H_R1D2_R14F/);
  assert.match(source, /deleteTaskFromSupabase\(taskIdStage231H_R1D2_R14F\)/);
});
