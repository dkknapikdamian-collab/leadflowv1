const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');

test('Stage87B compatibility accepts Stage87D quick editor replacement', () => {
  const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
  const css = read('src/styles/admin-tools.css');

  if (toolbar.includes('ADMIN_CLICK_TO_ANNOTATE_STAGE87D')) {
    assert.ok(toolbar.includes('admin-tool-quick-editor'));
    assert.ok(css.includes('.admin-tool-quick-editor'));
    assert.ok(css.includes('bottom: 24px'));
  } else {
    assert.ok(toolbar.includes('ADMIN_DIALOG_DRAG_LOWER_STAGE87B'));
    assert.ok(toolbar.includes('startDialogDrag'));
  }
});