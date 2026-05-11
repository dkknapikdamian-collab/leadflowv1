#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const cssPath = path.join(process.cwd(), 'src/styles/closeflow-modal-visual-system.css');
const css = fs.readFileSync(cssPath, 'utf8');

const required = [
  'CLOSEFLOW_MODAL_DARK_SHELL_INNER_SURFACES_FIX_2026_05_11',
  '--cf-modal-shell: #07101f',
  '--cf-modal-panel: #111827',
  '--cf-modal-input: #0f172a',
  '[data-closeflow-modal-visual-system="true"] .bg-white',
  '[data-closeflow-modal-visual-system="true"] .bg-slate-50',
  '[data-closeflow-modal-visual-system="true"] .rounded-2xl.border',
  '[data-closeflow-modal-visual-system="true"] .rounded-3xl.border',
  '[data-closeflow-modal-visual-system="true"] .bg-amber-50',
  '[data-closeflow-modal-visual-system="true"] [role="option"]',
  'background: var(--cf-modal-input) !important',
  'border-color: var(--cf-modal-accent-bright) !important',
];

const missing = required.filter((token) => !css.includes(token));
if (missing.length) {
  console.error('Missing modal dark-skin tokens:');
  for (const token of missing) console.error(' - ' + token);
  process.exit(1);
}

const forbidden = [
  '--cf-modal-bg: #f8fafc',
  '--cf-modal-panel: #ffffff',
  'reason: unified, readable, light operator dialogs',
];

const presentForbidden = forbidden.filter((token) => css.includes(token));
if (presentForbidden.length) {
  console.error('Forbidden old light modal tokens still present:');
  for (const token of presentForbidden) console.error(' - ' + token);
  process.exit(1);
}

console.log('✔ CloseFlow modal dark shell inner surfaces contract is present');
