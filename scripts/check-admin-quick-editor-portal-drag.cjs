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

expect(toolbar.includes('ADMIN_QUICK_EDITOR_PORTAL_DRAG_STAGE87F'), 'toolbar must carry Stage87F marker');
expect(toolbar.includes("import { createPortal } from 'react-dom';"), 'quick editor must import createPortal');
expect(toolbar.includes('createPortal(floatingAdminTools, document.body)'), 'quick editor must portal to document.body');
expect(toolbar.includes('QuickEditorPosition'), 'quick editor position state missing');
expect(toolbar.includes('quickEditorPosition'), 'quick editor position state not used');
expect(toolbar.includes('quickEditorDragState'), 'quick editor drag state missing');
expect(toolbar.includes('startQuickEditorDrag'), 'quick editor drag handler missing');
expect(toolbar.includes('pointermove'), 'quick editor drag must listen to pointermove');
expect(toolbar.includes('pointerup'), 'quick editor drag must stop on pointerup');
expect(toolbar.includes('Reset pozycji'), 'quick editor must expose reset position action');
expect(toolbar.includes('style={getQuickEditorStyle()}'), 'quick editor must use inline position style');
expect(toolbar.includes('data-admin-quick-editor-portal-drag-stage87f="true"'), 'quick editor data marker missing');
expect(toolbar.includes("bottom: 'auto'"), 'quick editor inline style must disable bottom positioning');
expect(css.includes('ADMIN_QUICK_EDITOR_PORTAL_DRAG_STAGE87F'), 'CSS Stage87F marker missing');
expect(css.includes('top: 136px'), 'quick editor must default below topbar');
expect(css.includes('bottom: auto'), 'quick editor must not be locked to bottom');
expect(css.includes('.admin-tool-quick-editor-head'), 'drag handle CSS missing');
expect(css.includes('cursor: grab'), 'drag cursor missing');
expect(Boolean(pkg.scripts?.['check:admin-quick-editor-portal-drag']), 'package.json missing check:admin-quick-editor-portal-drag');
expect(Boolean(pkg.scripts?.['test:admin-quick-editor-portal-drag']), 'package.json missing test:admin-quick-editor-portal-drag');
expect(String(pkg.scripts?.['verify:admin-tools'] || '').includes('check:admin-quick-editor-portal-drag'), 'verify:admin-tools must include Stage87F guard');

if (fail.length) {
  console.error('Admin quick editor portal drag guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('PASS ADMIN_QUICK_EDITOR_PORTAL_DRAG_STAGE87F');