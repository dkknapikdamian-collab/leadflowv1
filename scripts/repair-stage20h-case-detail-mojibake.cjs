const fs = require('fs');
const path = require('path');
const root = process.argv[2] || process.cwd();
const targetRel = 'src/pages/CaseDetail.tsx';
const target = path.join(root, targetRel);
if (!fs.existsSync(target)) throw new Error(targetRel + ' missing');
let text = fs.readFileSync(target, 'utf8');
const before = text;
const replacements = [
  ['\u00c4\u00E2\u20AC\u00A6','\u0105'], ['\u00c4\u00E2\u20AC\u02C7','\u0107'], ['\u00c4\u00E2\u201E\u02D8','\u0119'], ['\u0133','\u0142'], ['\u00c4\u00E2\u20AC\u017E','\u0104'], ['\u00c4\u00E2\u20AC\u00A0','\u0106'], ['\u00c4\u00c4\u0098','\u00c4\u0098'],
  ['\u0139\u00E2\u20AC\u0161','\u0142'], ['\u0139\u00E2\u20AC\u017E','\u0144'], ['\u0139\u00E2\u20AC\u015F','\u015B'], ['\u017A','\u017A'], ['\u017C','\u017C'], ['\u017B','\u017B'], ['\u015A','\u015A'], ['\u0179','\u015A'],
  ['\u00c5\u00E2\u20AC\u0161','\u0142'], ['\u00c5\u00E2\u20AC\u017E','\u0144'], ['\u00c5\u00E2\u20AC\u015F','\u015B'], ['\u017A','\u017A'], ['\u017C','\u017C'], ['\u017B','\u017B'], ['\u015A','\u015A'],
  ['\u00F3','\u00F3'], ['\u0102\u00E2\u20AC\u015B','\u00D3'],
  ['\u0139\u0081','\u0139\u0081'], ['\u00c5\u0081','\u0139\u0081'],
  ['\u00E2\u00E2\u201A\u00AC\u017E','\u00E2\u20AC\u017E'], ['\u00E2\u00E2\u201A\u00AC\u0165','\u00E2\u20AC\u0165'], ['\u00E2\u00E2\u201A\u00AC\u0153','\u00E2\u20AC\u015B'], ['\u00E2\u00E2\u201A\u00AC\u015B','\u00E2\u20AC\u0165'], ['\u00E2\u00E2\u201A\u00AC\u00E2\u201E\u02D8','\u00E2\u20AC\u2122'], ['\u00E2\u00E2\u201A\u00AC\u00E2\u20AC\u015B','\u00E2\u20AC\u201C'], ['\u00E2\u00E2\u201A\u00AC\u00E2\u20AC\u0165','\u00E2\u20AC\u201D'],
  ['\u00B7','\u00B7'], ['\u00c2 ', ' '], ['\u00c2', '']
];
for (const [from, to] of replacements) {
  text = text.split(from).join(to);
}
// Drugi przebieg pomaga, gdy plik mia\u0142 mieszane warianty po wcze\u015Bniejszych cz\u0119\u015Bciowych naprawach.
for (const [from, to] of replacements) {
  text = text.split(from).join(to);
}
fs.writeFileSync(target, text, 'utf8');
const forbidden = ['\u0139', '\u00c4', '\u0102', '\u017C', '\u0102\u0083\u00B3', '\u00E2\u00E2\u201A\u00AC', '\u00B7'];
const leftovers = [];
const lines = text.split(/\r?\n/);
for (const token of forbidden) {
  if (text.includes(token)) {
    const found = [];
    lines.forEach((line, index) => {
      if (line.includes(token) && found.length < 5) found.push(`${index + 1}: ${line.slice(0, 220)}`);
    });
    leftovers.push({ token, found });
  }
}
if (leftovers.length) {
  console.error('FAIL CaseDetail mojibake leftovers after repair:');
  for (const item of leftovers) {
    console.error('TOKEN ' + item.token);
    for (const line of item.found) console.error(line);
  }
  process.exit(1);
}
if (before === text) {
  console.log('PASS CaseDetail mojibake repair: no changes needed');
} else {
  console.log('PASS CaseDetail mojibake repair applied');
}
