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

test('assistant uses save word for drafts and otherwise searches app data', () => {
  const source = read('src/server/ai-assistant.ts');

  assertIncludes(source, 'saveCommandPattern', 'explicit save command pattern');
  assertIncludes(source, 'leadCommandPattern', 'lead command pattern');
  assertIncludes(source, 's\u0142owo \u201Ezapisz\u201D tworzy szkic', 'save instruction warning');
  assertIncludes(source, 'Bez \u201Ezapisz\u201D asystent tylko szuka po danych aplikacji', 'search instruction warning');
  assertIncludes(source, 'return buildGlobalAppSearchAnswer(context, rawText);', 'global app search fallback');
});

test('assistant keeps capture before global search fallback', () => {
  const source = read('src/server/ai-assistant.ts');
  const capture = source.indexOf('if (detectCaptureIntent(query))');
  const fallback = source.indexOf('return buildGlobalAppSearchAnswer(context, rawText);');

  assert.ok(capture >= 0, 'capture branch missing');
  assert.ok(fallback >= 0, 'global search fallback missing');
  assert.ok(capture < fallback, 'save/capture branch must run before search fallback');
});

test('save versus search test is included in quiet release gate', () => {
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  assertIncludes(gate, 'tests/ai-assistant-save-vs-search-rule.test.cjs', 'quiet release gate must run save/search test');
});
