const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function loadContract() {
  let source = fs.readFileSync('src/lib/calendar-timezone-contract.ts', 'utf8');
  source = source
    .replace(/export const /g, 'const ')
    .replace(/export function /g, 'function ');
  source += `\nmodule.exports = {\n  CLOSEFLOW_DEFAULT_TIMEZONE,\n  localDateTimeInputToUtcIso,\n  normalizeCloseFlowDateTimeToUtcIso,\n  localDateTimeInputToGoogleDateTime,\n  utcIsoToGoogleDateTimeInDefaultZone,\n  googleDateTimeToUtcIso,\n  localDateTimeInputToReminderUtcIso,\n  assertNoCalendarTimeShift,\n};`;
  const sandbox = { module: { exports: {} }, exports: {}, Intl, Date, String, Number, Math, RegExp, Error };
  vm.runInNewContext(source, sandbox, { filename: 'calendar-timezone-contract.ts' });
  return sandbox.module.exports;
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test('Europe/Warsaw winter and summer local time converts to correct UTC', () => {
  const c = loadContract();
  assert.equal(c.CLOSEFLOW_DEFAULT_TIMEZONE, 'Europe/Warsaw');
  assert.equal(c.localDateTimeInputToUtcIso('2026-01-15T12:00'), '2026-01-15T11:00:00.000Z');
  assert.equal(c.localDateTimeInputToUtcIso('2026-06-15T12:00'), '2026-06-15T10:00:00.000Z');
});

test('Google outbound returns wall-clock dateTime plus timeZone, not shifted Z time', () => {
  const c = loadContract();
  assert.deepStrictEqual(plain(c.utcIsoToGoogleDateTimeInDefaultZone('2026-06-15T10:00:00.000Z')), {
    dateTime: '2026-06-15T12:00:00',
    timeZone: 'Europe/Warsaw',
  });
  assert.deepStrictEqual(plain(c.localDateTimeInputToGoogleDateTime('2026-06-15T12:00')), {
    dateTime: '2026-06-15T12:00:00',
    timeZone: 'Europe/Warsaw',
  });
});

test('Google inbound dateTime plus timeZone roundtrips back to intended CloseFlow time', () => {
  const c = loadContract();
  const utc = c.googleDateTimeToUtcIso({ dateTime: '2026-06-15T12:00:00', timeZone: 'Europe/Warsaw' });
  assert.equal(utc, '2026-06-15T10:00:00.000Z');
  const google = plain(c.utcIsoToGoogleDateTimeInDefaultZone(utc));
  assert.equal(google.dateTime.slice(0, 16), '2026-06-15T12:00');
  assert.equal(c.assertNoCalendarTimeShift('2026-06-15T12:00', google.dateTime), true);
});

test('reminderAt keeps exact minutes before local event start', () => {
  const c = loadContract();
  assert.equal(c.localDateTimeInputToReminderUtcIso('2026-06-15T12:00', 30), '2026-06-15T09:30:00.000Z');
  assert.equal(c.localDateTimeInputToReminderUtcIso('2026-01-15T12:00', 30), '2026-01-15T10:30:00.000Z');
});

test('source files use R11 contract and block old Google bare ISO body', () => {
  const sync = fs.readFileSync('src/server/google-calendar-sync.ts', 'utf8');
  const inbound = fs.readFileSync('src/server/google-calendar-inbound.ts', 'utf8');
  const events = fs.readFileSync('src/server/event-route-stage124f.ts', 'utf8');
  const tasks = fs.readFileSync('src/server/task-route-stage124f.ts', 'utf8');
  assert.match(sync, /utcIsoToGoogleDateTimeInDefaultZone/);
  assert.match(sync, /timeZone: CLOSEFLOW_DEFAULT_TIMEZONE/);
  assert.doesNotMatch(sync, /dateTime:\s*start\.toISOString\(\)/);
  assert.match(inbound, /googleDateTimeToUtcIso/);
  assert.match(events, /normalizeCloseFlowDateTimeToUtcIso/);
  assert.match(tasks, /normalizeCloseFlowDateTimeToUtcIso/);
});
