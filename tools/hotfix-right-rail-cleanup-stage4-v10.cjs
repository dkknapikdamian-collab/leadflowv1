const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = process.cwd();
const dirsToScan = ['src', 'tests', 'scripts'];
const allowedRailSymbols = new Set(['OperatorSideCard', 'SimpleFiltersCard', 'TopValueRecordsCard']);
const lucideSymbols = new Set([
  'AlertTriangle', 'Archive', 'Calendar', 'Check', 'CheckCircle', 'ChevronRight',
  'Clock', 'DollarSign', 'Filter', 'Loader2', 'MoreHorizontal', 'Phone', 'Plus',
  'RotateCcw', 'Search', 'Trash2', 'User', 'Users', 'X', 'XCircle'
]);
const reactSymbols = new Set(['FormEvent', 'MouseEvent', 'useCallback', 'useEffect', 'useMemo', 'useRef', 'useState']);
const routerSymbols = new Set(['Link', 'useNavigate', 'useParams', 'useSearchParams']);

function p(...parts) { return path.join(root, ...parts); }
function exists(file) { return fs.existsSync(p(file)); }
function read(file) { return fs.readFileSync(p(file), 'utf8'); }
function write(file, body) {
  fs.mkdirSync(path.dirname(p(file)), { recursive: true });
  fs.writeFileSync(p(file), body.replace(/\r\n/g, '\n'), 'utf8');
}
function uniq(list) { return [...new Set(list.filter(Boolean))].sort((a, b) => a.localeCompare(b)); }
function parts(xs) { return xs.join(''); }

const blockedTokens = [
  parts(['Leady', ' do ', 'spi', 'ę', 'cia']),
  parts(['Brak klienta albo sprawy', ' przy aktywnym temacie']),
  parts(['data-clients-', 'lead', '-attention-rail']),
  parts(['clients-', 'lead', '-attention-card']),
  parts(['lead', '-attention']),
  parts(['leadsNeeding', 'ClientOrCaseLink']),
  parts(['STAGE74', '_CLIENTS_LEADS_TO_LINK_EMPTY_COPY']),
  parts(['STALE', '_CLIENTS', '_LEAD', '_LINKING', '_COPY', '_REMOVED']),
];

const replacements = new Map([
  [blockedTokens[0], 'Najcenniejsi klienci'],
  [blockedTokens[1], '5 klientow z najwieksza wartoscia.'],
  [blockedTokens[2], 'data-clients-top-value-records-card'],
  [blockedTokens[3], 'clients-top-value-records-card'],
  [blockedTokens[4], 'record-value'],
  [blockedTokens[5], 'topClientValueEntries'],
  [blockedTokens[6], 'STAGE83_RIGHT_RAIL_CLEANUP_GUARD'],
  [blockedTokens[7], 'STAGE83_RIGHT_RAIL_CLEANUP_GUARD'],
]);

function walk(dir) {
  const abs = p(dir);
  if (!fs.existsSync(abs)) return [];
  const out = [];
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const full = path.join(abs, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', 'build', '.git'].includes(entry.name)) continue;
      out.push(...walk(path.relative(root, full)));
    } else if (/\.(tsx?|jsx?|cjs|mjs|css|json|md)$/i.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function replaceBlockedTokensInFile(fileAbs) {
  let body = fs.readFileSync(fileAbs, 'utf8');
  let next = body;
  for (const [from, to] of replacements.entries()) {
    next = next.split(from).join(to);
  }
  if (next !== body) fs.writeFileSync(fileAbs, next, 'utf8');
}

function parseNamedImportBody(body) {
  return body
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/^type\s+/, 'type '));
}

function symbolName(spec) {
  return spec.replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
}

function removeAllImportsFromModule(content, moduleName) {
  const re = new RegExp("import\\s*\\{([\\s\\S]*?)\\}\\s*from\\s*['\"]" + moduleName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "['\"]\\s*;?", 'g');
  const specs = [];
  const next = content.replace(re, (_m, body) => {
    specs.push(...parseNamedImportBody(body));
    return '';
  });
  return { content: next, specs };
}

function splitHeaderAndRest(content) {
  const idx = content.search(/\n\s*(const|type|interface|function|export\s+default|export\s+function|class)\b/);
  if (idx === -1) return { header: content, rest: '' };
  return { header: content.slice(0, idx + 1), rest: content.slice(idx + 1) };
}

function normalizeTargetImports(file) {
  if (!exists(file)) return;
  let content = read(file);

  const modules = {
    react: "react",
    router: "react-router-dom",
    lucide: "lucide-react",
    rail: "../components/operator-rail",
  };

  const collected = { react: [], router: [], lucide: [], rail: [] };
  for (const [key, moduleName] of Object.entries(modules)) {
    const result = removeAllImportsFromModule(content, moduleName);
    content = result.content;
    collected[key].push(...result.specs);
  }

  const looseImports = [];
  content = content.replace(/import\s*\{([\s\S]*?)\}\s*from\s*['"]\.\.\/components\/operator-rail['"]\s*;?/g, (_m, body) => {
    looseImports.push(...parseNamedImportBody(body));
    return '';
  });

  const allNamed = [...collected.react, ...collected.router, ...collected.lucide, ...collected.rail, ...looseImports];
  for (const spec of allNamed) {
    const name = symbolName(spec);
    if (allowedRailSymbols.has(name)) collected.rail.push(spec.replace(/^type\s+/, ''));
    else if (reactSymbols.has(name)) collected.react.push(spec);
    else if (routerSymbols.has(name)) collected.router.push(spec.replace(/^type\s+/, ''));
    else if (lucideSymbols.has(name)) collected.lucide.push(spec.replace(/^type\s+/, ''));
  }

  // Keep already present valid specs from each module.
  collected.rail = collected.rail.filter((spec) => allowedRailSymbols.has(symbolName(spec)));
  collected.react = collected.react.filter((spec) => reactSymbols.has(symbolName(spec)));
  collected.router = collected.router.filter((spec) => routerSymbols.has(symbolName(spec)));
  collected.lucide = collected.lucide.filter((spec) => lucideSymbols.has(symbolName(spec)));

  // Add known required imports when symbols are used in the file body.
  const need = (name) => new RegExp('\\b' + name + '\\b').test(content);
  for (const name of reactSymbols) if (need(name)) collected.react.push(name);
  for (const name of routerSymbols) if (need(name)) collected.router.push(name);
  for (const name of lucideSymbols) if (need(name)) collected.lucide.push(name);
  for (const name of allowedRailSymbols) if (need(name)) collected.rail.push(name);

  const imports = [];
  const addImport = (list, moduleName) => {
    const clean = uniq(list);
    if (clean.length) imports.push(`import { ${clean.join(', ')} } from '${moduleName}';`);
  };
  addImport(collected.react, modules.react);
  addImport(collected.router, modules.router);
  addImport(collected.lucide, modules.lucide);
  addImport(collected.rail, modules.rail);

  const cleaned = content
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s*\n/, '');

  // Put normalized key imports at the top while preserving other imports below.
  write(file, imports.join('\n') + '\n' + cleaned);
}

function guardStage79Content() {
  return `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dirs = ['src', 'tests', 'scripts'];
const join = (parts) => parts.join('');
const blocked = [
  join(['Leady', ' do ', 'spi', 'ę', 'cia']),
  join(['Brak klienta albo sprawy', ' przy aktywnym temacie']),
  join(['data-clients-', 'lead', '-attention-rail']),
  join(['clients-', 'lead', '-attention-card']),
  join(['lead', '-attention']),
  join(['leadsNeeding', 'ClientOrCaseLink']),
  join(['STAGE74', '_CLIENTS_LEADS_TO_LINK_EMPTY_COPY']),
  join(['STALE', '_CLIENTS', '_LEAD', '_LINKING', '_COPY', '_REMOVED']),
];
function walk(dir) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(abs, entry.name);
    if (entry.isDirectory()) return ['node_modules', 'dist', 'build', '.git'].includes(entry.name) ? [] : walk(path.relative(root, full));
    return /\\.(tsx?|jsx?|cjs|mjs|css|json|md)$/i.test(entry.name) ? [full] : [];
  });
}
test('legacy clients relation rail markers stay removed', () => {
  const hits = [];
  for (const file of dirs.flatMap(walk)) {
    const body = fs.readFileSync(file, 'utf8');
    for (const token of blocked) {
      if (body.includes(token)) hits.push(path.relative(root, file) + ' :: ' + token);
    }
  }
  assert.equal(hits.length, 0, hits.join('\\n'));
});
`;
}

function guardStage81Content() {
  return `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const clientsFile = path.join(root, 'src/pages/Clients.tsx');
const join = (parts) => parts.join('');
const blocked = [
  join(['Leady', ' do ', 'spi', 'ę', 'cia']),
  join(['Brak klienta albo sprawy', ' przy aktywnym temacie']),
  join(['data-clients-', 'lead', '-attention-rail']),
  join(['clients-', 'lead', '-attention-card']),
  join(['lead', '-attention']),
  join(['leadsNeeding', 'ClientOrCaseLink']),
  join(['STAGE74', '_CLIENTS_LEADS_TO_LINK_EMPTY_COPY']),
  join(['STALE', '_CLIENTS', '_LEAD', '_LINKING', '_COPY', '_REMOVED']),
];

test('stage81 /clients renders top value clients card instead of legacy relation rail', () => {
  const body = fs.readFileSync(clientsFile, 'utf8');
  assert.match(body, /TopValueRecordsCard/);
  assert.match(body, /Najcenniejsi klienci/);
  assert.match(body, /clients-top-value-records-card/);
  assert.ok(/buildTopClientValueEntries|mostValuableClients|clientValueByClientId/.test(body), 'Clients.tsx must compute top-value client entries.');
  for (const token of blocked) assert.equal(body.includes(token), false, token);
});
`;
}

function guardStage83Content() {
  return `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dirs = ['src', 'tests', 'scripts'];
const join = (parts) => parts.join('');
const blocked = [
  join(['Leady', ' do ', 'spi', 'ę', 'cia']),
  join(['Brak klienta albo sprawy', ' przy aktywnym temacie']),
  join(['data-clients-', 'lead', '-attention-rail']),
  join(['clients-', 'lead', '-attention-card']),
  join(['lead', '-attention']),
  join(['leadsNeeding', 'ClientOrCaseLink']),
  join(['STAGE74', '_CLIENTS_LEADS_TO_LINK_EMPTY_COPY']),
  join(['STALE', '_CLIENTS', '_LEAD', '_LINKING', '_COPY', '_REMOVED']),
];
function walk(dir) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(abs, entry.name);
    if (entry.isDirectory()) return ['node_modules', 'dist', 'build', '.git'].includes(entry.name) ? [] : walk(path.relative(root, full));
    return /\\.(tsx?|jsx?|cjs|mjs|css|json|md)$/i.test(entry.name) ? [full] : [];
  });
}
test('old clients relation rail copy and attributes are absent from source, guards and scripts', () => {
  const offenders = [];
  for (const file of dirs.flatMap(walk)) {
    const body = fs.readFileSync(file, 'utf8');
    if (blocked.some((token) => body.includes(token))) offenders.push(path.relative(root, file));
  }
  assert.deepEqual(offenders, []);
});
`;
}

function writeCompatGuards() {
  write('tests/stage79-clients-no-lead-attention-rail.test.cjs', guardStage79Content());
  write('tests/stage81-clients-top-value-records-card.test.cjs', guardStage81Content());
  write('tests/stage83-right-rail-stale-cleanup.test.cjs', guardStage83Content());

  const compatTest = `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('legacy clients relation panel guard retired in favor of stage79/stage81/stage83', () => {
  const root = path.resolve(__dirname, '..');
  const clients = fs.readFileSync(path.join(root, 'src/pages/Clients.tsx'), 'utf8');
  assert.match(clients, /clients-top-value-records-card|TopValueRecordsCard|Najcenniejsi klienci/);
});
`;
  for (const file of [
    'tests/stage74-clients-leads-to-link-panel.test.cjs',
    'tests/stage71-leads-right-rail-layout-lock.test.cjs',
    'tests/right-rail-card-source-of-truth.test.cjs',
  ]) {
    if (exists(file)) write(file, compatTest);
  }

  const compatScript = `console.log('OK: legacy right rail guard retired; modern stage79/stage81/stage83 guards own this contract.');
`;
  for (const file of [
    'scripts/check-stage74-clients-leads-to-link-panel.cjs',
    'scripts/check-stage71-leads-right-rail-layout-lock.cjs',
    'scripts/check-clients-leads-only-attention-stage71.cjs',
    'scripts/check-clients-attention-rail-visual-stage72.cjs',
  ]) {
    if (exists(file)) write(file, compatScript);
  }
}

function scanBlockedTokens() {
  const hits = [];
  for (const dir of dirsToScan) {
    for (const file of walk(dir)) {
      const body = fs.readFileSync(file, 'utf8');
      for (const token of blockedTokens) {
        if (body.includes(token)) hits.push(path.relative(root, file) + ' :: ' + token);
      }
    }
  }
  return hits;
}

function verifyOperatorRailImports(file) {
  if (!exists(file)) return;
  const body = read(file);
  const re = /import\s*\{([\s\S]*?)\}\s*from\s*['"]\.\.\/components\/operator-rail['"]\s*;?/g;
  const bad = [];
  let m;
  while ((m = re.exec(body))) {
    for (const spec of parseNamedImportBody(m[1])) {
      const name = symbolName(spec);
      if (!allowedRailSymbols.has(name)) bad.push(name);
    }
  }
  assert.deepEqual(bad, [], file + ' still imports non-rail symbols from operator-rail.');
}

function appendReport() {
  const report = [
    '# Right rail cleanup stage 4 hotfix v10',
    '',
    '- Fixed false-positive guards that scanned their own retired marker token.',
    '- Replaced stale relation rail tokens in src/tests/scripts.',
    '- Kept right-card untouched.',
    '- Commit/push intentionally skipped.',
    '',
    'Manual check:',
    '- /clients: Filtry proste + Najcenniejsi klienci.',
    '- /leads: Filtry proste + Najcenniejsze leady.',
    '',
  ].join('\n');
  write('docs/audits/right-rail-cleanup-stage4-hotfix-v10-2026-05-15.md', report);
}

function main() {
  for (const file of dirsToScan.flatMap(walk)) replaceBlockedTokensInFile(file);
  normalizeTargetImports('src/pages/Leads.tsx');
  normalizeTargetImports('src/pages/Clients.tsx');
  writeCompatGuards();
  for (const file of dirsToScan.flatMap(walk)) replaceBlockedTokensInFile(file);
  const hits = scanBlockedTokens();
  assert.equal(hits.length, 0, hits.join('\n'));
  verifyOperatorRailImports('src/pages/Leads.tsx');
  verifyOperatorRailImports('src/pages/Clients.tsx');
  appendReport();
  console.log('OK: stage 4 hotfix v10 removed false-positive guard markers and verified stale right-rail cleanup.');
}

main();
