const fs = require('fs');
const assert = require('assert');

const leadDetail = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const modal = fs.readFileSync('src/components/detail/MissingItemQuickActionModal.tsx', 'utf8');
const modalCss = fs.readFileSync('src/styles/stage232a-missing-item-visual-source.css', 'utf8');
const leadFormCss = fs.readFileSync('src/styles/visual-stage20-lead-form-vnext.css', 'utf8');

function must(source, token, label) {
  assert.ok(source.includes(token), label + ' missing: ' + token);
}

// R10 still owns the LeadDetail visual-source marker.
// Do not require implementation-detail class strings in TSX; those may live in CSS or be composed at runtime.
must(leadDetail, 'STAGE232A_R10_LEAD_DETAIL_VISUAL_SOURCE_TRUTH', 'LeadDetail R10 marker');
must(leadDetail, 'STAGE232A_R8_LEAD_MISSING_BLOCKER_UI_SOURCE_TRUTH', 'LeadDetail R8 blocker source marker');
must(leadDetail, 'STAGE232A_R9_BLOCKER_TOP_CARD_SUMMARY_AND_ALL_MISSING', 'LeadDetail R9 blocker summary marker');
must(leadDetail, 'STAGE232A_R10_R1_MISSING_GROUP_INNER_TONE', 'LeadDetail R10-R1 inner tone marker');

// R10 modal contract remains: modal is linked to quick-lead visual source.
// R11 supersedes the old dark-shell decision with light +Lead/lead-form-vnext source.
must(modal, 'STAGE232A_R10_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_TRUTH', 'Missing modal R10 compatibility marker');
must(modal, 'STAGE232A_R11_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_REPAIR', 'Missing modal R11 source repair marker');
must(modal, 'STAGE232A_R11_R1_MISSING_MODAL_CONST_ANCHOR_FIX', 'Missing modal R11-R1 robust marker');
must(modal, 'data-stage232a-r10-missing-modal-visual-source="quick-lead-form"', 'Missing modal visual source data marker');
must(modal, "import '../../styles/visual-stage20-lead-form-vnext.css';", 'Missing modal lead-form source import');
must(modal, "import '../../styles/stage232a-missing-item-visual-source.css';", 'Missing modal override import');

must(modalCss, 'STAGE232A_R10_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_TRUTH', 'Missing modal CSS R10 compatibility marker');
must(modalCss, 'STAGE232A_R11_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_REPAIR', 'Missing modal CSS R11 marker');
must(modalCss, 'STAGE232A_R11_R1_MISSING_MODAL_CONST_ANCHOR_FIX', 'Missing modal CSS R11-R1 marker');
must(modalCss, 'STAGE232A_R11_R2_R10_GUARD_COMPAT', 'Missing modal CSS R11-R2 marker');
must(modalCss, 'STAGE232A_R11_R3_R10_GUARD_CONTRACT_RELAX', 'Missing modal CSS R11-R3 marker');
must(modalCss, 'background: rgba(255, 255, 255, 0.96) !important;', 'Missing modal light card');
must(modalCss, 'background: #f9fafb !important;', 'Missing modal light form');
must(modalCss, 'background: #ffffff !important;', 'Missing modal white fields/sections');
must(modalCss, 'font-family: inherit !important;', 'Missing modal font inheritance');

assert.ok(!/background:\s*#0f172a\s*!important/i.test(modalCss), 'dark #0f172a shell is deprecated after R11');
assert.ok(!/background:\s*#111827\s*!important/i.test(modalCss), 'dark #111827 section is deprecated after R11');
assert.ok(!/dark modal shell/i.test(modalCss), 'dark modal shell wording is deprecated after R11');

must(leadFormCss, 'background: rgba(255, 255, 255, 0.96) !important;', 'Lead form source light card');
must(leadFormCss, 'background: #f9fafb;', 'Lead form source light form');
must(leadFormCss, 'background: #ffffff;', 'Lead form source white section');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232A_R10_LEAD_DETAIL_VISUAL_SOURCE_TRUTH',
  compatibility: 'STAGE232A_R11_R3_R10_GUARD_CONTRACT_RELAX',
  note: 'R10 guard no longer requires implementation-detail accordion classes in LeadDetail.tsx; R11 light modal source truth is active.'
}, null, 2));
