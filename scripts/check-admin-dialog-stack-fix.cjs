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

expect(toolbar.includes('ADMIN_DIALOG_STACK_FIX_STAGE87C'), 'toolbar must have Stage87C marker');
expect(toolbar.includes('resetDialogPosition'), 'toolbar must expose resetDialogPosition');
expect(toolbar.includes("resetDialogPosition('bug')"), 'bug dialog must have reset position button');
expect(toolbar.includes("resetDialogPosition('target')"), 'target dialog must have reset position button');
expect(css.includes('ADMIN_DIALOG_STACK_FIX_STAGE87C'), 'CSS must have Stage87C marker');
expect(css.includes('z-index: 2147483000'), 'toolbar must get high z-index');
expect(css.includes('z-index: 2147483001'), 'backdrop must get high z-index');
expect(css.includes('z-index: 2147483002'), 'dialog must get high z-index');
expect(css.includes('isolation: isolate'), 'toolbar must isolate stacking context');
expect(css.includes('padding: 72px 20px 20px'), 'dialog top offset should be moderate, not excessive');
expect(css.includes('pointer-events: auto'), 'backdrop must accept pointer events');
expect(Boolean(pkg.scripts?.['check:admin-dialog-stack-fix']), 'package.json missing check:admin-dialog-stack-fix');
expect(Boolean(pkg.scripts?.['test:admin-dialog-stack-fix']), 'package.json missing test:admin-dialog-stack-fix');
expect(String(pkg.scripts?.['verify:admin-tools'] || '').includes('check:admin-dialog-stack-fix'), 'verify:admin-tools must include Stage87C guard');

if (fail.length) {
  console.error('Admin dialog stack fix guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('PASS ADMIN_DIALOG_STACK_FIX_STAGE87C');
