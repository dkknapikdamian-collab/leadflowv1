const fs = require('fs');
const assert = require('assert');

const modal = fs.readFileSync('src/components/detail/MissingItemQuickActionModal.tsx', 'utf8');
const css = fs.readFileSync('src/styles/stage232a-missing-item-visual-source.css', 'utf8');
const leadForm = fs.readFileSync('src/styles/visual-stage20-lead-form-vnext.css', 'utf8');

function must(source, token, label) {
  assert.ok(source.includes(token), label + ' missing: ' + token);
}

must(modal, "import '../../styles/visual-stage20-lead-form-vnext.css';", 'modal imports lead-form-vnext source');
must(modal, "import '../../styles/stage232a-missing-item-visual-source.css';", 'modal imports missing override');
must(modal, 'data-stage232a-r10-missing-modal-visual-source="quick-lead-form"', 'quick lead visual data source marker');
must(modal, 'STAGE232A_R11_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_REPAIR', 'R11 component marker');
must(modal, 'STAGE232A_R11_R1_MISSING_MODAL_CONST_ANCHOR_FIX', 'R11-R1 robust anchor marker');
assert.ok(!modal.includes('dark modal surface'), 'component const must not describe dark modal surface');

must(leadForm, 'background: rgba(255, 255, 255, 0.96) !important;', 'lead-form light card source');
must(leadForm, 'background: #f9fafb;', 'lead-form light form source');
must(leadForm, 'background: #ffffff;', 'lead-form white section source');
must(leadForm, 'color: #111827', 'lead-form dark readable text source');

must(css, 'STAGE232A_R11_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_REPAIR', 'R11 CSS marker');
must(css, 'STAGE232A_R11_R1_MISSING_MODAL_CONST_ANCHOR_FIX', 'R11-R1 CSS marker');
must(css, 'background: rgba(255, 255, 255, 0.96) !important;', 'modal light card surface');
must(css, 'background: #f9fafb !important;', 'modal light form surface');
must(css, 'background: #ffffff !important;', 'modal white field/section surface');
must(css, 'color: #475467 !important;', 'modal label source color');
must(css, 'color: #667085 !important;', 'modal helper source color');
must(css, 'font-family: inherit !important;', 'modal font inheritance');
must(css, 'border-radius: 28px !important;', 'modal card source radius');
must(css, 'border-radius: 18px !important;', 'modal field source radius');
must(css, 'background: rgba(255, 255, 255, 0.94) !important;', 'modal footer source background');

assert.ok(!/background:\\s*#0f172a\\s*!important/i.test(css), 'modal CSS must not force dark #0f172a background');
assert.ok(!/background:\\s*#111827\\s*!important/i.test(css), 'modal CSS must not force dark #111827 background');
assert.ok(!/dark modal shell/i.test(css), 'modal CSS must not describe dark modal shell');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232A_R11_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_REPAIR',
  guard: 'check-stage232a-r11-missing-modal-quick-lead-visual-source',
  patcherCompatibility: 'R1 robust const anchor'
}, null, 2));
