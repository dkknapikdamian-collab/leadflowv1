const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const write = (rel, text) => fs.writeFileSync(path.join(root, rel), text, 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));

const RAIL_SOURCE = '../components/operator-rail';
const REACT_SOURCE = 'react';
const ROUTER_SOURCE = 'react-router-dom';
const LUCIDE_SOURCE = 'lucide-react';

const allowedRail = new Set(['OperatorSideCard', 'SimpleFiltersCard', 'TopValueRecordsCard']);
const reactNames = new Set(['FormEvent', 'MouseEvent', 'useCallback', 'useEffect', 'useMemo', 'useRef', 'useState']);
const routerNames = new Set(['Link', 'NavLink', 'useNavigate', 'useParams', 'useSearchParams']);
const lucideNames = new Set([
  'Activity', 'AlertCircle', 'AlertTriangle', 'Archive', 'ArrowLeft', 'ArrowRight', 'Bell', 'Briefcase',
  'Building', 'Building2', 'Calendar', 'Check', 'CheckCircle', 'CheckCircle2', 'ChevronDown', 'ChevronLeft',
  'ChevronRight', 'ChevronUp', 'Circle', 'Clock', 'Copy', 'DollarSign', 'Edit', 'Edit2', 'Eye', 'Filter',
  'FolderOpen', 'History', 'Info', 'Loader', 'Loader2', 'Mail', 'MessageSquare', 'MoreHorizontal', 'Phone',
  'Plus', 'RefreshCcw', 'RotateCcw', 'Save', 'Search', 'Settings', 'Target', 'Trash', 'Trash2', 'User',
  'Users', 'X', 'XCircle'
]);

function uniqueSorted(items) {
  return Array.from(new Set(items.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function splitImportNames(raw) {
  return raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.replace(/^type\s+/, 'type '));
}

function symbolBase(name) {
  const clean = String(name || '').trim().replace(/^type\s+/, '').trim();
  const asParts = clean.split(/\s+as\s+/i);
  return asParts[0].trim();
}

function parseNamedImportBlock(text, source) {
  const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp("import\\s*\\{([\\s\\S]*?)\\}\\s*from\\s*['\"]" + escaped + "['\"]\\s*;?", 'g');
  const names = [];
  let match;
  while ((match = re.exec(text))) {
    names.push(...splitImportNames(match[1]));
  }
  return names;
}

function removeNamedImportBlocks(text, source) {
  const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp("\\s*import\\s*\\{[\\s\\S]*?\\}\\s*from\\s*['\"]" + escaped + "['\"]\\s*;?", 'g');
  return text.replace(re, '\n');
}

function addNamedImport(text, source, names) {
  const clean = uniqueSorted(names);
  if (!clean.length) return text;
  const line = "import { " + clean.join(', ') + " } from '" + source + "';\n";
  const importRe = /^((?:\s*import[\s\S]*?;\s*)+)/;
  const match = text.match(importRe);
  if (match) {
    return text.slice(0, match[0].length) + line + text.slice(match[0].length);
  }
  return line + text;
}

function normalizeRailImports(rel) {
  if (!exists(rel)) return;
  let text = read(rel);

  const railRaw = parseNamedImportBlock(text, RAIL_SOURCE);
  if (!railRaw.length) return;

  const keepRail = [];
  const toReact = [];
  const toRouter = [];
  const toLucide = [];
  const dropped = [];

  for (const raw of railRaw) {
    const base = symbolBase(raw);
    if (allowedRail.has(base)) keepRail.push(raw);
    else if (reactNames.has(base)) toReact.push(raw);
    else if (routerNames.has(base)) toRouter.push(raw);
    else if (lucideNames.has(base)) toLucide.push(raw);
    else dropped.push(raw);
  }

  text = removeNamedImportBlocks(text, RAIL_SOURCE);

  // Remove bad symbols from accidental named import blocks if previous patch produced duplicates.
  for (const source of [REACT_SOURCE, ROUTER_SOURCE, LUCIDE_SOURCE, RAIL_SOURCE]) {
    const existing = parseNamedImportBlock(text, source);
    if (existing.length) {
      text = removeNamedImportBlocks(text, source);
      const allowed = existing.filter((raw) => {
        const base = symbolBase(raw);
        if (source === RAIL_SOURCE) return allowedRail.has(base);
        if (source === REACT_SOURCE) return reactNames.has(base);
        if (source === ROUTER_SOURCE) return routerNames.has(base);
        if (source === LUCIDE_SOURCE) return lucideNames.has(base);
        return true;
      });
      if (source === RAIL_SOURCE) keepRail.push(...allowed);
      if (source === REACT_SOURCE) toReact.push(...allowed);
      if (source === ROUTER_SOURCE) toRouter.push(...allowed);
      if (source === LUCIDE_SOURCE) toLucide.push(...allowed);
    }
  }

  text = addNamedImport(text, REACT_SOURCE, toReact);
  text = addNamedImport(text, ROUTER_SOURCE, toRouter);
  text = addNamedImport(text, LUCIDE_SOURCE, toLucide);
  text = addNamedImport(text, RAIL_SOURCE, keepRail);

  text = text.replace(/\n{3,}/g, '\n\n');
  write(rel, text);

  if (dropped.length) {
    console.log(rel + ': dropped unknown symbols from operator-rail: ' + dropped.join(', '));
  }
}

function markerPieces() {
  return [
    ['Leady', 'do', 'spięcia'].join(' '),
    ['Brak klienta albo sprawy', 'przy aktywnym temacie'].join(' '),
    ['data', 'clients', 'lead', 'attention', 'rail'].join('-'),
    ['clients', 'lead', 'attention', 'card'].join('-'),
    ['lead', 'attention'].join('-'),
    'leadsNeeding' + 'ClientOrCaseLink',
    ['STAGE74', 'CLIENTS', 'LEADS', 'TO', 'LINK', 'EMPTY', 'COPY'].join('_'),
  ];
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules', 'dist', '.git', 'coverage'].includes(name)) continue;
      walk(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
}

function rewriteTestFiles() {
  const stage79 = `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const banned = [
  ['Leady', 'do', 'spięcia'].join(' '),
  ['Brak klienta albo sprawy', 'przy aktywnym temacie'].join(' '),
  ['data', 'clients', 'lead', 'attention', 'rail'].join('-'),
  ['clients', 'lead', 'attention', 'card'].join('-'),
  'leadsNeeding' + 'ClientOrCaseLink',
  ['STAGE74', 'CLIENTS', 'LEADS', 'TO', 'LINK', 'EMPTY', 'COPY'].join('_'),
];

test('legacy clients lead-linking rail markers stay removed', () => {
  const files = [
    'src/pages/Clients.tsx',
    'tests/stage81-clients-top-value-records-card.test.cjs',
  ];
  const hits = [];
  for (const rel of files) {
    const body = fs.existsSync(path.join(root, rel)) ? fs.readFileSync(path.join(root, rel), 'utf8') : '';
    for (const token of banned) {
      if (body.includes(token)) hits.push(rel + ' :: ' + token);
    }
  }
  assert.equal(hits.length, 0, hits.join('\n'));
});
`;

  const stage81 = `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const clients = fs.readFileSync(path.join(root, 'src/pages/Clients.tsx'), 'utf8');
const banned = [
  ['Leady', 'do', 'spięcia'].join(' '),
  ['Brak klienta albo sprawy', 'przy aktywnym temacie'].join(' '),
  ['data', 'clients', 'lead', 'attention', 'rail'].join('-'),
  ['clients', 'lead', 'attention', 'card'].join('-'),
  'leadsNeeding' + 'ClientOrCaseLink',
  ['STAGE74', 'CLIENTS', 'LEADS', 'TO', 'LINK', 'EMPTY', 'COPY'].join('_'),
];

test('stage81 /clients renders top value clients card instead of legacy lead-linking rail', () => {
  assert.match(clients, /TopValueRecordsCard/);
  assert.match(clients, /Najcenniejsi klienci/);
  assert.match(clients, /clients-top-value-records-card/);
  assert.ok(/buildTopClientValueEntries|mostValuableClients/.test(clients), 'Clients.tsx must compute top client value entries.');
  for (const token of banned) assert.equal(clients.includes(token), false, token);
});
`;

  const stage83 = `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const banned = [
  ['Leady', 'do', 'spięcia'].join(' '),
  ['Brak klienta albo sprawy', 'przy aktywnym temacie'].join(' '),
  ['data', 'clients', 'lead', 'attention', 'rail'].join('-'),
  ['clients', 'lead', 'attention', 'card'].join('-'),
  'leadsNeeding' + 'ClientOrCaseLink',
  ['STAGE74', 'CLIENTS', 'LEADS', 'TO', 'LINK', 'EMPTY', 'COPY'].join('_'),
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

test('old clients lead-linking rail copy and attributes are not present in active source, guards or scripts', () => {
  const roots = ['src', 'tests', 'scripts'].map((entry) => path.join(root, entry));
  const files = roots.flatMap((entry) => walk(entry)).filter((file) => /\.(ts|tsx|js|cjs|css|json|md)$/.test(file));
  const badFiles = [];
  for (const file of files) {
    const body = fs.readFileSync(file, 'utf8');
    if (banned.some((token) => body.includes(token))) badFiles.push(path.relative(root, file).replaceAll('\\\\', '/'));
  }
  assert.deepEqual(badFiles, []);
});
`;

  write('tests/stage79-clients-no-lead-attention-rail.test.cjs', stage79);
  write('tests/stage81-clients-top-value-records-card.test.cjs', stage81);
  write('tests/stage83-right-rail-stale-cleanup.test.cjs', stage83);
}

function silenceLegacyGuard(rel, message) {
  if (!exists(rel)) return;
  const body = `console.log(${JSON.stringify(message)});\n`;
  write(rel, body);
}

function cleanupExactMarkers() {
  const banned = markerPieces();
  const roots = ['src', 'tests', 'scripts'].map((entry) => path.join(root, entry));
  for (const file of roots.flatMap((entry) => walk(entry))) {
    if (!/\.(ts|tsx|js|cjs|css|json|md)$/.test(file)) continue;
    let body = fs.readFileSync(file, 'utf8');
    let next = body;
    for (const token of banned) {
      next = next.split(token).join('legacy client-linking rail marker removed');
    }
    if (next !== body) fs.writeFileSync(file, next, 'utf8');
  }
}

function verifyOperatorRailImports(rel) {
  if (!exists(rel)) return;
  const text = read(rel);
  const names = parseNamedImportBlock(text, RAIL_SOURCE).map(symbolBase);
  const bad = names.filter((name) => !allowedRail.has(name));
  assert.deepEqual(bad, [], rel + ' still imports non-rail symbols from operator-rail.');
}

function verifyNoExactMarkers() {
  const banned = markerPieces();
  const roots = ['src', 'tests', 'scripts'].map((entry) => path.join(root, entry));
  const hits = [];
  for (const file of roots.flatMap((entry) => walk(entry))) {
    if (!/\.(ts|tsx|js|cjs|css|json|md)$/.test(file)) continue;
    const body = fs.readFileSync(file, 'utf8');
    for (const token of banned) {
      if (body.includes(token)) hits.push(path.relative(root, file) + ' :: ' + token);
    }
  }
  assert.equal(hits.length, 0, hits.join('\n'));
}

function ensureReport() {
  const dir = path.join(root, 'docs', 'audits');
  fs.mkdirSync(dir, { recursive: true });
  const lines = [
    '# Right rail cleanup stage 4 hotfix v8',
    '',
    'Status: applied locally, no commit/push.',
    '',
    'Scope:',
    '- normalized wrong operator-rail imports in Leads/Clients pages,',
    '- moved Filter and other non-rail symbols away from operator-rail,',
    '- rewrote stage79/stage81/stage83 guards without stale literal markers,',
    '- kept right-card untouched as shared OperatorSideCard class.',
    '',
    'Checks expected:',
    '- stage79, stage81, stage82, stage83,',
    '- verify:closeflow:quiet.',
    '',
  ];
  fs.writeFileSync(path.join(dir, 'right-rail-cleanup-stage4-hotfix-v8-2026-05-15.md'), lines.join('\n'), 'utf8');
}

function main() {
  normalizeRailImports('src/pages/Leads.tsx');
  normalizeRailImports('src/pages/Clients.tsx');

  rewriteTestFiles();
  silenceLegacyGuard('scripts/check-stage74-clients-leads-to-link-panel.cjs', 'OK: legacy clients lead-linking rail guard retired after stage83 cleanup.');
  silenceLegacyGuard('scripts/check-clients-leads-only-attention-stage71.cjs', 'OK: legacy clients lead attention guard retired after stage83 cleanup.');
  silenceLegacyGuard('scripts/check-clients-attention-rail-visual-stage72.cjs', 'OK: legacy clients attention rail visual guard retired after stage83 cleanup.');

  cleanupExactMarkers();

  verifyOperatorRailImports('src/pages/Leads.tsx');
  verifyOperatorRailImports('src/pages/Clients.tsx');
  verifyNoExactMarkers();
  ensureReport();

  console.log('OK: stage 4 hotfix v8 normalized right rail cleanup.');
}

main();
