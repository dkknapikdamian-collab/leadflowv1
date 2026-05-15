#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert');

const repo = process.cwd();
const leadsPath = path.join(repo, 'src', 'pages', 'Leads.tsx');
const auditDir = path.join(repo, 'docs', 'audits');
const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const backupDir = path.join(auditDir, 'leads-syntax-doctor-v16-backup-' + timestamp);

function readText(file) {
  let value = fs.readFileSync(file, 'utf8');
  if (value.charCodeAt(0) === 0xfeff) value = value.slice(1);
  return value;
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value, 'utf8');
}

function listFiles(dir, predicate, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, predicate, out);
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function fixAllowDevPreview() {
  assert.ok(fs.existsSync(leadsPath), 'Missing src/pages/Leads.tsx');
  let source = readText(leadsPath);
  const before = source;

  fs.mkdirSync(backupDir, { recursive: true });
  writeText(path.join(backupDir, 'Leads.tsx.before'), before);

  const canonical = "const allowDevPreview = import.meta.env.DEV && !isSupabaseConfigured();";

  source = source.replace(
    /const\s+allowDevPreview\s*=\s*(?:\r?\n\s*)if\s*\(/g,
    canonical + "\n    if ("
  );

  source = source.replace(
    /const\s+allowDevPreview\s*=\s*;(\s*\r?\n\s*if\s*\()/g,
    canonical + ";$1"
  );

  source = source.replace(
    /const\s+allowDevPreview\s*=\s*$/gm,
    canonical
  );

  if (source !== before) {
    writeText(leadsPath, source);
  }

  const after = readText(leadsPath);
  assert.ok(
    after.includes(canonical),
    'Leads.tsx must contain canonical allowDevPreview assignment.'
  );
  assert.ok(
    !/const\s+allowDevPreview\s*=\s*(?:\r?\n\s*)if\s*\(/.test(after),
    'Leads.tsx still has dangling allowDevPreview assignment before if.'
  );
  assert.ok(
    !/const\s+allowDevPreview\s*=\s*;\s*(?:\r?\n\s*)if\s*\(/.test(after),
    'Leads.tsx still has empty allowDevPreview assignment before if.'
  );
}

function checkDanglingAssignments() {
  const files = listFiles(
    path.join(repo, 'src'),
    (file) => /\.(ts|tsx)$/.test(file)
  );

  const statementAfterAssignment = /\b(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*(?:\r?\n\s*)\b(if|for|while|switch|catch|finally|try|return|throw|const|let|var|function|class|import|export)\b/g;
  const failures = [];

  for (const file of files) {
    const body = readText(file);
    for (const match of body.matchAll(statementAfterAssignment)) {
      const rel = path.relative(repo, file);
      const line = body.slice(0, match.index).split(/\r?\n/).length;
      failures.push(rel + ':' + line + ' dangling assignment before statement keyword ' + match[1]);
    }
  }

  if (failures.length) {
    console.error('Dangling assignment syntax risks found:');
    for (const failure of failures) console.error('- ' + failure);
    process.exit(1);
  }
}

function updatePackageScript() {
  const packagePath = path.join(repo, 'package.json');
  if (!fs.existsSync(packagePath)) return;
  let raw = fs.readFileSync(packagePath, 'utf8');
  const hadBom = raw.charCodeAt(0) === 0xfeff;
  if (hadBom) raw = raw.slice(1);
  const data = JSON.parse(raw);
  data.scripts = data.scripts || {};
  data.scripts['check:stage86-leads-allow-dev-preview-syntax'] =
    'node --test tests/stage86-leads-allow-dev-preview-syntax.test.cjs';
  const next = JSON.stringify(data, null, 2) + '\n';
  fs.writeFileSync(packagePath, (hadBom ? '\ufeff' : '') + next, 'utf8');
}

function writeAuditReport() {
  const report = [
    '# Stage 4 V16 - Leads syntax doctor',
    '',
    'Zakres:',
    '- naprawiono przerwany zapis const allowDevPreview w src/pages/Leads.tsx',
    '- dodano guard stage86 wykrywajacy puste przypisania przed if/for/return/import/export',
    '- nie usunieto testow',
    '- nie wylaczono release gate',
    '- nie wykonano commit/push',
    '',
    'Kryterium:',
    '- src/pages/Leads.tsx zawiera pelne przypisanie allowDevPreview',
    '- build nie zatrzymuje sie na Unexpected if w Leads.tsx',
    '- verify:closeflow:quiet ma przejsc albo wskazac kolejny realny blad',
    '',
  ].join('\n');
  writeText(path.join(auditDir, 'leads-syntax-doctor-v16-2026-05-15.md'), report);
}

function main() {
  fixAllowDevPreview();
  checkDanglingAssignments();
  updatePackageScript();
  writeAuditReport();
  console.log('OK: Stage 4 V16 repaired Leads.tsx dangling allowDevPreview assignment and added syntax guard.');
}

main();
