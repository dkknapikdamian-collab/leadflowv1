const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { execFileSync, spawnSync } = require('node:child_process');

const root = process.cwd();
const vault = path.resolve(root, '..', '00_OBSIDIAN_VAULT');
const mapBase = path.join(vault, '10_PROJEKTY', 'CloseFlow_Lead_App', '04_NAPRAWA_ZRODLA_PRAWDY');
const APP_INPUT_HEAD = 'cde112df5a4e83e38aa8e8e083717242ba583583';

function readApp(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function readVault(rel) {
  return fs.readFileSync(path.join(vault, rel), 'utf8');
}
function git(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
}

test('G3-R1 guard passes', () => {
  execFileSync(process.execPath, ['scripts/guards/verify-lf-prod-sot-g3-r1-casedetail-stop-closeout-and-g4-skip.cjs'], { cwd: root, stdio: 'pipe' });
});

test('G3-R1 package alias is exact', () => {
  const pkg = JSON.parse(readApp('package.json'));
  assert.equal(
    pkg.scripts?.['verify:lf-prod-sot-g3-r1'],
    'node scripts/guards/verify-lf-prod-sot-g3-r1-casedetail-stop-closeout-and-g4-skip.cjs && node --test tests/lf-prod-sot-g3-r1-casedetail-stop-closeout-and-g4-skip.test.cjs',
  );
});

test('real CaseDetail has no case pill callsite and keeps generic callsites', () => {
  const source = readApp('src/pages/CaseDetail.tsx');
  assert.equal(source.includes('getCaseDetailPillClass'), false);
  assert.ok(source.includes("import { getStatusPillClass } from '../lib/config/badges';"));
  assert.ok(source.includes("return getStatusPillClass(status, 'case-detail');"));
  for (const token of [
    'getStatusClass(task.status)',
    'getStatusClass(event.status)',
    'getStatusClass(item.status)',
  ]) assert.ok(source.includes(token), token);
});

test('case SOT has case helper but no case-item target owner', () => {
  const source = readApp('src/lib/source-of-truth/case-options.ts');
  assert.ok(source.includes('export function getCaseDetailPillClass(status: unknown)'));
  for (const token of [
    'getCaseItemStatusTone',
    'getCaseItemStatusClass',
    'getCaseItemPillClass',
  ]) assert.equal(source.includes(token), false, token);
});

test('schedule SOT has labels and closed statuses but no target class owner', () => {
  const source = readApp('src/lib/source-of-truth/schedule-options.ts');
  for (const token of [
    'export function getTaskStatusLabel(status: unknown)',
    'export function getCalendarEventStatusLabel(status: unknown)',
    'export const CLOSED_WORK_ITEM_STATUSES',
  ]) assert.ok(source.includes(token), token);
  for (const token of [
    'getTaskStatusTone',
    'getTaskStatusClass',
    'getCalendarEventStatusTone',
    'getCalendarEventStatusClass',
  ]) assert.equal(source.includes(token), false, token);
});

test('G3-R1 records CaseDetail STOP and G4 skip', () => {
  const docs = [
    readApp('_project/runs/LF-PROD-SOT-G3-R1_CASEDETAIL_STOP_CLOSEOUT_G4_SKIP_AND_G5_ROUTE.md'),
    readVault('10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G3-R1_CASEDETAIL_STOP_CLOSEOUT_G4_SKIP_AND_G5_ROUTE_MAP.md'),
  ];
  for (const doc of docs) {
    for (const token of [
      'G3_R1_FINAL_STATUS: PASS_CASEDETAIL_LANE_STOP_CONFIRMED',
      'G3_DECISION_CONFIRMED_BY_REAL_CODE: YES',
      'CASEDETAIL_LANE_STATUS: STOP_NO_SAFE_CASEDETAIL_CANDIDATE',
      'G4_STATUS: SKIPPED_NO_SAFE_CASEDETAIL_CANDIDATE',
      'G4_CREATED: NO',
      'G4_RUNTIME_ADOPTION: NO',
    ]) assert.ok(doc.includes(token), token);
  }
});

test('G3-R1 routes to G5 without creating G5', () => {
  const report = readApp('_project/runs/LF-PROD-SOT-G3-R1_CASEDETAIL_STOP_CLOSEOUT_G4_SKIP_AND_G5_ROUTE.md');
  const map = readVault('10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G3-R1_CASEDETAIL_STOP_CLOSEOUT_G4_SKIP_AND_G5_ROUTE_MAP.md');
  const router = readVault('10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md');
  for (const doc of [report, map]) {
    assert.ok(doc.includes('NEXT_STAGE_SELECTED: LF-PROD-SOT-G5_GCAL_CALENDAR_BOUNDARY_GAP_MAP'));
    assert.ok(doc.includes('G5_CREATED: NO'));
  }
  assert.ok(router.includes('NEXT_STAGE_SELECTED:'));
  assert.ok(router.includes('LF-PROD-SOT-G5_GCAL_CALENDAR_BOUNDARY_GAP_MAP'));
  assert.ok(router.includes('G5_CREATED:'));
  assert.ok(router.includes('NO'));
  const appMatches = fs.readdirSync(path.join(root, '_project', 'runs')).filter((x) => x.startsWith('LF-PROD-SOT-G5_'));
  const vaultMatches = fs.readdirSync(mapBase).filter((x) => x.startsWith('LF-PROD-SOT-G5_'));
  assert.deepEqual(appMatches, []);
  assert.deepEqual(vaultMatches, []);
});

test('G4 does not exist', () => {
  const appMatches = fs.readdirSync(path.join(root, '_project', 'runs')).filter((x) => x.startsWith('LF-PROD-SOT-G4_'));
  const vaultMatches = fs.readdirSync(mapBase).filter((x) => x.startsWith('LF-PROD-SOT-G4_'));
  assert.deepEqual(appMatches, []);
  assert.deepEqual(vaultMatches, []);
});

test('no src file changed in G3-R1 lineage', () => {
  const result = spawnSync('git', ['merge-base', '--is-ancestor', APP_INPUT_HEAD, 'HEAD'], { cwd: root });
  assert.equal(result.status, 0);
  const committed = git(['diff', '--name-only', `${APP_INPUT_HEAD}..HEAD`]);
  const dirty = execFileSync(
    'git',
    ['status', '--porcelain=v1', '--untracked-files=all'],
    { cwd: root, encoding: 'utf8' },
  );
  const names = [
    ...(committed ? committed.split(/\r?\n/) : []),
    ...(dirty.trim() ? dirty.split(/\r?\n/).filter(Boolean).map((line) => line.slice(3).trim()) : []),
  ].map((x) => x.replaceAll('\\', '/'));
  assert.equal(names.some((x) => x.startsWith('src/')), false);
});

test('all required domain separations are explicit', () => {
  const report = readApp('_project/runs/LF-PROD-SOT-G3-R1_CASEDETAIL_STOP_CLOSEOUT_G4_SKIP_AND_G5_ROUTE.md');
  for (const token of [
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
  ]) assert.ok(report.includes(token), token);
});
