const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));

test('Stage18 runtime smoke script exists and checks one host route', () => {
  assert.equal(exists('scripts/smoke-stage18-context-action-runtime-contract.cjs'), true);
  const src = read('scripts/smoke-stage18-context-action-runtime-contract.cjs');
  assert.ok(src.includes('STAGE18_CONTEXT_ACTION_RUNTIME_SMOKE_V1'));
  assert.ok(src.includes('one registry, one host'));
  assert.ok(src.includes('Vercel Hobby API count remains <= 12'));
});

test('Stage18 keeps context action registry as source of truth', () => {
  const registry = read('src/lib/context-action-contract.ts');
  assert.ok(registry.includes("dialogComponent: 'TaskCreateDialog'"));
  assert.ok(registry.includes("dialogComponent: 'EventCreateDialog'"));
  assert.ok(registry.includes("dialogComponent: 'ContextNoteDialog'"));
  assert.ok(registry.includes("persistenceTarget: 'tasks'"));
  assert.ok(registry.includes("persistenceTarget: 'events'"));
  assert.ok(registry.includes("persistenceTarget: 'activities'"));
});

test('Stage18 host supports explicit triggers and legacy text fallback', () => {
  const host = read('src/components/ContextActionDialogs.tsx');
  assert.ok(host.includes('data-context-action-kind'));
  assert.ok(host.includes('buildContextFromExplicitClick'));
  assert.ok(host.includes('dodaj zadanie'));
  assert.ok(host.includes('dodaj wydarzenie'));
  assert.ok(host.includes('dodaj notat'));
});

test('Stage18 package scripts are registered and package.json has no BOM', () => {
  const buffer = fs.readFileSync(path.join(root, 'package.json'));
  assert.notEqual(buffer[0], 0xef);
  const pkg = JSON.parse(buffer.toString('utf8'));
  assert.equal(pkg.scripts['audit:stage18-context-action-runtime-smoke'], 'node scripts/smoke-stage18-context-action-runtime-contract.cjs');
  assert.equal(pkg.scripts['check:stage18-context-action-runtime-smoke-v1'], 'node scripts/check-stage18-context-action-runtime-smoke.cjs');
  assert.equal(pkg.scripts['test:stage18-context-action-runtime-smoke-v1'], 'node --test tests/stage18-context-action-runtime-smoke.test.cjs');
});
