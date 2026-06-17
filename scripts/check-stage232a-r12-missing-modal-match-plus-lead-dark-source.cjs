const fs = require('fs');
const assert = require('assert');
const modal = fs.readFileSync('src/components/detail/MissingItemQuickActionModal.tsx', 'utf8');
const css = fs.readFileSync('src/styles/stage232a-missing-item-visual-source.css', 'utf8');
function must(src, token, label){ assert.ok(src.includes(token), label + ' missing: ' + token); }
must(modal, 'STAGE232A_R12_MISSING_MODAL_MATCH_PLUS_LEAD_DARK_SOURCE', 'component R12 marker');
must(modal, 'data-stage232a-r10-missing-modal-visual-source="quick-lead-form"', 'quick lead marker');
must(css, 'STAGE232A_R12_MISSING_MODAL_MATCH_PLUS_LEAD_DARK_SOURCE', 'CSS R12 marker');
must(css, 'dark "Nowy lead" modal', 'screenshot decision');
must(css, 'width: min(604px, calc(100vw - 28px)) !important;', 'compact +Lead width');
must(css, 'background: #0b1220 !important;', 'dark shell');
must(css, 'background: #0f172a !important;', 'dark section');
must(css, 'background: #ffffff !important;', 'white fields');
must(css, 'color: #f8fafc !important;', 'white text');
must(css, 'background: #2563eb !important;', 'blue primary CTA');
assert.ok(!/background:\s*rgba\(255,\s*255,\s*255,\s*0\.96\)\s*!important/i.test(css), 'R11 light shell must not return');
console.log(JSON.stringify({ ok: true, stage: 'STAGE232A_R12_MISSING_MODAL_MATCH_PLUS_LEAD_DARK_SOURCE' }, null, 2));
