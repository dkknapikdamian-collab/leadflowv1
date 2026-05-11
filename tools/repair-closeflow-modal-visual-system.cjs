#!/usr/bin/env node
/* CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1_REPAIR
 * CRLF/LF-safe idempotent repair for the shared operator dialog visual contract.
 */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
function p(rel){ return path.join(root, rel); }
function read(rel){ return fs.readFileSync(p(rel), 'utf8'); }
function write(rel, text){ fs.mkdirSync(path.dirname(p(rel)), { recursive: true }); fs.writeFileSync(p(rel), text, 'utf8'); console.log('updated ' + rel); }
function ensure(rel){ if(!fs.existsSync(p(rel))) throw new Error('Missing required file: ' + rel); }
function has(rel, needle){ return read(rel).includes(needle); }

ensure('src/App.tsx');
ensure('src/components/ui/dialog.tsx');
ensure('src/styles/closeflow-modal-visual-system.css');
ensure('scripts/check-closeflow-modal-visual-system.cjs');

let dialog = read('src/components/ui/dialog.tsx');
if (!dialog.includes('CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1')) {
  dialog = '/* CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1: all operator DialogContent surfaces use one visual contract. */\n' + dialog;
}
if (!dialog.includes('cf-modal-surface')) {
  dialog = dialog.replace('"fixed left-[50%] top-[50%]', '"cf-modal-surface fixed left-[50%] top-[50%]');
}
if (!dialog.includes('cf-modal-close')) {
  dialog = dialog.replace('className="absolute right-4 top-4', 'className="cf-modal-close absolute right-4 top-4');
}
if (!dialog.includes('cf-modal-header')) {
  dialog = dialog.replace('"flex flex-col space-y-1.5 text-center sm:text-left"', '"cf-modal-header flex flex-col space-y-1.5 text-center sm:text-left"');
}
if (!dialog.includes('cf-modal-footer')) {
  dialog = dialog.replace('"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"', '"cf-modal-footer flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"');
}
if (!dialog.includes('cf-modal-title')) {
  dialog = dialog.replace('"text-lg font-semibold leading-none tracking-tight"', '"cf-modal-title text-lg font-semibold leading-none tracking-tight"');
}
if (!dialog.includes('data-closeflow-modal-visual-system="true"')) {
  const contentStart = dialog.indexOf('<DialogPrimitive.Content');
  const refIndex = dialog.indexOf('ref={ref}', contentStart);
  if (contentStart < 0 || refIndex < 0) throw new Error('Cannot insert modal data marker into DialogContent');
  dialog = dialog.slice(0, refIndex + 'ref={ref}'.length) + '\n      data-closeflow-modal-visual-system="true"' + dialog.slice(refIndex + 'ref={ref}'.length);
}
write('src/components/ui/dialog.tsx', dialog);

let app = read('src/App.tsx');
const modalImport = "import './styles/closeflow-modal-visual-system.css';";
if (!app.includes(modalImport)) {
  const anchor = "import './styles/closeflow-surface-tokens.css';";
  app = app.includes(anchor)
    ? app.replace(anchor, anchor + '\n' + modalImport)
    : app.replace("import './styles/closeflow-action-tokens.css';", "import './styles/closeflow-action-tokens.css';\n" + modalImport);
  write('src/App.tsx', app);
}

let pkg = JSON.parse(read('package.json'));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:modal-visual-system'] = 'node scripts/check-closeflow-modal-visual-system.cjs';
write('package.json', JSON.stringify(pkg, null, 2) + '\n');

if (!has('src/components/ui/dialog.tsx', 'data-closeflow-modal-visual-system="true"')) throw new Error('DialogContent data marker still missing');
if (!has('src/components/ui/dialog.tsx', 'cf-modal-surface')) throw new Error('DialogContent modal surface class still missing');
if (!has('src/App.tsx', modalImport)) throw new Error('App modal CSS import still missing');
console.log('✔ CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1 repair applied');
