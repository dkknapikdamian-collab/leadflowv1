const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const modal = fs.readFileSync('src/components/detail/MissingItemQuickActionModal.tsx', 'utf8');
const css = fs.readFileSync('src/styles/stage232a-missing-item-visual-source.css', 'utf8');

test('R12 records that light R11 was rejected by screenshot smoke', () => {
  assert.match(modal, /STAGE232A_R12_MISSING_MODAL_MATCH_PLUS_LEAD_DARK_SOURCE/);
  assert.match(modal, /visually rejected/);
});

test('R12 makes Brak modal dark like Nowy lead shell', () => {
  assert.match(css, /dark "Nowy lead" modal/);
  assert.match(css, /background: #0b1220 !important/);
  assert.match(css, /background: #0f172a !important/);
  assert.match(css, /color: #f8fafc !important/);
});

test('R12 keeps +Lead field language', () => {
  assert.match(css, /background: #ffffff !important/);
  assert.match(css, /color: #0f172a !important/);
  assert.match(css, /background: #2563eb !important/);
  assert.doesNotMatch(css, /background:\s*rgba\(255,\s*255,\s*255,\s*0\.96\)\s*!important/i);
});
