#!/usr/bin/env node
/* CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT_GUARD */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function fail(message) {
  console.error(`CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT_FAIL: ${message}`);
  process.exitCode = 1;
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function exists(relPath) {
  return fs.existsSync(path.join(root, relPath));
}

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function hasMojibakeOrControls(text) {
  return /BĹ|Ä…|Ä‡|Ä™|Ĺ‚|Ĺ„|Ĺ›|Ĺş|Ĺź|ĹĽ|Ã|Â|\uFFFD/.test(text)
    || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(text);
}

const cssPath = 'src/styles/closeflow-form-actions.css';
assert(exists(cssPath), `Brakuje ${cssPath}`);
const css = exists(cssPath) ? read(cssPath) : '';
[
  'CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT',
  '.cf-form-actions',
  '.cf-form-actions-primary',
  '.cf-form-actions-secondary',
  '.cf-form-actions-danger',
  '.cf-modal-footer',
  '.cf-modal-footer-left',
  '.cf-modal-footer-right',
  '.cf-mobile-action-stack',
  '@media (max-width: 640px)',
].forEach((needle) => assert(css.includes(needle), `Brakuje selektora/markera ${needle} w ${cssPath}`));
assert(!hasMojibakeOrControls(css), `${cssPath} zawiera mojibake albo control chars`);

const app = read('src/App.tsx');
assert(app.includes("./styles/closeflow-form-actions.css"), 'App.tsx nie importuje closeflow-form-actions.css');
assert(!hasMojibakeOrControls(app), 'App.tsx zawiera mojibake albo control chars');

const entityActions = read('src/components/entity-actions.tsx');
[
  'CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT',
  'formActionsClass',
  'formActionsPrimaryClass',
  'formActionsSecondaryClass',
  'formActionsDangerClass',
  'modalFooterClass',
  'modalFooterLeftClass',
  'modalFooterRightClass',
  'mobileActionStackClass',
].forEach((needle) => assert(entityActions.includes(needle), `Brakuje helpera/kontraktu ${needle} w entity-actions.tsx`));
assert(/actionButtonClass\(tone/.test(entityActions) && /danger/.test(entityActions), 'Destructive tone nie przechodzi przez wspólny actionButtonClass');
assert(!hasMojibakeOrControls(entityActions), 'entity-actions.tsx zawiera mojibake albo control chars');

const targetFiles = [
  'src/pages/LeadDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/CaseDetail.tsx',
  'src/pages/Leads.tsx',
  'src/pages/Cases.tsx',
  'src/pages/Clients.tsx',
  app.includes("import('./pages/TasksStable')") ? 'src/pages/TasksStable.tsx' : 'src/pages/Tasks.tsx',
].filter((relPath, index, arr) => exists(relPath) && arr.indexOf(relPath) === index);

assert(targetFiles.length >= 7, `Za mało plików objętych kontraktem: ${targetFiles.join(', ')}`);

const forbiddenLocalClasses = /form-footer-fix|modal-actions-v2|mobile-button-repair|form-actions-fix|modal-footer-fix|footer-action-repair|button-stack-repair/i;
const footerUsage = /modalFooterClass\(|formActionsClass\(|cf-modal-footer|cf-form-actions/;
const sharedDangerUsage = /actionButtonClass\(\s*['"]danger|actionIconClass\(\s*['"]danger|tone=['"]danger|formActionsDangerClass\(|cf-form-actions-danger/;

for (const relPath of targetFiles) {
  const text = read(relPath);
  assert(!hasMojibakeOrControls(text), `${relPath} zawiera mojibake albo control chars`);
  assert(!forbiddenLocalClasses.test(text), `${relPath} zawiera lokalną klasę fix/v2/repair dla akcji`);

  const hasFooterSurface = /DialogFooter|type=['"]submit|Zapisz|Zapisz zmiany|Anuluj|Zamknij|Odśwież|Odswiez/.test(text);
  if (hasFooterSurface) {
    assert(footerUsage.test(text), `${relPath} ma stopkę/akcje formularza, ale nie używa wspólnego cf-form/modal helpera`);
  }

  const hasDangerSurface = /Trash2|Usuń|Usun|delete|archive|Przenieść|Przeniesc|Kosz/i.test(text);
  if (hasDangerSurface && /DialogFooter|cf-form-actions|cf-modal-footer|modalFooterClass|formActionsClass/.test(text)) {
    assert(
      sharedDangerUsage.test(text) || /CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT|STAGE_PANEL_DELETE|Trash/.test(text),
      `${relPath} ma delete/danger surface bez śladu wspólnego kontraktu danger`,
    );
  }
}

const packageJson = JSON.parse(read('package.json'));
assert(packageJson.scripts && packageJson.scripts['check:closeflow-form-action-footer-contract'], 'package.json nie ma check:closeflow-form-action-footer-contract');

if (process.exitCode) process.exit(process.exitCode);
console.log(`CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT_OK: ${targetFiles.join(', ')}`);
