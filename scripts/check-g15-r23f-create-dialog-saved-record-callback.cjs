#!/usr/bin/env node
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const eventPath = path.join(root, 'src/components/EventCreateDialog.tsx');
const taskPath = path.join(root, 'src/components/TaskCreateDialog.tsx');

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function normalizeLineEndings(source) {
  return source.replace(/\r\n/g, '\n');
}

function occurrences(source, value) {
  return source.split(value).length - 1;
}

function gitBlobSha(source) {
  const body = Buffer.from(source, 'utf8');
  const header = Buffer.from(`blob ${body.length}\0`, 'utf8');
  return crypto.createHash('sha1').update(header).update(body).digest('hex');
}

function submitBlock(source, label) {
  const start = source.indexOf('  const handleSubmit = async ');
  const end = source.indexOf('\n  return (', start);
  if (start === -1 || end === -1) fail(`${label}: handleSubmit block not found`);
  return source.slice(start, end);
}

function assertOrdered(source, label, values) {
  let previous = -1;
  for (const value of values) {
    const current = source.indexOf(value);
    if (current === -1) fail(`${label}: missing ordered contract: ${value}`);
    if (current <= previous) fail(`${label}: runtime order changed near: ${value}`);
    previous = current;
  }
}

for (const sourcePath of [eventPath, taskPath]) {
  if (!fs.existsSync(sourcePath)) fail(`missing source file: ${path.relative(root, sourcePath)}`);
}

const eventSource = normalizeLineEndings(fs.readFileSync(eventPath, 'utf8'));
const taskSource = normalizeLineEndings(fs.readFileSync(taskPath, 'utf8'));
const eventSubmit = submitBlock(eventSource, 'EventCreateDialog');
const taskSubmit = submitBlock(taskSource, 'TaskCreateDialog');

const oldCallback = '  onSaved?: () => void | Promise<void>;';
const eventCallback = [
  '  onSaved?: (',
  '    createdEvent: Awaited<ReturnType<typeof insertEventToSupabase>>,',
  '  ) => void | Promise<void>;',
].join('\n');
const taskCallback = [
  '  onSaved?: (',
  '    createdTask: Awaited<ReturnType<typeof insertTaskToSupabase>>,',
  '  ) => void | Promise<void>;',
].join('\n');

if (occurrences(eventSource, eventCallback) !== 1) fail('Event callback result type is missing or duplicated');
if (occurrences(taskSource, taskCallback) !== 1) fail('Task callback result type is missing or duplicated');
if (eventSource.includes(oldCallback)) fail('Event callback still declares zero arguments');
if (taskSource.includes(oldCallback)) fail('Task callback still declares zero arguments');
if (/onSaved\?:\s*\([\s\S]{0,160}\bany\b/.test(eventSource)) fail('Event callback type must not use any');
if (/onSaved\?:\s*\([\s\S]{0,160}\bany\b/.test(taskSource)) fail('Task callback type must not use any');

if (occurrences(eventSource, 'await onSaved?.(createdEvent);') !== 1) fail('Event saved-record callback call changed');
if (occurrences(taskSource, 'await onSaved?.(createdTask);') !== 1) fail('Task saved-record callback call changed');
if (occurrences(eventSource, 'const createdEvent = await insertEventToSupabase({') !== 1) fail('Event insert call changed');
if (occurrences(taskSource, 'const createdTask = await insertTaskToSupabase({') !== 1) fail('Task insert call changed');

assertOrdered(eventSubmit, 'EventCreateDialog', [
  'const createdEvent = await insertEventToSupabase({',
  "toast.success('Wydarzenie dodane');",
  'onOpenChange(false);',
  'setForm(defaultEventCreateForm(context));',
  'await onSaved?.(createdEvent);',
]);
assertOrdered(taskSubmit, 'TaskCreateDialog', [
  'const createdTask = await insertTaskToSupabase({',
  "toast.success('Zadanie dodane');",
  'onOpenChange(false);',
  'setForm(defaultTaskCreateForm(context));',
  'await onSaved?.(createdTask);',
]);

const restoredEvent = eventSource.replace(eventCallback, oldCallback);
const restoredTask = taskSource.replace(taskCallback, oldCallback);
const expectedEventBaseBlob = 'eb189ccda7e3c8c3ec36c365ca7a403c3c844e0c';
const expectedTaskBaseBlob = '193ec0eb7bb7bf738b7653ed3c617a1374652f92';

if (gitBlobSha(restoredEvent) !== expectedEventBaseBlob) {
  fail('EventCreateDialog contains runtime changes outside the callback type declaration');
}
if (gitBlobSha(restoredTask) !== expectedTaskBaseBlob) {
  fail('TaskCreateDialog contains runtime changes outside the callback type declaration');
}

console.log('PASS: R23F aligns both create-dialog onSaved callback types with saved insert records and preserves runtime byte-for-byte outside those declarations on LF and CRLF worktrees.');
