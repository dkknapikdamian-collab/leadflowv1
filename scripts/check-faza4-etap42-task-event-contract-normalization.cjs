#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const results = [];

function readRequired(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) {
    results.push({ level: 'FAIL', scope: relativePath, message: 'Missing file' });
    return '';
  }
  return fs.readFileSync(full, 'utf8').replace(/^\uFEFF/, '');
}
function pass(scope, message) { results.push({ level: 'PASS', scope, message }); }
function fail(scope, message) { results.push({ level: 'FAIL', scope, message }); }
function assertIncludes(scope, content, needle, message) {
  if (content.includes(needle)) pass(scope, message || 'Found: ' + needle);
  else fail(scope, (message || 'Missing: ' + needle) + ' [needle=' + JSON.stringify(needle) + ']');
}
function assertNotIncludes(scope, content, needle, message) {
  if (!content.includes(needle)) pass(scope, message || 'Not found: ' + needle);
  else fail(scope, (message || 'Forbidden: ' + needle) + ' [needle=' + JSON.stringify(needle) + ']');
}
function assertRegex(scope, content, regex, message) {
  if (regex.test(content)) pass(scope, message || 'Matched: ' + regex);
  else fail(scope, (message || 'Missing pattern: ' + regex) + ' [regex=' + regex + ']');
}
function section(title) { console.log('\n== ' + title + ' =='); }

const files = {
  workItems: 'api/work-items.ts',
  dataContract: 'src/lib/data-contract.ts',
  releaseDoc: 'docs/release/FAZA4_ETAP42_TASK_EVENT_CONTRACT_NORMALIZATION_2026-05-03.md',
  technicalDoc: 'docs/technical/TASK_EVENT_CONTRACT_NORMALIZATION_STAGE42_2026-05-03.md',
  pkg: 'package.json',
  quiet: 'scripts/closeflow-release-check-quiet.cjs',
};

const workItems = readRequired(files.workItems);
const dataContract = readRequired(files.dataContract);
const releaseDoc = readRequired(files.releaseDoc);
const technicalDoc = readRequired(files.technicalDoc);
const pkgRaw = readRequired(files.pkg);
const quiet = readRequired(files.quiet);

section('Canonical normalizer source');
assertIncludes(files.dataContract, dataContract, 'export function normalizeTaskContract', 'normalizeTaskContract exists');
assertIncludes(files.dataContract, dataContract, 'export function normalizeEventContract', 'normalizeEventContract exists');
assertIncludes(files.dataContract, dataContract, 'scheduledAt: [', 'Task/event field map contains scheduledAt');
assertIncludes(files.dataContract, dataContract, 'startAt: [', 'Task/event field map contains startAt');
assertIncludes(files.dataContract, dataContract, 'reminderAt: [', 'Task/event field map contains reminderAt');
assertIncludes(files.dataContract, dataContract, 'recurrenceRule: [', 'Task/event field map contains recurrenceRule');

section('api/work-items.ts uses canonical normalizers');
assertIncludes(files.workItems, workItems, "normalizeEventContract", 'work-items imports/uses normalizeEventContract');
assertIncludes(files.workItems, workItems, "normalizeTaskContract", 'work-items imports/uses normalizeTaskContract');
assertRegex(files.workItems, workItems, /import\s+\{\s*normalizeEventContract,\s*normalizeTaskContract\s*\}\s+from\s+['"]\.\.\/src\/lib\/data-contract\.js['"];/, 'work-items imports canonical normalizers');
assertRegex(files.workItems, workItems, /function normalizeTask\(row:\s*any\)\s*\{[\s\S]*const task = normalizeTaskContract\(row \|\| \{\}\);[\s\S]*\}/, 'normalizeTask delegates to normalizeTaskContract');
assertRegex(files.workItems, workItems, /function normalizeEvent\(row:\s*any\)\s*\{[\s\S]*const event = normalizeEventContract\(row \|\| \{\}\);[\s\S]*\}/, 'normalizeEvent delegates to normalizeEventContract');

const taskStart = workItems.indexOf('function normalizeTask(row: any)');
const eventStart = workItems.indexOf('function normalizeEvent(row: any)');
const isEventStart = workItems.indexOf('function isEventRow(row: any)');
const syncStart = workItems.indexOf('async function syncLeadNextAction');
const taskBlock = taskStart >= 0 && isEventStart > taskStart ? workItems.slice(taskStart, isEventStart) : '';
const eventBlock = eventStart >= 0 && syncStart > eventStart ? workItems.slice(eventStart, syncStart) : '';

assertNotIncludes(files.workItems, taskBlock, 'asIsoDate(row.scheduled_at)', 'normalizeTask no longer owns scheduled_at alias chain');
assertNotIncludes(files.workItems, taskBlock, 'asIsoDate(row.due_at)', 'normalizeTask no longer owns due_at alias chain');
assertNotIncludes(files.workItems, eventBlock, 'row.start_at || row.scheduled_at || row.startAt', 'normalizeEvent no longer owns start_at alias chain');
assertNotIncludes(files.workItems, eventBlock, "String(row.recurrence || 'none')", 'normalizeEvent no longer owns recurrence alias chain');

section('Compatibility output is preserved');
for (const marker of [
  'dueAt:',
  'date:',
  'time:',
  'reminder:',
  'recurrence:',
  'recurrenceEndType:',
  'recurrenceEndAt:',
  'recurrenceCount:',
]) {
  assertIncludes(files.workItems, taskBlock, marker, 'Task compatibility field kept: ' + marker);
}
for (const marker of [
  'startAt:',
  'endAt:',
  'reminder:',
  'recurrence:',
  'leadId:',
  'caseId:',
  'clientId:',
]) {
  assertIncludes(files.workItems, eventBlock, marker, 'Event compatibility/canonical field kept: ' + marker);
}

section('Documentation');
for (const marker of [
  'FAZA 4 - Etap 4.2 - Normalizacja task\u00F3w i event\u00F3w',
  'normalizeTaskContract',
  'normalizeEventContract',
  'api/work-items.ts',
  'FAZA 4 - Etap 4.3 - CRUD smoke test i reload persistence',
]) {
  assertIncludes(files.releaseDoc, releaseDoc, marker, 'Release doc contains: ' + marker);
}
for (const marker of [
  'TASK / EVENT CONTRACT NORMALIZATION',
  'normalizeTaskContract',
  'normalizeEventContract',
  'api/work-items.ts',
  'FAZA 4 - Etap 4.3 - CRUD smoke test i reload persistence',
]) {
  assertIncludes(files.technicalDoc, technicalDoc, marker, 'Technical doc contains: ' + marker);
}

section('Package and quiet gate');
let pkg = {};
try { pkg = JSON.parse(pkgRaw); pass(files.pkg, 'package.json parses'); }
catch (error) { fail(files.pkg, 'package.json parse failed: ' + (error instanceof Error ? error.message : String(error))); }
const scripts = pkg.scripts || {};
if (scripts['check:faza4-etap42-task-event-contract-normalization'] === 'node scripts/check-faza4-etap42-task-event-contract-normalization.cjs') pass(files.pkg, 'check:faza4-etap42-task-event-contract-normalization is wired');
else fail(files.pkg, 'missing check:faza4-etap42-task-event-contract-normalization');
if (scripts['test:faza4-etap42-task-event-contract-normalization'] === 'node --test tests/faza4-etap42-task-event-contract-normalization.test.cjs') pass(files.pkg, 'test:faza4-etap42-task-event-contract-normalization is wired');
else fail(files.pkg, 'missing test:faza4-etap42-task-event-contract-normalization');
assertIncludes(files.quiet, quiet, 'tests/faza4-etap42-task-event-contract-normalization.test.cjs', 'Quiet release gate includes Faza4 Etap4.2 test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL FAZA 4 - Etap 4.2 task/event contract normalization guard failed.');
  process.exit(1);
}
console.log('\nPASS FAZA 4 - Etap 4.2 task/event contract normalization guard');
