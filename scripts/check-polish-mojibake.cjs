#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DEFAULT_ROOT = process.cwd();
const RUNTIME_ROOTS = ['src/pages', 'src/components', 'src/lib'];
const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs']);

const BAD_PATTERNS = [
  '\u0139', '\u00c4', '\u0102', '\u00c2', '\u00E2\u20AC', '\u00E2\u2020', '\ufffd',
  'Aadowanie', 'podgldu', 'Nie udaBo', 'wyja[nienie',
  'ju\ufffd', 'obs\ufffdudze', 'obs\ufffdug\ufffd', 'Najbli\ufffdsza', 'szablon\ufffdw', 'kr\ufffdtkie', 'Utw\ufffdrz',
];

const SKIP_PARTS = [
  '/__snapshots__/',
  '/admin-tools/admin-tools-export.ts',
];

function walk(dir, result = []) {
  if (!fs.existsSync(dir)) return result;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.vercel'].includes(entry.name)) continue;
      walk(target, result);
      continue;
    }
    result.push(target);
  }
  return result;
}

function shouldSkip(root, file) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  return SKIP_PARTS.some((part) => rel.includes(part.replace(/^\//, '')));
}

function validatePolishMojibake(root = DEFAULT_ROOT) {
  const files = RUNTIME_ROOTS
    .map((item) => path.join(root, item))
    .flatMap((dir) => walk(dir))
    .filter((file) => EXTS.has(path.extname(file)) && !shouldSkip(root, file));

  const hits = [];
  for (const file of files) {
    const rel = path.relative(root, file).replace(/\\/g, '/');
    const text = fs.readFileSync(file, 'utf8');
    const lines = text.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (BAD_PATTERNS.some((pattern) => line.includes(pattern))) {
        hits.push(`${rel}:${index + 1}: ${line.trim().slice(0, 220)}`);
      }
    });
  }
  return hits;
}

if (require.main === module) {
  const hits = validatePolishMojibake(process.cwd());
  if (hits.length) {
    console.error('Polish mojibake detected in runtime UI/source copy. Fix encoding before commit.');
    for (const hit of hits.slice(0, 120)) console.error(hit);
    if (hits.length > 120) console.error(`...and ${hits.length - 120} more`);
    process.exit(1);
  }
  console.log('OK: no Polish mojibake detected in runtime UI/source copy.');
}

module.exports = { validatePolishMojibake };
