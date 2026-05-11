#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const repo = process.cwd();
const casesPath = path.join(repo, 'src', 'pages', 'Cases.tsx');

function fail(message) {
  console.error(`CLOSEFLOW_CASES_LOADER2_IMPORT_FAIL: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(casesPath)) {
  fail('missing src/pages/Cases.tsx');
}

const source = fs.readFileSync(casesPath, 'utf8');
const usesLoader2 = /\bLoader2\b/.test(source);

if (!usesLoader2) {
  console.log('CLOSEFLOW_CASES_LOADER2_IMPORT_OK: Cases.tsx does not use Loader2');
  process.exit(0);
}

const lucideImport = source.match(/import\s*\{([\s\S]*?)\}\s*from\s*["']lucide-react["'];?/m);
if (!lucideImport) {
  fail('Cases.tsx uses Loader2 but has no lucide-react named import');
}

const names = lucideImport[1]
  .split(',')
  .map((part) => part.trim())
  .filter(Boolean)
  .map((part) => part.replace(/\s+as\s+.*$/i, '').trim());

if (!names.includes('Loader2')) {
  fail('Cases.tsx uses Loader2 but Loader2 is missing from lucide-react import');
}

console.log('CLOSEFLOW_CASES_LOADER2_IMPORT_OK');
