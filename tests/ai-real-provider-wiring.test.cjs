const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('shared real AI provider is backend-only and uses env secrets', () => {
  const provider = read('src/server/ai-provider.ts');
  assert.match(provider, /GEMINI_API_KEY/);
  assert.match(provider, /AI_ENABLED/);
  assert.match(provider, /tryGenerateJsonWithAiProvider/);
  assert.match(provider, /responseMimeType:\s*'application\/json'/);
  assert.doesNotMatch(provider, /localStorage|window|document/);
});

test('AI follow-up and next-action use model provider with rule fallback', () => {
  const followup = read('src/server/ai-followup.ts');
  const nextAction = read('src/server/ai-next-action.ts');

  assert.match(followup, /tryGenerateJsonWithAiProvider/);
  assert.match(followup, /buildModelBackedFollowupDraft/);
  assert.match(followup, /provider:\s*modelResult\.provider/);
  assert.match(followup, /provider:\s*'rule_parser'/);

  assert.match(nextAction, /tryGenerateJsonWithAiProvider/);
  assert.match(nextAction, /buildModelBackedNextAction/);
  assert.match(nextAction, /provider:\s*modelResult\.provider/);
  assert.match(nextAction, /provider:\s*'rule_parser'/);
});

test('admin AI diagnostics expose provider status but never raw secrets', () => {
  const config = read('src/server/ai-config.ts');
  assert.match(config, /buildAiProviderRuntimeStatus/);
  assert.match(config, /providerRuntime/);
  assert.doesNotMatch(config, /process\.env\.GEMINI_API_KEY\s*[},]/);
});

test('real AI provider wiring test is included in quiet release gate', () => {
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  assert.match(gate, /tests\/ai-real-provider-wiring\.test\.cjs/);
});
