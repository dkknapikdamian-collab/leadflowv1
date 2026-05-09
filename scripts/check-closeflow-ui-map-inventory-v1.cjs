#!/usr/bin/env node
/* CLOSEFLOW_UI_MAP_INVENTORY_V1_CHECK
   CLEAN_SCANNER_V4: validates shape and blocks parser pollution, not legitimate high icon counts.
*/
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const jsonPath = path.join(root, 'docs', 'ui', 'CLOSEFLOW_UI_MAP.generated.json');
const mdPath = path.join(root, 'docs', 'ui', 'CLOSEFLOW_UI_MAP.generated.md');
const auditScript = path.join(root, 'scripts', 'audit-closeflow-ui-map-inventory-v1.cjs');
const cleanScannerScript = path.join(root, 'scripts', 'check-closeflow-ui-map-inventory-clean-scanner-v4.cjs');

function rel(file) { return path.relative(root, file).replace(/\\/g, '/'); }
function fail(message) { console.error('CLOSEFLOW_UI_MAP_INVENTORY_V1_FAIL: ' + message); process.exit(1); }

for (const file of [auditScript, cleanScannerScript, jsonPath, mdPath]) {
  if (!fs.existsSync(file)) fail('Brak pliku: ' + rel(file));
}

let data;
try { data = JSON.parse(fs.readFileSync(jsonPath, 'utf8')); }
catch (error) { fail('Nie da się odczytać JSON: ' + error.message); }

if (data.inventoryVersion !== 'CLOSEFLOW_UI_MAP_INVENTORY_V1') fail('Niepoprawna inventoryVersion');
if (data.scannerVersion !== 'CLEAN_SCANNER_V4') fail('Brak scannerVersion=CLEAN_SCANNER_V4');
if (!Number.isFinite(data.filesScanned) || data.filesScanned < 5) fail('Podejrzanie mało przeskanowanych plików');
if (!Array.isArray(data.directLucideIconImports)) fail('Brak directLucideIconImports[]');
if (!Array.isArray(data.metricTileUsages)) fail('Brak metricTileUsages[]');
if (!Array.isArray(data.layoutEvidence)) fail('Brak layoutEvidence[]');
if (!data.semanticIconRoles || typeof data.semanticIconRoles !== 'object') fail('Brak semanticIconRoles');
if (data.directLucideIconImports.length < 80) fail('Podejrzanie mało importów lucide-react. Skaner może nie łapać realnych ikon.');

const forbiddenNonIconNames = new Set([
  'useEffect','useState','useMemo','useCallback','useRef','ReactNode','FormEvent','ChangeEvent','MouseEvent',
  'fetchSignInMethodsForEmail','sendPasswordResetEmail','verifyBeforeUpdateEmail','collection','doc','getDoc','setDoc',
  'onSnapshot','query','where','orderBy','limit','serverTimestamp','Timestamp'
]);
const leaked = data.directLucideIconImports.filter((entry) => forbiddenNonIconNames.has(entry.imported) || forbiddenNonIconNames.has(entry.local));
if (leaked.length) {
  fail('Mapa ikon jest zabrudzona importami spoza lucide-react: ' + leaked.slice(0, 10).map((entry) => entry.imported + '@' + entry.file).join(', '));
}

const md = fs.readFileSync(mdPath, 'utf8');
for (const needle of [
  'CloseFlow UI Map Inventory v1',
  'Scanner: **CLEAN_SCANNER_V4**',
  'Mapa ikon według roli',
  'Użycia kafelków / StatShortcutCard',
  'Położenie / layout CSS',
  'Następny krok po zatwierdzeniu mapy'
]) {
  if (!md.includes(needle)) fail('Brak sekcji w MD: ' + needle);
}

for (const bad of forbiddenNonIconNames) {
  if (md.includes(bad + ' (') || md.includes('>' + bad + '<')) fail('MD nadal zawiera nie-ikonę w mapie: ' + bad);
}

console.log('CLOSEFLOW_UI_MAP_INVENTORY_V1_CHECK_OK');
console.log('scannerVersion=' + data.scannerVersion);
console.log('filesScanned=' + data.filesScanned);
console.log('directLucideIconImports=' + data.directLucideIconImports.length);
console.log('metricTileUsages=' + data.metricTileUsages.length);
console.log('layoutEvidence=' + data.layoutEvidence.length);
