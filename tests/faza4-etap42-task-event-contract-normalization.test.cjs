const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const nodeTest = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/^\uFEFF/, '');
}

nodeTest('Faza 4 Etap 4.2 work-items delegates task/event normalization to data-contract', () => {
  const workItems = read('api/work-items.ts');

  assert.match(workItems, /import\s+\{\s*normalizeEventContract,\s*normalizeTaskContract\s*\}\s+from\s+['"]\.\.\/src\/lib\/data-contract\.js['"];/);
  assert.match(workItems, /function normalizeTask\(row:\s*any\)\s*\{[\s\S]*const task = normalizeTaskContract\(row \|\| \{\}\);/);
  assert.match(workItems, /function normalizeEvent\(row:\s*any\)\s*\{[\s\S]*const event = normalizeEventContract\(row \|\| \{\}\);/);

  const taskStart = workItems.indexOf('function normalizeTask(row: any)');
  const isEventStart = workItems.indexOf('function isEventRow(row: any)');
  const eventStart = workItems.indexOf('function normalizeEvent(row: any)');
  const syncStart = workItems.indexOf('async function syncLeadNextAction');
  const taskBlock = workItems.slice(taskStart, isEventStart);
  const eventBlock = workItems.slice(eventStart, syncStart);

  assert.doesNotMatch(taskBlock, /asIsoDate\(row\.scheduled_at\)/);
  assert.doesNotMatch(taskBlock, /asIsoDate\(row\.due_at\)/);
  assert.doesNotMatch(eventBlock, /row\.start_at\s*\|\|\s*row\.scheduled_at\s*\|\|\s*row\.startAt/);
});

nodeTest('Faza 4 Etap 4.2 keeps UI compatibility fields for task and event responses', () => {
  const workItems = read('api/work-items.ts');

  const taskStart = workItems.indexOf('function normalizeTask(row: any)');
  const isEventStart = workItems.indexOf('function isEventRow(row: any)');
  const eventStart = workItems.indexOf('function normalizeEvent(row: any)');
  const syncStart = workItems.indexOf('async function syncLeadNextAction');
  const taskBlock = workItems.slice(taskStart, isEventStart);
  const eventBlock = workItems.slice(eventStart, syncStart);

  for (const marker of ['date:', 'dueAt:', 'time:', 'reminder:', 'recurrence:', 'recurrenceEndType:', 'recurrenceEndAt:', 'recurrenceCount:']) {
    assert.match(taskBlock, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  for (const marker of ['startAt:', 'endAt:', 'reminder:', 'recurrence:', 'leadId:', 'caseId:', 'clientId:']) {
    assert.match(eventBlock, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

nodeTest('Faza 4 Etap 4.2 docs, package and quiet release gate are wired', () => {
  const releaseDoc = read('docs/release/FAZA4_ETAP42_TASK_EVENT_CONTRACT_NORMALIZATION_2026-05-03.md');
  const technicalDoc = read('docs/technical/TASK_EVENT_CONTRACT_NORMALIZATION_STAGE42_2026-05-03.md');
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');

  assert.match(releaseDoc, /FAZA 4 - Etap 4\.2 - Normalizacja tasków i eventów/);
  assert.match(technicalDoc, /TASK \/ EVENT CONTRACT NORMALIZATION/);
  assert.equal(pkg.scripts['check:faza4-etap42-task-event-contract-normalization'], 'node scripts/check-faza4-etap42-task-event-contract-normalization.cjs');
  assert.equal(pkg.scripts['test:faza4-etap42-task-event-contract-normalization'], 'node --test tests/faza4-etap42-task-event-contract-normalization.test.cjs');
  assert.match(quiet, /tests\/faza4-etap42-task-event-contract-normalization\.test\.cjs/);
});
