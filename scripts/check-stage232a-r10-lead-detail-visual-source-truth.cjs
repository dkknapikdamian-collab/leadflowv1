const fs = require('fs');
const assert = require('assert');
const leadDetail = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const modal = fs.readFileSync('src/components/detail/MissingItemQuickActionModal.tsx', 'utf8');
const css = fs.readFileSync('src/styles/stage232a-missing-item-visual-source.css', 'utf8');
function must(src, token, label){ assert.ok(src.includes(token), label + ' missing: ' + token); }
must(leadDetail, 'STAGE232A_R10_LEAD_DETAIL_VISUAL_SOURCE_TRUTH', 'LeadDetail R10 marker');
must(leadDetail, 'STAGE232A_R8_LEAD_MISSING_BLOCKER_UI_SOURCE_TRUTH', 'LeadDetail R8 marker');
must(leadDetail, 'STAGE232A_R9_BLOCKER_TOP_CARD_SUMMARY_AND_ALL_MISSING', 'LeadDetail R9 marker');
must(leadDetail, 'STAGE232A_R10_R1_MISSING_GROUP_INNER_TONE', 'LeadDetail R10-R1 marker');
must(modal, 'STAGE232A_R10_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_TRUTH', 'modal R10 marker');
must(modal, 'STAGE232A_R12_MISSING_MODAL_MATCH_PLUS_LEAD_DARK_SOURCE', 'modal R12 marker');
must(css, 'STAGE232A_R12_MISSING_MODAL_MATCH_PLUS_LEAD_DARK_SOURCE', 'CSS R12 marker');
must(css, 'background: #0b1220 !important;', 'R12 dark shell');
must(css, 'background: #0f172a !important;', 'R12 dark section');
must(css, 'background: #ffffff !important;', 'R12 white fields');
assert.ok(!/background:\s*rgba\(255,\s*255,\s*255,\s*0\.96\)\s*!important/i.test(css), 'rejected R11 light card must not return');
console.log(JSON.stringify({ ok: true, stage: 'STAGE232A_R10_LEAD_DETAIL_VISUAL_SOURCE_TRUTH', compatibility: 'STAGE232A_R12_MISSING_MODAL_MATCH_PLUS_LEAD_DARK_SOURCE' }, null, 2));
