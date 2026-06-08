const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function fail(message) {
  console.error('STAGE228R7R5_CLIENTDETAIL_LAZY_EXPORT_FAIL:', message);
  process.exit(1);
}

function requireText(text, token, label) {
  if (!text.includes(token)) fail(label + ' missing token: ' + token);
}

function forbidText(text, token, label) {
  if (text.includes(token)) fail(label + ' forbidden token: ' + token);
}

const app = read('src/App.tsx');
const clientDetail = read('src/pages/ClientDetail.tsx');
const pkg = JSON.parse(read('package.json'));

[
  "const ClientDetail = lazyPage(() => import('./pages/ClientDetail'), 'ClientDetail');",
  "throw new Error('Missing lazy page export: ' + exportName);",
].forEach((token) => requireText(app, token, 'App lazyPage contract'));

[
  'STAGE228R7_R5_CLIENTDETAIL_LAZY_EXPORT_HOTFIX',
  'function ClientDetail()',
  'export { ClientDetail };',
  'export default ClientDetail;',
].forEach((token) => requireText(clientDetail, token, 'ClientDetail lazy export'));

[
  'export default function ClientDetail()',
].forEach((token) => forbidText(clientDetail, token, 'ClientDetail lazy export'));

if (pkg.scripts['check:stage228r7r5-clientdetail-lazy-export'] !== 'node scripts/check-stage228r7r5-clientdetail-lazy-export.cjs') {
  fail('package.json missing check:stage228r7r5-clientdetail-lazy-export script');
}

if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage228r7r5-clientdetail-lazy-export.cjs')) {
  fail('package.json prebuild missing Stage228R7R5 lazy export guard');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R7_R5_CLIENTDETAIL_LAZY_EXPORT_HOTFIX',
  contract: 'ClientDetail page exposes named and default exports for App.lazyPage'
}, null, 2));
