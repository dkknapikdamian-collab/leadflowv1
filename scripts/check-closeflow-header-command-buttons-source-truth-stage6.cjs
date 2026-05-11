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

const css = read('src/styles/closeflow-command-actions-source-truth.css');
const app = read('src/App.tsx');
const emergency = read('src/styles/emergency/emergency-hotfixes.css');
const globalQuickActions = read('src/components/GlobalQuickActions.tsx');
const quickAiCapture = read('src/components/QuickAiCapture.tsx');
const oldTokens = read('src/styles/closeflow-action-tokens.css');

expect('stage6 css marker', css.includes('CLOSEFLOW_HEADER_COMMAND_BUTTONS_SOURCE_TRUTH_STAGE6_2026_05_11'));
expect('source truth defines button background', css.includes('--cf-command-action-bg: #ffffff'));
expect('source truth defines blue text', css.includes('--cf-command-action-blue: #2563eb'));
expect('source truth targets global toolbar', css.includes('[data-global-quick-actions="true"]'));
expect('source truth targets page header', css.includes('[data-cf-page-header="true"].cf-page-header'));
expect('source truth overrides today action stack row', css.includes('.cf-section-head-action-stack') && css.includes('flex-direction: row !important'));
expect('source truth imported in App', app.includes("closeflow-command-actions-source-truth.css"));
expect('source truth imported in emergency', emergency.includes("closeflow-command-actions-source-truth.css"));
expect('GlobalQuickActions has command action markers', globalQuickActions.includes('data-cf-command-action="neutral"') && globalQuickActions.includes('data-cf-command-action="ai"'));
expect('QuickAiCapture trigger has command marker', quickAiCapture.includes('data-cf-command-action="ai"'));
expect('old tokens still known conflict', oldTokens.includes('.cf-section-head-action-stack') && oldTokens.includes('flex-direction: column'));
expect('no runtime DOM patcher', !app.includes('MutationObserver') && !app.includes('CloseFlowPageHeaderRuntime'));

if (failures.length) {
  console.error('CLOSEFLOW_HEADER_COMMAND_BUTTONS_SOURCE_TRUTH_STAGE6_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_HEADER_COMMAND_BUTTONS_SOURCE_TRUTH_STAGE6_CHECK_OK');
