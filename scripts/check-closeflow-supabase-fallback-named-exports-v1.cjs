const fs = require('fs');
const path = require('path');
const root = process.cwd();
const srcFile = path.join(root, 'src', 'lib', 'supabase-fallback.ts');
const source = fs.readFileSync(srcFile, 'utf8');

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!['node_modules', 'dist', '.git'].includes(item)) walk(full, out);
    } else if (/\.(ts|tsx)$/.test(item)) out.push(full);
  }
  return out;
}
function normalizeSource(value) {
  return String(value || '').replace(/\\/g, '/').replace(/\.ts$/, '').replace(/\.tsx$/, '');
}
function isSupabaseFallbackImport(importSource) {
  const s = normalizeSource(importSource);
  return s === '../lib/supabase-fallback'
    || s === '../../lib/supabase-fallback'
    || s === './lib/supabase-fallback'
    || s.endsWith('/src/lib/supabase-fallback')
    || s === 'src/lib/supabase-fallback';
}
function parseNamedImportBlock(block) {
  return block
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .split(',')
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((raw) => raw.replace(/^type\s+/, '').split(/\s+as\s+/i)[0].trim())
    .filter((name) => /^[A-Za-z_$][\w$]*$/.test(name));
}
function collectImports() {
  const files = walk(path.join(root, 'src'));
  const found = new Map();
  const importDecl = /import[\s\S]*?from\s+['"]([^'"]+)['"]\s*;/g;
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = importDecl.exec(text))) {
      const decl = match[0];
      const importSource = match[1];
      if (!isSupabaseFallbackImport(importSource)) continue;
      const named = decl.match(/\{([\s\S]*?)\}/);
      if (!named) continue;
      for (const name of parseNamedImportBlock(named[1])) {
        if (!found.has(name)) found.set(name, []);
        found.get(name).push(path.relative(root, file).replace(/\\/g, '/'));
      }
    }
  }
  return found;
}
function collectExports() {
  const exported = new Set();
  const patterns = [
    /export\s+async\s+function\s+([A-Za-z_$][\w$]*)\s*\(/g,
    /export\s+function\s+([A-Za-z_$][\w$]*)\s*\(/g,
    /export\s+const\s+([A-Za-z_$][\w$]*)\b/g,
    /export\s+type\s+([A-Za-z_$][\w$]*)\b/g,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(source))) exported.add(match[1]);
  }
  return exported;
}
const imported = collectImports();
const exportedNames = collectExports();
const forbiddenFalsePositives = ['AlertTriangle', 'useState', 'Link', 'Dialog', 'CardContent'];
for (const name of forbiddenFalsePositives) {
  if (imported.has(name)) {
    console.error('CLOSEFLOW_SUPABASE_FALLBACK_NAMED_EXPORTS_V1_FAIL');
    console.error('Parser or source import is still polluted: ' + name + ' was treated as supabase-fallback import.');
    console.error('Files: ' + imported.get(name).join(', '));
    process.exit(1);
  }
}
const missing = [];
for (const [name, files] of imported.entries()) {
  if (!exportedNames.has(name)) missing.push({ name, files });
}
if (missing.length) {
  console.error('CLOSEFLOW_SUPABASE_FALLBACK_NAMED_EXPORTS_V1_FAIL');
  console.error('Missing named exports in src/lib/supabase-fallback.ts:');
  for (const item of missing) console.error('- ' + item.name + ' imported by ' + item.files.join(', '));
  process.exit(1);
}
console.log('CLOSEFLOW_SUPABASE_FALLBACK_NAMED_EXPORTS_V1_CHECK_OK');
console.log('checkedImports=' + imported.size);
