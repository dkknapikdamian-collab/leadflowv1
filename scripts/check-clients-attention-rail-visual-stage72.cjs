const fs = require('fs');
const path = require('path');

const root = process.cwd();
const clientsPath = path.join(root, 'src', 'pages', 'Clients.tsx');
const cssPath = path.join(root, 'src', 'styles', 'closeflow-right-rail-source-truth.css');
const packagePath = path.join(root, 'package.json');
const clients = fs.readFileSync(clientsPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

function fail(message) {
  console.error('CLIENTS_ATTENTION_RAIL_VISUAL_STAGE72_FAIL:', message);
  process.exit(1);
}

const requiredClientTokens = [
  'data-clients-lead-attention-rail="true"',
  'data-right-rail-list="lead-attention"',
  'data-right-rail-row="lead-attention"',
  'right-list-row-main',
  'right-list-title',
  'right-list-meta',
  'right-list-badges',
  'right-list-pill right-list-pill-ok',
  'right-list-pill right-list-pill-warn',
  "to={leadId ? '/leads/' + leadId : '/leads'}",
];

for (const token of requiredClientTokens) {
  if (!clients.includes(token)) fail('missing Clients.tsx token: ' + token);
}

if (clients.includes('<strong>{leadLabel}</strong>')) fail('legacy inline lead title still present');
if (clients.includes('<span>{hasClient ?')) fail('legacy inline relation text still present');

const requiredCssTokens = [
  'CLOSEFLOW_RIGHT_RAIL_LIST_ROW_VISUAL_STAGE72_2026_05_14',
  '.right-list-row',
  '.right-list-row-main',
  '.right-list-title',
  '.right-list-meta',
  '.right-list-badges',
  '.right-list-pill',
  '.right-list-pill-ok',
  '.right-list-pill-warn',
  '.right-list-empty',
];

for (const token of requiredCssTokens) {
  if (!css.includes(token)) fail('missing CSS token: ' + token);
}

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
if (!prebuild.includes('check-clients-attention-rail-visual-stage72.cjs')) fail('prebuild does not include stage72 guard');
if (!pkg.scripts || pkg.scripts['check:clients-attention-rail-visual-stage72'] !== 'node scripts/check-clients-attention-rail-visual-stage72.cjs') {
  fail('missing package script check:clients-attention-rail-visual-stage72');
}

console.log('OK clients attention rail visual stage72');
