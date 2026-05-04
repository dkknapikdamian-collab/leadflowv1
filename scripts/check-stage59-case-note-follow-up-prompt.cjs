// STAGE60_STAGE59_GUARD_COMPAT_HOTFIX
const fs = require('fs');
const path = require('path');
const marker = 'STAGE59_CASE_NOTE_FOLLOW_UP_PROMPT';
function read(file) { return fs.readFileSync(path.join(process.cwd(), file), 'utf8'); }
function pass(message) { console.log('PASS ' + message); }
function fail(message) { console.error('FAIL ' + message); process.exit(1); }
function contains(file, needle, label) {
  const value = read(file);
  if (!value.includes(needle)) fail(file + ': missing ' + label + ' -> ' + needle);
  pass(file + ': contains ' + label);
}
contains('src/pages/CaseDetail.tsx', marker, 'Stage59 TSX marker');
contains('src/pages/CaseDetail.tsx', "type CaseNoteFollowUpChoice = 'today' | 'tomorrow' | 'two_days' | 'week' | 'custom';", 'follow-up choice type');
contains('src/pages/CaseDetail.tsx', 'const [pendingNoteFollowUp, setPendingNoteFollowUp]', 'pending follow-up state');
contains('src/pages/CaseDetail.tsx', 'function buildCaseNoteFollowUpIso', 'follow-up date helper');
contains('src/pages/CaseDetail.tsx', 'const handleCreateCaseNoteFollowUp = async', 'create follow-up handler');
contains('src/pages/CaseDetail.tsx', "setPendingNoteFollowUp({ note, createdAt: new Date().toISOString() });", 'note save opens prompt');
contains('src/pages/CaseDetail.tsx', 'data-case-note-follow-up-prompt="true"', 'follow-up prompt panel');
contains('src/pages/CaseDetail.tsx', 'data-case-note-follow-up-choice="today"', 'today choice');
contains('src/pages/CaseDetail.tsx', 'data-case-note-follow-up-choice="tomorrow"', 'tomorrow choice');
contains('src/pages/CaseDetail.tsx', 'data-case-note-follow-up-choice="two_days"', 'two-day choice');
contains('src/pages/CaseDetail.tsx', 'data-case-note-follow-up-choice="week"', 'week choice');
contains('src/pages/CaseDetail.tsx', 'data-case-note-follow-up-choice="custom"', 'custom choice');
contains('src/pages/CaseDetail.tsx', 'data-case-note-follow-up-custom-input="true"', 'custom date input');
contains('src/pages/CaseDetail.tsx', "type: 'follow_up'", 'follow-up task type');
contains('src/pages/CaseDetail.tsx', 'caseId,', 'case linkage');
contains('src/pages/CaseDetail.tsx', 'clientId: caseData?.clientId || null', 'client linkage');
contains('src/pages/CaseDetail.tsx', 'leadId: caseData?.leadId || null', 'lead linkage');
contains('src/pages/CaseDetail.tsx', "recordActivity('case_note_follow_up_added'", 'follow-up activity');
contains('src/styles/visual-stage13-case-detail-vnext.css', marker, 'Stage59 CSS marker');
contains('src/styles/visual-stage13-case-detail-vnext.css', '.case-detail-vnext-page .case-detail-note-follow-up-panel', 'follow-up panel CSS');
contains('src/styles/visual-stage13-case-detail-vnext.css', '.case-detail-vnext-page .case-detail-note-follow-up-actions', 'follow-up actions CSS');
contains('scripts/check-stage58-case-recent-moves-panel.cjs', 'check:stage59-case-note-follow-up-prompt && npm.cmd run check:stage60-case-action-copy-note-dedupe && npm.cmd run check:stage61-case-note-action-button-swap && npm.cmd run verify:client-detail-operational-ui', 'Stage58 guard compat');
contains('package.json', 'check:stage59-case-note-follow-up-prompt', 'Stage59 check script');
contains('package.json', 'test:stage59-case-note-follow-up-prompt', 'Stage59 test script');
contains('package.json', 'check:stage58-case-recent-moves-panel && npm.cmd run check:stage59-case-note-follow-up-prompt && npm.cmd run check:stage60-case-action-copy-note-dedupe && npm.cmd run check:stage61-case-note-action-button-swap && npm.cmd run verify:client-detail-operational-ui', 'Stage59 included in case operational verify');
contains('tests/stage59-case-note-follow-up-prompt.test.cjs', marker, 'Stage59 test marker');
contains('docs/release/STAGE59_CASE_NOTE_FOLLOW_UP_PROMPT_2026-05-04.md', marker, 'Stage59 release marker');
console.log('PASS ' + marker);

