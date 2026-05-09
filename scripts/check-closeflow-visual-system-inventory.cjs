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
function fail(message) { console.error('CLOSEFLOW_VISUAL_SYSTEM_INVENTORY_STAGE0_FAIL: ' + message); process.exit(1); }
function assert(condition, message) { if (!condition) fail(message); }
assert(fs.existsSync(auditScript), 'Missing scripts/audit-closeflow-visual-system-inventory.cjs');
cp.execFileSync(process.execPath, [auditScript, '--write'], { stdio: 'inherit', cwd: repo });
assert(fs.existsSync(jsonPath), 'Missing generated JSON inventory');
assert(fs.existsSync(mdPath), 'Missing markdown inventory');
const inventory = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const md = fs.readFileSync(mdPath, 'utf8');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
assert(inventory.meta && String(inventory.meta.stage || '').includes('Visual system inventory freeze'), 'Wrong meta.stage');
assert(Array.isArray(inventory.cssImports), 'JSON missing cssImports[]');
assert(Array.isArray(inventory.namedCssFamilies), 'JSON missing namedCssFamilies[]');
assert(inventory.localSurfaces && Array.isArray(inventory.localSurfaces.localTiles), 'JSON missing localTiles[]');
assert(inventory.localSurfaces && Array.isArray(inventory.localSurfaces.localPageHeaders), 'JSON missing localPageHeaders[]');
assert(inventory.localSurfaces && Array.isArray(inventory.localSurfaces.localListRows), 'JSON missing localListRows[]');
assert(inventory.localSurfaces && Array.isArray(inventory.localSurfaces.localForms), 'JSON missing localForms[]');
assert(inventory.localSurfaces && Array.isArray(inventory.localSurfaces.localRightCards), 'JSON missing localRightCards[]');
assert(inventory.localSurfaces && Array.isArray(inventory.localSurfaces.localModals), 'JSON missing localModals[]');
assert(inventory.routes && Array.isArray(inventory.routes.active), 'JSON missing routes.active[]');
assert(Array.isArray(inventory.activeScreenContracts), 'JSON missing activeScreenContracts[]');
const blob = JSON.stringify(inventory) + '\n' + md;
['zostaje', 'migrujemy', 'legacy', 'usunąć później'].forEach((word) => assert(blob.includes(word), 'Missing decision word: ' + word));
[
  'Importy CSS z src/index.css',
  'Rodziny CSS do opanowania',
  'Aktywne ekrany bez pełnego kontraktu',
  'Lokalne kafelki',
  'Lokalne page headery',
  'Lokalne list rows',
  'Lokalne formularze',
  'Lokalne right-card',
  'Lokalne modale',
].forEach((phrase) => assert(md.includes(phrase), 'MD missing section: ' + phrase));
assert(pkg.scripts && pkg.scripts['audit:closeflow-visual-system-inventory'], 'package.json missing audit script');
assert(pkg.scripts && pkg.scripts['check:closeflow-visual-system-inventory'], 'package.json missing check script');
assert(Number.isFinite(inventory.summary.cssImports), 'summary.cssImports invalid');
assert(Number.isFinite(inventory.summary.localRightCards), 'summary.localRightCards invalid');
assert(Number.isFinite(inventory.summary.localModals), 'summary.localModals invalid');
console.log('CLOSEFLOW_VISUAL_SYSTEM_INVENTORY_STAGE0_CHECK_OK');
console.log('css_imports=' + inventory.summary.cssImports);
console.log('named_css_families=' + inventory.summary.namedCssFamilies);
console.log('local_right_cards=' + inventory.summary.localRightCards);
console.log('local_modals=' + inventory.summary.localModals);
console.log('active_screens=' + inventory.summary.activeScreens);
console.log('active_without_wrapper=' + inventory.summary.activeScreensWithoutStandardWrapper);
console.log('active_without_tiles=' + inventory.summary.activeScreensWithoutStandardTiles);
console.log('active_without_page_hero=' + inventory.summary.activeScreensWithoutStandardPageHero);
