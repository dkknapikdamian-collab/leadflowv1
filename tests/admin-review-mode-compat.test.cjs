const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');

test('Stage89B review guard accepts UTF-8 Stage87D quick editor semantics', () => {
  const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
  const guard = read('scripts/check-admin-review-mode.cjs');

  assert.ok(toolbar.includes('ADMIN_CLICK_TO_ANNOTATE_STAGE87D'));
  assert.ok(toolbar.includes('ADMIN_TOOLBAR_UTF8_PORTAL_FORCE_STAGE87G'));
  assert.ok(toolbar.includes('Wi\u0119kszy cel'));
  assert.ok(toolbar.includes('Mniejszy cel'));
  assert.ok(toolbar.includes('Uwaga *'));
  assert.ok(toolbar.includes('saveOnEnter'));
  assert.ok(guard.includes('ADMIN_REVIEW_MODE_UTF8_COMPAT_STAGE89B'));
  assert.ok(guard.includes('native-action'));
  assert.ok(guard.includes('interactive-role'));
  assert.ok(guard.includes('ADMIN_TARGET_PRECISION_STAGE88'));
});

test('Stage89B keeps AdminDebugToolbar Polish text free from common mojibake markers', () => {
  const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
  assert.equal(/[\u0139\u00c4\u0102\u00c2]/.test(toolbar), false);
});
