const fs = require('fs');
const path = require('path');

const root = process.cwd();
const ignoredDirs = new Set(['.git', 'node_modules', 'dist', '.vercel', '.next', 'coverage']);
const allowedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.html', '.json']);

// This guard checks user-facing application files. Tests and guard scripts are allowed
// to contain mojibake markers inside regexes because they are detection fixtures.
const uiRoots = ['src/pages', 'src/components', 'src/hooks', 'src/lib', 'api'].map((item) => path.join(root, item));
const skipFiles = new Set([
  'scripts/repair-polish-text-global.cjs',
  'scripts/check-polish-text-global.cjs',
]);
const suspiciousRe = /[ÄĹĂÅÃÂ�]/;
const forbiddenVisibleWords = [/Wypchnij/i];

function shouldSkipLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith('//') || trimmed.startsWith('*')) return true;
  if (trimmed.includes('mojibake marker')) return true;
  if (trimmed.includes('suspiciousRe')) return true;
  if (trimmed.includes('badPatterns')) return true;
  if (trimmed.includes('String.fromCharCode')) return true;
  return false;
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.stage')) continue;
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) continue;
      walk(full, out);
    } else if (entry.isFile()) {
      if (skipFiles.has(rel)) continue;
      if (allowedExtensions.has(path.extname(entry.name))) out.push(rel);
    }
  }
  return out;
}

const failures = [];
const files = uiRoots.flatMap((rootDir) => walk(rootDir));
for (const rel of files) {
  let text;
  try { text = fs.readFileSync(path.join(root, rel), 'utf8'); } catch { continue; }
  const lines = text.split(/\r?\n/);
  lines.forEach((line, idx) => {
    if (shouldSkipLine(line)) return;
    if (suspiciousRe.test(line)) failures.push(rel + ':' + (idx + 1) + ': mojibake marker: ' + line.trim().slice(0, 220));
    for (const pattern of forbiddenVisibleWords) {
      pattern.lastIndex = 0;
      if (pattern.test(line)) failures.push(rel + ':' + (idx + 1) + ': forbidden UI copy: ' + line.trim().slice(0, 220));
    }
  });
}

if (failures.length) {
  console.error('Global Polish text guard failed:');
  for (const item of failures.slice(0, 80)) console.error('- ' + item);
  if (failures.length > 80) console.error('... and ' + (failures.length - 80) + ' more');
  process.exit(1);
}
console.log('PASS Global Polish text guard');
