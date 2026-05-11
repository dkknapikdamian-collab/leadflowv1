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

const css = read('src/styles/closeflow-page-header-structure-lock.css');
const emergency = read('src/styles/emergency/emergency-hotfixes.css');
const activity = read('src/pages/Activity.tsx');
const templates = read('src/pages/Templates.tsx');

expect('structure lock css exists', css.includes('CLOSEFLOW_PAGE_HEADER_STRUCTURE_LOCK_PACKET3_2026_05_11'));
expect('structure lock imports emergency', emergency.includes('closeflow-page-header-structure-lock.css'));
expect('no local activity header class', !activity.includes('className="cf-page-header activity-page-header"'));
expect('activity header remains cf page header', activity.includes('className="cf-page-header"'));
expect('templates outer row not marked as copy', !templates.includes('data-cf-page-header-part="copy" className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"'));
expect('templates row class present', templates.includes('className="cf-page-header-row flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"'));
expect('templates inner copy present', templates.includes('data-cf-page-header-part="copy" className="space-y-3"'));
expect('templates kicker part present', templates.includes('data-cf-page-header-part="kicker"'));

const pageFiles = [
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

for (const page of pageFiles) {
  const text = read(page);
  expect(`${page} imports structure lock`, text.includes('closeflow-page-header-structure-lock.css'));
}

if (failures.length) {
  console.error('CLOSEFLOW_PAGE_HEADER_STRUCTURE_LOCK_PACKET3_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_PAGE_HEADER_STRUCTURE_LOCK_PACKET3_CHECK_OK');
