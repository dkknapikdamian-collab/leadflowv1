const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const file = path.join(repo, 'src/pages/Cases.tsx');
const source = fs.readFileSync(file, 'utf8');

function fail(message) {
  console.error(`FAILED closeflow cases import contract: ${message}`);
  process.exit(1);
}

function getNamedImport(moduleName) {
  const escaped = moduleName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`import\\s*\\{([\\s\\S]*?)\\}\\s*from\\s*['"]${escaped}['"];`, 'm');
  const match = source.match(re);
  if (!match) fail(`missing named import from ${moduleName}`);
  return match[1]
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function has(imports, name) {
  return imports.some((item) => item === name || item.startsWith(`${name} as `));
}

const reactImports = getNamedImport('react');
const routerImports = getNamedImport('react-router-dom');
const lucideImports = getNamedImport('lucide-react');

for (const name of ['useEffect', 'useMemo', 'useRef']) {
  if (!has(reactImports, name)) fail(`React import must include ${name}`);
}
if (!reactImports.some((item) => item === 'type FormEvent' || item === 'FormEvent')) {
  fail('React import must include type FormEvent');
}

for (const name of ['ExternalLink', 'FileText', 'Loader2', 'Plus', 'Search', 'Trash2']) {
  if (has(reactImports, name)) fail(`${name} must not be imported from react`);
  if (!has(lucideImports, name)) fail(`${name} must be imported from lucide-react`);
}

for (const name of ['Link', 'useSearchParams']) {
  if (!has(routerImports, name)) fail(`react-router-dom import must include ${name}`);
}
for (const name of ['useMemo', 'useRef', 'useEffect']) {
  if (has(routerImports, name)) fail(`${name} must not be imported from react-router-dom`);
}

if (!/\bLoader2\b/.test(source)) {
  fail('Cases.tsx no longer references Loader2; guard should be removed or updated intentionally');
}

console.log('CLOSEFLOW_CASES_LOADER2_IMPORT_OK');
