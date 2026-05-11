#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const casesPath = path.join(repo, 'src/pages/Cases.tsx');

function fail(message) {
  console.error(`FAILED closeflow cases import contract: ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing file ${path.relative(repo, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function importBlocks(source) {
  const blocks = [];
  const re = /^import[\s\S]*?from\s+['"]([^'"]+)['"];\s*$/gm;
  let match;
  while ((match = re.exec(source))) blocks.push({ full: match[0], source: match[1] });
  return blocks;
}

function blockFor(blocks, source) {
  return blocks.find((block) => block.source === source) || null;
}

function has(block, name) {
  return !!block && new RegExp(`\\b${escapeRegExp(name)}\\b`).test(block.full);
}

function uses(source, name) {
  return new RegExp(`\\b${escapeRegExp(name)}\\b`).test(source);
}

function resolveImportSource(fromFile, source) {
  if (!source.startsWith('.')) return null;
  const base = path.resolve(path.dirname(fromFile), source);
  const candidates = [
    base,
    `${base}.tsx`,
    `${base}.ts`,
    `${base}.jsx`,
    `${base}.js`,
    path.join(base, 'index.tsx'),
    path.join(base, 'index.ts'),
    path.join(base, 'index.jsx'),
    path.join(base, 'index.js'),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

function exportContainsEntityIcon(file) {
  if (!file) return false;
  const content = read(file);
  return /export\s+(function|const|class)\s+EntityIcon\b/.test(content)
    || /export\s*\{[\s\S]*\bEntityIcon\b[\s\S]*\}/.test(content);
}

const source = read(casesPath);
const blocks = importBlocks(source);
const reactImport = blockFor(blocks, 'react');
const routerImport = blockFor(blocks, 'react-router-dom');
const lucideImport = blockFor(blocks, 'lucide-react');
const entityImport = blocks.find((block) => has(block, 'EntityIcon')) || null;

for (const hook of ['useEffect', 'useMemo', 'useRef', 'useState']) {
  if (uses(source, hook) && !has(reactImport, hook)) fail(`${hook} is used in Cases.tsx but not imported from react`);
}

if (uses(source, 'FormEvent') && !has(reactImport, 'FormEvent')) {
  fail('FormEvent is used in Cases.tsx but not imported from react');
}

for (const routerSymbol of ['Link', 'useSearchParams']) {
  if (uses(source, routerSymbol) && !has(routerImport, routerSymbol)) {
    fail(`${routerSymbol} is used in Cases.tsx but not imported from react-router-dom`);
  }
}

for (const icon of ['ExternalLink', 'FileText', 'Loader2', 'Plus', 'Search', 'Trash2']) {
  if (uses(source, icon) && !has(lucideImport, icon)) {
    fail(`${icon} is used in Cases.tsx but not imported from lucide-react`);
  }
}

if (uses(source, 'EntityIcon')) {
  if (!entityImport) fail('EntityIcon is used in Cases.tsx but missing from imports');
  if (['react', 'react-router-dom', 'lucide-react'].includes(entityImport.source)) {
    fail(`EntityIcon is imported from invalid module ${entityImport.source}`);
  }
  const resolved = resolveImportSource(casesPath, entityImport.source);
  if (!resolved) fail(`EntityIcon import source cannot be resolved: ${entityImport.source}`);
  if (!exportContainsEntityIcon(resolved)) {
    fail(`EntityIcon import source does not visibly export EntityIcon: ${entityImport.source}`);
  }
}

if (routerImport && (has(routerImport, 'useMemo') || has(routerImport, 'useRef') || has(routerImport, 'useState') || has(routerImport, 'useEffect'))) {
  fail('react hook imported from react-router-dom');
}

if (reactImport && (has(reactImport, 'Loader2') || has(reactImport, 'ExternalLink') || has(reactImport, 'FileText') || has(reactImport, 'Plus') || has(reactImport, 'Search') || has(reactImport, 'Trash2'))) {
  fail('lucide icon imported from react');
}

console.log('CLOSEFLOW_CASES_IMPORT_CONTRACT_OK');
