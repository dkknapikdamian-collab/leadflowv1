const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const src = fs.readFileSync(path.join(root, 'src/components/detail/MissingItemsManagerDialog.tsx'), 'utf8');
const shellPath = path.join(root, 'src/components/ui/CloseFlowDialogShell.tsx');
const shell = fs.existsSync(shellPath) ? fs.readFileSync(shellPath, 'utf8') : '';

test('dialog uses application dark modal style and remains readable', () => {
  assert.match(src, /STAGE232I4_R10_MISSING_MANAGER_READABLE_LAYOUT/);
  assert.match(src, /data-stage232i4-r10-readable-layout="true"/);
  if (shell) {
    assert.match(src, /CloseFlowDialogShell/);
    assert.match(shell, /data-closeflow-dialog-shell="true"/);
    assert.match(shell, /max-w-3xl/);
  } else {
    assert.match(src, /max-w-3xl/);
  }
  assert.match(src + shell, /bg-slate-950/);
  assert.match(src + shell, /rounded-2xl/);
});

test('rows are separated cards with scrollable list for many missing items', () => {
  assert.match(src, /data-stage232i4-r10-manager-list="separated-scrollable-cards"/);
  assert.match(src, /data-stage232i4-r10-manager-row="separated-card"/);
  assert.match(src, /max-h-\[46vh\]/);
  assert.match(src, /overflow-y-auto/);
});

test('row actions have their own separated action row and do not crowd title', () => {
  assert.match(src, /data-stage232i4-r10-manager-row-actions="separated-flex-wrap-gap"/);
  assert.match(src, /data-missing-item-title-block="true"/);
  assert.match(src, /data-missing-item-actions-row="true"/);
  const titleIndex = src.indexOf('data-missing-item-title-block="true"');
  const actionsIndex = src.indexOf('data-missing-item-actions-row="true"');
  assert.ok(titleIndex > -1 && actionsIndex > titleIndex);
});

test('R10 preserves R14 manager contract and R9 blocker signal', () => {
  assert.match(src, /data-stage232i4-r14-manager-row-contract="title-checkbox-resolve-delete"/);
  assert.match(src, /priority === 'high'/);
  assert.match(src, /Blokuje sprawę/);
  assert.match(src, /Uzupełnione/);
  assert.match(src, /Usuń/);
});
