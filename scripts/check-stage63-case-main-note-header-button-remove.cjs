const fs = require('fs');
const path = require('path');
const marker = 'STAGE63_CASE_MAIN_NOTE_HEADER_BUTTON_REMOVE';
function read(file) { return fs.readFileSync(path.join(process.cwd(), file), 'utf8'); }
function pass(message) { console.log('PASS ' + message); }
function fail(message) { console.error('FAIL ' + message); process.exit(1); }
function contains(file, needle, label) { const value = read(file); if (!value.includes(needle)) fail(file + ': missing ' + label + ' -> ' + needle); pass(file + ': contains ' + label); }
function notContains(file, needle, label) { const value = read(file); if (value.includes(needle)) fail(file + ': forbidden ' + label + ' -> ' + needle); pass(file + ': does not contain ' + label); }
function findTagBlocks(value, tagName) { const startToken = '<' + tagName; const endToken = '</' + tagName + '>'; const blocks = []; let index = 0; while (index < value.length) { const start = value.indexOf(startToken, index); if (start === -1) break; const end = value.indexOf(endToken, start); if (end === -1) break; blocks.push(value.slice(start, end + endToken.length)); index = end + endToken.length; } return blocks; }
function containsNoteText(block) { return block.includes('Dodaj notat') || block.includes('Dodaj notatk') || block.includes('notatk\u0119') || block.includes('notatke'); }
function isCreatePanelNoteAction(block) { return block.includes('data-case-create-action="note"') || block.includes("data-case-create-action='note'"); }
function hasOpenNoteIntent(block) { return block.includes('openCaseNoteDialog') || block.includes('setIsAddNoteOpen(true)'); }
const page = read('src/pages/CaseDetail.tsx');
contains('src/pages/CaseDetail.tsx', marker, 'Stage63 TSX marker');
contains('src/pages/CaseDetail.tsx', 'data-case-create-action="note"', 'note action retained in create/actions panel');
contains('src/pages/CaseDetail.tsx', 'const openCaseNoteDialog = () =>', 'note dialog helper retained');
contains('src/pages/CaseDetail.tsx', 'setIsAddNoteOpen(true)', 'note modal opener retained');
notContains('src/pages/CaseDetail.tsx', 'Zadania, wydarzenia, braki i notatki powi\u0105zane ze spraw\u0105.', 'duplicated related-items helper copy');
const buttonBlocks = [...findTagBlocks(page, 'Button'), ...findTagBlocks(page, 'button')];
const createPanelNoteButtons = buttonBlocks.filter((block) => isCreatePanelNoteAction(block));
if (createPanelNoteButtons.length !== 1) fail('src/pages/CaseDetail.tsx: expected exactly one create-panel note action button, found ' + createPanelNoteButtons.length);
pass('src/pages/CaseDetail.tsx: exactly one create-panel note action button retained');
const forbiddenButtons = buttonBlocks.filter((block) => containsNoteText(block) && hasOpenNoteIntent(block) && !isCreatePanelNoteAction(block));
if (forbiddenButtons.length) fail('src/pages/CaseDetail.tsx: header/main Dodaj notatk\u0119 button still present outside create panel');
pass('src/pages/CaseDetail.tsx: no header/main Dodaj notatk\u0119 button outside create panel');
contains('src/styles/visual-stage13-case-detail-vnext.css', marker, 'Stage63 CSS marker');
contains('package.json', 'check:stage63-case-main-note-header-button-remove', 'Stage63 check script');
contains('package.json', 'test:stage63-case-main-note-header-button-remove', 'Stage63 test script');
contains('package.json', 'check:stage62-case-important-actions-header-note-button-remove && npm.cmd run check:stage63-case-main-note-header-button-remove && npm.cmd run verify:client-detail-operational-ui', 'Stage63 included after Stage62 in verify chain');
contains('tests/stage63-case-main-note-header-button-remove.test.cjs', marker, 'Stage63 test marker');
contains('docs/release/STAGE63_CASE_MAIN_NOTE_HEADER_BUTTON_REMOVE_2026-05-04.md', marker, 'Stage63 release marker');
console.log('PASS ' + marker);
