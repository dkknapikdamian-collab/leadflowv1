#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const exists = (file) => fs.existsSync(path.join(root, file));
const expect = (condition, message) => { if (!condition) fail.push(message); };

const layout = read('src/components/Layout.tsx');
const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
const types = read('src/components/admin-tools/admin-tools-types.ts');
const storage = read('src/components/admin-tools/admin-tools-storage.ts');
const css = read('src/styles/admin-tools.css');
const pkg = JSON.parse(read('package.json'));

expect(exists('00_READ_FIRST_STRIPE_SANDBOX_NAME_TODO.md'), 'missing root read-first Stripe sandbox TODO file');
expect(read('00_READ_FIRST_STRIPE_SANDBOX_NAME_TODO.md').includes('Bezrobotny sandbox'), 'read-first file must mention Bezrobotny sandbox');
expect(layout.includes("import AdminDebugToolbar from './admin-tools/AdminDebugToolbar';"), 'Layout must import AdminDebugToolbar');
expect(layout.includes('isAppOwner'), 'Layout must use isAppOwner');
expect(layout.includes('canUseAdminDebugToolbar'), 'Layout must compute canUseAdminDebugToolbar');
expect(layout.includes('<AdminDebugToolbar currentSection={currentSection} />'), 'Layout must render AdminDebugToolbar in global bar');
expect(layout.includes('Boolean(isAdmin || isAppOwner)'), 'Toolbar must be gated by isAdmin || isAppOwner');
expect(toolbar.includes('ADMIN_DEBUG_TOOLBAR_STAGE87'), 'Toolbar marker missing');
expect(toolbar.includes('data-admin-tool-ui="true"'), 'Toolbar buttons must use data-admin-tool-ui');
expect(toolbar.includes('Review') && toolbar.includes('Buttons') && toolbar.includes('Bug') && toolbar.includes('Copy') && toolbar.includes('Export'), 'Toolbar must expose all five tools');
expect(types.includes('ADMIN_TOOLS_STORAGE_KEYS'), 'types must expose storage keys');
expect(storage.includes('window.localStorage'), 'storage must be localStorage based');
expect(!toolbar.includes('supabase') && !storage.includes('supabase'), 'admin tools V1 must not use Supabase');
expect(!toolbar.includes('fetch(') && !storage.includes('fetch('), 'admin tools V1 must not call backend');
expect(css.includes('.admin-debug-toolbar'), 'admin tools CSS missing');
['check:admin-debug-toolbar','check:admin-review-mode','check:admin-button-matrix','check:admin-feedback-export','test:admin-tools'].forEach((scriptName) => {
  expect(Boolean(pkg.scripts?.[scriptName]), `package.json missing ${scriptName}`);
});

if (fail.length) {
  console.error('Admin Debug Toolbar guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}
console.log('PASS ADMIN_DEBUG_TOOLBAR_STAGE87');
