const fs = require('fs');
const path = require('path');

const root = process.cwd();
const appPath = path.join(root, 'src', 'App.tsx');
const cssPath = path.join(root, 'src', 'styles', 'closeflow-right-rail-source-truth.css');
const marker = 'CLOSEFLOW_RIGHT_RAIL_SOURCE_TRUTH_STAGE70_2026_05_14';

function fail(message) {
  console.error('RIGHT_RAIL_SOURCE_TRUTH_FAIL:', message);
  process.exit(1);
}

if (!fs.existsSync(appPath)) fail('missing src/App.tsx');
if (!fs.existsSync(cssPath)) fail('missing src/styles/closeflow-right-rail-source-truth.css');

const app = fs.readFileSync(appPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

if (!app.includes("import './styles/closeflow-right-rail-source-truth.css';")) {
  fail('App.tsx does not import the shared right rail CSS source of truth');
}

const requiredTokens = [
  marker,
  '.main-leads-html',
  '.main-clients-html',
  '.main-cases-html',
  '.right-card',
  '.lead-right-rail',
  '.clients-right-rail',
  '.cases-right-rail',
  '.operator-top-value-card',
  '.quick-list',
  '--cf-right-rail-card-bg',
  'background: var(--cf-right-rail-card-bg) !important',
  'align-items: start !important',
];

for (const token of requiredTokens) {
  if (!css.includes(token)) fail('missing token in right rail source truth CSS: ' + token);
}

const forbidden = [
  /aside\.right-card[^{}]*\{[^{}]*background:\s*(?:#0f172a|#111827|rgb\(15\s+23\s+42\)|black)/i,
  /\.operator-top-value-card[^{}]*\{[^{}]*margin-top:\s*[1-9]/i,
];
for (const rule of forbidden) {
  if (rule.test(css)) fail('forbidden dark or offset rule found: ' + rule);
}

console.log('OK right rail source truth stage70');
