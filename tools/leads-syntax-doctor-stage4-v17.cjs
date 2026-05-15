#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert');

const repo = process.cwd();
const mode = process.argv.includes('--check') ? 'check' : 'fix';

const leadsPath = path.join(repo, 'src', 'pages', 'Leads.tsx');
const testsDir = path.join(repo, 'tests');
const auditDir = path.join(repo, 'docs', 'audits');

function readText(file) {
  let text = fs.readFileSync(file, 'utf8');
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  return text;
}

function writeText(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, 'utf8');
}

function backupFile(file, label) {
  if (!fs.existsSync(file)) return;
  const stamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const backupRoot = path.join(auditDir, 'leads-syntax-doctor-stage4-v17-backup-' + stamp);
  fs.mkdirSync(backupRoot, { recursive: true });
  const relative = path.relative(repo, file).replace(/[\\/]/g, '__');
  fs.copyFileSync(file, path.join(backupRoot, relative + '.' + label + '.bak'));
}

function fixAllowDevPreview(source) {
  let changed = false;

  source = source.replace(
    /(\n\s*)const\s+allowDevPreview\s*=\s*(?:\r?\n\s*)if\s*\(/g,
    function (_match, prefix) {
      changed = true;
      return prefix + 'const allowDevPreview = import.meta.env.DEV && !isSupabaseConfigured();\n    if (';
    }
  );

  source = source.replace(
    /const\s+allowDevPreview\s*=\s*if\s*\(/g,
    function () {
      changed = true;
      return 'const allowDevPreview = import.meta.env.DEV && !isSupabaseConfigured();\n    if (';
    }
  );

  return { source, changed };
}

function findDanglingAssignments(source, relativeFile) {
  const failures = [];
  const lines = source.split(/\r?\n/);
  const controlStarters = /^(if|for|while|switch|try|catch|return|throw|else|do)\b/;
  for (let i = 0; i < lines.length - 1; i += 1) {
    const line = lines[i];
    if (!/^\s*(const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*$/.test(line)) continue;

    let j = i + 1;
    while (j < lines.length && /^\s*$/.test(lines[j])) j += 1;
    if (j >= lines.length) continue;

    const next = lines[j].trim();
    if (controlStarters.test(next)) {
      failures.push(relativeFile + ':' + (i + 1) + ' dangling assignment before "' + next.slice(0, 40) + '"');
    }
  }
  return failures;
}

function walkFiles(dir, extensions, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, extensions, out);
    else if (extensions.some((ext) => full.endsWith(ext))) out.push(full);
  }
  return out;
}

function readPackageJson(file) {
  const raw = readText(file);
  return JSON.parse(raw);
}

function updatePackageJson() {
  const pkgPath = path.join(repo, 'package.json');
  if (!fs.existsSync(pkgPath)) return false;
  const json = readPackageJson(pkgPath);
  json.scripts = json.scripts || {};
  let changed = false;
  if (json.scripts['check:stage86-leads-dangling-assignment-guard'] !== 'node --test tests/stage86-leads-dangling-assignment-guard.test.cjs') {
    json.scripts['check:stage86-leads-dangling-assignment-guard'] = 'node --test tests/stage86-leads-dangling-assignment-guard.test.cjs';
    changed = true;
  }
  if (changed && mode === 'fix') {
    backupFile(pkgPath, 'package-json');
    writeText(pkgPath, JSON.stringify(json, null, 2) + '\n');
  }
  return changed;
}

function writeStage86Guard() {
  const guardPath = path.join(testsDir, 'stage86-leads-dangling-assignment-guard.test.cjs');
  const content = `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repo = path.resolve(__dirname, '..');

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\\.(ts|tsx)$/.test(full)) out.push(full);
  }
  return out;
}

function findDanglingAssignments(source, relativeFile) {
  const failures = [];
  const lines = source.split(/\\r?\\n/);
  const controlStarters = /^(if|for|while|switch|try|catch|return|throw|else|do)\\b/;
  for (let i = 0; i < lines.length - 1; i += 1) {
    const line = lines[i];
    if (!/^\\s*(const|let|var)\\s+[A-Za-z_$][\\w$]*\\s*=\\s*$/.test(line)) continue;
    let j = i + 1;
    while (j < lines.length && /^\\s*$/.test(lines[j])) j += 1;
    if (j >= lines.length) continue;
    const next = lines[j].trim();
    if (controlStarters.test(next)) {
      failures.push(relativeFile + ':' + (i + 1) + ' dangling assignment before "' + next.slice(0, 40) + '"');
    }
  }
  return failures;
}

test('source files do not contain dangling assignments before control statements', () => {
  const failures = [];
  for (const file of walk(path.join(repo, 'src'))) {
    const relative = path.relative(repo, file);
    const source = fs.readFileSync(file, 'utf8').replace(/^\\uFEFF/, '');
    failures.push(...findDanglingAssignments(source, relative));
  }
  assert.deepEqual(failures, []);
});
`;
  if (mode === 'fix') {
    fs.mkdirSync(testsDir, { recursive: true });
    writeText(guardPath, content);
  }
}

function writeReport({ fixedLeads }) {
  if (mode !== 'fix') return;
  const reportPath = path.join(auditDir, 'leads-syntax-doctor-stage4-v17-2026-05-15.md');
  const lines = [
    '# Stage 4 V17 - Leads syntax doctor',
    '',
    '## Cel',
    'Naprawa realnego bledu skladni po poprzednich patchach: urwane przypisanie `allowDevPreview` w `src/pages/Leads.tsx`.',
    '',
    '## Zakres',
    '- Nie usuwano testow.',
    '- Nie wylaczano release gate.',
    '- Nie dotykano logiki right raila poza utrzymaniem istniejacych guardow.',
    '- Dodano guard wykrywajacy klase bledow: `const x =` bez wartosci przed instrukcja sterujaca.',
    '',
    '## Wynik narzedzia',
    '- Leads.tsx fixed: ' + String(fixedLeads),
    '',
    '## Guard',
    '- tests/stage86-leads-dangling-assignment-guard.test.cjs',
    '',
    '## Kryterium',
    '`verify:closeflow:quiet` musi przejsc po naprawie.',
    '',
  ];
  fs.mkdirSync(auditDir, { recursive: true });
  writeText(reportPath, lines.join('\\n'));
}

function main() {
  assert.ok(fs.existsSync(leadsPath), 'Missing src/pages/Leads.tsx');

  let leads = readText(leadsPath);
  const before = leads;
  const fixed = fixAllowDevPreview(leads);
  leads = fixed.source;

  if (mode === 'fix' && leads !== before) {
    backupFile(leadsPath, 'leads');
    writeText(leadsPath, leads);
  }

  if (mode === 'fix') {
    writeStage86Guard();
    updatePackageJson();
    writeReport({ fixedLeads: leads !== before });
  }

  const failures = [];
  for (const file of walkFiles(path.join(repo, 'src'), ['.ts', '.tsx'])) {
    const relative = path.relative(repo, file);
    failures.push(...findDanglingAssignments(readText(file), relative));
  }

  if (failures.length) {
    console.error('Stage 4 V17 found dangling assignment issues:');
    for (const failure of failures) console.error(failure);
    process.exit(1);
  }

  const currentLeads = readText(leadsPath);
  assert.ok(
    currentLeads.includes('const allowDevPreview = import.meta.env.DEV && !isSupabaseConfigured();'),
    'Leads.tsx must keep concrete allowDevPreview assignment.'
  );

  console.log('OK: Stage 4 V17 fixed and checked dangling assignments.');
}

main();
