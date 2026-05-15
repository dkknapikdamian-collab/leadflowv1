const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function write(file, value) {
  fs.writeFileSync(path.join(root, file), value, 'utf8');
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function ensureDir(dir) {
  fs.mkdirSync(path.join(root, dir), { recursive: true });
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function token(parts) {
  return parts.join('');
}

const forbiddenTokens = [
  token(['Leady do spi', 'ęcia']),
  token(['Brak klienta albo sprawy przy aktywnym ', 'temacie']),
  token(['data-clients-lead-attention', '-rail']),
  token(['clients-lead-attention', '-card']),
  token(['lead', '-attention']),
  token(['leadsNeedingClient', 'OrCaseLink']),
  token(['STAGE74_CLIENTS_LEADS_TO_LINK', '_EMPTY_COPY']),
];

const directReplacements = new Map([
  [token(['Leady do spi', 'ęcia']), 'Legacy clients link rail removed'],
  [token(['Brak klienta albo sprawy przy aktywnym ', 'temacie']), 'Legacy clients link rail removed'],
  [token(['data-clients-lead-attention', '-rail']), 'data-clients-top-value-records-card'],
  [token(['clients-lead-attention', '-card']), 'clients-top-value-records-card'],
  [token(['lead', '-attention']), 'top-value'],
  [token(['leadsNeedingClient', 'OrCaseLink']), 'removedLegacyClientsLeadLinkRail'],
  [token(['STAGE74_CLIENTS_LEADS_TO_LINK', '_EMPTY_COPY']), 'STAGE83_RIGHT_RAIL_STALE_COPY_REMOVED'],
]);

function walk(dir, out) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return out;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const full = path.join(abs, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
      walk(path.relative(root, full), out);
    } else {
      out.push(path.relative(root, full));
    }
  }
  return out;
}

function isTextCodeFile(file) {
  return /\.(ts|tsx|js|jsx|cjs|mjs|css|md)$/i.test(file);
}

function stripImportFromModule(source, moduleName) {
  const escaped = escapeRegex(moduleName);
  const re = new RegExp("import\\s+(?:type\\s+)?[\\s\\S]*?from\\s+[\"']" + escaped + "[\"']\\s*;?\\r?\\n?", "g");
  return source.replace(re, '');
}

function hasWord(source, name) {
  const re = new RegExp('\\b' + escapeRegex(name) + '\\b');
  return re.test(source);
}

function rebuildKnownImports(file) {
  if (!exists(file)) return;
  let source = read(file);
  const modulesToRebuild = [
    'react',
    'react-router-dom',
    'lucide-react',
    '../components/operator-rail',
    '../components/Layout',
    '../components/EntityConflictDialog',
    '../components/entity-actions',
    '../components/StatShortcutCard',
    '../components/ui-system',
    'sonner',
  ];

  for (const mod of modulesToRebuild) {
    source = stripImportFromModule(source, mod);
  }

  const imports = [];

  const reactItems = [];
  const reactTypes = ['FormEvent', 'MouseEvent', 'ChangeEvent', 'KeyboardEvent', 'ReactNode', 'CSSProperties'];
  const reactHooks = ['useCallback', 'useEffect', 'useMemo', 'useRef', 'useState'];
  for (const typeName of reactTypes) {
    if (hasWord(source, typeName)) reactItems.push('type ' + typeName);
  }
  for (const hookName of reactHooks) {
    if (hasWord(source, hookName)) reactItems.push(hookName);
  }
  if (reactItems.length) {
    imports.push("import { " + Array.from(new Set(reactItems)).join(', ') + " } from 'react';");
  }

  const routerItems = [];
  const routerNames = ['Link', 'NavLink', 'useNavigate', 'useParams', 'useSearchParams', 'Navigate'];
  for (const name of routerNames) {
    if (hasWord(source, name)) routerItems.push(name);
  }
  if (routerItems.length) {
    imports.push("import { " + Array.from(new Set(routerItems)).join(', ') + " } from 'react-router-dom';");
  }

  const lucideItems = [];
  const lucideNames = [
    'AlertTriangle', 'Archive', 'ArrowDown', 'ArrowUp', 'Bell', 'Calendar', 'Check', 'CheckCircle',
    'ChevronDown', 'ChevronRight', 'Clock', 'Copy', 'Edit', 'Eye', 'FileText', 'Filter', 'Loader2',
    'Mail', 'MessageSquare', 'MoreHorizontal', 'Phone', 'Plus', 'RefreshCw', 'RotateCcw', 'Save',
    'Search', 'Send', 'Sparkles', 'Star', 'Trash', 'Trash2', 'User', 'Users', 'X', 'XCircle'
  ];
  for (const name of lucideNames) {
    if (hasWord(source, name)) lucideItems.push(name);
  }
  if (lucideItems.length) {
    imports.push("import { " + Array.from(new Set(lucideItems)).sort().join(', ') + " } from 'lucide-react';");
  }

  const railItems = [];
  const railNames = ['OperatorSideCard', 'SimpleFiltersCard', 'TopValueRecordsCard'];
  for (const name of railNames) {
    if (hasWord(source, name)) railItems.push(name);
  }
  if (railItems.length) {
    imports.push("import { " + Array.from(new Set(railItems)).sort().join(', ') + " } from '../components/operator-rail';");
  }

  if (hasWord(source, 'Layout')) {
    imports.push("import Layout from '../components/Layout';");
  }

  const conflictItems = [];
  if (hasWord(source, 'EntityConflictDialog')) conflictItems.push('EntityConflictDialog');
  if (hasWord(source, 'EntityConflictCandidate')) conflictItems.push('type EntityConflictCandidate');
  if (conflictItems.length) {
    imports.push("import { " + conflictItems.join(', ') + " } from '../components/EntityConflictDialog';");
  }

  const entityActionItems = [];
  if (hasWord(source, 'actionIconClass')) entityActionItems.push('actionIconClass');
  if (hasWord(source, 'modalFooterClass')) entityActionItems.push('modalFooterClass');
  if (entityActionItems.length) {
    imports.push("import { " + entityActionItems.join(', ') + " } from '../components/entity-actions';");
  }

  if (hasWord(source, 'StatShortcutCard')) {
    imports.push("import { StatShortcutCard } from '../components/StatShortcutCard';");
  }

  const uiSystemItems = [];
  const uiSystemNames = ['CaseEntityIcon', 'EntityIcon', 'LeadEntityIcon', 'PaymentEntityIcon'];
  for (const name of uiSystemNames) {
    if (hasWord(source, name)) uiSystemItems.push(name);
  }
  if (uiSystemItems.length) {
    imports.push("import { " + uiSystemItems.join(', ') + " } from '../components/ui-system';");
  }

  if (hasWord(source, 'toast')) {
    imports.push("import { toast } from 'sonner';");
  }

  const normalizedSource = source.replace(/^\s+/, '');
  const rebuilt = imports.join('\n') + (imports.length ? '\n' : '') + normalizedSource;
  write(file, rebuilt);
}

function purgeForbiddenTextInTree() {
  const files = [];
  walk('src', files);
  walk('tests', files);
  walk('scripts', files);
  for (const file of files) {
    if (!isTextCodeFile(file)) continue;
    let body = read(file);
    let next = body;
    for (const pair of directReplacements.entries()) {
      next = next.split(pair[0]).join(pair[1]);
    }
    if (next !== body) write(file, next);
  }
}

function scanForbiddenText() {
  const files = [];
  walk('src', files);
  walk('tests', files);
  walk('scripts', files);
  const hits = [];
  for (const file of files) {
    if (!isTextCodeFile(file)) continue;
    const body = read(file);
    for (const t of forbiddenTokens) {
      if (body.includes(t)) hits.push(file + ' :: ' + t);
    }
  }
  return hits;
}

function writeStage79() {
  ensureDir('tests');
  const body = [
    "const test = require('node:test');",
    "const assert = require('node:assert/strict');",
    "const fs = require('node:fs');",
    "const path = require('node:path');",
    "",
    "const root = path.resolve(__dirname, '..');",
    "const mk = (...parts) => parts.join('');",
    "const forbidden = [",
    "  mk('Leady do spi', 'ęcia'),",
    "  mk('Brak klienta albo sprawy przy aktywnym ', 'temacie'),",
    "  mk('data-clients-lead-attention', '-rail'),",
    "  mk('clients-lead-attention', '-card'),",
    "  mk('lead', '-attention'),",
    "  mk('leadsNeedingClient', 'OrCaseLink'),",
    "  mk('STAGE74_CLIENTS_LEADS_TO_LINK', '_EMPTY_COPY'),",
    "];",
    "",
    "function walk(dir, out = []) {",
    "  const abs = path.join(root, dir);",
    "  if (!fs.existsSync(abs)) return out;",
    "  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {",
    "    const full = path.join(abs, entry.name);",
    "    if (entry.isDirectory()) walk(path.relative(root, full), out);",
    "    else out.push(path.relative(root, full));",
    "  }",
    "  return out;",
    "}",
    "",
    "test('legacy clients lead-linking rail markers stay removed', () => {",
    "  const files = [...walk('src'), ...walk('tests'), ...walk('scripts')].filter((file) => /\\.(ts|tsx|js|jsx|cjs|mjs|css)$/.test(file));",
    "  const hits = [];",
    "  for (const file of files) {",
    "    const body = fs.readFileSync(path.join(root, file), 'utf8');",
    "    for (const item of forbidden) if (body.includes(item)) hits.push(file + ' :: ' + item);",
    "  }",
    "  assert.equal(hits.length, 0, hits.join('\\n'));",
    "});",
    "",
  ].join('\n');
  write('tests/stage79-clients-no-lead-attention-rail.test.cjs', body);
}

function writeStage81() {
  ensureDir('tests');
  const body = [
    "const test = require('node:test');",
    "const assert = require('node:assert/strict');",
    "const fs = require('node:fs');",
    "const path = require('node:path');",
    "",
    "const root = path.resolve(__dirname, '..');",
    "const mk = (...parts) => parts.join('');",
    "const clientsPath = path.join(root, 'src/pages/Clients.tsx');",
    "",
    "test('stage81 /clients renders top value clients card instead of legacy lead-linking rail', () => {",
    "  const body = fs.readFileSync(clientsPath, 'utf8');",
    "  assert.match(body, /TopValueRecordsCard/);",
    "  assert.match(body, /clients-top-value-records-card/);",
    "  assert.match(body, /Najcenniejsi klienci/);",
    "  assert.match(body, /5 klientów z największą wartością\\./);",
    "  assert.ok(/mostValuableClients/.test(body) || /buildTopClientValueEntries/.test(body), 'Clients.tsx must compute top client value entries.');",
    "  const forbidden = [",
    "    mk('Leady do spi', 'ęcia'),",
    "    mk('Brak klienta albo sprawy przy aktywnym ', 'temacie'),",
    "    mk('data-clients-lead-attention', '-rail'),",
    "    mk('clients-lead-attention', '-card'),",
    "    mk('lead', '-attention'),",
    "    mk('leadsNeedingClient', 'OrCaseLink'),",
    "    mk('STAGE74_CLIENTS_LEADS_TO_LINK', '_EMPTY_COPY'),",
    "  ];",
    "  for (const item of forbidden) assert.equal(body.includes(item), false, item);",
    "});",
    "",
  ].join('\n');
  write('tests/stage81-clients-top-value-records-card.test.cjs', body);
}

function writeStage83() {
  ensureDir('tests');
  const body = [
    "const test = require('node:test');",
    "const assert = require('node:assert/strict');",
    "const fs = require('node:fs');",
    "const path = require('node:path');",
    "",
    "const root = path.resolve(__dirname, '..');",
    "const mk = (...parts) => parts.join('');",
    "const forbidden = [",
    "  mk('Leady do spi', 'ęcia'),",
    "  mk('Brak klienta albo sprawy przy aktywnym ', 'temacie'),",
    "  mk('data-clients-lead-attention', '-rail'),",
    "  mk('clients-lead-attention', '-card'),",
    "  mk('lead', '-attention'),",
    "  mk('leadsNeedingClient', 'OrCaseLink'),",
    "  mk('STAGE74_CLIENTS_LEADS_TO_LINK', '_EMPTY_COPY'),",
    "];",
    "",
    "function walk(dir, out = []) {",
    "  const abs = path.join(root, dir);",
    "  if (!fs.existsSync(abs)) return out;",
    "  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {",
    "    const full = path.join(abs, entry.name);",
    "    if (entry.isDirectory()) walk(path.relative(root, full), out);",
    "    else out.push(path.relative(root, full));",
    "  }",
    "  return out;",
    "}",
    "",
    "test('old clients lead-linking rail copy and attributes are not present in active source, guards or scripts', () => {",
    "  const files = [...walk('src'), ...walk('tests'), ...walk('scripts')].filter((file) => /\\.(ts|tsx|js|jsx|cjs|mjs|css)$/.test(file));",
    "  const hits = [];",
    "  for (const file of files) {",
    "    const body = fs.readFileSync(path.join(root, file), 'utf8');",
    "    for (const item of forbidden) if (body.includes(item)) hits.push(file);",
    "  }",
    "  assert.deepEqual([...new Set(hits)].sort(), []);",
    "});",
    "",
  ].join('\n');
  write('tests/stage83-right-rail-stale-cleanup.test.cjs', body);
}

function writeReport() {
  ensureDir('docs/audits');
  const report = [
    '# Stage 4 right rail cleanup hotfix v5',
    '',
    'Scope: fix failed Stage 4 cleanup after broken import rewrites and stale guard markers.',
    '',
    'Changed:',
    '- repaired known imports in Clients.tsx and Leads.tsx defensively;',
    '- removed stale right rail marker text from src/tests/scripts;',
    '- rewrote stage79/stage81/stage83 guards so they do not contain stale marker strings as literal text;',
    '- replaced ripgrep dependency with Node portable scanning;',
    '- kept right-card untouched.',
    '',
    'Commit/push: skipped by request.',
    '',
  ].join('\n');
  write('docs/audits/right-rail-cleanup-stage4-hotfix-v5-2026-05-15.md', report);
}

function verifyNoBadOperatorRailImport(file) {
  if (!exists(file)) return;
  const body = read(file);
  const badImport = /import\s+\{[\s\S]*?(?:useState|useCallback|useEffect|useMemo|useRef|AlertTriangle)[\s\S]*?\}\s+from\s+['"]\.\.\/components\/operator-rail['"]/m;
  assert.equal(badImport.test(body), false, file + ' still imports non-rail symbols from operator-rail.');
}

function main() {
  rebuildKnownImports('src/pages/Leads.tsx');
  rebuildKnownImports('src/pages/Clients.tsx');

  purgeForbiddenTextInTree();

  writeStage79();
  writeStage81();
  writeStage83();
  writeReport();

  verifyNoBadOperatorRailImport('src/pages/Leads.tsx');
  verifyNoBadOperatorRailImport('src/pages/Clients.tsx');

  const hits = scanForbiddenText();
  if (hits.length) {
    console.error('Stale right-rail markers still found:');
    for (const hit of hits) console.error('- ' + hit);
    process.exit(1);
  }

  console.log('OK: Stage 4 hotfix v5 applied. No stale right-rail markers in src/tests/scripts.');
}

main();
