const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const root = process.cwd();
const vault = path.resolve(root, '..', '00_OBSIDIAN_VAULT');
const mapBase = path.join(vault, '10_PROJEKTY', 'CloseFlow_Lead_App', '04_NAPRAWA_ZRODLA_PRAWDY');
const APP_INPUT_HEAD = 'cde112df5a4e83e38aa8e8e083717242ba583583';
const VAULT_INPUT_HEAD = '800ebe73cbb22e5d22de809e47563fa5fbdd0275';

const rel = {
  report: '_project/runs/LF-PROD-SOT-G3-R1_CASEDETAIL_STOP_CLOSEOUT_G4_SKIP_AND_G5_ROUTE.md',
  guard: 'scripts/guards/verify-lf-prod-sot-g3-r1-casedetail-stop-closeout-and-g4-skip.cjs',
  test: 'tests/lf-prod-sot-g3-r1-casedetail-stop-closeout-and-g4-skip.test.cjs',
  map: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G3-R1_CASEDETAIL_STOP_CLOSEOUT_G4_SKIP_AND_G5_ROUTE_MAP.md',
  router: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md',
  g3Report: '_project/runs/LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP.md',
  g3Map: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP.md',
  g1Map: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G1_GLOBAL_CODE_REALITY_PRECHECK_AND_SOT_ROUTER_MAP.md',
};

function read(file, label = file) {
  assert.equal(fs.existsSync(file), true, `missing ${label}: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function must(text, token, label) {
  assert.equal(text.includes(token), true, `${label}: missing ${token}`);
}

function mustNot(text, token, label) {
  assert.equal(text.includes(token), false, `${label}: forbidden ${token}`);
}

function git(cwd, args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function assertAncestor(cwd, ancestor) {
  const result = spawnSync('git', ['merge-base', '--is-ancestor', ancestor, 'HEAD'], { cwd, encoding: 'utf8' });
  assert.equal(result.status, 0, `input head is not ancestor: ${ancestor}`);
}

function parseStatus(cwd) {
  const text = execFileSync(
    'git',
    ['status', '--porcelain=v1', '--untracked-files=all'],
    { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );
  if (!text.trim()) return [];
  return text.split(/\r?\n/).filter(Boolean).map((line) => {
    let value = line.slice(3).trim();
    const arrow = value.lastIndexOf(' -> ');
    if (arrow >= 0) value = value.slice(arrow + 4);
    if (value.startsWith('"') && value.endsWith('"')) {
      try { value = JSON.parse(value); } catch {}
    }
    return value.replaceAll('\\', '/');
  });
}

function committedSince(cwd, inputHead) {
  const text = git(cwd, ['diff', '--name-only', `${inputHead}..HEAD`]);
  return text ? text.split(/\r?\n/).filter(Boolean).map((x) => x.replaceAll('\\', '/')) : [];
}

function stagePaths(cwd, inputHead) {
  return [...new Set([...committedSince(cwd, inputHead), ...parseStatus(cwd)])].sort();
}

function assertAllowedScope(cwd, inputHead, allowed, kind) {
  assertAncestor(cwd, inputHead);
  for (const file of stagePaths(cwd, inputHead)) {
    if (kind === 'APP' && file.startsWith('src/')) throw new Error(`STOP_G3_R1_SRC_CHANGE: ${file}`);
    assert.equal(allowed.has(file), true, `G3_R1_FORBIDDEN_${kind}_CHANGE: ${file}`);
  }
}

function assertNoStagePrefix(dir, prefix, label) {
  if (!fs.existsSync(dir)) return;
  const matches = fs.readdirSync(dir).filter((name) => name.startsWith(prefix));
  assert.deepEqual(matches, [], `${label} must not exist: ${matches.join(', ')}`);
}

assert.equal(git(root, ['branch', '--show-current']), 'dev-rollout-freeze', 'STOP_BRANCH_MISMATCH');
assert.equal(git(vault, ['branch', '--show-current']), 'main', 'STOP_OBSIDIAN_BRANCH_MISMATCH');

const appAllowed = new Set([
  'package.json',
  'scripts/guards/verify-lf-prod-sot-g3-r1-casedetail-stop-closeout-and-g4-skip.cjs',
  'tests/lf-prod-sot-g3-r1-casedetail-stop-closeout-and-g4-skip.test.cjs',
  '_project/runs/LF-PROD-SOT-G3-R1_CASEDETAIL_STOP_CLOSEOUT_G4_SKIP_AND_G5_ROUTE.md',
]);
const vaultAllowed = new Set([
  '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G3-R1_CASEDETAIL_STOP_CLOSEOUT_G4_SKIP_AND_G5_ROUTE_MAP.md',
  '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md',
]);
assertAllowedScope(root, APP_INPUT_HEAD, appAllowed, 'APP');
assertAllowedScope(vault, VAULT_INPUT_HEAD, vaultAllowed, 'OBSIDIAN');

const pkg = JSON.parse(read(path.join(root, 'package.json'), 'package.json'));
const exactAlias = 'node scripts/guards/verify-lf-prod-sot-g3-r1-casedetail-stop-closeout-and-g4-skip.cjs && node --test tests/lf-prod-sot-g3-r1-casedetail-stop-closeout-and-g4-skip.test.cjs';
assert.equal(pkg.scripts?.['verify:lf-prod-sot-g3-r1'], exactAlias, 'G3-R1 package alias must be exact');

const g3Report = read(path.join(root, rel.g3Report), 'G3 app report');
const g3Map = read(path.join(vault, rel.g3Map), 'G3 map');
const g1Map = read(path.join(vault, rel.g1Map), 'G1 map');
const report = read(path.join(root, rel.report), 'G3-R1 app report');
const map = read(path.join(vault, rel.map), 'G3-R1 map');
const router = read(path.join(vault, rel.router), 'SOT router');

must(g3Report, 'STATUS: PASS_CASEDETAIL_SOT_GAP_MAP', 'G3 app report prerequisite');
must(g3Map, 'STATUS: MAP_COMPLETE', 'G3 Obsidian map prerequisite');
for (const doc of [g3Report, g3Map]) {
  must(doc, 'G3_DECISION: STOP_NO_SAFE_CASEDETAIL_CANDIDATE', 'G3 prerequisite');
  must(doc, 'G3_FIRST_SAFE_CANDIDATE: NONE', 'G3 prerequisite');
  must(doc, 'NEXT_STAGE_SELECTED: STOP', 'G3 historical decision');
}
must(g1Map, '| GCal / Calendar |', 'G1 independent GCal lane');

const caseDetail = read(path.join(root, 'src', 'pages', 'CaseDetail.tsx'), 'CaseDetail');
const caseOptions = read(path.join(root, 'src', 'lib', 'source-of-truth', 'case-options.ts'), 'case-options');
const scheduleOptions = read(path.join(root, 'src', 'lib', 'source-of-truth', 'schedule-options.ts'), 'schedule-options');

mustNot(caseDetail, 'getCaseDetailPillClass', 'CaseDetail');
must(caseOptions, 'export function getCaseDetailPillClass(status: unknown)', 'case-options');
must(caseDetail, "import { getStatusPillClass } from '../lib/config/badges';", 'CaseDetail generic import');
must(caseDetail, "return getStatusPillClass(status, 'case-detail');", 'CaseDetail generic helper');
must(caseDetail, 'getStatusClass(task.status)', 'CaseDetail task class callsite');
must(caseDetail, 'getStatusClass(event.status)', 'CaseDetail event class callsite');
must(caseDetail, 'getStatusClass(item.status)', 'CaseDetail item class callsite');

for (const token of [
  'export function getTaskStatusLabel(status: unknown)',
  'export function getCalendarEventStatusLabel(status: unknown)',
  'export const CLOSED_WORK_ITEM_STATUSES',
]) must(scheduleOptions, token, 'schedule-options');

for (const token of [
  'getTaskStatusTone',
  'getTaskStatusClass',
  'getCalendarEventStatusTone',
  'getCalendarEventStatusClass',
]) mustNot(scheduleOptions, token, 'schedule-options target owner');

for (const token of [
  'getCaseItemStatusTone',
  'getCaseItemStatusClass',
  'getCaseItemPillClass',
]) mustNot(caseOptions, token, 'case-options case-item target owner');

const requiredDecisionTokens = [
  'G3_R1_FINAL_STATUS: PASS_CASEDETAIL_LANE_STOP_CONFIRMED',
  'G3_PREREQUISITE: PASS_CASEDETAIL_SOT_GAP_MAP',
  'G3_DECISION_CONFIRMED_BY_REAL_CODE: YES',
  'CASEDETAIL_LANE_STATUS: STOP_NO_SAFE_CASEDETAIL_CANDIDATE',
  'G4_STATUS: SKIPPED_NO_SAFE_CASEDETAIL_CANDIDATE',
  'G4_CREATED: NO',
  'G4_RUNTIME_ADOPTION: NO',
  'GLOBAL_SOT_PROGRAM_STATUS: CONTINUE_TO_INDEPENDENT_GCAL_BOUNDARY_LANE',
  'NEXT_STAGE_SELECTED: LF-PROD-SOT-G5_GCAL_CALENDAR_BOUNDARY_GAP_MAP',
  'G5_CREATED: NO',
  'RUNTIME_CHANGED: NO',
  'SRC_CHANGED: NO',
];
for (const doc of [report, map]) {
  for (const token of requiredDecisionTokens) must(doc, token, 'G3-R1 decision document');
}

for (const token of [
  'SOT_ROUTER_MATRIX_UPDATED_THROUGH_G3_R1',
  'SOT_ROUTER_UPDATED_THROUGH_G3_R1',
  'G3 -> G3-R1',
  'G3-R1 -> G5',
  'PASS_CASEDETAIL_LANE_STOP_CONFIRMED',
  'SKIPPED_NO_SAFE_CASEDETAIL_CANDIDATE',
  'LF-PROD-SOT-G5_GCAL_CALENDAR_BOUNDARY_GAP_MAP',
]) must(router, token, 'G3-R1 router');

const separations = [
  'STORED_CASE_STATUS_SEPARATE: YES',
  'EFFECTIVE_CASE_STATUS_SEPARATE: YES',
  'CASE_LIFECYCLE_BUCKET_SEPARATE: YES',
  'CASE_ITEM_STATUS_SEPARATE: YES',
  'TASK_STATUS_SEPARATE: YES',
  'EVENT_STATUS_SEPARATE: YES',
  'MISSING_BLOCKER_DOMAIN_SEPARATE: YES',
  'PAYMENT_STATUS_SEPARATE: YES',
  'CASE_COST_STATUS_SEPARATE: YES',
  'HISTORY_EVENT_DOMAIN_SEPARATE: YES',
  'FINANCE_VALUE_DOMAIN_SEPARATE: YES',
];
for (const doc of [report, map]) {
  for (const token of separations) must(doc, token, 'G3-R1 domain separation');
}

const exactInputs = [
  '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md',
  '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G1_GLOBAL_CODE_REALITY_PRECHECK_AND_SOT_ROUTER_MAP.md',
  '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP.md',
  '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G3-R1_CASEDETAIL_STOP_CLOSEOUT_G4_SKIP_AND_G5_ROUTE_MAP.md',
  '_project/runs/LF-PROD-SOT-G3-R1_CASEDETAIL_STOP_CLOSEOUT_G4_SKIP_AND_G5_ROUTE.md',
];
for (const doc of [report, map, router]) {
  for (const token of exactInputs) must(doc, token, 'G5 exact input');
}

const runsDir = path.join(root, '_project', 'runs');
assertNoStagePrefix(runsDir, 'LF-PROD-SOT-G4_', 'G4 app report');
assertNoStagePrefix(runsDir, 'LF-PROD-SOT-G5_', 'G5 app report');
assertNoStagePrefix(mapBase, 'LF-PROD-SOT-G4_', 'G4 Obsidian map');
assertNoStagePrefix(mapBase, 'LF-PROD-SOT-G5_', 'G5 Obsidian map');

const forbiddenMojibake = ['â€”', 'â€™', 'Ăł', 'Ĺ‚', 'ĹĽ', 'Ä…', 'Ä™', 'Ä‡', 'Ĺ„', 'Ĺ›', 'Ĺş', 'Ĺ»', 'ï»¿', '�'];
for (const [doc, label] of [[report, 'report'], [map, 'map'], [router, 'router']]) {
  for (const token of forbiddenMojibake) mustNot(doc, token, label);
}

console.log('LF-PROD-SOT-G3-R1 CASEDETAIL STOP CLOSEOUT AND G4 SKIP: PASS');
