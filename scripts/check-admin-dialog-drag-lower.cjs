#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const expect = (condition, message) => { if (!condition) fail.push(message); };

const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
const css = read('src/styles/admin-tools.css');
const pkg = JSON.parse(read('package.json'));

expect(toolbar.includes('ADMIN_DIALOG_DRAG_LOWER_STAGE87B'), 'toolbar must have Stage87B marker');
expect(toolbar.includes('AdminDialogDragState'), 'toolbar must define drag state');
expect(toolbar.includes('dialogPositions'), 'toolbar must store dialog positions');
expect(toolbar.includes('startDialogDrag'), 'toolbar must start drag');
expect(toolbar.includes('pointermove'), 'toolbar must listen to pointermove');
expect(toolbar.includes('pointerup'), 'toolbar must listen to pointerup');
expect(toolbar.includes('getDialogDragStyle'), 'toolbar must apply drag style');
expect(toolbar.includes("style={getDialogDragStyle('bug')}"), 'bug dialog must use drag style');
expect(toolbar.includes("style={getDialogDragStyle('target')}"), 'target dialog must use drag style');
expect(toolbar.includes('data-admin-dialog-draggable-stage87b="true"'), 'dialogs must carry draggable marker');
expect(toolbar.includes('admin-tool-dialog-drag-handle'), 'dialog header must be drag handle');
expect(toolbar.includes("closest('button, input, textarea, select, a')"), 'drag must not start from form controls/buttons');
expect(css.includes('ADMIN_DIALOG_DRAG_LOWER_STAGE87B'), 'CSS must have Stage87B marker');
expect(css.includes('align-items: flex-start'), 'dialog backdrop must not center vertically');
expect(css.includes('padding: 96px 20px 20px'), 'dialog backdrop must open lower than top edge');
expect(css.includes('max-height: calc(100vh - 128px)'), 'dialog must fit viewport height');
expect(css.includes('.admin-tool-dialog-drag-handle'), 'drag handle CSS missing');
expect(Boolean(pkg.scripts?.['check:admin-dialog-drag-lower']), 'package.json missing check:admin-dialog-drag-lower');
expect(Boolean(pkg.scripts?.['test:admin-dialog-drag-lower']), 'package.json missing test:admin-dialog-drag-lower');
expect(String(pkg.scripts?.['verify:admin-tools'] || '').includes('check:admin-dialog-drag-lower'), 'verify:admin-tools must include drag/lower guard');

if (fail.length) {
  console.error('Admin dialog drag/lower guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('PASS ADMIN_DIALOG_DRAG_LOWER_STAGE87B');
