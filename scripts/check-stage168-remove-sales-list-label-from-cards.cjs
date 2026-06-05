const fs = require('fs');
const path = require('path');

const root = process.cwd();
const srcRoot = path.join(root, 'src');

const phrases = [
  'LISTA SPRZEDAŻOWA',
  'Lista sprzedażowa',
  'lista sprzedażowa',
  'LISTA SPRZEDAZOWA',
  'Lista sprzedazowa',
  'lista sprzedazowa',
  'LISTA SPRZEDAŻOWA',
  'Lista sprzedażowa',
  'lista sprzedażowa',
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
for (const file of walk(srcRoot)) {
  const text = fs.readFileSync(file, 'utf8');
  for (const phrase of phrases) {
    if (text.includes(phrase)) {
      offenders.push(`${path.relative(root, file)} contains ${phrase}`);
    }
  }
}

if (offenders.length) {
  throw new Error('Stage168 guard failed:\n' + offenders.join('\n'));
}

[
  'scripts/apply-stage168-remove-sales-list-label-from-cards.cjs',
  'scripts/check-stage168-remove-sales-list-label-from-cards.cjs',
  'docs/ui/CLOSEFLOW_STAGE168_REMOVE_SALES_LIST_LABEL_FROM_CARDS.md',
  '_project/STAGE168_REMOVE_SALES_LIST_LABEL_FROM_CARDS_REPORT.md',
  'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage168 remove sales list label from cards.md',
].forEach((rel) => {
  if (!fs.existsSync(path.join(root, rel))) {
    throw new Error(`Missing Stage168 file: ${rel}`);
  }
});

console.log('OK: Stage168 sales-list label removed from src.');
