#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel){ return fs.existsSync(path.join(root, rel)) ? fs.readFileSync(path.join(root, rel), 'utf8') : ''; }
function fail(msg){ console.error('STAGE231H_R1C FAIL:', msg); process.exit(1); }
function must(cond,msg){ if(!cond) fail(msg); }
const caseDetail = read('src/pages/CaseDetail.tsx');
const css = read('src/styles/closeflow-case-finance-modal-stage220a30.css');
const run = read('_project/runs/STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL.md');
const obs = read('_project/obsidian_updates/2026-06-14_STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL.md');
const guards = read('_project/06_GUARDS_AND_TESTS.md');
const tests = read('_project/13_TEST_HISTORY.md');

must(caseDetail.includes('updateCaseCostInSupabase'), 'CaseDetail must import/use updateCaseCostInSupabase.');
must(caseDetail.includes('deleteCaseCostFromSupabase'), 'CaseDetail must import/use deleteCaseCostFromSupabase.');
must(caseDetail.includes('Koryguj wpłatę/koszt'), 'Finance rail button must say Koryguj wpłatę/koszt.');
must(!caseDetail.includes('Koryguj wpłatę prowizji'), 'Old payment-only correction label must not remain in CaseDetail.');
must(caseDetail.includes('financeCorrectionRowsStage231H_R1C'), 'Merged payment/cost correction rows missing.');
must(caseDetail.includes('data-stage231h-r1c-cost-correction-row="true"'), 'Cost rows in correction modal missing.');
must(caseDetail.includes('openCaseCostCorrectionModalStage231H_R1C'), 'Cost correction opener missing.');
must(caseDetail.includes('handleSaveCaseCostCorrectionStage231H_R1C'), 'Cost correction save handler missing.');
must(caseDetail.includes('handleConfirmDeleteCaseCostStage231H_R1C'), 'Cost delete handler missing.');
must(caseDetail.includes('data-stage231h-r1c-cost-correction-modal="true"'), 'Cost correction modal missing.');
must(caseDetail.includes('data-stage231h-r1c-delete-cost-confirm="true"'), 'Cost delete confirm missing.');
must(css.includes('STAGE231H_R1C_COST_CORRECTION_MODAL_CSS'), 'R1C cost CSS marker missing.');
must(css.includes('color: #991b1b'), 'R1C cost rows must use red text.');
must(run.includes('STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL'), 'Run report missing.');
must(run.includes('SQL: NOT_TOUCHED'), 'Run report must state SQL not touched.');
must(obs.includes('STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL'), 'Obsidian payload missing.');
must(guards.includes('check-stage231h-r1c-case-detail-cost-correction.cjs'), 'Central guards doc missing R1C.');
must(tests.includes('STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL'), 'Test history missing R1C.');
console.log('STAGE231H_R1C PASS: CaseDetail cost correction modal is guarded.');
