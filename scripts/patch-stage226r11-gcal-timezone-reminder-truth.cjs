const fs = require('fs');
const path = require('path');

const STAGE = 'STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH';
const repo = process.cwd();

function file(rel) {
  return path.join(repo, rel);
}

function exists(rel) {
  return fs.existsSync(file(rel));
}

function read(rel) {
  return fs.readFileSync(file(rel), 'utf8');
}

function detectEol(text) {
  return text.includes('\r\n') ? '\r\n' : '\n';
}

function write(rel, text) {
  fs.mkdirSync(path.dirname(file(rel)), { recursive: true });
  fs.writeFileSync(file(rel), text, 'utf8');
}

function backup(rel, backupDir) {
  if (!exists(rel)) return;
  const target = path.join(backupDir, rel.replace(/[\\/:*?"<>|]/g, '_'));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(file(rel), target);
}

function normalizeNewlines(text, eol) {
  return text.replace(/\r?\n/g, eol);
}

function replaceOnce(text, search, replacement, label) {
  if (!text.includes(search)) {
    throw new Error(`Missing patch target: ${label}`);
  }
  return text.replace(search, replacement);
}

function replaceRegex(text, regex, replacement, label) {
  if (!regex.test(text)) {
    throw new Error(`Missing patch target: ${label}`);
  }
  return text.replace(regex, replacement);
}

function ensureBefore(text, needle, insertion, label) {
  if (text.includes(insertion.trim())) return text;
  if (!text.includes(needle)) throw new Error(`Missing insertion anchor: ${label}`);
  return text.replace(needle, insertion + needle);
}

function ensureAfter(text, needle, insertion, label) {
  if (text.includes(insertion.trim())) return text;
  if (!text.includes(needle)) throw new Error(`Missing insertion anchor: ${label}`);
  return text.replace(needle, needle + insertion);
}

function stripExtraEofBlankLines(text) {
  return text.replace(/[ \t]+$/gm, '').replace(/(?:\r?\n){2,}$/g, '\n');
}

function appendSection(rel, heading, lines) {
  let text = exists(rel) ? read(rel) : '';
  if (text.includes(heading)) return;
  const eol = detectEol(text || '\n');
  const section = ['', heading, '', ...lines, ''].join(eol);
  text = stripExtraEofBlankLines(text) + section;
  write(rel, text);
}

function updateJson(rel, updater) {
  const text = read(rel);
  const data = JSON.parse(text);
  updater(data);
  write(rel, JSON.stringify(data, null, 2) + '\n');
}

function writeTimezoneContract() {
  const rel = 'src/lib/calendar-timezone-contract.ts';
  const content = `// @ts-nocheck
// ${STAGE}: centralny kontrakt czasu dla CloseFlow <-> Google Calendar.
// Cel: UI datetime-local Europe/Warsaw -> UTC w bazie -> Google dateTime + timeZone -> inbound bez przesunięcia.

export const CLOSEFLOW_DEFAULT_TIMEZONE = 'Europe/Warsaw';
export const STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH = 'CloseFlow local Warsaw time must roundtrip through Google Calendar without 1-2h shift and with reminders';

function pad2(value) {
  return String(value).padStart(2, '0');
}

function parseLocalDateTimeParts(value) {
  const raw = String(value || '').trim().replace(' ', 'T');
  const match = /^(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2})(?::(\\d{2}))?/.exec(raw);
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
  return /(?:Z|[+-]\\d{2}:?\\d{2})$/i.test(String(value || '').trim());
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
  if (/^\\d{4}-\\d{2}-\\d{2}$/.test(raw)) return localDateTimeInputToUtcIso(raw + 'T00:00', timeZone);
  if (!hasExplicitUtcOffset(raw) && /^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}(?::\\d{2}(?:\\.\\d{1,3})?)?$/.test(raw)) {
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
`;
  write(rel, content);
}

function patchEventCreateDialog() {
  const rel = 'src/components/EventCreateDialog.tsx';
  let text = read(rel);
  const eol = detectEol(text);
  text = ensureAfter(text,
    "} from '../lib/scheduling';",
    normalizeNewlines("\nimport {\n  localDateTimeInputToReminderUtcIso,\n} from '../lib/calendar-timezone-contract';", eol),
    'EventCreateDialog calendar-timezone import'
  );
  const replacement = normalizeNewlines(`function calculateReminderAt(startAt: string, reminderMode: string, reminderOffsetMinutes: number) {
  if (reminderMode === 'none') return undefined;
  return localDateTimeInputToReminderUtcIso(startAt, reminderOffsetMinutes) || undefined;
}

export default function EventCreateDialog`, eol);
  text = replaceRegex(text, /function calculateReminderAt\(startAt: string, reminderMode: string, reminderOffsetMinutes: number\) \{[\s\S]*?\n\}\n\nexport default function EventCreateDialog/, replacement, 'EventCreateDialog reminder timezone-safe calculateReminderAt');
  write(rel, text);
}

function patchTaskCreateDialog() {
  const rel = 'src/components/TaskCreateDialog.tsx';
  let text = read(rel);
  const eol = detectEol(text);
  text = ensureAfter(text,
    "import { toDateTimeLocalValue } from '../lib/scheduling';",
    normalizeNewlines("\nimport { localDateTimeInputToReminderUtcIso } from '../lib/calendar-timezone-contract';", eol),
    'TaskCreateDialog calendar-timezone import'
  );
  const replacement = normalizeNewlines(`function calculateReminderAt(dueAt: string, reminderMode: string, reminderOffsetMinutes: number) {
  if (reminderMode === 'none') return null;
  return localDateTimeInputToReminderUtcIso(dueAt, reminderOffsetMinutes);
}

export default function TaskCreateDialog`, eol);
  text = replaceRegex(text, /function calculateReminderAt\(dueAt: string, reminderMode: string, reminderOffsetMinutes: number\) \{[\s\S]*?\n\}\n\nexport default function TaskCreateDialog/, replacement, 'TaskCreateDialog reminder timezone-safe calculateReminderAt');
  write(rel, text);
}

function patchEventRoute() {
  const rel = 'src/server/event-route-stage124f.ts';
  let text = read(rel);
  const eol = detectEol(text);
  text = ensureAfter(text,
    "import { normalizeEventListContract } from '../lib/data-contract.js';",
    normalizeNewlines("\nimport { normalizeCloseFlowDateTimeToUtcIso } from '../lib/calendar-timezone-contract.js';", eol),
    'event route timezone import'
  );
  text = replaceRegex(text, /function asIsoDate\(value: unknown\) \{[\s\S]*?\n\}/, normalizeNewlines(`function asIsoDate(value: unknown) {
  return normalizeCloseFlowDateTimeToUtcIso(value);
}`, eol), 'event route asIsoDate');
  text = replaceOnce(text, "next_action_at: item.startAt ? new Date(String(item.startAt)).toISOString() : null,", "next_action_at: item.startAt ? normalizeCloseFlowDateTimeToUtcIso(item.startAt) : null,", 'event route lead next action timezone');
  text = replaceOnce(text, "const iso = body.startAt ? new Date(body.startAt).toISOString() : null;", "const iso = body.startAt ? normalizeCloseFlowDateTimeToUtcIso(body.startAt) : null;", 'event route patch startAt timezone');
  text = replaceOnce(text, "if (body.endAt !== undefined) payload.end_at = body.endAt ? new Date(body.endAt).toISOString() : null;", "if (body.endAt !== undefined) payload.end_at = body.endAt ? normalizeCloseFlowDateTimeToUtcIso(body.endAt) : null;", 'event route patch endAt timezone');
  text = replaceOnce(text, "const startAt = body.startAt ? new Date(body.startAt).toISOString() : nowIso;", "const startAt = body.startAt ? normalizeCloseFlowDateTimeToUtcIso(body.startAt) || nowIso : nowIso;", 'event route post startAt timezone');
  text = replaceOnce(text, "end_at: body.endAt ? new Date(body.endAt).toISOString() : null,", "end_at: body.endAt ? normalizeCloseFlowDateTimeToUtcIso(body.endAt) : null,", 'event route post endAt timezone');
  write(rel, text);
}

function patchTaskRoute() {
  const rel = 'src/server/task-route-stage124f.ts';
  let text = read(rel);
  const eol = detectEol(text);
  text = ensureAfter(text,
    "import { normalizeTaskListContract } from '../lib/data-contract.js';",
    normalizeNewlines("\nimport { normalizeCloseFlowDateTimeToUtcIso } from '../lib/calendar-timezone-contract.js';", eol),
    'task route timezone import'
  );
  text = replaceRegex(text, /function asIsoDate\(value: unknown\) \{[\s\S]*?\n\}/, normalizeNewlines(`function asIsoDate(value: unknown) {
  return normalizeCloseFlowDateTimeToUtcIso(value);
}`, eol), 'task route asIsoDate');
  text = replaceOnce(text, "next_action_at: item.scheduledAt ? new Date(String(item.scheduledAt)).toISOString() : null,", "next_action_at: item.scheduledAt ? normalizeCloseFlowDateTimeToUtcIso(item.scheduledAt) : null,", 'task route lead next action timezone');
  text = replaceOnce(text, "if (body.date !== undefined) payload.scheduled_at = body.date ? new Date(String(body.date) + 'T09:00:00').toISOString() : null;", "if (body.date !== undefined) payload.scheduled_at = body.date ? normalizeCloseFlowDateTimeToUtcIso(String(body.date) + 'T09:00') : null;", 'task route patch date timezone');
  text = replaceOnce(text, "if (body.scheduledAt !== undefined) payload.scheduled_at = body.scheduledAt ? new Date(body.scheduledAt).toISOString() : null;", "if (body.scheduledAt !== undefined) payload.scheduled_at = body.scheduledAt ? normalizeCloseFlowDateTimeToUtcIso(body.scheduledAt) : null;", 'task route patch scheduledAt timezone');
  const oldBlock = normalizeNewlines(`const scheduledAt = body.scheduledAt
      ? new Date(body.scheduledAt).toISOString()
      : body.date
        ? new Date(String(body.date) + 'T09:00:00').toISOString()
        : null;`, eol);
  const newBlock = normalizeNewlines(`const scheduledAt = body.scheduledAt
      ? normalizeCloseFlowDateTimeToUtcIso(body.scheduledAt)
      : body.date
        ? normalizeCloseFlowDateTimeToUtcIso(String(body.date) + 'T09:00')
        : null;`, eol);
  text = replaceOnce(text, oldBlock, newBlock, 'task route post scheduledAt timezone');
  write(rel, text);
}

function patchGoogleCalendarSync() {
  const rel = 'src/server/google-calendar-sync.ts';
  let text = read(rel);
  const eol = detectEol(text);
  text = ensureAfter(text,
    "import crypto from 'crypto';",
    normalizeNewlines("\nimport { CLOSEFLOW_DEFAULT_TIMEZONE, utcIsoToGoogleDateTimeInDefaultZone } from '../lib/calendar-timezone-contract.js';", eol),
    'google calendar sync timezone import'
  );
  const oldBlock = normalizeNewlines(`function buildGoogleTimeFields(event: CloseFlowCalendarEvent) {
  if (event.googleAllDay) {
    const startDate = normalizeGoogleDateOnly(event.googleStartDate || event.startAt);
    const endDate = normalizeGoogleDateOnly(event.googleEndDate || event.endAt) || (startDate ? addOneGoogleDateOnly(startDate) : '');
    if (startDate && endDate) {
      return { start: { date: startDate }, end: { date: endDate } };
    }
  }
  const start = new Date(event.startAt);
  const end = event.endAt ? new Date(event.endAt) : new Date(start.getTime() + 60 * 60 * 1000);
  return { start: { dateTime: start.toISOString() }, end: { dateTime: end.toISOString() } };
}`, eol);
  const replacement = normalizeNewlines(`function addMinutesToUtcIso(value: string, minutes: number) {
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return null;
  return new Date(parsed.getTime() + minutes * 60000).toISOString();
}

function buildGoogleTimeFields(event: CloseFlowCalendarEvent) {
  // ${STAGE}: timed Google events receive wall-clock dateTime plus timeZone instead of bare toISOString().
  if (event.googleAllDay) {
    const startDate = normalizeGoogleDateOnly(event.googleStartDate || event.startAt);
    const endDate = normalizeGoogleDateOnly(event.googleEndDate || event.endAt) || (startDate ? addOneGoogleDateOnly(startDate) : '');
    if (startDate && endDate) {
      return { start: { date: startDate }, end: { date: endDate } };
    }
  }
  const startIso = event.startAt || new Date().toISOString();
  const endIso = event.endAt || addMinutesToUtcIso(startIso, 60) || new Date(new Date(startIso).getTime() + 60 * 60 * 1000).toISOString();
  const start = utcIsoToGoogleDateTimeInDefaultZone(startIso, CLOSEFLOW_DEFAULT_TIMEZONE);
  const end = utcIsoToGoogleDateTimeInDefaultZone(endIso, CLOSEFLOW_DEFAULT_TIMEZONE);
  if (!start || !end) {
    const fallbackStart = new Date(startIso);
    const fallbackEnd = new Date(endIso);
    return { start: { dateTime: fallbackStart.toISOString(), timeZone: CLOSEFLOW_DEFAULT_TIMEZONE }, end: { dateTime: fallbackEnd.toISOString(), timeZone: CLOSEFLOW_DEFAULT_TIMEZONE } };
  }
  return { start, end };
}`, eol);
  text = replaceOnce(text, oldBlock, replacement, 'google calendar sync buildGoogleTimeFields timezone');
  write(rel, text);
}

function patchGoogleCalendarInbound() {
  const rel = 'src/server/google-calendar-inbound.ts';
  let text = read(rel);
  const eol = detectEol(text);
  text = ensureAfter(text,
    "import crypto from 'crypto';",
    normalizeNewlines("\nimport { googleDateTimeToUtcIso } from '../lib/calendar-timezone-contract.js';", eol),
    'google calendar inbound timezone import'
  );
  const oldBlock = normalizeNewlines(`function googleEventStart(event: GoogleEvent) {
  // GOOGLE_CALENDAR_STAGE11C_ALL_DAY_INBOUND_START
  if (googleEventIsAllDay(event)) {
    const dateOnly = googleEventStartDate(event);
    return dateOnly ? dateOnly + 'T00:00:00.000Z' : null;
  }
  const value = event?.start?.dateTime || '';
  return toIso(value);
}
function googleEventEnd(event: GoogleEvent, startAt: string | null) {
  // GOOGLE_CALENDAR_STAGE11C_ALL_DAY_INBOUND_END
  if (googleEventIsAllDay(event)) {
    const dateOnly = googleEventEndDate(event);
    return dateOnly ? dateOnly + 'T00:00:00.000Z' : startAt;
  }
  const value = event?.end?.dateTime || '';
  const parsed = toIso(value);
  if (parsed) return parsed;
  if (!startAt) return null;
  return new Date(new Date(startAt).getTime() + 60 * 60_000).toISOString();
}`, eol);
  const startReplacement = normalizeNewlines(`function googleEventStart(event: GoogleEvent) {
  // GOOGLE_CALENDAR_STAGE11C_ALL_DAY_INBOUND_START
  // ${STAGE}: inbound timed events preserve Google wall-clock time and timeZone.
  if (googleEventIsAllDay(event)) {
    const dateOnly = googleEventStartDate(event);
    return dateOnly ? dateOnly + 'T00:00:00.000Z' : null;
  }
  return googleDateTimeToUtcIso({ dateTime: event?.start?.dateTime || '', timeZone: event?.start?.timeZone || '' });
}
function googleEventEnd(event: GoogleEvent, startAt: string | null) {
  // GOOGLE_CALENDAR_STAGE11C_ALL_DAY_INBOUND_END
  if (googleEventIsAllDay(event)) {
    const dateOnly = googleEventEndDate(event);
    return dateOnly ? dateOnly + 'T00:00:00.000Z' : startAt;
  }
  const parsed = googleDateTimeToUtcIso({ dateTime: event?.end?.dateTime || '', timeZone: event?.end?.timeZone || event?.start?.timeZone || '' });
  if (parsed) return parsed;
  if (!startAt) return null;
  return new Date(new Date(startAt).getTime() + 60 * 60_000).toISOString();
}`, eol);
  text = replaceOnce(text, oldBlock, startReplacement, 'google calendar inbound start/end timezone');
  write(rel, text);
}

function updatePackageJson() {
  updateJson('package.json', (pkg) => {
    pkg.scripts = pkg.scripts || {};
    pkg.scripts['check:stage226r11-gcal-timezone-reminder-truth'] = 'node scripts/check-stage226r11-gcal-timezone-reminder-truth.cjs';
    pkg.scripts['test:stage226r11-gcal-timezone-reminder-truth'] = 'node --test tests/stage226r11-gcal-timezone-reminder-truth.test.cjs';
    const guard = 'node scripts/check-stage226r11-gcal-timezone-reminder-truth.cjs';
    if (typeof pkg.scripts.prebuild === 'string' && !pkg.scripts.prebuild.includes(guard)) {
      pkg.scripts.prebuild = pkg.scripts.prebuild.trim() + ' && ' + guard;
    }
  });
}

function updateProjectMemory() {
  const now = '2026-06-06 14:58 Europe/Warsaw';
  appendSection('_project/04_DECISIONS.md', '## STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH — decyzja czasu Google Calendar', [
    `- data i godzina: ${now}`,
    '- decyzja: CloseFlow zapisuje czas z inputów \`datetime-local\` jako intencję użytkownika w Europe/Warsaw, a do Google Calendar wysyła timed events jako \`dateTime\` + \`timeZone\`, nie jako gołe `toISOString()` bez strefy.',
    '- decyzja: brak przesunięcia 1-2h jest ważniejszy niż Stage227, bo lejek i najbliższe akcje opierają się na prawdziwych godzinach.',
    '- decyzja: przypomnienie Google musi wynikać z \`reminderAt\`/offsetu i trafiać do \`reminders.overrides\` albo do zapisanego exact Google reminders, nie ginąć po syncu.',
  ]);
  appendSection('_project/06_GUARDS_AND_TESTS.md', '## STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH — guardy i testy', [
    `- data i godzina: ${now}`,
    '- guard: \`npm run check:stage226r11-gcal-timezone-reminder-truth\`.',
    '- test: \`npm run test:stage226r11-gcal-timezone-reminder-truth\`.',
    '- regresje: R10D2, R10C2, R10B, R10, build, verify:closeflow:quiet, git diff --check.',
  ]);
  appendSection('_project/07_NEXT_STEPS.md', '## STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH — next step', [
    `- data i godzina: ${now}`,
    '- po PASS: ręczny smoke produkcyjny CloseFlow -> Google Calendar -> inbound sync.',
    '- dopiero po potwierdzeniu timezone/reminders wrócić do Stage227 — Sales Funnel Movement View.',
  ]);
  appendSection('_project/08_CHANGELOG_AI.md', '## STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH — changelog', [
    `- data i godzina: ${now}`,
    '- dodano centralny kontrakt \`src/lib/calendar-timezone-contract.ts\`.',
    '- poprawiono UI reminder calculation w EventCreateDialog i TaskCreateDialog.',
    '- poprawiono event/task server routes, Google outbound i inbound na kontrakt Europe/Warsaw.',
    '- dodano guard/test R11 i aktualizacje project memory/Obsidian update.',
  ]);
  appendSection('_project/12_IMPLEMENTATION_LEDGER.md', '## STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH — ledger', [
    `- data i godzina: ${now}`,
    '- status: przygotowano paczkę ZIP local-only.',
    '- repo: dkknapikdamian-collab/leadflowv1; branch: dev-rollout-freeze; local path: C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow.',
    '- zakres: timezone/reminders only; bez Stage227, finansów, RLS i schema.',
  ]);
  appendSection('_project/13_TEST_HISTORY.md', '## STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH — test history', [
    `- data i godzina: ${now}`,
    '- zaplanowane: check/test R11, regresje R10D2/R10C2/R10B/R10, build, verify:closeflow:quiet, git diff --check.',
    '- manual smoke: event 12:00 Europe/Warsaw ma być 12:00 w Google; przypomnienie 30 min przed ma być widoczne; inbound nie przesuwa godziny.',
  ]);
}

function writeReportFiles() {
  const report = `# STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH — report

- data i godzina: 2026-06-06 14:58 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze

## Teza

Problem z Google Calendar nie powinien być rozwiązywany dopiero w Stage227. Najbliższe akcje, lejek i owner-control wymagają prawdziwych godzin oraz przypomnień.

## Zmiana

- dodano centralny kontrakt czasu Europe/Warsaw;
- UI przelicza reminderAt z lokalnego inputu bez zależności od timezone środowiska;
- event/task routes zapisują datetime-local jako intencję Europe/Warsaw do UTC;
- Google outbound wysyła timed event jako dateTime + timeZone Europe/Warsaw;
- Google inbound odczytuje dateTime + timeZone bez przesunięcia;
- guard i test blokują powrót gołego start.toISOString() w Google body.

## Audyt ryzyk

- Historyczne rekordy zapisane przed R11 mogą mieć już przesuniętą godzinę. Ten etap naprawia nowe/aktualizowane wpisy, nie migruje starych danych.
- Fail w Google reminders może wynikać z ustawień konta Google albo typu przypomnienia email/popup. Etap wymusza poprawny payload aplikacji, ale manual smoke dalej jest konieczny.
- Nie dodano migracji SQL. Jeśli brakuje kolumn Google reminder fields w Supabase, backend fallback usuwa brakujące kolumny, ale pełna trwałość exact reminders może wymagać osobnego SQL.
`;
  write('_project/reports/STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH_REPORT.md', report);
  const run = `# STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH — run

- data i godzina: 2026-06-06 14:58 Europe/Warsaw
- status: przygotowane do lokalnego APPLY
- wymagane testy: R11 check/test, R10D2/R10C2/R10B/R10, build, verify:closeflow:quiet, git diff --check
- commit/push: tylko po PASS i akceptacji Damiana
`;
  write('_project/runs/STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH_RUN.md', run);
  const obs = `# STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH — aktualizacja Obsidiana

- data i godzina: 2026-06-06 14:58 Europe/Warsaw
- nazwa / alias wejściowy: Stage226R11 — Google Calendar Timezone + Reminder Truth Audit/Fix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: CloseFlow_Lead_App / DO_POTWIERDZENIA
- idea_id: nie dotyczy
- report_id: STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH_REPORT
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- mapa główna / pulpit: 01_PULPIT - CloseFlow Lead App.md / DO_POTWIERDZENIA
- mapa zależności: 06_MAPA_ZALEZNOSCI - CloseFlow Lead App.md / DO_POTWIERDZENIA
- ściąga plików: 07_SCIAGA_PLIKOW - CloseFlow Lead App.md / DO_POTWIERDZENIA
- typ wpisu: bugfix/audyt czasu i przypomnień Google Calendar przed Stage227
- docelowa ścieżka: 04_KIERUNEK_DO_WDROZENIA; 09_TESTY_DO_WYKONANIA_I_WYNIKI; 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY
- status zapisu: przygotowano w repo _project/obsidian_updates; APPLY spróbuje dopisać do vaulta, jeśli ścieżki istnieją lokalnie
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow

## Wpis do kierunku

Po R10D2 ręczny smoke konfliktów/duplikatów jest OK. Następny etap to R11: Google Calendar timezone + reminders. Stage227 ma czekać do potwierdzenia, że najbliższe akcje nie kłamią godzinami ani brakiem powiadomień.

## Testy ręczne

1. Dodaj wydarzenie w CloseFlow na 12:00 Europe/Warsaw z przypomnieniem 30 min wcześniej.
2. Sprawdź Network /api/events: startAt/scheduledAt/endAt/reminderAt.
3. Uruchom outbound sync.
4. Google Calendar ma pokazać 12:00 i przypomnienie 30 min przed.
5. Zmień w Google na 13:30 i uruchom inbound.
6. CloseFlow ma pokazać 13:30 bez przesunięcia.
7. Powtórz dla zadania.
8. Powtórz dla daty zimowej i letniej.

## Audyt ryzyk

- Stare rekordy mogły być już zapisane z przesunięciem — nie migrować ich automatycznie bez osobnego etapu.
- Przypomnienia Google mogą zależeć od ustawień konta i kalendarza, ale payload aplikacji ma zawierać poprawne reminders.
- Bez ręcznego smoke Google nie zamykać R11.
`;
  write('_project/obsidian_updates/STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH_OBSIDIAN_UPDATE.md', obs);
}

function main() {
  const backupDir = path.join(repo, '_LOCAL_CHECKS', STAGE, 'backup_' + new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15));
  const touched = [
    'src/lib/calendar-timezone-contract.ts',
    'src/components/EventCreateDialog.tsx',
    'src/components/TaskCreateDialog.tsx',
    'src/server/event-route-stage124f.ts',
    'src/server/task-route-stage124f.ts',
    'src/server/google-calendar-sync.ts',
    'src/server/google-calendar-inbound.ts',
    'package.json',
    '_project/04_DECISIONS.md',
    '_project/06_GUARDS_AND_TESTS.md',
    '_project/07_NEXT_STEPS.md',
    '_project/08_CHANGELOG_AI.md',
    '_project/12_IMPLEMENTATION_LEDGER.md',
    '_project/13_TEST_HISTORY.md',
  ];
  for (const rel of touched) backup(rel, backupDir);

  writeTimezoneContract();
  patchEventCreateDialog();
  patchTaskCreateDialog();
  patchEventRoute();
  patchTaskRoute();
  patchGoogleCalendarSync();
  patchGoogleCalendarInbound();
  updatePackageJson();
  updateProjectMemory();
  writeReportFiles();

  console.log(JSON.stringify({ ok: true, stage: STAGE, changed: touched }, null, 2));
}

main();
