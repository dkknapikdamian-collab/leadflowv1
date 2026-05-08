const fs = require('fs');
const path = require('path');

const root = process.cwd();
const srcDir = path.join(root, 'src');
const outDir = path.join(root, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });

const exts = new Set(['.tsx', '.ts', '.jsx', '.js']);
function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (exts.has(path.extname(entry.name))) acc.push(full);
  }
  return acc;
}

function rel(file) { return path.relative(root, file).replace(/\\/g, '/'); }
function lineNo(text, idx) { return text.slice(0, idx).split(/\r?\n/).length; }

const actionTerms = ['Dodaj notatkę','Dodaj zadanie','Dodaj sprawę','Usuń','Edytuj','Zapisz','Anuluj','Kopiuj','Dyktuj','Nowa sprawa','Dodaj'];
const files = walk(srcDir);
const result = {
  generatedAt: new Date().toISOString(),
  sourceFiles: files.length,
  actionOccurrences: [],
  buttons: [],
  iconImports: [],
  statShortcutCardUsage: [],
  classNames: [],
  likelyDetailPages: [],
};

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const r = rel(file);
  if (/Detail\.tsx$/.test(file)) result.likelyDetailPages.push(r);

  for (const term of actionTerms) {
    let pos = text.indexOf(term);
    while (pos !== -1) {
      result.actionOccurrences.push({ term, file: r, line: lineNo(text, pos) });
      pos = text.indexOf(term, pos + term.length);
    }
  }

  const lucideMatch = text.match(/import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"]/);
  if (lucideMatch) {
    const icons = lucideMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    for (const icon of icons) result.iconImports.push({ icon, file: r });
  }

  if (text.includes('StatShortcutCard')) result.statShortcutCardUsage.push(r);

  const buttonRegex = /<(Button|button|Link|a)\b[^>]*(aria-label=\{?['"][^'"]+['"]\}?|title=\{?['"][^'"]+['"]\}?|className=\{?['"][^'"]+['"]\}?|variant=\{?['"][^'"]+['"]\}?)[^>]*>/g;
  let m;
  while ((m = buttonRegex.exec(text))) {
    result.buttons.push({ tag: m[1], file: r, line: lineNo(text, m.index), snippet: m[0].slice(0, 220) });
  }

  const classRegex = /className=\{?['"]([^'"]+)['"]\}?/g;
  while ((m = classRegex.exec(text))) {
    const value = m[1];
    if (/red|rose|danger|destructive|metric|tile|card|button|action|icon|note|task/i.test(value)) {
      result.classNames.push({ file: r, line: lineNo(text, m.index), className: value.slice(0, 260) });
    }
  }
}

const md = [];
md.push('# CloseFlow UI Map — generated');
md.push('');
md.push(`Generated: ${result.generatedAt}`);
md.push(`Source files scanned: ${result.sourceFiles}`);
md.push('');
md.push('## Likely detail pages');
for (const f of result.likelyDetailPages.sort()) md.push(`- ${f}`);
md.push('');
md.push('## StatShortcutCard usage');
for (const f of [...new Set(result.statShortcutCardUsage)].sort()) md.push(`- ${f}`);
md.push('');
md.push('## Action occurrences');
for (const item of result.actionOccurrences.slice(0, 500)) md.push(`- ${item.term}: ${item.file}:${item.line}`);
md.push('');
md.push('## Lucide icon imports');
for (const item of result.iconImports.slice(0, 500)) md.push(`- ${item.icon}: ${item.file}`);
md.push('');
md.push('## Button/link snippets');
for (const item of result.buttons.slice(0, 250)) md.push(`- ${item.file}:${item.line} ${item.snippet.replace(/\s+/g, ' ')}`);
md.push('');
md.push('## Relevant className snippets');
for (const item of result.classNames.slice(0, 350)) md.push(`- ${item.file}:${item.line} \`${item.className}\``);
md.push('');

fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_UI_MAP.generated.md'), md.join('\n'), 'utf8');
fs.writeFileSync(path.join(outDir, 'closeflow-ui-map.generated.json'), JSON.stringify(result, null, 2), 'utf8');
console.log('OK: wrote docs/ui/CLOSEFLOW_UI_MAP.generated.md and docs/ui/closeflow-ui-map.generated.json');
