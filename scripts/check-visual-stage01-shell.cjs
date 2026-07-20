const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
}
function expect(file, needle, label = needle) {
  if (!read(file).includes(needle)) throw new Error(`${file}: missing ${label}`);
  console.log(`OK: ${file} contains ${label}`);
}
function reject(file, needle, label = needle) {
  if (read(file).includes(needle)) throw new Error(`${file}: forbidden ${label}`);
  console.log(`OK: ${file} excludes ${label}`);
}

reject('src/index.css', 'visual-stage01-shell.css', 'inactive Stage01 global CSS import');
expect('src/App.tsx', "./styles/closeflow-visual-source-truth.css", 'current app visual source import');
expect('src/App.tsx', "./styles/closeflow-clean-desktop-app-shell-canvas-stage149.css", 'current desktop shell canvas import');
expect('src/components/Layout.tsx', "../styles/closeflow-compact-top-shell-source-truth.css", 'current compact top shell import');
expect('src/components/Layout.tsx', "../styles/closeflow-operator-top-trim-source-truth.css", 'current operator top trim import');
expect('src/components/Layout.tsx', 'VisualFoundationRuntimeStage212M', 'current visual foundation runtime');
expect('src/components/Layout.tsx', 'OperatorTopBarRuntime', 'current operator top bar runtime');
expect('src/components/Layout.tsx', 'className="app closeflow-visual-stage01 cf-html-shell"', 'current shell root classes');
expect('src/components/Layout.tsx', 'data-shell-sidebar="true"', 'sidebar shell marker');
expect('src/components/Layout.tsx', 'data-shell-main="true"', 'main shell marker');
expect('src/components/Layout.tsx', 'data-shell-content="true"', 'content shell marker');

for (const label of [
  'Dziś',
  'Leady',
  'Klienci',
  'Sprawy',
  'Lejek',
  'Zadania',
  'Kalendarz',
  'Szablony',
  'Odpowiedzi',
  'Aktywność',
  'Inbox szkiców',
  'Powiadomienia',
  'Rozliczenia',
  'Zgłoszenia',
  'Admin AI',
  'Ustawienia',
]) expect('src/components/Layout.tsx', `label: '${label}'`, `${label} navigation`);

expect('src/components/GlobalQuickActions.tsx', 'data-global-quick-actions-contract="v97"', 'global quick actions contract');
expect('src/components/GlobalQuickActions.tsx', "rememberGlobalQuickAction('lead')", 'lead quick action bridge');
expect('src/components/GlobalQuickActions.tsx', "rememberGlobalQuickAction('task')", 'task quick action bridge');
expect('src/components/GlobalQuickActions.tsx', "rememberGlobalQuickAction('event')", 'event quick action bridge');
expect('src/styles/visual-stage01-shell.css', 'VISUAL_STAGE_01_SHELL_CSS', 'Stage01 reference CSS marker');

console.log('OK: reconciled historical visual guard stage01 with current shell source truth.');
