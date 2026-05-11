const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const failures = [];

function expect(name, ok) {
  if (!ok) failures.push(name);
}

function read(rel) {
  const full = path.join(repo, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}

const content = read('src/lib/page-header-content.ts');
const css = read('src/styles/closeflow-page-header-card-source-truth.css');
const app = read('src/App.tsx');

const keys = [
  'today',
  'leads',
  'clients',
  'cases',
  'tasks',
  'calendar',
  'templates',
  'responseTemplates',
  'activity',
  'aiDrafts',
  'notifications',
  'billing',
  'support',
  'settings',
  'adminAi',
];

expect('content source exists', content.includes('PAGE_HEADER_CONTENT'));
for (const key of keys) {
  expect(`content has ${key}`, content.includes(`${key}: {`) && content.includes(`PAGE_HEADER_CONTENT.${key}`) === false);
}

expect('stage4 css marker', css.includes('CLOSEFLOW_PAGE_HEADER_TITLE_COPY_PARITY_TODAY_STAGE4_2026_05_11_START'));
expect('today-like title size token', css.includes('--cf-page-header-title-font-size: clamp(28px, 2.75vw, 40px)'));
expect('description style token', css.includes('--cf-page-header-description-font-weight: 650'));
expect('no runtime header', !app.includes('CloseFlowPageHeaderRuntime') && !app.includes('MutationObserver'));

const pageExpectations = [
  ['src/pages/Leads.tsx', 'leads'],
  ['src/pages/Clients.tsx', 'clients'],
  ['src/pages/Cases.tsx', 'cases'],
  ['src/pages/TasksStable.tsx', 'tasks'],
  ['src/pages/Calendar.tsx', 'calendar'],
  ['src/pages/Templates.tsx', 'templates'],
  ['src/pages/ResponseTemplates.tsx', 'responseTemplates'],
  ['src/pages/Activity.tsx', 'activity'],
  ['src/pages/AiDrafts.tsx', 'aiDrafts'],
  ['src/pages/NotificationsCenter.tsx', 'notifications'],
  ['src/pages/Billing.tsx', 'billing'],
  ['src/pages/SupportCenter.tsx', 'support'],
  ['src/pages/Settings.tsx', 'settings'],
  ['src/pages/AdminAiSettings.tsx', 'adminAi'],
];

for (const [rel, key] of pageExpectations) {
  const text = read(rel);
  if (!text) continue;
  expect(`${rel} imports PAGE_HEADER_CONTENT`, text.includes("PAGE_HEADER_CONTENT"));
  expect(`${rel} uses description source`, text.includes(`PAGE_HEADER_CONTENT.${key}.description`));
}

if (failures.length) {
  console.error('CLOSEFLOW_PAGE_HEADER_DESCRIPTIONS_TEXT_STYLE_STAGE4_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_PAGE_HEADER_DESCRIPTIONS_TEXT_STYLE_STAGE4_CHECK_OK');
