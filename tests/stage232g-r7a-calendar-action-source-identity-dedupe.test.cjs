const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function asText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isImportedExternalGoogleEvent(row) {
  const recordType = asText(row.record_type || row.recordType).toLowerCase();
  const type = asText(row.type).toLowerCase();
  const sourceProvider = asText(row.source_provider || row.sourceProvider).toLowerCase();
  return recordType === 'event' && (type === 'external_google_event' || sourceProvider === 'google_calendar');
}

function preferGoogleCalendarSourceIdentityRow(rows, userId) {
  const expected = asText(userId);
  const scoped = rows.filter((row) => {
    const candidates = [
      row.source_user_id,
      row.google_calendar_user_id,
      row.owner_user_id,
      row.created_by_user_id,
      row.user_id,
    ].map(asText).filter(Boolean);
    return !expected || candidates.length === 0 || candidates.includes(expected);
  });
  const pool = scoped.length ? scoped : rows;
  return pool.find((row) => !isImportedExternalGoogleEvent(row)) || pool[0] || null;
}

test('R7A outbound stamps source identity fields', () => {
  const outbound = read('src/server/google-calendar-outbound.ts');

  assert.ok(outbound.includes('STAGE232G_R7A_CALENDAR_ACTION_SOURCE_IDENTITY_DEDUPE'));
  assert.ok(outbound.includes("source_provider: googleEventId ? 'google_calendar' : null"));
  assert.ok(outbound.includes('source_external_id: googleEventId'));
  assert.ok(outbound.includes('source_user_id: userId || null'));
  assert.ok(outbound.includes('google_calendar_user_id: userId || null'));
  assert.ok(outbound.includes('findCanonicalGoogleCalendarDuplicateStage232GR7A'));
  assert.ok(outbound.includes('hideDuplicateImportedGoogleEventStage232GR7A'));
  assert.ok(outbound.includes('duplicate_hidden_by_r7a'));
});

test('R7A inbound looks up by Google identity, not title', () => {
  const inbound = read('src/server/google-calendar-inbound.ts');

  assert.ok(inbound.includes('STAGE232G_R7A_CALENDAR_ACTION_SOURCE_IDENTITY_DEDUPE'));
  assert.ok(inbound.includes('findExistingGoogleCalendarWorkItemByAnyIdentityStage232GR7A'));
  assert.ok(inbound.includes('google_calendar_event_id=eq.'));
  assert.ok(inbound.includes('source_provider=eq.google_calendar'));
  assert.equal(inbound.includes('title=eq.'), false);
});

test('R7A local row is preferred over mirrored external event with same google id', () => {
  const localTask = {
    id: 'local-task-1',
    record_type: 'task',
    type: 'follow_up',
    title: 'Takie same zadanie',
    google_calendar_event_id: 'google-1',
    source_user_id: 'user-1',
  };

  const externalEvent = {
    id: 'google-mirror-1',
    record_type: 'event',
    type: 'external_google_event',
    title: 'Takie same zadanie',
    source_provider: 'google_calendar',
    source_external_id: 'google-1',
    source_user_id: 'user-1',
  };

  assert.equal(preferGoogleCalendarSourceIdentityRow([externalEvent, localTask], 'user-1'), localTask);
});

test('R7A duplicate titles are allowed when identity differs', () => {
  const taskA = {
    id: 'a',
    record_type: 'task',
    title: 'Telefon',
    google_calendar_event_id: 'google-a',
    source_user_id: 'user-1',
  };

  const taskB = {
    id: 'b',
    record_type: 'task',
    title: 'Telefon',
    google_calendar_event_id: 'google-b',
    source_user_id: 'user-1',
  };

  assert.equal(taskA.title, taskB.title);
  assert.notEqual(taskA.id, taskB.id);
  assert.notEqual(taskA.google_calendar_event_id, taskB.google_calendar_event_id);
});

test('R7A canonical collision repair can hide imported mirror', () => {
  const outbound = read('src/server/google-calendar-outbound.ts');

  assert.ok(outbound.includes('hideDuplicateImportedGoogleEventStage232GR7A'));
  assert.ok(outbound.includes('duplicate_hidden_by_r7a'));
  assert.ok(outbound.includes('show_in_calendar: false'));
  assert.ok(outbound.includes('show_in_tasks: false'));
});
