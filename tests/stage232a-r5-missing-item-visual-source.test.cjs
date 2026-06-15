const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const modal = fs.readFileSync(path.join(repo, 'src/components/detail/MissingItemQuickActionModal.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repo, 'src/styles/stage232a-missing-item-visual-source.css'), 'utf8');

test('MissingItem modal is wired to lead-form visual source of truth', () => {
  assert.match(modal, /visual-stage20-lead-form-vnext\.css/);
  assert.match(modal, /data-stage232a-missing-visual-source="lead-form-vnext"/);
  assert.match(modal, /lead-form-vnext-content/);
  assert.match(modal, /lead-form-vnext-header/);
  assert.match(modal, /lead-form-vnext/);
});

test('MissingItem modal fields reuse quick lead form field classes', () => {
  assert.match(modal, /lead-form-section lead-form-primary-section/);
  assert.match(modal, /lead-form-grid/);
  assert.match(modal, /lead-form-select/);
  assert.match(modal, /lead-form-checkbox/);
  assert.match(modal, /lead-form-textarea/);
  assert.match(modal, /lead-form-footer/);
});

test('MissingItem modal keeps STAGE232A Brak and Blokada data contract', () => {
  assert.match(modal, /missingKindValue/);
  assert.match(modal, /blocksProgressValue/);
  assert.match(modal, /blockScopeValue/);
  assert.match(modal, /data-stage232a-blocks-progress-field="true"/);
});

test('MissingItem modal visual bridge CSS exists and blocks raw standalone shell regression', () => {
  assert.match(css, /STAGE232A_R5_MISSING_ITEM_MODAL_VISUAL_SOURCE_TRUTH/);
  assert.match(css, /missing-item-modal-backdrop/);
  assert.match(css, /missing-item-modal-card\.lead-form-vnext-content/);
  assert.doesNotMatch(modal, /chec kupić siedliska/);
});
