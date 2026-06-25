const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function pad2(value) {
  return String(value).padStart(2, '0');
}

function formatPartsInTimeZone(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const out = {};
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== 'literal') out[part.type] = part.value;
  }
  return {
    year: Number(out.year),
    month: Number(out.month),
    day: Number(out.day),
    hour: Number(out.hour),
    minute: Number(out.minute),
    second: Number(out.second),
  };
}

function getTimeZoneOffsetMinutes(date, timeZone) {
  const parts = formatPartsInTimeZone(date, timeZone);
  const localAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return Math.round((localAsUtc - date.getTime()) / 60000);
}

function localDateTimeInputToUtcIso(value, timeZone = 'Europe/Warsaw') {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/.exec(String(value || '').trim().replace(' ', 'T'));
  assert.ok(match, 'valid local input expected');
  const localAsUtc = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4]), Number(match[5]), Number(match[6] || 0), 0);
  let offset = getTimeZoneOffsetMinutes(new Date(localAsUtc), timeZone);
  let utcMs = localAsUtc - offset * 60000;
  const correctedOffset = getTimeZoneOffsetMinutes(new Date(utcMs), timeZone);
  if (correctedOffset !== offset) utcMs = localAsUtc - correctedOffset * 60000;
  return new Date(utcMs).toISOString();
}

function normalizeCloseFlowDateTimeToUtcIso(value, timeZone = 'Europe/Warsaw') {
  const raw = String(value || '').trim();
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return localDateTimeInputToUtcIso(raw + 'T00:00', timeZone);
  if (!/(?:Z|[+-]\d{2}:?\d{2})$/i.test(raw) && /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?$/.test(raw)) {
    return localDateTimeInputToUtcIso(raw.replace(' ', 'T'), timeZone);
  }
  const parsed = new Date(raw);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : null;
}

function utcIsoToGoogleDateTimeInDefaultZone(value, timeZone = 'Europe/Warsaw') {
  const iso = normalizeCloseFlowDateTimeToUtcIso(value, timeZone);
  assert.ok(iso, 'valid iso expected');
  const parts = formatPartsInTimeZone(new Date(iso), timeZone);
  return {
    dateTime: String(parts.year) + '-' + pad2(parts.month) + '-' + pad2(parts.day) + 'T' + pad2(parts.hour) + ':' + pad2(parts.minute) + ':' + pad2(parts.second),
    timeZone,
  };
}

test('R4 source delegates outbound time parsing to central timezone contract', () => {
  const outbound = read('src/server/google-calendar-outbound.ts');
  assert.match(outbound, /normalizeCloseFlowDateTimeToUtcIso/);
  assert.match(outbound, /STAGE232G_R4_GOOGLE_CALENDAR_OUTBOUND_TIMEZONE_NO_SHIFT/);
  const fn = outbound.slice(outbound.indexOf('function asIsoDate'), outbound.indexOf('function asNumber'));
  assert.match(fn, /return normalizeCloseFlowDateTimeToUtcIso\(value\);/);
  assert.equal(fn.includes('new Date(raw)'), false);
});

test('R4 no-offset CloseFlow local 13:19 roundtrips to Google as 13:19 Warsaw, not 15:19', () => {
  const storedUtc = normalizeCloseFlowDateTimeToUtcIso('2026-06-25T13:19:00');
  assert.equal(storedUtc, '2026-06-25T11:19:00.000Z');
  const google = utcIsoToGoogleDateTimeInDefaultZone(storedUtc);
  assert.equal(google.timeZone, 'Europe/Warsaw');
  assert.equal(google.dateTime, '2026-06-25T13:19:00');
});

test('R4 explicit UTC 11:19Z becomes Google 13:19 Warsaw exactly once', () => {
  const google = utcIsoToGoogleDateTimeInDefaultZone('2026-06-25T11:19:00.000Z');
  assert.equal(google.dateTime, '2026-06-25T13:19:00');
});

test('R4 explicit +02 offset is not shifted twice', () => {
  const normalized = normalizeCloseFlowDateTimeToUtcIso('2026-06-25T13:19:00+02:00');
  assert.equal(normalized, '2026-06-25T11:19:00.000Z');
  const google = utcIsoToGoogleDateTimeInDefaultZone(normalized);
  assert.equal(google.dateTime, '2026-06-25T13:19:00');
});

test('R4 old raw Date interpretation demonstrates the rejected +2h bug', () => {
  const oldWrongStored = new Date('2026-06-25T13:19:00').toISOString();
  const google = utcIsoToGoogleDateTimeInDefaultZone(oldWrongStored);
  // In UTC Node runtimes this is the exact observed production class: 13:19 treated as UTC -> 15:19 Warsaw.
  if (oldWrongStored === '2026-06-25T13:19:00.000Z') {
    assert.equal(google.dateTime, '2026-06-25T15:19:00');
  }
});
