#!/usr/bin/env node
/* CLOSEFLOW_UI_MAP_INVENTORY_CLEAN_SCANNER_REPAIR_V4_CHECK */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const jsonPath = path.join(root, 'docs', 'ui', 'CLOSEFLOW_UI_MAP.generated.json');
function fail(message) { console.error('CLOSEFLOW_UI_MAP_INVENTORY_CLEAN_SCANNER_REPAIR_V4_FAIL: ' + message); process.exit(1); }
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
if (data.scannerVersion !== 'CLEAN_SCANNER_V4') fail('Brak scannerVersion CLEAN_SCANNER_V4');
const nonIconNames = new Set(['useEffect','useState','useMemo','useCallback','useRef','ReactNode','FormEvent','ChangeEvent','MouseEvent','fetchSignInMethodsForEmail','sendPasswordResetEmail','verifyBeforeUpdateEmail']);
const leaked = (data.directLucideIconImports || []).filter((entry) => nonIconNames.has(entry.imported) || nonIconNames.has(entry.local));
if (leaked.length) fail('Zabrudzona mapa ikon: ' + leaked.map((entry) => entry.imported + '@' + entry.file).join(', '));
const roleKeys = Object.keys(data.semanticIconRoles || {});
if (!roleKeys.includes('delete')) fail('Brak roli delete w mapie ikon');
if (!roleKeys.includes('phone')) fail('Brak roli phone w mapie ikon');
if (!roleKeys.includes('email')) fail('Brak roli email w mapie ikon');
if (!roleKeys.includes('finance')) fail('Brak roli finance w mapie ikon');
if ((data.metricTileUsages || []).length < 10) fail('Za ma\u0142o u\u017Cy\u0107 StatShortcutCard w mapie');
console.log('CLOSEFLOW_UI_MAP_INVENTORY_CLEAN_SCANNER_REPAIR_V4_CHECK_OK');
console.log('directLucideIconImports=' + data.directLucideIconImports.length);
console.log('roles=' + roleKeys.sort().join(','));
