const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const todayPath = path.join(root, 'src/pages/TodayStable.tsx');
const workItemCardPath = path.join(root, 'src/components/work-item-card.tsx');
const reportPath = path.join(root, '_project/runs/LF-PROD-SOT-005C-R12_TODAYSTABLE_STATUS_TONE_HELPER_FACADE_RUNTIME_ADOPTION_DO_POTWIERDZENIA.md');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    console.error('[LF-PROD-SOT-005C-R12] ' + message);
    process.exit(1);
  }
}

const today = read(todayPath);
const workItemCard = read(workItemCardPath);

const requiredTodayTokens = [
  "from '../lib/source-of-truth/today-work-item-status'",
  'getTodayWorkItemStatusLabel as getSotTodayWorkItemStatusLabel',
  'getTodayWorkItemStatusTone as getSotTodayWorkItemStatusTone',
  'isTodayWorkItemClosed as isSotTodayWorkItemClosed',
  'isTodayWorkItemOverdue as isSotTodayWorkItemOverdue',
  'return isSotTodayWorkItemClosed(value);',
  'return isSotTodayWorkItemOverdue(momentRaw, status, todayKey);',
  'return getSotTodayWorkItemStatusLabel(kind, status, momentRaw, todayKey);',
  "return getSotTodayWorkItemStatusTone('task', status, momentRaw, todayKey);",
];

for (const token of requiredTodayTokens) {
  assert(today.includes(token), 'TodayStable missing token: ' + token);
}

assert(!today.includes("getWorkItemCardStatusTone } from '../components/work-item-card'"), 'TodayStable must not import getWorkItemCardStatusTone after R12');
assert(!today.includes('getWorkItemCardStatusTone(getTodayWorkItemStatusLabel'), 'TodayStable tone helper must not call WorkItemCard tone helper after R12');
assert(!workItemCard.includes('today-work-item-status'), 'WorkItemCard must not import today-work-item-status in R12');

for (const token of ['onDone', 'onEdit', 'onDelete', 'shiftActions', 'href', 'onOpen']) {
  assert(workItemCard.includes(token), 'WorkItemCard action token missing: ' + token);
}

assert(fs.existsSync(reportPath), 'R12 app report missing');

console.log('LF-PROD-SOT-005C-R12 guard PASS');