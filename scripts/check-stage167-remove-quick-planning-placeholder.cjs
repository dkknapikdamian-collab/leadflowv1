const fs = require('fs');
const path = require('path');

const root = process.cwd();
const targets = [
  'Szybkie planowanie',
  'Dodanie zadania albo wydarzenia bezpośrednio z formularza',
  'Ten etap nie udaje tej funkcji',
];

const exts = new Set(['.tsx', '.jsx', '.ts', '.js']);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
      walk(p, out);
    } else if (exts.has(path.extname(entry.name))) {
      out.push(p);
    }
  }
  return out;
}

const offenders = [];
for (const file of walk(path.join(root, 'src'))) {
  const text = fs.readFileSync(file, 'utf8');
  for (const phrase of targets) {
    if (text.includes(phrase)) {
      offenders.push(`${path.relative(root, file)} contains ${phrase}`);
    }
  }
}

if (offenders.length) {
  throw new Error('Stage167 guard failed:\n' + offenders.join('\n'));
}

if (!fs.existsSync(path.join(root, 'scripts/check-stage167-remove-quick-planning-placeholder.cjs'))) {
  throw new Error('Stage167 guard missing from repo.');
}

const report = path.join(root, '_project/STAGE167_REMOVE_QUICK_PLANNING_PLACEHOLDER_REPORT.md');
if (!fs.existsSync(report)) {
  throw new Error('Stage167 report missing.');
}

const obs = path.join(root, 'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage167 remove quick planning placeholder.md');
if (!fs.existsSync(obs)) {
  throw new Error('Stage167 Obsidian update missing.');
}

console.log('OK: Stage167 quick planning placeholder removed from src.');
