#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function write(rel, text) { fs.writeFileSync(path.join(root, rel), text); }
function ensureDir(rel) { fs.mkdirSync(path.join(root, rel), { recursive: true }); }

const marker = 'CLOSEFLOW_CLIENT_DETAIL_ID_ROUTE_HOTFIX_V1';
const clientPath = 'src/pages/ClientDetail.tsx';
let client = read(clientPath);

if (!client.includes(marker)) {
  client = `const ${marker} = 'ClientDetail route param source is clientId; legacy id alias is local only';\nvoid ${marker};\n` + client;
}

if (!/const\s+id\s*=\s*clientId\s*;/.test(client)) {
  const useParamsPattern = /(const\s*\{\s*clientId\s*\}\s*=\s*useParams(?:<[^>]+>)?\(\)\s*;)/;
  if (useParamsPattern.test(client)) {
    client = client.replace(useParamsPattern, `$1\n  // ${marker}: old code below can still reference id, but route source of truth stays clientId.\n  const id = clientId;`);
  } else {
    const functionPattern = /(export\s+default\s+function\s+ClientDetail\s*\(\)\s*\{)/;
    if (!functionPattern.test(client)) throw new Error('CLIENT_DETAIL_COMPONENT_ANCHOR_NOT_FOUND');
    client = client.replace(functionPattern, `$1\n  const { clientId } = useParams();\n  // ${marker}: old code below can still reference id, but route source of truth stays clientId.\n  const id = clientId;`);
  }
}
write(clientPath, client);
console.log('patched: src/pages/ClientDetail.tsx route id alias');

const pkgPath = 'package.json';
const pkg = JSON.parse(read(pkgPath));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:client-detail-id-route-hotfix'] = 'node scripts/check-client-detail-id-route-hotfix.cjs';
write(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log('patched: package.json check:client-detail-id-route-hotfix');

ensureDir('scripts');
console.log('CLIENT_DETAIL_ID_ROUTE_HOTFIX_REPAIR1_PATCH_OK');
