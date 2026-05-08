const fs = require('fs');
const path = require('path');

const root = process.cwd();
const src = path.join(root, 'src');
const exts = new Set(['.tsx', '.ts', '.jsx', '.js']);
function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (exts.has(path.extname(entry.name))) acc.push(full);
  }
  return acc;
}
function rel(file) { return path.relative(root, file).replace(/\\/g, '/'); }
function lineNo(text, idx) { return text.slice(0, idx).split(/\r?\n/).length; }

const findings = [];
for (const file of walk(src)) {
  const text = fs.readFileSync(file, 'utf8');
  if (!/(Trash2|Usuń|delete|Delete|destructive)/.test(text)) continue;
  const dangerRegex = /(text|bg|border|ring)-(red|rose)-[0-9]{2,3}/g;
  let m;
  while ((m = dangerRegex.exec(text))) {
    findings.push({ file: rel(file), line: lineNo(text, m.index), className: m[0] });
  }
}

if (findings.length) {
  console.warn('AUDIT: local danger/red classes near delete/destructive contexts found. This is informational for now.');
  for (const f of findings.slice(0, 80)) console.warn(`- ${f.file}:${f.line} ${f.className}`);
} else {
  console.log('OK: no local danger/red classes found near delete/destructive contexts.');
}

console.log('OK: danger style contract audit completed.');
