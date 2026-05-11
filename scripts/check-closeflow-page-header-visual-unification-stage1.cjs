const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

const cssPath = path.join(repo, 'src/styles/closeflow-page-header-card-source-truth.css');
const tasksPath = path.join(repo, 'src/pages/TasksStable.tsx');
const appPath = path.join(repo, 'src/App.tsx');

const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
const tasks = fs.existsSync(tasksPath) ? fs.readFileSync(tasksPath, 'utf8') : '';
const app = fs.existsSync(appPath) ? fs.readFileSync(appPath, 'utf8') : '';

const failures = [];

function expect(name, ok) {
  if (!ok) failures.push(name);
}

expect('css marker', css.includes('CLOSEFLOW_PAGE_HEADER_CARD_SOURCE_TRUTH_STAGE1_2026_05_11'));
expect('css has page-head', css.includes('.main-leads-html > .page-head'));
expect('css has tasks hero selector', css.includes('[data-p0-tasks-stable-rebuild="true"] > .cf-page-hero'));
expect('css has primary token', css.includes('--cf-ph-primary-bg'));
expect('css has ai token', css.includes('--cf-ph-ai-bg'));
expect('css has no mutation observer', !css.includes('MutationObserver'));
expect('css has no transform translate', !/transform\s*:|translate\(/i.test(css));
expect('tasks has new task button', tasks.includes('data-tasks-new-task-header-action="true"'));
expect('tasks imports Plus', /import \{[^}]*\bPlus\b[^}]*\} from 'lucide-react';/.test(tasks));
expect('app has no header runtime mount', !app.includes('CloseFlowPageHeaderRuntime'));

const keyPages = [
  'src/pages/Leads.tsx',
  'src/pages/Clients.tsx',
  'src/pages/Cases.tsx',
  'src/pages/TasksStable.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/Templates.tsx',
  'src/pages/ResponseTemplates.tsx',
  'src/pages/AiDrafts.tsx',
  'src/pages/Activity.tsx',
  'src/pages/NotificationsCenter.tsx',
  'src/pages/Billing.tsx',
  'src/pages/SupportCenter.tsx',
  'src/pages/Settings.tsx',
  'src/pages/AdminAiSettings.tsx',
];

for (const rel of keyPages) {
  const full = path.join(repo, rel);
  if (!fs.existsSync(full)) continue;
  const text = fs.readFileSync(full, 'utf8');
  expect(`${rel} imports header source truth`, text.includes('closeflow-page-header-card-source-truth.css'));
}

if (failures.length) {
  console.error('CLOSEFLOW_PAGE_HEADER_VISUAL_UNIFICATION_STAGE1_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_PAGE_HEADER_VISUAL_UNIFICATION_STAGE1_CHECK_OK');
