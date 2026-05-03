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
  '\u00c4\u2026':'\u0105','\u00c4\u2021':'\u0107','\u00c4\u2122':'\u0119','\u0139\u201a':'\u0142','\u0139\u201e':'\u0144','\u0102\u0142':'\u00f3','\u0139\u203a':'\u015b','\u0139\u015f':'\u017a','\u0139\u013d':'\u017c',
  '\u00c4\u201e':'\u0104','\u00c4\u2020':'\u0106','\u00c4\u02dc':'\u0118','\u0139\ufffd':'\u0141','\u0139\u0081':'\u0141','\u0139\u0083':'\u0143','\u0102\u201c':'\u00d3','\u0139\u0161':'\u015a','\u0139\u0105':'\u0179','\u0139\u00bb':'\u017b',
  '\u00c5\u201a':'\u0142','\u00c5\u201e':'\u0144','\u00c3\u00b3':'\u00f3','\u00c5\u203a':'\u015b','\u00c5\u00ba':'\u017a','\u00c5\u00bc':'\u017c','\u00c5\u0192':'\u0143','\u00c3\u201c':'\u00d3','\u00c5\u0161':'\u015a','\u00c5\u00b9':'\u0179','\u00c5\u00bb':'\u017b','\u00c5\u0081':'\u0141',
  '\u00e2\u20ac\u201c':'\u2013','\u00e2\u20ac\u201d':'\u2014','\u00e2\u20ac\u017e':'\u201e','\u00e2\u20ac\u0153':'\u201c','\u00e2\u20ac\u0165':'\u201d','\u00e2\u20ac\u2122':'\u2019','\u00e2\u20ac\u015b':'\u201c','\u00c2 ':' ','\u00c2': ''
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
const suspiciousRe = /[\u00c4\u0139\u0102\u00c5\u00c3\u00c2\ufffd]/;

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
