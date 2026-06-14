const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const test = require('node:test');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('STAGE231H_R1C merges payment and cost correction into one modal', () => {
  const source = read('src/pages/CaseDetail.tsx');
  assert.match(source, /Koryguj wpłatę\/koszt/);
  assert.match(source, /financeCorrectionRowsStage231H_R1C/);
  assert.match(source, /data-stage231h-r1c-cost-correction-row="true"/);
});

test('STAGE231H_R1C cost lifecycle has update and delete handlers', () => {
  const source = read('src/pages/CaseDetail.tsx');
  assert.match(source, /updateCaseCostInSupabase/);
  assert.match(source, /deleteCaseCostFromSupabase/);
  assert.match(source, /handleSaveCaseCostCorrectionStage231H_R1C/);
  assert.match(source, /handleConfirmDeleteCaseCostStage231H_R1C/);
});

test('STAGE231H_R1C cost rows are visibly red', () => {
  const css = read('src/styles/closeflow-case-finance-modal-stage220a30.css');
  assert.match(css, /STAGE231H_R1C_COST_CORRECTION_MODAL_CSS/);
  assert.match(css, /#991b1b/);
});

test('STAGE231H_R1C documentation keeps SQL untouched and requires manual test', () => {
  const run = read('_project/runs/STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL.md');
  assert.match(run, /SQL: NOT_TOUCHED/);
  assert.match(run, /MANUAL_UI_REQUIRED/);
});
