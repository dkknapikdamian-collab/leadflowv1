#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const exists = (file) => fs.existsSync(path.join(root, file));
const expect = (condition, message) => { if (!condition) fail.push(message); };

const normalizePath = 'src/lib/work-items/normalize.ts';
const calendarItemsPath = 'src/lib/calendar-items.ts';
const taskEventContractPath = 'src/lib/task-event-contract.ts';
const optionsPath = 'src/lib/options.ts';

expect(exists(normalizePath), 'normalizeWorkItem source file must exist');

const normalizeBody = exists(normalizePath) ? read(normalizePath) : '';
const calendarItems = read(calendarItemsPath);
const taskEventContract = read(taskEventContractPath);
const optionsBody = read(optionsPath);
const tasksView = read('src/pages/Tasks.tsx');
const calendarView = read('src/pages/Calendar.tsx');

expect(normalizeBody.includes('export function normalizeWorkItem'), 'normalizeWorkItem must be exported');
expect(calendarItems.includes("import { normalizeWorkItem }"), 'calendar-items must import normalizeWorkItem');
expect(calendarItems.includes('normalizeWorkItem(row)'), 'calendar-items must delegate normalization');
expect(!calendarItems.includes('normalizeTaskContract('), 'calendar-items must not use normalizeTaskContract');
expect(!calendarItems.includes('normalizeEventContract('), 'calendar-items must not use normalizeEventContract');

expect(taskEventContract.includes("import { normalizeWorkItem }"), 'task-event-contract must import normalizeWorkItem');
expect(taskEventContract.includes('normalizeWorkItem(task)'), 'task-event-contract task path must delegate to normalizeWorkItem');
expect(taskEventContract.includes('normalizeWorkItem(event)'), 'task-event-contract event path must delegate to normalizeWorkItem');

const forbiddenFallbacks = [
  /dueAt\s*\|\|\s*scheduledAt\s*\|\|\s*date/,
  /scheduledAt\s*\|\|\s*date/,
  /start_at\s*\|\|\s*startAt/,
];
const viewCorpus = `${tasksView}\n${calendarView}`;
for (const pattern of forbiddenFallbacks) {
  expect(!pattern.test(viewCorpus), `forbidden fallback detected: ${pattern}`);
}

expect(!optionsBody.includes('15 minut'), 'forbidden reminder preset 15m detected');
expect(!optionsBody.includes('30 minut'), 'forbidden reminder preset 30m detected');
expect(!optionsBody.includes('1 godzin'), 'forbidden reminder preset 1h detected');

expect(tasksView.includes('Niepowiązane z leadem/sprawą/klientem') || calendarView.includes('Brak powiązania'), 'standalone copy marker is required');
expect(!tasksView.includes('standalone next step'), 'standalone must not define next-step helper');
expect(!calendarView.includes('standalone next step'), 'standalone must not define next-step helper');

if (fail.length) {
  console.error('Stage92 work-items date contract guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}
console.log('PASS STAGE92_WORK_ITEMS_DATE_CONTRACT');

