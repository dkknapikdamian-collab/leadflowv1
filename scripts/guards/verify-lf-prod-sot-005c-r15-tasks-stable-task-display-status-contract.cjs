const fs = require('node:fs');
const path = require('node:path');

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

const facade = read('src/lib/source-of-truth/task-display-status.ts');
const tasks = read('src/pages/TasksStable.tsx');
const today = read('src/pages/TodayStable.tsx');
const workItemCard = read('src/components/work-item-card.tsx');
const pkg = read('package.json');

must(pkg, '"verify:lf-prod-sot-005c-r15"');

must(facade, 'getTaskDisplayStatus');
must(facade, 'getTaskDisplayStatusLabel');
must(facade, 'getTaskDisplayStatusTone');

must(facade, "label: 'Zrobione'");
must(facade, "label: 'Zalegle'");
must(facade, "label: 'Dzis'");
must(facade, "label: 'Bez terminu'");
must(facade, "label: 'Nadchodzace'");

must(facade, "tone: 'green'");
must(facade, "tone: 'red'");
must(facade, "tone: 'blue'");
must(facade, "tone: 'neutral'");

must(tasks, "from '../lib/source-of-truth/task-display-status'");
must(tasks, 'return getTaskDisplayStatusLabel({');
must(tasks, 'return getTaskDisplayStatusTone({');
must(tasks, 'status: task?.status');
must(tasks, 'momentRaw: getTaskMomentRaw(task)');
must(tasks, 'todayKey: localDateKey()');

must(tasks, '<span className="cf-status-pill" data-cf-status-tone={getTaskStatusTone(task)}>{getStatusBadge(task)}</span>');

mustNot(today, 'task-display-status');
mustNot(workItemCard, 'task-display-status');

console.log('LF-PROD-SOT-005C-R15 tasks stable task display status contract guard PASS');
