const fs = require('fs');

const text = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');

function requireIncludes(token, label) {
  if (!text.includes(token)) {
    console.error('STAGE231H_R1D2_R15C FAIL: missing ' + label);
    process.exit(1);
  }
}

function requireNotIncludes(token, label) {
  if (text.includes(token)) {
    console.error('STAGE231H_R1D2_R15C FAIL: forbidden ' + label);
    process.exit(1);
  }
}

requireIncludes('STAGE231H_R1D2_R15C_NOTE_FOLLOWUP_BIDIRECTIONAL_LINK_AND_WORK_ROW_TITLE', 'stage marker');
requireIncludes("title: isNoteFollowUpStage231H_R1D2_R10C ? (noteFollowUpPreviewStage231H_R1D2_R11 || 'Notatka do follow-upu')", 'note text as title');
requireIncludes("subtitle: isNoteFollowUpStage231H_R1D2_R10C ? 'Follow-up po notatce'", 'follow-up label as subtitle');
requireNotIncludes("title: isNoteFollowUpStage231H_R1D2_R10C ? 'Follow-up po notatce'", 'old title order');
requireIncludes('linkedTaskIdsFromActivitiesStage231H_R1D2_R15C', 'activity taskId link map');
requireIncludes('findCaseNoteForFollowUpTaskStage231H_R1D2_R15C', 'task-to-note resolver');
requireIncludes('To jest follow-up przypięty do notatki.', 'delete warning');
requireIncludes('Notatka zostanie w panelu notatek.', 'note preserved warning');
requireIncludes('noteFollowUpDeleted', 'delete activity relation metadata');

console.log('STAGE231H_R1D2_R15C PASS: note follow-up relation and row title order are guarded.');