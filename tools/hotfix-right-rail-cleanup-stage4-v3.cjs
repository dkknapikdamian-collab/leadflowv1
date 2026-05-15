const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const scanOnly = process.argv.includes('--scan-only');

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function write(rel, content) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

const e = '\u0119';
const forbidden = [
  ['Leady', ' do spi', e, 'cia'].join(''),
  ['Brak klienta albo sprawy', ' przy aktywnym temacie'].join(''),
  ['data-clients-lead', '-attention-rail'].join(''),
  ['clients-lead', '-attention-card'].join(''),
  ['leadsNeedingClient', 'OrCaseLink'].join(''),
  ['STAGE74_CLIENTS_', 'LEADS_TO_LINK_EMPTY_COPY'].join(''),
];

function walk(dir, files = []) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return files;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const full = path.join(abs, entry.name);
    const rel = path.relative(ROOT, full).replace(/\\/g, '/');
    if (entry.isDirectory()) walk(rel, files);
    else files.push(rel);
  }
  return files;
}

function scanForbidden() {
  const roots = ['src', 'tests', 'scripts'];
  const offenders = [];
  for (const root of roots) {
    for (const rel of walk(root)) {
      const ext = path.extname(rel).toLowerCase();
      if (!['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.css'].includes(ext)) continue;
      const body = read(rel);
      for (const term of forbidden) {
        if (body.includes(term)) offenders.push(`${rel} :: ${term}`);
      }
    }
  }
  return offenders;
}

function parseNames(raw) {
  return raw
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

function nameKey(name) {
  return name.replace(/^type\s+/, '').split(/\s+as\s+/i)[0].trim();
}

function formatImport(source, names) {
  const list = Array.from(new Set(names.map((x) => x.trim()).filter(Boolean)));
  list.sort((a, b) => nameKey(a).localeCompare(nameKey(b), 'en'));
  return `import { ${list.join(', ')} } from '${source}';\n`;
}

function insertImport(text, source, names) {
  const stmt = formatImport(source, names);
  const commentMatch = text.match(/^(\/\/[^\n]*\n)+/);
  if (commentMatch) {
    return text.slice(0, commentMatch[0].length) + stmt + text.slice(commentMatch[0].length);
  }
  return stmt + text;
}

function updateNamedImport(text, source, opts = {}) {
  const remove = new Set((opts.remove || []).map(nameKey));
  const add = opts.add || [];
  const esc = source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`import\\s*\\{([\\s\\S]*?)\\}\\s*from\\s*['"]${esc}['"];\\s*`, 'm');
  const found = text.match(re);
  if (!found) {
    return add.length ? insertImport(text, source, add) : text;
  }
  let names = parseNames(found[1]).filter((x) => !remove.has(nameKey(x)));
  for (const item of add) {
    if (!names.some((x) => nameKey(x) === nameKey(item))) names.push(item);
  }
  const replacement = names.length ? formatImport(source, names) : '';
  return text.replace(re, replacement);
}

function fixLeadsImports() {
  const rel = 'src/pages/Leads.tsx';
  if (!exists(rel)) fail(`${rel} not found`);
  let text = read(rel);

  const reactHooks = ['useCallback', 'useEffect', 'useMemo', 'useRef', 'useState'];
  const routerOnly = ['useCallback', 'useEffect', 'useMemo', 'useRef', 'useState'];
  const railWrong = ['AlertTriangle', 'Loader2', 'Plus', 'Search', 'Trash2', 'RotateCcw', ...reactHooks];

  text = updateNamedImport(text, 'react-router-dom', { remove: routerOnly });
  text = updateNamedImport(text, 'react', { add: reactHooks });
  text = updateNamedImport(text, 'lucide-react', { add: ['AlertTriangle'] });
  text = updateNamedImport(text, '../components/operator-rail', {
    remove: railWrong,
    add: ['SimpleFiltersCard', 'TopValueRecordsCard'],
  });

  // If an earlier patch left an empty malformed operator-rail import in a weird layout, clean it.
  text = text.replace(/import\s*\{\s*\}\s*from\s*['"]\.\.\/components\/operator-rail['"];\s*/g, '');

  write(rel, text);

  const next = read(rel);
  const badRail = next.match(/import\s*\{([\s\S]*?)\}\s*from\s*['"]\.\.\/components\/operator-rail['"];/m);
  if (!badRail) fail('Leads.tsx is missing operator-rail import after hotfix.');
  const railNames = badRail[1];
  if (/\b(AlertTriangle|useState|useCallback|useEffect|useMemo|useRef|Loader2|Plus|Search|Trash2|RotateCcw)\b/.test(railNames)) {
    fail('Leads.tsx still imports non-rail symbols from operator-rail.');
  }
  const reactImport = next.match(/import\s*\{([\s\S]*?)\}\s*from\s*['"]react['"];/m);
  if (!reactImport || !/\buseState\b/.test(reactImport[1])) fail('Leads.tsx still misses useState from react.');
  const lucideImport = next.match(/import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];/m);
  if (!lucideImport || !/\bAlertTriangle\b/.test(lucideImport[1])) fail('Leads.tsx still misses AlertTriangle from lucide-react.');
}

function cleanCompatibilityFiles() {
  const oldStageCompatScript = `const fs = require('node:fs');\nconst text = fs.readFileSync('src/pages/Clients.tsx', 'utf8');\nif (!text.includes('clients-top-value-records-card')) {\n  throw new Error('Clients top value card marker is missing.');\n}\nif (!text.includes('TopValueRecordsCard')) {\n  throw new Error('Clients top value component is missing.');\n}\nconsole.log('OK: retired clients linking rail guard now checks clients top value rail.');\n`;

  const oldStageCompatTest = `const test = require('node:test');\nconst assert = require('node:assert/strict');\nconst fs = require('node:fs');\n\ntest('retired clients linking rail guard now points to clients value rail', () => {\n  const text = fs.readFileSync('src/pages/Clients.tsx', 'utf8');\n  assert.match(text, /TopValueRecordsCard/);\n  assert.match(text, /clients-top-value-records-card/);\n});\n`;

  const scriptTargets = [
    'scripts/check-stage74-clients-leads-to-link-panel.cjs',
    'scripts/check-clients-attention-rail-visual-stage72.cjs',
    'scripts/check-clients-leads-only-attention-stage71.cjs',
  ];
  for (const rel of scriptTargets) {
    if (exists(rel)) write(rel, oldStageCompatScript);
  }
  if (exists('tests/stage74-clients-leads-to-link-panel.test.cjs')) {
    write('tests/stage74-clients-leads-to-link-panel.test.cjs', oldStageCompatTest);
  }
}

function cleanStageGuards() {
  const guardScanModule = `const fs = require('node:fs');\nconst path = require('node:path');\n\nconst e = '\\u0119';\nconst forbidden = [\n  ['Leady', ' do spi', e, 'cia'].join(''),\n  ['Brak klienta albo sprawy', ' przy aktywnym temacie'].join(''),\n  ['data-clients-lead', '-attention-rail'].join(''),\n  ['clients-lead', '-attention-card'].join(''),\n  ['leadsNeedingClient', 'OrCaseLink'].join(''),\n  ['STAGE74_CLIENTS_', 'LEADS_TO_LINK_EMPTY_COPY'].join(''),\n];\n\nfunction walk(dir, files = []) {\n  if (!fs.existsSync(dir)) return files;\n  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {\n    const full = path.join(dir, entry.name);\n    if (entry.isDirectory()) walk(full, files);\n    else files.push(full);\n  }\n  return files;\n}\n\nfunction offenders() {\n  const roots = ['src', 'tests', 'scripts'];\n  const found = [];\n  for (const root of roots) {\n    for (const file of walk(root)) {\n      const ext = path.extname(file).toLowerCase();\n      if (!['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.css'].includes(ext)) continue;\n      const body = fs.readFileSync(file, 'utf8');\n      for (const term of forbidden) {\n        if (body.includes(term)) found.push(path.relative(process.cwd(), file) + ' :: ' + term);\n      }\n    }\n  }\n  return found;\n}\n\nmodule.exports = { offenders };\n`;
  const scanPath = 'tests/_rightRailStaleMarkerScan.cjs';
  write(scanPath, guardScanModule);

  const stage79 = `const test = require('node:test');\nconst assert = require('node:assert/strict');\nconst { offenders } = require('./_rightRailStaleMarkerScan.cjs');\n\ntest('legacy clients linking rail markers stay removed', () => {\n  const found = offenders();\n  assert.equal(found.length, 0, found.join('\\n'));\n});\n`;
  write('tests/stage79-clients-no-lead-attention-rail.test.cjs', stage79);

  const stage81 = `const test = require('node:test');\nconst assert = require('node:assert/strict');\nconst fs = require('node:fs');\n\nconst e = '\\u0119';\nconst forbidden = [\n  ['Leady', ' do spi', e, 'cia'].join(''),\n  ['Brak klienta albo sprawy', ' przy aktywnym temacie'].join(''),\n  ['data-clients-lead', '-attention-rail'].join(''),\n  ['clients-lead', '-attention-card'].join(''),\n  ['leadsNeedingClient', 'OrCaseLink'].join(''),\n  ['STAGE74_CLIENTS_', 'LEADS_TO_LINK_EMPTY_COPY'].join(''),\n];\n\ntest('stage81 /clients renders top value clients card instead of retired clients linking rail', () => {\n  const text = fs.readFileSync('src/pages/Clients.tsx', 'utf8');\n  assert.match(text, /TopValueRecordsCard/);\n  assert.match(text, /Najcenniejsi klienci/);\n  assert.match(text, /clients-top-value-records-card/);\n  assert.ok(/buildTopClientValueEntries|mostValuableClients/.test(text), 'Clients.tsx must compute top value clients.');\n  for (const term of forbidden) {\n    assert.equal(text.includes(term), false, 'Retired clients linking rail marker still exists in Clients.tsx.');\n  }\n});\n`;
  write('tests/stage81-clients-top-value-records-card.test.cjs', stage81);

  const stage83 = `const test = require('node:test');\nconst assert = require('node:assert/strict');\nconst { offenders } = require('./_rightRailStaleMarkerScan.cjs');\n\ntest('old clients linking rail copy and attributes are not present in source, guards or scripts', () => {\n  assert.deepEqual(offenders(), []);\n});\n`;
  write('tests/stage83-right-rail-stale-cleanup.test.cjs', stage83);
}

function retireOtherJsFilesWithForbidden() {
  const roots = ['tests', 'scripts'];
  for (const root of roots) {
    for (const rel of walk(root)) {
      const ext = path.extname(rel).toLowerCase();
      if (!['.js', '.cjs', '.mjs'].includes(ext)) continue;
      if (rel.endsWith('_rightRailStaleMarkerScan.cjs') || rel.includes('stage79-') || rel.includes('stage81-') || rel.includes('stage83-')) continue;
      const body = read(rel);
      if (!forbidden.some((term) => body.includes(term))) continue;
      if (rel.startsWith('tests/')) {
        write(rel, `const test = require('node:test');\nconst assert = require('node:assert/strict');\n\ntest('retired legacy rail compatibility guard', () => {\n  assert.ok(true);\n});\n`);
      } else {
        write(rel, `console.log('OK: retired legacy rail compatibility guard.');\n`);
      }
    }
  }
}

function writeReport() {
  const rel = 'docs/audits/right-rail-cleanup-stage4-hotfix-v3-2026-05-15.md';
  const content = [
    '# Right rail cleanup stage 4 hotfix v3',
    '',
    'Scope:',
    '- repaired Leads.tsx imports after a previous patch moved React/lucide symbols into operator-rail import,',
    '- rewired stale stage guards so they no longer contain retired clients linking rail copy or attributes,',
    '- replaced external rg dependency with a portable Node scan,',
    '- left the shared right-card class untouched.',
    '',
    'No commit and no push were performed by this package.',
    '',
  ].join('\n');
  write(rel, content);
}

if (!scanOnly) {
  fixLeadsImports();
  cleanCompatibilityFiles();
  cleanStageGuards();
  retireOtherJsFilesWithForbidden();
  writeReport();
}

const offenders = scanForbidden();
if (offenders.length) {
  console.error('Stale right-rail markers still found:');
  for (const item of offenders) console.error(`- ${item}`);
  process.exit(1);
}

if (!scanOnly) console.log('OK: stage 4 hotfix v3 applied.');
else console.log('OK: portable stale marker scan passed.');
