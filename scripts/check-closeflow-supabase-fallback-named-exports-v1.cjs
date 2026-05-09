const fs = require('fs');
const path = require('path');

const root = process.cwd();
const srcFile = path.join(root, 'src', 'lib', 'supabase-fallback.ts');
const source = fs.readFileSync(srcFile, 'utf8').replace(/^\uFEFF/, '');

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!['node_modules', 'dist', '.git', '.vite'].includes(item)) walk(full, out);
    } else if (/\.(ts|tsx)$/.test(item)) {
      out.push(full);
    }
  }
  return out;
}

function normalizeSource(value) {
  return String(value || '').replace(/\\/g, '/').replace(/\.tsx?$/, '');
}

function isSupabaseFallbackImport(importSource) {
  const s = normalizeSource(importSource);
  return s === '../lib/supabase-fallback'
    || s === '../../lib/supabase-fallback'
    || s === './lib/supabase-fallback'
    || s.endsWith('/src/lib/supabase-fallback')
    || s === 'src/lib/supabase-fallback';
}

function stripImportComments(block) {
  return String(block || '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split(/\r?\n/)
    .map((line) => line.replace(/\/\/.*$/, ''))
    .join('\n');
}

function parseNamedImportBlock(block) {
  return stripImportComments(block)
    .split(',')
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((raw) => raw.replace(/^type\s+/, '').split(/\s+as\s+/i)[0].trim())
    .filter((name) => /^[A-Za-z_$][\w$]*$/.test(name));
}

function collectImportDeclarations(text) {
  const declarations = [];
  const lines = String(text || '').replace(/^\uFEFF/, '').split(/\r?\n/);
  let current = '';
  let active = false;
  let startLine = 0;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!active) {
      if (!trimmed.startsWith('import ')) continue;
      active = true;
      startLine = i + 1;
      current = line;
      if (trimmed.endsWith(';')) {
        declarations.push({ text: current, startLine });
        active = false;
        current = '';
      }
      continue;
    }

    current += '\n' + line;
    if (trimmed.endsWith(';')) {
      declarations.push({ text: current, startLine });
      active = false;
      current = '';
    }
  }

  return declarations;
}

function extractImportSource(declaration) {
  const match = String(declaration || '').match(/\bfrom\s+['"]([^'"]+)['"]\s*;?\s*$/);
  return match ? match[1] : '';
}

function extractNamedImports(declaration) {
  const match = String(declaration || '').match(/\{([\s\S]*?)\}/);
  if (!match) return [];
  return parseNamedImportBlock(match[1]);
}

function collectImports() {
  const files = walk(path.join(root, 'src'));
  const found = new Map();

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    for (const declaration of collectImportDeclarations(text)) {
      const importSource = extractImportSource(declaration.text);
      if (!isSupabaseFallbackImport(importSource)) continue;
      for (const name of extractNamedImports(declaration.text)) {
        if (!found.has(name)) found.set(name, []);
        found.get(name).push(path.relative(root, file).replace(/\\/g, '/') + ':' + declaration.startLine);
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
    /export\s*\{([\s\S]*?)\}/g,
  ];

  for (const pattern of patterns.slice(0, 4)) {
    let match;
    while ((match = pattern.exec(source))) exported.add(match[1]);
  }

  let match;
  while ((match = patterns[4].exec(source))) {
    for (const name of parseNamedImportBlock(match[1])) exported.add(name);
  }

  return exported;
}

const imported = collectImports();
const exportedNames = collectExports();

const forbiddenFalsePositives = [
  'AlertTriangle',
  'useState',
  'Link',
  'Dialog',
  'CardContent',
  'createResponseTemplateInSupabase imported by',
  'createCaseTemplateInSupabase imported by',
  'status',
];

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
