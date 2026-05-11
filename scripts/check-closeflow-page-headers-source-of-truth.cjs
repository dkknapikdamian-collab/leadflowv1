const fs = require('fs');
const path = require('path');

const root = process.cwd();
const required = [
  'src/lib/page-header-content.ts',
  'src/components/CloseFlowPageHeaderRuntime.tsx',
  'src/styles/closeflow-page-header.css',
  'src/styles/closeflow-action-tokens.css',
  'src/App.tsx',
];

for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) {
    throw new Error(`MISSING_FILE:${rel}`);
  }
}

const app = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8');
if (!app.includes("CloseFlowPageHeaderRuntime")) throw new Error('APP_RUNTIME_IMPORT_MISSING');
if (!app.includes('<CloseFlowPageHeaderRuntime enabled={isLoggedIn} />')) throw new Error('APP_RUNTIME_RENDER_MISSING');

const content = fs.readFileSync(path.join(root, 'src/lib/page-header-content.ts'), 'utf8');
for (const key of [
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
]) {
  if (!content.includes(`${key}: {`)) throw new Error(`HEADER_CONTENT_MISSING:${key}`);
}

const headerCss = fs.readFileSync(path.join(root, 'src/styles/closeflow-page-header.css'), 'utf8');
if (!headerCss.includes('CLOSEFLOW_PAGE_HEADER_SOURCE_OF_TRUTH_2026_05_11_START')) throw new Error('HEADER_CSS_MARKER_MISSING');
if (!headerCss.includes('.cf-page-header-description')) throw new Error('HEADER_DESCRIPTION_CLASS_MISSING');

const actionCss = fs.readFileSync(path.join(root, 'src/styles/closeflow-action-tokens.css'), 'utf8');
if (!actionCss.includes('CLOSEFLOW_HEADER_ACTION_TOKENS_2026_05_11_START')) throw new Error('ACTION_TOKENS_MARKER_MISSING');
if (!actionCss.includes('--cf-header-action-primary-bg: #2563eb')) throw new Error('PRIMARY_BUTTON_NOT_BLUE');
if (actionCss.includes('--cf-header-action-primary-bg: #16a34a')) throw new Error('PRIMARY_BUTTON_STILL_GREEN');

console.log('CLOSEFLOW_PAGE_HEADERS_SOURCE_OF_TRUTH_CHECK_OK');
