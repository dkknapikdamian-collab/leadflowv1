const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const roots = ['src', 'api', 'docs'].map(function (item) {
  return path.join(repo, item);
});
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.css', '.md', '.html', '.json']);

function chars() {
  return String.fromCharCode.apply(String, arguments);
}

const badPatterns = [
  chars(0x0139),
  chars(0x00c4),
  chars(0x0102),
  chars(0x00e2, 0x20ac),
  chars(0x00c5, 0x00bc),
  chars(0x00c5, 0x00ba),
  chars(0x00c5, 0x201a),
  chars(0x00c5, 0x201e),
  chars(0x00c5, 0x203a),
  chars(0x00c3, 0x00b3),
];

function shouldSkip(file) {
  const rel = path.relative(repo, file).replace(/\\/g, '/');

  // Generated diagnostics may quote raw guard regexes such as Ä|Ĺ|Ă.
  // They are not UI copy and should not fail the legacy mojibake gate.
  if (rel.startsWith('docs/reports/')) return true;

  // Patch backups are local implementation artifacts, not product text.
  if (rel.includes('/.stage') || rel.startsWith('.stage')) return true;

  return false;
}

function walk(dir, result) {
  result = result || [];
  if (!fs.existsSync(dir)) return result;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.vercel', 'reports'].includes(entry.name) && target.includes(path.join('docs', 'reports'))) continue;
      if (['node_modules', 'dist', '.git', '.vercel'].includes(entry.name)) continue;
      walk(target, result);
      continue;
    }

    result.push(target);
  }

  return result;
}

const files = roots
  .flatMap(function (root) {
    return walk(root);
  })
  .filter(function (file) {
    return exts.has(path.extname(file)) && !shouldSkip(file);
  });

const hits = [];

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);

  lines.forEach(function (line, index) {
    if (badPatterns.some(function (pattern) { return line.includes(pattern); })) {
      hits.push({
        file: path.relative(repo, file),
        line: index + 1,
        text: line.trim().slice(0, 220),
      });
    }
  });
}

if (hits.length) {
  console.error('Polish mojibake detected. Fix encoding before commit.');
  for (const hit of hits.slice(0, 80)) {
    console.error(hit.file + ':' + hit.line + ': ' + hit.text);
  }
  if (hits.length > 80) {
    console.error('...and ' + (hits.length - 80) + ' more');
  }
  process.exit(1);
}

console.log('OK: no Polish mojibake detected.');
