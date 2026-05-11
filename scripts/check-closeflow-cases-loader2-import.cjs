#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'pages', 'Cases.tsx');
if (!fs.existsSync(file)) {
  console.error('FAILED closeflow cases import contract: missing src/pages/Cases.tsx');
  process.exit(1);
}
const source = fs.readFileSync(file, 'utf8');

function fail(message) {
  console.error('FAILED closeflow cases import contract: ' + message);
  process.exit(1);
}

function importStatements() {
  const out = [];
  const re = /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]\s*;?/g;
  let match;
  while ((match = re.exec(source))) out.push({ full: match[0], clause: match[1].trim(), moduleName: match[2] });
  return out;
}

function importsFrom(moduleName) {
  return importStatements().filter((item) => item.moduleName === moduleName);
}

function namedImports(moduleName) {
  const set = new Set();
  for (const item of importsFrom(moduleName)) {
    const named = item.clause.match(/\{([\s\S]*?)\}/);
    if (!named) continue;
    for (const raw of named[1].split(',')) {
      const name = raw.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
      if (name) set.add(name);
    }
  }
  return set;
}

function anyImported(name) {
  for (const item of importStatements()) {
    const beforeNamed = item.clause.split('{')[0].replace(/,$/, '').trim();
    if (beforeNamed === name) return true;
    const named = item.clause.match(/\{([\s\S]*?)\}/);
    if (!named) continue;
    for (const raw of named[1].split(',')) {
      const imported = raw.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
      if (imported === name) return true;
    }
  }
  return false;
}

function declared(name) {
  return new RegExp('(?:function|const|class)\\s+' + name + '\\b').test(source);
}

function usesCall(name) {
  return new RegExp('\\b' + name + '\\s*\\(').test(source);
}

function usesJsx(name) {
  return new RegExp('<' + name + '(?:\\s|/|>)').test(source);
}

const react = namedImports('react');
for (const hook of ['useEffect', 'useMemo', 'useRef', 'useState']) {
  if (usesCall(hook) && !react.has(hook)) fail(hook + ' is used but not imported from react');
}
if (/\bFormEvent\b/.test(source) && !react.has('FormEvent')) fail('FormEvent is used but not imported from react');

const router = namedImports('react-router-dom');
if (usesJsx('Link') && !router.has('Link')) fail('Link is used but not imported from react-router-dom');
if (usesCall('useSearchParams') && !router.has('useSearchParams')) fail('useSearchParams is used but not imported from react-router-dom');
for (const wrong of ['useEffect', 'useMemo', 'useRef', 'useState']) {
  if (router.has(wrong)) fail(wrong + ' must not be imported from react-router-dom');
}

const lucide = namedImports('lucide-react');
for (const icon of ['ExternalLink', 'FileText', 'Loader2', 'Plus', 'Search', 'Trash2']) {
  if (usesJsx(icon) && !lucide.has(icon)) fail(icon + ' is used but not imported from lucide-react');
}
for (const wrong of ['ExternalLink', 'FileText', 'Loader2', 'Plus', 'Search', 'Trash2']) {
  if (react.has(wrong) || router.has(wrong)) fail(wrong + ' must not be imported from react or react-router-dom');
}

if (/\bEntityIcon\b/.test(source) && !anyImported('EntityIcon') && !declared('EntityIcon')) {
  fail('EntityIcon is used but not imported or declared');
}

console.log('CLOSEFLOW_CASES_IMPORT_CONTRACT_OK');
