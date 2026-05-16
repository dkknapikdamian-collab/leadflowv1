#!/usr/bin/env node
/* CLOSEFLOW_UI_SEMANTIC_CONTRACT_V1_CHECK */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const contractJsonPath = path.join(root, 'docs', 'ui', 'CLOSEFLOW_UI_SEMANTIC_CONTRACT.generated.json');
const contractMdPath = path.join(root, 'docs', 'ui', 'CLOSEFLOW_UI_SEMANTIC_CONTRACT.generated.md');
const contractDocPath = path.join(root, 'docs', 'ui', 'CLOSEFLOW_UI_SEMANTIC_CONTRACT_V1.md');
const mapJsonPath = path.join(root, 'docs', 'ui', 'CLOSEFLOW_UI_MAP.generated.json');
const packagePath = path.join(root, 'package.json');

function fail(message) {
  console.error('CLOSEFLOW_UI_SEMANTIC_CONTRACT_V1_FAIL: ' + message);
  process.exit(1);
}
function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (error) { fail('Nie mo\u017Cna odczyta\u0107 JSON ' + path.relative(root, file).replace(/\\/g, '/') + ': ' + error.message); }
}
function hasOwn(obj, key) { return Object.prototype.hasOwnProperty.call(obj || {}, key); }

for (const file of [contractJsonPath, contractMdPath, contractDocPath, mapJsonPath, packagePath]) {
  if (!fs.existsSync(file)) fail('Brak pliku: ' + path.relative(root, file).replace(/\\/g, '/'));
}

const contract = readJson(contractJsonPath);
const map = readJson(mapJsonPath);
const pkg = readJson(packagePath);

if (contract.version !== 'CLOSEFLOW_UI_SEMANTIC_CONTRACT_V1') fail('Niepoprawna wersja kontraktu.');
if (!contract.source || contract.source.scannerVersion !== 'CLEAN_SCANNER_V4') fail('Kontrakt musi bazowa\u0107 na CLEAN_SCANNER_V4.');
if (map.scannerVersion !== 'CLEAN_SCANNER_V4') fail('Mapa UI musi mie\u0107 scannerVersion CLEAN_SCANNER_V4.');

const forbiddenLeakedImports = new Set([
  'useEffect', 'useState', 'useMemo', 'useRef', 'useCallback', 'ReactNode', 'FormEvent', 'MouseEvent', 'KeyboardEvent', 'ChangeEvent', 'Dispatch', 'SetStateAction',
  'fetchSignInMethodsForEmail', 'sendPasswordResetEmail', 'verifyBeforeUpdateEmail'
]);
const leaked = (map.directLucideIconImports || []).filter((entry) => forbiddenLeakedImports.has(entry.imported) || forbiddenLeakedImports.has(entry.local));
if (leaked.length) {
  fail('Mapa ikon nadal zawiera importy spoza lucide-react: ' + leaked.slice(0, 10).map((entry) => entry.imported + '@' + entry.file).join(', '));
}

const requiredRoles = ['delete', 'phone', 'email', 'copy', 'edit', 'add', 'note', 'event', 'finance', 'task_status', 'time', 'risk_alert'];
if (!Array.isArray(contract.iconRoles)) fail('Brak iconRoles[].');
if (!Array.isArray(contract.criticalRoles)) fail('Brak criticalRoles[].');
for (const role of requiredRoles) {
  if (!contract.criticalRoles.includes(role)) fail('Brak roli krytycznej w contract.criticalRoles: ' + role);
  const entry = contract.iconRoles.find((item) => item.role === role);
  if (!entry) fail('Brak roli w contract.iconRoles: ' + role);
  if (!entry.component) fail('Rola bez komponentu docelowego: ' + role);
  if (!entry.tone) fail('Rola bez tonu: ' + role);
}

if (!contract.canonicalComponents || contract.canonicalComponents.icons !== 'src/ui-system/icons/SemanticIcon.tsx') fail('Brak docelowego komponentu SemanticIcon.');
if (!contract.canonicalComponents.infoRows || !contract.canonicalComponents.notes || !contract.canonicalComponents.shell) fail('Brak komponent\u00F3w docelowych dla info rows / notes / shell.');
if (!contract.metricTileContract || contract.metricTileContract.currentCanonicalComponent !== 'StatShortcutCard') fail('Kafelki metryk musz\u0105 wskazywa\u0107 StatShortcutCard jako obecny standard.');
if (!contract.detailRegionContract || !Array.isArray(contract.detailRegionContract.requiredOrderForLeadAndClient)) fail('Brak detailRegionContract.requiredOrderForLeadAndClient.');
for (const region of ['entity-header', 'entity-top-tiles', 'entity-contact', 'entity-notes', 'entity-history', 'entity-right-rail']) {
  if (!contract.detailRegionContract.requiredOrderForLeadAndClient.includes(region)) fail('Brak wymaganego regionu detail view: ' + region);
}
if (!Array.isArray(contract.migrationStages) || contract.migrationStages.length < 4) fail('Brak pe\u0142nej kolejno\u015Bci migracji UI.');

const md = fs.readFileSync(contractMdPath, 'utf8');
for (const needle of ['CloseFlow UI Semantic Contract v1', 'Role ikon', 'Kafelki / metryki', 'Regiony detail view', 'Kolejno\u015B\u0107 migracji', 'Guard policy']) {
  if (!md.includes(needle)) fail('Brak sekcji w MD: ' + needle);
}

if (!pkg.scripts || !hasOwn(pkg.scripts, 'build:closeflow-ui-semantic-contract-v1') || !hasOwn(pkg.scripts, 'check:closeflow-ui-semantic-contract-v1')) {
  fail('Brak skrypt\u00F3w package.json dla semantic contract v1.');
}

console.log('CLOSEFLOW_UI_SEMANTIC_CONTRACT_V1_CHECK_OK');
console.log('scannerVersion=' + contract.source.scannerVersion);
console.log('directLucideIconImports=' + contract.source.directLucideIconImports);
console.log('criticalRoles=' + contract.criticalRoles.length);
console.log('iconRoles=' + contract.iconRoles.length);
