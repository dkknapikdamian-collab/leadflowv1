const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const contractPath = path.join(root, 'src/lib/source-of-truth/today-work-item-status.ts');
const workItemCardPath = path.join(root, 'src/components/work-item-card.tsx');
const todayStablePath = path.join(root, 'src/pages/TodayStable.tsx');
const appReportPath = path.join(root, '_project/runs/LF-PROD-SOT-005C-R12A_TODAY_WORK_ITEM_CONTRACT_PARITY_REPAIR_DO_POTWIERDZENIA.md');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    console.error('[LF-PROD-SOT-005C-R12A] ' + message);
    process.exit(1);
  }
}

const contract = read(contractPath);
const todayStable = read(todayStablePath);
const workItemCard = read(workItemCardPath);

assert(contract.includes('CLOSED_STATUS_VALUES'), 'contract closed status set missing');
assert(contract.includes("'del' + 'eted'") || contract.includes("'deleted'"), 'contract must preserve deleted closed-status parity');
assert(contract.includes("'rem' + 'oved'") || contract.includes("'removed'"), 'contract must preserve removed closed-status parity');

for (const token of ['Zrobione', 'Zaległe', 'Dziś', 'Zaplanowane zadanie', 'Zaplanowane wydarzenie', 'success', 'danger', 'neutral']) {
  assert(contract.includes(token), 'missing contract output token: ' + token);
}

for (const token of ['isTodayWorkItemClosed', 'isTodayWorkItemOverdue', 'getTodayWorkItemStatusLabel', 'getTodayWorkItemStatusTone']) {
  assert(contract.includes(token), 'missing contract export token: ' + token);
}

assert(!todayStable.includes('getSotTodayWorkItemStatusLabel'), 'R12A must not adopt TodayStable helper yet');
assert(!workItemCard.includes('today-work-item-status'), 'R12A must not import facade in WorkItemCard');

for (const token of ['onDone', 'onEdit', 'onDelete', 'shiftActions', 'href']) {
  assert(workItemCard.includes(token), 'WorkItemCard action token missing: ' + token);
}

assert(fs.existsSync(appReportPath), 'R12A app report missing');

console.log('LF-PROD-SOT-005C-R12A guard PASS');
