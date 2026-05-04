const fs = require('fs');
const path = require('path');
const marker = 'STAGE62_CASE_IMPORTANT_ACTIONS_HEADER_NOTE_BUTTON_REMOVE';
function read(file) { return fs.readFileSync(path.join(process.cwd(), file), 'utf8'); }
function pass(message) { console.log('PASS ' + message); }
function fail(message) { console.error('FAIL ' + message); process.exit(1); }
function contains(file, needle, label) { const value = read(file); if (!value.includes(needle)) fail(file + ': missing ' + label + ' -> ' + needle); pass(file + ': contains ' + label); }
function notContains(file, needle, label) { const value = read(file); if (value.includes(needle)) fail(file + ': forbidden ' + label + ' -> ' + needle); pass(file + ': does not contain ' + label); }
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
const page = read('src/pages/CaseDetail.tsx');
contains('src/pages/CaseDetail.tsx', marker, 'Stage62 TSX marker');
contains('src/pages/CaseDetail.tsx', 'data-case-create-action="note"', 'note action retained in create panel');
contains('src/pages/CaseDetail.tsx', 'openCaseNoteDialog', 'note dialog helper retained');
notContains('src/pages/CaseDetail.tsx', 'Zadania, wydarzenia, braki i notatki powiązane ze sprawą.', 'duplicated related-items helper copy');
notContains('src/pages/CaseDetail.tsx', 'Zadania, wydarzenia, braki i notatki powiazane ze sprawa.', 'duplicated related-items helper copy without diacritics');
const badBlocks = findButtonBlocks(page, 'openCaseNoteDialog').filter((block) => block.includes('Dodaj notat') && !block.includes('data-case-create-action="note"'));
if (badBlocks.length) fail('src/pages/CaseDetail.tsx: header/top Dodaj notatkę button still exists');
pass('src/pages/CaseDetail.tsx: header/top Dodaj notatkę button removed');
const goodBlocks = findButtonBlocks(page, 'openCaseNoteDialog').filter((block) => block.includes('data-case-create-action="note"'));
if (goodBlocks.length !== 1) fail('src/pages/CaseDetail.tsx: expected exactly one create-panel note button, found ' + goodBlocks.length);
pass('src/pages/CaseDetail.tsx: exactly one create-panel note button retained');
contains('src/styles/visual-stage13-case-detail-vnext.css', marker, 'Stage62 CSS marker');
contains('package.json', 'check:stage62-case-important-actions-header-note-button-remove', 'Stage62 check script');
contains('package.json', 'test:stage62-case-important-actions-header-note-button-remove', 'Stage62 test script');
contains('package.json', 'check:stage61-case-note-action-button-swap && npm.cmd run check:stage62-case-important-actions-header-note-button-remove && npm.cmd run verify:client-detail-operational-ui', 'Stage62 included after Stage61 in verify chain');
contains('tests/stage62-case-important-actions-header-note-button-remove.test.cjs', marker, 'Stage62 test marker');
contains('docs/release/STAGE62_CASE_IMPORTANT_ACTIONS_HEADER_NOTE_BUTTON_REMOVE_2026-05-04.md', marker, 'Stage62 release marker');
console.log('PASS ' + marker);
