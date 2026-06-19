#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = process.cwd();
const componentPath = path.join(root, 'src/components/detail/MissingItemsManagerDialog.tsx');
const shellPath = path.join(root, 'src/components/ui/CloseFlowDialogShell.tsx');
const src = fs.readFileSync(componentPath, 'utf8');
const shell = fs.existsSync(shellPath) ? fs.readFileSync(shellPath, 'utf8') : '';

assert.match(src, /STAGE232I4_R10_MISSING_MANAGER_READABLE_LAYOUT/);
assert.match(src, /data-stage232i4-r10-readable-layout="true"/);
assert.match(src, /data-stage232i4-r10-manager-add-form="true"/);
assert.match(src, /data-stage232i4-r10-manager-list="separated-scrollable-cards"/);
assert.match(src, /data-stage232i4-r10-manager-row="separated-card"/);
assert.match(src, /data-stage232i4-r10-manager-row-actions="separated-flex-wrap-gap"/);
assert.match(src, /max-h-\[46vh\]/);

if (shell) {
  assert.match(src, /CloseFlowDialogShell/);
  assert.match(shell, /data-closeflow-dialog-shell="true"/);
  assert.match(shell, /max-w-3xl/);
  assert.match(shell, /bg-slate-950/);
  assert.match(shell, /rounded-2xl/);
} else {
  assert.match(src, /max-w-3xl/);
  assert.match(src, /bg-slate-950/);
}

assert.match(src, /Nazwa braku/);
assert.match(src, /Blokuje sprawę/);
assert.match(src, /priority === 'high'/);
assert.match(src, /Uzupełnione/);
assert.match(src, /Usuń/);

console.log('STAGE232I4_R10 missing manager readable layout guard PASS');
