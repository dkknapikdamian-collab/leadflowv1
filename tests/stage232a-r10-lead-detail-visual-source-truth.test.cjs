const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const leadDetail = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const modal = fs.readFileSync('src/components/detail/MissingItemQuickActionModal.tsx', 'utf8');
const css = fs.readFileSync('src/styles/stage232a-missing-item-visual-source.css', 'utf8');

test('STAGE232A R10 LeadDetail marker and blocker-source lineage remain present', () => {
  assert.match(leadDetail, /STAGE232A_R10_LEAD_DETAIL_VISUAL_SOURCE_TRUTH/);
  assert.match(leadDetail, /STAGE232A_R8_LEAD_MISSING_BLOCKER_UI_SOURCE_TRUTH/);
  assert.match(leadDetail, /STAGE232A_R9_BLOCKER_TOP_CARD_SUMMARY_AND_ALL_MISSING/);
  assert.match(leadDetail, /STAGE232A_R10_R1_MISSING_GROUP_INNER_TONE/);
});

test('STAGE232A R10 missing modal keeps quick-lead source marker and R11 compatibility', () => {
  assert.match(modal, /STAGE232A_R10_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_TRUTH/);
  assert.match(modal, /STAGE232A_R11_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_REPAIR/);
  assert.match(modal, /STAGE232A_R11_R1_MISSING_MODAL_CONST_ANCHOR_FIX/);
  assert.match(modal, /data-stage232a-r10-missing-modal-visual-source="quick-lead-form"/);
  assert.match(modal, /visual-stage20-lead-form-vnext\.css/);
  assert.match(modal, /stage232a-missing-item-visual-source\.css/);
});

test('STAGE232A R10/R11 missing modal CSS uses light +Lead shell, not deprecated dark shell', () => {
  assert.match(css, /STAGE232A_R10_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_TRUTH/);
  assert.match(css, /STAGE232A_R11_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_REPAIR/);
  assert.match(css, /STAGE232A_R11_R2_R10_GUARD_COMPAT/);
  assert.match(css, /STAGE232A_R11_R3_R10_GUARD_CONTRACT_RELAX/);
  assert.match(css, /background: rgba\(255, 255, 255, 0\.96\) !important/);
  assert.match(css, /background: #f9fafb !important/);
  assert.match(css, /background: #ffffff !important/);
  assert.match(css, /font-family: inherit !important/);
  assert.doesNotMatch(css, /background:\s*#0f172a\s*!important/i);
  assert.doesNotMatch(css, /background:\s*#111827\s*!important/i);
  assert.doesNotMatch(css, /dark modal shell/i);
});
