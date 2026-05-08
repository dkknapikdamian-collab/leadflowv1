const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
const fail = (message) => {
  console.error('CLOSEFLOW_ALERT_SEVERITY_CONTRACT_STAGE9_FAIL: ' + message);
  process.exit(1);
};

const cssPath = 'src/styles/closeflow-alert-severity.css';
if (!exists(cssPath)) fail('missing closeflow alert severity css');

const css = read(cssPath);
for (const token of [
  '.cf-alert',
  '.cf-alert-error',
  '.cf-alert-warning',
  '.cf-alert-info',
  '.cf-alert-success',
  '.cf-severity-pill',
  '.cf-severity-dot',
  '.cf-severity-panel',
  '--cf-alert-error-text',
  '--cf-alert-error-bg',
  '--cf-alert-error-border',
  '--cf-alert-warning-text',
  '--cf-alert-warning-bg',
  '--cf-alert-warning-border',
  '--cf-alert-info-text',
  '--cf-alert-info-bg',
  '--cf-alert-info-border',
  '--cf-alert-success-text',
  '--cf-alert-success-bg',
  '--cf-alert-success-border',
  '--cf-alert-muted-text',
]) {
  if (!css.includes(token)) fail('missing alert severity token or class: ' + token);
}

if (/\b(delete|trash|destructive)\b/i.test(css)) {
  fail('alert severity css must not own delete or destructive action semantics');
}

const app = read('src/App.tsx');
if (!app.includes("import './styles/closeflow-alert-severity.css';")) {
  fail('App.tsx missing closeflow alert severity css import');
}

const boundary = read('src/components/AppChunkErrorBoundary.tsx');
if (!boundary.includes('cf-alert cf-alert-error')) fail('AppChunkErrorBoundary missing cf-alert-error surface');
if (!boundary.includes('cf-alert-title')) fail('AppChunkErrorBoundary missing cf-alert-title');
if (/border-rose-|bg-rose-|text-rose-/.test(boundary)) fail('AppChunkErrorBoundary still uses local rose alert classes');

const dashboard = read('src/pages/Dashboard.tsx');
const blockedIndex = dashboard.indexOf('Blokuj');
const blockedSlice = blockedIndex >= 0 ? dashboard.slice(Math.max(0, blockedIndex - 700), blockedIndex + 1200) : '';
if (!blockedSlice.includes('stats.blocked')) fail('Dashboard blocked severity metric not found');
if (!blockedSlice.includes('cf-severity-panel')) fail('Dashboard missing cf-severity-panel for alert severity');
if (!blockedSlice.includes('cf-severity-dot')) fail('Dashboard missing cf-severity-dot for alert severity');
if (!blockedSlice.includes('cf-severity-text-error')) fail('Dashboard missing cf-severity-text-error for alert severity');
if (!blockedSlice.includes('data-cf-severity="error"')) fail('Dashboard missing error severity data attribute');

const forbiddenLocalNames = [
  'alert' + '-' + 'fix',
  'severity' + '-' + 'v2',
  'error' + '-' + 'repair',
];

for (const rel of [
  cssPath,
  'src/App.tsx',
  'src/components/AppChunkErrorBoundary.tsx',
  'src/pages/Dashboard.tsx',
  'scripts/check-closeflow-alert-severity-contract.cjs',
]) {
  const text = read(rel);
  for (const token of forbiddenLocalNames) {
    if (text.includes(token)) fail(rel + ' contains forbidden local alert/severity naming');
  }
}

const suspiciousCodes = [0x0139, 0x00c4, 0x0102, 0x00c2, 0xfffd];
for (const rel of [
  cssPath,
  'src/App.tsx',
  'src/components/AppChunkErrorBoundary.tsx',
  'src/pages/Dashboard.tsx',
  'scripts/check-closeflow-alert-severity-contract.cjs',
]) {
  const text = read(rel);
  for (const char of text) {
    if (suspiciousCodes.includes(char.charCodeAt(0))) {
      fail(rel + ' contains suspicious mojibake/control character');
    }
  }
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text)) {
    fail(rel + ' contains forbidden control character');
  }
}

if (exists('src/components/entity-actions.tsx')) {
  const entityActions = read('src/components/entity-actions.tsx');
  if (!entityActions.includes('cf-entity-action-danger')) {
    fail('delete/destructive action contract was weakened');
  }
}

console.log('CLOSEFLOW_ALERT_SEVERITY_CONTRACT_STAGE9_OK');
