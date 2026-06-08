const fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

const task = read('src/server/task-route-stage124f.ts');
const event = read('src/server/event-route-stage124f.ts');
const pkg = read('package.json');

const checks = [
  ['task route has R23 soft delete marker', task.includes('STAGE228R23_SOFT_DELETE_WORK_ITEMS_TASKS')],
  ['event route has R23 soft delete marker', event.includes('STAGE228R23_SOFT_DELETE_WORK_ITEMS_EVENTS')],
  ['task imports updateById legacy helper', task.includes('updateById')],
  ['event imports updateById legacy helper', event.includes('updateById')],
  ['task soft delete sets status deleted', task.includes("status: 'deleted'")],
  ['event soft delete sets status deleted', event.includes("status: 'deleted'")],
  ['task hides work item flags', task.includes('show_in_tasks: false') && task.includes('show_in_calendar: false')],
  ['event hides work item flags', event.includes('show_in_tasks: false') && event.includes('show_in_calendar: false')],
  ['task read filters deleted statuses', task.includes("['deleted', 'archived', 'removed'].includes(status)")],
  ['event read filters deleted statuses', event.includes("['deleted', 'archived', 'removed'].includes(status)")],
  ['task hide verification exists', task.includes('TASK_DELETE_HIDE_VERIFY_FAILED')],
  ['event hide verification exists', event.includes('EVENT_DELETE_HIDE_VERIFY_FAILED')],
  ['package prebuild has R23 guard', pkg.includes('check-stage228r23-work-items-soft-delete.cjs')],
];

const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
if (failed.length) {
  console.error('STAGE228R23_WORK_ITEMS_SOFT_DELETE_FAIL: ' + failed.join('; '));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R23_WORK_ITEMS_SOFT_DELETE',
  contract: 'Task/event delete uses stable soft delete and read routes hide deleted work_items.'
}, null, 2));
