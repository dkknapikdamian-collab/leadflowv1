const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const caseDetailPath = path.join(root, 'src/pages/CaseDetail.tsx');
const failures = [];
function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    failures.push(`missing file: ${rel}`);
    return '';
  }
  return fs.readFileSync(full, 'utf8');
}
function requireToken(label, text, token) {
  if (!text.includes(token)) failures.push(`${label}: missing token ${JSON.stringify(token)}`);
}

const caseDetail = read('src/pages/CaseDetail.tsx');
requireToken('CaseDetail R5 marker', caseDetail, 'STAGE231D2_R5_CASE_DETAIL_COST_SUMMARY_RENDER_HOTFIX');
requireToken('CaseDetail summary definition', caseDetail, 'const caseCostsSummaryStage231D2 = useMemo(');
requireToken('CaseDetail summary source', caseDetail, 'getCaseCostsSummary({');
requireToken('CaseDetail summary costs input', caseDetail, 'costs: caseCostsStage231D2');
requireToken('CaseDetail summary commission input', caseDetail, 'commissionRemainingAmount: caseFinance.remaining');
requireToken('CaseDetail summary currency input', caseDetail, 'currency: caseFinance.currency');
requireToken('CaseDetail summary dependency', caseDetail, '[caseCostsStage231D2, caseFinance.remaining, caseFinance.currency]');

const definitionIndex = caseDetail.indexOf('const caseCostsSummaryStage231D2 = useMemo(');
const firstJsxUseIndex = caseDetail.indexOf('caseCostsSummaryStage231D2.costsIncurredAmount');
if (definitionIndex < 0 || firstJsxUseIndex < 0 || definitionIndex > firstJsxUseIndex) {
  failures.push('CaseDetail: caseCostsSummaryStage231D2 must be defined before first JSX summary usage');
}
const occurrences = (caseDetail.match(/caseCostsSummaryStage231D2/g) || []).length;
if (occurrences < 5) failures.push(`CaseDetail: expected summary definition and JSX usages, found ${occurrences} occurrences`);
if (fs.existsSync(path.join(root, 'api/case-costs.ts'))) failures.push('api/case-costs.ts must stay deleted to keep Vercel Hobby function count <= 12');

requireToken('package script', read('package.json'), 'check:stage231d2r5-case-detail-render-crash');
requireToken('run report', read('_project/runs/STAGE231D2_R5_CASE_DETAIL_RENDER_CRASH_HOTFIX_RUN.md'), 'ReferenceError: caseCostsSummaryStage231D2 is not defined');
requireToken('obsidian payload', read('_project/obsidian_payloads/STAGE231D2_R5_CASE_DETAIL_RENDER_CRASH_HOTFIX_OBSIDIAN_PAYLOAD.md'), 'production crash hotfix');

if (failures.length) {
  console.error('STAGE231D2_R5_CASE_DETAIL_RENDER_CRASH_HOTFIX: FAIL');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}
console.log('STAGE231D2_R5_CASE_DETAIL_RENDER_CRASH_HOTFIX: PASS');
