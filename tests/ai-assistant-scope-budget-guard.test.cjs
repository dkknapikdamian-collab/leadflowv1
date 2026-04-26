const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Today AI assistant has hard scope and cost guards before any model usage', () => {
  const source = read('src/server/ai-assistant.ts');

  assert.ok(source.includes('ASSISTANT_MAX_COMMAND_LENGTH'), 'assistant should cap command length');
  assert.ok(source.includes('OUT_OF_SCOPE_BLOCK_PATTERNS'), 'assistant should define obvious out-of-scope blockers');
  assert.ok(source.includes('isClearlyOutOfScope'), 'assistant should check obvious off-topic questions');
  assert.ok(source.includes('Poza zakresem aplikacji'), 'assistant should return scoped block copy');
  assert.ok(source.includes('hardBlock: true'), 'assistant should expose hardBlock for UI and tests');
  assert.ok(source.includes('pogoda'), 'weather questions must be blocked');
  assert.ok(source.includes('kosmos'), 'general knowledge questions must be blocked');
  assert.ok(source.includes('wiersz'), 'creative off-topic prompts must be blocked');
  assert.ok(!source.includes('tryGeminiAssistant'), 'assistant must not call a model before scope and quota are ready');
});

test('AI assistant scope guard test is included in quiet release gate', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(source.includes("'tests/ai-assistant-scope-budget-guard.test.cjs'"));
});
