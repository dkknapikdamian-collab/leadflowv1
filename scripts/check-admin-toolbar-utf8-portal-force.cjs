#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const expect = (condition, message) => { if (!condition) fail.push(message); };

const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
const css = read('src/styles/admin-tools.css');
const pkg = JSON.parse(read('package.json'));

expect(toolbar.includes('ADMIN_TOOLBAR_UTF8_PORTAL_FORCE_STAGE87G'), 'toolbar must carry Stage87G marker');
expect(toolbar.includes('Nie działa'), 'toolbar must preserve Polish Button Matrix action: Nie działa');
expect(toolbar.includes('Przenieść'), 'toolbar must preserve Polish Button Matrix action: Przenieść');
expect(toolbar.includes('Zły tekst'), 'toolbar must preserve Polish Button Matrix action: Zły tekst');
expect(toolbar.includes('Możesz kliknąć kolejny element.'), 'toolbar must preserve Polish save toast');
expect(toolbar.includes('createPortal(floatingAdminTools, document.body)'), 'quick editor must be portaled to document.body');
expect(toolbar.includes('startQuickEditorDrag'), 'quick editor drag handler missing');
expect(toolbar.includes('Reset pozycji'), 'quick editor reset missing');
expect(toolbar.includes("bottom: 'auto'"), 'quick editor inline style must not pin to bottom');
expect(css.includes('ADMIN_TOOLBAR_UTF8_PORTAL_FORCE_STAGE87G'), 'CSS Stage87G marker missing');
expect(css.includes('top: 136px'), 'CSS must open editor below topbar');
expect(css.includes('bottom: auto'), 'CSS must not pin editor to bottom');
expect(String(pkg.scripts?.['verify:admin-tools'] || '').includes('check:admin-toolbar-utf8-portal-force'), 'verify:admin-tools missing Stage87G check');

const mojibakeMarkers = ['Ĺ', 'Ä', 'Ľ', 'Â·', 'Ă'];
for (const marker of mojibakeMarkers) {
  expect(!toolbar.includes(marker), 'AdminDebugToolbar still contains mojibake marker: ' + marker);
}

if (fail.length) {
  console.error('Admin toolbar utf8 portal force guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('PASS ADMIN_TOOLBAR_UTF8_PORTAL_FORCE_STAGE87G');
