const fs = require('fs');
const path = require('path');

const root = process.cwd();
const targets = ['src/pages', 'src/components', 'src/lib'];
const patterns = [
  'CaseSettlementPanel',
  'CaseSettlementSection',
  'ClientFinanceRelationSummary',
  'Dodaj wp\u0142at\u0119',
  'Dodaj p\u0142atno\u015B\u0107 prowizji',
  'Edytuj prowizj\u0119',
  'Rozliczenie sprawy',
  'Warto\u015B\u0107 transakcji',
  'Prowizja nale\u017Cna',
  'Wp\u0142acono od klienta',
];

function walk(dir, out = []) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return out;
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) walk(rel, out);
    else if (/\.(tsx?|jsx?|css)$/.test(entry.name)) out.push(rel);
  }
  return out;
}

const files = targets.flatMap((target) => walk(target));
const hits = [];
for (const rel of files) {
  const text = fs.readFileSync(path.join(root, rel), 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const pattern of patterns) {
      if (line.includes(pattern)) {
        hits.push({ file: rel, line: index + 1, pattern, text: line.trim().slice(0, 180) });
      }
    }
  });
}

if (!hits.length) {
  console.log('Brak trafie\u0144 finansowych w skanowanym zakresie.');
  process.exit(0);
}

for (const hit of hits) {
  console.log(hit.file + ':' + hit.line + ' [' + hit.pattern + '] ' + hit.text);
}
