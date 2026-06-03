const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const caseText = fs.readFileSync(path.join(repo, 'src/pages/CaseDetail.tsx'), 'utf8');
const contextText = fs.readFileSync(path.join(repo, 'src/components/ContextActionDialogs.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repo, 'src/styles/closeflow-detail-view-source-truth-stage219.css'), 'utf8');

const errors = [];
const must = (ok, msg) => { if (!ok) errors.push(msg); };

must(caseText.includes('data-stage220a7-delete-case-confirm="true"'), 'delete confirm marker missing');
must(caseText.includes('open={deleteCaseOpen}'), 'delete confirm not bound to deleteCaseOpen');
must(caseText.includes('pending={deleteCasePending}'), 'delete pending not wired');
must(caseText.includes('onConfirm={handleConfirmDeleteCaseRecord}'), 'delete confirm handler missing');
must(caseText.includes("guardCaseDetailWriteAccess('usunąć sprawy')"), 'delete access guard missing');
must(caseText.includes('STAGE220A7_CASE_CONTEXT_ACTION_REFRESH'), 'CaseDetail refresh marker missing');
must(caseText.includes("window.addEventListener('closeflow:context-action-saved'"), 'CaseDetail saved listener missing');
must(caseText.includes("window.removeEventListener('closeflow:context-action-saved'"), 'CaseDetail saved listener cleanup missing');

must(contextText.includes('STAGE220A7_CONTEXT_ACTION_SAVED_EVENT'), 'ContextActionDialogs marker missing');
must(contextText.includes("const CONTEXT_ACTION_SAVED_EVENT = 'closeflow:context-action-saved'"), 'saved event const missing');
must(contextText.includes('const handleSaved = async () =>'), 'handleSaved missing');
must(contextText.includes('window.dispatchEvent(new CustomEvent(CONTEXT_ACTION_SAVED_EVENT'), 'saved event dispatch missing');
must(contextText.includes('onSaved={handleSaved}'), 'dialogs not wired to handleSaved');

must(css.includes('STAGE220A7_HIDE_CASE_SERVICE_HELPER_COPY'), 'helper-copy CSS marker missing');
must(css.includes('.stage217-case-service-card p'), 'service helper selector missing');
must(css.includes('display: none !important'), 'hide helper rule missing');

if (errors.length) {
  console.error('Stage220A7 guard failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('OK Stage220A7 R4 passed');
