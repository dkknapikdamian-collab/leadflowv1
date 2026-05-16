const stage60CaseActionCopyNoteDedupe = 'STAGE60_CASE_ACTION_COPY_NOTE_DEDUPE';
const fs = require('fs');
const path = require('path');
const marker = 'STAGE57_CASE_CREATE_ACTION_HUB';
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
contains('src/pages/CaseDetail.tsx', marker, 'Stage57 TSX marker');
contains('src/pages/CaseDetail.tsx', 'const openCaseTaskDialog = () =>', 'open task dialog helper');
contains('src/pages/CaseDetail.tsx', 'const openCaseEventDialog = () =>', 'open event dialog helper');
contains('src/pages/CaseDetail.tsx', 'const openCaseNoteDialog = () =>', 'open note dialog helper');
contains('src/pages/CaseDetail.tsx', 'setIsAddTaskOpen(true)', 'task modal opener');
contains('src/pages/CaseDetail.tsx', 'setIsAddEventOpen(true)', 'event modal opener');
contains('src/pages/CaseDetail.tsx', 'setIsAddNoteOpen(true)', 'note modal opener');
contains('src/pages/CaseDetail.tsx', 'data-case-create-actions-panel="true"', 'case create action panel');
contains('src/pages/CaseDetail.tsx', 'data-case-create-action="task"', 'task action button');
contains('src/pages/CaseDetail.tsx', 'data-case-create-action="event"', 'event action button');
contains('src/pages/CaseDetail.tsx', 'data-case-create-action="note"', 'note action button retained in create panel');
contains('src/pages/CaseDetail.tsx', 'clientId: caseData?.clientId || null', 'client prefill/linkage in created records');
contains('src/pages/CaseDetail.tsx', 'leadId: caseData?.leadId || null', 'lead linkage in created records');
notContains('src/pages/CaseDetail.tsx', '|| !newEvent.startAt)', 'event start date hard requirement');
contains('src/styles/visual-stage13-case-detail-vnext.css', marker, 'Stage57 CSS marker');
contains('src/styles/visual-stage13-case-detail-vnext.css', '.case-detail-vnext-page .case-detail-create-actions button', 'create action button CSS');
contains('src/styles/visual-stage13-case-detail-vnext.css', '-webkit-text-fill-color: #111827 !important;', 'visible action text');
contains('package.json', 'check:stage57-case-create-action-hub', 'Stage57 check script');
contains('package.json', 'test:stage57-case-create-action-hub', 'Stage57 test script');
contains('package.json', 'verify:case-create-flow', 'case create flow verify script');
contains('package.json', 'check:stage57-case-create-action-hub && npm.cmd run check:stage58-case-recent-moves-panel && npm.cmd run check:stage59-case-note-follow-up-prompt && npm.cmd run check:stage60-case-action-copy-note-dedupe && npm.cmd run check:stage61-case-note-action-button-swap && npm.cmd run check:stage62-case-important-actions-header-note-button-remove && npm.cmd run check:stage63-case-main-note-header-button-remove && npm.cmd run verify:client-detail-operational-ui', 'Stage57 included in case operational verify');
contains('tests/stage57-case-create-action-hub.test.cjs', marker, 'Stage57 test marker');
contains('docs/release/STAGE57_CASE_CREATE_ACTION_HUB_2026-05-04.md', marker, 'Stage57 release marker');
console.log('PASS ' + marker);
