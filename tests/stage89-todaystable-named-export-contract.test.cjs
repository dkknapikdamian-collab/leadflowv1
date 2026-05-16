const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function countMatches(source, regex) {
  return [...source.matchAll(regex)].length;
}

test('TodayStable uses explicit named and default export without duplicate export declarations', () => {
  const source = read('src/pages/TodayStable.tsx');

  assert.match(source, /\bfunction\s+TodayStable\s*\(/, 'TodayStable should be a normal local function binding.');
  assert.doesNotMatch(source, /\bexport\s+function\s+TodayStable\s*\(/, 'Do not combine export function with export { TodayStable }; it creates duplicate named export.');
  assert.doesNotMatch(source, /\bexport\s+default\s+function\s+TodayStable\s*\(/, 'Use explicit export default TodayStable at the bottom, not inline default function export.');

  assert.equal(countMatches(source, /^\s*export\s*\{\s*TodayStable\s*\}\s*;\s*$/gm), 1, 'Expected exactly one named export line: export { TodayStable };');
  assert.equal(countMatches(source, /^\s*export\s+default\s+TodayStable\s*;\s*$/gm), 1, 'Expected exactly one default export line: export default TodayStable;');
  assert.match(source, /CLOSEFLOW_STAGE89_TODAYSTABLE_EXPLICIT_EXPORT_CONTRACT/);
});

test('App lazy route still requests TodayStable from TodayStable module', () => {
  const app = read('src/App.tsx');
  assert.match(app, /const\s+Today\s*=\s*lazyPage\(\s*\(\)\s*=>\s*import\(\s*['"]\.\/pages\/TodayStable['"]\s*\)\s*,\s*['"]TodayStable['"]\s*\)/);
});

test('quiet release gate includes lazy export guards', () => {
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  assert.match(gate, /tests\/stage88-lazy-page-export-contract\.test\.cjs/);
  assert.match(gate, /tests\/stage89-todaystable-named-export-contract\.test\.cjs/);
});
