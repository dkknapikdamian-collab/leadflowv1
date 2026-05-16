#!/usr/bin/env node
/* CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1_GUARD */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function fail(msg) { console.error('\u2716 ' + msg); process.exit(1); }
function assertIncludes(rel, needle, label = needle) {
  if (!exists(rel)) fail('missing file: ' + rel);
  const text = read(rel);
  if (!text.includes(needle)) fail(rel + ' missing: ' + label);
}

assertIncludes('src/App.tsx', "import './styles/closeflow-modal-visual-system.css';", 'global modal visual CSS import');
assertIncludes('src/components/ui/dialog.tsx', 'CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1', 'dialog visual marker');
assertIncludes('src/components/ui/dialog.tsx', 'data-closeflow-modal-visual-system="true"', 'dialog content data attribute');
assertIncludes('src/components/ui/dialog.tsx', 'cf-modal-surface', 'modal surface class');
assertIncludes('src/components/ui/dialog.tsx', 'cf-modal-header', 'modal header class');
assertIncludes('src/components/ui/dialog.tsx', 'cf-modal-footer', 'modal footer class');
assertIncludes('src/components/ui/dialog.tsx', 'cf-modal-title', 'modal title class');

const css = read('src/styles/closeflow-modal-visual-system.css');
[
  'CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1',
  '--cf-modal-accent',
  '[data-closeflow-modal-visual-system="true"] input:not([type="checkbox"]):not([type="radio"])',
  '[data-closeflow-modal-visual-system="true"] textarea',
  '[data-closeflow-modal-visual-system="true"] select',
  '-webkit-text-fill-color: var(--cf-modal-ink)',
  'caret-color: var(--cf-modal-accent-strong)',
  'client-case-form-textarea',
  'background: #ffffff !important',
  'border-color: var(--cf-modal-accent-strong)',
].forEach((needle) => {
  if (!css.includes(needle)) fail('modal CSS missing: ' + needle);
});

const mappedFiles = [
  'src/components/GlobalQuickActions.tsx',
  'src/components/QuickAiCapture.tsx',
  'src/components/TaskCreateDialog.tsx',
  'src/pages/Leads.tsx',
  'src/pages/Clients.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/Cases.tsx',
  'src/pages/Templates.tsx',
  'src/pages/ResponseTemplates.tsx',
  'src/pages/AiDrafts.tsx',
  'src/components/EntityConflictDialog.tsx',
];
for (const rel of mappedFiles) {
  if (!exists(rel)) fail('mapped modal owner missing: ' + rel);
}

assertIncludes('docs/feedback/CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1_2026-05-11.md', 'Nowy lead', 'modal mapping evidence');
assertIncludes('docs/feedback/CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1_2026-05-11.md', 'Szybki szkic', 'quick draft mapping evidence');
assertIncludes('docs/feedback/CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1_2026-05-11.md', 'Nie przywraca\u0107 ciemnego t\u0142a w inputach', 'dark input regression note');
console.log('\u2714 CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1 guard passed');
