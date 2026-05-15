#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const repo = process.cwd();
const casesPath = path.join(repo, 'src', 'pages', 'Cases.tsx');
const reportPath = path.join(repo, 'docs', 'audits', 'cases-import-contract-stage4-v15-2026-05-15.md');

const canonical = [
  "import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';",
  "import { Link, useSearchParams } from 'react-router-dom';",
  "import { AlertTriangle, CheckCircle2, ChevronRight, Clock, ExternalLink, FileText, Loader2, Plus, Search, Trash2, X } from 'lucide-react';",
  "import { format } from 'date-fns';",
  "import { pl } from 'date-fns/locale';",
  "import { EntityIcon } from '../components/ui-system/EntityIcon';",
];

const modules = [
  'react',
  'react-router-dom',
  'lucide-react',
  'date-fns',
  'date-fns/locale',
  '../components/ui-system/EntityIcon',
];

function readText(file) {
  let text = fs.readFileSync(file, 'utf8');
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  return text;
}

function writeText(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, 'utf8');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function removeImportsFromModule(source, moduleName) {
  // Handles multiline imports and several import statements joined on one line.
  const quoted = "['\"]" + escapeRegExp(moduleName) + "['\"]";
  const re = new RegExp("import\\s+[\\s\\S]*?\\s+from\\s+" + quoted + "\\s*;\\s*", 'g');
  return source.replace(re, '');
}

function findInsertionIndex(source) {
  const match = source.match(/^(?:(?:\/\/[^\n]*\n)|(?:\/\*[\s\S]*?\*\/\s*)|(?:\s*\n))*/);
  return match ? match[0].length : 0;
}

function normalizeBlankLines(source) {
  return source
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/[ \t]+\n/g, '\n');
}

function fixCasesImports() {
  if (!fs.existsSync(casesPath)) {
    throw new Error('Missing src/pages/Cases.tsx');
  }

  const before = readText(casesPath);
  let after = before;

  for (const moduleName of modules) {
    after = removeImportsFromModule(after, moduleName);
  }

  const insertionIndex = findInsertionIndex(after);
  const prefix = after.slice(0, insertionIndex).replace(/\s+$/g, '\n');
  const suffix = after.slice(insertionIndex).replace(/^\s+/g, '');
  const importBlock = canonical.join('\n') + '\n';
  after = normalizeBlankLines(prefix + importBlock + '\n' + suffix);

  if (after !== before) {
    const backupDir = path.join(repo, 'docs', 'audits', 'cases-import-contract-stage4-v15-backup-' + new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14));
    fs.mkdirSync(backupDir, { recursive: true });
    writeText(path.join(backupDir, 'Cases.tsx.before'), before);
    writeText(casesPath, after);
  }

  const finalSource = readText(casesPath);
  for (const line of canonical) {
    assert.ok(finalSource.includes(line), 'Cases.tsx is missing canonical import line: ' + line);
  }

  // This script must repair the import contract, not weaken it.
  // The release gate script stays untouched and remains the source of truth.
  const quietGate = readText(path.join(repo, 'scripts', 'check-closeflow-cases-loader2-import.cjs'));
  for (const line of canonical) {
    assert.ok(quietGate.includes(line), 'Release import contract no longer checks canonical line: ' + line);
  }

  writeText(reportPath, [
    '# Stage 4 V15 - Cases import contract repair',
    '',
    '## Cel',
    'Przywrocic kanoniczne importy w `src/pages/Cases.tsx` wymagane przez `scripts/check-closeflow-cases-loader2-import.cjs` po globalnej normalizacji importow.',
    '',
    '## Decyzja',
    'Nie usuwamy guarda i nie wyciszamy `verify:closeflow:quiet`. Naprawiamy plik zrodlowy tak, zeby spelnial istniejacy kontrakt release gate.',
    '',
    '## Zmienione',
    '- `src/pages/Cases.tsx` - kanoniczne importy dla react, react-router-dom, lucide-react, date-fns, date-fns/locale i EntityIcon.',
    '- `docs/audits/cases-import-contract-stage4-v15-2026-05-15.md` - raport.',
    '- opcjonalny backup przed zmiana w `docs/audits/cases-import-contract-stage4-v15-backup-*`.',
    '',
    '## Guardy',
    '- `scripts/check-closeflow-cases-loader2-import.cjs` zostaje aktywny.',
    '- `verify:closeflow:quiet` nadal musi przejsc.',
    '',
  ].join('\n'));

  console.log('OK: Stage 4 V15 repaired Cases.tsx canonical import contract.');
}

fixCasesImports();
