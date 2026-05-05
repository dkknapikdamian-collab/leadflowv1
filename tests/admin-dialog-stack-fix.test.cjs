const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');

test('Stage87C admin dialog stays above app content and has reset position', () => {
  const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
  const css = read('src/styles/admin-tools.css');

  assert.ok(toolbar.includes('ADMIN_DIALOG_STACK_FIX_STAGE87C'));
  assert.ok(toolbar.includes('resetDialogPosition'));
  assert.ok(toolbar.includes("resetDialogPosition('bug')"));
  assert.ok(toolbar.includes("resetDialogPosition('target')"));

  assert.ok(css.includes('ADMIN_DIALOG_STACK_FIX_STAGE87C'));
  assert.ok(css.includes('z-index: 2147483000'));
  assert.ok(css.includes('z-index: 2147483001'));
  assert.ok(css.includes('z-index: 2147483002'));
  assert.ok(css.includes('isolation: isolate'));
  assert.ok(css.includes('padding: 72px 20px 20px'));
});
