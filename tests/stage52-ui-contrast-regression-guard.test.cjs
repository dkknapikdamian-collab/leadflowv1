const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const marker = 'STAGE52_UI_CONTRAST_REGRESSION_GUARD';

function read(file) {
  return fs.readFileSync(path.join(process.cwd(), file), 'utf8').replace(/^\uFEFF/, '');
}

test(marker + ': package exposes one ui contrast gate', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.ok(pkg.scripts['verify:ui-contrast'].includes('check:stage49-client-detail-visible-actions'));
  assert.ok(pkg.scripts['verify:ui-contrast'].includes('check:stage50-client-detail-edit-header-polish'));
  assert.ok(pkg.scripts['verify:ui-contrast'].includes('check:stage51-clients-case-contrast-hotfix'));
  assert.ok(pkg.scripts['verify:ui-contrast'].includes('check:stage52-ui-contrast-regression-guard'));
});

test(marker + ': readable selectors are guarded', () => {
  const clientCss = read('src/styles/visual-stage12-client-detail-vnext.css');
  const clientsCss = read('src/styles/visual-stage05-clients.css');
  const caseCss = read('src/styles/visual-stage08-case-detail.css');

  assert.ok(clientCss.includes('.client-detail-vnext-page .client-detail-edit-form input'));
  assert.ok(clientCss.includes('-webkit-text-fill-color: #111827 !important;'));
  assert.ok(clientCss.includes('button[aria-label*="dykt" i]'));
  assert.ok(clientCss.includes('button[aria-label*="notat" i]'));
  assert.ok(clientsCss.includes('[data-clients-simple-filters="true"] p'));
  assert.ok(clientsCss.includes('color: #475467 !important;'));
  assert.ok(caseCss.includes('.case-detail-page p,'));
  assert.ok(caseCss.includes('font-size: 12px !important;'));
});
