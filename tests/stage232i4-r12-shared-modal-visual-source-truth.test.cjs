const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = (file) => fs.readFileSync(path.join(process.cwd(), file), 'utf8');
const manager = () => read('src/components/detail/MissingItemsManagerDialog.tsx');
const shell = () => read('src/components/ui/CloseFlowDialogShell.tsx');

test('R12 creates a shared CloseFlow dialog visual source of truth', () => {
  const src = shell();
  assert.match(src, /STAGE232I4_R12_SHARED_MODAL_VISUAL_SOURCE_TRUTH/);
  assert.match(src, /data-closeflow-dialog-shell="true"/);
  assert.match(src, /data-closeflow-dialog-header="true"/);
  assert.match(src, /data-closeflow-dialog-body="true"/);
  assert.match(src, /data-closeflow-dialog-footer="true"/);
  assert.match(src, /bg-slate-950/);
  assert.match(src, /rounded-2xl/);
});

test('R12 missing manager uses shared shell rather than local DialogContent classes', () => {
  const src = manager();
  assert.match(src, /CloseFlowDialogShell/);
  assert.match(src, /CloseFlowDialogBody/);
  assert.match(src, /CloseFlowDialogSection/);
  assert.match(src, /data-stage232i4-r12-uses-shared-dialog-shell="true"/);
  assert.doesNotMatch(src, /import \{[^}]*DialogContent/);
});

test('R12 missing item card is title-first with controls below', () => {
  const src = manager();
  const titleIndex = src.indexOf('data-missing-item-title-block="true"');
  const blockerIndex = src.indexOf('data-missing-item-blocker-row="true"');
  const actionsIndex = src.indexOf('data-missing-item-actions-row="true"');
  assert.ok(titleIndex > -1, 'title block missing');
  assert.ok(blockerIndex > titleIndex, 'blocker controls should be below title');
  assert.ok(actionsIndex > blockerIndex, 'actions should be separated after blocker row');
  assert.match(src, /data-stage232i4-r12-manager-item-title="primary-visible-name"/);
  assert.match(src, /data-stage232i4-r12-manager-control-row="blocker-left-actions-right"/);
  assert.doesNotMatch(src, /lg:grid-cols-\[140px_minmax\(0,1fr\)_auto\]/);
});

test('R12 preserves existing missing manager functional contracts', () => {
  const src = manager();
  assert.match(src, /data-stage232i4-r14-manager-row-contract="title-checkbox-resolve-delete"/);
  assert.match(src, /data-stage232i4-r10-readable-layout="true"/);
  assert.match(src, /priority === 'high'/);
  assert.match(src, /data-stage232i4-r14-manager-row-checkbox="true"/);
  assert.match(src, /data-stage232i4-r14-manager-resolve-action="true"/);
  assert.match(src, /data-stage232i4-r14-manager-delete-action="true"/);
});
