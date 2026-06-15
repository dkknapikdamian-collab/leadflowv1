const fs = require('fs');

const file = 'src/pages/CaseDetail.tsx';
const text = fs.readFileSync(file, 'utf8');

function requireIncludes(token, label) {
  if (!text.includes(token)) {
    console.error(`STAGE231H_R1D2_R14F FAIL: missing ${label}`);
    process.exit(1);
  }
}

function requireNotIncludes(token, label) {
  if (text.includes(token)) {
    console.error(`STAGE231H_R1D2_R14F FAIL: forbidden ${label}`);
    process.exit(1);
  }
}

requireIncludes('STAGE231H_R1D2_R14F_NOTE_DELETE_LINKED_FOLLOWUP_EXPANDED_PANEL_ARROW_SAFE', 'R14F stage marker');
requireIncludes('CASE_NOTE_PANEL_PREVIEW_LIMIT_STAGE231H_R1D2_R14F = 10', 'expanded notes panel limit 10');
requireIncludes('data-stage231h-r1d2-r14f-expanded-notes-panel="true"', 'expanded notes panel data marker');
requireNotIncludes('caseNoteItems.slice(0, 5)', 'old five-note panel limit');
requireNotIncludes('Powiązany follow-up zostaje jako osobne zadanie', 'old note delete copy');

requireIncludes('getLinkedCaseNoteFollowUpsStage231H_R1D2_R14F', 'linked follow-up resolver');
requireIncludes('sourceNoteId: noteIdStage231H_R1D2_R14F', 'sourceNoteId saved on follow-up');
requireIncludes('noteId: noteIdStage231H_R1D2_R14F', 'noteId saved on follow-up');
requireIncludes("recordActivity('case_note_follow_up_added'", 'case note follow-up activity');
requireIncludes('deleteTaskFromSupabase(taskIdStage231H_R1D2_R14F)', 'delete linked task call');
requireIncludes('Usuń notatkę i follow-up', 'delete note and follow-up option');
requireIncludes('Usuń tylko notatkę', 'delete only note option');
requireIncludes('Usunięto notatkę i powiązany follow-up.', 'success toast for linked delete');
requireIncludes('Usunięto notatkę. Follow-up został w działaniach.', 'success toast for note-only delete');

console.log('STAGE231H_R1D2_R14F PASS: linked note follow-up delete and expanded notes panel are guarded.');
