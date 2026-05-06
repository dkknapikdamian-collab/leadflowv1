const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('Stage13 registers Stage11 and Stage12 package scripts safely', () => {
  const buffer = fs.readFileSync(path.join(root, 'package.json'));
  assert.notEqual(buffer[0], 0xef);
  const pkg = JSON.parse(buffer.toString('utf8'));
  assert.equal(pkg.scripts['check:stage11-vercel-hobby-function-budget-guard-v1'], 'node scripts/check-stage11-vercel-hobby-function-budget-guard.cjs');
  assert.equal(pkg.scripts['test:stage11-vercel-hobby-function-budget-guard-v1'], 'node --test tests/stage11-vercel-hobby-function-budget-guard.test.cjs');
  assert.equal(pkg.scripts['audit:stage12-ai-assistant-vercel-release-evidence'], 'node scripts/print-stage12-ai-assistant-vercel-release-evidence.cjs');
  assert.equal(pkg.scripts['test:stage12-ai-assistant-vercel-release-evidence-v1'], 'node --test tests/stage12-ai-assistant-vercel-release-evidence.test.cjs');
  assert.ok(pkg.scripts['verify:stage11-stage12-ai-vercel-evidence'].includes('check:stage11-vercel-hobby-function-budget-guard-v1'));
});

test('Stage13 release note documents why package scripts are local-safe', () => {
  const doc = read('docs/release/STAGE13_PACKAGE_JSON_STAGE11_12_SCRIPT_REGISTRATION_V1_2026-05-06.md');
  assert.match(doc, /STAGE13_PACKAGE_JSON_STAGE11_12_SCRIPT_REGISTRATION_V1/);
  assert.match(doc, /JSON\.parse/);
  assert.match(doc, /bez BOM/);
});
