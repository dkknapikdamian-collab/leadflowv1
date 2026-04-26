const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function assertIncludes(source, needle, message) {
  assert.ok(source.includes(needle), message + ': missing ' + needle);
}

function assertBefore(source, firstNeedle, secondNeedle, message) {
  const first = source.indexOf(firstNeedle);
  const second = source.indexOf(secondNeedle);
  assert.ok(first >= 0, message + ': missing first marker');
  assert.ok(second >= 0, message + ': missing second marker');
  assert.ok(first < second, message + ': wrong order');
}

test('assistant recognizes value questions before contact lookup', () => {
  const source = read('src/server/ai-assistant.ts');

  assert.ok(/najdrozsz|najdroższ|najcenniejsz|wartosc|wartość|lejek|lejka/u.test(source), 'value question keywords missing');
  assertBefore(source, 'if (wantsFunnelValue(query))', 'if (wantsLookup(query))', 'value questions must be routed before lookup');
});

test('assistant global app search scans all core app records and broad fields', () => {
  const source = read('src/server/ai-assistant.ts');

  assertIncludes(source, "'global_app_search'", 'global app search intent');
  assertIncludes(source, 'function getSearchText(record', 'search text builder');
  assertIncludes(source, 'Object.entries(record)', 'broad record scan');
  assertIncludes(source, 'safeArray(context.leads)', 'lead records scan');
  assertIncludes(source, 'safeArray((context as any).clients)', 'client records scan');
  assertIncludes(source, 'safeArray(context.cases)', 'case records scan');
  assertIncludes(source, 'safeArray(context.tasks)', 'task records scan');
  assertIncludes(source, 'safeArray(context.events)', 'event records scan');
  assertIncludes(source, 'phone|telefon|tag|status|source', 'broad contact fields scan');
});

test('assistant uses global app search as final in-app fallback', () => {
  const source = read('src/server/ai-assistant.ts');

  assertIncludes(source, 'function buildGlobalAppSearchAnswer', 'global app search answer builder');
  assertIncludes(source, 'return buildGlobalAppSearchAnswer(context, rawText);', 'global search fallback call');
  assertBefore(source, 'if (wantsLookup(query))', 'return buildGlobalAppSearchAnswer(context, rawText);', 'global search should run after specific lookup routing');
  assertIncludes(source, 'function buildUnknown', 'unknown answer remains available for empty commands and defensive responses');
});

test('global app search test is included in quiet release gate', () => {
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  assertIncludes(gate, 'tests/ai-assistant-global-app-search.test.cjs', 'quiet release gate must run global app search test');
});

