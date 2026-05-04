const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');
const marker = 'STAGE61_CASE_NOTE_ACTION_BUTTON_SWAP';
function read(file) { return fs.readFileSync(path.join(process.cwd(), file), 'utf8'); }
function expectIncludes(value, needle, label) {
  assert.ok(value.includes(needle), `missing ${label}: ${needle}`);
}
function expectNotIncludes(value, needle, label) {
  assert.ok(!value.includes(needle), `forbidden ${label}: ${needle}`);
}
function countIn(value, needle) {
  return value.split(needle).length - 1;
}
test('STAGE61_CASE_NOTE_ACTION_BUTTON_SWAP: note action is restored in create actions panel and removed from top header', () => {
  const page = read('src/pages/CaseDetail.tsx');
  expectIncludes(page, marker, 'Stage61 marker');
  expectIncludes(page, 'data-case-create-actions-panel="true"', 'create actions panel');
  expectIncludes(page, 'data-case-create-action="task"', 'task action');
  expectIncludes(page, 'data-case-create-action="event"', 'event action');
  expectIncludes(page, 'data-case-create-action="note"', 'restored note action');
  expectIncludes(page, 'const openCaseNoteDialog = () =>', 'note dialog helper');
  expectIncludes(page, 'setIsAddNoteOpen(true)', 'note modal opener');
  expectIncludes(page, 'pendingNoteFollowUp', 'Stage59 follow-up prompt retained');
  expectNotIncludes(page, 'Zadania, wydarzenia, braki i notatki powiÄ…zane ze sprawÄ….', 'duplicated helper copy');
  expectNotIncludes(page, 'Zadania, wydarzenia, braki i notatki powiazane ze sprawa.', 'duplicated helper copy without diacritics');

  const panelIndex = page.indexOf('data-case-create-actions-panel="true"');
  const noteIndex = page.indexOf('data-case-create-action="note"');
  assert.ok(noteIndex > panelIndex, 'note action should be placed inside/after the create actions panel');
  assert.ok(countIn(page, 'openCaseNoteDialog') >= 2, 'note dialog helper and at least one UI action should remain');

  const headerIndex = page.indexOf('NajwaĹĽniejsze dziaĹ‚ania');
  const workListIndex = page.indexOf('data-case-work-list');
  if (headerIndex >= 0 && workListIndex > headerIndex) {
    const headerSlice = page.slice(headerIndex, workListIndex);
    assert.ok(!headerSlice.includes('openCaseNoteDialog'), 'top important actions header should not contain the note button');
    assert.ok(!headerSlice.includes('data-case-create-action="note"'), 'top important actions header should not contain the note action marker');
  }
});

test('STAGE61_CASE_NOTE_ACTION_BUTTON_SWAP: guard chain includes Stage61', () => {
  const pkg = read('package.json');
  const check = read('scripts/check-stage61-case-note-action-button-swap.cjs');
  const css = read('src/styles/visual-stage13-case-detail-vnext.css');
  expectIncludes(pkg, 'check:stage61-case-note-action-button-swap', 'Stage61 check script');
  expectIncludes(pkg, 'test:stage61-case-note-action-button-swap', 'Stage61 test script');
  expectIncludes(pkg, 'check:stage60-case-action-copy-note-dedupe && npm.cmd run check:stage61-case-note-action-button-swap && npm.cmd run check:stage62-case-important-actions-header-note-button-remove && npm.cmd run check:stage63-case-main-note-header-button-remove && npm.cmd run verify:client-detail-operational-ui', 'Stage61 verify chain');
  expectIncludes(check, marker, 'Stage61 check marker');
  expectIncludes(css, marker, 'Stage61 CSS marker');
});
