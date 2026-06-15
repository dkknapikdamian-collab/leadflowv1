const fs = require('fs');

function read(file) {
  if (!fs.existsSync(file)) throw new Error('MISSING_FILE:' + file);
  return fs.readFileSync(file, 'utf8');
}
function requireIncludes(text, token, label) {
  if (!text.includes(token)) {
    console.error(`STAGE231H_R1D2_R14 FAIL: missing ${label}`);
    process.exit(1);
  }
}
function requireNotIncludes(text, token, label) {
  if (text.includes(token)) {
    console.error(`STAGE231H_R1D2_R14 FAIL: forbidden ${label}`);
    process.exit(1);
  }
}

const caseDetail = read('src/pages/CaseDetail.tsx');

requireIncludes(caseDetail, 'STAGE231H_R1D2_R14_NOTE_DELETE_LINKED_FOLLOWUP_AND_EXPANDED_NOTES_PANEL', 'stage marker');
requireIncludes(caseDetail, 'CASE_NOTE_PANEL_PREVIEW_LIMIT_STAGE231H_R14 = 10', 'notes panel limit 10');
requireIncludes(caseDetail, 'data-stage231h-r1d2-r14-expanded-notes-panel="true"', 'expanded notes panel marker');
requireIncludes(caseDetail, 'data-stage231h-r1d2-r14-notes-scroll="true"', 'notes panel scroll marker');
requireNotIncludes(caseDetail, 'caseNoteItems.slice(0, 5)', 'old 5-note panel limit');
requireNotIncludes(caseDetail, 'Powiązany follow-up zostaje jako osobne zadanie', 'old orphan-follow-up delete copy');

requireIncludes(caseDetail, 'noteId: sourceNoteIdStage231H_R14 || null', 'noteId in note follow-up task/activity payload');
requireIncludes(caseDetail, 'sourceNoteId: sourceNoteIdStage231H_R14 || null', 'sourceNoteId in note follow-up task/activity payload');
requireIncludes(caseDetail, 'findLinkedCaseNoteFollowUpTasksStage231H_R14', 'linked follow-up finder');
requireIncludes(caseDetail, 'Usuń notatkę i follow-up', 'delete note and linked follow-up option');
requireIncludes(caseDetail, 'Usuń tylko notatkę', 'delete note only option');
requireIncludes(caseDetail, 'Ta notatka ma przypięty follow-up', 'linked follow-up warning');
requireIncludes(caseDetail, 'deleteTaskFromSupabase(taskId)', 'delete linked task via source-of-truth helper');
requireIncludes(caseDetail, 'setTasks((current) => current.filter', 'local task prune after linked delete');
requireIncludes(caseDetail, 'Usunięto notatkę i powiązany follow-up.', 'specific delete-both toast');
requireIncludes(caseDetail, 'Usunięto notatkę. Follow-up został w działaniach.', 'specific note-only toast');

console.log('STAGE231H_R1D2_R14 PASS: linked note follow-up deletion and expanded notes panel are guarded.');
