const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('AI usage guard defines daily limit, command length and local storage accounting', () => {
  const source = read('src/lib/ai-usage-guard.ts');

  assert.ok(source.includes('AI_DAILY_COMMAND_LIMIT'), 'daily AI limit must be centralized');
  assert.ok(source.includes('AI_COMMAND_MAX_LENGTH'), 'AI command max length must be centralized');
  assert.ok(source.includes('buildAiUsageKey'), 'usage key must be scoped by workspace/user');
  assert.ok(source.includes('getAiUsageSnapshot'), 'usage snapshot must be readable for UI');
  assert.ok(source.includes('registerAiUsage'), 'successful AI calls must register usage');
  assert.ok(source.includes('localStorage'), 'V1 guard should use browser-local daily accounting');
  assert.ok(source.includes('closeflow:ai-usage'), 'usage key prefix must be product-specific');
});

test('Today assistant blocks off-topic commands locally before spending AI usage', () => {
  const source = read('src/components/TodayAiAssistant.tsx');

  assert.ok(source.includes('CLIENT_OUT_OF_SCOPE_PATTERNS'), 'Today assistant needs client-side off-topic guard');
  assert.ok(source.includes('isClientOutOfScopeCommand(command)'), 'off-topic commands must be detected before API call');
  assert.ok(source.includes('buildClientBlockedAnswer(command)'), 'blocked commands must produce a local answer');
  assert.ok(source.includes('Poza zakresem aplikacji'), 'blocked response must be clear to the user');

  const guardIndex = source.indexOf('isClientOutOfScopeCommand(command)');
  const apiIndex = source.indexOf('askTodayAiAssistant({');
  assert.ok(guardIndex >= 0 && apiIndex >= 0 && guardIndex < apiIndex, 'off-topic guard must run before backend assistant call');
});

test('Today assistant and Quick Capture show and enforce the shared AI usage limit', () => {
  const today = read('src/components/TodayAiAssistant.tsx');
  const capture = read('src/components/QuickAiCapture.tsx');

  for (const source of [today, capture]) {
    assert.ok(source.includes('buildAiUsageKey(workspace?.id, profile?.id)'), 'usage must be scoped by workspace/profile');
    assert.ok(source.includes('getAiUsageSnapshot(aiUsageKey)'), 'component must read current usage');
    assert.ok(source.includes('registerAiUsage(aiUsageKey)'), 'component must register successful AI use');
    assert.ok(source.includes('!usage.canUse'), 'component must block AI when the daily limit is used');
    assert.ok(source.includes('AI_COMMAND_MAX_LENGTH'), 'component must enforce max command length');
  }

  assert.ok(today.includes('data-ai-usage-badge="today-assistant"'), 'Today assistant should display usage badge');
  assert.ok(capture.includes('data-ai-usage-badge="quick-capture"'), 'Quick Capture should display usage badge');
});

test('AI usage guard test is included in quiet release gate', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(source.includes("'tests/ai-usage-limit-guard.test.cjs'"));
});
