const fs = require('fs');
const path = require('path');

const root = process.cwd();
const checkedRoots = ['src'];
const allowedImportOwners = new Set([
  'src/main.tsx',
  'src/App.tsx',
  'src/styles/emergency/emergency-hotfixes.css',
]);
const allowedCssRoots = [
  'src/styles/',
  'src/index.css',
  'src/App.css',
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', 'dist', '.git'].includes(entry.name)) walk(full, out);
    } else if (/\.(tsx|ts|jsx|js|css)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function normalize(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function resolveImport(fromRel, spec) {
  if (!spec.startsWith('.')) return spec;
  const resolved = path.normalize(path.join(path.dirname(fromRel), spec)).split(path.sep).join('/');
  return resolved;
}

const failures = [];
for (const base of checkedRoots) {
  for (const file of walk(path.join(root, base))) {
    const rel = normalize(file);
    const text = fs.readFileSync(file, 'utf8');
    const imports = [...text.matchAll(/import\s+['"]([^'"]+\.css)['"];?/g)];
    for (const match of imports) {
      const spec = match[1];
      const target = resolveImport(rel, spec);
      const targetClassified = allowedCssRoots.some((allowed) => target === allowed || target.startsWith(allowed));
      const ownerAllowed = allowedImportOwners.has(rel);
      if (!targetClassified && !ownerAllowed && !text.includes('@closeflow-allow-css-import')) {
        failures.push(`${rel}: unclassified css import ${spec}`);
      }
    }
  }
}

if (failures.length) {
  console.error('CLOSEFLOW_NO_UNCLASSIFIED_CSS_IMPORTS_VS9_FAIL');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('CLOSEFLOW_NO_UNCLASSIFIED_CSS_IMPORTS_VS9_OK');
console.log('allowed_css_roots=' + allowedCssRoots.length);
console.log('contract=classified-css-imports');
