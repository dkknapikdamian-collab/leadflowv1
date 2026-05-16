#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
function file(rel) { return path.join(repo, rel); }
function read(rel) { return fs.readFileSync(file(rel), 'utf8'); }
function exists(rel) { return fs.existsSync(file(rel)); }
function fail(message) { console.error('CLOSEFLOW_SEMANTIC_VISUAL_REGISTRY_VS2D_FAIL: ' + message); process.exit(1); }
function assert(condition, message) { if (!condition) fail(message); }
function has(rel, needle, label) { assert(read(rel).includes(needle), `${label} missing: ${needle}`); }

const requiredFiles = [
  'src/components/ui-system/semantic-visual-registry.ts',
  'src/components/ui-system/index.ts',
  'docs/ui/CLOSEFLOW_SEMANTIC_VISUAL_REGISTRY_2026-05-09.md',
  'scripts/check-closeflow-semantic-visual-registry.cjs',
  'package.json',
];

for (const rel of requiredFiles) assert(exists(rel), 'missing file: ' + rel);

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
  'payment-overdue',
  'commission-due',
  'commission-paid',
];

const registry = read('src/components/ui-system/semantic-visual-registry.ts');
const index = read('src/components/ui-system/index.ts');
const docs = read('docs/ui/CLOSEFLOW_SEMANTIC_VISUAL_REGISTRY_2026-05-09.md');
const pkg = JSON.parse(read('package.json'));

has('src/components/ui-system/semantic-visual-registry.ts', 'CLOSEFLOW_SEMANTIC_VISUAL_REGISTRY_VS2D', 'registry marker');
has('src/components/ui-system/semantic-visual-registry.ts', 'export const SEMANTIC_VISUAL_MAP', 'semantic map');
has('src/components/ui-system/semantic-visual-registry.ts', 'export type CloseflowSemanticVisualName = keyof typeof SEMANTIC_VISUAL_MAP', 'semantic name type');
has('src/components/ui-system/semantic-visual-registry.ts', 'closeflowSemanticVisualRegistry', 'registry export');
has('src/components/ui-system/semantic-visual-registry.ts', 'getCloseflowSemanticVisual', 'semantic getter');
has('src/components/ui-system/semantic-visual-registry.ts', 'getCloseflowSemanticVisualClasses', 'semantic classes getter');
has('src/components/ui-system/semantic-visual-registry.ts', 'allowedUse', 'allowedUse field');
has('src/components/ui-system/semantic-visual-registry.ts', 'forbiddenUse', 'forbiddenUse field');
has('src/components/ui-system/semantic-visual-registry.ts', 'intent', 'intent field');

assert(index.includes("export * from './semantic-visual-registry';"), 'ui-system index does not export semantic-visual-registry');
assert(pkg.scripts && pkg.scripts['check:closeflow-semantic-visual-registry'] === 'node scripts/check-closeflow-semantic-visual-registry.cjs', 'package script check:closeflow-semantic-visual-registry missing or wrong');

for (const semantic of semantics) {
  assert(registry.includes(`'${semantic}'`), 'semantic missing from registry: ' + semantic);
  assert(docs.includes('`' + semantic + '`'), 'semantic missing from docs: ' + semantic);
}

for (const requiredClass of [
  'text-red-700',
  'bg-red-50',
  'border-red-200',
  'text-rose-700',
  'bg-rose-50',
  'border-rose-200',
  'text-amber-800',
  'bg-amber-50',
  'border-amber-200',
  'text-emerald-700',
  'bg-emerald-50',
  'border-emerald-200',
  'text-indigo-700',
  'text-violet-700',
  'text-blue-700',
]) {
  assert(registry.includes(requiredClass), 'semantic color class missing from registry: ' + requiredClass);
}

for (const requiredDoc of [
  'Czerwony nie jest jeden',
  'danger-delete     = usuwasz dane',
  'alert-error       = system nie mo\u017Ce wykona\u0107 akcji',
  'status-overdue    = termin pracy min\u0105\u0142',
  'payment-overdue   = pieni\u0105dze s\u0105 po terminie',
  'session-logout    = ko\u0144czysz sesj\u0119',
  'Nie przepina hurtowo aktywnych ekran\u00F3w',
]) {
  assert(docs.includes(requiredDoc), 'docs missing required distinction: ' + requiredDoc);
}

assert(registry.indexOf("'danger-delete'") !== registry.indexOf("'alert-error'"), 'danger-delete and alert-error must be separate semantics');
assert(registry.indexOf("'status-overdue'") !== registry.indexOf("'payment-overdue'"), 'status-overdue and payment-overdue must be separate semantics');

console.log('CLOSEFLOW_SEMANTIC_VISUAL_REGISTRY_VS2D_CHECK_OK');
console.log('semantic_count=' + semantics.length);
console.log('legacy_page_migration=not_performed');
