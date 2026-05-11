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

const finalCss = read('src/styles/closeflow-page-header-final-lock.css');
const emergency = read('src/styles/emergency/emergency-hotfixes.css');
const activity = read('src/pages/Activity.tsx');
const responseTemplates = read('src/pages/ResponseTemplates.tsx');
const aiDrafts = read('src/pages/AiDrafts.tsx');
const notifications = read('src/pages/NotificationsCenter.tsx');
const calendar = read('src/pages/Calendar.tsx');

expect('final css exists', finalCss.includes('CLOSEFLOW_PAGE_HEADER_FINAL_LOCK_PACKET2_2026_05_11'));
expect('critical only-child copy fix exists', finalCss.includes('> :first-child:last-child'));
expect('final css does not classify generic last-child as action', !finalCss.includes('.cf-page-header > :last-child') && !finalCss.includes('[data-cf-page-header="true"].cf-page-header > :last-child'));
expect('final css has ai violet token', finalCss.includes('--cf-ph-ai-text: #7c3aed'));
expect('final css has danger trash token', finalCss.includes('var(--cf-trash-icon-color'));
expect('emergency imports final lock', emergency.includes('closeflow-page-header-final-lock.css'));
expect('activity copy marked', activity.includes('data-cf-page-header-part="copy"'));
expect('activity imports final lock', activity.includes('closeflow-page-header-final-lock.css'));
expect('calendar imports final lock', calendar.includes('closeflow-page-header-final-lock.css'));
expect('calendar has add task header action', calendar.includes('data-calendar-header-add-task="true"'));
expect('calendar has add event header action', calendar.includes('data-calendar-header-add-event="true"'));
expect('response templates duplicate description removed', (responseTemplates.match(/PAGE_HEADER_CONTENT\.responseTemplates\.description/g) || []).length <= 1);
expect('ai drafts duplicate description controlled', (aiDrafts.match(/PAGE_HEADER_CONTENT\.aiDrafts\.description/g) || []).length <= 1);
expect('notifications duplicate description controlled', (notifications.match(/PAGE_HEADER_CONTENT\.notifications\.description/g) || []).length <= 1);

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
  expect(`${page} imports final lock`, text.includes('closeflow-page-header-final-lock.css'));
}

if (failures.length) {
  console.error('CLOSEFLOW_PAGE_HEADER_FINAL_LOCK_PACKET2_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_PAGE_HEADER_FINAL_LOCK_PACKET2_CHECK_OK');
