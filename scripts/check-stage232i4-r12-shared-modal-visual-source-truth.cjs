#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));

const managerPath = 'src/components/detail/MissingItemsManagerDialog.tsx';
const shellPath = 'src/components/ui/CloseFlowDialogShell.tsx';

assert(exists(managerPath), `Missing file: ${managerPath}`);
assert(exists(shellPath), `Missing file: ${shellPath}`);

const manager = read(managerPath);
const shell = read(shellPath);

assert.match(shell, /STAGE232I4_R12_SHARED_MODAL_VISUAL_SOURCE_TRUTH/);
assert.match(shell, /data-closeflow-dialog-shell="true"/);
assert.match(shell, /data-closeflow-dialog-header="true"/);
assert.match(shell, /data-closeflow-dialog-body="true"/);
assert.match(shell, /data-closeflow-dialog-footer="true"/);
assert.match(shell, /rounded-2xl/);
assert.match(shell, /bg-slate-950/);
assert.match(shell, /border-slate-700/);

assert.match(manager, /STAGE232I4_R12_SHARED_MODAL_VISUAL_SOURCE_TRUTH/);
assert.match(manager, /CloseFlowDialogShell/);
assert.match(manager, /CloseFlowDialogBody/);
assert.match(manager, /CloseFlowDialogSection/);
assert.match(manager, /data-stage232i4-r12-uses-shared-dialog-shell="true"/);
assert.match(manager, /data-stage232i4-r14-missing-manager-dialog/);
assert.match(manager, /data-stage232i4-r10-readable-layout="true"/);
assert.match(manager, /data-stage232i4-r11-row-layout="title-first-control-row"/);

assert.match(manager, /data-missing-item-card="true"/);
assert.match(manager, /data-missing-item-title-block="true"/);
assert.match(manager, /data-missing-item-blocker-row="true"/);
assert.match(manager, /data-missing-item-actions-row="true"/);
assert.match(manager, /data-stage232i4-r12-manager-item-title="primary-visible-name"/);
assert.match(manager, /data-stage232i4-r12-manager-control-row="blocker-left-actions-right"/);

const titleIndex = manager.indexOf('data-missing-item-title-block="true"');
const blockerIndex = manager.indexOf('data-missing-item-blocker-row="true"');
const actionsIndex = manager.indexOf('data-missing-item-actions-row="true"');
assert(titleIndex > -1, 'missing item title block marker missing');
assert(blockerIndex > titleIndex, 'blocker row must be below title block');
assert(actionsIndex > blockerIndex, 'actions row must follow blocker/title control row');

assert.match(manager, /managerItemTitle\(item\)/);
assert.match(manager, /payload\?\.missingItemTitle/);
assert.match(manager, /payload\?\.missing_item_title/);
assert.match(manager, /priority === 'high'/);
assert.match(manager, /Uzupełnione/);
assert.match(manager, /Usuń/);
assert.match(manager, /Blokuje sprawę/);

assert.doesNotMatch(manager, /data-stage232i4-r11-manager-row-grid="checkbox-title-actions"/);
assert.doesNotMatch(manager, /lg:grid-cols-\[140px_minmax\(0,1fr\)_auto\]/);
assert.doesNotMatch(manager, /data-stage232i4-r11-manager-actions-column="right-separated"/);
assert.doesNotMatch(manager, /DialogContent/);

const modalFiles = [
  'src/components/EventCreateDialog.tsx',
  'src/components/TaskCreateDialog.tsx',
  'src/components/ClientCreateDialog.tsx',
  'src/components/ContextActionDialogs.tsx',
  'src/components/ContextNoteDialog.tsx',
  managerPath,
].filter(exists);

assert(modalFiles.includes(managerPath), 'modal audit did not include MissingItemsManagerDialog');
console.log(`STAGE232I4_R12 shared modal visual source truth guard PASS (${modalFiles.length} modal files mapped)`);
