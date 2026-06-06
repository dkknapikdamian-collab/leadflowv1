// @ts-nocheck
// STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH: centralny kontrakt czasu dla CloseFlow <-> Google Calendar.
// Cel: UI datetime-local Europe/Warsaw -> UTC w bazie -> Google dateTime + timeZone -> inbound bez przesunięcia.

export const CLOSEFLOW_DEFAULT_TIMEZONE = 'Europe/Warsaw';
export const STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH = 'CloseFlow local Warsaw time must roundtrip through Google Calendar without 1-2h shift and with reminders';

function pad2(value) {
  return String(value).padStart(2, '0');
}

function parseLocalDateTimeParts(value) {
  const raw = String(value || '').trim().replace(' ', 'T');
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/.exec(raw);
  if (!match) return null;
  const parts = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
    second: Number(match[6] || 0),
  };
  if (!Number.isFinite(parts.year) || !Number.isFinite(parts.month) || !Number.isFinite(parts.day)) return null;
  if (parts.month < 1 || parts.month > 12 || parts.day < 1 || parts.day > 31) return null;
  if (parts.hour < 0 || parts.hour > 23 || parts.minute < 0 || parts.minute > 59 || parts.second < 0 || parts.second > 59) return null;
  return parts;
}

function hasExplicitUtcOffset(value) {
  return /(?:Z|[+-]\d{2}:?\d{2})$/i.test(String(value || '').trim());
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

function formatGoogleLocalDateTime(date, timeZone) {
  const parts = formatPartsInTimeZone(date, timeZone);
  return String(parts.year) + '-' + pad2(parts.month) + '-' + pad2(parts.day) + 'T' + pad2(parts.hour) + ':' + pad2(parts.minute) + ':' + pad2(parts.second);
}

function formatInputLocalDateTime(parts) {
  return String(parts.year) + '-' + pad2(parts.month) + '-' + pad2(parts.day) + 'T' + pad2(parts.hour) + ':' + pad2(parts.minute) + ':' + pad2(parts.second);
}

export function localDateTimeInputToUtcIso(value, timeZone = CLOSEFLOW_DEFAULT_TIMEZONE) {
  const parts = parseLocalDateTimeParts(value);
  if (!parts) return null;
  const localAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second, 0);
  let offset = getTimeZoneOffsetMinutes(new Date(localAsUtc), timeZone);
  let utcMs = localAsUtc - offset * 60000;
  const correctedOffset = getTimeZoneOffsetMinutes(new Date(utcMs), timeZone);
  if (correctedOffset !== offset) utcMs = localAsUtc - correctedOffset * 60000;
  return new Date(utcMs).toISOString();
}

export function normalizeCloseFlowDateTimeToUtcIso(value, timeZone = CLOSEFLOW_DEFAULT_TIMEZONE) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return localDateTimeInputToUtcIso(raw + 'T00:00', timeZone);
  if (!hasExplicitUtcOffset(raw) && /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?$/.test(raw)) {
    return localDateTimeInputToUtcIso(raw.replace(' ', 'T'), timeZone);
  }
  const parsed = new Date(raw);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : null;
}

export function localDateTimeInputToGoogleDateTime(value, timeZone = CLOSEFLOW_DEFAULT_TIMEZONE) {
  const parts = parseLocalDateTimeParts(value);
  if (!parts) return null;
  return { dateTime: formatInputLocalDateTime(parts), timeZone };
}

export function utcIsoToGoogleDateTimeInDefaultZone(value, timeZone = CLOSEFLOW_DEFAULT_TIMEZONE) {
  const iso = normalizeCloseFlowDateTimeToUtcIso(value, timeZone);
  if (!iso) return null;
  return { dateTime: formatGoogleLocalDateTime(new Date(iso), timeZone), timeZone };
}

export function googleDateTimeToUtcIso(input, fallbackTimeZone = CLOSEFLOW_DEFAULT_TIMEZONE) {
  const source = input || {};
  const timeZone = String(source.timeZone || fallbackTimeZone || CLOSEFLOW_DEFAULT_TIMEZONE).trim() || CLOSEFLOW_DEFAULT_TIMEZONE;
  if (source.date && !source.dateTime) return localDateTimeInputToUtcIso(String(source.date) + 'T00:00', timeZone);
  const raw = String(source.dateTime || '').trim();
  if (!raw) return null;
  if (hasExplicitUtcOffset(raw)) {
    const parsed = new Date(raw);
    return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : null;
  }
  return localDateTimeInputToUtcIso(raw, timeZone);
}

export function localDateTimeInputToReminderUtcIso(startLocalDateTime, minutesBefore, timeZone = CLOSEFLOW_DEFAULT_TIMEZONE) {
  const startIso = localDateTimeInputToUtcIso(startLocalDateTime, timeZone);
  if (!startIso) return null;
  const minutes = Math.max(0, Math.min(40320, Math.round(Number(minutesBefore || 0))));
  return new Date(new Date(startIso).getTime() - minutes * 60000).toISOString();
}

export function assertNoCalendarTimeShift(inputLocal, outputLocal) {
  const input = parseLocalDateTimeParts(inputLocal);
  const output = parseLocalDateTimeParts(outputLocal);
  if (!input || !output) throw new Error('CALENDAR_TIME_SHIFT_ASSERT_INVALID_INPUT');
  const a = formatInputLocalDateTime(input).slice(0, 16);
  const b = formatInputLocalDateTime(output).slice(0, 16);
  if (a !== b) throw new Error('CALENDAR_TIME_SHIFT_DETECTED:' + a + '->' + b);
  return true;
}
