const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const contractPath = path.join(root, 'src/lib/source-of-truth/task-display-status.ts');
const tasksStablePath = path.join(root, 'src/pages/TasksStable.tsx');
const todayStablePath = path.join(root, 'src/pages/TodayStable.tsx');
const workItemCardPath = path.join(root, 'src/components/work-item-card.tsx');
const packagePath = path.join(root, 'package.json');
const reportPath = path.join(root, '_project/runs/LF-PROD-SOT-005C-R15_TASKS_STABLE_LIST_TASK_STATUS_LABEL_TONE_FACADE_CONTRACT_GUARD_DO_POTWIERDZENIA.md');

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error('Missing file: ' + path.relative(root, filePath));
  }
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(text, needle, label) {
  if (!text.includes(needle)) {
    throw new Error('Missing ' + label + ': ' + needle);
  }
}

function assertNotIncludes(text, needle, label) {
  if (text.includes(needle)) {
    throw new Error('Forbidden ' + label + ': ' + needle);
  }
}

const contract = read(contractPath);
const tasksStable = read(tasksStablePath);
const todayStable = read(todayStablePath);
const workItemCard = read(workItemCardPath);
const packageJson = read(packagePath);
const report = read(reportPath);

for (const needle of [
  "import { normalizeTaskStatus } from '../domain-statuses';",
  "export type TaskDisplayStatusKind = 'done' | 'overdue' | 'today' | 'no_due' | 'upcoming';",
  "export type TaskDisplayStatusTone = 'green' | 'red' | 'blue' | 'neutral';",
  'export type TaskDisplayStatusInput',
  'export type TaskDisplayStatusResult',
  'export function getTaskDisplayDateKey',
  'export function isTaskDisplayClosed',
  'export function isTaskDisplayOverdue',
  'export function getTaskDisplayStatus',
  'export function getTaskDisplayStatusLabel',
  'export function getTaskDisplayStatusTone',
  "'Zrobione'",
  "'Zalegle'",
  "'Dzis'",
  "'Bez terminu'",
  "'Nadchodzace'",
  "'green'",
  "'red'",
  "'blue'",
  "'neutral'",
  "kind: 'done'",
  "kind: 'overdue'",
  "kind: 'today'",
  "kind: 'no_due'",
  "kind: 'upcoming'",
]) {
  assertIncludes(contract, needle, 'contract token');
}

assertIncludes(
  packageJson,
  '"verify:lf-prod-sot-005c-r15": "node scripts/guards/verify-lf-prod-sot-005c-r15-tasks-stable-task-display-status-contract.cjs && node --test tests/lf-prod-sot-005c-r15-tasks-stable-task-display-status-contract.test.cjs"',
  'R15 package alias',
);

for (const forbidden of [
  'getLeadStatusLabel',
  'getLeadStatusTone',
  'getCaseStatusLabel',
  'getCaseStatusTone',
  'TodayStable',
  'work-item-card',
  'insertTaskToSupabase',
  'updateTaskInSupabase',
  'deleteTaskFromSupabase',
  'insertEvent',
  'updateEvent',
]) {
  assertNotIncludes(contract, forbidden, 'wrong surface in contract');
}

assertNotIncludes(tasksStable, "from '../lib/source-of-truth/task-display-status'", 'TasksStable R15 runtime import');
assertNotIncludes(tasksStable, 'getTaskDisplayStatus', 'TasksStable R15 runtime call');
assertNotIncludes(todayStable, 'task-display-status', 'TodayStable R15 import');
assertNotIncludes(workItemCard, 'task-display-status', 'WorkItemCard R15 import');

for (const reportToken of [
  'TASKS_STABLE_TASK_DISPLAY_STATUS_FACADE_CONTRACT_GUARD_CREATED',
  'NO_RUNTIME_REWIRE',
  'NO_TASKSSTABLE_CALLSITE_CHANGE',
  'NO_CALLBACK_CHANGE',
  'NO_MUTATION_CHANGE',
  'NEXT_STAGE_SELECTED: LF-PROD-SOT-005C-R16_TASKS_STABLE_LIST_TASK_STATUS_LABEL_TONE_FACADE_RUNTIME_ADOPTION_MAP_DO_POTWIERDZENIA',
]) {
  assertIncludes(report, reportToken, 'R15 app report token');
}

console.log('LF-PROD-SOT-005C-R15 tasks stable task display status contract guard PASS');
