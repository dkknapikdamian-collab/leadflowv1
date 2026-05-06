const fs = require('fs');
const path = require('path');

const root = process.cwd();
const STAGE = 'STAGE11_VERCEL_HOBBY_FUNCTION_BUDGET_GUARD_V1';
const API_LIMIT = 12;

function pass(message) { console.log('PASS ' + message); }
function fail(message) { console.error('FAIL ' + message); process.exitCode = 1; }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function requireContains(rel, needle) {
  if (!exists(rel)) return fail(rel + ' missing');
  const text = read(rel);
  if (text.includes(needle)) pass(rel + ' contains ' + needle);
  else fail(rel + ' missing ' + needle);
}
function requireNoBom(rel) {
  const buffer = fs.readFileSync(path.join(root, rel));
  if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) fail(rel + ' has UTF-8 BOM');
  else pass(rel + ' has no UTF-8 BOM');
}
function listApiFunctionFiles(dir = path.join(root, 'api')) {
  if (!fs.existsSync(dir)) return [];
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...listApiFunctionFiles(full));
      continue;
    }
    if (!entry.isFile()) continue;
    if (/\.d\.ts$/i.test(entry.name)) continue;
    if (/\.(ts|js|mjs|cjs)$/i.test(entry.name)) result.push(full);
  }
  return result;
}

requireNoBom('package.json');
JSON.parse(read('package.json'));
pass('package.json parses with JSON.parse');

if (!exists('api/assistant/query.ts')) pass('api/assistant/query.ts remains removed');
else fail('api/assistant/query.ts must not return as a physical Vercel function');

const apiFiles = listApiFunctionFiles();
const relativeApiFiles = apiFiles.map((file) => path.relative(root, file).replace(/\\/g, '/')).sort();
if (relativeApiFiles.length <= API_LIMIT) pass('api physical serverless function count <= ' + API_LIMIT + ': ' + relativeApiFiles.length);
else fail('api physical serverless function count exceeds ' + API_LIMIT + ': ' + relativeApiFiles.length + ' => ' + relativeApiFiles.join(', '));

requireContains('vercel.json', '"source": "/api/assistant/query"');
requireContains('vercel.json', '"destination": "/api/system?kind=assistant-query"');
requireContains('api/system.ts', 'STAGE10C_ASSISTANT_QUERY_SYSTEM_KIND_ROUTE');
requireContains('api/system.ts', "__stage10cKind === 'assistant-query'");
requireContains('src/server/assistant-query-handler.ts', 'STAGE10C_VERCEL_HOBBY_ASSISTANT_ROUTE_COLLAPSE_RESILIENT_V1');
requireContains('docs/release/STAGE11_VERCEL_HOBBY_FUNCTION_BUDGET_GUARD_V1_2026-05-06.md', STAGE);
requireContains('docs/release/STAGE11_VERCEL_HOBBY_FUNCTION_BUDGET_GUARD_V1_2026-05-06.md', 'api function count <= 12');

if (process.exitCode) process.exit(process.exitCode);
console.log('PASS ' + STAGE);
