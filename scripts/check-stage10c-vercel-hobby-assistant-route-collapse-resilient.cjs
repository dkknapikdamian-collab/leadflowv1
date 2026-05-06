const fs = require('fs');
const path = require('path');

const root = process.cwd();
function pass(message) { console.log('PASS ' + message); }
function fail(message) { console.error('FAIL ' + message); process.exitCode = 1; }
function file(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function requireContains(rel, needle) {
  const text = file(rel);
  if (text.includes(needle)) pass(rel + ' contains ' + needle);
  else fail(rel + ' missing ' + needle);
}
function countApiFunctions(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) count += countApiFunctions(full);
    else if (/\.(ts|js|mjs|cjs)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) count += 1;
  }
  return count;
}

const pkgBuffer = fs.readFileSync(path.join(root, 'package.json'));
if (pkgBuffer[0] === 0xef && pkgBuffer[1] === 0xbb && pkgBuffer[2] === 0xbf) fail('package.json has UTF-8 BOM');
else pass('package.json has no UTF-8 BOM');
const pkg = JSON.parse(pkgBuffer.toString('utf8'));
pass('package.json parses with JSON.parse');

if (!exists('api/assistant/query.ts')) pass('api/assistant/query.ts removed');
else fail('api/assistant/query.ts still exists');

for (const rel of [
  'src/server/assistant-query-handler.ts',
  'api/system.ts',
  'vercel.json',
  'scripts/check-stage10c-vercel-hobby-assistant-route-collapse-resilient.cjs',
  'tests/stage10c-vercel-hobby-assistant-route-collapse-resilient.test.cjs',
  'docs/release/STAGE10C_VERCEL_HOBBY_ASSISTANT_ROUTE_COLLAPSE_RESILIENT_V1_2026-05-06.md',
]) {
  if (exists(rel)) pass(rel + ' exists');
  else fail(rel + ' missing');
}

requireContains('src/server/assistant-query-handler.ts', 'STAGE10C_VERCEL_HOBBY_ASSISTANT_ROUTE_COLLAPSE_RESILIENT_V1');
requireContains('src/server/assistant-query-handler.ts', 'MAX_ASSISTANT_QUERY_BODY_BYTES');
requireContains('src/server/assistant-query-handler.ts', 'emptyPromptApiResult');
requireContains('src/server/assistant-query-handler.ts', 'payload_too_large');
requireContains('api/system.ts', 'assistant-query-handler.js');
requireContains('api/system.ts', 'STAGE10C_ASSISTANT_QUERY_SYSTEM_KIND_ROUTE');
requireContains('api/system.ts', "__stage10cKind === 'assistant-query'");
requireContains('vercel.json', '"source": "/api/assistant/query"');
requireContains('vercel.json', '"destination": "/api/system?kind=assistant-query"');
requireContains('docs/release/STAGE10C_VERCEL_HOBBY_ASSISTANT_ROUTE_COLLAPSE_RESILIENT_V1_2026-05-06.md', 'No separate api/assistant/query.ts function');
requireContains('docs/release/STAGE10C_VERCEL_HOBBY_ASSISTANT_ROUTE_COLLAPSE_RESILIENT_V1_2026-05-06.md', 'Vercel Hobby <= 12 Serverless Functions');

if (pkg.scripts['check:stage10c-vercel-hobby-assistant-route-collapse-resilient-v1']) pass('package.json exposes Stage10C check script');
else fail('package.json missing Stage10C check script');
if (pkg.scripts['test:stage10c-vercel-hobby-assistant-route-collapse-resilient-v1']) pass('package.json exposes Stage10C test script');
else fail('package.json missing Stage10C test script');

const apiCount = countApiFunctions(path.join(root, 'api'));
if (apiCount <= 12) pass('api physical serverless function count <= 12: ' + apiCount);
else fail('api physical serverless function count exceeds 12: ' + apiCount);

if (process.exitCode) process.exit(process.exitCode);
console.log('PASS STAGE10C_VERCEL_HOBBY_ASSISTANT_ROUTE_COLLAPSE_RESILIENT_V1');
