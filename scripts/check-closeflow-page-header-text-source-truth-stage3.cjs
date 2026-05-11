const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const cssPath = path.join(repo, 'src', 'styles', 'closeflow-page-header-card-source-truth.css');
const appPath = path.join(repo, 'src', 'App.tsx');

const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
const app = fs.existsSync(appPath) ? fs.readFileSync(appPath, 'utf8') : '';

const failures = [];
function expect(name, condition) {
  if (!condition) failures.push(name);
}

expect('stage3 text marker', css.includes('CLOSEFLOW_PAGE_HEADER_TEXT_SOURCE_TRUTH_STAGE3_2026_05_11_START'));
expect('text tokens exist', css.includes('--cf-page-header-title-font-size') && css.includes('--cf-page-header-description-font-size'));
expect('copy source selector exists', css.includes('[data-cf-page-header-part="copy"]'));
expect('kicker source selector exists', css.includes('[data-cf-page-header-part="kicker"]'));
expect('title source selector exists', css.includes('[data-cf-page-header-part="title"]'));
expect('description source selector exists', css.includes('[data-cf-page-header-part="description"]'));
expect('actions source selector exists', css.includes('[data-cf-page-header-part="actions"]'));
expect('no runtime mutation observer', !app.includes('CloseFlowPageHeaderRuntime') && !app.includes('MutationObserver'));
expect('background untouched by stage3 block', !/CLOSEFLOW_PAGE_HEADER_TEXT_SOURCE_TRUTH_STAGE3[\s\S]*--cf-page-header-bg-solid/.test(css));

if (failures.length) {
  console.error('CLOSEFLOW_PAGE_HEADER_TEXT_SOURCE_TRUTH_STAGE3_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_PAGE_HEADER_TEXT_SOURCE_TRUTH_STAGE3_CHECK_OK');
