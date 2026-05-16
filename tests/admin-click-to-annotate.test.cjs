const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');

test('Stage87D Bug and Copy are element-picking modes, not immediate modals', () => {
  const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');

  assert.ok(toolbar.includes('ADMIN_CLICK_TO_ANNOTATE_STAGE87D'));
  assert.ok(toolbar.includes("activeTool === 'bug'"));
  assert.ok(toolbar.includes("activeTool === 'copy'"));
  assert.equal(toolbar.includes('setBugOpen(true)'), false);
  assert.equal(toolbar.includes('const [bugOpen'), false);
  assert.ok(toolbar.includes('pickAdminTargetCandidate'));
  assert.ok(toolbar.includes('event.preventDefault()'));
  assert.ok(toolbar.includes('event.stopPropagation()'));
});

test('Stage87D quick editor saves with Enter and marks selected/saved elements', () => {
  const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
  const css = read('src/styles/admin-tools.css');

  assert.ok(toolbar.includes('saveOnEnter'));
  assert.ok(toolbar.includes("event.key !== 'Enter'"));
  assert.ok(toolbar.includes('Zapisano:'));
  assert.ok(toolbar.includes('data-admin-debug-selected-stage87d'));
  assert.ok(toolbar.includes('data-admin-debug-saved-stage87d'));
  assert.ok(toolbar.includes('admin-tool-quick-editor'));

  assert.ok(css.includes('.admin-tool-quick-editor'));
  assert.ok(css.includes('[data-admin-debug-selected-stage87d="true"]'));
  assert.ok(css.includes('[data-admin-debug-saved-stage87d="true"]'));
});
