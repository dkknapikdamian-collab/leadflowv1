const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const modal = fs.readFileSync(path.join(repo, 'src/components/detail/MissingItemQuickActionModal.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repo, 'src/styles/stage232a-missing-item-visual-source.css'), 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(modal.includes('STAGE232A_R5_MISSING_ITEM_MODAL_VISUAL_SOURCE_TRUTH'), 'Missing R5 visual source marker.');
assert(modal.includes("../../styles/visual-stage20-lead-form-vnext.css"), 'Missing import of lead-form-vnext visual source CSS.');
assert(modal.includes("../../styles/stage232a-missing-item-visual-source.css"), 'Missing R5 missing-item visual bridge CSS import.');
assert(modal.includes('data-stage232a-missing-visual-source="lead-form-vnext"'), 'Missing visual source data marker.');
assert(modal.includes('missing-item-modal-card lead-form-vnext-content'), 'Modal card must reuse lead-form-vnext-content.');
assert(modal.includes('missing-item-modal-header lead-form-vnext-header'), 'Modal header must reuse lead-form-vnext-header.');
assert(modal.includes('missing-item-modal-form lead-form-vnext'), 'Modal form must reuse lead-form-vnext.');
assert(modal.includes('lead-form-section lead-form-primary-section'), 'Modal body must reuse lead-form-section.');
assert(modal.includes('lead-form-grid'), 'Modal fields must use lead-form-grid.');
assert(modal.includes('lead-form-field-wide'), 'Modal title/note/block scope fields must use lead-form-field-wide.');
assert(modal.includes('lead-form-select'), 'Modal kind select must reuse lead-form-select.');
assert(modal.includes('lead-form-checkbox'), 'Modal blocker checkbox must reuse lead-form-checkbox.');
assert(modal.includes('lead-form-textarea'), 'Modal note textarea must reuse lead-form-textarea.');
assert(modal.includes('missing-item-modal-actions lead-form-footer'), 'Modal actions must reuse lead-form-footer.');
assert(!modal.includes('chec kupić siedliska'), 'Modal must not contain accidental/debug user-specific text.');
assert(css.includes('STAGE232A_R5_MISSING_ITEM_MODAL_VISUAL_SOURCE_TRUTH'), 'R5 CSS marker missing.');
assert(css.includes('.missing-item-modal-backdrop'), 'Missing backdrop CSS.');

console.log(JSON.stringify({ ok: true, stage: 'STAGE232A_R5_MISSING_ITEM_MODAL_VISUAL_SOURCE_TRUTH', contract: 'MissingItemQuickActionModal uses quick lead form visual source classes and has no low-contrast standalone modal shell.' }, null, 2));
