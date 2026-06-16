const fs = require('fs');
const assert = require('assert');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const modal = fs.readFileSync('src/components/detail/MissingItemQuickActionModal.tsx', 'utf8');
const leadCss = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
const modalCss = fs.readFileSync('src/styles/stage232a-missing-item-visual-source.css', 'utf8');

function must(source, token, label) {
  assert.ok(source.includes(token), label + ' missing: ' + token);
}

must(lead, 'STAGE232A_R10_LEAD_DETAIL_VISUAL_SOURCE_TRUTH', 'LeadDetail R10 marker');
must(leadCss, 'STAGE232A_R10_LEAD_DETAIL_VISUAL_SOURCE_TRUTH', 'LeadDetail CSS R10 marker');
must(leadCss, '.lead-detail-callout-blue', 'top blue tone');
must(leadCss, '.lead-detail-callout-green', 'top green tone');
must(leadCss, '.lead-detail-callout-amber', 'top amber tone');
must(leadCss, '.lead-detail-callout-red', 'top red tone');
must(leadCss, '#eff6ff', 'blue background matches action group');
must(leadCss, '#ecfdf3', 'green background matches action group');
must(leadCss, '#fffaeb', 'amber background matches action group');
must(leadCss, '#fef2f2', 'red background for blocker card');
must(leadCss, '.lead-detail-inline-action:hover', 'top card action hover uses shared tone');

must(modal, 'STAGE232A_R10_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_TRUTH', 'Missing modal R10 marker');
must(modal, 'data-stage232a-r10-missing-modal-visual-source="quick-lead-form"', 'Missing modal visual source attr');
must(modal, 'data-stage232a-r10-missing-modal-card="true"', 'Missing modal card attr');
must(modal, 'lead-form-vnext-content', 'Missing modal still uses lead-form content source');
must(modal, 'lead-form-vnext-header', 'Missing modal still uses lead-form header source');
must(modal, 'lead-form-vnext', 'Missing modal still uses lead-form body source');

must(modalCss, 'STAGE232A_R10_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_TRUTH', 'Missing modal CSS R10 marker');
must(modalCss, 'background: #0f172a', 'Missing modal dark shell');
must(modalCss, 'background: #111827', 'Missing modal dark section');
must(modalCss, 'background: #ffffff !important', 'Missing modal white input surface');
must(modalCss, '.missing-item-modal-primary-action', 'Missing modal primary action style');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232A_R10_LEAD_DETAIL_VISUAL_SOURCE_TRUTH',
  guard: 'check-stage232a-r10-lead-detail-visual-source-truth'
}, null, 2));
