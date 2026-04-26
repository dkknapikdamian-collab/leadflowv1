const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('Cloudflare AI provider is wired as backend-only model provider', () => {
  const provider = read('src/server/ai-provider.ts');

  assert.ok(provider.includes("type AiProviderName = 'gemini' | 'cloudflare'"));
  assert.ok(provider.includes('CLOUDFLARE_ACCOUNT_ID'));
  assert.ok(provider.includes('CLOUDFLARE_API_TOKEN'));
  assert.ok(provider.includes('CLOUDFLARE_AI_MODEL'));
  assert.ok(provider.includes('api.cloudflare.com/client/v4/accounts'));
  assert.ok(provider.includes('Authorization'));
  assert.ok(provider.includes('generateWithCloudflare'));
  assert.ok(provider.includes('orderedProviderCandidates'));
  assert.doesNotMatch(provider, /localStorage|window|document/);
});

test('AI provider runtime exposes Cloudflare status without leaking secrets', () => {
  const provider = read('src/server/ai-provider.ts');
  const config = read('src/server/ai-config.ts');

  assert.ok(provider.includes('cloudflareConfigured'));
  assert.ok(provider.includes('cloudflareAvailable'));
  assert.ok(provider.includes('cloudflareModel'));
  assert.ok(config.includes('buildAiProviderRuntimeStatus'));
  assert.doesNotMatch(config, /process\.env\.CLOUDFLARE_API_TOKEN\s*[},]/);
});

test('Cloudflare AI provider test is included in quiet release gate', () => {
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(gate.includes('tests/ai-cloudflare-provider-wiring.test.cjs'));
});
