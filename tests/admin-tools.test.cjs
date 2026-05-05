const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');

test('Admin Debug Toolbar is gated to admin or app owner in Layout', () => {
  const layout = read('src/components/Layout.tsx');
  assert.ok(layout.includes('isAppOwner'));
  assert.ok(layout.includes('const canUseAdminDebugToolbar = Boolean(isAdmin || isAppOwner);'));
  assert.ok(layout.includes('{canUseAdminDebugToolbar ? <AdminDebugToolbar currentSection={currentSection} /> : null}'));
});

test('Admin tools V1 is local-only and ignores its own toolbar', () => {
  const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
  const targeting = read('src/components/admin-tools/dom-targeting.ts');
  const storage = read('src/components/admin-tools/admin-tools-storage.ts');

  assert.ok(toolbar.includes('data-admin-tool-ui="true"'));
  assert.ok(targeting.includes('[data-admin-tool-ui="true"]'));
  assert.ok(storage.includes('window.localStorage'));
  assert.equal(toolbar.includes('fetch('), false);
  assert.equal(storage.includes('fetch('), false);
  assert.equal(toolbar.includes('supabase'), false);
});

test('Review collect prevents normal click and uses composedPath targeting', () => {
  const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
  const targeting = read('src/components/admin-tools/dom-targeting.ts');

  assert.ok(toolbar.includes('event.preventDefault()'));
  assert.ok(toolbar.includes('event.stopPropagation()'));
  assert.ok(toolbar.includes('pickAdminTargetCandidate'));
  assert.ok(targeting.includes('event.composedPath'));
});

test('Button Matrix, Bug, Copy and Export contracts exist', () => {
  const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
  const exportFile = read('src/components/admin-tools/admin-tools-export.ts');
  const types = read('src/components/admin-tools/admin-tools-types.ts');

  assert.ok(toolbar.includes('scanButtons'));
  assert.ok(toolbar.includes('Bug Note Recorder'));
  assert.ok(toolbar.includes('Copy Review'));
  assert.ok(exportFile.includes('closeflow_admin_feedback_'));
  assert.ok(types.includes('button_matrix_item'));
  assert.ok(types.includes('copy_review'));
  assert.ok(types.includes('bug_note'));
});

test('Read-first Stripe sandbox TODO is impossible to miss', () => {
  const todo = read('00_READ_FIRST_STRIPE_SANDBOX_NAME_TODO.md');
  assert.ok(todo.includes('Bezrobotny sandbox'));
  assert.ok(todo.includes('CloseFlow Sandbox'));
});
