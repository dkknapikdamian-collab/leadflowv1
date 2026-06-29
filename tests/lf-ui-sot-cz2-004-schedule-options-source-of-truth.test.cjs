const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const ROOT = process.cwd();
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');

const canonical = 'src/lib/source-of-truth/schedule-options.ts';
const options = 'src/lib/options.ts';
const calendarStatus = 'src/lib/config/calendar-status.ts';

function expectValues(source, exportName, values) {
  const start = source.indexOf(`export const ${exportName}`);
  assert.notEqual(start, -1, `${exportName} export missing`);
  const slice = source.slice(start, source.indexOf('] as const', start));
  for (const value of values) {
    assert.match(slice, new RegExp(`value:\\s*['"]${value}['"]`), `${exportName} missing ${value}`);
  }
}

test('CZ2-004 schedule option values preserve current options', () => {
  const source = read(canonical);
  expectValues(source, 'TASK_TYPE_OPTIONS', ['follow_up', 'phone', 'reply', 'send_offer', 'meeting', 'other']);
  expectValues(source, 'EVENT_TYPE_OPTIONS', ['meeting', 'phone_call', 'follow_up', 'deadline', 'custom']);
  expectValues(source, 'PRIORITY_OPTIONS', ['low', 'medium', 'high']);
  expectValues(source, 'RECURRENCE_OPTIONS', ['none', 'daily', 'weekly', 'monthly']);
  expectValues(source, 'REMINDER_MODE_OPTIONS', ['none', 'once', 'recurring']);
  expectValues(source, 'GOOGLE_CALENDAR_REMINDER_METHOD_OPTIONS', ['default', 'popup', 'email', 'popup_email']);
  for (const value of ['540', '1440', '2880', '10080']) {
    assert.match(source, new RegExp(`value:\\s*${value}\\b`), `REMINDER_OFFSET_OPTIONS missing ${value}`);
  }
});

test('CZ2-004 status labels and done helper preserve behavior', () => {
  const source = read(canonical);
  assert.match(source, /done:\s*\{\s*value:\s*'done',\s*label:\s*'Zrobione'/);
  assert.match(source, /done:\s*\{\s*value:\s*'done',\s*label:\s*'Odbyte'/);
  for (const value of ['done', 'completed', 'cancelled', 'canceled', 'archived', 'deleted']) {
    assert.match(source, new RegExp(`'${value}'`));
  }
  assert.match(source, /function\s+isDoneStatus\s*\(/);
});

test('CZ2-004 wrappers point to schedule SOT and remove local arrays', () => {
  const optionsSource = read(options);
  assert.match(optionsSource, /from '\.\/source-of-truth\/schedule-options'/);
  assert.match(optionsSource, /TASK_TYPE_OPTIONS as TASK_TYPES/);
  assert.match(optionsSource, /EVENT_TYPE_OPTIONS as EVENT_TYPES/);
  assert.doesNotMatch(optionsSource, /export\s+const\s+TASK_TYPES\s*=/);
  assert.doesNotMatch(optionsSource, /export\s+const\s+EVENT_TYPES\s*=/);

  const calendarSource = read(calendarStatus);
  assert.match(calendarSource, /from '\.\.\/source-of-truth\/schedule-options'/);
  assert.doesNotMatch(calendarSource, /TASK_STATUS_LABELS\s*[:=]/);
  assert.doesNotMatch(calendarSource, /CALENDAR_EVENT_STATUS_LABELS\s*[:=]/);
  assert.doesNotMatch(calendarSource, /CLOSED_WORK_ITEM_STATUSES\s*=\s*\[/);
});

test('CZ2-004 canonical SOT uses domain normalizers and has no mojibake or bad tokens', () => {
  const source = read(canonical);
  assert.match(source, /normalizeTaskStatus/);
  assert.match(source, /normalizeEventStatus/);
  assert.match(source, /type TaskStatus/);
  assert.match(source, /type EventStatus/);
  assert.doesNotMatch(source, /Ä|Ă|Ĺ|â€|�/);
  for (const token of [
    'TASK_TASK_TYPES',
    'EVENT_EVENT_TYPES',
    'TASK_TASK_TYPE_OPTIONS',
    'EVENT_EVENT_TYPE_OPTIONS',
    'SCHEDULE_SCHEDULE_OPTIONS',
    'TASK_TYPE_OPTIONS_LOCAL',
    'EVENT_TYPE_OPTIONS_LOCAL',
    'PRIORITY_OPTIONS_LOCAL',
    'RECURRENCE_OPTIONS_LOCAL',
  ]) {
    assert.doesNotMatch(source, new RegExp(token));
  }
});
