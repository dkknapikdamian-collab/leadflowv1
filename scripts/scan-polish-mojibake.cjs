#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const repo = path.resolve(process.argv[2] || process.cwd());

const skipDirs = new Set(['.git', '.vercel', 'node_modules', 'dist', 'build', 'coverage', '.next', 'out', '.turbo', '.cache']);
const skipFiles = new Set(['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock']);
const textExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.json', '.md', '.txt', '.html', '.css', '.scss', '.sql', '.yml', '.yaml', '.toml', '.ps1', '.env', '.example']);

const patternCodePoints = [[196,8230],[196,8225],[196,8482],[196,8222],[196,8224],[196,732],[313,8218],[197,8218],[313,8222],[197,8222],[258,322],[195,179],[258,8220],[195,8220],[313,8250],[197,8250],[313,351],[197,186],[313,317],[197,188],[313,353],[197,353],[313,377],[197,185],[313,357],[197,187],[313,196],[197,196],[194],[65533]];

const badPatterns = patternCodePoints.map((codes) => String.fromCodePoint(...codes));

function shouldScan(filePath) {
  const baseName = path.basename(filePath);
  if (skipFiles.has(baseName)) return false;

  const ext = path.extname(filePath).toLowerCase();
  if (textExtensions.has(ext)) return true;
  if (baseName.startsWith('.env')) return true;
  if (baseName.endsWith('.env.example')) return true;

  return false;
}

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, acc);
    } else if (entry.isFile() && shouldScan(fullPath)) {
      acc.push(fullPath);
    }
  }

  return acc;
}

const hits = [];

for (const file of walk(repo)) {
  const content = fs.readFileSync(file, 'utf8');
  const found = badPatterns.filter((pattern) => content.includes(pattern));

  if (found.length > 0) {
    hits.push({ file: path.relative(repo, file), count: found.length });
  }
}

if (hits.length > 0) {
  console.error('Polish mojibake found:');
  for (const hit of hits) {
    console.error(' - ' + hit.file + ': ' + hit.count + ' marker(s)');
  }
  process.exit(1);
}

console.log('OK: no Polish mojibake patterns found.');
