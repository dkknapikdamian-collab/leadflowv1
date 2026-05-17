const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const roots = ['src', 'tests', 'scripts', '_project'];
const excludedDirNames = new Set(['.git', 'node_modules', 'dist', 'build', '.vercel', '.next', '_backup_local']);
const allowedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.css', '.md', '.json']);
const cp = (...codes) => String.fromCodePoint(...codes);
const bannedCodepoints = [0x00c4, 0x0102, 0x00c2, 0x0139, 0x013d, 0xfffd];
const brokenBomFragments = [
  cp(0x00ef, 0x00bb, 0x00bf),
  cp(0x00b4, 0x2557, 0x2510),
];
const bannedFragments = [
  'najbli' + cp(0x0139, 0x013d) + 'szych',
  'Najbli' + cp(0x0139, 0x013d) + 'szych',
  'wpis' + cp(0x0102, 0x0142) + 'w',
  'powi' + cp(0x00c4, 0x2026) + 'zania',
  'Powi' + cp(0x00c4, 0x2026) + 'zana',
  'spraw' + cp(0x00c4, 0x2122),
  'Otw' + cp(0x0102, 0x0142) + 'rz',
  'Usu' + cp(0x0139, 0x201e),
  'Przywr' + cp(0x0102, 0x0142, 0x00c4, 0x2021),
  'dzie' + cp(0x0139, 0x201e),
  ...brokenBomFragments,
];

function rel(abs) {
  return path.relative(repoRoot, abs).split(path.sep).join('/');
}

function walk(abs, out = []) {
  if (!fs.existsSync(abs)) return out;
  const stat = fs.statSync(abs);
  if (stat.isDirectory()) {
    const name = path.basename(abs);
    if (excludedDirNames.has(name)) return out;
    const relative = rel(abs);
    if (relative.startsWith('_project/stage98b_') && relative.includes('command_logs')) return out;
    if (relative.startsWith('_project/backups/')) return out;
    for (const child of fs.readdirSync(abs)) walk(path.join(abs, child), out);
  } else {
    out.push(abs);
  }
  return out;
}

function shouldScan(relative) {
  if (relative.includes('/.git/') || relative.includes('/node_modules/')) return false;
  if (relative.startsWith('_backup_local/')) return false;
  if (relative.startsWith('_project/stage98b_') && relative.includes('command_logs')) return false;
  if (relative.startsWith('_project/backups/')) return false;
  return allowedExtensions.has(path.extname(relative));
}

function near(text, index) {
  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, index + 80);
  return text.slice(start, end).replace(/\r/g, '\\r').replace(/\n/g, '\\n');
}

test('Stage98B Polish mojibake is a hard fail in src/tests/scripts/_project', () => {
  assert.equal(bannedFragments.some((fragment) => fragment.length === 0), false, 'Stage98B guard cannot use empty banned fragments.');
  const files = roots.flatMap((root) => walk(path.join(repoRoot, root))).map(rel).filter(shouldScan);
  const hits = [];
  for (const file of files) {
    const text = fs.readFileSync(path.join(repoRoot, file), 'utf8');
    if (text.charCodeAt(0) === 0xfeff) hits.push(file + ': raw BOM near "' + near(text, 0) + '"');
    for (let i = 0; i < text.length; i += 1) {
      const code = text.codePointAt(i);
      if (code > 0xffff) i += 1;
      if (bannedCodepoints.includes(code)) hits.push(file + ': U+' + code.toString(16).toUpperCase().padStart(4, '0') + ' near "' + near(text, i) + '"');
      if (code >= 0x80 && code <= 0x9f) hits.push(file + ': C1 U+' + code.toString(16).toUpperCase().padStart(4, '0') + ' near "' + near(text, i) + '"');
    }
    for (const fragment of bannedFragments) {
      const index = text.indexOf(fragment);
      if (index !== -1) hits.push(file + ': banned mojibake fragment near "' + near(text, index) + '"');
    }
  }
  assert.deepStrictEqual(hits, []);
});
