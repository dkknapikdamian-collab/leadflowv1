const fs = require('fs');
const path = require('path');

const repo = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function write(rel, value) {
  fs.writeFileSync(path.join(repo, rel), value, 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(repo, rel));
}

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function splitLiteral(value) {
  // Avoid keeping stale banned copy as a contiguous literal inside guards.
  return value
    .split(/(\s+|-)/)
    .filter(Boolean)
    .map((part) => JSON.stringify(part))
    .join(' + ');
}

function findImportBlocks(source, moduleName) {
  const blocks = [];
  const importRe = /import\s+([^;]+?)\s+from\s+['"]([^'"]+)['"];\s*/gs;
  let match;
  while ((match = importRe.exec(source))) {
    if (match[2] === moduleName) {
      blocks.push({
        full: match[0],
        spec: match[1],
        start: match.index,
        end: importRe.lastIndex,
      });
    }
  }
  return blocks;
}

function parseNamed(spec) {
  const named = [];
  const m = String(spec).match(/\{([\s\S]*?)\}/);
  if (!m) return named;
  for (const raw of m[1].split(',')) {
    const item = raw.trim();
    if (item) named.push(item);
  }
  return named;
}

function makeNamedImport(names, moduleName) {
  const clean = Array.from(new Set(names.map((x) => x.trim()).filter(Boolean)));
  if (!clean.length) return '';
  if (clean.length <= 3) return `import { ${clean.join(', ')} } from '${moduleName}';\n`;
  return `import {\n  ${clean.join(',\n  ')}\n} from '${moduleName}';\n`;
}

function upsertNamedImport(source, moduleName, namesToAdd) {
  const blocks = findImportBlocks(source, moduleName);
  if (!blocks.length) {
    const firstImport = source.search(/^import\s/m);
    const importText = makeNamedImport(namesToAdd, moduleName);
    if (firstImport >= 0) return source.slice(0, firstImport) + importText + source.slice(firstImport);
    return importText + source;
  }

  const first = blocks[0];
  const names = parseNamed(first.spec);
  for (const name of namesToAdd) if (!names.includes(name)) names.push(name);
  const replacement = makeNamedImport(names, moduleName);

  source = source.slice(0, first.start) + replacement + source.slice(first.end);

  // Remove duplicated identical symbols from later imports from the same module when possible.
  const later = findImportBlocks(source, moduleName).slice(1).reverse();
  for (const block of later) {
    const restNames = parseNamed(block.spec).filter((name) => !namesToAdd.includes(name));
    const rest = restNames.length ? makeNamedImport(restNames, moduleName) : '';
    source = source.slice(0, block.start) + rest + source.slice(block.end);
  }
  return source;
}

function updateNamedImport(source, moduleName, transformNames) {
  const blocks = findImportBlocks(source, moduleName);
  if (!blocks.length) return source;
  for (const block of blocks.reverse()) {
    const names = parseNamed(block.spec);
    const updated = transformNames(names);
    const replacement = makeNamedImport(updated, moduleName);
    source = source.slice(0, block.start) + replacement + source.slice(block.end);
  }
  return source;
}

function fixLeadsImports() {
  const rel = 'src/pages/Leads.tsx';
  if (!exists(rel)) fail(`${rel} not found`);
  let source = read(rel);

  // React hooks must come from react, not react-router-dom.
  const reactHooks = ['useCallback', 'useEffect', 'useMemo', 'useRef', 'useState'];
  let movedHooks = new Set();

  source = updateNamedImport(source, 'react-router-dom', (names) => {
    const keep = [];
    for (const name of names) {
      if (reactHooks.includes(name)) movedHooks.add(name);
      else keep.push(name);
    }
    return keep;
  });

  const requiredHooks = Array.from(new Set([...movedHooks, 'useCallback', 'useEffect', 'useMemo', 'useRef', 'useState']));
  source = upsertNamedImport(source, 'react', requiredHooks);

  // operator-rail can export SimpleFiltersCard and TopValueRecordsCard, not lucide icons or React hooks.
  let needsAlertTriangle = false;
  source = updateNamedImport(source, '../components/operator-rail', (names) => {
    const keep = [];
    for (const name of names) {
      if (name === 'AlertTriangle') {
        needsAlertTriangle = true;
        continue;
      }
      if (name === 'useState') continue;
      if (!keep.includes(name)) keep.push(name);
    }
    for (const needed of ['SimpleFiltersCard', 'TopValueRecordsCard']) {
      if (!keep.includes(needed)) keep.push(needed);
    }
    return keep;
  });

  if (!findImportBlocks(source, '../components/operator-rail').length) {
    source = upsertNamedImport(source, '../components/operator-rail', ['SimpleFiltersCard', 'TopValueRecordsCard']);
  }

  // Ensure AlertTriangle comes from lucide-react if the page uses it.
  if (needsAlertTriangle || /\bAlertTriangle\b/.test(source)) {
    source = upsertNamedImport(source, 'lucide-react', ['AlertTriangle']);
  }

  // Remove accidental empty imports that may have appeared after cleanup.
  source = source.replace(/import\s+\{\s*\}\s+from\s+['"][^'"]+['"];\s*/g, '');

  const forbiddenWrongImports = [
    "import { AlertTriangle, useState } from '../components/operator-rail';",
    "AlertTriangle, useState } from '../components/operator-rail'",
    "useCallback, useEffect, useMemo, useRef, useSearchParams } from 'react-router-dom'",
  ];
  for (const marker of forbiddenWrongImports) {
    if (source.includes(marker)) fail(`${rel} still has broken import marker: ${marker}`);
  }

  write(rel, source);
}

function rewriteStage81Guard() {
  const rel = 'tests/stage81-clients-top-value-records-card.test.cjs';
  if (!exists(rel)) return;

  const lines = [];
  lines.push("const fs = require('fs');");
  lines.push("const path = require('path');");
  lines.push("const test = require('node:test');");
  lines.push("const assert = require('node:assert/strict');");
  lines.push("");
  lines.push("const root = path.resolve(__dirname, '..');");
  lines.push("const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');");
  lines.push("");
  lines.push("const staleMarkers = [");
  lines.push(`  ${splitLiteral('Leady do spięcia')},`);
  lines.push(`  ${splitLiteral('Brak klienta albo sprawy przy aktywnym temacie')},`);
  lines.push(`  ${splitLiteral('data-clients-lead-attention-rail')},`);
  lines.push(`  ${splitLiteral('clients-lead-attention-card')},`);
  lines.push(`  ${splitLiteral('lead-attention')},`);
  lines.push(`  ${splitLiteral('leadsNeedingClientOrCaseLink')},`);
  lines.push(`  ${splitLiteral('STAGE74_CLIENTS_LEADS_TO_LINK_EMPTY_COPY')},`);
  lines.push("];");
  lines.push("");
  lines.push("test('stage81 /clients renders top value clients card instead of legacy lead-linking rail', () => {");
  lines.push("  const clients = read('src/pages/Clients.tsx');");
  lines.push("  assert.match(clients, /TopValueRecordsCard/, 'Clients.tsx must render TopValueRecordsCard.');");
  lines.push("  assert.match(clients, /Najcenniejsi klienci/, 'Clients.tsx must render Najcenniejsi klienci title.');");
  lines.push("  assert.match(clients, /clients-top-value-records-card/, 'Clients.tsx must expose clients-top-value-records-card test id.');");
  lines.push("  assert.match(clients, /clientValueByClientId/, 'Clients.tsx must use existing clientValueByClientId value source.');");
  lines.push("  assert.match(clients, /buildTopClientValueEntries|mostValuableClients/, 'Clients.tsx must build top client value entries.');");
  lines.push("  for (const marker of staleMarkers) {");
  lines.push("    assert.equal(clients.includes(marker), false, `Clients.tsx still contains stale marker: ${marker}`);");
  lines.push("  }");
  lines.push("});");
  lines.push("");

  write(rel, lines.join('\n'));
}

function rewriteStage79GuardIfNeeded() {
  const rel = 'tests/stage79-clients-no-lead-attention-rail.test.cjs';
  if (!exists(rel)) return;
  const lines = [];
  lines.push("const fs = require('fs');");
  lines.push("const path = require('path');");
  lines.push("const test = require('node:test');");
  lines.push("const assert = require('node:assert/strict');");
  lines.push("");
  lines.push("const root = path.resolve(__dirname, '..');");
  lines.push("");
  lines.push("const staleMarkers = [");
  lines.push(`  ${splitLiteral('Leady do spięcia')},`);
  lines.push(`  ${splitLiteral('Brak klienta albo sprawy przy aktywnym temacie')},`);
  lines.push(`  ${splitLiteral('data-clients-lead-attention-rail')},`);
  lines.push(`  ${splitLiteral('clients-lead-attention-card')},`);
  lines.push(`  ${splitLiteral('lead-attention')},`);
  lines.push(`  ${splitLiteral('leadsNeedingClientOrCaseLink')},`);
  lines.push(`  ${splitLiteral('STAGE74_CLIENTS_LEADS_TO_LINK_EMPTY_COPY')},`);
  lines.push("];");
  lines.push("");
  lines.push("function scan(rel) {");
  lines.push("  const abs = path.join(root, rel);");
  lines.push("  if (!fs.existsSync(abs)) return [];");
  lines.push("  const text = fs.readFileSync(abs, 'utf8');");
  lines.push("  return staleMarkers.filter((marker) => text.includes(marker)).map((marker) => `${rel} :: ${marker}`);");
  lines.push("}");
  lines.push("");
  lines.push("test('legacy clients lead-linking rail markers stay removed', () => {");
  lines.push("  const findings = [");
  lines.push("    ...scan('src/pages/Clients.tsx'),");
  lines.push("    ...scan('src/pages/Leads.tsx'),");
  lines.push("    ...scan('tests/stage81-clients-top-value-records-card.test.cjs'),");
  lines.push("  ];");
  lines.push("  assert.equal(findings.length, 0, findings.join('\\n'));");
  lines.push("});");
  lines.push("");
  write(rel, lines.join('\n'));
}

function rewriteStage83GuardIfNeeded() {
  const rel = 'tests/stage83-right-rail-stale-cleanup.test.cjs';
  if (!exists(rel)) return;
  const lines = [];
  lines.push("const fs = require('fs');");
  lines.push("const path = require('path');");
  lines.push("const test = require('node:test');");
  lines.push("const assert = require('node:assert/strict');");
  lines.push("");
  lines.push("const root = path.resolve(__dirname, '..');");
  lines.push("const staleMarkers = [");
  lines.push(`  ${splitLiteral('Leady do spięcia')},`);
  lines.push(`  ${splitLiteral('Brak klienta albo sprawy przy aktywnym temacie')},`);
  lines.push(`  ${splitLiteral('data-clients-lead-attention-rail')},`);
  lines.push(`  ${splitLiteral('clients-lead-attention-card')},`);
  lines.push(`  ${splitLiteral('leadsNeedingClientOrCaseLink')},`);
  lines.push(`  ${splitLiteral('STAGE74_CLIENTS_LEADS_TO_LINK_EMPTY_COPY')},`);
  lines.push("];");
  lines.push("const roots = ['src', 'tests', 'scripts'];");
  lines.push("function walk(dir, out = []) {");
  lines.push("  const abs = path.join(root, dir);");
  lines.push("  if (!fs.existsSync(abs)) return out;");
  lines.push("  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {");
  lines.push("    const rel = path.join(dir, entry.name).replaceAll('\\\\', '/');");
  lines.push("    if (entry.isDirectory()) walk(rel, out);");
  lines.push("    else if (/\\.(tsx?|jsx?|cjs|mjs|css)$/.test(entry.name)) out.push(rel);");
  lines.push("  }");
  lines.push("  return out;");
  lines.push("}");
  lines.push("test('old clients lead-linking rail copy and attributes are not present in active source, guards or scripts', () => {");
  lines.push("  const offenders = [];");
  lines.push("  for (const file of roots.flatMap((dir) => walk(dir))) {");
  lines.push("    const text = fs.readFileSync(path.join(root, file), 'utf8');");
  lines.push("    for (const marker of staleMarkers) {");
  lines.push("      if (text.includes(marker)) offenders.push(file);");
  lines.push("    }");
  lines.push("  }");
  lines.push("  assert.deepEqual([...new Set(offenders)].sort(), []);");
  lines.push("});");
  lines.push("");
  write(rel, lines.join('\n'));
}

function validateNoLiteralStaleMarkersInActiveFiles() {
  const staleMarkers = [
    'Leady do spięcia',
    'Brak klienta albo sprawy przy aktywnym temacie',
    'data-clients-lead-attention-rail',
    'clients-lead-attention-card',
    'leadsNeedingClientOrCaseLink',
    'STAGE74_CLIENTS_LEADS_TO_LINK_EMPTY_COPY',
  ];
  const roots = ['src', 'tests', 'scripts'];
  const files = [];
  function walk(rel) {
    const abs = path.join(repo, rel);
    if (!fs.existsSync(abs)) return;
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      const child = path.join(rel, entry.name);
      if (entry.isDirectory()) walk(child);
      else if (/\.(tsx?|jsx?|cjs|mjs|css)$/.test(entry.name)) files.push(child);
    }
  }
  for (const root of roots) walk(root);
  const findings = [];
  for (const file of files) {
    const text = fs.readFileSync(path.join(repo, file), 'utf8');
    for (const marker of staleMarkers) {
      if (text.includes(marker)) findings.push(`${file.replaceAll('\\', '/')} :: ${marker}`);
    }
  }
  if (findings.length) {
    console.error('Stale markers still found after hotfix:');
    for (const item of findings) console.error(`- ${item}`);
    process.exit(1);
  }
}

function validateLeadsImport() {
  const source = read('src/pages/Leads.tsx');
  if (/from ['"]..\/components\/operator-rail['"];/.test(source) && /AlertTriangle|useState/.test(source.match(/import\s+\{[\s\S]*?\}\s+from\s+['"]..\/components\/operator-rail['"];/)?.[0] || '')) {
    fail('Leads.tsx still imports AlertTriangle/useState from operator-rail.');
  }
  if (/from ['"]react-router-dom['"];/.test(source) && /useCallback|useEffect|useMemo|useRef|useState/.test(source.match(/import\s+\{[\s\S]*?\}\s+from\s+['"]react-router-dom['"];/)?.[0] || '')) {
    fail('Leads.tsx still imports React hooks from react-router-dom.');
  }
}

fixLeadsImports();
rewriteStage81Guard();
rewriteStage79GuardIfNeeded();
rewriteStage83GuardIfNeeded();
validateLeadsImport();
validateNoLiteralStaleMarkersInActiveFiles();

console.log('OK: stage4 hotfix fixed Leads imports and stale guard literals.');
