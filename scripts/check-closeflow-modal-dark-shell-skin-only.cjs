const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cssPath = path.join(root, 'src', 'styles', 'closeflow-modal-visual-system.css');
const dialogPath = path.join(root, 'src', 'components', 'ui', 'dialog.tsx');
const appPath = path.join(root, 'src', 'App.tsx');

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing file: ${path.relative(root, file)}`);
  return fs.readFileSync(file, 'utf8');
}

const css = read(cssPath);
const dialog = read(dialogPath);
const app = read(appPath);

const requiredCss = [
  'CLOSEFLOW_MODAL_DARK_SHELL_SKIN_ONLY_V3',
  '--cf-modal-shell',
  '--cf-modal-field-bg: #ffffff',
  'data-closeflow-modal-visual-system="true"',
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"])',
  'button[type="submit"]',
  '@media (max-width: 640px)',
];

const requiredDialog = [
  'data-closeflow-modal-visual-system="true"',
  'cf-modal-surface',
  'cf-modal-header',
  'cf-modal-footer',
  'cf-modal-title',
  'cf-modal-close',
];

for (const token of requiredCss) {
  if (!css.includes(token)) throw new Error(`CSS contract missing token: ${token}`);
}

for (const token of requiredDialog) {
  if (!dialog.includes(token)) throw new Error(`Dialog contract missing token: ${token}`);
}

if (!app.includes("./styles/closeflow-modal-visual-system.css")) {
  throw new Error('App.tsx does not import closeflow-modal-visual-system.css');
}

console.log('✔ CloseFlow modal dark shell skin-only contract OK');
