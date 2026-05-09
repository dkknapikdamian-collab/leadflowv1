#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
function read(rel) { return fs.readFileSync(path.join(repo, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(repo, rel)); }
function fail(message) { console.error('CLOSEFLOW_COMPONENT_REGISTRY_VS2_FAIL: ' + message); process.exit(1); }
function assert(condition, message) { if (!condition) fail(message); }
function has(file, needle, label) { assert(read(file).includes(needle), label + ' missing: ' + needle); }

const componentFiles = [
  'src/components/ui-system/PageShell.tsx',
  'src/components/ui-system/PageHero.tsx',
  'src/components/ui-system/MetricTile.tsx',
  'src/components/ui-system/MetricGrid.tsx',
  'src/components/ui-system/SurfaceCard.tsx',
  'src/components/ui-system/ListRow.tsx',
  'src/components/ui-system/StatusPill.tsx',
  'src/components/ui-system/ActionCluster.tsx',
  'src/components/ui-system/FormFooter.tsx',
  'src/components/ui-system/EmptyState.tsx',
  'src/components/ui-system/index.ts',
];

for (const file of componentFiles) assert(exists(file), 'Missing component registry file: ' + file);
assert(exists('docs/ui/CLOSEFLOW_COMPONENT_REGISTRY_2026-05-09.md'), 'Missing component registry docs');

const index = read('src/components/ui-system/index.ts');
for (const name of ['PageShell', 'PageHero', 'MetricTile', 'MetricGrid', 'SurfaceCard', 'ListRow', 'StatusPill', 'ActionCluster', 'FormFooter', 'EmptyState']) {
  assert(index.includes("'./" + name + "'"), 'ui-system index does not export ' + name);
  has('docs/ui/CLOSEFLOW_COMPONENT_REGISTRY_2026-05-09.md', name, 'docs registry');
}

has('src/components/ui-system/MetricTile.tsx', 'data-cf-ui-component="MetricTile"', 'MetricTile data marker');
has('src/components/ui-system/PageShell.tsx', 'data-closeflow-page-wrapper="true"', 'PageShell wrapper marker');
has('src/components/ui-system/PageHero.tsx', 'data-page-hero="true"', 'PageHero marker');
has('src/components/ui-system/ActionCluster.tsx', 'data-cf-action-region={region}', 'ActionCluster region marker');
has('src/components/ui-system/FormFooter.tsx', 'data-standard-form-footer="true"', 'FormFooter marker');
has('src/components/ui-system/ListRow.tsx', 'data-standard-list-row="true"', 'ListRow marker');
has('src/components/ui-system/StatusPill.tsx', 'data-cf-status-tone={tone}', 'StatusPill tone marker');

has('src/components/entity-actions.tsx', 'export const EntityActionButton', 'EntityActionButton remains available');
has('src/components/StatShortcutCard.tsx', "from './ui-system'", 'StatShortcutCard imports ui-system');
has('src/components/StatShortcutCard.tsx', '<MetricTile', 'StatShortcutCard delegates to MetricTile');
has('src/components/StatShortcutCard.tsx', 'resolveMetricTone', 'StatShortcutCard keeps legacy tone resolver compatibility');

const pkg = JSON.parse(read('package.json'));
assert(pkg.scripts && pkg.scripts['check:closeflow-component-registry'] === 'node scripts/check-closeflow-component-registry.cjs', 'package script missing check:closeflow-component-registry');

console.log('CLOSEFLOW_COMPONENT_REGISTRY_VS2_CHECK_OK');
console.log('component_files=' + componentFiles.length);
