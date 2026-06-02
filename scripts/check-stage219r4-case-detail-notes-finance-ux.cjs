const fs = require('fs');

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}
function assertIncludes(text, needle, label) {
  if (!text.includes(needle)) throw new Error(`Stage219-R4 guard failed: ${label}`);
}

const caseText = read('src/pages/CaseDetail.tsx');
const contextText = read('src/components/ContextActionDialogs.tsx');
const quickText = read('src/components/CaseQuickActions.tsx');
const cssText = read('src/styles/closeflow-detail-view-source-truth-stage219.css');

assertIncludes(caseText, 'STAGE219_R4_CONTEXT_NOTE_REFRESH', 'CaseDetail note refresh marker missing');
assertIncludes(caseText, 'closeflow:context-note-saved', 'CaseDetail does not refresh after shared note saved');
assertIncludes(caseText, 'data-stage219-case-notes-actions="true"', 'CaseDetail note actions missing');
assertIncludes(caseText, 'Dyktuj notatkę', 'CaseDetail dictate note button missing');
assertIncludes(caseText, 'data-stage219-add-note="true"', 'CaseDetail add note button missing');
assertIncludes(contextText, 'CONTEXT_ACTION_CLIENT_ID_ATTR', 'ContextActionDialogs explicit client attr missing');
assertIncludes(contextText, 'CONTEXT_ACTION_LEAD_ID_ATTR', 'ContextActionDialogs explicit lead attr missing');
assertIncludes(contextText, 'explicitClientId', 'ContextActionDialogs explicit client preservation missing');
assertIncludes(quickText, "data-context-client-id={clientId || ''}", 'CaseQuickActions does not pass client id through captured click');
assertIncludes(quickText, "data-context-lead-id={leadId || ''}", 'CaseQuickActions does not pass lead id through captured click');
assertIncludes(cssText, 'STAGE219_R4_CASE_DETAIL_SPLIT_COLUMNS_NOTES_FINANCE', 'Stage219-R4 CSS marker missing');
assertIncludes(cssText, '.case-detail-main-column', 'Main column layout override missing');
assertIncludes(cssText, '.case-detail-right-rail', 'Right rail layout override missing');
assertIncludes(cssText, 'order: 2 !important', 'Finance right rail order missing');

console.log('OK Stage219-R4 case detail notes/finance UX guard passed');
