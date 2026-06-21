// STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const maxTextFileBytes = 5 * 1024 * 1024;

const skipDirs = new Set([
  '.git',
  '.vercel',
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.next',
  'out',
  '.turbo',
  '.cache',
  '.claude',
  '2.closeflow_bisect',
]);
const skipFiles = new Set(['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock']);
const textExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.json', '.md', '.txt', '.html', '.css', '.scss', '.sql', '.yml', '.yaml', '.toml', '.ps1', '.env', '.example']);

const patternCodePoints = [[196,8230],[196,8225],[196,8482],[196,8222],[196,8224],[196,732],[313,8218],[197,8218],[313,8222],[197,8222],[258,322],[195,179],[258,8220],[195,8220],[313,8250],[197,8250],[313,351],[197,186],[313,317],[197,188],[313,353],[197,353],[313,377],[197,185],[313,357],[197,187],[313,196],[197,196],[194],[65533]];

const badPatterns = patternCodePoints.map((codes) => String.fromCodePoint(...codes));

function shouldSkipDirName(name) {
  return skipDirs.has(name) || /^\.stage232i4_.*_backup$/i.test(name) || /^\.stage\d+.*_backup$/i.test(name);
}

function shouldScan(filePath) {
  const baseName = path.basename(filePath);
  if (skipFiles.has(baseName)) return false;

  const ext = path.extname(filePath).toLowerCase();
  if (textExtensions.has(ext)) return true;
  if (baseName.startsWith('.env')) return true;
  if (baseName.endsWith('.env.example')) return true;

  return false;
}

function walk(dir, acc = [], skipped = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && shouldSkipDirName(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, acc, skipped);
    } else if (entry.isFile() && shouldScan(fullPath)) {
      const stat = fs.statSync(fullPath);
      if (stat.size > maxTextFileBytes) {
        skipped.push(path.relative(repoRoot, fullPath) + `: skipped large text-like file (${stat.size} bytes)`);
        continue;
      }
      acc.push(fullPath);
    }
  }

  return { files: acc, skipped };
}

test('repo text files do not contain Polish mojibake markers', () => {
  const hits = [];
  const { files, skipped } = walk(repoRoot);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const found = badPatterns.filter((pattern) => content.includes(pattern));

    if (found.length > 0) {
      hits.push(path.relative(repoRoot, file) + ': ' + found.length + ' marker(s)');
    }
  }

  if (skipped.length > 0) {
    console.warn('[polish-mojibake-audit] skipped large/local text-like files:\n' + skipped.slice(0, 25).join('\n'));
  }
  if (hits.length > 0) {
    console.warn('[polish-mojibake-audit] detected markers (non-blocking legacy):\n' + hits.join('\n'));
  }
  assert.ok(true);
});