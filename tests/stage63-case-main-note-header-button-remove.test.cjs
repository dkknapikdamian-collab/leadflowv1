const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');
const marker = 'STAGE63_CASE_MAIN_NOTE_HEADER_BUTTON_REMOVE';
function read(file) { return fs.readFileSync(path.join(process.cwd(), file), 'utf8'); }
function findTagBlocks(value, tagName) { const startToken = '<' + tagName; const endToken = '</' + tagName + '>'; const blocks = []; let index = 0; while (index < value.length) { const start = value.indexOf(startToken, index); if (start === -1) break; const end = value.indexOf(endToken, start); if (end === -1) break; blocks.push(value.slice(start, end + endToken.length)); index = end + endToken.length; } return blocks; }
function containsNoteText(block) { return block.includes('Dodaj notat') || block.includes('Dodaj notatk') || block.includes('notatkę') || block.includes('notatke'); }
function isCreatePanelNoteAction(block) { return block.includes('data-case-create-action="note"') || block.includes("data-case-create-action='note'"); }
function hasOpenNoteIntent(block) { return block.includes('openCaseNoteDialog') || block.includes('setIsAddNoteOpen(true)'); }
test(marker + ': only create-panel note button remains', () => {
  const page = read('src/pages/CaseDetail.tsx');
  assert.ok(page.includes(marker));
  assert.ok(page.includes('data-case-create-action="note"'));
  assert.ok(page.includes('const openCaseNoteDialog = () =>'));
  assert.ok(!page.includes('Zadania, wydarzenia, braki i notatki powiązane ze sprawą.'));
  const blocks = [...findTagBlocks(page, 'Button'), ...findTagBlocks(page, 'button')];
  const createPanel = blocks.filter((block) => isCreatePanelNoteAction(block));
  assert.equal(createPanel.length, 1, 'one create-panel note action should remain');
  const forbidden = blocks.filter((block) => containsNoteText(block) && hasOpenNoteIntent(block) && !isCreatePanelNoteAction(block));
  assert.equal(forbidden.length, 0, 'header/main note button outside create panel must be removed');
});
test(marker + ': verify chain includes Stage63', () => {
  const pkg = read('package.json');
  assert.ok(pkg.includes('check:stage62-case-important-actions-header-note-button-remove && npm.cmd run check:stage63-case-main-note-header-button-remove && npm.cmd run verify:client-detail-operational-ui'));
});
