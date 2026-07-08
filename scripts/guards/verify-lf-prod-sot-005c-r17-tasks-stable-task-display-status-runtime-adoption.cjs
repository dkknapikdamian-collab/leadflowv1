const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function must(text, token) {
  if (!text.includes(token)) throw new Error('Missing token: ' + token);
}

function mustNot(text, token) {
  if (text.includes(token)) throw new Error('Forbidden token: ' + token);
}

function getFunctionBody(source, name) {
  const needle = 'function ' + name;
  const start = source.indexOf(needle);
  if (start < 0) throw new Error('Function not found: ' + name);

  const braceStart = source.indexOf('{', start);
  if (braceStart < 0) throw new Error('Opening brace not found: ' + name);

  let depth = 0;
  for (let i = braceStart; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === '{') depth += 1;
    if (ch === '}') depth -= 1;
    if (depth === 0) return source.slice(braceStart + 1, i);
  }

  throw new Error('Closing brace not found: ' + name);
}

const tasks = read('src/pages/TasksStable.tsx');
const facade = read('src/lib/source-of-truth/task-display-status.ts');
const pkg = read('package.json');
const report = read('_project/runs/LF-PROD-SOT-005C-R17_TASKS_STABLE_LIST_TASK_STATUS_LABEL_TONE_FACADE_RUNTIME_ADOPTION_DO_POTWIERDZENIA.md');
const today = read('src/pages/TodayStable.tsx');
const workItemCard = read('src/components/work-item-card.tsx');

must(tasks, "import { getTaskDisplayStatusLabel, getTaskDisplayStatusTone } from '../lib/source-of-truth/task-display-status';");

const badge = getFunctionBody(tasks, 'getStatusBadge');
const tone = getFunctionBody(tasks, 'getTaskStatusTone');
const group = getFunctionBody(tasks, 'getTaskGroupId');
const buildGroups = getFunctionBody(tasks, 'buildTaskGroups');
const done = getFunctionBody(tasks, 'isTaskDone');
const todayHelper = getFunctionBody(tasks, 'isTaskToday');
const overdue = getFunctionBody(tasks, 'isTaskOverdue');

must(badge, 'return getTaskDisplayStatusLabel({');
must(badge, 'status: task?.status');
must(badge, 'momentRaw: getTaskMomentRaw(task)');
must(badge, 'todayKey: localDateKey()');

must(tone, 'return getTaskDisplayStatusTone({');
must(tone, 'status: task?.status');
must(tone, 'momentRaw: getTaskMomentRaw(task)');
must(tone, 'todayKey: localDateKey()');

must(tasks, '<span className="cf-status-pill" data-cf-status-tone={getTaskStatusTone(task)}>{getStatusBadge(task)}</span>');
must(tasks, 'data-cf-status-tone={getTaskStatusTone(task)}');

mustNot(group, 'getTaskDisplayStatus');
mustNot(buildGroups, 'getTaskDisplayStatus');
mustNot(done, 'getTaskDisplayStatus');
mustNot(todayHelper, 'getTaskDisplayStatus');
mustNot(overdue, 'getTaskDisplayStatus');

mustNot(today, 'task-display-status');
mustNot(workItemCard, 'task-display-status');

must(facade, "label: 'Zrobione'");
must(facade, "label: 'Zalegle'");
must(facade, "label: 'Dzis'");
must(facade, "label: 'Bez terminu'");
must(facade, "label: 'Nadchodzace'");
must(facade, "tone: 'green'");
must(facade, "tone: 'red'");
must(facade, "tone: 'blue'");
must(facade, "tone: 'neutral'");

must(pkg, '"verify:lf-prod-sot-005c-r17"');

must(report, 'runtime changed: YES');
must(report, 'app source changed: YES');
must(report, 'TasksStable touched: YES');
must(report, 'WorkItemCard touched: NO');
must(report, 'TodayStable touched: NO');
must(report, 'grouping changed: NO');
must(report, 'callbacks touched: NO');
must(report, 'mutations touched: NO');
must(report, 'forms touched: NO');
must(report, 'CSS/UI touched: NO');
must(report, 'SQL/Supabase/API touched: NO');
must(report, 'runtime/data touched: NO');
must(report, 'data/flows.json touched: NO');
must(report, 'INTENDED_DISPLAY_LABEL_CHANGE: YES');

const flowsDiff = execFileSync('git', ['diff', '--name-only', '--', 'data/flows.json'], { cwd: root }).toString().trim();
if (flowsDiff) throw new Error('data/flows.json has unstaged diff');

console.log('LF-PROD-SOT-005C-R17 guard PASS');
