const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');

test('Stage87B admin dialogs open lower and are draggable by header', () => {
  const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
  const css = read('src/styles/admin-tools.css');

  assert.ok(toolbar.includes('ADMIN_DIALOG_DRAG_LOWER_STAGE87B'));
  assert.ok(toolbar.includes('AdminDialogDragState'));
  assert.ok(toolbar.includes('startDialogDrag'));
  assert.ok(toolbar.includes('pointermove'));
  assert.ok(toolbar.includes('pointerup'));
  assert.ok(toolbar.includes("style={getDialogDragStyle('bug')}"));
  assert.ok(toolbar.includes("style={getDialogDragStyle('target')}"));
  assert.ok(toolbar.includes('data-admin-dialog-draggable-stage87b="true"'));
  assert.ok(toolbar.includes('admin-tool-dialog-drag-handle'));

  assert.ok(css.includes('align-items: flex-start'));
  assert.ok(css.includes('padding: 96px 20px 20px'));
  assert.ok(css.includes('max-height: calc(100vh - 128px)'));
  assert.ok(css.includes('.admin-tool-dialog-drag-handle'));
});

test('Stage87B drag does not start from form controls or close buttons', () => {
  const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
  assert.ok(toolbar.includes("closest('button, input, textarea, select, a')"));
});
