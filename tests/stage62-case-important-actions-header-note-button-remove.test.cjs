const assert = require('assert');
const fs = require('fs');
const path = require('path');
const test = require('node:test');
const marker = 'STAGE62_CASE_IMPORTANT_ACTIONS_HEADER_NOTE_BUTTON_REMOVE';
function read(file) { return fs.readFileSync(path.join(process.cwd(), file), 'utf8'); }
function findButtonBlocks(content, needle) {
  const blocks = [];
  let searchFrom = 0;
  while (true) {
    const needleAt = content.indexOf(needle, searchFrom);
    if (needleAt === -1) break;
    const start = content.lastIndexOf('<Button', needleAt);
    const end = content.indexOf('</Button>', needleAt);
    if (start === -1 || end === -1) { searchFrom = needleAt + needle.length; continue; }
    const finalEnd = end + '</Button>'.length;
    blocks.push(content.slice(start, finalEnd));
    searchFrom = finalEnd;
  }
  return blocks;
}
test('STAGE62_CASE_IMPORTANT_ACTIONS_HEADER_NOTE_BUTTON_REMOVE: removes only the header note button', () => {
  const page = read('src/pages/CaseDetail.tsx');
  assert.ok(page.includes(marker), 'missing Stage62 marker');
  assert.ok(page.includes('data-case-create-action="note"'), 'missing retained create-panel note button');
  const noteButtons = findButtonBlocks(page, 'openCaseNoteDialog').filter((block) => block.includes('Dodaj notat'));
  const headerButtons = noteButtons.filter((block) => !block.includes('data-case-create-action="note"'));
  const panelButtons = noteButtons.filter((block) => block.includes('data-case-create-action="note"'));
  assert.equal(headerButtons.length, 0, 'header/top Dodaj notatkę button must be removed');
  assert.equal(panelButtons.length, 1, 'exactly one create-panel Dodaj notatkę button must remain');
});
test('STAGE62_CASE_IMPORTANT_ACTIONS_HEADER_NOTE_BUTTON_REMOVE: verify chain includes Stage62', () => {
  const pkg = read('package.json');
  assert.ok(pkg.includes('check:stage62-case-important-actions-header-note-button-remove'), 'missing Stage62 check script');
  assert.ok(pkg.includes('check:stage61-case-note-action-button-swap && npm.cmd run check:stage62-case-important-actions-header-note-button-remove && npm.cmd run verify:client-detail-operational-ui'), 'verify chain should run Stage62 after Stage61');
});
