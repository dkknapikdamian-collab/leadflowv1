const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('Stage7 keeps /api/assistant/query as structured API contract', () => {
  const src = read('api/assistant/query.ts');
  assert.match(src, /STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1/);
  assert.match(src, /emptyPromptApiResult/);
  assert.match(src, /dataPolicy:\s*"app_data_only"/);
  assert.match(src, /mode:\s*"unknown"/);
  assert.match(src, /intent:\s*"unknown"/);
  assert.match(src, /draft:\s*null/);
  assert.match(src, /items:\s*\[\]/);
});

test('Stage7 protects the assistant endpoint from empty prompt and too-large payload', () => {
  const src = read('api/assistant/query.ts');
  assert.match(src, /MAX_ASSISTANT_QUERY_BODY_BYTES\s*=\s*1024\s*\*\s*1024/);
  assert.match(src, /__assistantPayloadTooLarge/);
  assert.match(src, /payload_too_large/);
  assert.match(src, /return sendJson\(res, 400, emptyPromptApiResult/);
  assert.match(src, /return sendJson\(res, 413/);
});

test('Stage7 scripts are registered and package.json has no BOM', () => {
  const packagePath = path.join(root, 'package.json');
  const buffer = fs.readFileSync(packagePath);
  assert.notEqual(buffer[0], 0xef);
  const pkg = JSON.parse(buffer.toString('utf8'));
  assert.equal(pkg.scripts['check:stage7-ai-assistant-query-api-contract-smoke-v1'], 'node scripts/check-stage7-ai-assistant-query-api-contract-smoke.cjs');
  assert.equal(pkg.scripts['test:stage7-ai-assistant-query-api-contract-smoke-v1'], 'node --test tests/stage7-ai-assistant-query-api-contract-smoke.test.cjs');
});

test('Stage7 release doc documents the exact contract smoke goal', () => {
  const doc = read('docs/release/STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1_2026-05-06.md');
  assert.match(doc, /STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1/);
  assert.match(doc, /structured API contract/);
  assert.match(doc, /empty prompt/);
  assert.match(doc, /payload_too_large/);
});
