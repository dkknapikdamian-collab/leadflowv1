const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
}
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { console.error(`FAIL ${message}`); process.exitCode = 1; }
function mustContain(rel, needle) {
  const text = read(rel);
  if (text.includes(needle)) pass(`${rel} contains ${needle}`);
  else fail(`${rel} missing ${needle}`);
}
function mustNotStartWithBom(rel) {
  const raw = fs.readFileSync(path.join(root, rel));
  if (raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf) fail(`${rel} starts with UTF-8 BOM`);
  else pass(`${rel} has no UTF-8 BOM`);
}

mustNotStartWithBom('package.json');
mustContain('src/server/ai-assistant.ts', 'STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1');
mustContain('src/server/ai-assistant.ts', 'STAGE6_EMPTY_PROMPT_ANSWER');
mustContain('src/server/ai-assistant.ts', 'STAGE6_NO_DATA_ANSWER');
mustContain('src/server/ai-assistant.ts', 'function hasReadableApplicationData');
mustContain('src/server/ai-assistant.ts', 'dataPolicy: "app_data_only"');
mustContain('src/server/ai-assistant.ts', 'if (intent !== "draft" && !hasReadableApplicationData(context))');
mustContain('src/server/ai-assistant.ts', 'return result("read", STAGE6_NO_DATA_ANSWER, [], null, context);');
mustContain('src/server/ai-assistant.ts', 'return result("unknown", STAGE6_EMPTY_PROMPT_ANSWER, [], null, context);');
mustContain('package.json', 'check:stage6-ai-no-hallucination-data-truth-v1');
mustContain('package.json', 'test:stage6-ai-no-hallucination-data-truth-v1');
mustContain('docs/release/STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1_2026-05-06.md', 'STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1');
mustContain('docs/release/STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1_2026-05-06.md', 'Nie odpowiada z pustego prompta');
mustContain('docs/release/STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1_2026-05-06.md', 'Nie zmy\u015Bla przy pustym kontek\u015Bcie');

if (!process.exitCode) pass('STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1');
