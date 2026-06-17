const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const modal = fs.readFileSync('src/components/detail/MissingItemQuickActionModal.tsx', 'utf8');
const css = fs.readFileSync('src/styles/stage232a-missing-item-visual-source.css', 'utf8');
test('R11 remains only compatibility marker and R12 is active', () => {
  assert.match(modal, /STAGE232A_R11_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_REPAIR/);
  assert.match(modal, /STAGE232A_R12_MISSING_MODAL_MATCH_PLUS_LEAD_DARK_SOURCE/);
});
test('R12 dark modal source is active for R11 compatibility', () => {
  assert.match(css, /background: #0b1220 !important/);
  assert.match(css, /background: #0f172a !important/);
  assert.match(css, /background: #ffffff !important/);
  assert.doesNotMatch(css, /background:\s*rgba\(255,\s*255,\s*255,\s*0\.96\)\s*!important/i);
});
test('R12 keeps blue save CTA', () => {
  assert.match(css, /background: #2563eb !important/);
});
