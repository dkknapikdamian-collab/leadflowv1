const test = require('node:test');
const assert = require('node:assert/strict');
const { assertCanonicalStatusOwner, findStatusOwnerViolations } = require('../scripts/check-c1-task-event-status-ssot.cjs');

test('C1 status owner guard accepts canonical domain adapters', () => {
  const files = {
    'src/lib/source-of-truth/status-repository.ts': "import { TASK_STATUS_CLOSED_VALUES, EVENT_STATUS_CLOSED_VALUES, TASK_STATUS_LEGACY_ALIASES, EVENT_STATUS_LEGACY_ALIASES } from '../domain-statuses';",
    'src/lib/source-of-truth/schedule-options.ts': "import { TASK_EVENT_CLOSED_STATUS_VALUES } from '../domain-statuses';",
    'src/lib/source-of-truth/today-work-item-status.ts': "import { isTaskOrEventStatusClosed } from '../domain-statuses';",
    'src/lib/source-of-truth/task-display-status.ts': "import { isTaskStatusClosed } from '../domain-statuses';",
    'src/lib/work-items/planned-actions.ts': "import { isTaskOrEventStatusClosed } from '../domain-statuses';",
    'src/pages/TodayStable.tsx': "import { isTodayWorkItemClosed } from '../lib/source-of-truth/today-work-item-status';",
    'src/pages/TasksStable.tsx': "import { isTaskStatusClosed } from '../lib/domain-statuses'; function isTaskDone(task) { return isTaskStatusClosed(task.status); }",
    'src/pages/Calendar.tsx': "import { isTaskOrEventStatusCompleted } from '../lib/domain-statuses'; function isCompletedCalendarEntry(entry) { return isTaskOrEventStatusCompleted(entry.status); }",
  };
  assert.equal(assertCanonicalStatusOwner(files).status, 'PASS');
});

test('C1 status owner guard rejects a duplicate local closed set', () => {
  const files = {
    'src/lib/source-of-truth/status-repository.ts': "import { TASK_STATUS_CLOSED_VALUES, EVENT_STATUS_CLOSED_VALUES, TASK_STATUS_LEGACY_ALIASES, EVENT_STATUS_LEGACY_ALIASES } from '../domain-statuses';",
    'src/lib/source-of-truth/schedule-options.ts': "import { TASK_EVENT_CLOSED_STATUS_VALUES } from '../domain-statuses';",
    'src/lib/source-of-truth/today-work-item-status.ts': "import { isTaskOrEventStatusClosed } from '../domain-statuses';",
    'src/lib/source-of-truth/task-display-status.ts': "import { isTaskStatusClosed } from '../domain-statuses';",
    'src/lib/work-items/planned-actions.ts': "import { isTaskOrEventStatusClosed } from '../domain-statuses';",
    'src/pages/TodayStable.tsx': "import { isTodayWorkItemClosed } from '../lib/source-of-truth/today-work-item-status';",
    'src/pages/TasksStable.tsx': "const CLOSED_STATUS_VALUES = new Set(['done', 'completed']); function isTaskDone(task) { return CLOSED_STATUS_VALUES.has(task.status); }",
    'src/pages/Calendar.tsx': "import { isTaskOrEventStatusCompleted } from '../lib/domain-statuses';",
  };
  assert.ok(findStatusOwnerViolations(files).some((item) => item.includes('duplicate-status-owner-declaration')));
  assert.throws(() => assertCanonicalStatusOwner(files), /C1_TASK_EVENT_STATUS_SOT_GUARD_FAILED/);
});
