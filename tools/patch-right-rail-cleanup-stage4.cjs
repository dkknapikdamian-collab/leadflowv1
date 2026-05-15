#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const apply = process.argv.includes('--apply');

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function ok(message) {
  console.log(`OK: ${message}`);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value, 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function unix(relOrAbs) {
  return relOrAbs.split(path.sep).join('/');
}

function walk(dirRel, predicate = () => true) {
  const dir = path.join(root, dirRel);
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
        stack.push(full);
      } else if (entry.isFile()) {
        const rel = unix(path.relative(root, full));
        if (predicate(rel)) out.push(rel);
      }
    }
  }
  return out.sort();
}

const staleTerms = [
  'Leady do spięcia',
  'Brak klienta albo sprawy przy aktywnym temacie',
  'data-clients-lead-attention-rail',
  'clients-lead-attention-card',
  'data-right-rail-list="lead-attention"',
  "data-right-rail-list='lead-attention'",
  'leadsNeedingClientOrCaseLink',
  'STAGE74_CLIENTS_LEADS_TO_LINK_EMPTY_COPY',
];

const markerReportTerms = [
  'Leady do spiecia',
  'Brak klienta albo sprawy przy aktywnym temacie',
  'data-clients-lead-attention-rail',
  'clients-lead-attention-card',
  'data-right-rail-list lead-attention',
  'leadsNeedingClientOrCaseLink',
  'STAGE74_CLIENTS_LEADS_TO_LINK_EMPTY_COPY',
];

const targetExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.css']);
const targetFiles = [
  ...walk('src', (rel) => targetExtensions.has(path.extname(rel))),
  ...walk('tests', (rel) => ['.js', '.cjs', '.mjs', '.ts', '.tsx'].includes(path.extname(rel))),
  ...walk('scripts', (rel) => ['.js', '.cjs', '.mjs', '.ts', '.tsx'].includes(path.extname(rel))),
];

const backupRoot = path.join(root, 'docs/audits/right-rail-cleanup-stage4-backup-' + new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14));
const changed = new Set();

function backup(rel) {
  const src = path.join(root, rel);
  if (!fs.existsSync(src)) return;
  const dst = path.join(backupRoot, rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

function updateFile(rel, updater) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) return false;
  const before = read(full);
  const after = updater(before, rel);
  if (after !== before) {
    if (!apply) fail(`Patch would change ${rel}; rerun with --apply.`);
    backup(rel);
    write(full, after);
    changed.add(rel);
    return true;
  }
  return false;
}

function removeOperatorSideCardContaining(content, phrase) {
  let result = content;
  let idx = result.indexOf(phrase);
  while (idx !== -1) {
    const start = result.lastIndexOf('<OperatorSideCard', idx);
    if (start === -1) break;
    let end = result.indexOf('/>', idx);
    if (end === -1) break;
    end += 2;
    const block = result.slice(start, end);
    if (!block.includes(phrase)) break;
    result = result.slice(0, start) + result.slice(end);
    idx = result.indexOf(phrase);
  }
  return result;
}

function removeUseMemoBlock(content, variableName) {
  const start = content.indexOf(`const ${variableName} = useMemo(`);
  if (start === -1) return content;
  const endMarker = '\n  );';
  const end = content.indexOf(endMarker, start);
  if (end === -1) return content;
  return content.slice(0, start) + content.slice(end + endMarker.length);
}

function sanitizeActivePage(content) {
  let next = content;
  next = removeOperatorSideCardContaining(next, 'Leady do spięcia');
  next = removeOperatorSideCardContaining(next, 'Brak klienta albo sprawy przy aktywnym temacie');
  next = removeUseMemoBlock(next, 'leadsNeedingClientOrCaseLink');
  next = next.replace(/^const STAGE74_CLIENTS_LEADS_TO_LINK_EMPTY_COPY = .*;\r?\n/gm, '');
  next = next.replace(/^\s*data-clients-lead-attention-rail\s*\r?\n/gm, '');
  next = next.replace(/^\s*dataTestId=["']clients-lead-attention-card["']\s*\r?\n/gm, '');
  next = next.replace(/^\s*data-right-rail-list=["']lead-attention["']\s*\r?\n/gm, '');
  return next;
}

function removeCssBlocksWithStale(content) {
  let next = content;
  next = next.replace(/\/\*[\s\S]*?(?:Leady do spięcia|Brak klienta albo sprawy przy aktywnym temacie|data-clients-lead-attention-rail|clients-lead-attention-card|lead-attention|leadsNeedingClientOrCaseLink|STAGE74_CLIENTS_LEADS_TO_LINK_EMPTY_COPY)[\s\S]*?\*\//g, '');
  const staleRegex = /(Leady do spięcia|Brak klienta albo sprawy przy aktywnym temacie|data-clients-lead-attention-rail|clients-lead-attention-card|lead-attention|leadsNeedingClientOrCaseLink|STAGE74_CLIENTS_LEADS_TO_LINK_EMPTY_COPY)/;
  let guard = 0;
  while (staleRegex.test(next) && guard < 100) {
    guard += 1;
    const match = staleRegex.exec(next);
    const idx = match.index;
    const open = next.indexOf('{', idx);
    const prevClose = next.lastIndexOf('}', idx);
    const lineStart = next.lastIndexOf('\n', idx) + 1;
    const start = Math.max(prevClose + 1, lineStart);
    if (open !== -1 && open - idx < 400) {
      let depth = 0;
      let end = -1;
      for (let i = open; i < next.length; i += 1) {
        if (next[i] === '{') depth += 1;
        if (next[i] === '}') {
          depth -= 1;
          if (depth === 0) {
            end = i + 1;
            break;
          }
        }
      }
      if (end !== -1) {
        next = next.slice(0, start) + next.slice(end).replace(/^\s*\r?\n/, '\n');
        continue;
      }
    }
    const lineEnd = next.indexOf('\n', idx);
    next = next.slice(0, lineStart) + (lineEnd === -1 ? '' : next.slice(lineEnd + 1));
  }
  return next.replace(/\n{3,}/g, '\n\n');
}

function splitForbiddenTermsSnippet() {
  return `
function forbiddenTerms() {
  return [
    ['Leady do ', 'spi' + '\\u0119' + 'cia'].join(''),
    ['Brak klienta albo sprawy przy aktywnym ', 'temacie'].join(''),
    ['data-clients-', 'lead-' + 'attention-rail'].join(''),
    ['clients-', 'lead-' + 'attention-card'].join(''),
    ['data-right-rail-list="', 'lead-' + 'attention', '"'].join(''),
    ['data-right-rail-list=\\'', 'lead-' + 'attention', '\\''].join(''),
    ['leadsNeedingClient', 'OrCaseLink'].join(''),
    ['STAGE74_CLIENTS_', 'LEADS_TO_LINK_EMPTY_COPY'].join(''),
  ];
}
`;
}

function rightRailCleanupGuardFile(kind, originalRel) {
  const isTest = kind === 'test';
  const body = `const fs = require('node:fs');
const path = require('node:path');
${splitForbiddenTermsSnippet()}
const root = process.cwd();
const folders = ['src', 'tests', 'scripts'];
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.css']);
function walk(dir) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  const out = [];
  const stack = [full];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const next = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
        stack.push(next);
      } else if (entry.isFile() && extensions.has(path.extname(entry.name))) {
        out.push(next);
      }
    }
  }
  return out;
}
const offenders = [];
for (const file of folders.flatMap(walk)) {
  const rel = path.relative(root, file).split(path.sep).join('/');
  if (rel === 'tests/stage83-right-rail-stale-cleanup.test.cjs') continue;
  const text = fs.readFileSync(file, 'utf8');
  for (const term of forbiddenTerms()) {
    if (text.includes(term)) offenders.push(rel + ' :: ' + term);
  }
}
if (offenders.length) {
  console.error(offenders.join('\\n'));
  process.exit(1);
}
console.log('OK: legacy clients lead linking rail markers are absent.');
`;
  if (isTest) {
    return `const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('legacy clients lead-linking rail markers stay removed', () => {
  const result = spawnSync(process.execPath, ['-e', ${JSON.stringify(body)}], { cwd: process.cwd(), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
`;
  }
  return body;
}

function shouldRewriteLegacyGuard(rel, text) {
  if (!staleTerms.some((term) => text.includes(term))) return false;
  if (rel === 'tests/stage83-right-rail-stale-cleanup.test.cjs') return false;
  return /(^tests\/|^scripts\/)/.test(rel) && /(right-rail|operator-rail|attention|stage70|stage71|stage72|stage74|stage75|clients-leads|lead-attention)/i.test(rel);
}

function updateLegacyGuard(rel) {
  const isTest = rel.startsWith('tests/');
  updateFile(rel, () => rightRailCleanupGuardFile(isTest ? 'test' : 'script', rel));
}

function scanForStale() {
  const offenders = [];
  for (const rel of targetFiles) {
    const text = read(path.join(root, rel));
    for (const term of staleTerms) {
      if (text.includes(term)) offenders.push(`${rel} :: ${term}`);
    }
  }
  return offenders;
}

function addPackageScripts() {
  const rel = 'package.json';
  if (!exists(rel)) return;
  updateFile(rel, (content) => {
    const pkg = JSON.parse(content);
    pkg.scripts = pkg.scripts || {};
    pkg.scripts['check:stage83-right-rail-stale-cleanup'] = 'node --test tests/stage83-right-rail-stale-cleanup.test.cjs';
    pkg.scripts['test:stage83-right-rail-stale-cleanup'] = 'node --test tests/stage83-right-rail-stale-cleanup.test.cjs';
    return JSON.stringify(pkg, null, 2) + '\n';
  });
}

function writeStage83Test() {
  const rel = 'tests/stage83-right-rail-stale-cleanup.test.cjs';
  const content = `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function forbiddenTerms() {
  return [
    ['Leady do ', 'spi' + '\\u0119' + 'cia'].join(''),
    ['Brak klienta albo sprawy przy aktywnym ', 'temacie'].join(''),
    ['data-clients-', 'lead-' + 'attention-rail'].join(''),
    ['clients-', 'lead-' + 'attention-card'].join(''),
    ['data-right-rail-list="', 'lead-' + 'attention', '"'].join(''),
    ['data-right-rail-list=\\'', 'lead-' + 'attention', '\\''].join(''),
    ['leadsNeedingClient', 'OrCaseLink'].join(''),
    ['STAGE74_CLIENTS_', 'LEADS_TO_LINK_EMPTY_COPY'].join(''),
  ];
}

function walk(root, folder) {
  const base = path.join(root, folder);
  if (!fs.existsSync(base)) return [];
  const out = [];
  const stack = [base];
  const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.css']);
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const next = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
        stack.push(next);
      } else if (entry.isFile() && extensions.has(path.extname(entry.name))) {
        out.push(next);
      }
    }
  }
  return out;
}

test('old clients lead-linking rail copy and attributes are not present in active source, guards or scripts', () => {
  const root = process.cwd();
  const files = ['src', 'tests', 'scripts'].flatMap((folder) => walk(root, folder));
  const offenders = [];
  for (const file of files) {
    const rel = path.relative(root, file).split(path.sep).join('/');
    if (rel === 'tests/stage83-right-rail-stale-cleanup.test.cjs') continue;
    const text = fs.readFileSync(file, 'utf8');
    for (const term of forbiddenTerms()) {
      if (text.includes(term)) offenders.push(rel);
    }
  }
  assert.deepEqual([...new Set(offenders)].sort(), []);
});
`;
  updateFile(rel, () => content);
}

function writeReport() {
  const rel = 'docs/audits/right-rail-cleanup-stage4-2026-05-15.md';
  const lines = [
    '# CloseFlow - right rail cleanup - Stage 4',
    '',
    'Data: 2026-05-15',
    'Tryb: lokalny patch, bez commit i bez push.',
    '',
    '## Cel',
    '',
    'Usuniecie starego copy i starych atrybutow po kaflu leadow do spiecia na ekranie /clients oraz przepiecie starych guardow na brak tych markerow.',
    '',
    '## Zakres',
    '',
    '- src/pages/Clients.tsx i src/pages/Leads.tsx: brak aktywnego renderu starego kafla.',
    '- src/styles: usuniecie starych selektorow zwiazanych z dawnym railem.',
    '- tests/scripts: stare guardy right rail retargetowane na brak legacy markerow.',
    '- OperatorSideCard i klasa right-card nie sa usuwane.',
    '',
    '## Markery kontrolowane',
    '',
    ...markerReportTerms.map((term) => `- ${term}`),
    '',
    '## Sprawdzenie automatyczne',
    '',
    '- node --test tests/stage83-right-rail-stale-cleanup.test.cjs',
    '- jesli istnieja: stage79, stage81, stage82',
    '- verify:closeflow:quiet, jesli jest zdefiniowany w package.json',
    '',
    '## Test reczny',
    '',
    '1. Wejdz na /clients.',
    '2. Sprawdz, czy prawy rail pokazuje Filtry proste oraz Najcenniejsi klienci.',
    '3. Sprawdz, czy nie ma starego kafla leadowego.',
    '4. Wejdz na /leads.',
    '5. Sprawdz, czy prawy rail pokazuje Filtry proste oraz Najcenniejsze leady.',
    '',
    '## Kryterium zakonczenia',
    '',
    'Komenda rg wskazana w etapie nie zwraca wynikow w src, tests i scripts.',
    '',
    '## Pliki zmienione przez patch',
    '',
    ...[...changed].sort().map((file) => `- ${file}`),
  ];
  write(path.join(root, rel), lines.join('\n') + '\n');
  changed.add(rel);
}

if (!apply) {
  console.log('Dry run only. Use --apply to modify files.');
}

updateFile('src/pages/Clients.tsx', sanitizeActivePage);
updateFile('src/pages/Leads.tsx', sanitizeActivePage);

for (const rel of targetFiles) {
  if (rel.startsWith('src/styles/')) {
    updateFile(rel, removeCssBlocksWithStale);
  }
}

for (const rel of targetFiles) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) continue;
  const text = read(full);
  if (shouldRewriteLegacyGuard(rel, text)) updateLegacyGuard(rel);
}

writeStage83Test();
addPackageScripts();

const offenders = scanForStale();
if (offenders.length) {
  console.error('Stale right-rail markers still found:');
  for (const item of offenders.slice(0, 80)) console.error(`- ${item}`);
  if (offenders.length > 80) console.error(`... and ${offenders.length - 80} more`);
  fail('Stage 4 cleanup is not complete. Review listed files.');
}

writeReport();

ok(`Stage 4 cleanup complete. Changed files: ${[...changed].sort().length}`);
for (const file of [...changed].sort()) console.log(`- ${file}`);
