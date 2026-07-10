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
  'LF-PROD-SOT-G2_LISTS_CARDS_STATUS_DATE_SOT_MAP_AND_CONTRACT_MAP.md',
);

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function countRows(text, prefix) {
  return (text.match(new RegExp(`^\\| ${prefix}-\\d{2} \\|`, 'gm')) || []).length;
}

test('G2 guard passes', () => {
  execFileSync(
    process.execPath,
    ['scripts/guards/verify-lf-prod-sot-g2-lists-cards-status-date-map-contract.cjs'],
    { cwd: root, stdio: 'pipe' },
  );
});

test('G2 package alias is exact', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(
    pkg.scripts?.['verify:lf-prod-sot-g2'],
    'node scripts/guards/verify-lf-prod-sot-g2-lists-cards-status-date-map-contract.cjs && node --test tests/lf-prod-sot-g2-lists-cards-status-date-map-contract.test.cjs',
  );
});

test('G2 map has all surfaces, domains and mapped callsites', () => {
  const map = fs.readFileSync(vaultMap, 'utf8');

  for (const surface of ['Leads', 'Cases', 'TasksStable', 'TodayStable']) {
    assert.ok(map.includes(surface), surface);
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
    assert.ok(map.includes(domain), domain);
  }

  assert.equal(countRows(map, 'LEADS'), 9);
  assert.equal(countRows(map, 'CASES'), 9);
  assert.equal(countRows(map, 'TASKS'), 8);
  assert.equal(countRows(map, 'TODAY'), 13);
});

test('G2 preserves TasksStable display/grouping separation', () => {
  const tasks = read('src/pages/TasksStable.tsx');
  assert.ok(tasks.includes('getTaskDisplayStatusLabel({'));
  assert.ok(tasks.includes('getTaskDisplayStatusTone({'));
  assert.ok(tasks.includes('getTaskStableGroupDateKeyCompat'));
  assert.ok(tasks.includes('function getTaskGroupId(task: any): TaskGroupId'));
  assert.ok(tasks.includes('function buildTaskGroups(tasksToGroup: any[])'));
  assert.equal(tasks.includes('getTaskStableGroupIdCompat'), false);
});

test('G2 records no runtime adoption and does not create G3', () => {
  const report = read('_project/runs/LF-PROD-SOT-G2_LISTS_CARDS_STATUS_DATE_SOT_MAP_AND_CONTRACT.md');
  const map = fs.readFileSync(vaultMap, 'utf8');

  for (const doc of [report, map]) {
    assert.ok(doc.includes('RUNTIME_CHANGED: NO'));
    assert.ok(doc.includes('SRC_CHANGED: NO'));
    assert.ok(doc.includes('TASK_GROUPING_CHANGED: NO'));
    assert.ok(doc.includes('G3_CREATED: NO'));
  }

  assert.equal(
    fs.existsSync(path.join(root, '_project/runs/LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP.md')),
    false,
  );
});