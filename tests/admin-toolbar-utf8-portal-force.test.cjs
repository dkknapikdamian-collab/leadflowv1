const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');

test('Stage87G keeps toolbar UTF-8 Polish text and Button Matrix labels intact', () => {
  const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');

  assert.ok(toolbar.includes('ADMIN_TOOLBAR_UTF8_PORTAL_FORCE_STAGE87G'));
  assert.ok(toolbar.includes('Nie działa'));
  assert.ok(toolbar.includes('Przenieść'));
  assert.ok(toolbar.includes('Zły tekst'));
  assert.ok(toolbar.includes('Możesz kliknąć kolejny element.'));

  for (const marker of ['Ĺ', 'Ä', 'Ľ', 'Â·', 'Ă']) {
    assert.equal(toolbar.includes(marker), false, 'mojibake marker present: ' + marker);
  }
});

test('Stage87G quick editor is body-portaled and draggable', () => {
  const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
  const css = read('src/styles/admin-tools.css');

  assert.ok(toolbar.includes('createPortal(floatingAdminTools, document.body)'));
  assert.ok(toolbar.includes('startQuickEditorDrag'));
  assert.ok(toolbar.includes('Reset pozycji'));
  assert.ok(toolbar.includes("bottom: 'auto'"));
  assert.ok(css.includes('top: 136px'));
  assert.ok(css.includes('bottom: auto'));
});
