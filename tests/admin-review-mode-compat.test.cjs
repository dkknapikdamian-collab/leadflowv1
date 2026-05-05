const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');

test('Stage87E review guard accepts Stage87D quick editor semantics', () => {
  const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
  const guard = read('scripts/check-admin-review-mode.cjs');

  assert.ok(toolbar.includes('ADMIN_CLICK_TO_ANNOTATE_STAGE87D'));
  assert.ok(toolbar.includes('WiÄ™kszy cel'));
  assert.ok(toolbar.includes('Mniejszy cel'));
  assert.ok(toolbar.includes('Uwaga *'));
  assert.ok(toolbar.includes('saveOnEnter'));
  assert.ok(guard.includes('ADMIN_REVIEW_MODE_STAGE87D_COMPAT'));
  assert.ok(guard.includes('Stage87D quick editor must support bigger/smaller target selection'));
});

test('Stage87E keeps AdminDebugToolbar Polish text free from common mojibake markers', () => {
  const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
  assert.equal(/[ÄąĂ„Ä˝]/.test(toolbar), false);
});
