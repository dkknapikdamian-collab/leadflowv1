const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
const fail = (message) => {
  console.error('CLOSEFLOW_LEADS_TASKS_STATUS_CONTRACT_STAGE13_FAIL: ' + message);
  process.exit(1);
};

const requiredFiles = [
  'src/pages/Leads.tsx',
  'src/pages/TasksStable.tsx',
  'src/styles/closeflow-list-row-tokens.css',
  'docs/ui/CLOSEFLOW_LEADS_TASKS_STATUS_STAGE13_2026-05-08.md',
  'scripts/check-closeflow-leads-tasks-status-contract.cjs',
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

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['check:closeflow-leads-tasks-status-contract'] !== 'node scripts/check-closeflow-leads-tasks-status-contract.cjs') {
  fail('package.json missing check:closeflow-leads-tasks-status-contract');
}

const leads = read('src/pages/Leads.tsx');
if (!leads.includes('STATUS_OPTIONS')) fail('Leads missing STATUS_OPTIONS');
if (!leads.includes('function getLeadStatusTone(')) fail('Leads missing getLeadStatusTone helper');
if (!leads.includes('function getLeadStatusLabel(')) fail('Leads missing getLeadStatusLabel helper');
if (/color:\s*['\"][^'\"]*(rose|red|amber|orange|pink)-/i.test(leads)) {
  fail('Leads STATUS_OPTIONS still contains local warm status classes');
}
if (!/STATUS_OPTIONS[\s\S]*tone:\s*['\"]amber['\"][\s\S]*SOURCE_OPTIONS/.test(leads)) {
  fail('Leads status metadata does not expose status tones before source options');
}
if (/label=\"Zagro\u017Cone\"[\s\S]{0,900}(text-(rose|red|amber)-|bg-(rose|red|amber)-)/.test(leads)) {
  fail('Leads risk metric still contains local warm metric classes');
}
if (leads.includes('label="Zagro\u017Cone"') && !/label=\"Zagro\u017Cone\"[\s\S]{0,900}tone=\"risk\"/.test(leads)) {
  fail('Leads risk metric does not use StatShortcutCard risk tone');
}
if (/(leads-status-fix|tasks-progress-v2|status-local-patch|status-temp-class)/i.test(leads)) {
  fail('Leads contains forbidden temporary class naming');
}

const tasks = read('src/pages/TasksStable.tsx');
if (!tasks.includes('function getTaskStatusTone(task: any)')) fail('TasksStable missing getTaskStatusTone helper');
if (!tasks.includes('cf-status-pill')) fail('TasksStable missing cf-status-pill status render');
if (!tasks.includes('data-cf-status-tone={getTaskStatusTone(task)}')) fail('TasksStable missing data-cf-status-tone status render');
if (/getBadgeClass\(task\)/.test(tasks)) fail('TasksStable status render still calls getBadgeClass(task)');
if (/getStatusBadge\(task\)[\s\S]{0,160}(bg-(rose|red|amber)-|text-(rose|red|amber)-|border-(rose|red|amber)-)/.test(tasks)) {
  fail('TasksStable status badge render still contains local warm classes');
}
if (/(leads-status-fix|tasks-progress-v2|status-local-patch|status-temp-class)/i.test(tasks)) {
  fail('TasksStable contains forbidden temporary class naming');
}

const calendar = read('src/pages/Calendar.tsx');
const activity = read('src/pages/Activity.tsx');
for (const token of ['cf-severity-pill', 'cf-status-pill', 'data-cf-status-tone={getCalendarEntryStatusTone(entry)}']) {
  if (!calendar.includes(token)) fail('Stage12 Calendar contract weakened: ' + token);
}
for (const token of ['function getActivitySeverity(activity: any)', 'cf-severity-dot', 'cf-severity-pill']) {
  if (!activity.includes(token)) fail('Stage12 Activity contract weakened: ' + token);
}

console.log('OK: CloseFlow Leads + TasksStable status contract Stage13 passed.');
