const assert = require('node:assert/strict');
function assertSourceMatches(source, pattern, label) {
  assert.ok(pattern.test(source), label + ': missing ' + pattern);
}

const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Today assistant keeps only off-topic hard blocks and allows full app scope', () => {
  const server = read('src/server/ai-assistant.ts');
  const component = read('src/components/TodayAiAssistant.tsx');

  assert.match(server, /wantsOverview/);
  assert.match(server, /wantsFunnelValue/);
  assert.match(server, /wantsTomorrow/);
  assert.match(server, /buildRelationValueAnswer/);
  assert.match(server, /buildAppOverviewAnswer/);
  assert.match(server, /leadów|lead/);
  assert.match(server, /klientów|klient/);
  assert.match(server, /wartość lejka|wartosc|Wartość lejka/);
  assert.match(component, /Pełny zakres aplikacji/);
  assert.doesNotMatch(server, /co to jest\|kim jest\|ile ma\|ile kosztuje\|jak dziala/);
  assert.doesNotMatch(component, /co to jest\|kim jest\|ile ma\|ile kosztuje\|jak dziala/);
});

test('admin AI usage is exempt in Today assistant and Quick Capture', () => {
  const today = read('src/components/TodayAiAssistant.tsx');
  const capture = read('src/components/QuickAiCapture.tsx');
  const guard = read('src/lib/ai-usage-guard.ts');

  assert.match(guard, /AI_ADMIN_DAILY_COMMAND_LIMIT/);
  assert.match(guard, /adminExempt/);

  for (const source of [today, capture]) {
    assert.match(source, /isAdmin/);
    assert.match(source, /adminExempt/);
    assert.match(source, /Admin AI: bez limitu/);
    assert.match(source, /getAiUsageSnapshot\(aiUsageKey, undefined, \{ isAdmin \}\)/);
    assert.match(source, /registerAiUsage\(aiUsageKey, undefined, \{ isAdmin \}\)/);
  }
});

test('lead capture command from assistant is saved as AI draft, not as final lead', () => {
  const component = read('src/components/TodayAiAssistant.tsx');
  const server = read('src/server/ai-assistant.ts');

  assert.match(component, /AI_ASSISTANT_AUTO_SAVE_LEAD_DRAFT/);
  assert.match(component, /saveAiLeadDraft\(\{ rawText: captureText, source: 'today_assistant' \}\)/);
  assertSourceMatches(server, /Szkic leada zapisany do sprawdzenia/, 'lead draft copy');
  assert.doesNotMatch(component, /insertLeadToSupabase/);
  assert.doesNotMatch(server, /insertLeadToSupabase/);
});

test('AI admin app scope test is included in quiet release gate', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(source.includes("'tests/ai-assistant-admin-and-app-scope.test.cjs'"));
});
