const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = process.cwd();
const vault = path.resolve(root, '..', '00_OBSIDIAN_VAULT');
const mapBase = path.join(
  vault,
  '10_PROJEKTY',
  'CloseFlow_Lead_App',
  '04_NAPRAWA_ZRODLA_PRAWDY',
);

const REPORT = '_project/runs/LF-PROD-SOT-G2_LISTS_CARDS_STATUS_DATE_SOT_MAP_AND_CONTRACT.md';
const MAP = 'LF-PROD-SOT-G2_LISTS_CARDS_STATUS_DATE_SOT_MAP_AND_CONTRACT_MAP.md';
const ROUTER = '00_MAPY_I_ZALEZNOSCI_SOT.md';

function readApp(rel) {
  const target = path.join(root, rel);
  assert.equal(fs.existsSync(target), true, `missing app file: ${rel}`);
  return fs.readFileSync(target, 'utf8');
}

function readMap(name) {
  const target = path.join(mapBase, name);
  assert.equal(fs.existsSync(target), true, `missing Obsidian map: ${name}`);
  return fs.readFileSync(target, 'utf8');
}

function must(text, token, label) {
  assert.equal(text.includes(token), true, `${label}: missing token ${token}`);
}

function countRows(text, prefix) {
  const pattern = new RegExp(`^\\| ${prefix}-\\d{2} \\|`, 'gm');
  return (text.match(pattern) || []).length;
}

function changedNames() {
  const output = execFileSync(
    'git',
    ['status', '--porcelain=v1', '--untracked-files=all'],
    { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );

  return output
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

assert.equal(
  execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim(),
  'dev-rollout-freeze',
  'STOP_BRANCH_MISMATCH',
);

const pkg = JSON.parse(readApp('package.json'));
const expectedAlias = 'node scripts/guards/verify-lf-prod-sot-g2-lists-cards-status-date-map-contract.cjs && node --test tests/lf-prod-sot-g2-lists-cards-status-date-map-contract.test.cjs';
assert.equal(pkg.scripts?.['verify:lf-prod-sot-g2'], expectedAlias, 'G2 package alias must be exact');

const g1 = readApp('_project/runs/LF-PROD-SOT-G1-R1_REVERIFY_AFTER_R28_CLOSEOUT_AND_INPUT_MAP_ALIGNMENT.md');
const r28 = readApp('_project/runs/LF-PROD-SOT-005C-R28_TASKS_STABLE_STATUS_DATE_GROUPING_SOT_FINAL_CLOSEOUT_GATE.md');
must(g1, 'G1_R1_STATUS: PASS_AFTER_R28_REVERIFY', 'G1-R1 report');
must(g1, 'R28_INPUT_MAP_NOW_PRESENT: YES', 'G1-R1 report');
must(g1, 'G2_ALLOWED_AFTER_G1_R1: YES', 'G1-R1 report');
must(r28, 'R28_FINAL_STATUS: PASS_WITH_ALLOWED_LOCAL_EXCEPTIONS', 'R28 report');

const report = readApp(REPORT);
const map = readMap(MAP);
const router = readMap(ROUTER);

for (const [doc, label] of [[report, 'G2 report'], [map, 'G2 map']]) {
  for (const token of [
    'G2_FINAL_STATUS: PASS_MAP_AND_CONTRACT',
    'R28_PREREQUISITE: PASS_WITH_ALLOWED_LOCAL_EXCEPTIONS',
    'G1_R1_PREREQUISITE: PASS_AFTER_R28_REVERIFY',
    'RUNTIME_CHANGED: NO',
    'SRC_CHANGED: NO',
    'UI_CSS_CHANGED: NO',
    'SQL_API_SUPABASE_CHANGED: NO',
    'TASK_GROUPING_CHANGED: NO',
    'G2_FIRST_SAFE_CANDIDATE: src/pages/TodayStable.tsx :: RowLink :: data-cf-status-tone={badgeTone || semanticBadgeTone(badge)}',
    'G3_CREATED: NO',
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP',
  ]) must(doc, token, label);
}

for (const surface of ['Leads', 'Cases', 'TasksStable', 'TodayStable']) {
  must(map, surface, 'G2 map surface');
}

for (const domain of [
  'LEAD_STATUS_DOMAIN',
  'CASE_STATUS_DOMAIN',
  'TASK_DISPLAY_STATUS_DOMAIN',
  'TASK_GROUPING_DOMAIN',
  'OPERATIONAL_BADGE_DOMAIN',
  'GENERIC_VISUAL_TONE_DOMAIN',
  'DATE_TIME_DOMAIN',
]) {
  must(map, domain, 'G2 map domain');
}

for (const column of [
  'SURFACE',
  'APP_FILE',
  'CALLSITE_FUNCTION_OR_COMPONENT',
  'DOMAIN',
  'RAW_STATUS_SOURCE',
  'STATUS_NORMALIZATION_OWNER',
  'STATUS_LABEL_OWNER',
  'STATUS_TONE_OWNER',
  'DATE_OWNER',
  'VISUAL_COMPONENT',
  'LOCAL_DUPLICATION_PRESENT',
  'CURRENT_RUNTIME_BEHAVIOR',
  'SAFE_TO_CHANGE',
  'CHANGE_RISK',
  'FORBIDDEN_ADJACENT_SCOPE',
  'FIRST_SAFE_CANDIDATE',
  'EVIDENCE_TOKEN',
]) {
  must(map, column, 'G2 map matrix columns');
}

assert.equal(countRows(map, 'LEADS'), 9, 'Leads callsite count');
assert.equal(countRows(map, 'CASES'), 9, 'Cases callsite count');
assert.equal(countRows(map, 'TASKS'), 8, 'TasksStable callsite count');
assert.equal(countRows(map, 'TODAY'), 13, 'TodayStable callsite count');

for (const token of [
  'SOT_ROUTER_MATRIX_UPDATED_THROUGH_G2',
  'SOT_ROUTER_UPDATED_THROUGH_G2',
  'G1-R1 -> G2',
  'G2 -> G3',
  'G2_FINAL_STATUS: PASS_MAP_AND_CONTRACT',
  'RUNTIME_CHANGED: NO',
  'SRC_CHANGED: NO',
  'G3_CREATED: NO',
  'LF-PROD-SOT-G2_LISTS_CARDS_STATUS_DATE_SOT_MAP_AND_CONTRACT_MAP.md',
  '_project/runs/LF-PROD-SOT-G2_LISTS_CARDS_STATUS_DATE_SOT_MAP_AND_CONTRACT.md',
]) must(router, token, 'SOT router');

const leads = readApp('src/pages/Leads.tsx');
must(leads, 'getLeadStatusLabel(lead.status)', 'Leads runtime');
must(leads, 'getLeadStatusTone(lead.status)', 'Leads runtime');
must(leads, 'buildRecordOperationalBadges', 'Leads runtime');

const cases = readApp('src/pages/Cases.tsx');
must(cases, 'getCaseStatusLabel(record.status)', 'Cases runtime');
must(cases, 'getCaseStatusTone(record.status)', 'Cases runtime');
must(cases, 'lifecycleCompactVariant', 'Cases runtime');

const tasks = readApp('src/pages/TasksStable.tsx');
must(tasks, 'getTaskDisplayStatusLabel({', 'TasksStable runtime');
must(tasks, 'getTaskDisplayStatusTone({', 'TasksStable runtime');
must(tasks, 'getTaskStableGroupDateKeyCompat', 'TasksStable runtime');
must(tasks, 'function getTaskGroupId(task: any): TaskGroupId', 'TasksStable runtime');
must(tasks, 'function buildTaskGroups(tasksToGroup: any[])', 'TasksStable runtime');

const today = readApp('src/pages/TodayStable.tsx');
must(today, 'getTodayWorkItemStatusLabel as getSotTodayWorkItemStatusLabel', 'TodayStable runtime');
must(today, 'getTodayOperationalDayKey', 'TodayStable runtime');
must(today, 'function semanticBadgeTone', 'TodayStable runtime');
must(today, 'data-cf-status-tone={badgeTone || semanticBadgeTone(badge)}', 'TodayStable runtime');
must(today, '<WorkItemCard', 'TodayStable runtime');

const allowedChanges = new Set([
  'package.json',
  'scripts/guards/verify-lf-prod-sot-g2-lists-cards-status-date-map-contract.cjs',
  'tests/lf-prod-sot-g2-lists-cards-status-date-map-contract.test.cjs',
  '_project/runs/LF-PROD-SOT-G2_LISTS_CARDS_STATUS_DATE_SOT_MAP_AND_CONTRACT.md',
]);

for (const file of changedNames()) {
  if (file.startsWith('src/')) {
    throw new Error(`STOP_G2_SRC_CHANGE_DETECTED: ${file}`);
  }
  if (!allowedChanges.has(file)) {
    throw new Error(`G2_FORBIDDEN_APP_CHANGE: ${file}`);
  }
}

const g3App = path.join(root, '_project', 'runs', 'LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP.md');
const g3Map = path.join(mapBase, 'LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP.md');
assert.equal(fs.existsSync(g3App), false, 'G3 app report must not exist');
assert.equal(fs.existsSync(g3Map), false, 'G3 Obsidian map must not exist');

console.log('LF-PROD-SOT-G2 LISTS/CARDS STATUS/DATE MAP CONTRACT: PASS_MAP_AND_CONTRACT');