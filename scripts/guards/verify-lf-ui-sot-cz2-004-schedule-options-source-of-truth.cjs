const fs = require('node:fs');
const path = require('node:path');
const childProcess = require('node:child_process');

const ROOT = process.cwd();
const rel = (file) => path.join(ROOT, file);
const exists = (file) => fs.existsSync(rel(file));
const read = (file) => fs.readFileSync(rel(file), 'utf8');
const errors = [];
const warnings = [];
function fail(message) { errors.push(message); }
function warn(message) { warnings.push(message); }
function requireFile(file) { if (!exists(file)) fail('missing file: ' + file); }
function requireText(file, text, label = text) { if (!read(file).includes(text)) fail(file + ' missing ' + label); }
function requireIdentifier(file, identifier) {
  const regex = new RegExp('(^|[^A-Za-z0-9_])' + identifier + '([^A-Za-z0-9_]|$)');
  if (!regex.test(read(file))) fail(file + ' missing identifier ' + identifier);
}
function forbid(file, pattern, label) { if (exists(file) && pattern.test(read(file))) fail(file + ' still has forbidden ' + label); }
function forbidText(file, text, label = text) { if (exists(file) && read(file).includes(text)) fail(file + ' still has forbidden ' + label); }
function forbidMojibake(file) {
  if (!exists(file)) return;
  for (const marker of ['Ä', 'Ă', 'Ĺ', 'â€', '�']) {
    if (read(file).includes(marker)) fail(file + ' contains mojibake marker: ' + marker);
  }
}

const stage = 'LF-UI-SOT-CZ2-004';
const canonical = 'src/lib/source-of-truth/schedule-options.ts';
const options = 'src/lib/options.ts';
const calendarStatus = 'src/lib/config/calendar-status.ts';
const calendarPage = 'src/pages/Calendar.tsx';
const tasksStable = 'src/pages/TasksStable.tsx';
const app = 'src/App.tsx';
const routes = 'src/lib/routes.ts';

[canonical, options, calendarStatus, 'package.json'].forEach(requireFile);

if (exists(canonical)) {
  [
    'TASK_TYPE_OPTIONS',
    'EVENT_TYPE_OPTIONS',
    'PRIORITY_OPTIONS',
    'RECURRENCE_OPTIONS',
    'REMINDER_MODE_OPTIONS',
    'REMINDER_OFFSET_OPTIONS',
    'GOOGLE_CALENDAR_REMINDER_METHOD_OPTIONS',
    'TASK_STATUS_META_BY_VALUE',
    'EVENT_STATUS_META_BY_VALUE',
    'CLOSED_WORK_ITEM_STATUSES',
    'TaskTypeValue',
    'EventTypeValue',
    'PriorityValue',
    'RecurrenceValue',
    'ReminderModeValue',
    'ReminderOffsetValue',
    'GoogleCalendarReminderMethodValue',
    'TaskStatusMeta',
    'EventStatusMeta',
    'getTaskTypeMeta',
    'getEventTypeMeta',
    'getPriorityMeta',
    'getRecurrenceMeta',
    'getReminderModeMeta',
    'getReminderOffsetMeta',
    'getGoogleCalendarReminderMethodMeta',
    'getTaskStatusLabel',
    'getCalendarEventStatusLabel',
    'isDoneStatus',
    'getScheduleEntryIcon',
  ].forEach((identifier) => requireIdentifier(canonical, identifier));
  requireText(canonical, 'normalizeTaskStatus', 'normalizeTaskStatus');
  requireText(canonical, 'normalizeEventStatus', 'normalizeEventStatus');
}

if (exists(options)) {
  requireText(options, "from './source-of-truth/schedule-options'", 'schedule SOT re-export');
  requireText(options, 'TASK_TYPE_OPTIONS as TASK_TYPES', 'TASK_TYPES compatibility re-export');
  requireText(options, 'EVENT_TYPE_OPTIONS as EVENT_TYPES', 'EVENT_TYPES compatibility re-export');
  forbid(options, /(?:export\s+)?const\s+TASK_TYPES\s*=/, 'local TASK_TYPES');
  forbid(options, /(?:export\s+)?const\s+EVENT_TYPES\s*=/, 'local EVENT_TYPES');
  forbid(options, /(?:export\s+)?const\s+PRIORITY_OPTIONS\s*=/, 'local PRIORITY_OPTIONS');
  forbid(options, /(?:export\s+)?const\s+RECURRENCE_OPTIONS\s*=/, 'local RECURRENCE_OPTIONS');
  forbid(options, /(?:export\s+)?const\s+REMINDER_MODE_OPTIONS\s*=/, 'local REMINDER_MODE_OPTIONS');
  forbid(options, /(?:export\s+)?const\s+REMINDER_OFFSET_OPTIONS\s*=/, 'local REMINDER_OFFSET_OPTIONS');
  forbid(options, /(?:export\s+)?const\s+GOOGLE_CALENDAR_REMINDER_METHOD_OPTIONS\s*=/, 'local GOOGLE_CALENDAR_REMINDER_METHOD_OPTIONS');
}

if (exists(calendarStatus)) {
  requireText(calendarStatus, "from '../source-of-truth/schedule-options'", 'schedule SOT status re-export');
  forbid(calendarStatus, /CLOSED_WORK_ITEM_STATUSES\s*=\s*\[/, 'local CLOSED_WORK_ITEM_STATUSES');
  forbid(calendarStatus, /TASK_STATUS_LABELS\s*[:=]/, 'local TASK_STATUS_LABELS');
  forbid(calendarStatus, /CALENDAR_EVENT_STATUS_LABELS\s*[:=]/, 'local CALENDAR_EVENT_STATUS_LABELS');
}

for (const file of [calendarPage, tasksStable]) {
  if (!exists(file)) continue;
  forbid(file, /(?:export\s+)?const\s+TASK_TYPES\s*=/, 'local TASK_TYPES');
  forbid(file, /(?:export\s+)?const\s+EVENT_TYPES\s*=/, 'local EVENT_TYPES');
  forbid(file, /(?:export\s+)?const\s+TASK_TYPE_OPTIONS\s*=\s*\[/, 'local TASK_TYPE_OPTIONS');
  forbid(file, /(?:export\s+)?const\s+EVENT_TYPE_OPTIONS\s*=\s*\[/, 'local EVENT_TYPE_OPTIONS');
  forbid(file, /(?:export\s+)?const\s+PRIORITY_OPTIONS\s*=/, 'local PRIORITY_OPTIONS');
  forbid(file, /(?:export\s+)?const\s+RECURRENCE_OPTIONS\s*=/, 'local RECURRENCE_OPTIONS');
  forbid(file, /(?:export\s+)?const\s+REMINDER_MODE_OPTIONS\s*=/, 'local REMINDER_MODE_OPTIONS');
}

if (exists(tasksStable)) {
  const source = read(tasksStable);
  const legacyHelpers = ['isTaskDone', 'isTaskToday', 'isTaskOverdue', 'buildTaskGroups', 'getStatusBadge', 'getTaskStatusTone']
    .filter((name) => new RegExp('function\\s+' + name + '\\s*\\(|const\\s+' + name + '\\s*=').test(source));
  if (legacyHelpers.length > 0) warn('TasksStable local grouping helpers remain as LEGACY_DEBT: ' + legacyHelpers.join(', '));
}

for (const file of [canonical, options, calendarStatus, calendarPage, tasksStable]) forbidMojibake(file);
for (const file of [canonical, options, calendarStatus, calendarPage, tasksStable]) {
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
  ]) forbidText(file, token, 'bad schedule token ' + token);
}

if (exists('package.json')) {
  requireText(
    'package.json',
    '"verify:lf-ui-sot-cz2-004-schedule-options-source-of-truth": "node scripts/guards/verify-lf-ui-sot-cz2-004-schedule-options-source-of-truth.cjs"',
    'package script verify:lf-ui-sot-cz2-004-schedule-options-source-of-truth',
  );
}

const obsidianRoot = process.env.OBSIDIAN_VAULT;
if (obsidianRoot && fs.existsSync(obsidianRoot)) {
  const report = path.join(obsidianRoot, '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-UI-SOT-CZ2-004_SCHEDULE_OPTIONS_SOURCE_OF_TRUTH.md');
  const router = path.join(obsidianRoot, '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY - CloseFlow Lead App.md');
  if (!fs.existsSync(report)) fail('missing Obsidian report for CZ2-004');
  if (!fs.existsSync(router)) fail('missing Obsidian router for CZ2-004');
} else {
  warn('OBSIDIAN_VAULT not set; skipped external report/router check');
}

const changed = childProcess.execSync('git diff --name-only', { cwd: ROOT, encoding: 'utf8' })
  .split(/\r?\n/).filter(Boolean);
for (const file of changed) {
  if (/\.css$/i.test(file)) fail('CSS touched: ' + file);
  if (/^(supabase|migrations|sql)\//i.test(file) || /\.sql$/i.test(file)) fail('SQL/migration touched: ' + file);
}
if (changed.includes(app)) fail('src/App.tsx touched');
if (changed.includes(routes)) fail('src/lib/routes.ts touched');

const result = { ok: errors.length === 0, stage, canonical, compatibilityWrappers: [options, calendarStatus], pagesChecked: [calendarPage, tasksStable], changedFiles: changed, warnings, errors };
console.log(JSON.stringify(result, null, 2));
if (errors.length > 0) process.exit(1);
