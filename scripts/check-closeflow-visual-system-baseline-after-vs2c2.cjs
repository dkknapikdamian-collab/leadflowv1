#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(repo, rel));
}

function fail(message) {
  console.error('CLOSEFLOW_VISUAL_SYSTEM_BASELINE_AFTER_VS2C2_FAIL: ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function walk(dir, out = []) {
  const abs = path.join(repo, dir);
  if (!fs.existsSync(abs)) return out;

  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
      walk(rel, out);
      continue;
    }
    if (/\.(tsx?|jsx?)$/.test(entry.name)) out.push(rel);
  }
  return out;
}

const requiredFiles = [
  'docs/ui/CLOSEFLOW_VS2C2_DEFERRED_2026-05-09.md',
  'docs/ui/CLOSEFLOW_VISUAL_SYSTEM_BASELINE_AFTER_VS2C2_2026-05-09.md',
  'src/components/ui-system/action-icon-registry.ts',
  'src/components/ui-system/ActionIcon.tsx',
  'src/components/ui-system/icon-registry.ts',
  'src/components/ui-system/EntityIcon.tsx',
  'src/components/ui-system/index.ts',
  'scripts/check-closeflow-action-icon-registry.cjs',
  'scripts/check-closeflow-vs2c1-action-icons-components.cjs',
  'scripts/check-closeflow-entity-icon-registry.cjs',
  'scripts/check-closeflow-visual-system-baseline-after-vs2c2.cjs',
  'package.json',
];

for (const rel of requiredFiles) {
  assert(exists(rel), 'missing file: ' + rel);
}

const deferred = read('docs/ui/CLOSEFLOW_VS2C2_DEFERRED_2026-05-09.md');
const baseline = read('docs/ui/CLOSEFLOW_VISUAL_SYSTEM_BASELINE_AFTER_VS2C2_2026-05-09.md');
const index = read('src/components/ui-system/index.ts');
const pkg = JSON.parse(read('package.json'));

assert(deferred.includes('DEFERRED'), 'VS-2C-2 deferred document must keep DEFERRED status');
assert(deferred.includes('Do not touch large legacy page imports with broad regex scripts'), 'VS-2C-2 safety rule missing');
assert(baseline.includes('CLOSEFLOW_VISUAL_SYSTEM_BASELINE_AFTER_VS2C2'), 'baseline marker missing');
assert(baseline.includes('VS-2C-2: deferred'), 'baseline must mark VS-2C-2 as deferred');
assert(baseline.includes('VS-2D: next'), 'baseline must point to VS-2D as next');
assert(index.includes("export * from './ActionIcon';"), 'ActionIcon export missing');
assert(index.includes("export * from './action-icon-registry';"), 'action-icon-registry export missing');
assert(index.includes("export * from './EntityIcon';"), 'EntityIcon export missing');
assert(index.includes("export * from './icon-registry';"), 'icon-registry export missing');

const scripts = pkg.scripts || {};
for (const scriptName of [
  'check:closeflow-action-icon-registry',
  'check:closeflow-vs2c1-action-icons-components',
  'check:closeflow-entity-icon-registry',
  'check:closeflow-visual-system-baseline-after-vs2c2',
]) {
  assert(scripts[scriptName], 'package script missing: ' + scriptName);
}

const scanFiles = [...walk('src/pages'), ...walk('src/components')]
  .filter((rel) => !rel.includes('/ui-system/semantic-visual-registry.ts'));

const colorPattern = /\b(?:text|bg|border|ring|from|to|via|decoration)-(?:red|rose|amber|yellow|green|emerald)-\d{2,3}\b/g;
const colorHits = [];
for (const rel of scanFiles) {
  const text = read(rel);
  const matches = text.match(colorPattern) || [];
  for (const match of matches) {
    colorHits.push({ rel, match });
  }
}

const byClass = new Map();
for (const hit of colorHits) {
  byClass.set(hit.match, (byClass.get(hit.match) || 0) + 1);
}

console.log('CLOSEFLOW_VISUAL_SYSTEM_BASELINE_AFTER_VS2C2_CHECK_OK');
console.log('shipped=VS-0,VS-1,VS-2,VS-2B,VS-2C-mini,VS-2C-1');
console.log('deferred=VS-2C-2');
console.log('next=VS-2D');
console.log('legacy_semantic_color_occurrences_non_blocking=' + colorHits.length);
console.log(
  'legacy_semantic_color_classes_non_blocking=' +
    [...byClass.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, count]) => key + ':' + count)
      .join(','),
);
