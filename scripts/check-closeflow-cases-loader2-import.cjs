#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const casesPath = path.join(repo, 'src', 'pages', 'Cases.tsx');

function fail(message) {
  console.error(`FAILED closeflow cases import contract: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(casesPath)) fail('missing src/pages/Cases.tsx');

const source = fs.readFileSync(casesPath, 'utf8');

function importStatements(src) {
  const statements = [];
  const re = /^[ \t]*import\b[\s\S]*?;[ \t]*(?:\r?\n)?/gm;
  let match;
  while ((match = re.exec(src)) !== null) statements.push(match[0]);
  return statements;
}

function importBlocks(moduleName) {
  return importStatements(source).filter((statement) => {
    const moduleMatch = statement.match(/\bfrom\s+['"]([^'"]+)['"]/);
    const sideEffectMatch = statement.match(/^\s*import\s+['"]([^'"]+)['"]/);
    const found = moduleMatch ? moduleMatch[1] : sideEffectMatch ? sideEffectMatch[1] : null;
    return found === moduleName;
  });
}

function importBody(moduleName) {
  return importBlocks(moduleName).join('\n');
}

function hasName(body, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[,\\s{}])${escaped}($|[,\\s{}])`).test(body);
}

function stripAllImports(src) {
  return src.replace(/^[ \t]*import\b[\s\S]*?;[ \t]*(?:\r?\n)?/gm, '');
}

function collectImportedNames() {
  const names = new Set();
  for (const statement of importStatements(source)) {
    const defaultMatch = statement.match(/^\s*import\s+([A-Za-z_$][\w$]*)\s+from\s+['"]/);
    if (defaultMatch) names.add(defaultMatch[1]);

    const namedMatch = statement.match(/\{([\s\S]*?)\}/);
    if (namedMatch) {
      for (const raw of namedMatch[1].split(',')) {
        const cleaned = raw.trim().replace(/^type\s+/, '');
        if (!cleaned) continue;
        const aliasParts = cleaned.split(/\s+as\s+/);
        const localName = (aliasParts[1] || aliasParts[0]).trim();
        if (/^[A-Za-z_$][\w$]*$/.test(localName)) names.add(localName);
      }
    }
  }
  return names;
}

function collectLocalDeclarations(srcWithoutImports) {
  const names = new Set();
  const declarationRe = /\b(?:function|class|const|let|var|type|interface)\s+([A-Z][A-Za-z0-9_]*)\b/g;
  let match;
  while ((match = declarationRe.exec(srcWithoutImports)) !== null) names.add(match[1]);
  return names;
}

function collectJsxNames(srcWithoutImports) {
  const names = new Set();
  const jsxRe = /<([A-Z][A-Za-z0-9_]*)(?=[\s>/])/g;
  let match;
  while ((match = jsxRe.exec(srcWithoutImports)) !== null) names.add(match[1]);
  return names;
}

const reactBlocks = importBlocks('react');
const routerBlocks = importBlocks('react-router-dom');
const lucideBlocks = importBlocks('lucide-react');
const entityBlocks = importBlocks('../components/ui-system/EntityIcon');

if (reactBlocks.length !== 1) fail(`expected exactly one react import, found ${reactBlocks.length}`);
if (routerBlocks.length !== 1) fail(`expected exactly one react-router-dom import, found ${routerBlocks.length}`);
if (lucideBlocks.length !== 1) fail(`expected exactly one lucide-react import, found ${lucideBlocks.length}`);
if (entityBlocks.length !== 1) fail(`expected exactly one EntityIcon import, found ${entityBlocks.length}`);

const reactImport = importBody('react');
const routerImport = importBody('react-router-dom');
const lucideImport = importBody('lucide-react');
const entityImport = importBody('../components/ui-system/EntityIcon');
const withoutImports = stripAllImports(source);

for (const name of ['useEffect', 'useMemo', 'useRef', 'useState']) {
  if (new RegExp(`\\b${name}\\s*\\(`).test(withoutImports) && !hasName(reactImport, name)) {
    fail(`${name} is used but missing from react import`);
  }
  if (hasName(routerImport, name)) fail(`${name} must not be imported from react-router-dom`);
}

if (/\bFormEvent\b/.test(withoutImports) && !hasName(reactImport, 'FormEvent')) {
  fail('FormEvent is used but missing from react import');
}
if (hasName(routerImport, 'FormEvent')) fail('FormEvent must not be imported from react-router-dom');

if (/<Link(?=[\s>/])/.test(withoutImports) && !hasName(routerImport, 'Link')) {
  fail('Link is used but missing from react-router-dom import');
}
if (/\buseSearchParams\s*\(/.test(withoutImports) && !hasName(routerImport, 'useSearchParams')) {
  fail('useSearchParams is used but missing from react-router-dom import');
}
if (hasName(lucideImport, 'Link')) fail('Link must not be imported from lucide-react');

if (/\bEntityIcon\b/.test(withoutImports) && !hasName(entityImport, 'EntityIcon')) {
  fail('EntityIcon is used but missing from ../components/ui-system/EntityIcon import');
}

const importedNames = collectImportedNames();
const localNames = collectLocalDeclarations(withoutImports);
const jsxNames = collectJsxNames(withoutImports);
const allowedGlobals = new Set(['Fragment']);
const unresolved = [...jsxNames].filter((name) => !importedNames.has(name) && !localNames.has(name) && !allowedGlobals.has(name));
if (unresolved.length > 0) fail(`unresolved JSX symbols in Cases.tsx: ${unresolved.join(', ')}`);

console.log('CLOSEFLOW_CASES_IMPORT_CONTRACT_OK');
