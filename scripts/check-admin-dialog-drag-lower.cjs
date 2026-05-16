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
  expect(css.includes('.admin-tool-quick-editor'), 'Stage87D quick editor CSS missing');
  expect(css.includes('bottom: 24px'), 'Stage87D quick editor should appear as visible lower-right panel');
} else {
  expect(toolbar.includes('ADMIN_DIALOG_DRAG_LOWER_STAGE87B'), 'toolbar must have Stage87B marker');
  expect(toolbar.includes('startDialogDrag'), 'toolbar must start drag');
  expect(css.includes('ADMIN_DIALOG_DRAG_LOWER_STAGE87B'), 'CSS must have Stage87B marker');
}

if (fail.length) {
  console.error('Admin dialog drag/lower compatibility guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('PASS ADMIN_DIALOG_DRAG_LOWER_STAGE87B_OR_STAGE87D');
