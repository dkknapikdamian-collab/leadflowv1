const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const modal = fs.readFileSync('src/components/detail/MissingItemQuickActionModal.tsx', 'utf8');
const css = fs.readFileSync('src/styles/stage232a-missing-item-visual-source.css', 'utf8');

test('STAGE232A R11 keeps Brak modal connected to quick-lead visual source markers', () => {
  assert.match(modal, /visual-stage20-lead-form-vnext\.css/);
  assert.match(modal, /stage232a-missing-item-visual-source\.css/);
  assert.match(modal, /data-stage232a-r10-missing-modal-visual-source="quick-lead-form"/);
  assert.match(modal, /STAGE232A_R11_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_REPAIR/);
  assert.match(modal, /STAGE232A_R11_R1_MISSING_MODAL_CONST_ANCHOR_FIX/);
});

test('STAGE232A R11 removes dark shell overrides from missing item modal', () => {
  assert.doesNotMatch(css, /background:\s*#0f172a\s*!important/i);
  assert.doesNotMatch(css, /background:\s*#111827\s*!important/i);
  assert.doesNotMatch(css, /dark modal shell/i);
});

test('STAGE232A R11 mirrors +Lead light form visual tokens', () => {
  assert.match(css, /background: rgba\(255, 255, 255, 0\.96\) !important/);
  assert.match(css, /background: #f9fafb !important/);
  assert.match(css, /background: #ffffff !important/);
  assert.match(css, /color: #475467 !important/);
  assert.match(css, /color: #667085 !important/);
  assert.match(css, /font-family: inherit !important/);
  assert.match(css, /border-radius: 28px !important/);
  assert.match(css, /border-radius: 18px !important/);
});
