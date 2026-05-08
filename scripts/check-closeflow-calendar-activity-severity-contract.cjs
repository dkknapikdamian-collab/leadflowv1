const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
const fail = (message) => {
  console.error('CLOSEFLOW_CALENDAR_ACTIVITY_SEVERITY_CONTRACT_STAGE12_FAIL: ' + message);
  process.exit(1);
};

const requiredFiles = [
  'src/pages/Calendar.tsx',
  'src/pages/Activity.tsx',
  'src/styles/closeflow-alert-severity.css',
  'src/styles/closeflow-list-row-tokens.css',
  'docs/ui/CLOSEFLOW_CALENDAR_ACTIVITY_SEVERITY_STAGE12_2026-05-08.md',
  'scripts/check-closeflow-calendar-activity-severity-contract.cjs',
];

for (const file of requiredFiles) {
  if (!exists(file)) fail('missing required file: ' + file);
}

function assertCleanText(rel) {
  const text = read(rel);
  if (text.charCodeAt(0) === 0xfeff) fail(rel + ' contains BOM');
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text)) fail(rel + ' contains forbidden control characters');
  for (const char of text) {
    const code = char.charCodeAt(0);
    if ([0xfffd, 0x00c2, 0x00c3].includes(code)) {
      fail(rel + ' contains suspicious mojibake/control code: U+' + code.toString(16).toUpperCase());
    }
  }
}

for (const file of requiredFiles) assertCleanText(file);

const calendar = read('src/pages/Calendar.tsx');
for (const token of [
  'function getCalendarEntrySeverity(entry: ScheduleEntry)',
  'function getCalendarEntryStatusTone(entry: ScheduleEntry)',
  'cf-severity-pill',
  'data-cf-severity={getCalendarEntrySeverity(entry)}',
  'cf-status-pill',
  'data-cf-status-tone={getCalendarEntryStatusTone(entry)}',
]) {
  if (!calendar.includes(token)) fail('Calendar missing Stage12 contract token: ' + token);
}

const calendarStatusIndex = calendar.indexOf('{getCalendarEntryStatusLabel(entry)}');
if (calendarStatusIndex < 0) fail('Calendar status label render not found');
const calendarStatusSlice = calendar.slice(Math.max(0, calendarStatusIndex - 700), calendarStatusIndex + 900);
if (/border-(rose|red|amber)-|bg-(rose|red|amber)-|text-(rose|red|amber)-/.test(calendarStatusSlice)) {
  fail('Calendar status render still contains local red/rose/amber classes');
}
if (!calendarStatusSlice.includes('cf-severity-pill') || !calendarStatusSlice.includes('cf-status-pill')) {
  fail('Calendar status render does not use both severity and status contracts');
}

const activity = read('src/pages/Activity.tsx');
for (const token of [
  'function getActivitySeverity(activity: any)',
  'cf-severity-dot',
  'cf-severity-pill',
  'data-cf-severity={getActivitySeverity(activity)}',
  'Wymaga uwagi',
]) {
  if (!activity.includes(token)) fail('Activity missing Stage12 contract token: ' + token);
}

const attentionIndex = activity.indexOf('Wymaga uwagi');
if (attentionIndex < 0) fail('Activity attention label not found');
const attentionSlice = activity.slice(Math.max(0, attentionIndex - 700), attentionIndex + 700);
if (/activity-attention-pill|border-(rose|red|amber)-|bg-(rose|red|amber)-|text-(rose|red|amber)-/.test(attentionSlice)) {
  fail('Activity attention render still contains local alert classes');
}
if (!attentionSlice.includes('cf-severity-pill') || !attentionSlice.includes('getActivitySeverity(activity)')) {
  fail('Activity attention render does not use severity contract');
}

const forbiddenLocalNames = [
  'calendar-severity-fix',
  'activity-alert-v2',
  'status-repair',
  'calendar-alert-repair',
  'activity-severity-fix',
];

for (const [rel, text] of [
  ['src/pages/Calendar.tsx', calendar],
  ['src/pages/Activity.tsx', activity],
]) {
  for (const token of forbiddenLocalNames) {
    if (text.includes(token)) fail(rel + ' contains forbidden local fix/v2/repair class name: ' + token);
  }
}

const notifications = exists('src/pages/NotificationsCenter.tsx') ? read('src/pages/NotificationsCenter.tsx') : '';
for (const token of ['notificationRowSeverity', 'cf-severity-dot', 'cf-severity-pill']) {
  if (!notifications.includes(token)) fail('previous Stage11 NotificationsCenter contract weakened: ' + token);
}

const todayStableCheck = exists('scripts/check-closeflow-today-stable-severity-contract.cjs')
  ? read('scripts/check-closeflow-today-stable-severity-contract.cjs')
  : '';
if (!todayStableCheck.includes('CLOSEFLOW_TODAY_STABLE_SEVERITY')) {
  fail('TodayStable severity contract check is missing or weakened');
}

const alertCss = read('src/styles/closeflow-alert-severity.css');
for (const token of ['.cf-alert', '.cf-severity-panel', '.cf-severity-pill', '.cf-severity-dot']) {
  if (!alertCss.includes(token)) fail('alert severity contract missing token: ' + token);
}

const listTokens = read('src/styles/closeflow-list-row-tokens.css');
for (const token of ['.cf-status-pill', '.cf-progress-pill', 'data-cf-status-tone']) {
  if (!listTokens.includes(token)) fail('status/progress contract missing token: ' + token);
}

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['check:closeflow-calendar-activity-severity-contract'] !== 'node scripts/check-closeflow-calendar-activity-severity-contract.cjs') {
  fail('package.json missing check:closeflow-calendar-activity-severity-contract');
}

console.log('CLOSEFLOW_CALENDAR_ACTIVITY_SEVERITY_CONTRACT_STAGE12_OK: calendarClassified=2 activityClassified=4 severity=3 statusProgress=1 exceptions=3');
