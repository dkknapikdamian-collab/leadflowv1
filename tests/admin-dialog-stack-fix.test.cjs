const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');

test('Stage87C compatibility accepts Stage87D high-z quick editor replacement', () => {
  const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
  const css = read('src/styles/admin-tools.css');

  if (toolbar.includes('ADMIN_CLICK_TO_ANNOTATE_STAGE87D')) {
    assert.ok(toolbar.includes('admin-tool-quick-editor'));
    assert.ok(css.includes('z-index: 2147483006'));
    assert.ok(css.includes('.admin-tool-save-toast'));
  } else {
    assert.ok(toolbar.includes('ADMIN_DIALOG_STACK_FIX_STAGE87C'));
    assert.ok(css.includes('ADMIN_DIALOG_STACK_FIX_STAGE87C'));
  }
});
