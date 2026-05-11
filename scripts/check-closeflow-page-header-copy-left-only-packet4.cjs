const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const failures = [];

function read(rel) {
  const full = path.join(repo, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}

function expect(name, ok) {
  if (!ok) failures.push(name);
}

const css = read('src/styles/closeflow-page-header-copy-left-only.css');
const emergency = read('src/styles/emergency/emergency-hotfixes.css');
const tasks = read('src/pages/TasksStable.tsx');

expect('copy-left-only css marker', css.includes('CLOSEFLOW_PAGE_HEADER_COPY_LEFT_ONLY_PACKET4_2026_05_11'));
expect('layout row stretches full width', css.includes('> .cf-page-header-row') && css.includes('max-width: none !important'));
expect('copy is forced left', css.includes('place-self: center start !important'));
expect('kicker source token', css.includes('--cf-ph-kicker-left-text: #2563eb'));
expect('no last-child action inference', !css.includes('> :last-child'));
expect('emergency import present', emergency.includes('closeflow-page-header-copy-left-only.css'));
expect('tasks list accidental copy flag removed', !tasks.includes('<section className="space-y-2" data-cf-page-header-part="copy" data-tasks-compact-list-stage48="true">'));

const pages = [
  'src/pages/TodayStable.tsx',
  'src/pages/Leads.tsx',
  'src/pages/Clients.tsx',
  'src/pages/Cases.tsx',
  'src/pages/TasksStable.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/Templates.tsx',
  'src/pages/ResponseTemplates.tsx',
  'src/pages/Activity.tsx',
  'src/pages/AiDrafts.tsx',
  'src/pages/NotificationsCenter.tsx',
  'src/pages/Billing.tsx',
  'src/pages/SupportCenter.tsx',
  'src/pages/Settings.tsx',
  'src/pages/AdminAiSettings.tsx',
];

for (const page of pages) {
  const text = read(page);
  expect(`${page} imports copy-left-only`, text.includes('closeflow-page-header-copy-left-only.css'));
}

if (failures.length) {
  console.error('CLOSEFLOW_PAGE_HEADER_COPY_LEFT_ONLY_PACKET4_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_PAGE_HEADER_COPY_LEFT_ONLY_PACKET4_CHECK_OK');
