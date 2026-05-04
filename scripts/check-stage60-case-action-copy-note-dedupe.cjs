// STAGE61_STAGE60_GUARD_COMPAT_HOTFIX
const fs = require('fs');
const path = require('path');
const marker = 'STAGE60_CASE_ACTION_COPY_NOTE_DEDUPE';
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
contains('src/pages/CaseDetail.tsx', marker, 'Stage60 TSX marker');
notContains('src/pages/CaseDetail.tsx', 'Zadania, wydarzenia, braki i notatki powiązane ze sprawą.', 'duplicated related-items helper copy');
notContains('src/pages/CaseDetail.tsx', 'Zadania, wydarzenia, braki i notatki powiazane ze sprawa.', 'duplicated related-items helper copy without diacritics');
contains('src/pages/CaseDetail.tsx', 'data-case-create-action="note"', 'note action button retained in create panel');
contains('src/pages/CaseDetail.tsx', 'openCaseNoteDialog', 'note dialog helper retained');
contains('src/pages/CaseDetail.tsx', 'setIsAddNoteOpen(true)', 'note modal opener retained');
contains('src/pages/CaseDetail.tsx', 'data-case-note-follow-up-prompt="true"', 'Stage59 follow-up prompt retained');
contains('src/styles/visual-stage13-case-detail-vnext.css', marker, 'Stage60 CSS marker');
contains('scripts/check-stage57-case-create-action-hub.cjs', 'note action button retained in create panel', 'Stage57 guard updated');
contains('package.json', 'check:stage60-case-action-copy-note-dedupe', 'Stage60 check script');
contains('package.json', 'test:stage60-case-action-copy-note-dedupe', 'Stage60 test script');
contains('package.json', 'check:stage59-case-note-follow-up-prompt && npm.cmd run check:stage60-case-action-copy-note-dedupe && npm.cmd run check:stage61-case-note-action-button-swap && npm.cmd run verify:client-detail-operational-ui', 'Stage60 included in case operational verify');
contains('tests/stage60-case-action-copy-note-dedupe.test.cjs', marker, 'Stage60 test marker');
contains('docs/release/STAGE60_CASE_ACTION_COPY_NOTE_DEDUPE_2026-05-04.md', marker, 'Stage60 release marker');
console.log('PASS ' + marker);

