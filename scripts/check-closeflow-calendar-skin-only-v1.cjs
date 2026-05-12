const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const failures = [];

function p(rel) {
  return path.join(repo, rel);
}

function read(rel) {
  return fs.existsSync(p(rel)) ? fs.readFileSync(p(rel), 'utf8') : '';
}

function expect(name, ok) {
  if (!ok) failures.push(name);
}

const calendar = read('src/pages/Calendar.tsx');
const css = read('src/styles/closeflow-calendar-skin-only-v1.css');
const patch = read('tools/patch-closeflow-calendar-skin-only-v1.cjs');
const audit = read('docs/ui/CLOSEFLOW_CALENDAR_SKIN_ONLY_V1_AUDIT.generated.json');

expect('Calendar imports skin CSS', calendar.includes("import '../styles/closeflow-calendar-skin-only-v1.css';"));
expect('Calendar has skin marker', calendar.includes('CLOSEFLOW_CALENDAR_SKIN_ONLY_V1_2026_05_12'));

expect('CSS marker exists', css.includes('CLOSEFLOW_CALENDAR_SKIN_ONLY_V1_2026_05_12'));
expect('CSS has page tokens', css.includes('--cf-cal-page-bg: #eef4fb;'));
expect('CSS has surface token', css.includes('--cf-cal-surface: #ffffff;'));
expect('CSS keeps side panel visible', css.includes('visibility: visible !important') && css.includes('opacity: 1 !important'));
expect('CSS scopes by calendar header', css.includes(':has([data-cf-page-header-v2="calendar"])'));
expect('CSS neutralizes dark slabs', css.includes('bg-slate-950'));
expect('CSS has month overflow indicator styling', css.includes('[class*="more"]') && css.includes('var(--cf-cal-blue)'));
expect('CSS has empty state light styling', css.includes('calendar-empty-state'));
expect('CSS has task/event/phone color chips', css.includes('--cf-cal-violet') && css.includes('--cf-cal-green') && css.includes('--cf-cal-phone'));

const forbiddenPatchTokens = [
  'setState(',
  'setEntries(',
  'createTask',
  'createEvent',
  'deleteTask',
  'deleteEvent',
  'updateTask',
  'updateEvent',
  'supabase',
  'fetch(',
  'axios'
];
for (const token of forbiddenPatchTokens) {
  expect(`patch does not touch data/logical token ${token}`, !patch.includes(token));
}

expect('audit generated', audit.includes('skin only') && audit.includes('do not hide left side panel'));

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_SKIN_ONLY_V1_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_SKIN_ONLY_V1_CHECK_OK');
