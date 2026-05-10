#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
function file(rel) { return path.join(repo, rel); }
function read(rel) { return fs.readFileSync(file(rel), 'utf8'); }
function exists(rel) { return fs.existsSync(file(rel)); }
function fail(message) { console.error('CLOSEFLOW_ENTITY_ICON_REGISTRY_VS2B_FAIL: ' + message); process.exit(1); }
function assert(condition, message) { if (!condition) fail(message); }
function has(rel, needle, label) {
  assert(read(rel).includes(needle), `${label} missing: ${needle}`);
}

const requiredFiles = [
  'src/components/ui-system/EntityIcon.tsx',
  'src/components/ui-system/icon-registry.ts',
  'src/styles/design-system/closeflow-icons.css',
  'docs/ui/CLOSEFLOW_ENTITY_ICON_REGISTRY_2026-05-09.md',
  'scripts/check-closeflow-entity-icon-registry.cjs',
];

for (const rel of requiredFiles) assert(exists(rel), 'Missing file: ' + rel);

const requiredEntities = [
  'client',
  'lead',
  'case',
  'task',
  'event',
  'activity',
  'payment',
  'commission',
  'ai',
  'template',
  'notification',
  'settings',
  'billing',
];

const registry = read('src/components/ui-system/icon-registry.ts');
has('src/components/ui-system/icon-registry.ts', 'export const ENTITY_ICON_MAP', 'icon registry');
has('src/components/ui-system/icon-registry.ts', 'export type CloseflowEntityIconName = keyof typeof ENTITY_ICON_MAP', 'icon registry type');
has('src/components/ui-system/icon-registry.ts', 'export const CLOSEFLOW_ENTITY_ICON_REGISTRY = ENTITY_ICON_MAP', 'compat registry alias');

const docs = read('docs/ui/CLOSEFLOW_ENTITY_ICON_REGISTRY_2026-05-09.md');
const css = read('src/styles/design-system/closeflow-icons.css');
const entityIcon = read('src/components/ui-system/EntityIcon.tsx');

for (const entity of requiredEntities) {
  assert(registry.includes(`${entity}:`), 'ENTITY_ICON_MAP missing entity: ' + entity);
  assert(docs.includes('`' + entity + '`'), 'Docs missing entity: ' + entity);
  assert(css.includes(`--cf-entity-icon-${entity}`), 'CSS missing variable for entity: ' + entity);
  assert(css.includes(`.cf-entity-icon-${entity}`), 'CSS missing class for entity: ' + entity);
}

for (const needle of [
  'entity: keyof typeof ENTITY_ICON_MAP',
  "size?: EntityIconSize",
  "tone?: EntityIconTone",
  "'sm' | 'md' | 'lg'",
  "'default' | 'soft' | 'strong'",
  'data-cf-entity-icon={entity}',
  'data-cf-entity-icon-size={size}',
  'data-cf-entity-icon-tone={tone}',
]) {
  assert(entityIcon.includes(needle), 'EntityIcon API missing: ' + needle);
}

for (const adapter of [
  'ClientEntityIcon',
  'LeadEntityIcon',
  'CaseEntityIcon',
  'TaskEntityIcon',
  'EventEntityIcon',
  'ActivityEntityIcon',
  'PaymentEntityIcon',
  'CommissionEntityIcon',
  'AiEntityIcon',
  'TemplateEntityIcon',
  'NotificationEntityIcon',
  'SettingsEntityIcon',
  'BillingEntityIcon',
]) {
  assert(entityIcon.includes(adapter), 'EntityIcon missing adapter: ' + adapter);
}

for (const needle of [
  '.cf-entity-icon-size-sm',
  '.cf-entity-icon-size-md',
  '.cf-entity-icon-size-lg',
  '.cf-entity-icon-tone-default',
  '.cf-entity-icon-tone-soft',
  '.cf-entity-icon-tone-strong',
]) {
  assert(css.includes(needle), 'Icon CSS missing: ' + needle);
}

const uiIndex = read('src/components/ui-system/index.ts');
assert(uiIndex.includes("export * from './EntityIcon';"), 'ui-system index missing EntityIcon export');
assert(uiIndex.includes("export * from './icon-registry';"), 'ui-system index missing icon-registry export');

const dsIndex = read('src/styles/design-system/index.css');
assert(dsIndex.includes('closeflow-icons.css'), 'design-system index missing closeflow-icons import');

assert(docs.includes('Jak zmienić ikonę klienta globalnie'), 'Docs must explain how to change client icon globally');
assert(docs.includes('Nie przepina wszystkich aktywnych ekranów'), 'Docs must say VS-2B does not migrate all screens');

const actionIcons = ['Plus', 'Search', 'Trash2', 'Pencil', 'Save'];
for (const actionIcon of actionIcons) {
  assert(!registry.includes(`${actionIcon},`), 'Action icon leaked into entity registry: ' + actionIcon);
}

const pkg = JSON.parse(read('package.json'));
assert(pkg.scripts && pkg.scripts['check:closeflow-entity-icon-registry'] === 'node scripts/check-closeflow-entity-icon-registry.cjs', 'package.json missing check:closeflow-entity-icon-registry');

console.log('CLOSEFLOW_ENTITY_ICON_REGISTRY_VS2B_CHECK_OK');
console.log('entity_count=' + requiredEntities.length);
console.log('migration_enforced=false');
