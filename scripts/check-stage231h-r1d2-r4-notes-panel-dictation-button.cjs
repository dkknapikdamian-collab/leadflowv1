const fs = require('fs');
const path = require('path');

const root = process.cwd();
function assert(condition, message) {
  if (!condition) {
    console.error('STAGE231H_R1D2_R4 FAIL:', message);
    process.exit(1);
  }
}
function read(rel) {
  const file = path.join(root, rel);
  assert(fs.existsSync(file), `missing file: ${rel}`);
  return fs.readFileSync(file, 'utf8');
}

const caseDetail = read('src/pages/CaseDetail.tsx');
assert(caseDetail.includes('STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME'), 'missing R1D2 runtime marker');
assert(caseDetail.includes('data-stage231h-r1d2-notes-panel-voice-note-button="true"'), 'notes panel voice button must have R1D2 marker');
assert(caseDetail.includes('onClick={handleStartCaseNoteDictationStage231H_R1D2}'), 'notes panel voice button must call R1D2 handler');
assert(caseDetail.includes("caseNoteDictationStatusStage231H_R1D2 === 'listening'"), 'button must show listening state');
assert(caseDetail.includes('data-stage231h-r1d2-notes-panel-voice-note-status="true"'), 'notes panel must expose dictation status/error');
for (const forbidden of ['Notatka głosowa — wkrótce', 'data-stage219-dictate-note-deprecated="true"', 'data-stage231h-r1b-dictation-disabled="true"', 'title="Notatka głosowa nie jest jeszcze podłączona"']) {
  assert(!caseDetail.includes(forbidden), `deprecated dictation token remains: ${forbidden}`);
}
const notesPanelIndex = caseDetail.indexOf('data-stage219-case-notes-actions="true"');
const notesButtonIndex = caseDetail.indexOf('data-stage231h-r1d2-notes-panel-voice-note-button="true"');
assert(notesPanelIndex >= 0 && notesButtonIndex > notesPanelIndex, 'R1D2 notes button must be inside/after notes panel actions');
const notesButtonBlock = caseDetail.slice(notesButtonIndex - 300, notesButtonIndex + 700);
assert(!/\bdisabled\b/.test(notesButtonBlock), 'notes panel R1D2 voice button must not be disabled');
assert(!/aria-disabled/.test(notesButtonBlock), 'notes panel R1D2 voice button must not be aria-disabled');

for (const rel of [
  '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/08_CHANGELOG_AI.md',
  '_project/10_PROJECT_TIMELINE.md',
  '_project/13_TEST_HISTORY.md',
  '_project/runs/STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON.md',
  '_project/obsidian_updates/2026-06-14_STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON.md',
]) {
  const content = read(rel);
  assert(content.includes('STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON'), `missing R4 marker in ${rel}`);
}

console.log('STAGE231H_R1D2_R4 PASS: notes panel dictation button is live and guarded.');
