const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));

test('Stage7 files are placed at exact repo paths, not nested payload paths', () => {
  assert.equal(exists('scripts/check-stage7-ai-assistant-query-api-contract-smoke.cjs'), true);
  assert.equal(exists('tests/stage7-ai-assistant-query-api-contract-smoke.test.cjs'), true);
  assert.equal(exists('docs/release/STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1_2026-05-06.md'), true);
  assert.equal(exists('api/assistant/query.ts'), true);
  assert.equal(exists('scripts/scripts/check-stage7-ai-assistant-query-api-contract-smoke.cjs'), false);
  assert.equal(exists('tests/tests/stage7-ai-assistant-query-api-contract-smoke.test.cjs'), false);
  assert.equal(exists('docs/docs/release/STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1_2026-05-06.md'), false);
  assert.equal(exists('api/api/assistant/query.ts'), false);
});

test('Stage7B scripts are registered and package.json has no BOM', () => {
  const buffer = fs.readFileSync(path.join(root, 'package.json'));
  assert.notEqual(buffer[0], 0xef);
  const pkg = JSON.parse(buffer.toString('utf8'));
  assert.equal(pkg.scripts['check:stage7b-stage7-payload-copy-repair-v1'], 'node scripts/check-stage7b-stage7-payload-copy-repair.cjs');
  assert.equal(pkg.scripts['test:stage7b-stage7-payload-copy-repair-v1'], 'node --test tests/stage7b-stage7-payload-copy-repair.test.cjs');
});

test('Stage7B release doc documents file-by-file copy repair', () => {
  const doc = read('docs/release/STAGE7B_STAGE7_PAYLOAD_COPY_REPAIR_V1_2026-05-06.md');
  assert.match(doc, /STAGE7B_STAGE7_PAYLOAD_COPY_REPAIR_V1/);
  assert.match(doc, /file-by-file/);
  assert.match(doc, /No nested payload path/);
});
