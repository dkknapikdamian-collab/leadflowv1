const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { execFileSync } = require('node:child_process');

const root = process.cwd();
const vaultMap = path.resolve(
  root,
  '..',
  '00_OBSIDIAN_VAULT',
  '10_PROJEKTY',
  'CloseFlow_Lead_App',
  '04_NAPRAWA_ZRODLA_PRAWDY',
  'LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP.md',
);

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

test('G3 guard passes', () => {
  execFileSync(
    process.execPath,
    ['scripts/guards/verify-lf-prod-sot-g3-casedetail-sot-gap-map.cjs'],
    { cwd: root, stdio: 'pipe' },
  );
});

test('G3 package alias is exact', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(
    pkg.scripts?.['verify:lf-prod-sot-g3'],
    'node scripts/guards/verify-lf-prod-sot-g3-casedetail-sot-gap-map.cjs && node --test tests/lf-prod-sot-g3-casedetail-sot-gap-map.test.cjs',
  );
});

test('G3 map contains all required domains and matrix rows', () => {
  const map = fs.readFileSync(vaultMap, 'utf8');
  for (const domain of [
    'STORED_CASE_STATUS_DOMAIN',
    'EFFECTIVE_CASE_STATUS_DOMAIN',
    'CASE_LIFECYCLE_BUCKET_DOMAIN',
    'CASE_ITEM_STATUS_DOMAIN',
    'TASK_STATUS_DOMAIN',
    'EVENT_STATUS_DOMAIN',
    'MISSING_BLOCKER_DOMAIN',
    'PAYMENT_STATUS_DOMAIN',
    'CASE_COST_STATUS_DOMAIN',
    'HISTORY_EVENT_DOMAIN',
    'DATE_TIME_DOMAIN',
    'FINANCE_VALUE_DOMAIN',
    'VISUAL_STATUS_CLASS_DOMAIN',
  ]) assert.ok(map.includes(domain), domain);
  assert.equal((map.match(/^\| G3-\d{2} \|/gm) || []).length, 46);
});

test('G3 preserves domain separations', () => {
  const map = fs.readFileSync(vaultMap, 'utf8');
  for (const token of [
    'stored case status != effective case status',
    'effective case status != lifecycle bucket',
    'case item status != missing/blocker semantic status',
    'task status != event status',
    'task/event status != history event type',
    'payment status != case status',
    'cost status != payment status',
    'finance value != finance status',
    'date display != date precedence',
    'visual class != semantic status owner',
  ]) assert.ok(map.includes(token), token);
});

test('G3 map contains real CaseDetail evidence tokens', () => {
  const source = read('src/pages/CaseDetail.tsx');
  for (const token of [
    'resolveCaseStatusFromItems',
    'resolveCaseLifecycleV1({',
    'getStatusClass(task.status)',
    'getStatusClass(event.status)',
    'getStatusClass(item.status)',
    'function getStage232I1CaseMissingStatus',
    'function billingStatusLabel',
    'function getCaseCostStatusLabelStage231H_R1C',
    'const CASE_HISTORY_VISUAL_TAXONOMY_STAGE220A17',
  ]) assert.ok(source.includes(token), token);
  assert.equal(source.includes('getCaseDetailPillClass('), false);
});

test('G3 selects STOP rather than inventing a candidate', () => {
  const report = read('_project/runs/LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP.md');
  const map = fs.readFileSync(vaultMap, 'utf8');
  for (const doc of [report, map]) {
    assert.ok(doc.includes('G3_DECISION: STOP_NO_SAFE_CASEDETAIL_CANDIDATE'));
    assert.ok(doc.includes('G3_FIRST_SAFE_CANDIDATE: NONE'));
    assert.ok(doc.includes('NEXT_STAGE_SELECTED: STOP'));
  }
});

test('G3 preserves no-runtime scope and creates no G4', () => {
  const report = read('_project/runs/LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP.md');
  for (const token of [
    'RUNTIME_CHANGED: NO',
    'SRC_CHANGED: NO',
    'UI_CSS_CHANGED: NO',
    'SQL_API_SUPABASE_CHANGED: NO',
    'FINANCE_RUNTIME_CHANGED: NO',
    'G4_CREATED: NO',
  ]) assert.ok(report.includes(token), token);
  assert.equal(
    fs.existsSync(path.join(root, '_project/runs/LF-PROD-SOT-G4_CASEDETAIL_FIRST_SAFE_READONLY_ADOPTION_OR_STOP.md')),
    false,
  );
});

test('G3 documents corrected old-guard order', () => {
  const report = read('_project/runs/LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP.md');
  assert.ok(report.includes('G3_GATE_REPAIR: PRECHECK_ONLY_FOR_R28_G2_G2_R1'));
  assert.ok(report.includes('POST_G3_OLD_CLOSURE_GUARDS: NOT_RERUN_BY_DESIGN'));
});

test('G3 documents contain no common mojibake tokens', () => {
  const docs = [
    read('_project/runs/LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP.md'),
    fs.readFileSync(vaultMap, 'utf8'),
  ];
  const forbidden = ['â€”', 'â€™', 'Ăł', 'Ĺ‚', 'ĹĽ', 'Ä…', 'Ä™', 'Ä‡', 'Ĺ„', 'Ĺ›', 'Ĺş', 'Ĺ»', 'ï»¿', '�'];
  for (const doc of docs) {
    for (const token of forbidden) assert.equal(doc.includes(token), false, token);
  }
});
