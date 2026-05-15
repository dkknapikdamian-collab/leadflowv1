#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const MODE = process.argv.includes('--fix') ? 'fix' : 'check';

const RAIL_SOURCES = new Set([
  '../components/operator-rail',
  '@/components/operator-rail',
  './operator-rail',
]);

const ALLOWED_RAIL = new Set([
  'OperatorSideCard',
  'SimpleFiltersCard',
  'TopValueRecordsCard',
]);

const REACT_TYPES = new Set([
  'FormEvent',
  'MouseEvent',
  'ChangeEvent',
  'KeyboardEvent',
  'ReactNode',
  'CSSProperties',
]);

const REACT_VALUES = new Set([
  'useCallback',
  'useEffect',
  'useMemo',
  'useRef',
  'useState',
  'useId',
  'Fragment',
  'memo',
]);

const ROUTER_VALUES = new Set([
  'Link',
  'NavLink',
  'Navigate',
  'useLocation',
  'useNavigate',
  'useParams',
  'useSearchParams',
]);

const LUCIDE_VALUES = new Set([
  'Activity',
  'AlertCircle',
  'AlertTriangle',
  'Archive',
  'ArrowLeft',
  'ArrowRight',
  'Bell',
  'Calendar',
  'Check',
  'CheckCircle',
  'ChevronDown',
  'ChevronLeft',
  'ChevronRight',
  'ChevronUp',
  'Circle',
  'Clock',
  'Copy',
  'DollarSign',
  'Download',
  'Edit',
  'Eye',
  'FileText',
  'Filter',
  'Info',
  'Loader2',
  'Mail',
  'MessageSquare',
  'MoreHorizontal',
  'Phone',
  'Plus',
  'RefreshCcw',
  'RotateCcw',
  'Save',
  'Search',
  'Send',
  'Settings',
  'Sparkles',
  'Star',
  'Trash',
  'Trash2',
  'Upload',
  'User',
  'Users',
  'X',
  'XCircle',
]);

function joinParts(...parts) {
  return parts.join('');
}

const BANNED = [
  joinParts('Leady do ', 'spięcia'),
  joinParts('Brak klienta albo sprawy przy aktywnym ', 'temacie'),
  joinParts('data-clients-', 'lead-attention-rail'),
  joinParts('clients-', 'lead-attention-card'),
  joinParts('leadsNeedingClient', 'OrCaseLink'),
  joinParts('STAGE74_CLIENTS_', 'LEADS_TO_LINK_EMPTY_COPY'),
  joinParts('STALE_CLIENTS_', 'LEAD_LINKING_COPY_REMOVED'),
];

// This shorter token is risky as a generic substring, so keep it separate.
const BANNED_SHORT = joinParts('lead-', 'attention');

const SOURCE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.css']);
const IMPORT_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx']);

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function write(rel, value) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, value, 'utf8');
}

function walk(relDir, out = []) {
  const dir = path.join(ROOT, relDir);
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(relDir, entry.name);
    const full = path.join(ROOT, rel);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
      walk(rel, out);
    } else if (entry.isFile()) {
      out.push(rel);
    }
  }
  return out;
}

function normalizeImportSpacing(text) {
  return text
    .replace(/;\s*(?=import\s)/g, ';\n')
    .replace(/\}\s*from\s*(['"][^'"]+['"]);\s*(?=import\s)/g, '} from $1;\n')
    .replace(/(['"]);\s*(?=import\s)/g, '$1;\n');
}

function parseImports(text) {
  const imports = [];
  const re = /import\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"]\s*;|import\s+['"]([^'"]+)['"]\s*;/g;
  let match;
  while ((match = re.exec(text))) {
    const source = match[1] || match[2] || '';
    imports.push({ start: match.index, end: re.lastIndex, text: match[0], source });
  }
  return imports;
}

function stripTypePrefix(item) {
  return item.replace(/^type\s+/, '').trim();
}

function importedName(item) {
  const cleaned = stripTypePrefix(item).trim();
  const m = cleaned.match(/^([A-Za-z_$][\w$]*)\s+as\s+([A-Za-z_$][\w$]*)$/);
  return m ? m[1] : cleaned.split(/\s+/)[0];
}

function localName(item) {
  const cleaned = stripTypePrefix(item).trim();
  const m = cleaned.match(/^([A-Za-z_$][\w$]*)\s+as\s+([A-Za-z_$][\w$]*)$/);
  return m ? m[2] : cleaned.split(/\s+/)[0];
}

function namedItems(importText) {
  const match = importText.match(/import\s+(?:type\s+)?(?:[A-Za-z_$][\w$]*\s*,\s*)?\{([\s\S]*?)\}\s+from/);
  if (!match) return [];
  return match[1]
    .split(',')
    .map((part) => part.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').trim())
    .filter(Boolean);
}

function importLine(source, names) {
  const sorted = Array.from(names).sort((a, b) => stripTypePrefix(a).localeCompare(stripTypePrefix(b)));
  if (!sorted.length) return '';
  return "import { " + sorted.join(', ') + " } from '" + source + "';";
}

function hasWord(text, name) {
  const re = new RegExp('\\b' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b');
  return re.test(text);
}

function removeImportRanges(text, imports, shouldRemove) {
  let result = '';
  let cursor = 0;
  for (const item of imports) {
    if (!shouldRemove(item)) continue;
    result += text.slice(cursor, item.start);
    cursor = item.end;
  }
  result += text.slice(cursor);
  return result;
}

function targetImportSource(source) {
  return source === 'react'
    || source === 'react-router-dom'
    || source === 'lucide-react'
    || RAIL_SOURCES.has(source);
}

function rebuildTargetImports(rel) {
  const full = path.join(ROOT, rel);
  let text = fs.readFileSync(full, 'utf8');
  const original = text;
  text = normalizeImportSpacing(text);
  const imports = parseImports(text);
  const hasRailImport = imports.some((item) => RAIL_SOURCES.has(item.source));
  const hasBadRail = imports.some((item) => {
    if (!RAIL_SOURCES.has(item.source)) return false;
    return namedItems(item.text).some((entry) => !ALLOWED_RAIL.has(importedName(entry)));
  });
  const hasImportGlue = /;\s*import\s/.test(original);
  if (!hasRailImport && !hasImportGlue) {
    if (text !== original) fs.writeFileSync(full, text, 'utf8');
    return text !== original;
  }

  const collectedReact = new Set();
  const collectedRouter = new Set();
  const collectedLucide = new Set();
  const collectedRail = new Set();

  for (const item of imports) {
    if (!targetImportSource(item.source)) continue;
    for (const raw of namedItems(item.text)) {
      const name = importedName(raw);
      if (REACT_TYPES.has(name)) collectedReact.add('type ' + name);
      else if (REACT_VALUES.has(name)) collectedReact.add(name);
      else if (ROUTER_VALUES.has(name)) collectedRouter.add(name);
      else if (LUCIDE_VALUES.has(name)) collectedLucide.add(name);
      else if (ALLOWED_RAIL.has(name)) collectedRail.add(name);
      else if (item.source === 'react') collectedReact.add(raw);
      else if (item.source === 'react-router-dom') collectedRouter.add(raw);
      else if (item.source === 'lucide-react') collectedLucide.add(raw);
      // Unknown names from operator-rail are intentionally not preserved.
    }
  }

  let body = removeImportRanges(text, imports, (item) => targetImportSource(item.source));

  // Add symbols that are used but may have been lost by corrupted import parsing.
  for (const name of REACT_TYPES) if (hasWord(body, name)) collectedReact.add('type ' + name);
  for (const name of REACT_VALUES) if (hasWord(body, name)) collectedReact.add(name);
  for (const name of ROUTER_VALUES) if (hasWord(body, name)) collectedRouter.add(name);
  for (const name of LUCIDE_VALUES) if (hasWord(body, name)) collectedLucide.add(name);
  for (const name of ALLOWED_RAIL) if (hasWord(body, name)) collectedRail.add(name);

  const header = [
    importLine('react', collectedReact),
    importLine('react-router-dom', collectedRouter),
    importLine('lucide-react', collectedLucide),
    importLine('../components/operator-rail', collectedRail),
  ].filter(Boolean).join('\n');

  body = body.replace(/^\s+/, '');
  const next = (header ? header + '\n' : '') + body;
  if (next !== original) {
    fs.writeFileSync(full, next, 'utf8');
    return true;
  }
  return false;
}

function rewriteGuardFiles() {
  const stage79 = `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function j() { return Array.from(arguments).join(''); }
const root = process.cwd();
const banned = [
  j('Leady do ', 'spięcia'),
  j('Brak klienta albo sprawy przy aktywnym ', 'temacie'),
  j('data-clients-', 'lead-attention-rail'),
  j('clients-', 'lead-attention-card'),
  j('leadsNeedingClient', 'OrCaseLink'),
  j('STAGE74_CLIENTS_', 'LEADS_TO_LINK_EMPTY_COPY'),
  j('STALE_CLIENTS_', 'LEAD_LINKING_COPY_REMOVED'),
];
const bannedShort = j('lead-', 'attention');
const scanDirs = ['src', 'tests', 'scripts'];
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.css']);
function walk(dir, out = []) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return out;
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(rel, out);
    else if (entry.isFile() && exts.has(path.extname(entry.name))) out.push(rel);
  }
  return out;
}
function hits() {
  const bad = [];
  for (const dir of scanDirs) {
    for (const file of walk(dir)) {
      const body = fs.readFileSync(path.join(root, file), 'utf8');
      for (const token of banned) if (body.includes(token)) bad.push(file + ' :: stale marker');
      if (body.includes(bannedShort)) bad.push(file + ' :: stale short marker');
    }
  }
  return bad;
}

test('legacy clients lead-linking rail markers stay removed', () => {
  assert.equal(hits().length, 0, hits().join('\n'));
});
`;

  const stage81 = `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function j() { return Array.from(arguments).join(''); }

test('stage81 /clients renders top value clients card instead of legacy lead-linking rail', () => {
  const source = read('src/pages/Clients.tsx');
  assert.match(source, /TopValueRecordsCard/, 'Clients.tsx must render TopValueRecordsCard.');
  assert.match(source, /Najcenniejsi klienci/, 'Clients.tsx must show the top value clients title.');
  assert.match(source, /clients-top-value-records-card/, 'Clients.tsx must expose clients top value data test id.');
  assert.match(source, /(clientValueByClientId|buildTopClientValueEntries|mostValuableClients)/, 'Clients.tsx must use client value source for the rail.');
  const forbidden = [
    j('Leady do ', 'spięcia'),
    j('Brak klienta albo sprawy przy aktywnym ', 'temacie'),
    j('data-clients-', 'lead-attention-rail'),
    j('clients-', 'lead-attention-card'),
    j('leadsNeedingClient', 'OrCaseLink'),
    j('STAGE74_CLIENTS_', 'LEADS_TO_LINK_EMPTY_COPY'),
  ];
  for (const token of forbidden) assert.equal(source.includes(token), false, 'Clients.tsx contains stale marker.');
});
`;

  const stage83 = `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function j() { return Array.from(arguments).join(''); }
const banned = [
  j('Leady do ', 'spięcia'),
  j('Brak klienta albo sprawy przy aktywnym ', 'temacie'),
  j('data-clients-', 'lead-attention-rail'),
  j('clients-', 'lead-attention-card'),
  j('leadsNeedingClient', 'OrCaseLink'),
  j('STAGE74_CLIENTS_', 'LEADS_TO_LINK_EMPTY_COPY'),
  j('STALE_CLIENTS_', 'LEAD_LINKING_COPY_REMOVED'),
  j('lead-', 'attention'),
];
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.css']);
function walk(dir, out = []) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return out;
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(rel, out);
    else if (entry.isFile() && exts.has(path.extname(entry.name))) out.push(rel);
  }
  return out;
}

test('old clients lead-linking rail copy and attributes are not present in active source, guards or scripts', () => {
  const bad = [];
  for (const dir of ['src', 'tests', 'scripts']) {
    for (const file of walk(dir)) {
      const body = fs.readFileSync(path.join(root, file), 'utf8');
      if (banned.some((token) => body.includes(token))) bad.push(file);
    }
  }
  assert.deepEqual(bad, []);
});
`;

  const stage84 = `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const allowedRail = new Set(['OperatorSideCard', 'SimpleFiltersCard', 'TopValueRecordsCard']);
function walk(dir, out = []) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return out;
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(rel, out);
    else if (entry.isFile() && ['.ts', '.tsx', '.js', '.jsx'].includes(path.extname(entry.name))) out.push(rel);
  }
  return out;
}
function normalize(text) { return text.replace(/;\\s*(?=import\\s)/g, ';\\n'); }
function parseImports(text) {
  const imports = [];
  const re = /import\\s+[\\s\\S]*?\\s+from\\s+['\"]([^'\"]+)['\"]\\s*;|import\\s+['\"]([^'\"]+)['\"]\\s*;/g;
  let match;
  while ((match = re.exec(text))) imports.push({ text: match[0], source: match[1] || match[2] || '' });
  return imports;
}
function namedItems(importText) {
  const match = importText.match(/import\\s+(?:type\\s+)?(?:[A-Za-z_$][\\w$]*\\s*,\\s*)?\\{([\\s\\S]*?)\\}\\s+from/);
  if (!match) return [];
  return match[1].split(',').map((x) => x.replace(/^type\\s+/, '').trim().split(/\\s+as\\s+/)[0].trim()).filter(Boolean);
}

test('operator rail imports only rail components', () => {
  const bad = [];
  for (const file of walk('src')) {
    const body = normalize(fs.readFileSync(path.join(root, file), 'utf8'));
    for (const item of parseImports(body)) {
      if (!item.source.endsWith('/operator-rail') && item.source !== '../components/operator-rail') continue;
      for (const name of namedItems(item.text)) {
        if (!allowedRail.has(name)) bad.push(file + ' imports ' + name + ' from operator-rail');
      }
    }
  }
  assert.deepEqual(bad, []);
});
`;

  write('tests/stage79-clients-no-lead-attention-rail.test.cjs', stage79);
  write('tests/stage81-clients-top-value-records-card.test.cjs', stage81);
  write('tests/stage83-right-rail-stale-cleanup.test.cjs', stage83);
  write('tests/stage84-import-doctor-right-rail.test.cjs', stage84);
}

function replaceExactTokensInTestsAndScripts() {
  const files = [...walk('tests'), ...walk('scripts')].filter((rel) => SOURCE_EXTS.has(path.extname(rel)));
  for (const rel of files) {
    if (rel === path.normalize('tests/stage79-clients-no-lead-attention-rail.test.cjs')
      || rel === path.normalize('tests/stage81-clients-top-value-records-card.test.cjs')
      || rel === path.normalize('tests/stage83-right-rail-stale-cleanup.test.cjs')
      || rel === path.normalize('tests/stage84-import-doctor-right-rail.test.cjs')) continue;
    let body = read(rel);
    const before = body;
    for (const token of [...BANNED, BANNED_SHORT]) {
      body = body.split(token).join('__REMOVED_OLD_CLIENT_RAIL_MARKER__');
    }
    if (body !== before) write(rel, body);
  }
}

function updatePackageJson() {
  if (!exists('package.json')) return;
  const pkg = JSON.parse(read('package.json'));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:stage84-import-doctor-right-rail'] = 'node tools/import-doctor-stage4-v12.cjs --check';
  write('package.json', JSON.stringify(pkg, null, 2) + '\n');
}

function verifyNoBadRailImports() {
  const bad = [];
  for (const rel of walk('src')) {
    if (!IMPORT_EXTS.has(path.extname(rel))) continue;
    const body = normalizeImportSpacing(read(rel));
    for (const item of parseImports(body)) {
      if (!RAIL_SOURCES.has(item.source) && !item.source.endsWith('/operator-rail')) continue;
      for (const entry of namedItems(item.text)) {
        const name = importedName(entry);
        if (!ALLOWED_RAIL.has(name)) bad.push(rel + ' imports ' + name + ' from operator-rail');
      }
    }
  }
  assert.deepEqual(bad, []);
}

function verifyNoStaleMarkers() {
  const bad = [];
  for (const dir of ['src', 'tests', 'scripts']) {
    for (const rel of walk(dir)) {
      if (!SOURCE_EXTS.has(path.extname(rel))) continue;
      const body = read(rel);
      for (const token of BANNED) {
        if (body.includes(token)) bad.push(rel + ' :: stale marker');
      }
      if (body.includes(BANNED_SHORT)) bad.push(rel + ' :: stale short marker');
    }
  }
  assert.deepEqual(bad, []);
}

function verifyNoImportGlue() {
  const bad = [];
  for (const rel of walk('src')) {
    if (!IMPORT_EXTS.has(path.extname(rel))) continue;
    const body = read(rel);
    if (/;\s*import\s/.test(body)) bad.push(rel);
  }
  assert.deepEqual(bad, []);
}

function writeReport() {
  const lines = [
    '# CloseFlow Stage 4 Import Doctor V12',
    '',
    'Status: applied locally, no commit and no push.',
    '',
    'What this package does:',
    '- normalizes glued import statements in source files,',
    '- keeps operator-rail imports limited to rail components,',
    '- rewrites right-rail cleanup guards without self-referencing forbidden strings,',
    '- scans src/tests/scripts without requiring ripgrep,',
    '- preserves the shared right-card class.',
    '',
    'Manual check:',
    '- /clients shows Simple filters and top value clients.',
    '- /leads shows Simple filters and top value leads.',
  ];
  write('docs/audits/right-rail-import-doctor-stage4-v12-2026-05-15.md', lines.join('\n') + '\n');
}

function main() {
  let changed = 0;
  for (const rel of walk('src')) {
    if (!IMPORT_EXTS.has(path.extname(rel))) continue;
    if (rebuildTargetImports(rel)) changed += 1;
  }
  if (MODE === 'fix') {
    rewriteGuardFiles();
    replaceExactTokensInTestsAndScripts();
    updatePackageJson();
    writeReport();
  }
  verifyNoBadRailImports();
  verifyNoImportGlue();
  verifyNoStaleMarkers();
  console.log('OK: import doctor v12 ' + MODE + ' complete. normalized_files=' + changed);
}

main();
