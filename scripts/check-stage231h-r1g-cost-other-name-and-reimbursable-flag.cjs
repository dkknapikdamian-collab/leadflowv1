const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function assert(condition, message) {
  if (!condition) {
    console.error('STAGE231H_R1G FAIL: ' + message);
    process.exit(1);
  }
}
const caseDetail = read('src/pages/CaseDetail.tsx');
const costsSource = read('src/lib/finance/case-costs-source.ts');

assert(caseDetail.includes('STAGE231H_R1G_COST_OTHER_NAME_AND_REIMBURSABLE_FLAG'), 'missing R1G stage marker');
assert(caseDetail.includes('otherName'), 'cost forms do not carry otherName');
assert(caseDetail.includes('CASE_COST_OTHER_NOTE_PREFIX_STAGE231H_R1G'), 'missing note prefix helper for other cost name');
assert(caseDetail.includes('buildCaseCostStoredNoteStage231H_R1G'), 'missing stored note builder for other cost name');
assert(caseDetail.includes('getCaseCostDisplayLabelStage231H_R1G'), 'missing custom cost display label helper');
assert(caseDetail.includes('data-stage231h-r1g-add-cost-other-name="true"'), 'add cost dialog does not show other-name field');
assert(caseDetail.includes('data-stage231h-r1g-add-cost-reimbursable-toggle="true"'), 'add cost dialog does not show reimbursable toggle');
assert(caseDetail.includes('data-stage231h-r1g-correct-cost-other-name="true"'), 'correction dialog does not show other-name field');
assert(caseDetail.includes('data-stage231h-r1g-correct-cost-reimbursable-toggle="true"'), 'correction dialog does not show reimbursable toggle');
assert(/if \(costKind === 'other' && !costOtherName\)/.test(caseDetail), 'add cost does not require name for other kind');
assert(/if \(kind === 'other' && !otherName\)/.test(caseDetail), 'cost correction does not require name for other kind');
assert(/reimbursable:\s*Boolean\(caseCostDraftStage231D2\.reimbursable\)/.test(caseDetail), 'create cost payload does not persist explicit reimbursable flag');
assert(/reimbursableAmount:\s*caseCostDraftStage231D2\.reimbursable \? amount : 0/.test(caseDetail), 'create cost payload does not zero non-reimbursable amount');
assert(/const isCostReimbursable\s*=\s*Boolean\(caseCostCorrectionFormStage231H_R1C\.reimbursable\)/.test(caseDetail), 'correction payload does not read reimbursable checkbox');
assert(/const finalReimbursableAmount\s*=\s*isCostReimbursable \?/.test(caseDetail), 'correction payload does not zero reimbursable amount when unchecked');
assert(/reimbursable:\s*isCostReimbursable/.test(caseDetail), 'correction payload does not persist explicit reimbursable boolean');
assert(!caseDetail.includes('<span>Do zwrotu: {formatMoney(getCaseCostReimbursableAmountStage231H_R1C(cost), costCurrency)}</span>'), 'cost list still includes redundant Do zwrotu chip source');
assert(!caseDetail.includes('<span>Zwrócono: {formatMoney(getCaseCostReimbursedAmountStage231H_R1C(cost), costCurrency)}</span>'), 'cost list still includes redundant Zwrocono chip source');
assert(/reimbursableFlag !== false && reimbursableFlag !== 'false' && reimbursableFlag !== 0/.test(costsSource), 'central summary must respect reimbursable=false');
assert(/const reimbursableRows = incurredRows\.filter\(\(cost\) => cost\.reimbursable\)/.test(costsSource), 'summary must count only reimbursable costs as costs to reimburse');
assert(/const totalToCollectAmount = roundMoney\(commissionRemainingAmount \+ costsToReimburseAmount\)/.test(costsSource), 'total to collect must include only remaining commission plus costs to reimburse');
assert(exists('_project/runs/STAGE231H_R1G_COST_OTHER_NAME_AND_REIMBURSABLE_FLAG.md'), 'missing R1G run report');
assert(exists('_project/obsidian_updates/2026-06-14_STAGE231H_R1G_COST_OTHER_NAME_AND_REIMBURSABLE_FLAG.md'), 'missing R1G Obsidian payload');
console.log('STAGE231H_R1G PASS: cost other name and reimbursable flag are guarded.');
