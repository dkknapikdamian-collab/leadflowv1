const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function fail(message) { console.error('STAGE79_TODAY_TASK_DONE_ACTION_FAIL: ' + message); process.exit(1); }
const today = read('src/pages/TodayStable.tsx');
const statusSource = read('src/lib/source-of-truth/today-work-item-status.ts');
const domainStatuses = read('src/lib/domain-statuses.ts');
const requiredTokens = [
  'function RowLink({',
  'taskId?: string;',
  "doneKind?: 'task' | 'event';",
  'normalizedStage79TaskId',
  'stage79TaskDoneLocal',
  'stage79TaskDoneSaving',
  'markStage79TaskDoneFromRow',
  'updateTaskInSupabase',
  "status: 'done'",
  'data-stage79-task-done-action',
  'setStage79TaskDoneLocal(true)',
  'stage79Done: true',
];
for (const token of requiredTokens) {
  if (!today.includes(token)) fail('TodayStable missing task done token: ' + token);
}
if (!today.includes('isTodayWorkItemClosed as isSotTodayWorkItemClosed')) fail('TodayStable lost the canonical closed-status import');
if (!today.includes('return isSotTodayWorkItemClosed(value);')) fail('TodayStable closed-status facade no longer delegates to the canonical source');
if (!statusSource.includes("import { isTaskOrEventStatusClosed } from '../domain-statuses';")) fail('today work-item status source lost the canonical domain-statuses import');
if (!statusSource.includes('return isTaskOrEventStatusClosed(status);')) fail('today work-item status source no longer delegates closed semantics to domain-statuses');
if (!domainStatuses.includes('export const TASK_EVENT_COMPLETED_STATUS_VALUES = [')) fail('canonical task/event completed status owner is missing');
if (!domainStatuses.includes("  'done',")) fail('canonical task/event status owner must treat done as completed');
if (!domainStatuses.includes('export const TASK_EVENT_CLOSED_STATUS_VALUES = [')) fail('canonical task/event closed status owner is missing');
if (!domainStatuses.includes('  ...TASK_EVENT_COMPLETED_STATUS_VALUES,')) fail('canonical task/event closed status owner no longer includes completed statuses');
const pkg = JSON.parse(read('package.json'));
if (!pkg.scripts['check:stage79-today-task-done-action']) fail('package missing Stage79 check script');
if (!pkg.scripts['test:stage79-today-task-done-action']) fail('package missing Stage79 test script');
const quiet = read('scripts/closeflow-release-check-quiet.cjs');
if (!quiet.includes("tests/stage79-today-task-done-action.test.cjs")) fail('quiet gate missing Stage79 test path');
console.log('OK stage79 today task done action');
