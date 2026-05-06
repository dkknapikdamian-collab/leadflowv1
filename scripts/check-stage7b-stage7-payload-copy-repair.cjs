const fs = require('fs');
const path = require('path');

const root = process.cwd();
function pass(message) { console.log('PASS ' + message); }
function fail(message) { console.error('FAIL ' + message); process.exitCode = 1; }
function p(rel) { return path.join(root, rel); }
function exists(rel) { return fs.existsSync(p(rel)); }
function file(rel) { return fs.readFileSync(p(rel), 'utf8'); }
function requireExists(rel) { if (exists(rel)) pass(rel + ' exists'); else fail(rel + ' missing'); }
function requireMissing(rel) { if (!exists(rel)) pass(rel + ' absent'); else fail(rel + ' should not exist'); }
function requireContains(rel, needle) {
  const text = file(rel);
  if (text.includes(needle)) pass(rel + ' contains ' + needle);
  else fail(rel + ' missing ' + needle);
}
function requireNotBom(rel) {
  const buffer = fs.readFileSync(p(rel));
  if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) fail(rel + ' has UTF-8 BOM');
  else pass(rel + ' has no UTF-8 BOM');
}

requireNotBom('package.json');
const pkg = JSON.parse(file('package.json'));
pass('package.json parses with JSON.parse');

for (const rel of [
  'api/assistant/query.ts',
  'scripts/check-stage7-ai-assistant-query-api-contract-smoke.cjs',
  'tests/stage7-ai-assistant-query-api-contract-smoke.test.cjs',
  'docs/release/STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1_2026-05-06.md',
  'scripts/check-stage7b-stage7-payload-copy-repair.cjs',
  'tests/stage7b-stage7-payload-copy-repair.test.cjs',
  'docs/release/STAGE7B_STAGE7_PAYLOAD_COPY_REPAIR_V1_2026-05-06.md',
]) requireExists(rel);

for (const rel of [
  'scripts/scripts/check-stage7-ai-assistant-query-api-contract-smoke.cjs',
  'tests/tests/stage7-ai-assistant-query-api-contract-smoke.test.cjs',
  'docs/docs/release/STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1_2026-05-06.md',
  'api/api/assistant/query.ts',
]) requireMissing(rel);

if (pkg.scripts && pkg.scripts['check:stage7-ai-assistant-query-api-contract-smoke-v1'] === 'node scripts/check-stage7-ai-assistant-query-api-contract-smoke.cjs') pass('package.json exposes exact Stage7 check script');
else fail('package.json Stage7 check script missing or wrong');
if (pkg.scripts && pkg.scripts['test:stage7-ai-assistant-query-api-contract-smoke-v1'] === 'node --test tests/stage7-ai-assistant-query-api-contract-smoke.test.cjs') pass('package.json exposes exact Stage7 test script');
else fail('package.json Stage7 test script missing or wrong');
if (pkg.scripts && pkg.scripts['check:stage7b-stage7-payload-copy-repair-v1'] === 'node scripts/check-stage7b-stage7-payload-copy-repair.cjs') pass('package.json exposes exact Stage7B check script');
else fail('package.json Stage7B check script missing or wrong');
if (pkg.scripts && pkg.scripts['test:stage7b-stage7-payload-copy-repair-v1'] === 'node --test tests/stage7b-stage7-payload-copy-repair.test.cjs') pass('package.json exposes exact Stage7B test script');
else fail('package.json Stage7B test script missing or wrong');

requireContains('api/assistant/query.ts', 'STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1');
requireContains('api/assistant/query.ts', 'MAX_ASSISTANT_QUERY_BODY_BYTES');
requireContains('docs/release/STAGE7B_STAGE7_PAYLOAD_COPY_REPAIR_V1_2026-05-06.md', 'STAGE7B_STAGE7_PAYLOAD_COPY_REPAIR_V1');
requireContains('docs/release/STAGE7B_STAGE7_PAYLOAD_COPY_REPAIR_V1_2026-05-06.md', 'file-by-file');
requireContains('docs/release/STAGE7B_STAGE7_PAYLOAD_COPY_REPAIR_V1_2026-05-06.md', 'No nested payload path');

if (process.exitCode) process.exit(process.exitCode);
console.log('PASS STAGE7B_STAGE7_PAYLOAD_COPY_REPAIR_V1');
