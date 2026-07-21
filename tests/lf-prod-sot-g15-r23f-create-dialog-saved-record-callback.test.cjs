const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const eventPath = path.join(root, 'src/components/EventCreateDialog.tsx');
const taskPath = path.join(root, 'src/components/TaskCreateDialog.tsx');
const guardPath = path.join(root, 'scripts/check-g15-r23f-create-dialog-saved-record-callback.cjs');

function normalizeLineEndings(source) {
  return source.replace(/\r\n/g, '\n');
}

const eventSource = normalizeLineEndings(fs.readFileSync(eventPath, 'utf8'));
const taskSource = normalizeLineEndings(fs.readFileSync(taskPath, 'utf8'));

function occurrences(source, value) {
  return source.split(value).length - 1;
}

function submitBlock(source) {
  const start = source.indexOf('  const handleSubmit = async ');
  const end = source.indexOf('\n  return (', start);
  assert.notEqual(start, -1, 'handleSubmit start missing');
  assert.notEqual(end, -1, 'handleSubmit end missing');
  return source.slice(start, end);
}

function assertOrdered(source, values) {
  const positions = values.map((value) => source.indexOf(value));
  assert.ok(positions.every((position) => position >= 0), `missing ordered contract: ${JSON.stringify({ values, positions })}`);
  for (let index = 1; index < positions.length; index += 1) {
    assert.ok(positions[index] > positions[index - 1], `unexpected runtime order: ${JSON.stringify({ values, positions })}`);
  }
}

test('R23F focused guard passes on LF and CRLF worktrees', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /PASS: R23F/);
});

test('EventCreateDialog callback accepts the exact insert result', () => {
  assert.match(
    eventSource,
    /onSaved\?: \(\n\s+createdEvent: Awaited<ReturnType<typeof insertEventToSupabase>>,\n\s+\) => void \| Promise<void>;/,
  );
  assert.equal(occurrences(eventSource, 'await onSaved?.(createdEvent);'), 1);
  assert.equal(occurrences(eventSource, 'const createdEvent = await insertEventToSupabase({'), 1);
  assert.doesNotMatch(eventSource, /onSaved\?: \(\) => void \| Promise<void>;/);
});

test('TaskCreateDialog callback accepts the exact insert result', () => {
  assert.match(
    taskSource,
    /onSaved\?: \(\n\s+createdTask: Awaited<ReturnType<typeof insertTaskToSupabase>>,\n\s+\) => void \| Promise<void>;/,
  );
  assert.equal(occurrences(taskSource, 'await onSaved?.(createdTask);'), 1);
  assert.equal(occurrences(taskSource, 'const createdTask = await insertTaskToSupabase({'), 1);
  assert.doesNotMatch(taskSource, /onSaved\?: \(\) => void \| Promise<void>;/);
});

test('Event create runtime order remains insert, toast, close, reset, callback', () => {
  assertOrdered(submitBlock(eventSource), [
    'const createdEvent = await insertEventToSupabase({',
    "toast.success('Wydarzenie dodane');",
    'onOpenChange(false);',
    'setForm(defaultEventCreateForm(context));',
    'await onSaved?.(createdEvent);',
  ]);
});

test('Task create runtime order remains insert, toast, close, reset, callback', () => {
  assertOrdered(submitBlock(taskSource), [
    'const createdTask = await insertTaskToSupabase({',
    "toast.success('Zadanie dodane');",
    'onOpenChange(false);',
    'setForm(defaultTaskCreateForm(context));',
    'await onSaved?.(createdTask);',
  ]);
});
