const fs = require('fs');
const assert = require('assert');

const css = fs.readFileSync('src/styles/stage232a-missing-item-visual-source.css', 'utf8');
const modal = fs.readFileSync('src/components/detail/MissingItemQuickActionModal.tsx', 'utf8');
const caseDetail = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');

function must(source, token, label) {
  assert.ok(source.includes(token), label + ' missing: ' + token);
}

must(modal, 'MissingItemQuickActionModal', 'modal component');
must(modal, 'stage232a-missing-item-visual-source.css', 'modal css import');
must(modal, 'id="missing-item-modal-title"', 'modal title id');
must(modal, 'data-stage232a-r10-missing-modal-card="true"', 'modal visual card marker');

must(css, 'STAGE232I1_R8_MISSING_MODAL_READABLE_VISUAL_SOURCE', 'R8 readable visual stage marker');
must(css, '#missing-item-modal-title', 'title readability selector');
must(css, '-webkit-text-fill-color: #f8fafc', 'title forced readable fill');
must(css, 'label > span:first-child', 'label readability selector');
must(css, '-webkit-text-fill-color: #e5edf8', 'label forced readable fill');
must(css, 'lead-form-checkbox small', 'checkbox helper selector');
must(css, '-webkit-text-fill-color: #cbd5e1', 'helper forced readable fill');
must(css, 'option {', 'select option readability');
must(caseDetail, 'data-stage232i1-case-missing-action="true"', 'CaseDetail add missing button still present');
must(caseDetail, 'data-context-action-kind="blocker"', 'CaseDetail blocker action still wired');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232I1_R8_MISSING_MODAL_READABLE_VISUAL_SOURCE',
  guard: 'check-stage232i1-r8-missing-modal-readable-style'
}, null, 2));
