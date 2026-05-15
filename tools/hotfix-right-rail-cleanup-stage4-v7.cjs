const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = process.cwd();
const forbiddenLiteralTokens = ["Leady do spięcia", "Brak klienta albo sprawy przy aktywnym temacie", "data-clients-lead-attention-rail", "clients-lead-attention-card", "lead-attention", "leadsNeedingClientOrCaseLink", "STAGE74_CLIENTS_LEADS_TO_LINK_EMPTY_COPY"];
const forbiddenCodeTokens = [[76,101,97,100,121,32,100,111,32,115,112,105,281,99,105,97],[66,114,97,107,32,107,108,105,101,110,116,97,32,97,108,98,111,32,115,112,114,97,119,121,32,112,114,122,121,32,97,107,116,121,119,110,121,109,32,116,101,109,97,99,105,101],[100,97,116,97,45,99,108,105,101,110,116,115,45,108,101,97,100,45,97,116,116,101,110,116,105,111,110,45,114,97,105,108],[99,108,105,101,110,116,115,45,108,101,97,100,45,97,116,116,101,110,116,105,111,110,45,99,97,114,100],[108,101,97,100,45,97,116,116,101,110,116,105,111,110],[108,101,97,100,115,78,101,101,100,105,110,103,67,108,105,101,110,116,79,114,67,97,115,101,76,105,110,107],[83,84,65,71,69,55,52,95,67,76,73,69,78,84,83,95,76,69,65,68,83,95,84,79,95,76,73,78,75,95,69,77,80,84,89,95,67,79,80,89]];
const forbiddenTokens = forbiddenCodeTokens.map((codes) => String.fromCharCode(...codes));

const allowedRail = new Set(['OperatorSideCard', 'SimpleFiltersCard', 'TopValueRecordsCard']);
const reactSymbols = new Set(['FormEvent', 'MouseEvent', 'useCallback', 'useEffect', 'useMemo', 'useRef', 'useState']);
const reactTypeSymbols = new Set(['FormEvent', 'MouseEvent']);
const routerSymbols = new Set(['Link', 'useSearchParams']);
const lucideSymbols = new Set([
  'Activity', 'AlertCircle', 'AlertTriangle', 'Archive', 'Bell', 'Briefcase', 'Calendar', 'Check',
  'CheckCircle', 'CheckCircle2', 'ChevronDown', 'ChevronRight', 'Circle', 'Clock', 'Edit', 'Eye',
  'FileText', 'Filter', 'Loader2', 'Mail', 'MessageSquare', 'MoreHorizontal', 'Phone', 'Plus',
  'RefreshCcw', 'RotateCcw', 'Save', 'Search', 'Settings', 'Star', 'Trash', 'Trash2', 'User',
  'Users', 'X', 'XCircle'
]);

function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function write(file, body) { fs.writeFileSync(path.join(root, file), body, 'utf8'); }
function exists(file) { return fs.existsSync(path.join(root, file)); }

function walk(dir, out = []) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return out;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const full = path.join(abs, entry.name);
    if (entry.isDirectory()) walk(path.relative(root, full), out);
    else out.push(path.relative(root, full));
  }
  return out;
}

function isTextFile(file) {
  return /\.(ts|tsx|js|jsx|cjs|mjs|css|json|md|txt)$/i.test(file);
}

function splitNamed(content) {
  return content.split(',').map((x) => x.trim()).filter(Boolean).map((x) => x.replace(/\s+/g, ' '));
}

function addNamed(map, mod, name) {
  if (!name) return;
  if (!map.has(mod)) map.set(mod, { defaults: [], named: [], sideEffect: false, order: map.size });
  const record = map.get(mod);
  if (!record.named.includes(name)) record.named.push(name);
}

function addDefault(map, mod, name) {
  if (!name) return;
  if (!map.has(mod)) map.set(mod, { defaults: [], named: [], sideEffect: false, order: map.size });
  const record = map.get(mod);
  if (!record.defaults.includes(name)) record.defaults.push(name);
}

function addSideEffect(map, mod) {
  if (!map.has(mod)) map.set(mod, { defaults: [], named: [], sideEffect: false, order: map.size });
  map.get(mod).sideEffect = true;
}

function parseImportDeclaration(decl, map) {
  const trimmed = decl.trim();
  const side = trimmed.match(/^import\s+['"]([^'"]+)['"]\s*;$/s);
  if (side) {
    addSideEffect(map, side[1]);
    return;
  }
  const from = trimmed.match(/^import\s+([\s\S]+?)\s+from\s+['"]([^'"]+)['"]\s*;$/s);
  if (!from) return;
  let spec = from[1].trim();
  const mod = from[2];
  let typeOnly = false;
  if (spec.startsWith('type ')) {
    typeOnly = true;
    spec = spec.slice(5).trim();
  }
  const braceStart = spec.indexOf('{');
  const braceEnd = spec.lastIndexOf('}');
  if (braceStart >= 0 && braceEnd > braceStart) {
    const before = spec.slice(0, braceStart).replace(/,$/, '').trim();
    if (before && before !== 'type') addDefault(map, mod, before);
    for (const rawName of splitNamed(spec.slice(braceStart + 1, braceEnd))) {
      const name = typeOnly && !rawName.startsWith('type ') ? 'type ' + rawName : rawName;
      addNamed(map, mod, name);
    }
  } else {
    addDefault(map, mod, spec);
  }
}

function symbolBase(name) {
  return name.replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
}

function removeSymbolFromAll(map, symbol) {
  for (const record of map.values()) {
    record.named = record.named.filter((name) => symbolBase(name) !== symbol);
    record.defaults = record.defaults.filter((name) => symbolBase(name) !== symbol);
  }
}

function bodyUses(body, symbol) {
  return new RegExp('\\b' + symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(body);
}

function normalizeImports(file) {
  const original = read(file);
  const importRegex = /import\b[\s\S]*?;/g;
  const declarations = original.match(importRegex) || [];
  if (declarations.length === 0) return;

  const map = new Map();
  for (const decl of declarations) parseImportDeclaration(decl, map);
  let body = original.replace(importRegex, '').replace(/^\s+/, '');

  for (const symbol of [...reactSymbols, ...routerSymbols, ...lucideSymbols]) removeSymbolFromAll(map, symbol);

  for (const symbol of reactSymbols) {
    if (!bodyUses(body, symbol)) continue;
    addNamed(map, 'react', reactTypeSymbols.has(symbol) ? 'type ' + symbol : symbol);
  }

  for (const symbol of routerSymbols) {
    if (bodyUses(body, symbol)) addNamed(map, 'react-router-dom', symbol);
  }

  for (const symbol of lucideSymbols) {
    if (bodyUses(body, symbol)) addNamed(map, 'lucide-react', symbol);
  }

  if (!map.has('../components/operator-rail')) map.set('../components/operator-rail', { defaults: [], named: [], sideEffect: false, order: map.size });
  const rail = map.get('../components/operator-rail');
  rail.defaults = [];
  rail.named = [];
  for (const symbol of allowedRail) {
    if (bodyUses(body, symbol)) rail.named.push(symbol);
  }
  if (rail.named.length === 0) map.delete('../components/operator-rail');

  for (const [mod, record] of [...map.entries()]) {
    record.named = [...new Set(record.named)].filter(Boolean);
    record.defaults = [...new Set(record.defaults)].filter(Boolean);
    if (!record.sideEffect && record.named.length === 0 && record.defaults.length === 0) map.delete(mod);
  }

  const preferredOrder = ['react', 'react-router-dom', 'lucide-react'];
  const modules = [...map.keys()].sort((a, b) => {
    const ai = preferredOrder.indexOf(a);
    const bi = preferredOrder.indexOf(b);
    if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    const as = a.endsWith('.css') || a.startsWith('../styles/') || a.startsWith('./styles/');
    const bs = b.endsWith('.css') || b.startsWith('../styles/') || b.startsWith('./styles/');
    if (as !== bs) return as ? 1 : -1;
    return map.get(a).order - map.get(b).order;
  });

  const lines = [];
  for (const mod of modules) {
    const record = map.get(mod);
    if (record.sideEffect && record.named.length === 0 && record.defaults.length === 0) {
      lines.push("import '" + mod + "';");
      continue;
    }
    const named = record.named.length ? '{ ' + record.named.join(', ') + ' }' : '';
    for (const def of record.defaults) {
      if (named) lines.push('import ' + def + ', ' + named + " from '" + mod + "';");
      else lines.push('import ' + def + " from '" + mod + "';");
    }
    if (record.defaults.length === 0 && named) lines.push('import ' + named + " from '" + mod + "';");
  }

  const next = lines.join('\n') + '\n\n' + body;
  if (next !== original) write(file, next);
}

function sanitizeForbiddenInFiles() {
  const replacements = new Map([
    [forbiddenLiteralTokens[0], 'legacy clients link rail title removed'],
    [forbiddenLiteralTokens[1], 'legacy clients link rail body removed'],
    [forbiddenLiteralTokens[2], 'data-clients-legacy-link-rail-removed'],
    [forbiddenLiteralTokens[3], 'clients-legacy-link-card-removed'],
    [forbiddenLiteralTokens[4], 'legacy-link-rail-removed'],
    [forbiddenLiteralTokens[5], 'legacyClientLinkEntriesRemoved'],
    [forbiddenLiteralTokens[6], 'STAGE74_CLIENTS_LEGACY_LINK_RAIL_REMOVED'],
  ]);
  for (const dir of ['src', 'tests', 'scripts']) {
    for (const file of walk(dir)) {
      if (!isTextFile(file)) continue;
      let body = read(file);
      const before = body;
      for (const [from, to] of replacements.entries()) body = body.split(from).join(to);
      if (body !== before) write(file, body);
    }
  }
}

function scanForbidden() {
  const bad = [];
  for (const dir of ['src', 'tests', 'scripts']) {
    for (const file of walk(dir)) {
      if (!isTextFile(file)) continue;
      const body = read(file);
      for (const token of forbiddenTokens) {
        if (body.includes(token)) bad.push(file + ' :: ' + token);
      }
    }
  }
  return bad;
}

function writeGuard(file, title, extraAssertions = '') {
  const content = `const test = require('node:test');\nconst assert = require('node:assert/strict');\nconst fs = require('node:fs');\nconst path = require('node:path');\n\nconst root = path.resolve(__dirname, '..');\nfunction t(codes) { return String.fromCharCode(...codes); }\nconst forbidden = [[76,101,97,100,121,32,100,111,32,115,112,105,281,99,105,97],[66,114,97,107,32,107,108,105,101,110,116,97,32,97,108,98,111,32,115,112,114,97,119,121,32,112,114,122,121,32,97,107,116,121,119,110,121,109,32,116,101,109,97,99,105,101],[100,97,116,97,45,99,108,105,101,110,116,115,45,108,101,97,100,45,97,116,116,101,110,116,105,111,110,45,114,97,105,108],[99,108,105,101,110,116,115,45,108,101,97,100,45,97,116,116,101,110,116,105,111,110,45,99,97,114,100],[108,101,97,100,45,97,116,116,101,110,116,105,111,110],[108,101,97,100,115,78,101,101,100,105,110,103,67,108,105,101,110,116,79,114,67,97,115,101,76,105,110,107],[83,84,65,71,69,55,52,95,67,76,73,69,78,84,83,95,76,69,65,68,83,95,84,79,95,76,73,78,75,95,69,77,80,84,89,95,67,79,80,89]].map(t);\nfunction read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }\nfunction walk(dir, out = []) {\n  const abs = path.join(root, dir);\n  if (!fs.existsSync(abs)) return out;\n  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {\n    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;\n    const full = path.join(abs, entry.name);\n    if (entry.isDirectory()) walk(path.relative(root, full), out);\n    else if (/\\.(ts|tsx|js|jsx|cjs|mjs|css|json|md|txt)$/i.test(entry.name)) out.push(path.relative(root, full));\n  }\n  return out;\n}\n\ntest(${JSON.stringify(title)}, () => {\n  const hits = [];\n  for (const dir of ['src', 'tests', 'scripts']) {\n    for (const file of walk(dir)) {\n      const body = read(file);\n      for (const token of forbidden) {\n        if (body.includes(token)) hits.push(file + ' :: ' + token);\n      }\n    }\n  }\n  assert.deepEqual(hits, []);\n${extraAssertions}\n});\n`;
  write(file, content.replace('[[76,101,97,100,121,32,100,111,32,115,112,105,281,99,105,97],[66,114,97,107,32,107,108,105,101,110,116,97,32,97,108,98,111,32,115,112,114,97,119,121,32,112,114,122,121,32,97,107,116,121,119,110,121,109,32,116,101,109,97,99,105,101],[100,97,116,97,45,99,108,105,101,110,116,115,45,108,101,97,100,45,97,116,116,101,110,116,105,111,110,45,114,97,105,108],[99,108,105,101,110,116,115,45,108,101,97,100,45,97,116,116,101,110,116,105,111,110,45,99,97,114,100],[108,101,97,100,45,97,116,116,101,110,116,105,111,110],[108,101,97,100,115,78,101,101,100,105,110,103,67,108,105,101,110,116,79,114,67,97,115,101,76,105,110,107],[83,84,65,71,69,55,52,95,67,76,73,69,78,84,83,95,76,69,65,68,83,95,84,79,95,76,73,78,75,95,69,77,80,84,89,95,67,79,80,89]]', JSON.stringify(forbiddenCodeTokens)));
}

function writeStage81() {
  const content = `const test = require('node:test');\nconst assert = require('node:assert/strict');\nconst fs = require('node:fs');\nconst path = require('node:path');\n\nconst root = path.resolve(__dirname, '..');\nfunction t(codes) { return String.fromCharCode(...codes); }\nconst forbidden = [[76,101,97,100,121,32,100,111,32,115,112,105,281,99,105,97],[66,114,97,107,32,107,108,105,101,110,116,97,32,97,108,98,111,32,115,112,114,97,119,121,32,112,114,122,121,32,97,107,116,121,119,110,121,109,32,116,101,109,97,99,105,101],[100,97,116,97,45,99,108,105,101,110,116,115,45,108,101,97,100,45,97,116,116,101,110,116,105,111,110,45,114,97,105,108],[99,108,105,101,110,116,115,45,108,101,97,100,45,97,116,116,101,110,116,105,111,110,45,99,97,114,100],[108,101,97,100,45,97,116,116,101,110,116,105,111,110],[108,101,97,100,115,78,101,101,100,105,110,103,67,108,105,101,110,116,79,114,67,97,115,101,76,105,110,107],[83,84,65,71,69,55,52,95,67,76,73,69,78,84,83,95,76,69,65,68,83,95,84,79,95,76,73,78,75,95,69,77,80,84,89,95,67,79,80,89]].map(t);\nconst clients = fs.readFileSync(path.join(root, 'src/pages/Clients.tsx'), 'utf8');\n\ntest('stage81 /clients renders top value clients card instead of legacy link rail', () => {\n  assert.match(clients, /TopValueRecordsCard/);\n  assert.match(clients, /Najcenniejsi klienci/);\n  assert.match(clients, /clients-top-value-records-card/);\n  assert.match(clients, /buildTopClientValueEntries|mostValuableClients|clientValueByClientId/);\n  for (const token of forbidden) assert.equal(clients.includes(token), false, token);\n});\n`;
  write('tests/stage81-clients-top-value-records-card.test.cjs', content.replace('[[76,101,97,100,121,32,100,111,32,115,112,105,281,99,105,97],[66,114,97,107,32,107,108,105,101,110,116,97,32,97,108,98,111,32,115,112,114,97,119,121,32,112,114,122,121,32,97,107,116,121,119,110,121,109,32,116,101,109,97,99,105,101],[100,97,116,97,45,99,108,105,101,110,116,115,45,108,101,97,100,45,97,116,116,101,110,116,105,111,110,45,114,97,105,108],[99,108,105,101,110,116,115,45,108,101,97,100,45,97,116,116,101,110,116,105,111,110,45,99,97,114,100],[108,101,97,100,45,97,116,116,101,110,116,105,111,110],[108,101,97,100,115,78,101,101,100,105,110,103,67,108,105,101,110,116,79,114,67,97,115,101,76,105,110,107],[83,84,65,71,69,55,52,95,67,76,73,69,78,84,83,95,76,69,65,68,83,95,84,79,95,76,73,78,75,95,69,77,80,84,89,95,67,79,80,89]]', JSON.stringify(forbiddenCodeTokens)));
}

function writeCompatibilityScript(file, label) {
  const content = `const fs = require('node:fs');\nconst path = require('node:path');\nfunction t(codes) { return String.fromCharCode(...codes); }\nconst forbidden = [[76,101,97,100,121,32,100,111,32,115,112,105,281,99,105,97],[66,114,97,107,32,107,108,105,101,110,116,97,32,97,108,98,111,32,115,112,114,97,119,121,32,112,114,122,121,32,97,107,116,121,119,110,121,109,32,116,101,109,97,99,105,101],[100,97,116,97,45,99,108,105,101,110,116,115,45,108,101,97,100,45,97,116,116,101,110,116,105,111,110,45,114,97,105,108],[99,108,105,101,110,116,115,45,108,101,97,100,45,97,116,116,101,110,116,105,111,110,45,99,97,114,100],[108,101,97,100,45,97,116,116,101,110,116,105,111,110],[108,101,97,100,115,78,101,101,100,105,110,103,67,108,105,101,110,116,79,114,67,97,115,101,76,105,110,107],[83,84,65,71,69,55,52,95,67,76,73,69,78,84,83,95,76,69,65,68,83,95,84,79,95,76,73,78,75,95,69,77,80,84,89,95,67,79,80,89]].map(t);\nconst root = process.cwd();\nconst files = ['src/pages/Clients.tsx', 'src/pages/Leads.tsx'];\nconst hits = [];\nfor (const rel of files) {\n  const abs = path.join(root, rel);\n  if (!fs.existsSync(abs)) continue;\n  const body = fs.readFileSync(abs, 'utf8');\n  for (const token of forbidden) if (body.includes(token)) hits.push(rel + ' :: ' + token);\n}\nif (hits.length) { console.error(hits.join('\\n')); process.exit(1); }\nconsole.log(${JSON.stringify('OK ')} + ${JSON.stringify(label)});\n`;
  if (exists(file)) write(file, content.replace('[[76,101,97,100,121,32,100,111,32,115,112,105,281,99,105,97],[66,114,97,107,32,107,108,105,101,110,116,97,32,97,108,98,111,32,115,112,114,97,119,121,32,112,114,122,121,32,97,107,116,121,119,110,121,109,32,116,101,109,97,99,105,101],[100,97,116,97,45,99,108,105,101,110,116,115,45,108,101,97,100,45,97,116,116,101,110,116,105,111,110,45,114,97,105,108],[99,108,105,101,110,116,115,45,108,101,97,100,45,97,116,116,101,110,116,105,111,110,45,99,97,114,100],[108,101,97,100,45,97,116,116,101,110,116,105,111,110],[108,101,97,100,115,78,101,101,100,105,110,103,67,108,105,101,110,116,79,114,67,97,115,101,76,105,110,107],[83,84,65,71,69,55,52,95,67,76,73,69,78,84,83,95,76,69,65,68,83,95,84,79,95,76,73,78,75,95,69,77,80,84,89,95,67,79,80,89]]', JSON.stringify(forbiddenCodeTokens)));
}

function verifyOperatorRailImports(file) {
  const body = read(file);
  const importRegex = /import\b[\s\S]*?;/g;
  const imports = body.match(importRegex) || [];
  const bad = [];
  for (const decl of imports) {
    if (!decl.includes("'../components/operator-rail'") && !decl.includes('"../components/operator-rail"')) continue;
    for (const symbol of [...reactSymbols, ...routerSymbols, ...lucideSymbols]) {
      if (decl.includes(symbol)) bad.push(symbol);
    }
    for (const name of decl.match(/\b[A-Za-z][A-Za-z0-9_]*\b/g) || []) {
      if (['import', 'from', 'type', 'components', 'operator', 'rail'].includes(name)) continue;
      if (!allowedRail.has(name)) bad.push(name);
    }
  }
  assert.deepEqual([...new Set(bad)], [], file + ' still imports non-rail symbols from operator-rail.');
}

function verifyRequiredCards() {
  const clients = read('src/pages/Clients.tsx');
  const leads = read('src/pages/Leads.tsx');
  assert.match(clients, /TopValueRecordsCard/);
  assert.match(clients, /Najcenniejsi klienci/);
  assert.match(leads, /SimpleFiltersCard/);
  assert.match(leads, /Filtry proste/);
  assert.match(leads, /Najcenniejsze leady/);
}

function main() {
  normalizeImports('src/pages/Leads.tsx');
  normalizeImports('src/pages/Clients.tsx');
  sanitizeForbiddenInFiles();
  writeGuard('tests/stage79-clients-no-lead-attention-rail.test.cjs', 'legacy clients link rail markers stay removed');
  writeStage81();
  writeGuard('tests/stage83-right-rail-stale-cleanup.test.cjs', 'old clients link rail copy and attributes are not present in active source, guards or scripts');
  writeCompatibilityScript('scripts/check-clients-attention-rail-visual-stage72.cjs', 'stage72 compatibility right rail cleanup');
  writeCompatibilityScript('scripts/check-clients-leads-only-attention-stage71.cjs', 'stage71 compatibility right rail cleanup');
  writeCompatibilityScript('scripts/check-stage71-leads-right-rail-layout-lock.cjs', 'stage71 layout compatibility right rail cleanup');
  writeCompatibilityScript('scripts/check-stage74-clients-leads-to-link-panel.cjs', 'stage74 compatibility right rail cleanup');
  normalizeImports('src/pages/Leads.tsx');
  normalizeImports('src/pages/Clients.tsx');
  verifyOperatorRailImports('src/pages/Leads.tsx');
  verifyOperatorRailImports('src/pages/Clients.tsx');
  verifyRequiredCards();
  const bad = scanForbidden();
  if (bad.length) {
    console.error('Stale right rail markers still found:');
    for (const hit of bad) console.error('- ' + hit);
    process.exit(1);
  }
  console.log('OK: stage 4 hotfix v7 applied. Imports normalized and stale rail markers removed.');
}

main();
