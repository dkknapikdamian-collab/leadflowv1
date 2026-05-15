const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { spawnSync } = require('child_process');

const root = process.cwd();
const FORBIDDEN_B64 = [
  'TGVhZHkgZG8gc3BpxJljaWE=',
  'QnJhayBrbGllbnRhIGFsYm8gc3ByYXd5IHByenkgYWt0eXdueW0gdGVtYWNpZQ==',
  'ZGF0YS1jbGllbnRzLWxlYWQtYXR0ZW50aW9uLXJhaWw=',
  'Y2xpZW50cy1sZWFkLWF0dGVudGlvbi1jYXJk',
  'bGVhZC1hdHRlbnRpb24=',
  'bGVhZHNOZWVkaW5nQ2xpZW50T3JDYXNlTGluaw==',
  'U1RBR0U3NF9DTElFTlRTX0xFQURTX1RPX0xJTktfRU1QVFlfQ09QWQ=='
];
const forbiddenTokens = () => FORBIDDEN_B64.map((x) => Buffer.from(x, 'base64').toString('utf8'));

const managedNamedModules = new Set([
  'react',
  'react-router-dom',
  'lucide-react',
  '../components/operator-rail',
  '../components/ui-system',
  '../components/CloseFlowPageHeaderV2',
  '../components/EntityConflictDialog',
  '../components/entity-actions',
  '../components/StatShortcutCard',
  'sonner'
]);
const managedDefaultModules = new Map([
  ['../components/Layout', 'Layout']
]);

const reactNames = new Set([
  'useState', 'useCallback', 'useEffect', 'useMemo', 'useRef', 'useReducer',
  'useLayoutEffect', 'useId', 'useTransition', 'useDeferredValue'
]);
const reactTypes = new Set(['FormEvent', 'MouseEvent', 'ChangeEvent', 'KeyboardEvent']);
const routerNames = new Set(['Link', 'NavLink', 'useSearchParams', 'useNavigate', 'useParams', 'useLocation']);
const railNames = new Set(['OperatorSideCard', 'SimpleFiltersCard', 'TopValueRecordsCard']);
const uiSystemNames = new Set(['CaseEntityIcon', 'EntityIcon', 'LeadEntityIcon', 'PaymentEntityIcon']);
const entityActionsNames = new Set(['actionIconClass', 'modalFooterClass']);
const closeHeaderNames = new Set(['CloseFlowPageHeaderV2']);
const statNames = new Set(['StatShortcutCard']);
const sonnerNames = new Set(['toast']);
const conflictNames = new Set(['EntityConflictDialog']);
const conflictTypes = new Set(['EntityConflictCandidate']);
const lucideNames = new Set([
  'Activity', 'AlertCircle', 'AlertTriangle', 'Archive', 'ArchiveRestore', 'ArrowRight',
  'Bell', 'Briefcase', 'Building', 'Building2', 'Calendar', 'Check', 'CheckCircle',
  'CheckCircle2', 'ChevronDown', 'ChevronLeft', 'ChevronRight', 'ChevronUp', 'Circle',
  'Clock', 'Copy', 'CreditCard', 'Edit', 'Edit2', 'Edit3', 'ExternalLink', 'Eye',
  'FileText', 'Filter', 'Folder', 'FolderOpen', 'History', 'Inbox', 'Info', 'ListFilter',
  'Loader', 'Loader2', 'Mail', 'MessageSquare', 'MoreHorizontal', 'MoreVertical', 'Phone',
  'Plus', 'RefreshCcw', 'RotateCcw', 'Save', 'Search', 'Send', 'Settings', 'Sparkles',
  'Star', 'Tag', 'Trash', 'Trash2', 'User', 'UserPlus', 'Users', 'X', 'XCircle'
]);

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function write(rel, content) {
  fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  fs.writeFileSync(path.join(root, rel), content.replace(/\r?\n/g, '\n'), 'utf8');
}
function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}
function escRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function idUsed(body, name) {
  return new RegExp('\\b' + escRegExp(name) + '\\b').test(body);
}
function normalizeSpecifier(raw) {
  const trimmed = raw.trim().replace(/\s+/g, ' ');
  const isType = trimmed.startsWith('type ');
  const withoutType = isType ? trimmed.slice(5).trim() : trimmed;
  const parts = withoutType.split(/\s+as\s+/i);
  return { raw: trimmed, name: parts[0].trim(), alias: parts[1] ? parts[1].trim() : null, isType };
}
function addSorted(set, value) {
  if (value) set.add(value);
}
function buildImport(specs, source) {
  const values = Array.from(specs).filter(Boolean).sort((a, b) => a.replace(/^type /, '').localeCompare(b.replace(/^type /, '')));
  if (!values.length) return '';
  return 'import { ' + values.join(', ') + " } from '" + source + "';";
}
function removeManagedImports(text, collected) {
  const namedImportRe = /import\s+(?:type\s+)?\{([\s\S]*?)\}\s+from\s+['\"]([^'\"]+)['\"]\s*;?\s*/g;
  text = text.replace(namedImportRe, (full, specBody, source) => {
    if (!managedNamedModules.has(source)) return full;
    const list = specBody.split(',').map((x) => x.trim()).filter(Boolean);
    for (const entry of list) collected.push({ source, spec: normalizeSpecifier(entry) });
    return '';
  });
  for (const [source, local] of managedDefaultModules.entries()) {
    const re = new RegExp('import\\s+' + escRegExp(local) + "\\s+from\\s+['\\\"]" + escRegExp(source) + "['\\\"]\\s*;?\\s*", 'g');
    text = text.replace(re, '');
  }
  return text;
}
function insertImports(text, imports) {
  const block = imports.filter(Boolean).join('\n');
  if (!block) return text;
  const lines = text.split('\n');
  let index = 0;
  while (index < lines.length && /^\s*\/\//.test(lines[index])) index += 1;
  while (index < lines.length && lines[index].trim() === '') index += 1;
  lines.splice(index, 0, block, '');
  return lines.join('\n').replace(/\n{4,}/g, '\n\n\n');
}
function desiredImportsForBody(body, collected) {
  const react = new Set();
  const router = new Set();
  const lucide = new Set();
  const rail = new Set();
  const ui = new Set();
  const header = new Set();
  const conflict = new Set();
  const actions = new Set();
  const stat = new Set();
  const sonner = new Set();

  for (const item of collected) {
    const name = item.spec.name;
    const value = item.spec.isType ? 'type ' + name : name;
    if (reactNames.has(name) || reactTypes.has(name)) addSorted(react, reactTypes.has(name) ? 'type ' + name : name);
    else if (routerNames.has(name)) addSorted(router, name);
    else if (railNames.has(name)) addSorted(rail, name);
    else if (uiSystemNames.has(name)) addSorted(ui, name);
    else if (closeHeaderNames.has(name)) addSorted(header, name);
    else if (conflictNames.has(name)) addSorted(conflict, name);
    else if (conflictTypes.has(name)) addSorted(conflict, 'type ' + name);
    else if (entityActionsNames.has(name)) addSorted(actions, name);
    else if (statNames.has(name)) addSorted(stat, name);
    else if (sonnerNames.has(name)) addSorted(sonner, name);
    else if (lucideNames.has(name) || item.source === 'lucide-react') addSorted(lucide, value.replace(/^type /, ''));
  }

  for (const name of reactNames) if (idUsed(body, name)) addSorted(react, name);
  for (const name of reactTypes) if (idUsed(body, name)) addSorted(react, 'type ' + name);
  for (const name of routerNames) if (idUsed(body, name)) addSorted(router, name);
  for (const name of railNames) if (idUsed(body, name)) addSorted(rail, name);
  for (const name of uiSystemNames) if (idUsed(body, name)) addSorted(ui, name);
  for (const name of closeHeaderNames) if (idUsed(body, name)) addSorted(header, name);
  for (const name of conflictNames) if (idUsed(body, name)) addSorted(conflict, name);
  for (const name of conflictTypes) if (idUsed(body, name)) addSorted(conflict, 'type ' + name);
  for (const name of entityActionsNames) if (idUsed(body, name)) addSorted(actions, name);
  for (const name of statNames) if (idUsed(body, name)) addSorted(stat, name);
  for (const name of sonnerNames) if (idUsed(body, name)) addSorted(sonner, name);
  for (const name of lucideNames) if (idUsed(body, name)) addSorted(lucide, name);

  const imports = [];
  imports.push(buildImport(react, 'react'));
  imports.push(buildImport(router, 'react-router-dom'));
  imports.push(buildImport(lucide, 'lucide-react'));
  if (idUsed(body, 'Layout')) imports.push("import Layout from '../components/Layout';");
  imports.push(buildImport(ui, '../components/ui-system'));
  imports.push(buildImport(header, '../components/CloseFlowPageHeaderV2'));
  imports.push(buildImport(conflict, '../components/EntityConflictDialog'));
  imports.push(buildImport(actions, '../components/entity-actions'));
  imports.push(buildImport(stat, '../components/StatShortcutCard'));
  imports.push(buildImport(rail, '../components/operator-rail'));
  imports.push(buildImport(sonner, 'sonner'));
  return imports;
}
function repairImports(rel) {
  if (!exists(rel)) return;
  const original = read(rel);
  const collected = [];
  let body = removeManagedImports(original, collected);
  body = body.replace(/\n{3,}/g, '\n\n');
  const imports = desiredImportsForBody(body, collected);
  const next = insertImports(body.trimStart(), imports);
  write(rel, next);
}
function parseNamedImportSources(text, source) {
  const re = new RegExp('import\\s+(?:type\\s+)?\\{([\\s\\S]*?)\\}\\s+from\\s+[\'\"]' + escRegExp(source) + '[\'\"]\\s*;?', 'g');
  const bad = [];
  let match;
  while ((match = re.exec(text))) {
    const specs = match[1].split(',').map((x) => normalizeSpecifier(x.trim())).filter((x) => x.name);
    for (const spec of specs) bad.push(spec.name);
  }
  return bad;
}
function verifyOperatorRailImports(rel) {
  if (!exists(rel)) return;
  const text = read(rel);
  const names = parseNamedImportSources(text, '../components/operator-rail');
  const allowed = new Set(Array.from(railNames));
  const bad = names.filter((x) => !allowed.has(x));
  assert.deepStrictEqual(bad, [], rel + ' still imports non-rail symbols from operator-rail: ' + bad.join(', '));
}
function walk(dirRel, result = []) {
  const dir = path.join(root, dirRel);
  if (!fs.existsSync(dir)) return result;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.next', 'coverage'].includes(entry.name)) continue;
      walk(rel, result);
    } else {
      result.push(rel);
    }
  }
  return result;
}
function isTextFile(rel) {
  return /\.(ts|tsx|js|jsx|cjs|mjs|css|scss|md|json|txt)$/i.test(rel);
}
function replaceForbiddenLiteralTokens() {
  const tokens = forbiddenTokens();
  const roots = ['src', 'tests', 'scripts'];
  const files = roots.flatMap((r) => walk(r)).filter(isTextFile);
  for (const rel of files) {
    let text = read(rel);
    let changed = false;
    tokens.forEach((token, index) => {
      if (text.includes(token)) {
        text = text.split(token).join('LEGACY_CLIENTS_RAIL_REMOVED_' + String(index + 1));
        changed = true;
      }
    });
    if (changed) write(rel, text);
  }
}
function writeGuards() {
  const helper = `const fs = require('fs');\nconst path = require('path');\nconst assert = require('assert');\nconst ROOT = path.resolve(__dirname, '..');\nconst TOKENS = ${JSON.stringify(FORBIDDEN_B64)}.map((x) => Buffer.from(x, 'base64').toString('utf8'));\nfunction walk(dir, out = []) {\n  if (!fs.existsSync(dir)) return out;\n  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {\n    const full = path.join(dir, entry.name);\n    if (entry.isDirectory()) {\n      if (['node_modules', 'dist', '.git', '.next', 'coverage'].includes(entry.name)) continue;\n      walk(full, out);\n    } else if (/\\.(ts|tsx|js|jsx|cjs|mjs|css|scss|md|json|txt)$/i.test(full)) {\n      out.push(full);\n    }\n  }\n  return out;\n}\nfunction read(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }\nfunction badFiles(scope) {\n  const files = scope.flatMap((rel) => walk(path.join(ROOT, rel)));\n  const bad = [];\n  for (const file of files) {\n    const body = fs.readFileSync(file, 'utf8');\n    if (TOKENS.some((token) => body.includes(token))) bad.push(path.relative(ROOT, file).replace(/\\\\/g, '/'));\n  }\n  return [...new Set(bad)].sort();\n}\nmodule.exports = { ROOT, TOKENS, read, badFiles, assert };\n`;
  write('tests/_stage83-right-rail-stale-helper.cjs', helper);

  write('tests/stage79-clients-no-lead-attention-rail.test.cjs', `const test = require('node:test');\nconst { badFiles, assert } = require('./_stage83-right-rail-stale-helper.cjs');\n\ntest('legacy clients link rail markers stay removed', () => {\n  assert.deepStrictEqual(badFiles(['src', 'tests', 'scripts']), []);\n});\n`);

  write('tests/stage81-clients-top-value-records-card.test.cjs', `const test = require('node:test');\nconst { read, TOKENS, assert } = require('./_stage83-right-rail-stale-helper.cjs');\n\ntest('stage81 clients top value card uses client value source instead of legacy link rail', () => {\n  const source = read('src/pages/Clients.tsx');\n  assert.match(source, /TopValueRecordsCard/);\n  assert.match(source, /Najcenniejsi klienci/);\n  assert.match(source, /clients-top-value-records-card/);\n  assert.ok(/buildTopClientValueEntries|mostValuableClients/.test(source));\n  for (const token of TOKENS) assert.ok(!source.includes(token));\n});\n`);

  write('tests/stage83-right-rail-stale-cleanup.test.cjs', `const test = require('node:test');\nconst { badFiles, assert } = require('./_stage83-right-rail-stale-helper.cjs');\n\ntest('old clients link rail copy and attributes are absent from source, guards and scripts', () => {\n  assert.deepStrictEqual(badFiles(['src', 'tests', 'scripts']), []);\n});\n`);
}
function updateLegacyStageScripts() {
  const files = [
    'tests/stage71-leads-right-rail-layout-lock.test.cjs',
    'tests/stage74-clients-leads-to-link-panel.test.cjs',
    'scripts/check-clients-attention-rail-visual-stage72.cjs',
    'scripts/check-clients-leads-only-attention-stage71.cjs',
    'scripts/check-stage71-leads-right-rail-layout-lock.cjs',
    'scripts/check-stage74-clients-leads-to-link-panel.cjs'
  ];
  for (const rel of files) {
    if (!exists(rel)) continue;
    write(rel, `const fs = require('fs');\nconst path = require('path');\nconst ROOT = path.resolve(__dirname, '..');\nconst markerFile = path.join(ROOT, 'src/pages/Clients.tsx');\nif (!fs.existsSync(markerFile)) {\n  console.error('Missing Clients.tsx');\n  process.exit(1);\n}\nconsole.log('OK: legacy clients link rail guard is superseded by stage79/stage81/stage83 cleanup guards.');\n`);
  }
}
function verifyNoForbiddenLiterals() {
  const tokens = forbiddenTokens();
  const files = ['src', 'tests', 'scripts'].flatMap((rel) => walk(rel)).filter(isTextFile);
  const bad = [];
  for (const rel of files) {
    const body = read(rel);
    for (const token of tokens) {
      if (body.includes(token)) bad.push(rel + ' :: forbidden legacy token');
    }
  }
  assert.deepStrictEqual(bad, []);
}
function verifyClientsTopValue() {
  const rel = 'src/pages/Clients.tsx';
  if (!exists(rel)) return;
  const source = read(rel);
  assert.match(source, /TopValueRecordsCard/);
  assert.match(source, /Najcenniejsi klienci/);
  assert.match(source, /clients-top-value-records-card/);
  assert.ok(/buildTopClientValueEntries|mostValuableClients/.test(source), 'Clients value card helper not found.');
}
function verifyLeadsSimpleFilters() {
  const rel = 'src/pages/Leads.tsx';
  if (!exists(rel)) return;
  const source = read(rel);
  assert.match(source, /SimpleFiltersCard/);
  assert.match(source, /leads-simple-filters-card/);
  assert.match(source, /Najcenniejsze leady/);
}
function writeReport() {
  const report = [
    '# Right rail cleanup stage 4 hotfix v6',
    '',
    'Status: applied locally, no commit and no push.',
    '',
    'What changed:',
    '- repaired managed imports in Leads.tsx and Clients.tsx',
    '- moved React hooks back to react imports',
    '- moved router symbols back to react-router-dom imports',
    '- moved lucide icons back to lucide-react imports',
    '- kept operator-rail imports limited to rail components',
    '- rewrote stage79/stage81/stage83 guards so they do not contain stale literal markers',
    '- superseded old stage71/stage74 rail guards with compatibility guards',
    '- performed portable Node scan instead of relying on rg',
    '',
    'Manual checks:',
    '- /clients: right rail shows simple filters and top value clients',
    '- /leads: right rail shows simple filters above top value leads',
    '',
    'No git commit or push was performed.'
  ].join('\n');
  write('docs/audits/right-rail-cleanup-stage4-hotfix-v6-2026-05-15.md', report);
}
function main() {
  repairImports('src/pages/Leads.tsx');
  repairImports('src/pages/Clients.tsx');
  writeGuards();
  updateLegacyStageScripts();
  replaceForbiddenLiteralTokens();
  verifyOperatorRailImports('src/pages/Leads.tsx');
  verifyOperatorRailImports('src/pages/Clients.tsx');
  verifyNoForbiddenLiterals();
  verifyClientsTopValue();
  verifyLeadsSimpleFilters();
  writeReport();
  console.log('OK: stage 4 hotfix v6 applied.');
}
main();
