#!/usr/bin/env node
/* CLOSEFLOW_UI_MAP_INVENTORY_V1_CHECK */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const jsonPath = path.join(root, 'docs', 'ui', 'CLOSEFLOW_UI_MAP.generated.json');
const mdPath = path.join(root, 'docs', 'ui', 'CLOSEFLOW_UI_MAP.generated.md');
const auditScript = path.join(root, 'scripts', 'audit-closeflow-ui-map-inventory-v1.cjs');

function fail(message) {
  console.error(`CLOSEFLOW_UI_MAP_INVENTORY_V1_FAIL: ${message}`);
  process.exit(1);
}

for (const file of [auditScript, jsonPath, mdPath]) {
  if (!fs.existsSync(file)) fail(`Brak pliku: ${path.relative(root, file).replace(/\\/g, '/')}`);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
} catch (error) {
  fail(`Nie da się odczytać JSON: ${error.message}`);
}

if (data.inventoryVersion !== 'CLOSEFLOW_UI_MAP_INVENTORY_V1') fail('Niepoprawna inventoryVersion');
if (!Number.isFinite(data.filesScanned) || data.filesScanned < 5) fail('Podejrzanie mało przeskanowanych plików');
if (!Array.isArray(data.directLucideIconImports)) fail('Brak directLucideIconImports[]');
if (!Array.isArray(data.metricTileUsages)) fail('Brak metricTileUsages[]');
if (!Array.isArray(data.layoutEvidence)) fail('Brak layoutEvidence[]');
if (!data.semanticIconRoles || typeof data.semanticIconRoles !== 'object') fail('Brak semanticIconRoles');

const md = fs.readFileSync(mdPath, 'utf8');
for (const needle of [
  'CloseFlow UI Map Inventory v1',
  'Mapa ikon według roli',
  'Użycia kafelków / StatShortcutCard',
  'Położenie / layout CSS',
  'Następny krok po zatwierdzeniu mapy',
]) {
  if (!md.includes(needle)) fail(`Brak sekcji w MD: ${needle}`);
}

console.log('CLOSEFLOW_UI_MAP_INVENTORY_V1_CHECK_OK');
console.log(`filesScanned=${data.filesScanned}`);
console.log(`directLucideIconImports=${data.directLucideIconImports.length}`);
console.log(`metricTileUsages=${data.metricTileUsages.length}`);
console.log(`layoutEvidence=${data.layoutEvidence.length}`);
