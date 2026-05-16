const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');

test('Stage87F quick editor is portaled to body and draggable below topbar', () => {
  const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
  const css = read('src/styles/admin-tools.css');

  assert.ok(toolbar.includes('ADMIN_QUICK_EDITOR_PORTAL_DRAG_STAGE87F'));
  assert.ok(toolbar.includes("import { createPortal } from 'react-dom';"));
  assert.ok(toolbar.includes('createPortal(floatingAdminTools, document.body)'));
  assert.ok(toolbar.includes('startQuickEditorDrag'));
  assert.ok(toolbar.includes('quickEditorDragState'));
  assert.ok(toolbar.includes('pointermove'));
  assert.ok(toolbar.includes('pointerup'));
  assert.ok(toolbar.includes('Reset pozycji'));
  assert.ok(toolbar.includes('style={getQuickEditorStyle()}'));
  assert.ok(toolbar.includes("bottom: 'auto'"));

  assert.ok(css.includes('ADMIN_QUICK_EDITOR_PORTAL_DRAG_STAGE87F'));
  assert.ok(css.includes('top: 136px'));
  assert.ok(css.includes('bottom: auto'));
  assert.ok(css.includes('cursor: grab'));
});

test('Stage87F keeps click-to-annotate behavior intact', () => {
  const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');

  assert.ok(toolbar.includes('ADMIN_CLICK_TO_ANNOTATE_STAGE87D'));
  assert.ok(toolbar.includes("activeTool === 'bug'"));
  assert.ok(toolbar.includes("activeTool === 'copy'"));
  assert.ok(toolbar.includes('event.preventDefault()'));
  assert.ok(toolbar.includes('event.stopPropagation()'));
  assert.ok(toolbar.includes('saveOnEnter'));
  assert.ok(toolbar.includes('data-admin-debug-selected-stage87d'));
  assert.ok(toolbar.includes('data-admin-debug-saved-stage87d'));
});
