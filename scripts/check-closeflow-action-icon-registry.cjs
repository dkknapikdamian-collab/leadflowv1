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
  console.error('CLOSEFLOW_ACTION_ICON_REGISTRY_VS2C_MINI_FAIL: ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const requiredFiles = [
  'src/components/ui-system/action-icon-registry.ts',
  'src/components/ui-system/ActionIcon.tsx',
  'src/components/ui-system/index.ts',
  'docs/ui/CLOSEFLOW_ACTION_ICON_REGISTRY_2026-05-09.md',
  'scripts/check-closeflow-action-icon-registry.cjs',
  'package.json',
];

for (const rel of requiredFiles) {
  assert(exists(rel), 'missing file: ' + rel);
}

const registry = read('src/components/ui-system/action-icon-registry.ts');
const component = read('src/components/ui-system/ActionIcon.tsx');
const index = read('src/components/ui-system/index.ts');
const docs = read('docs/ui/CLOSEFLOW_ACTION_ICON_REGISTRY_2026-05-09.md');
const pkg = JSON.parse(read('package.json'));

assert(registry.includes('CLOSEFLOW_ACTION_ICON_REGISTRY_VS2C_MINI'), 'registry marker missing');
assert(component.includes('CLOSEFLOW_ACTION_ICON_REGISTRY_VS2C_MINI_COMPONENT'), 'ActionIcon marker missing');
assert(component.includes('export function ActionIcon'), 'ActionIcon export missing');
assert(index.includes("export * from './ActionIcon';"), 'ui-system index does not export ActionIcon');
assert(index.includes("export * from './action-icon-registry';"), 'ui-system index does not export action-icon-registry');
assert(pkg.scripts && pkg.scripts['check:closeflow-action-icon-registry'], 'package script check:closeflow-action-icon-registry missing');
assert(docs.includes('VS-2C-mini'), 'docs missing VS-2C-mini label');

const actions = [
  'add',
  'edit',
  'delete',
  'restore',
  'search',
  'save',
  'cancel',
  'back',
  'copy',
  'open',
  'archive',
  'filter',
  'settings',
];

for (const action of actions) {
  const keyNeedle = action + ':';
  const unionNeedle = "'" + action + "'";
  assert(registry.includes(keyNeedle) || registry.includes(unionNeedle), 'action missing from registry: ' + action);
  assert(component.includes(action) || registry.includes(action), 'action not wired: ' + action);
}

for (const alias of [
  'AddActionIcon',
  'EditActionIcon',
  'DeleteActionIcon',
  'RestoreActionIcon',
  'SearchActionIcon',
  'SaveActionIcon',
  'CancelActionIcon',
  'BackActionIcon',
  'CopyActionIcon',
  'OpenActionIcon',
  'ArchiveActionIcon',
  'FilterActionIcon',
  'SettingsActionIcon',
]) {
  assert(component.includes('export const ' + alias), 'bound action alias missing: ' + alias);
}

// Foundation-only stage. Do not enforce migration of active screens here.
// That migration is split into VS-2C-1..VS-2C-4.

console.log('CLOSEFLOW_ACTION_ICON_REGISTRY_VS2C_MINI_CHECK_OK');
console.log('action_count=' + actions.length);
console.log('migration_enforcement=deferred');
