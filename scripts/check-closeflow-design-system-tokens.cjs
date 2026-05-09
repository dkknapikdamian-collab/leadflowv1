#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
function read(rel) {
  const file = path.join(repo, rel);
  if (!fs.existsSync(file)) fail('Missing file: ' + rel);
  return fs.readFileSync(file, 'utf8');
}
function fail(message) {
  console.error('CLOSEFLOW_DESIGN_SYSTEM_TOKENS_VS1_FAIL: ' + message);
  process.exit(1);
}
function assert(condition, message) {
  if (!condition) fail(message);
}

const files = [
  'src/styles/design-system/closeflow-tokens.css',
  'src/styles/design-system/closeflow-layout.css',
  'src/styles/design-system/closeflow-components.css',
  'src/styles/design-system/closeflow-utilities.css',
  'src/styles/design-system/index.css',
  'docs/ui/CLOSEFLOW_DESIGN_SYSTEM_TOKENS_2026-05-09.md',
];
for (const file of files) assert(fs.existsSync(path.join(repo, file)), 'Missing file: ' + file);

const rootIndex = read('src/index.css');
assert(rootIndex.includes("@import './styles/design-system/index.css';") || rootIndex.includes('@import "./styles/design-system/index.css";'), 'src/index.css does not import design-system/index.css');

const dsIndex = read('src/styles/design-system/index.css');
for (const importName of ['closeflow-tokens.css', 'closeflow-layout.css', 'closeflow-components.css', 'closeflow-utilities.css']) {
  assert(dsIndex.includes(importName), 'design-system/index.css missing import: ' + importName);
}

const tokens = read('src/styles/design-system/closeflow-tokens.css');
for (const prefix of [
  '--cf-space-',
  '--cf-radius-',
  '--cf-shadow-',
  '--cf-text-',
  '--cf-surface-',
  '--cf-border-',
  '--cf-metric-',
  '--cf-icon-',
  '--cf-form-',
  '--cf-modal-',
  '--cf-list-',
  '--cf-status-',
  '--cf-finance-',
]) {
  assert(tokens.includes(prefix), 'Missing token prefix: ' + prefix);
}

for (const bridge of ['--cf-legacy-app-bg', '--cf-legacy-action-neutral-text', '--cf-legacy-metric-surface']) {
  assert(tokens.includes(bridge), 'Missing legacy bridge alias: ' + bridge);
}

const components = read('src/styles/design-system/closeflow-components.css');
for (const className of ['.cf-surface-card', '.cf-metric-card', '.cf-form-control', '.cf-modal-surface', '.cf-list-row', '.cf-status-pill']) {
  assert(components.includes(className), 'Missing component contract: ' + className);
}

const layout = read('src/styles/design-system/closeflow-layout.css');
for (const className of ['.cf-page-shell', '.cf-page-grid', '.cf-page-hero']) {
  assert(layout.includes(className), 'Missing layout contract: ' + className);
}

const utilities = read('src/styles/design-system/closeflow-utilities.css');
for (const className of ['.cf-text-primary', '.cf-surface-page', '.cf-border-subtle']) {
  assert(utilities.includes(className), 'Missing utility contract: ' + className);
}

const doc = read('docs/ui/CLOSEFLOW_DESIGN_SYSTEM_TOKENS_2026-05-09.md');
for (const phrase of ['Tokeny minimum', 'Nie przepina ekranow', 'Nie usuwa', 'npm run check:closeflow-design-system-tokens']) {
  assert(doc.includes(phrase), 'Doc missing phrase: ' + phrase);
}

const pkg = JSON.parse(read('package.json'));
assert(pkg.scripts && pkg.scripts['check:closeflow-design-system-tokens'] === 'node scripts/check-closeflow-design-system-tokens.cjs', 'package.json missing check:closeflow-design-system-tokens');

console.log('CLOSEFLOW_DESIGN_SYSTEM_TOKENS_VS1_CHECK_OK');
console.log('token_groups=13');
console.log('design_system_files=' + files.length);
