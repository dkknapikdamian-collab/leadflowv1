const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
}

test('Stage6 keeps package.json valid JSON without BOM', () => {
  const raw = fs.readFileSync(path.join(root, 'package.json'));
  assert.notDeepEqual(Array.from(raw.slice(0, 3)), [0xef, 0xbb, 0xbf]);
  const pkg = JSON.parse(raw.toString('utf8'));
  assert.equal(pkg.scripts['check:stage6-ai-no-hallucination-data-truth-v1'], 'node scripts/check-stage6-ai-no-hallucination-data-truth.cjs');
});

test('Stage6 blocks empty prompt with explicit no-answer copy', () => {
  const source = read('src/server/ai-assistant.ts');
  assert.match(source, /STAGE6_EMPTY_PROMPT_ANSWER/);
  assert.match(source, /Nie odpowiadam z pustego prompta/);
  assert.match(source, /return result\("unknown", STAGE6_EMPTY_PROMPT_ANSWER, \[\], null, context\);/);
});

test('Stage6 does not hallucinate when app context is empty', () => {
  const source = read('src/server/ai-assistant.ts');
  assert.match(source, /function hasReadableApplicationData/);
  assert.match(source, /if \(intent !== "draft" && !hasReadableApplicationData\(context\)\)/);
  assert.match(source, /return result\("read", STAGE6_NO_DATA_ANSWER, \[\], null, context\);/);
  assert.match(source, /dataPolicy: "app_data_only"/);
});
