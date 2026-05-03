const fs = require('fs');
const path = require('path');

const root = process.cwd();
const reportDir = path.join(root, 'docs', 'reports');
fs.mkdirSync(reportDir, { recursive: true });

const ignoredDirs = new Set(['.git', 'node_modules', 'dist', '.vercel', '.next', 'coverage']);
const allowedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.html', '.md', '.json']);
const skipFiles = new Set([
  'scripts/repair-polish-text-global.cjs',
  'scripts/check-polish-text-global.cjs',
  'docs/reports/polish-text-repair-stage01-report.json',
  'docs/reports/polish-text-repair-stage01-changed-files.txt',
  'docs/reports/polish-text-repair-stage01-suspects.txt',
]);

const mojibakeMap = new Map(Object.entries({
  'Ä…':'ą','Ä‡':'ć','Ä™':'ę','Ĺ‚':'ł','Ĺ„':'ń','Ăł':'ó','Ĺ›':'ś','Ĺş':'ź','ĹĽ':'ż',
  'Ä„':'Ą','Ä†':'Ć','Ä˜':'Ę','Ĺ�':'Ł','Ĺ':'Ł','Ĺ':'Ń','Ă“':'Ó','Ĺš':'Ś','Ĺą':'Ź','Ĺ»':'Ż',
  'Å‚':'ł','Å„':'ń','Ã³':'ó','Å›':'ś','Åº':'ź','Å¼':'ż','Åƒ':'Ń','Ã“':'Ó','Åš':'Ś','Å¹':'Ź','Å»':'Ż','Å':'Ł',
  'â€“':'–','â€”':'—','â€ž':'„','â€œ':'“','â€ť':'”','â€™':'’','â€ś':'“','Â ':' ','Â': ''
}));

const visibleAsciiSuspects = [
  /\bBlad\b/g, /\bblad\b/g, /\bBled/g, /\bbled/g,
  /\buzytkownik\b/gi, /\bplatn[a-z]*\b/gi, /\bpolaczen[a-z]*\b/gi,
  /\bustawien\b/gi, /\bwysylk[a-z]*\b/gi, /\bprzegladark[a-z]*\b/gi,
  /\bpowiadomien\b/gi, /\bodswiez\b/gi, /\bsprobuj\b/gi, /\bszczegol[a-z]*\b/gi,
  /\bzrodlo\b/gi, /\bsprawdz\b/gi, /\bwlacz[a-z]*\b/gi, /\bwylacz[a-z]*\b/gi,
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.stage')) continue;
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) continue;
      walk(full, out);
    } else if (entry.isFile()) {
      if (skipFiles.has(rel)) continue;
      if (rel.startsWith('docs/reports/')) continue;
      if (allowedExtensions.has(path.extname(entry.name))) out.push(rel);
    }
  }
  return out;
}

function repairText(text) {
  let next = text;
  for (const [bad, good] of mojibakeMap) next = next.split(bad).join(good);
  return next;
}

const files = walk(root);
const changed = [];
const mojibakeHits = [];
const asciiSuspects = [];
const suspiciousRe = /[ÄĹĂÅÃÂ�]/;

for (const rel of files) {
  const full = path.join(root, rel);
  let text;
  try { text = fs.readFileSync(full, 'utf8'); } catch { continue; }
  if (suspiciousRe.test(text)) {
    const lines = text.split(/\r?\n/);
    lines.forEach((line, idx) => { if (suspiciousRe.test(line)) mojibakeHits.push({ file: rel, line: idx + 1, text: line.trim().slice(0, 240) }); });
  }
  const fixed = repairText(text);
  if (fixed !== text) {
    fs.writeFileSync(full, fixed, 'utf8');
    changed.push(rel);
  }
  const lines = fixed.split(/\r?\n/);
  lines.forEach((line, idx) => {
    for (const pattern of visibleAsciiSuspects) {
      pattern.lastIndex = 0;
      if (pattern.test(line)) {
        asciiSuspects.push({ file: rel, line: idx + 1, text: line.trim().slice(0, 240) });
        break;
      }
    }
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  changedFiles: changed,
  mojibakeBeforeRepair: mojibakeHits,
  asciiPolishSuspects: asciiSuspects,
  note: 'Mojibake is auto-repaired. ASCII suspects are reported, not blindly repaired, to avoid breaking identifiers/API keys/routes.'
};
fs.writeFileSync(path.join(reportDir, 'polish-text-repair-stage01-report.json'), JSON.stringify(report, null, 2), 'utf8');
fs.writeFileSync(path.join(reportDir, 'polish-text-repair-stage01-changed-files.txt'), changed.join('\n') + (changed.length ? '\n' : ''), 'utf8');
fs.writeFileSync(path.join(reportDir, 'polish-text-repair-stage01-suspects.txt'), asciiSuspects.map(x => `${x.file}:${x.line}: ${x.text}`).join('\n') + (asciiSuspects.length ? '\n' : ''), 'utf8');

console.log('Polish text repair complete');
console.log('Changed files:', changed.length);
console.log('Mojibake hits before repair:', mojibakeHits.length);
console.log('ASCII suspect lines:', asciiSuspects.length);
