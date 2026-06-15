const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('fs');

const guardPath = 'scripts/check-stage231h-r1d2-r14-note-delete-linked-followup-and-expanded-notes-panel.cjs';

test('R14 guard exists and covers linked note follow-up deletion', () => {
  const guard = fs.readFileSync(guardPath, 'utf8');
  assert.match(guard, /noteId/);
  assert.match(guard, /sourceNoteId/);
  assert.match(guard, /deleteTaskFromSupabase/);
  assert.match(guard, /Usuń notatkę i follow-up/);
  assert.match(guard, /Usuń tylko notatkę/);
});

test('R14 guard covers expanded notes panel and blocks old five-note limit', () => {
  const guard = fs.readFileSync(guardPath, 'utf8');
  assert.match(guard, /CASE_NOTE_PANEL_PREVIEW_LIMIT_STAGE231H_R14 = 10/);
  assert.match(guard, /caseNoteItems\.slice\(0, 5\)/);
  assert.match(guard, /data-stage231h-r1d2-r14-expanded-notes-panel/);
});
