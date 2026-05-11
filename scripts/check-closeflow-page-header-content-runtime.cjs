const fs = require('fs');
const path = require('path');

const root = process.cwd();
const componentPath = path.join(root, 'src', 'components', 'CloseFlowPageHeaderV2.tsx');
const registryPath = path.join(root, 'src', 'lib', 'page-header-content.ts');

function fail(message) {
  console.error('PAGE_HEADER_CONTENT_RUNTIME_CHECK_FAIL:', message);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`Missing file ${path.relative(root, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function walk(dir, output = []) {
  if (!fs.existsSync(dir)) return output;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, output);
    else if (/\.(tsx|ts)$/.test(entry.name)) output.push(full);
  }
  return output;
}

const registry = read(registryPath);
if (!/export\s+const\s+PAGE_HEADER_CONTENT\b/.test(registry)) {
  fail('src/lib/page-header-content.ts does not export PAGE_HEADER_CONTENT as a runtime const');
}

const component = read(componentPath);
if (/import\s+type\s+\{[^}]*\bPAGE_HEADER_CONTENT\b[^}]*\}\s+from\s+['"][^'"]*page-header-content['"]/.test(component)) {
  fail('CloseFlowPageHeaderV2 imports PAGE_HEADER_CONTENT as type-only. It must be a runtime import.');
}
if (!/import\s+\{[^}]*\bPAGE_HEADER_CONTENT\b[^}]*\}\s+from\s+['"][^'"]*page-header-content['"]/.test(component)) {
  fail('CloseFlowPageHeaderV2 is missing runtime import for PAGE_HEADER_CONTENT');
}
if (!/PAGE_HEADER_CONTENT\[pageKey\]/.test(component)) {
  fail('CloseFlowPageHeaderV2 no longer reads page content from PAGE_HEADER_CONTENT[pageKey]');
}
if (!/PAGE_HEADER_CONTENT\[pageKey\]\s*\|\|\s*PAGE_HEADER_CONTENT\.today/.test(component)) {
  fail('CloseFlowPageHeaderV2 is missing safe fallback for unknown pageKey');
}

const srcDir = path.join(root, 'src');
const offenders = [];
for (const file of walk(srcDir)) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  if (rel === 'src/lib/page-header-content.ts') continue;
  const source = read(file);
  if (!source.includes('PAGE_HEADER_CONTENT')) continue;

  if (/import\s+type\s+\{[^}]*\bPAGE_HEADER_CONTENT\b[^}]*\}\s+from\s+['"][^'"]*page-header-content['"]/.test(source)) {
    offenders.push(`${rel}: type-only import of PAGE_HEADER_CONTENT`);
    continue;
  }

  if (!/import\s+\{[^}]*\bPAGE_HEADER_CONTENT\b[^}]*\}\s+from\s+['"][^'"]*page-header-content['"]/.test(source)) {
    offenders.push(`${rel}: PAGE_HEADER_CONTENT used without runtime import`);
  }
}

if (offenders.length) {
  fail('Unbound PAGE_HEADER_CONTENT candidates:\n' + offenders.join('\n'));
}

console.log('CLOSEFLOW_PAGE_HEADER_CONTENT_RUNTIME_CHECK_OK');
