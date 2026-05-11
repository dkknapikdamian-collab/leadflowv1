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
  console.error('CLOSEFLOW_SEMANTIC_VISUAL_REGISTRY_VS2D_FAIL: ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const requiredFiles = [
  'src/components/ui-system/semantic-visual-registry.ts',
  'src/components/ui-system/index.ts',
  'docs/ui/CLOSEFLOW_SEMANTIC_VISUAL_REGISTRY_2026-05-09.md',
  'scripts/check-closeflow-semantic-visual-registry.cjs',
  'package.json',
];

for (const rel of requiredFiles) {
  assert(exists(rel), 'missing file: ' + rel);
}

const registry = read('src/components/ui-system/semantic-visual-registry.ts');
const index = read('src/components/ui-system/index.ts');
const docs = read('docs/ui/CLOSEFLOW_SEMANTIC_VISUAL_REGISTRY_2026-05-09.md');
const pkg = JSON.parse(read('package.json'));

assert(registry.includes('CLOSEFLOW_SEMANTIC_VISUAL_REGISTRY_VS2D'), 'registry marker missing');
assert(index.includes("export * from './semantic-visual-registry';"), 'ui-system index does not export semantic-visual-registry');
assert(pkg.scripts && pkg.scripts['check:closeflow-semantic-visual-registry'], 'package script check:closeflow-semantic-visual-registry missing');
assert(docs.includes('VS-2D'), 'docs missing VS-2D label');
assert(docs.includes('Nie migrować legacy pages hurtowo'), 'docs missing no bulk legacy migration rule');

const semantics = [
  'danger-delete',
  'session-logout',
  'alert-error',
  'alert-warning',
  'status-open',
  'status-done',
  'status-overdue',
  'entity-client',
  'entity-lead',
  'entity-case',
  'payment-paid',
  'payment-due',
  'commission-due',
  'commission-paid',
];

for (const semantic of semantics) {
  assert(registry.includes("'" + semantic + "'"), 'semantic missing from registry: ' + semantic);
  assert(docs.includes(semantic), 'semantic missing from docs: ' + semantic);
}

for (const requiredExport of [
  'CloseflowSemanticVisualName',
  'CloseflowSemanticVisualTone',
  'CloseflowSemanticVisualClasses',
  'CloseflowSemanticVisualEntry',
  'closeflowSemanticVisualRegistry',
  'getCloseflowSemanticVisual',
  'getCloseflowSemanticVisualClasses',
]) {
  assert(registry.includes(requiredExport), 'registry export missing: ' + requiredExport);
}

for (const requiredClass of [
  'text-red-700',
  'bg-red-50',
  'border-red-200',
  'text-amber-800',
  'bg-amber-50',
  'border-amber-200',
  'text-emerald-700',
  'bg-emerald-50',
  'border-emerald-200',
]) {
  assert(registry.includes(requiredClass), 'semantic color class missing from registry: ' + requiredClass);
}

assert(registry.includes('forbiddenUse'), 'registry must document forbiddenUse');
assert(registry.includes('allowedUse'), 'registry must document allowedUse');

console.log('CLOSEFLOW_SEMANTIC_VISUAL_REGISTRY_VS2D_CHECK_OK');
console.log('semantic_count=' + semantics.length);
console.log('legacy_page_migration=not_performed');
