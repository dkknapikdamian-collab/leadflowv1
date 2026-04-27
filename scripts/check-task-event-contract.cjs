const fs = require('fs');
const path = require('path');

const repo = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}

const contract = read('src/lib/task-event-contract.ts');
const scheduling = read('src/lib/scheduling.ts');
const today = read('src/pages/Today.tsx');

assert(contract.includes('getTaskMainDate'), 'task-event-contract missing getTaskMainDate');
assert(contract.includes('getTaskStartAt'), 'task-event-contract missing getTaskStartAt');
assert(contract.includes('getEventMainDate'), 'task-event-contract missing getEventMainDate');
assert(contract.includes('normalizeTaskRecord'), 'task-event-contract missing normalizeTaskRecord');
assert(contract.includes('normalizeEventRecord'), 'task-event-contract missing normalizeEventRecord');
assert(scheduling.includes('task-event-contract'), 'scheduling does not reference task-event-contract');
assert(scheduling.includes("from './task-event-contract'"), 'scheduling does not import task-event-contract');
assert(scheduling.includes('getTaskStartAt'), 'scheduling does not export getTaskStartAt');
assert(!scheduling.includes('function normalizeScheduleDateTimeValue'), 'scheduling still owns normalizeScheduleDateTimeValue');
assert(today.includes('Zablokowane sprawy'), 'Today missing blocked cases tile');
assert(today.includes('Brak następnego kroku'), 'Today missing clear without-action explanation');
assert(today.includes('Brak zmiany 7+ dni'), 'Today missing clear without-movement explanation');
assert(today.includes('<TodayPipelineValueCard leads={leads} cases={cases} />'), 'TodayPipelineValueCard call missing cases');

console.log('OK: task/event contract and Today blocked cases are guarded.');
