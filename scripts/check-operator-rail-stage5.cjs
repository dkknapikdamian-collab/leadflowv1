const fs = require('node:fs');
const path = require('node:path');

function forbiddenTerms() {
  return [
    ['Leady do ', 'spi' + '\u0119' + 'cia'].join(''),
    ['Brak klienta albo sprawy przy aktywnym ', 'temacie'].join(''),
    ['data-clients-', 'lead-' + 'attention-rail'].join(''),
    ['clients-', 'lead-' + 'attention-card'].join(''),
    ['data-right-rail-list="', 'lead-' + 'attention', '"'].join(''),
    ['data-right-rail-list=\'', 'lead-' + 'attention', '\''].join(''),
    ['leadsNeedingClient', 'OrCaseLink'].join(''),
    ['STAGE74_CLIENTS_', 'LEADS_TO_LINK_EMPTY_COPY'].join(''),
  ];
}

const root = process.cwd();
const folders = ['src', 'tests', 'scripts'];
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.css']);
function walk(dir) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  const out = [];
  const stack = [full];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const next = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
        stack.push(next);
      } else if (entry.isFile() && extensions.has(path.extname(entry.name))) {
        out.push(next);
      }
    }
  }
  return out;
}
const offenders = [];
for (const file of folders.flatMap(walk)) {
  const rel = path.relative(root, file).split(path.sep).join('/');
  if (rel === 'tests/stage83-right-rail-stale-cleanup.test.cjs') continue;
  const text = fs.readFileSync(file, 'utf8');
  for (const term of forbiddenTerms()) {
    if (text.includes(term)) offenders.push(rel + ' :: ' + term);
  }
}
if (offenders.length) {
  console.error(offenders.join('\n'));
  process.exit(1);
}
console.log('OK: legacy clients lead linking rail markers are absent.');
