#!/usr/bin/env node
/* CLOSEFLOW_MODAL_VISUAL_SYSTEM_READABLE_V2_GUARD */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const fail = (msg) => { console.error('\u2716 ' + msg); process.exit(1); };
const css = read('src/styles/closeflow-modal-visual-system.css');
const dialog = read('src/components/ui/dialog.tsx');

[
  'CLOSEFLOW_MODAL_VISUAL_SYSTEM_READABLE_V2',
  'background: linear-gradient(180deg, var(--cf-modal-panel) 0%, var(--cf-modal-bg) 100%) !important;',
  'background: linear-gradient(180deg, #ffffff 0%, rgba(248, 250, 252, 0.96) 100%) !important;',
  'color: var(--cf-modal-ink) !important;',
  'background: #ffffff !important;',
  'color: #ffffff !important;',
  '[data-closeflow-modal-visual-system="true"] input:not([type="checkbox"]):not([type="radio"])',
  '[data-closeflow-modal-visual-system="true"] textarea',
  '[data-closeflow-modal-visual-system="true"] select',
].forEach((needle) => {
  if (!css.includes(needle)) fail('modal readable v2 CSS missing: ' + needle);
});

[
  '--cf-modal-header-bg',
  '--cf-modal-header-bg-2',
  '--cf-modal-header-ink',
  'radial-gradient(circle at 100% 0%',
  'linear-gradient(135deg, var(--cf-modal-header-bg)',
  '-webkit-text-fill-color: #04130a',
].forEach((needle) => {
  if (css.includes(needle)) fail('modal readable v2 still contains dark/split V1 token: ' + needle);
});

if (!dialog.includes('data-closeflow-modal-visual-system="true"')) fail('dialog marker missing');
if (!dialog.includes('cf-modal-surface')) fail('dialog surface class missing');
console.log('\u2714 CLOSEFLOW_MODAL_VISUAL_SYSTEM_READABLE_V2 guard passed');
