const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const css = fs.readFileSync('src/styles/stage232a-missing-item-visual-source.css', 'utf8');
const modal = fs.readFileSync('src/components/detail/MissingItemQuickActionModal.tsx', 'utf8');

test('R8 keeps missing modal on the shared visual source', () => {
  assert.match(modal, /stage232a-missing-item-visual-source\.css/);
  assert.match(modal, /data-stage232a-r10-missing-modal-card="true"/);
  assert.match(css, /STAGE232I1_R8_MISSING_MODAL_READABLE_VISUAL_SOURCE/);
});

test('R8 forces readable title and labels on dark shell', () => {
  assert.match(css, /#missing-item-modal-title/);
  assert.match(css, /-webkit-text-fill-color: #f8fafc/);
  assert.match(css, /label > span:first-child/);
  assert.match(css, /-webkit-text-fill-color: #e5edf8/);
  assert.match(css, /lead-form-checkbox small/);
  assert.match(css, /-webkit-text-fill-color: #cbd5e1/);
});

test('R8 keeps white field text dark and readable', () => {
  assert.match(css, /input:not\(\[type="checkbox"\]\)/);
  assert.match(css, /background: #ffffff !important/);
  assert.match(css, /-webkit-text-fill-color: #0f172a/);
  assert.match(css, /option \{/);
});
