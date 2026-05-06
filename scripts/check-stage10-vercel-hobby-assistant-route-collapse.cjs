const fs = require('fs');
const path = require('path');

const root = process.cwd();
function pass(message) { console.log('PASS ' + message); }
function fail(message) { console.error('FAIL ' + message); process.exitCode = 1; }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function requireContains(rel, needle) {
  const text = read(rel);
  if (text.includes(needle)) pass(rel + ' contains ' + needle);
  else fail(rel + ' missing ' + needle);
}
function requireNotContains(rel, needle) {
  const text = read(rel);
  if (!text.includes(needle)) pass(rel + ' does not contain ' + needle);
  else fail(rel + ' still contains ' + needle);
}
function requireNotBom(rel) {
  const buffer = fs.readFileSync(path.join(root, rel));
  if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) fail(rel + ' has UTF-8 BOM');
  else pass(rel + ' has no UTF-8 BOM');
}
function apiFunctionFiles(dir) {
  const base = path.join(root, dir);
  if (!fs.existsSync(base)) return [];
  const result = [];
  function walk(current) {
    for (const name of fs.readdirSync(current)) {
      const full = path.join(current, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (/\.(ts|js|mjs)$/.test(name) && !/\.d\.ts$/.test(name)) result.push(path.relative(root, full).replace(/\\/g, '/'));
    }
  }
  walk(base);
  return result.sort();
}

requireNotBom('package.json');
const pkg = JSON.parse(read('package.json'));
pass('package.json parses with JSON.parse');

if (!exists('api/assistant/query.ts')) pass('api/assistant/query.ts removed as standalone Serverless Function');
else fail('api/assistant/query.ts still exists and adds a Serverless Function');
if (!exists('api/assistant') || fs.readdirSync(path.join(root, 'api/assistant')).length === 0) pass('api/assistant directory is absent or empty');
else fail('api/assistant directory still contains files');

for (const rel of [
  'api/system.ts',
  'vercel.json',
  'src/server/assistant-query-handler.ts',
  'src/lib/assistant-query-client.ts',
  'scripts/check-stage7-ai-assistant-query-api-contract-smoke.cjs',
  'tests/stage7-ai-assistant-query-api-contract-smoke.test.cjs',
  'scripts/check-stage10-vercel-hobby-assistant-route-collapse.cjs',
  'tests/stage10-vercel-hobby-assistant-route-collapse.test.cjs',
  'docs/release/STAGE10_VERCEL_HOBBY_ASSISTANT_ROUTE_COLLAPSE_V1_2026-05-06.md',
]) {
  if (exists(rel)) pass(rel + ' exists');
  else fail(rel + ' missing');
}

requireContains('api/system.ts', 'assistant-query-handler.js');
requireContains('api/system.ts', "kind === 'assistant-query'");
requireContains('api/system.ts', 'assistantQueryHandler(req, res, body)');
requireContains('src/server/assistant-query-handler.ts', 'STAGE10_VERCEL_HOBBY_ASSISTANT_ROUTE_COLLAPSE_V1');
requireContains('src/server/assistant-query-handler.ts', 'MAX_ASSISTANT_QUERY_BODY_BYTES');
requireContains('src/server/assistant-query-handler.ts', 'emptyPromptApiResult');
requireContains('src/server/assistant-query-handler.ts', 'dataPolicy: \'app_data_only\'');
requireContains('src/server/assistant-query-handler.ts', 'payload_too_large');
requireContains('src/server/assistant-query-handler.ts', 'Endpoint /api/assistant/query przyjmuje tylko POST.');
requireContains('src/server/assistant-query-handler.ts', 'buildAssistantContextFromRequest');
requireContains('src/server/assistant-query-handler.ts', 'runAssistantQuery');
requireContains('src/server/assistant-query-handler.ts', 'seed: (body as any).snapshot || (body as any).data || undefined');
requireContains('src/lib/assistant-query-client.ts', "fetch('/api/assistant/query'");

const vercel = JSON.parse(read('vercel.json'));
const rewrites = Array.isArray(vercel.rewrites) ? vercel.rewrites : [];
const assistantQueryRewrite = rewrites.find((entry) => entry && entry.source === '/api/assistant/query');
if (assistantQueryRewrite && assistantQueryRewrite.destination === '/api/system?kind=assistant-query') pass('vercel.json rewrites /api/assistant/query to /api/system?kind=assistant-query');
else fail('vercel.json missing /api/assistant/query -> /api/system?kind=assistant-query rewrite');
const assistantIndex = rewrites.findIndex((entry) => entry && entry.source === '/api/assistant');
const assistantQueryIndex = rewrites.findIndex((entry) => entry && entry.source === '/api/assistant/query');
if (assistantQueryIndex >= 0 && assistantIndex >= 0 && assistantQueryIndex < assistantIndex) pass('/api/assistant/query rewrite is before /api/assistant rewrite');
else fail('/api/assistant/query rewrite must be before /api/assistant rewrite');

if (pkg.scripts && pkg.scripts['check:stage10-vercel-hobby-assistant-route-collapse-v1']) pass('package.json exposes Stage10 check script');
else fail('package.json missing Stage10 check script');
if (pkg.scripts && pkg.scripts['test:stage10-vercel-hobby-assistant-route-collapse-v1']) pass('package.json exposes Stage10 test script');
else fail('package.json missing Stage10 test script');

requireContains('docs/release/STAGE10_VERCEL_HOBBY_ASSISTANT_ROUTE_COLLAPSE_V1_2026-05-06.md', 'STAGE10_VERCEL_HOBBY_ASSISTANT_ROUTE_COLLAPSE_V1');
requireContains('docs/release/STAGE10_VERCEL_HOBBY_ASSISTANT_ROUTE_COLLAPSE_V1_2026-05-06.md', 'No more than 12 Serverless Functions');
requireContains('docs/release/STAGE10_VERCEL_HOBBY_ASSISTANT_ROUTE_COLLAPSE_V1_2026-05-06.md', 'FAIL w checku blokuje commit/push');

const apiFiles = apiFunctionFiles('api');
if (apiFiles.length <= 12) pass('api Serverless Function file count <= 12 (' + apiFiles.length + ')');
else fail('api Serverless Function file count is over Hobby limit: ' + apiFiles.length + ' files: ' + apiFiles.join(', '));

if (process.exitCode) process.exit(process.exitCode);
console.log('PASS STAGE10_VERCEL_HOBBY_ASSISTANT_ROUTE_COLLAPSE_V1');
