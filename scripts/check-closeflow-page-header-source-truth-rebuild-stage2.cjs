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

const css = read('src/styles/closeflow-page-header-card-source-truth.css');
const emergency = read('src/styles/emergency/emergency-hotfixes.css');
const app = read('src/App.tsx');
const tasks = read('src/pages/TasksStable.tsx');

expect('source truth marker', css.includes('CLOSEFLOW_PAGE_HEADER_SOURCE_TRUTH_REBUILD_STAGE2_2026_05_11'));
expect('source truth does not use zero-specificity :where', !css.includes(':where('));
expect('source truth uses data-cf-page-header scope', css.includes('[data-cf-page-header="true"]'));
expect('source truth background token is white', css.includes('--cf-page-header-bg-solid: #ffffff'));
expect('source truth has background section', css.includes('1) BACKGROUND SOURCE OF TRUTH'));
expect('source truth has text section', css.includes('2) TEXT SOURCE OF TRUTH'));
expect('source truth has kicker section', css.includes('3) KICKER SOURCE OF TRUTH'));
expect('source truth has button section', css.includes('4) BUTTON SOURCE OF TRUTH'));
expect('source truth has no dark header bg tokens', !/(#020617|#07101f|#0b1220|#111827|#0f172a;[\s\n]*--cf-page-header-bg)/i.test(css));
expect('emergency imports source truth at end', emergency.trim().endsWith("@import '../closeflow-page-header-card-source-truth.css';"));
expect('no runtime header in App', !app.includes('CloseFlowPageHeaderRuntime') && !app.includes('MutationObserver'));
expect('tasks has new task button', tasks.includes('data-tasks-new-task-header-action="true"') && tasks.includes('openNewTask'));

const pageFiles = [
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

for (const rel of pageFiles) {
  const text = read(rel);
  expect(`${rel} imports source truth`, text.includes('closeflow-page-header-card-source-truth.css'));
}

const headerPages = [
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

for (const rel of headerPages) {
  const text = read(rel);
  expect(`${rel} has data-cf-page-header`, text.includes('data-cf-page-header="true"'));
}

if (failures.length) {
  console.error('CLOSEFLOW_PAGE_HEADER_SOURCE_TRUTH_REBUILD_STAGE2_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_PAGE_HEADER_SOURCE_TRUTH_REBUILD_STAGE2_CHECK_OK');
