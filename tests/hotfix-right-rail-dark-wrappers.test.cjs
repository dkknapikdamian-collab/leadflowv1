const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

const files = {
  activityPage: path.join(root, 'src', 'pages', 'Activity.tsx'),
  aiDraftsPage: path.join(root, 'src', 'pages', 'AiDrafts.tsx'),
  notificationsPage: path.join(root, 'src', 'pages', 'NotificationsCenter.tsx'),
  activityCss: path.join(root, 'src', 'styles', 'visual-stage8-activity-vnext.css'),
  aiDraftsCss: path.join(root, 'src', 'styles', 'visual-stage9-ai-drafts-vnext.css'),
  notificationsCss: path.join(root, 'src', 'styles', 'visual-stage10-notifications-vnext.css'),
  hotfixCss: path.join(root, 'src', 'styles', 'hotfix-right-rail-dark-wrappers.css'),
};

function fail(message) {
  console.error('FAIL hotfix right rail dark wrappers:', message);
  process.exit(1);
}

for (const [key, filePath] of Object.entries(files)) {
  if (!fs.existsSync(filePath)) fail(`missing ${key}: ${filePath}`);
}

const activityPage = fs.readFileSync(files.activityPage, 'utf8');
const aiDraftsPage = fs.readFileSync(files.aiDraftsPage, 'utf8');
const notificationsPage = fs.readFileSync(files.notificationsPage, 'utf8');
const hotfixCss = fs.readFileSync(files.hotfixCss, 'utf8');

for (const page of [activityPage, aiDraftsPage, notificationsPage]) {
  if (!page.includes("import '../styles/hotfix-right-rail-dark-wrappers.css';")) {
    fail('missing hotfix css import in one of the pages');
  }
}

const requiredSelectors = [
  '.activity-vnext-page .activity-right-rail',
  '.ai-drafts-vnext-page .ai-drafts-right-rail',
  '.notifications-vnext-page .notifications-right-rail',
  '.right-card.activity-right-card',
  '.right-card.ai-drafts-right-card',
  '.right-card.notifications-right-card',
];

for (const selector of requiredSelectors) {
  if (!hotfixCss.includes(selector)) fail(`missing selector in hotfix css: ${selector}`);
}

const requiredRules = [
  'background: transparent !important',
  'border: 0 !important',
  'box-shadow: none !important',
  'background: #ffffff !important',
  'border: 1px solid var(--cf-hotfix-border) !important',
  '0 8px 22px rgba(16, 24, 40, 0.05)',
  'content: none !important',
  'display: none !important',
];

for (const needle of requiredRules) {
  if (!hotfixCss.includes(needle)) fail(`missing required rule snippet in hotfix css: ${needle}`);
}

const darkTokens = [
  '#000',
  '#020617',
  '#030712',
  '#0b1220',
  '#0f172a',
  '#101828',
  '#111827',
  'rgb(2, 6, 23)',
  'rgb(15, 23, 42)',
  'bg-slate-950',
  'bg-gray-950',
  'bg-neutral-950',
  'linear-gradient(',
];

const allowInHotfix = new Set(['#111827']); // text color is allowed

for (const token of darkTokens) {
  if (allowInHotfix.has(token)) continue;
  if (hotfixCss.toLowerCase().includes(token.toLowerCase())) {
    fail(`hotfix css contains forbidden dark token: ${token}`);
  }
}

console.log('PASS hotfix right rail dark wrappers');

