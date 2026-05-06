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
function requireNotContains(rel, needle) {
  const text = file(rel);
  if (!text.includes(needle)) pass(rel + ' does not contain ' + needle);
  else fail(rel + ' still contains ' + needle);
}
function requireNotBom(rel) {
  const buffer = fs.readFileSync(path.join(root, rel));
  if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) fail(rel + ' has UTF-8 BOM');
  else pass(rel + ' has no UTF-8 BOM');
}

requireNotBom('package.json');
JSON.parse(file('package.json'));
pass('package.json parses with JSON.parse');

for (const rel of [
  'src/server/assistant-query-handler.ts',
  'src/server/ai-assistant.ts',
  'src/server/assistant-context.ts',
  'api/system.ts',
  'vercel.json',
  'scripts/check-stage7-ai-assistant-query-api-contract-smoke.cjs',
  'tests/stage7-ai-assistant-query-api-contract-smoke.test.cjs',
  'docs/release/STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1_2026-05-06.md',
]) {
  if (exists(rel)) pass(rel + ' exists');
  else fail(rel + ' missing');
}

if (!exists('api/assistant/query.ts')) pass('api/assistant/query.ts removed as physical Vercel function');
else fail('api/assistant/query.ts still exists and may exceed Vercel Hobby function limit');

requireContains('src/server/assistant-query-handler.ts', 'STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1');
requireContains('src/server/assistant-query-handler.ts', 'MAX_ASSISTANT_QUERY_BODY_BYTES');
requireContains('src/server/assistant-query-handler.ts', 'emptyPromptApiResult');
requireContains('src/server/assistant-query-handler.ts', "dataPolicy: 'app_data_only'");
requireContains('src/server/assistant-query-handler.ts', 'payload_too_large');
requireContains('src/server/assistant-query-handler.ts', 'Endpoint /api/assistant/query przyjmuje tylko POST.');
requireContains('src/server/assistant-query-handler.ts', 'buildAssistantContextFromRequest');
requireContains('src/server/assistant-query-handler.ts', 'runAssistantQuery');
requireContains('src/server/assistant-query-handler.ts', 'seed: body.snapshot || body.data || undefined');
requireContains('src/server/assistant-query-handler.ts', 'return sendJson(res, 400, emptyPromptApiResult({ timezone, now }));');
requireContains('src/server/assistant-query-handler.ts', 'return sendJson(res, 413');

requireContains('api/system.ts', 'assistant-query-handler.js');
requireContains('api/system.ts', 'STAGE10C_ASSISTANT_QUERY_SYSTEM_KIND_ROUTE');
requireContains('api/system.ts', "__stage10cKind === 'assistant-query'");
requireContains('vercel.json', '"source": "/api/assistant/query"');
requireContains('vercel.json', '"destination": "/api/system?kind=assistant-query"');

const pkg = JSON.parse(file('package.json'));
if (pkg.scripts && pkg.scripts['check:stage7-ai-assistant-query-api-contract-smoke-v1']) pass('package.json exposes Stage7 check script');
else fail('package.json missing Stage7 check script');
if (pkg.scripts && pkg.scripts['test:stage7-ai-assistant-query-api-contract-smoke-v1']) pass('package.json exposes Stage7 test script');
else fail('package.json missing Stage7 test script');

requireContains('docs/release/STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1_2026-05-06.md', 'STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1');
requireContains('docs/release/STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1_2026-05-06.md', '/api/assistant/query');
requireContains('docs/release/STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1_2026-05-06.md', 'structured API contract');
requireContains('docs/release/STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1_2026-05-06.md', 'without separate Vercel function');

if (process.exitCode) process.exit(process.exitCode);
console.log('PASS STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1');
