const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

const pageCss = read(path.join(repo, 'src', 'styles', 'closeflow-page-header.css'));
const actionCss = read(path.join(repo, 'src', 'styles', 'closeflow-action-tokens.css'));
const app = read(path.join(repo, 'src', 'App.tsx'));

const requiredPage = [
  'CLOSEFLOW_PAGE_HEADER_CARD_SKIN_2026_05_11_START',
  '--cf-page-header-card-bg',
  '.page-head',
  '.settings-header',
  '.support-header',
  '.billing-header',
  '.cf-html-view > header:first-child',
  '--cf-header-action-primary-bg',
];

const requiredAction = [
  'CLOSEFLOW_HEADER_ACTION_TOKENS_2026_05_11_START',
  '--cf-header-action-primary-bg',
  '--cf-header-action-ai-bg',
  '--cf-header-action-secondary-bg',
];

const missing = [
  ...requiredPage.filter((needle) => !pageCss.includes(needle)).map((needle) => 'page:' + needle),
  ...requiredAction.filter((needle) => !actionCss.includes(needle)).map((needle) => 'action:' + needle),
];

if (missing.length) {
  console.error('CLOSEFLOW_PAGE_HEADER_CARD_SKIN_MISSING_MARKERS');
  console.error(missing.join('\n'));
  process.exit(1);
}

if (app.includes('CloseFlowPageHeaderRuntime')) {
  console.error('CLOSEFLOW_PAGE_HEADER_RUNTIME_FORBIDDEN_IN_APP');
  process.exit(1);
}

if (pageCss.includes('MutationObserver')) {
  console.error('CLOSEFLOW_PAGE_HEADER_MUTATION_OBSERVER_FORBIDDEN');
  process.exit(1);
}

if (pageCss.includes('translate(calc(-50%')) {
  console.error('CLOSEFLOW_PAGE_HEADER_POSITION_NUDGE_FORBIDDEN');
  process.exit(1);
}

console.log('CLOSEFLOW_PAGE_HEADER_CARD_SKIN_CHECK_OK');
