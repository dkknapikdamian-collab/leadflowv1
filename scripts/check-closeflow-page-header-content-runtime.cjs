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
if (!/const\s+CLOSEFLOW_PAGE_HEADER_COPY\s*:/.test(component)) {
  fail('CloseFlowPageHeaderV2 must use local CLOSEFLOW_PAGE_HEADER_COPY to avoid runtime free-variable leaks');
}
if (/\bPAGE_HEADER_CONTENT\b/.test(component)) {
  fail('CloseFlowPageHeaderV2 must not reference PAGE_HEADER_CONTENT at runtime');
}
if (!/CLOSEFLOW_PAGE_HEADER_COPY\[pageKey\]\s*\|\|\s*CLOSEFLOW_PAGE_HEADER_COPY\.today/.test(component)) {
  fail('CloseFlowPageHeaderV2 is missing safe fallback for unknown pageKey');
}
if (!/import\s+type\s+\{[^}]*CloseFlowPageHeaderContent[^}]*CloseFlowPageHeaderKey[^}]*\}\s+from\s+['"][^'"]*page-header-content['"]/.test(component)) {
  fail('CloseFlowPageHeaderV2 should import only page-header types from page-header-content');
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
