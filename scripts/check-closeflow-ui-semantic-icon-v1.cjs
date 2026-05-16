#!/usr/bin/env node
/* CLOSEFLOW_UI2_SEMANTIC_ICON_GUARD_V1_CHECK */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const srcDir = path.join(root, 'src');
const semanticIconPath = path.join(root, 'src', 'ui-system', 'icons', 'SemanticIcon.tsx');
const baselinePath = path.join(root, 'docs', 'ui', 'CLOSEFLOW_UI_SEMANTIC_ICON_BASELINE.generated.json');
const contractPath = path.join(root, 'docs', 'ui', 'CLOSEFLOW_UI_SEMANTIC_CONTRACT.generated.json');
const mapPath = path.join(root, 'docs', 'ui', 'CLOSEFLOW_UI_MAP.generated.json');
const packagePath = path.join(root, 'package.json');

const criticalRoles = ['add', 'ai', 'case', 'copy', 'delete', 'edit', 'event', 'risk_alert', 'task_status', 'time'];
const forbiddenLeakImports = ['useEffect', 'useState', 'useMemo', 'useCallback', 'useRef', 'ReactNode', 'FormEvent', 'fetchSignInMethodsForEmail', 'sendPasswordResetEmail', 'verifyBeforeUpdateEmail'];
const skipDirs = new Set(['node_modules', 'dist', '.git', '.vercel', 'coverage', 'tmp', 'temp']);
const codeExt = new Set(['.ts', '.tsx', '.js', '.jsx']);

function fail(message) {
  console.error('CLOSEFLOW_UI2_SEMANTIC_ICON_GUARD_V1_FAIL: ' + message);
  process.exit(1);
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) walk(path.join(dir, entry.name), acc);
      continue;
    }
    if (codeExt.has(path.extname(entry.name))) acc.push(path.join(dir, entry.name));
  }
  return acc;
}

function lineOf(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function parseLucideImports(text) {
  const result = [];
  const re = /import\s*\{([^}]*)\}\s*from\s*['"]lucide-react['"]/g;
  let match;
  while ((match = re.exec(text))) {
    const block = match[1] || '';
    for (const raw of block.split(',')) {
      const item = raw.trim();
      if (!item) continue;
      const parts = item.split(/\s+as\s+/i).map((x) => x.trim()).filter(Boolean);
      const imported = parts[0];
      const local = parts[1] || parts[0];
      if (/^[A-Za-z][A-Za-z0-9_]*$/.test(imported) && /^[A-Za-z][A-Za-z0-9_]*$/.test(local)) {
        result.push({ imported, local, importLine: lineOf(text, match.index) });
      }
    }
  }
  return result;
}

function roleForIcon(name) {
  const n = String(name || '').toLowerCase();
  if (/creditcard|wallet|dollar|coin|payment|bank/.test(n)) return 'finance';
  if (/externallink/.test(n)) return 'navigation';
  if (/trash|delete|remove/.test(n)) return 'delete';
  if (/phone|call/.test(n)) return 'phone';
  if (/mail|email|inbox/.test(n)) return 'email';
  if (/copy|clipboard/.test(n)) return 'copy';
  if (/pencil|edit/.test(n)) return 'edit';
  if (/plus|add|create/.test(n)) return 'add';
  if (/file|note|text|stickynote/.test(n)) return 'note';
  if (/calendar|event/.test(n)) return 'event';
  if (/clock|timer/.test(n)) return 'time';
  if (/check|circlecheck|checkcircle|task|list|shieldcheck|badgecheck/.test(n)) return 'task_status';
  if (/user|users|person/.test(n)) return 'person';
  if (/briefcase|case/.test(n)) return 'case';
  if (/building|home|house/.test(n)) return 'company_property';
  if (/alert|warning|triangle|shieldalert/.test(n)) return 'risk_alert';
  if (/sparkle|bot|brain|ai/.test(n)) return 'ai';
  if (/target|goal/.test(n)) return 'goal';
  if (/loader|spinner/.test(n)) return 'loading';
  if (/eye|view/.test(n)) return 'view';
  if (/pin/.test(n)) return 'pin';
  if (/arrow|chevron/.test(n)) return 'navigation';
  if (/x|close|octagonx/.test(n)) return 'close';
  if (/bell/.test(n)) return 'notification';
  if (/search/.test(n)) return 'search';
  if (/send/.test(n)) return 'send';
  if (/settings|sliders/.test(n)) return 'settings';
  if (/filter/.test(n)) return 'filter';
  if (/refresh|rotate/.test(n)) return 'refresh';
  if (/log(in|out)/.test(n)) return 'auth';
  return 'unclassified';
}

function collectCriticalPageImports() {
  const entries = [];
  for (const file of walk(srcDir)) {
    const relative = rel(file);
    if (!relative.startsWith('src/pages/')) continue;
    const text = fs.readFileSync(file, 'utf8');
    for (const icon of parseLucideImports(text)) {
      const role = roleForIcon(icon.imported);
      if (!criticalRoles.includes(role)) continue;
      entries.push({
        file: relative,
        imported: icon.imported,
        local: icon.local,
        role,
        importLine: icon.importLine,
        key: [relative, icon.imported, icon.local, role].join('|'),
      });
    }
  }
  return entries.sort((a, b) => a.key.localeCompare(b.key));
}

for (const requiredPath of [semanticIconPath, baselinePath, contractPath, mapPath, packagePath]) {
  if (!fs.existsSync(requiredPath)) fail('Brak pliku: ' + rel(requiredPath));
}

const semanticIconSource = fs.readFileSync(semanticIconPath, 'utf8');
for (const needle of [
  'CLOSEFLOW_UI2_SEMANTIC_ICON_GUARD_V1',
  'semanticIconConfig',
  'semanticIconCriticalRoles',
  'SemanticIconRole',
  'function SemanticIcon',
  'delete',
  'copy',
  'edit',
  'add',
  'risk_alert',
  'task_status',
  'event',
  'case',
  'time',
  'ai',
]) {
  if (!semanticIconSource.includes(needle)) fail('SemanticIcon.tsx nie zawiera: ' + needle);
}

const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
if (!pkg.scripts || pkg.scripts['check:closeflow-ui-semantic-icon-v1'] !== 'node scripts/check-closeflow-ui-semantic-icon-v1.cjs') {
  fail('Brak package.json script check:closeflow-ui-semantic-icon-v1');
}
if (!pkg.scripts || pkg.scripts['build:closeflow-ui-semantic-icon-baseline-v1'] !== 'node scripts/build-closeflow-ui-semantic-icon-baseline-v1.cjs') {
  fail('Brak package.json script build:closeflow-ui-semantic-icon-baseline-v1');
}

let map;
try {
  map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
} catch (error) {
  fail('Nie mo\u017Cna odczyta\u0107 CLOSEFLOW_UI_MAP.generated.json: ' + error.message);
}
const scanner = String(map.scannerVersion || map.sourceScanner || '');
if (scanner !== 'CLEAN_SCANNER_V4') fail('Mapa UI nie jest z CLEAN_SCANNER_V4');

const leaked = [];
for (const entry of map.directLucideIconImports || []) {
  if (forbiddenLeakImports.includes(String(entry.imported || ''))) {
    leaked.push((entry.imported || '?') + '@' + (entry.file || '?'));
  }
}
if (leaked.length) {
  fail('Mapa ikon nadal zawiera importy spoza lucide-react: ' + leaked.slice(0, 12).join(', '));
}

let baseline;
try {
  baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
} catch (error) {
  fail('Nie mo\u017Cna odczyta\u0107 baseline ikon: ' + error.message);
}
if (baseline.version !== 'CLOSEFLOW_UI2_SEMANTIC_ICON_GUARD_V1') fail('Niepoprawna wersja baseline');
for (const role of criticalRoles) {
  if (!baseline.criticalRoles.includes(role)) fail('Baseline nie zawiera roli krytycznej: ' + role);
}

const baselineKeys = new Set((baseline.criticalPageIconImports || []).map((entry) => entry.key));
const currentCritical = collectCriticalPageImports();
const newCritical = currentCritical.filter((entry) => !baselineKeys.has(entry.key));
if (newCritical.length) {
  fail(
    'Wykryto nowe bezpo\u015Brednie importy krytycznych ikon w src/pages/*. U\u017Cyj SemanticIcon albo dodaj \u015Bwiadomy wyj\u0105tek: ' +
      newCritical.slice(0, 12).map((entry) => entry.imported + '@' + entry.file + ':' + entry.importLine + '[' + entry.role + ']').join(', ')
  );
}

console.log('CLOSEFLOW_UI2_SEMANTIC_ICON_GUARD_V1_CHECK_OK');
console.log('scanner=' + scanner);
console.log('criticalRoles=' + criticalRoles.join(','));
console.log('baselineCriticalPageIconImports=' + baselineKeys.size);
console.log('currentCriticalPageIconImports=' + currentCritical.length);
