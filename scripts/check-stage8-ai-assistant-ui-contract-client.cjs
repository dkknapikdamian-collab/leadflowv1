const fs = require('fs');
const path = require('path');

const root = process.cwd();
let failed = false;

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function pass(message) {
  console.log('PASS ' + message);
}

function fail(message) {
  failed = true;
  console.error('FAIL ' + message);
}

function contains(rel, needle) {
  const text = read(rel);
  if (text.includes(needle)) pass(`${rel} contains ${needle}`);
  else fail(`${rel} missing ${needle}`);
}

function notContains(rel, needle) {
  const text = read(rel);
  if (!text.includes(needle)) pass(`${rel} does not contain ${needle}`);
  else fail(`${rel} still contains ${needle}`);
}

const pkgRaw = fs.readFileSync(path.join(root, 'package.json'));
if (pkgRaw[0] !== 0xef) pass('package.json has no UTF-8 BOM');
else fail('package.json has UTF-8 BOM');

const pkg = JSON.parse(pkgRaw.toString('utf8'));
if (pkg.scripts && pkg.scripts['check:stage8-ai-assistant-ui-contract-client-v1']) pass('package.json exposes Stage8 check script');
else fail('package.json missing Stage8 check script');
if (pkg.scripts && pkg.scripts['test:stage8-ai-assistant-ui-contract-client-v1']) pass('package.json exposes Stage8 test script');
else fail('package.json missing Stage8 test script');

contains('src/lib/assistant-query-client.ts', 'STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1');
contains('src/lib/assistant-query-client.ts', "fetch('/api/assistant/query'");
contains('src/lib/assistant-query-client.ts', "credentials: 'same-origin'");
contains('src/lib/assistant-query-client.ts', "dataPolicy: 'app_data_only'");
contains('src/lib/assistant-query-client.ts', 'normalizeAssistantQueryClientResult');
contains('src/lib/assistant-query-client.ts', 'if (!query)');

contains('src/components/TodayAiAssistant.tsx', 'askAssistantQueryApi');
contains('src/components/TodayAiAssistant.tsx', 'AssistantQueryClientResult');
contains('src/components/TodayAiAssistant.tsx', 'data-stage8="STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1"');
contains('src/components/TodayAiAssistant.tsx', 'data-assistant-data-policy');
notContains('src/components/TodayAiAssistant.tsx', 'fetch("/api/assistant/query"');
notContains('src/components/TodayAiAssistant.tsx', "fetch('/api/assistant/query'");

contains('docs/release/STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1_2026-05-06.md', 'STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1');
contains('docs/release/STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1_2026-05-06.md', 'FAIL w checku blokuje commit/push');

if (!fs.existsSync(path.join(root, 'scripts/check-stage7-ai-assistant-query-api-contract-smoke.cjs'))) fail('Stage7 check script missing');
else pass('Stage7 check script exists');
if (!fs.existsSync(path.join(root, 'tests/stage7-ai-assistant-query-api-contract-smoke.test.cjs'))) fail('Stage7 test script missing');
else pass('Stage7 test script exists');

if (failed) process.exit(1);
console.log('PASS STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1');
