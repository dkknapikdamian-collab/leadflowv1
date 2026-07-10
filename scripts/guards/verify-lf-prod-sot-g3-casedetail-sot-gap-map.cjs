const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = process.cwd();
const vault = path.resolve(root, '..', '00_OBSIDIAN_VAULT');
const mapBase = path.join(vault, '10_PROJEKTY', 'CloseFlow_Lead_App', '04_NAPRAWA_ZRODLA_PRAWDY');

const files = {
  report: path.join(root, '_project', 'runs', 'LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP.md'),
  map: path.join(mapBase, 'LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP.md'),
  router: path.join(mapBase, '00_MAPY_I_ZALEZNOSCI_SOT.md'),
  caseDetail: path.join(root, 'src', 'pages', 'CaseDetail.tsx'),
  caseOptions: path.join(root, 'src', 'lib', 'source-of-truth', 'case-options.ts'),
  scheduleOptions: path.join(root, 'src', 'lib', 'source-of-truth', 'schedule-options.ts'),
  badges: path.join(root, 'src', 'lib', 'config', 'badges.ts'),
  g2Report: path.join(root, '_project', 'runs', 'LF-PROD-SOT-G2_LISTS_CARDS_STATUS_DATE_SOT_MAP_AND_CONTRACT.md'),
  g2r1Report: path.join(root, '_project', 'runs', 'LF-PROD-SOT-G2-R1_UTF8_HUMAN_TEXT_REPAIR_AND_GUARD.md'),
};

function read(file) {
  assert.equal(fs.existsSync(file), true, `missing file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}
function must(text, token, label) {
  assert.equal(text.includes(token), true, `${label}: missing ${token}`);
}
function mustNot(text, token, label) {
  assert.equal(text.includes(token), false, `${label}: forbidden ${token}`);
}
function branch(cwd) {
  return execFileSync('git', ['branch', '--show-current'], { cwd, encoding: 'utf8' }).trim();
}
function dirtyPaths(cwd) {
  return execFileSync(
    'git',
    ['status', '--porcelain=v1', '--untracked-files=all'],
    { cwd, encoding: 'utf8' },
  )
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      let value = line.slice(3).trim();
      const arrow = value.lastIndexOf(' -> ');
      if (arrow >= 0) value = value.slice(arrow + 4);
      if (value.startsWith('"') && value.endsWith('"')) {
        try { value = JSON.parse(value); } catch {}
      }
      return value.replaceAll('\\', '/');
    });
}

assert.equal(branch(root), 'dev-rollout-freeze', 'STOP_BRANCH_MISMATCH');
assert.equal(branch(vault), 'main', 'STOP_OBSIDIAN_BRANCH_MISMATCH');

const pkg = JSON.parse(read(path.join(root, 'package.json')));
const exactAlias = 'node scripts/guards/verify-lf-prod-sot-g3-casedetail-sot-gap-map.cjs && node --test tests/lf-prod-sot-g3-casedetail-sot-gap-map.test.cjs';
assert.equal(pkg.scripts?.['verify:lf-prod-sot-g3'], exactAlias, 'G3 package alias must be exact');

const g2 = read(files.g2Report);
const g2r1 = read(files.g2r1Report);
must(g2, 'G2_FINAL_STATUS: PASS_MAP_AND_CONTRACT', 'G2 report');
must(g2r1, 'STATUS: PASS_UTF8_REPAIR_AND_GUARD', 'G2-R1 report');
must(g2r1, 'G3_CREATED: NO', 'G2-R1 input report');

const report = read(files.report);
const map = read(files.map);
const router = read(files.router);
const caseDetail = read(files.caseDetail);
const caseOptions = read(files.caseOptions);
const scheduleOptions = read(files.scheduleOptions);
const badges = read(files.badges);

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
]) must(map, domain, 'G3 map domain');

for (const column of [
  'ID',
  'SURFACE',
  'CALLSITE_FUNCTION_OR_COMPONENT',
  'APP_FILE',
  'DOMAIN',
  'RAW_VALUE_SOURCE',
  'STORED_OR_DERIVED',
  'NORMALIZATION_OWNER',
  'LABEL_OWNER',
  'TONE_OR_CLASS_OWNER',
  'DATE_PRECEDENCE_OWNER',
  'DATE_FORMAT_OWNER',
  'VISUAL_COMPONENT',
  'READONLY_OR_MUTATION',
  'LOCAL_DUPLICATION_PRESENT',
  'CURRENT_RUNTIME_BEHAVIOR',
  'SAFE_TO_CHANGE',
  'CHANGE_RISK',
  'FORBIDDEN_ADJACENT_SCOPE',
  'FIRST_SAFE_CANDIDATE',
  'EVIDENCE_TOKEN',
]) must(map, column, 'G3 map matrix column');

assert.equal((map.match(/^\| G3-\d{2} \|/gm) || []).length, 46, 'G3 callsite row count');

for (const token of [
  "caseData?.status || 'in_progress'",
  'resolveCaseStatusFromItems',
  'isClosedCaseStatus(caseData?.status)',
  'isClosedCaseStatus(effectiveStatus)',
  'resolveCaseLifecycleV1({',
  'getStatusClass(task.status)',
  'getStatusClass(event.status)',
  'getStatusClass(item.status)',
  'const openTasks = useMemo(() => tasks.filter',
  'const plannedEvents = useMemo(() => events.filter',
  'getTaskMainDate(task) || task.reminderAt',
  'getEventMainDate(event) || event.reminderAt',
  'function getStage232I1CaseMissingStatus',
  "status === 'blocking_missing_item'",
  'function getCaseHistoryDateStage14D',
  'function billingStatusLabel',
  'function normalizeCaseFinancePaymentStatusStage232K_R2',
  'function getCaseCostStatusLabelStage231H_R1C',
  'const CASE_HISTORY_VISUAL_TAXONOMY_STAGE220A17',
]) must(caseDetail, token, 'CaseDetail runtime evidence');

must(caseOptions, 'export function getCaseDetailPillClass(status: unknown)', 'case SOT class owner');
must(caseOptions, 'export function getCaseItemStatusLabel(status: unknown)', 'case item label owner');
must(scheduleOptions, 'export const CLOSED_WORK_ITEM_STATUSES', 'schedule closed status owner');
must(scheduleOptions, 'export function getTaskStatusLabel(status: unknown)', 'task label owner');
must(scheduleOptions, 'export function getCalendarEventStatusLabel(status: unknown)', 'event label owner');
must(badges, 'export function getStatusPillClass(status: unknown', 'generic visual class owner');

mustNot(caseDetail, 'getCaseDetailPillClass(', 'CaseDetail no live case-status class adoption');
must(caseDetail, "return getStatusPillClass(status, 'case-detail');", 'CaseDetail generic class behavior');

for (const doc of [report, map, router]) {
  for (const token of [
    'stored case status != effective case status',
    'effective case status != lifecycle bucket',
    'case item status != missing/blocker semantic status',
    'task status != event status',
    'payment status != case status',
    'cost status != payment status',
    'finance value != finance status',
    'date display != date precedence',
    'visual class != semantic status owner',
  ]) {
    if (doc === router) continue;
    must(doc, token, 'G3 separation');
  }
}

for (const doc of [report, map, router]) {
  must(doc, 'G3_DECISION: STOP_NO_SAFE_CASEDETAIL_CANDIDATE', 'G3 decision');
  must(doc, 'G3_FIRST_SAFE_CANDIDATE: NONE', 'G3 candidate');
  must(doc, 'NEXT_STAGE_SELECTED: STOP', 'G3 next stage');
  must(doc, 'RUNTIME_CHANGED: NO', 'G3 runtime scope');
  must(doc, 'SRC_CHANGED: NO', 'G3 src scope');
  must(doc, 'G4_CREATED: NO', 'G3 no G4');
}

must(report, 'G3_GATE_REPAIR: PRECHECK_ONLY_FOR_R28_G2_G2_R1', 'G3 gate correction');
must(map, 'POST_G3_OLD_CLOSURE_GUARDS: NOT_RERUN_BY_DESIGN', 'G3 gate correction');

const forbiddenMojibake = [
  '\u00e2\u20ac\u201d',
  '\u00e2\u20ac\u2122',
  '\u0102\u0142',
  '\u0139\u201a',
  '\u0139\u203a',
  '\u0139\u013d',
  '\u00c4\u2026',
  '\u00c4\u2122',
  '\u00c4\u2021',
  '\u0139\u201e',
  '\u0139\u015b',
  '\u0139\u00bb',
  '\u00ef\u00bb\u00bf',
  '\ufffd',
];
for (const [doc, label] of [[report, 'report'], [map, 'map'], [router, 'router']]) {
  for (const token of forbiddenMojibake) {
    assert.equal(doc.includes(token), false, `${label}: mojibake detected`);
  }
}

const allowedApp = new Set([
  'package.json',
  'scripts/guards/verify-lf-prod-sot-g3-casedetail-sot-gap-map.cjs',
  'tests/lf-prod-sot-g3-casedetail-sot-gap-map.test.cjs',
  '_project/runs/LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP.md',
]);
for (const file of dirtyPaths(root)) {
  if (file.startsWith('src/')) throw new Error(`STOP_G3_SRC_CHANGE: ${file}`);
  assert.equal(allowedApp.has(file), true, `G3 forbidden app change: ${file}`);
}

const allowedVault = new Set([
  '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP.md',
  '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md',
]);
for (const file of dirtyPaths(vault)) {
  assert.equal(allowedVault.has(file), true, `G3 forbidden Obsidian change: ${file}`);
}

assert.equal(
  fs.existsSync(path.join(root, '_project', 'runs', 'LF-PROD-SOT-G4_CASEDETAIL_FIRST_SAFE_READONLY_ADOPTION_OR_STOP.md')),
  false,
  'G4 app report must not exist',
);
assert.equal(
  fs.existsSync(path.join(mapBase, 'LF-PROD-SOT-G4_CASEDETAIL_FIRST_SAFE_READONLY_ADOPTION_OR_STOP.md')),
  false,
  'G4 Obsidian map must not exist',
);

console.log('LF-PROD-SOT-G3 CASEDETAIL SOT GAP MAP: PASS');
