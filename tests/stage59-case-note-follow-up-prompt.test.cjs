const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const marker = 'STAGE59_CASE_NOTE_FOLLOW_UP_PROMPT';
function read(file) {
  return fs.readFileSync(path.join(process.cwd(), file), 'utf8');
}

function expectIncludes(source, needle, label) {
  assert.ok(source.includes(needle), 'missing ' + label + ': ' + needle);
}

test('STAGE59_CASE_NOTE_FOLLOW_UP_PROMPT: case note save exposes a follow-up prompt and creates linked follow-up tasks', () => {
  const page = read('src/pages/CaseDetail.tsx');
  expectIncludes(page, marker, 'Stage59 marker');
  expectIncludes(page, 'type CaseNoteFollowUpChoice', 'follow-up choice type');
  expectIncludes(page, 'pendingNoteFollowUp', 'pending follow-up state');
  expectIncludes(page, 'buildCaseNoteFollowUpIso', 'follow-up date helper');
  expectIncludes(page, 'handleCreateCaseNoteFollowUp', 'create follow-up handler');
  expectIncludes(page, 'insertTaskToSupabase({', 'task creation call');
  expectIncludes(page, "type: 'follow_up'", 'follow-up task type');
  expectIncludes(page, 'caseId,', 'case linkage');
  expectIncludes(page, 'clientId: caseData?.clientId || null', 'client linkage');
  expectIncludes(page, 'leadId: caseData?.leadId || null', 'lead linkage');
  expectIncludes(page, "recordActivity('case_note_follow_up_added'", 'follow-up activity');
  expectIncludes(page, 'setPendingNoteFollowUp({ note, createdAt: new Date().toISOString() });', 'note save opens prompt');
  expectIncludes(page, 'data-case-note-follow-up-prompt="true"', 'follow-up prompt panel');
  expectIncludes(page, 'data-case-note-follow-up-choice="today"', 'today choice');
  expectIncludes(page, 'data-case-note-follow-up-choice="tomorrow"', 'tomorrow choice');
  expectIncludes(page, 'data-case-note-follow-up-choice="two_days"', 'two-day choice');
  expectIncludes(page, 'data-case-note-follow-up-choice="week"', 'week choice');
  expectIncludes(page, 'data-case-note-follow-up-choice="custom"', 'custom choice');
  expectIncludes(page, 'data-case-note-follow-up-custom-input="true"', 'custom date input');
});

test('STAGE59_CASE_NOTE_FOLLOW_UP_PROMPT: scoped CSS keeps the prompt readable', () => {
  const css = read('src/styles/visual-stage13-case-detail-vnext.css');
  expectIncludes(css, marker, 'Stage59 CSS marker');
  expectIncludes(css, '.case-detail-vnext-page .case-detail-note-follow-up-panel', 'follow-up panel CSS');
  expectIncludes(css, '.case-detail-vnext-page .case-detail-note-follow-up-actions', 'follow-up actions CSS');
});
