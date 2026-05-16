const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('AI config endpoint exposes only diagnostics and never raw secret values', () => {
  const source = read('src/server/ai-config.ts');

  assert.doesNotMatch(source, /apiKey\s*:/i);
  assert.doesNotMatch(source, /tokenValue\s*:/i);
  assert.doesNotMatch(source, /secretValue\s*:/i);
  assert.doesNotMatch(source, /process\.env\.GEMINI_API_KEY\s*[,}]/);
  assert.doesNotMatch(source, /process\.env\.CLOUDFLARE_API_TOKEN\s*[,}]/);
  assert.match(source, /hasEnv\('GEMINI_API_KEY'\)/);
  assert.match(source, /hasEnv\('CLOUDFLARE_API_TOKEN'\)/);
});

test('AI admin page describes backend-only key storage', () => {
  const source = read('src/pages/AdminAiSettings.tsx');

  assert.match(source, /Klucze s\u0105 sprawdzane po stronie backendu/);
  assert.match(source, /Frontend dostaje tylko informacj\u0119/);
  assert.doesNotMatch(source, /<Input[^>]+GEMINI_API_KEY/);
  assert.doesNotMatch(source, /<Input[^>]+CLOUDFLARE_API_TOKEN/);
});
