#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const expect = (condition, message) => { if (!condition) fail.push(message); };

const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
const candidates = read('src/components/admin-tools/dom-candidates.ts');
const types = read('src/components/admin-tools/admin-tools-types.ts');

['button','a[href]','[role="button"]','[data-nav-path]','[data-context-action]','input[type="button"]','input[type="submit"]'].forEach((needle) => {
  expect(candidates.includes(needle), `Button scanner missing selector ${needle}`);
});
expect(toolbar.includes('scanButtons'), 'Toolbar must expose scanButtons');
expect(toolbar.includes('qaStatus'), 'Button Matrix must have qaStatus');
expect(toolbar.includes('Nie dzia\u0142a') && toolbar.includes('Przenie\u015B\u0107') && toolbar.includes('Z\u0142y tekst'), 'Button Matrix QA actions missing');
expect(types.includes('button_matrix_item'), 'Button Matrix data contract missing');
expect(types.includes('unchecked|ok|bug|move|rename|remove') || types.includes("'unchecked' | 'ok' | 'bug' | 'move' | 'rename' | 'remove'"), 'Button Matrix QA statuses missing');

if (fail.length) {
  console.error('Admin Button Matrix guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}
console.log('PASS ADMIN_BUTTON_MATRIX_STAGE87');
