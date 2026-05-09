#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const repo = process.cwd();
const auditScript = path.join(repo, 'scripts/audit-closeflow-visual-system-inventory.cjs');
const jsonPath = path.join(repo, 'docs/ui/closeflow-visual-system-inventory.generated.json');
const mdPath = path.join(repo, 'docs/ui/CLOSEFLOW_VISUAL_SYSTEM_INVENTORY_2026-05-09.md');
const pkgPath = path.join(repo, 'package.json');

function fail(message) {
  console.error(`CLOSEFLOW_VISUAL_SYSTEM_INVENTORY_STAGE0_FAIL: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

assert(fs.existsSync(auditScript), 'Brakuje scripts/audit-closeflow-visual-system-inventory.cjs');

cp.execFileSync(process.execPath, [auditScript, '--write'], { stdio: 'inherit', cwd: repo });

assert(fs.existsSync(jsonPath), 'Brakuje generated JSON inventory');
assert(fs.existsSync(mdPath), 'Brakuje markdown inventory');

const inventory = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const md = fs.readFileSync(mdPath, 'utf8');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

assert(inventory && inventory.meta && inventory.meta.stage === 'Etap 0 — Visual system inventory freeze', 'Zły meta.stage w JSON');
assert(Array.isArray(inventory.cssImports), 'JSON nie zawiera cssImports[]');
assert(Array.isArray(inventory.namedCssFamilies), 'JSON nie zawiera namedCssFamilies[]');
assert(inventory.localSurfaces && Array.isArray(inventory.localSurfaces.localTiles), 'JSON nie zawiera localSurfaces.localTiles[]');
assert(inventory.localSurfaces && Array.isArray(inventory.localSurfaces.localPageHeaders), 'JSON nie zawiera localSurfaces.localPageHeaders[]');
assert(inventory.localSurfaces && Array.isArray(inventory.localSurfaces.localListRows), 'JSON nie zawiera localSurfaces.localListRows[]');
assert(inventory.localSurfaces && Array.isArray(inventory.localSurfaces.localForms), 'JSON nie zawiera localSurfaces.localForms[]');
assert(inventory.routes && Array.isArray(inventory.routes.active), 'JSON nie zawiera routes.active[]');
assert(Array.isArray(inventory.activeScreenContracts), 'JSON nie zawiera activeScreenContracts[]');

const decisions = JSON.stringify(inventory);
for (const word of ['zostaje', 'migrujemy', 'legacy', 'usunąć później']) {
  assert(decisions.includes(word), `JSON nie zawiera decyzji: ${word}`);
  assert(md.includes(word), `MD nie zawiera decyzji: ${word}`);
}

for (const phrase of [
  'Importy CSS z src/index.css',
  'Rodziny CSS do opanowania',
  'Aktywne ekrany bez pełnego kontraktu',
  'Lokalne kafelki',
  'Lokalne page headery',
  'Lokalne list rows',
  'Lokalne formularze',
]) {
  assert(md.includes(phrase), `MD nie zawiera sekcji: ${phrase}`);
}

assert(pkg.scripts && pkg.scripts['audit:closeflow-visual-system-inventory'], 'package.json nie zawiera audit:closeflow-visual-system-inventory');
assert(pkg.scripts && pkg.scripts['check:closeflow-visual-system-inventory'], 'package.json nie zawiera check:closeflow-visual-system-inventory');

console.log('CLOSEFLOW_VISUAL_SYSTEM_INVENTORY_STAGE0_CHECK_OK');
console.log(`css_imports=${inventory.summary.cssImports}`);
console.log(`named_css_families=${inventory.summary.namedCssFamilies}`);
console.log(`active_screens=${inventory.summary.activeScreens}`);
console.log(`active_without_wrapper=${inventory.summary.activeScreensWithoutStandardWrapper}`);
console.log(`active_without_tiles=${inventory.summary.activeScreensWithoutStandardTiles}`);
console.log(`active_without_page_hero=${inventory.summary.activeScreensWithoutStandardPageHero}`);
