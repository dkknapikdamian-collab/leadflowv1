const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const contractPath = path.join(root, 'src/lib/source-of-truth/today-work-item-status.ts');
const todayStablePath = path.join(root, 'src/pages/TodayStable.tsx');
const workItemCardPath = path.join(root, 'src/components/work-item-card.tsx');
const reportPath = path.join(root, '_project/runs/LF-PROD-SOT-005C-R10_TODAY_WORK_ITEM_STATUS_TONE_FACADE_CONTRACT_GUARD_DO_POTWIERDZENIA.md');

function read(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Missing file: ${path.relative(root, filePath)}`);
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(text, needle, label) {
  if (!text.includes(needle)) throw new Error(`Missing ${label}: ${needle}`);
}

function assertNotIncludes(text, needle, label) {
  if (text.includes(needle)) throw new Error(`Forbidden ${label}: ${needle}`);
}

const contract = read(contractPath);
const todayStable = read(todayStablePath);
const workItemCard = read(workItemCardPath);
const report = read(reportPath);

for (const needle of [
  'export type TodayWorkItemKind',
  'export type TodayWorkItemTone',
  'export function isTodayWorkItemClosed',
  'export function isTodayWorkItemOverdue',
  'export function getTodayWorkItemStatusLabel',
  'export function getTodayWorkItemStatusTone',
  "'neutral'",
  "'danger'",
  "'success'",
  "'Zrobione'",
  "'Zaległe'",
  "'Dziś'",
  "'Zaplanowane zadanie'",
  "'Zaplanowane wydarzenie'",
]) {
  assertIncludes(contract, needle, 'contract token');
}

for (const forbidden of [
  'lead-status',
  'case-status',
  'getLeadStatusLabel',
  'getLeadStatusTone',
  'getCaseStatusLabel',
  'getCaseStatusTone',
]) {
  assertNotIncludes(contract, forbidden, 'wrong-domain facade usage');
}

for (const forbiddenImport of [
  'today-work-item-status',
  'getTodayWorkItemStatusTone',
]) {
  assertNotIncludes(todayStable, forbiddenImport, 'TodayStable runtime rewire');
  assertNotIncludes(workItemCard, forbiddenImport, 'WorkItemCard runtime rewire');
}

for (const actionToken of ['onDone', 'onEdit', 'onDelete', 'shiftActions', 'href']) {
  assertIncludes(workItemCard, actionToken, 'WorkItemCard action freeze token');
}

for (const reportToken of [
  'TODAY_WORK_ITEM_STATUS_TONE_FACADE_CONTRACT_CREATED',
  'NO_WORK_ITEM_CARD_RUNTIME_REWIRE',
  'NO_TODAYSTABLE_CALLSITE_REWIRE',
  'NO_ACTION_CALLBACK_CHANGE',
]) {
  assertIncludes(report, reportToken, 'R10 app report token');
}

const mojibakePattern = /Ã|Â|Ä|Å|�/;
for (const [label, text] of [['contract', contract], ['report', report]]) {
  if (mojibakePattern.test(text)) throw new Error(`Mojibake detected in ${label}`);
}

console.log('LF-PROD-SOT-005C-R10 today work item status/tone facade contract guard PASS');
