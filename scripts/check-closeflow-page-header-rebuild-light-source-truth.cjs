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

expect('marker', css.includes('CLOSEFLOW_PAGE_HEADER_REBUILD_LIGHT_SOURCE_TRUTH_2026_05_11'));
expect('white background solid token', css.includes('--cf-ph-bg-solid: #ffffff'));
expect('light background gradient', css.includes('rgba(255,255,255'));
expect('no mutation observer', !css.includes('MutationObserver') && !app.includes('CloseFlowPageHeaderRuntime'));
expect('no dark header tokens', !/(--cf-ph-bg:\s*.*#0|--cf-ph-bg-solid:\s*#0|#07101f|#020617|#111827)/i.test(css));
expect('tasks new task action', tasks.includes('data-tasks-new-task-header-action="true"'));
expect('tasks imports Plus', /import \{[^}]*\bPlus\b[^}]*\} from 'lucide-react';/.test(tasks));

const pages = [
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

for (const rel of pages) {
  const full = path.join(repo, rel);
  if (!fs.existsSync(full)) continue;
  const text = fs.readFileSync(full, 'utf8');
  expect(`${rel} imports source truth`, text.includes('closeflow-page-header-card-source-truth.css'));
}

if (failures.length) {
  console.error('CLOSEFLOW_PAGE_HEADER_REBUILD_LIGHT_SOURCE_TRUTH_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_PAGE_HEADER_REBUILD_LIGHT_SOURCE_TRUTH_CHECK_OK');
