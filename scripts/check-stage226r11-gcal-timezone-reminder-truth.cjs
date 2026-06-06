const fs = require('fs');

const STAGE = 'STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH';
function read(path) { return fs.readFileSync(path, 'utf8'); }
function fail(message) { throw new Error(`${STAGE}_GUARD_FAIL: ${message}`); }
function requireFile(path) { if (!fs.existsSync(path)) fail(`missing file ${path}`); return read(path); }
function requireText(text, needle, label) { if (!text.includes(needle)) fail(`${label} missing: ${needle}`); }
function forbidText(text, needle, label) { if (text.includes(needle)) fail(`${label} forbidden token present: ${needle}`); }

const contract = requireFile('src/lib/calendar-timezone-contract.ts');
requireText(contract, "CLOSEFLOW_DEFAULT_TIMEZONE = 'Europe/Warsaw'", 'contract default timezone');
requireText(contract, 'localDateTimeInputToUtcIso', 'contract local to utc');
requireText(contract, 'utcIsoToGoogleDateTimeInDefaultZone', 'contract utc to Google timezone');
requireText(contract, 'googleDateTimeToUtcIso', 'contract Google inbound timezone');
requireText(contract, 'localDateTimeInputToReminderUtcIso', 'contract reminder utc');
requireText(contract, 'Intl.DateTimeFormat', 'contract timezone engine');

const eventDialog = requireFile('src/components/EventCreateDialog.tsx');
requireText(eventDialog, 'localDateTimeInputToReminderUtcIso', 'event dialog reminder helper');
forbidText(eventDialog, 'new Date(startAt).getTime()', 'event dialog old local Date reminder parsing');
forbidText(eventDialog, 'new Date(startTime - Number(reminderOffsetMinutes', 'event dialog old reminder iso');

const taskDialog = requireFile('src/components/TaskCreateDialog.tsx');
requireText(taskDialog, 'localDateTimeInputToReminderUtcIso', 'task dialog reminder helper');
forbidText(taskDialog, 'new Date(dueAt).getTime()', 'task dialog old local Date reminder parsing');
forbidText(taskDialog, 'new Date(dueTime - Number(reminderOffsetMinutes', 'task dialog old reminder iso');

const eventRoute = requireFile('src/server/event-route-stage124f.ts');
requireText(eventRoute, 'normalizeCloseFlowDateTimeToUtcIso', 'event route timezone helper');
forbidText(eventRoute, 'new Date(body.startAt).toISOString()', 'event route direct startAt Date parse');
forbidText(eventRoute, 'new Date(body.endAt).toISOString()', 'event route direct endAt Date parse');
forbidText(eventRoute, 'new Date(String(item.startAt)).toISOString()', 'event route direct lead next action Date parse');

const taskRoute = requireFile('src/server/task-route-stage124f.ts');
requireText(taskRoute, 'normalizeCloseFlowDateTimeToUtcIso', 'task route timezone helper');
forbidText(taskRoute, 'new Date(body.scheduledAt).toISOString()', 'task route direct scheduledAt Date parse');
forbidText(taskRoute, "new Date(String(body.date) + 'T09:00:00').toISOString()", 'task route direct date 09 parse');
forbidText(taskRoute, 'new Date(String(item.scheduledAt)).toISOString()', 'task route direct lead next action Date parse');

const gSync = requireFile('src/server/google-calendar-sync.ts');
requireText(gSync, 'utcIsoToGoogleDateTimeInDefaultZone', 'google outbound timezone helper');
requireText(gSync, 'timeZone: CLOSEFLOW_DEFAULT_TIMEZONE', 'google outbound timeZone');
requireText(gSync, 'reminders: buildReminderOverrides(event)', 'google outbound reminders');
forbidText(gSync, 'return { start: { dateTime: start.toISOString() }, end: { dateTime: end.toISOString() } };', 'google outbound bare toISOString body');

const gInbound = requireFile('src/server/google-calendar-inbound.ts');
requireText(gInbound, 'googleDateTimeToUtcIso', 'google inbound timezone helper');
forbidText(gInbound, 'return toIso(value);', 'google inbound old toIso start parse');

const pkg = JSON.parse(requireFile('package.json'));
if (!pkg.scripts?.['check:stage226r11-gcal-timezone-reminder-truth']) fail('missing package check script');
if (!pkg.scripts?.['test:stage226r11-gcal-timezone-reminder-truth']) fail('missing package test script');
if (!String(pkg.scripts?.prebuild || '').includes('check-stage226r11-gcal-timezone-reminder-truth.cjs')) fail('prebuild missing R11 guard');

console.log(JSON.stringify({ ok: true, stage: STAGE, guard: 'check:stage226r11-gcal-timezone-reminder-truth' }, null, 2));
