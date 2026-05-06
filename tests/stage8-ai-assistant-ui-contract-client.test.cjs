const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('Stage8 adds a single browser client for assistant query API contract', () => {
  const file = read('src/lib/assistant-query-client.ts');
  assert.match(file, /STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1/);
  assert.match(file, /askAssistantQueryApi/);
  assert.match(file, /normalizeAssistantQueryClientResult/);
  assert.match(file, /fetch\('\/api\/assistant\/query'/);
  assert.match(file, /credentials: 'same-origin'/);
  assert.match(file, /dataPolicy: 'app_data_only'/);
  assert.match(file, /if \(!query\)/);
});

test('TodayAiAssistant uses helper instead of direct endpoint fetch', () => {
  const file = read('src/components/TodayAiAssistant.tsx');
  assert.match(file, /askAssistantQueryApi/);
  assert.match(file, /AssistantQueryClientResult/);
  assert.doesNotMatch(file, /fetch\(["']\/api\/assistant\/query["']/);
  assert.match(file, /data-stage8="STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1"/);
  assert.match(file, /data-assistant-data-policy/);
});

test('Stage8 scripts are registered and package.json has no BOM', () => {
  const raw = fs.readFileSync(path.join(root, 'package.json'));
  assert.notEqual(raw[0], 0xef);
  const pkg = JSON.parse(raw.toString('utf8'));
  assert.equal(pkg.scripts['check:stage8-ai-assistant-ui-contract-client-v1'], 'node scripts/check-stage8-ai-assistant-ui-contract-client.cjs');
  assert.equal(pkg.scripts['test:stage8-ai-assistant-ui-contract-client-v1'], 'node --test tests/stage8-ai-assistant-ui-contract-client.test.cjs');
});
