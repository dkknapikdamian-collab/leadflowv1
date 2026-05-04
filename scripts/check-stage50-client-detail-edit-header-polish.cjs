const fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function assertContains(file, content, expected) {
  if (!content.includes(expected)) {
    console.error('FAIL ' + file + ': missing ' + expected);
    process.exit(1);
  }
  console.log('PASS ' + file + ': contains ' + expected);
}

const tsxPath = 'src/pages/ClientDetail.tsx';
const cssPath = 'src/styles/visual-stage12-client-detail-vnext.css';
const pkgPath = 'package.json';
const testPath = 'tests/stage50-client-detail-edit-header-polish.test.cjs';

const tsx = read(tsxPath);
const css = read(cssPath);
const pkg = read(pkgPath);
const test = read(testPath);

assertContains(tsxPath, tsx, 'STAGE50_CLIENT_DETAIL_EDIT_HEADER_POLISH');
assertContains(cssPath, css, 'STAGE50_CLIENT_DETAIL_EDIT_HEADER_POLISH');
assertContains(cssPath, css, '.client-detail-vnext-page .client-detail-breadcrumb');
assertContains(cssPath, css, 'display: none !important;');
assertContains(cssPath, css, '.client-detail-vnext-page .client-detail-header-meta');
assertContains(cssPath, css, 'flex-wrap: nowrap !important;');
assertContains(cssPath, css, '.client-detail-vnext-page .client-detail-edit-form input');
assertContains(cssPath, css, '-webkit-text-fill-color: #111827 !important;');
assertContains(cssPath, css, 'button[aria-label*="dykt" i]');
assertContains(cssPath, css, 'button[aria-label*="notat" i]');
assertContains(pkgPath, pkg, 'check:stage50-client-detail-edit-header-polish');
assertContains(testPath, test, 'STAGE50_CLIENT_DETAIL_EDIT_HEADER_POLISH');
console.log('PASS STAGE50_CLIENT_DETAIL_EDIT_HEADER_POLISH');
