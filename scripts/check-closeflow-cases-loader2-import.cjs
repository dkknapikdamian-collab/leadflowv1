const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'pages', 'Cases.tsx');
const src = fs.readFileSync(file, 'utf8');

function fail(message) {
  console.error('FAILED closeflow cases import contract: ' + message);
  process.exit(1);
}

function allImportDeclarations() {
  const re = /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]\s*;/g;
  const out = [];
  let match;
  while ((match = re.exec(src)) !== null) {
    out.push({ full: match[0], spec: match[1], source: match[2] });
  }
  return out;
}

const imports = allImportDeclarations();

function namedImportsFrom(sourceName) {
  const found = [];
  for (const item of imports.filter((entry) => entry.source === sourceName)) {
    const named = item.spec.match(/\{([\s\S]*?)\}/);
    if (!named) continue;
    for (const raw of named[1].split(',')) {
      const name = raw
        .trim()
        .replace(/^type\s+/, '')
        .replace(/\s+as\s+.*$/, '')
        .trim();
      if (name) found.push(name);
    }
  }
  return new Set(found);
}

function importBlocksFrom(sourceName) {
  return imports.filter((entry) => entry.source === sourceName).map((entry) => entry.full);
}

function requireAll(set, source, names) {
  for (const name of names) {
    if (!set.has(name)) fail(source + ' import is missing ' + name);
  }
}

function requireNone(set, source, names) {
  for (const name of names) {
    if (set.has(name)) fail(source + ' import must not contain ' + name);
  }
}

const react = namedImportsFrom('react');
const router = namedImportsFrom('react-router-dom');
const lucide = namedImportsFrom('lucide-react');

requireAll(react, 'react', ['useEffect', 'useMemo', 'useRef', 'FormEvent']);
requireNone(react, 'react', ['ExternalLink', 'FileText', 'Loader2', 'Plus', 'Search', 'Trash2', 'Link', 'useSearchParams']);

requireAll(router, 'react-router-dom', ['Link', 'useSearchParams']);
requireNone(router, 'react-router-dom', ['useEffect', 'useMemo', 'useRef', 'FormEvent', 'ExternalLink', 'FileText', 'Loader2', 'Plus', 'Search', 'Trash2']);

requireAll(lucide, 'lucide-react', ['ExternalLink', 'FileText', 'Loader2', 'Plus', 'Search', 'Trash2']);
requireNone(lucide, 'lucide-react', ['useEffect', 'useMemo', 'useRef', 'FormEvent', 'Link', 'useSearchParams']);

if (importBlocksFrom('react-router-dom').some((block) => /\buseRef\b|\buseMemo\b|\buseEffect\b|\bFormEvent\b/.test(block))) {
  fail('react-router-dom import contains React imports');
}

if (importBlocksFrom('react').some((block) => /\bLoader2\b|\bTrash2\b|\bExternalLink\b|\bFileText\b|\bPlus\b|\bSearch\b/.test(block))) {
  fail('react import contains lucide icons');
}

if (!/\bLoader2\b/.test(src)) {
  fail('Cases.tsx no longer references Loader2; guard should be revisited instead of silently passing');
}

console.log('CLOSEFLOW_CASES_IMPORT_CONTRACT_OK');
