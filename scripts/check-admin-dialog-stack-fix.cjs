#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const expect = (condition, message) => { if (!condition) fail.push(message); };

const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
const css = read('src/styles/admin-tools.css');

if (toolbar.includes('ADMIN_CLICK_TO_ANNOTATE_STAGE87D')) {
  expect(toolbar.includes('admin-tool-quick-editor'), 'Stage87D quick editor missing');
  expect(css.includes('z-index: 2147483006'), 'Stage87D quick editor must stay above app content');
  expect(css.includes('.admin-tool-save-toast'), 'Stage87D save toast missing');
} else {
  expect(toolbar.includes('ADMIN_DIALOG_STACK_FIX_STAGE87C'), 'toolbar must have Stage87C marker');
  expect(css.includes('ADMIN_DIALOG_STACK_FIX_STAGE87C'), 'CSS must have Stage87C marker');
}

if (fail.length) {
  console.error('Admin dialog stack compatibility guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('PASS ADMIN_DIALOG_STACK_FIX_STAGE87C_OR_STAGE87D');
