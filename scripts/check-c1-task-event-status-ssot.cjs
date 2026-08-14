const fs = require('node:fs');
const path = require('node:path');

const ACTIVE_FILES = [
  'src/lib/source-of-truth/status-repository.ts',
  'src/lib/source-of-truth/schedule-options.ts',
  'src/lib/source-of-truth/today-work-item-status.ts',
  'src/lib/source-of-truth/task-display-status.ts',
  'src/lib/work-items/planned-actions.ts',
  'src/pages/TodayStable.tsx',
  'src/pages/TasksStable.tsx',
  'src/pages/Calendar.tsx',
];

const REQUIRED_CANONICAL_IMPORTS = {
  'src/lib/source-of-truth/status-repository.ts': ['TASK_STATUS_CLOSED_VALUES', 'EVENT_STATUS_CLOSED_VALUES', 'TASK_STATUS_LEGACY_ALIASES', 'EVENT_STATUS_LEGACY_ALIASES'],
  'src/lib/source-of-truth/schedule-options.ts': ['TASK_EVENT_CLOSED_STATUS_VALUES'],
  'src/lib/source-of-truth/today-work-item-status.ts': ['isTaskOrEventStatusClosed'],
  'src/lib/source-of-truth/task-display-status.ts': ['isTaskStatusClosed'],
  'src/lib/work-items/planned-actions.ts': ['isTaskOrEventStatusClosed'],
  'src/pages/TodayStable.tsx': ['isTodayWorkItemClosed'],
  'src/pages/TasksStable.tsx': ['isTaskStatusClosed'],
  'src/pages/Calendar.tsx': ['isTaskOrEventStatusCompleted'],
};

const DUPLICATE_OWNER_PATTERN = /\b(?:CLOSED_STATUS_VALUES|TASK_STABLE_GROUP_CLOSED_COMPAT_VALUES|doneStatuses|closedStatuses|completedStatuses)\b|\b(?:CLOSED_WORK_ITEM_STATUSES)\s*=\s*(?:new\s+Set|\[)/;
const RAW_CLOSED_LITERAL_PATTERN = /(?:new\s+Set\s*\(\s*\[|\b(?:CLOSED|COMPLETED|DONE)[A-Z0-9_]*\s*=\s*\[)[\s\S]{0,500}\b(?:done|completed|closed|cancelled|canceled|deleted|archived|removed)\b/i;

function findStatusOwnerViolations(sourceByPath) {
  const violations = [];
  for (const file of ACTIVE_FILES) {
    const source = sourceByPath[file] || '';
    for (const name of REQUIRED_CANONICAL_IMPORTS[file]) {
      if (!source.includes(name)) violations.push(`${file}:missing-canonical:${name}`);
    }
    if (DUPLICATE_OWNER_PATTERN.test(source)) violations.push(`${file}:duplicate-status-owner-declaration`);
    if (RAW_CLOSED_LITERAL_PATTERN.test(source)) violations.push(`${file}:raw-closed-status-collection`);
  }

  const tasks = sourceByPath['src/pages/TasksStable.tsx'] || '';
  if (/function\s+isTaskDone\b[\s\S]{0,500}(?:done|completed|closed|cancelled|canceled)/i.test(tasks) && !/isTaskStatusClosed\s*\(/.test(tasks)) {
    violations.push('src/pages/TasksStable.tsx:local-isTaskDone-domain-semantics');
  }
  const calendar = sourceByPath['src/pages/Calendar.tsx'] || '';
  if (/function\s+isCompletedCalendarEntry\b[\s\S]{0,700}(?:done|completed|closed|finished)/i.test(calendar) && !/isTaskOrEventStatusCompleted\s*\(/.test(calendar)) {
    violations.push('src/pages/Calendar.tsx:local-isCompletedCalendarEntry-domain-semantics');
  }
  return violations;
}

function assertCanonicalStatusOwner(sourceByPath) {
  const violations = findStatusOwnerViolations(sourceByPath);
  if (violations.length) throw new Error(`C1_TASK_EVENT_STATUS_SOT_GUARD_FAILED\n${violations.join('\n')}`);
  return { status: 'PASS', activeFiles: ACTIVE_FILES };
}

if (require.main === module) {
  const root = process.cwd();
  const sources = Object.fromEntries(ACTIVE_FILES.map((file) => [file, fs.readFileSync(path.join(root, file), 'utf8')]));
  const result = assertCanonicalStatusOwner(sources);
  process.stdout.write(`${JSON.stringify({ guard: 'c1:task-event-status-source-of-truth', ...result })}\n`);
}

module.exports = { ACTIVE_FILES, findStatusOwnerViolations, assertCanonicalStatusOwner };
