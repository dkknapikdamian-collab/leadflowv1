const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('STAGE50_CLIENT_DETAIL_EDIT_HEADER_POLISH keeps client edit/header UI visible', () => {
  const tsx = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
  const css = fs.readFileSync('src/styles/visual-stage12-client-detail-vnext.css', 'utf8');
  const pkg = fs.readFileSync('package.json', 'utf8');

  assert.match(tsx, /STAGE50_CLIENT_DETAIL_EDIT_HEADER_POLISH/);
  assert.match(css, /STAGE50_CLIENT_DETAIL_EDIT_HEADER_POLISH/);
  assert.match(css, /\.client-detail-vnext-page \.client-detail-breadcrumb\s*\{[\s\S]*display:\s*none\s*!important/);
  assert.match(css, /\.client-detail-vnext-page \.client-detail-header-meta\s*\{[\s\S]*flex-wrap:\s*nowrap\s*!important/);
  assert.match(css, /\.client-detail-vnext-page \.client-detail-header-meta span\s*\{[\s\S]*font-size:\s*10\.5px\s*!important/);
  assert.match(css, /\.client-detail-vnext-page \.client-detail-edit-form input/);
  assert.match(css, /-webkit-text-fill-color:\s*#111827\s*!important/);
  assert.match(css, /button\[aria-label\*="dykt" i\]/);
  assert.match(css, /button\[aria-label\*="notat" i\]/);
  assert.match(pkg, /check:stage50-client-detail-edit-header-polish/);
});
