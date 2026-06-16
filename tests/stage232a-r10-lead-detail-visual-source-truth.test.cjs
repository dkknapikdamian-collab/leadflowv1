const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const modal = fs.readFileSync('src/components/detail/MissingItemQuickActionModal.tsx', 'utf8');
const leadCss = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
const modalCss = fs.readFileSync('src/styles/stage232a-missing-item-visual-source.css', 'utf8');

test('STAGE232A R10 top decision cards expose action-group tone palette', () => {
  assert.match(lead, /STAGE232A_R10_LEAD_DETAIL_VISUAL_SOURCE_TRUTH/);
  assert.match(leadCss, /lead-detail-callout-blue[\s\S]*#eff6ff/);
  assert.match(leadCss, /lead-detail-callout-green[\s\S]*#ecfdf3/);
  assert.match(leadCss, /lead-detail-callout-amber[\s\S]*#fffaeb/);
  assert.match(leadCss, /lead-detail-callout-red[\s\S]*#fef2f2/);
});

test('STAGE232A R10 missing modal remains on lead-form visual source with explicit R10 data markers', () => {
  assert.match(modal, /STAGE232A_R10_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_TRUTH/);
  assert.match(modal, /data-stage232a-r10-missing-modal-visual-source="quick-lead-form"/);
  assert.match(modal, /data-stage232a-r10-missing-modal-card="true"/);
  assert.match(modal, /lead-form-vnext-content/);
  assert.match(modal, /lead-form-vnext-header/);
  assert.match(modal, /className="missing-item-modal-form lead-form-vnext"/);
});

test('STAGE232A R10 missing modal CSS uses dark quick-lead shell and white fields', () => {
  assert.match(modalCss, /STAGE232A_R10_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_TRUTH/);
  assert.match(modalCss, /background: #0f172a/);
  assert.match(modalCss, /background: #111827/);
  assert.match(modalCss, /background: #ffffff !important/);
  assert.match(modalCss, /missing-item-modal-primary-action/);
});
