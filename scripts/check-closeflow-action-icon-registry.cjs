#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repo = process.cwd();

function file(rel) {
  return path.join(repo, rel);
}

function read(rel) {
  return fs.readFileSync(file(rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(file(rel));
}

function fail(message) {
  console.error('CLOSEFLOW_ACTION_ICON_REGISTRY_VS2C_FAIL: ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function has(rel, needle, label) {
  assert(read(rel).includes(needle), `${label} missing: ${needle}`);
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
  'refresh',
  'calendar',
  'note',
  'task',
];

const registry = read('src/components/ui-system/action-icon-registry.ts');
const component = read('src/components/ui-system/ActionIcon.tsx');
const index = read('src/components/ui-system/index.ts');
const docs = read('docs/ui/CLOSEFLOW_ACTION_ICON_REGISTRY_2026-05-09.md');
const entityRegistry = read('src/components/ui-system/icon-registry.ts');
const pkg = JSON.parse(read('package.json'));

has('src/components/ui-system/action-icon-registry.ts', 'export const ACTION_ICON_MAP', 'action icon registry');
has('src/components/ui-system/action-icon-registry.ts', 'export type CloseflowActionIconName = keyof typeof ACTION_ICON_MAP', 'action icon type');
has('src/components/ui-system/action-icon-registry.ts', 'export const ACTION_ICON_REGISTRY', 'action icon registry entries');
has('src/components/ui-system/action-icon-registry.ts', 'export const closeflowActionIconRegistry = ACTION_ICON_REGISTRY', 'legacy mini alias');

has('src/components/ui-system/ActionIcon.tsx', 'export function ActionIcon', 'ActionIcon export');
has('src/components/ui-system/ActionIcon.tsx', 'action: keyof typeof ACTION_ICON_MAP', 'ActionIcon action API');
has('src/components/ui-system/ActionIcon.tsx', 'data-cf-action-icon={action}', 'ActionIcon data marker');
has('src/components/ui-system/ActionIcon.tsx', 'data-cf-action-icon-size={size}', 'ActionIcon size marker');
has('src/components/ui-system/ActionIcon.tsx', 'data-cf-action-icon-tone={tone}', 'ActionIcon tone marker');

assert(index.includes("export * from './ActionIcon';"), 'ui-system index does not export ActionIcon');
assert(index.includes("export * from './action-icon-registry';"), 'ui-system index does not export action-icon-registry');

for (const action of actions) {
  assert(registry.includes(`${action}:`), 'ACTION_ICON_MAP missing action: ' + action);
  assert(docs.includes('`' + action + '`'), 'Docs missing action: ' + action);
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
  'RefreshActionIcon',
  'CalendarActionIcon',
  'NoteActionIcon',
  'TaskActionIcon',
]) {
  assert(component.includes('export const ' + alias), 'bound action alias missing: ' + alias);
}

for (const needle of [
  'Jak zmieniÄ‡ ikonÄ™ kosza globalnie',
  'Nie przepina masowo aktywnych ekranĂłw',
  'osobny od ikon encji',
  'ACTION_ICON_MAP',
]) {
  assert(docs.includes(needle), 'Docs missing required note: ' + needle);
}

const entityOnlyKeys = ['client:', 'lead:', 'case:', 'payment:', 'billing:'];
for (const entityKey of entityOnlyKeys) {
  assert(!registry.includes(entityKey), 'Entity key leaked into action registry: ' + entityKey);
}

const actionOnlyKeys = ['add:', 'delete:', 'search:', 'refresh:', 'note:'];
for (const actionKey of actionOnlyKeys) {
  assert(!entityRegistry.includes(actionKey), 'Action key leaked into entity registry: ' + actionKey);
}

assert(pkg.scripts && pkg.scripts['check:closeflow-action-icon-registry'] === 'node scripts/check-closeflow-action-icon-registry.cjs', 'package script check:closeflow-action-icon-registry missing or wrong');

// Foundation-only stage. Do not enforce migration of active screens here.
// Screen migration is split into follow-up stages after the registry is stable.

console.log('CLOSEFLOW_ACTION_ICON_REGISTRY_VS2C_CHECK_OK');
console.log('action_count=' + actions.length);
console.log('migration_enforcement=deferred');