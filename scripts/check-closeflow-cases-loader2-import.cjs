#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const casesPath = path.join(root, 'src', 'pages', 'Cases.tsx');

function fail(message) {
  console.error(`FAILED closeflow cases import contract: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(casesPath)) {
  fail('src/pages/Cases.tsx is missing');
}

const source = fs.readFileSync(casesPath, 'utf8');

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function importClauses(moduleName) {
  const escaped = escapeRegExp(moduleName);
  const pattern = new RegExp(`import\\s+([^;]*?)\\s+from\\s+['"]${escaped}['"]\\s*;`, 'g');
  const clauses = [];
  let match;
  while ((match = pattern.exec(source)) !== null) {
    clauses.push(match[1]);
  }
  return clauses;
}

function importNames(clauses) {
  return clauses.flatMap((clause) => {
    return clause
      .replace(/[{}\r\n]/g, ',')
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => part.replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim())
      .filter(Boolean);
  });
}

function hasName(clauses, name) {
  return importNames(clauses).includes(name);
}

function requireName(clauses, name, moduleName) {
  if (!hasName(clauses, name)) {
    fail(`${moduleName} import is missing ${name}`);
  }
}

function forbidName(clauses, name, moduleName) {
  if (hasName(clauses, name)) {
    fail(`${name} must not be imported from ${moduleName}`);
  }
}

const reactImport = importClauses('react');
const routerImport = importClauses('react-router-dom');
const lucideImport = importClauses('lucide-react');

if (reactImport.length === 0) fail('missing import from react');
if (routerImport.length === 0) fail('missing import from react-router-dom');
if (lucideImport.length === 0) fail('missing import from lucide-react');

for (const name of ['useEffect', 'useMemo', 'useRef', 'useState', 'FormEvent']) {
  requireName(reactImport, name, 'react');
}

for (const name of ['Link', 'useSearchParams']) {
  requireName(routerImport, name, 'react-router-dom');
}

for (const name of ['ExternalLink', 'FileText', 'Loader2', 'Plus', 'Search', 'Trash2']) {
  requireName(lucideImport, name, 'lucide-react');
}

for (const name of ['useEffect', 'useMemo', 'useRef', 'useState', 'FormEvent']) {
  forbidName(routerImport, name, 'react-router-dom');
  forbidName(lucideImport, name, 'lucide-react');
}

for (const name of ['ExternalLink', 'FileText', 'Loader2', 'Plus', 'Search', 'Trash2']) {
  forbidName(reactImport, name, 'react');
  forbidName(routerImport, name, 'react-router-dom');
}

for (const name of ['Link', 'useSearchParams']) {
  forbidName(reactImport, name, 'react');
  forbidName(lucideImport, name, 'lucide-react');
}

if (/\buseState\s*\(/.test(source) && !hasName(reactImport, 'useState')) {
  fail('Cases.tsx calls useState but react import does not include useState');
}

if (/\buseRef\s*\(/.test(source) && !hasName(reactImport, 'useRef')) {
  fail('Cases.tsx calls useRef but react import does not include useRef');
}

if (/\bLoader2\b/.test(source) && !hasName(lucideImport, 'Loader2')) {
  fail('Cases.tsx references Loader2 but lucide-react import does not include Loader2');
}

console.log('CLOSEFLOW_CASES_IMPORT_CONTRACT_OK');
