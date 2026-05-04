const fs = require('fs');
const path = require('path');
const marker = 'STAGE61_CASE_NOTE_ACTION_BUTTON_SWAP';
function read(file) { return fs.readFileSync(path.join(process.cwd(), file), 'utf8'); }
function pass(message) { console.log('PASS ' + message); }
function fail(message) { console.error('FAIL ' + message); process.exit(1); }
function contains(file, needle, label) {
  const value = read(file);
  if (!value.includes(needle)) fail(file + ': missing ' + label + ' -> ' + needle);
  pass(file + ': contains ' + label);
}
function notContains(file, needle, label) {
  const value = read(file);
  if (value.includes(needle)) fail(file + ': forbidden ' + label + ' -> ' + needle);
  pass(file + ': does not contain ' + label);
}
function countIn(value, needle) {
  return value.split(needle).length - 1;
}
function assertNoteButtonPlacement() {
  const page = read('src/pages/CaseDetail.tsx');
  const actionsPanel = 'data-case-create-actions-panel="true"';
  const noteAction = 'data-case-create-action="note"';
  if (!page.includes(actionsPanel)) fail('src/pages/CaseDetail.tsx: missing create actions panel');
  if (!page.includes(noteAction)) fail('src/pages/CaseDetail.tsx: missing restored note action button in create actions panel');
  const panelIndex = page.indexOf(actionsPanel);
  const noteIndex = page.indexOf(noteAction);
  if (noteIndex < panelIndex) fail('src/pages/CaseDetail.tsx: note action appears before create actions panel');
  pass('src/pages/CaseDetail.tsx: restored note action lives in create actions panel');

  const noteDialogCalls = countIn(page, 'openCaseNoteDialog');
  if (noteDialogCalls < 2) fail('src/pages/CaseDetail.tsx: expected openCaseNoteDialog helper and one visible action');
  pass('src/pages/CaseDetail.tsx: note dialog helper/action retained');

  const importantHeaderIndex = page.indexOf('NajwaĹĽniejsze dziaĹ‚ania');
  const workListIndex = page.indexOf('data-case-work-list');
  if (importantHeaderIndex >= 0 && workListIndex > importantHeaderIndex) {
    const headerSlice = page.slice(importantHeaderIndex, workListIndex);
    if (headerSlice.includes('openCaseNoteDialog') || headerSlice.includes('data-case-create-action="note"')) {
      fail('src/pages/CaseDetail.tsx: duplicate top note action still appears in important actions header');
    }
    pass('src/pages/CaseDetail.tsx: duplicate top note action absent from important actions header');
  } else {
    pass('src/pages/CaseDetail.tsx: important actions header slice not found, skipped header-only placement check');
  }
}
contains('src/pages/CaseDetail.tsx', marker, 'Stage61 TSX marker');
contains('src/pages/CaseDetail.tsx', 'data-case-create-action="task"', 'task action button retained');
contains('src/pages/CaseDetail.tsx', 'data-case-create-action="event"', 'event action button retained');
contains('src/pages/CaseDetail.tsx', 'data-case-create-action="note"', 'note action button restored');
contains('src/pages/CaseDetail.tsx', 'const openCaseNoteDialog = () =>', 'note dialog helper retained');
contains('src/pages/CaseDetail.tsx', 'setIsAddNoteOpen(true)', 'note modal opener retained');
contains('src/pages/CaseDetail.tsx', 'pendingNoteFollowUp', 'Stage59 follow-up prompt retained');
notContains('src/pages/CaseDetail.tsx', 'Zadania, wydarzenia, braki i notatki powiÄ…zane ze sprawÄ….', 'duplicated related-items helper copy');
notContains('src/pages/CaseDetail.tsx', 'Zadania, wydarzenia, braki i notatki powiazane ze sprawa.', 'duplicated related-items helper copy without diacritics');
assertNoteButtonPlacement();
contains('src/styles/visual-stage13-case-detail-vnext.css', marker, 'Stage61 CSS marker');
contains('package.json', 'check:stage61-case-note-action-button-swap', 'Stage61 check script');
contains('package.json', 'test:stage61-case-note-action-button-swap', 'Stage61 test script');
contains('package.json', 'check:stage60-case-action-copy-note-dedupe && npm.cmd run check:stage61-case-note-action-button-swap && npm.cmd run verify:client-detail-operational-ui', 'Stage61 included in case operational verify');
contains('tests/stage61-case-note-action-button-swap.test.cjs', marker, 'Stage61 test marker');
contains('docs/release/STAGE61_CASE_NOTE_ACTION_BUTTON_SWAP_2026-05-04.md', marker, 'Stage61 release marker');
console.log('PASS ' + marker);
