const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function fail(message) {
  console.error('STAGE228R7R6_CLIENTDETAIL_STATIC_IMPORT_FAIL:', message);
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
  'STAGE228R7_R6_CLIENTDETAIL_STATIC_IMPORT_UNBLOCK',
  "import ClientDetailStatic from './pages/ClientDetail';",
  'const ClientDetail = ClientDetailStatic;',
].forEach((token) => requireText(app, token, 'App static ClientDetail import'));

[
  "const ClientDetail = lazyPage(() => import('./pages/ClientDetail'), 'ClientDetail');",
].forEach((token) => forbidText(app, token, 'App stale ClientDetail lazy import'));

[
  'function ClientDetail()',
  'export { ClientDetail };',
  'export default ClientDetail;',
].forEach((token) => requireText(clientDetail, token, 'ClientDetail exports'));

if (pkg.scripts['check:stage228r7r6-clientdetail-static-import'] !== 'node scripts/check-stage228r7r6-clientdetail-static-import.cjs') {
  fail('package.json missing check:stage228r7r6-clientdetail-static-import script');
}
if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage228r7r6-clientdetail-static-import.cjs')) {
  fail('package.json prebuild missing Stage228R7R6 static import guard');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R7_R6_CLIENTDETAIL_STATIC_IMPORT_UNBLOCK',
  contract: 'ClientDetail route is statically imported, so App.lazyPage no longer throws Missing lazy page export for ClientDetail'
}, null, 2));
