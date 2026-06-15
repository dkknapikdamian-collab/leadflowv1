const fs = require('fs');
const path = require('path');

function read(rel) {
  const file = path.join(process.cwd(), rel);
  if (!fs.existsSync(file)) throw new Error('MISSING_FILE:' + rel);
  return fs.readFileSync(file, 'utf8');
}
function requireIncludes(text, token, label) {
  if (!text.includes(token)) throw new Error('STAGE231H_R1D2_R11 FAIL: missing ' + label);
}
function requireNotIncludes(text, token, label) {
  if (text.includes(token)) throw new Error('STAGE231H_R1D2_R11 FAIL: forbidden ' + label);
}

const stage = 'STAGE231H_R1D2_R11_NOTE_PANEL_FOLLOWUP_PROMPT_MAP_GUARD';
const caseText = read('src/pages/CaseDetail.tsx');
const noteDialogText = read('src/components/ContextNoteDialog.tsx');

requireIncludes(caseText, stage, 'R11 CaseDetail stage marker');
requireIncludes(caseText, 'data-case-notes-preview-limit="5"', 'notes panel preview limit 5');
requireIncludes(caseText, 'caseNoteItems.slice(0, 5)', 'notes panel renders five latest notes');
requireIncludes(caseText, '<p title={note.body}>{note.body}</p>', 'note row full text hover title');
requireIncludes(caseText, 'setPendingNoteFollowUp({ note: savedNotePreviewStage231H_R1D2_R11', 'quick/shared note opens same follow-up prompt');
requireIncludes(caseText, 'notePreview: notePreviewStage231H_R1D2_R10C', 'follow-up task carries note preview');
requireIncludes(caseText, 'description: notePreviewStage231H_R1D2_R10C', 'follow-up task carries note preview in description for UI');
requireIncludes(caseText, "payload: { kind: 'case_note_follow_up', notePreview: notePreviewStage231H_R1D2_R10C }", 'follow-up task payload carries note preview');
requireIncludes(caseText, 'getTaskNoteFollowUpPreviewStage231H_R1D2_R11', 'task note follow-up preview helper');
requireIncludes(caseText, 'noteFollowUpPreviewByTaskStage231H_R1D2_R11', 'activity-to-task preview source map');
requireIncludes(caseText, 'openTasksWithNoteFollowUpPreviewStage231H_R1D2_R11', 'open tasks enriched before work item build');
requireIncludes(caseText, "subtitle: isNoteFollowUpStage231H_R1D2_R10C ? (noteFollowUpPreviewStage231H_R1D2_R11 || 'Notatka Â· follow-up przypiÄ™ty do sprawy')", 'work item subtitle uses note preview fallback');
requireNotIncludes(caseText, "subtitle: isNoteFollowUpStage231H_R1D2_R10C ? 'Notatka Â· follow-up przypiÄ™ty do sprawy'", 'old static follow-up subtitle');

requireIncludes(noteDialogText, 'STAGE231H_R1D2_R11_CONTEXT_NOTE_FOLLOWUP_HANDOFF', 'ContextNoteDialog R11 handoff marker');
requireIncludes(noteDialogText, 'onSaved?: (savedRecord?: unknown) => void | Promise<void>', 'ContextNoteDialog passes saved record contract');
if (!noteDialogText.includes('await onSaved?.(createdNote || input)') && !noteDialogText.includes('onSaved?.(savedRecord')) {
  throw new Error('STAGE231H_R1D2_R11 FAIL: missing ContextNoteDialog sends created note/savedRecord to host');
}

for (const rel of [
  '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
  '_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/08_CHANGELOG_AI.md',
  '_project/10_PROJECT_TIMELINE.md',
  '_project/13_TEST_HISTORY.md',
]) {
  requireIncludes(read(rel), stage, rel + ' ledger marker');
}

console.log('STAGE231H_R1D2_R11 PASS: note panel, quick-note follow-up prompt and note preview mapping are guarded.');
