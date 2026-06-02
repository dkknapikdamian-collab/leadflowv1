const fs = require('fs');
const path = require('path');

const root = process.cwd();
const caseDetailPath = path.join(root, 'src', 'pages', 'CaseDetail.tsx');
const quickActionsPath = path.join(root, 'src', 'components', 'CaseQuickActions.tsx');
const cssPath = path.join(root, 'src', 'styles', 'closeflow-case-detail-stage217-operation-workspace.css');

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing file: ${path.relative(root, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const caseDetail = read(caseDetailPath);
const quickActions = read(quickActionsPath);
const css = read(cssPath);

assert(caseDetail.includes('STAGE217_CASE_DETAIL_OPERATION_WORKSPACE_UX'), 'Stage217 marker missing in CaseDetail.tsx');
assert(caseDetail.includes("closeflow-case-detail-stage217-operation-workspace.css"), 'Stage217 CSS import missing');
assert(caseDetail.includes('data-stage217-case-operation-workspace="true"'), 'Stage217 operation workspace panel missing');
assert(caseDetail.includes('data-stage217-case-notes-panel="true"'), 'Stage217 notes panel missing');
assert(caseDetail.includes('caseNoteItems'), 'Stage217 caseNoteItems memo/render missing');
assert(caseDetail.includes('Notatka zapisana przy sprawie. Pełna treść jest w panelu Notatki.'), 'Stage217 note history summary missing');
assert(!caseDetail.includes('notes tab trigger'), 'Stage217 fragile marker leakage detected');

const paymentDialogCount = (caseDetail.match(/<Dialog open=\{isCasePaymentOpen\}/g) || []).length;
assert(paymentDialogCount <= 1, `Expected at most one case payment dialog, found ${paymentDialogCount}`);

for (const token of ['caseId', 'clientId', 'leadId', 'recordType: \'case\'', 'kind']) {
  assert(quickActions.includes(token), `CaseQuickActions relation/action token missing: ${token}`);
}

assert(css.includes('stage217-case-operation-workspace'), 'Stage217 CSS operation workspace styles missing');
assert(css.includes('stage217-case-notes-panel'), 'Stage217 CSS notes panel styles missing');

console.log('OK Stage217 R2 case detail operation workspace guard passed');
