const fs = require('fs');
const path = require('path');

const repo = process.cwd();
function read(rel) { return fs.readFileSync(path.join(repo, rel), 'utf8'); }
function chars() { return String.fromCharCode.apply(String, arguments); }

const files = [
  'src/pages/LeadDetail.tsx',
  'docs/release/STAGE84_LEAD_DETAIL_WORK_CENTER_2026-05-05.md',
  'scripts/check-stage84-lead-detail-work-center.cjs',
  'tests/stage84-lead-detail-work-center.test.cjs',
];

const requiredLeadTexts = [
  'Najbliższa zaplanowana akcja',
  'Powód ryzyka',
  'Otwórz sprawę',
  'Dopisz notatkę',
  'Oferta wysłana',
  'Brak zaplanowanych działań',
];

const forbidden = [
  chars(0x0139),
  chars(0x00c4),
  chars(0x0102),
  chars(0x00e2, 0x20ac),
  chars(0x00c5, 0x00bc),
  chars(0x00c5, 0x00ba),
  chars(0x00c5, 0x201a),
  chars(0x00c5, 0x201e),
  chars(0x00c5, 0x203a),
  chars(0x00c3, 0x00b3),
];

for (const text of requiredLeadTexts) {
  if (!read('src/pages/LeadDetail.tsx').includes(text)) {
    console.error('Missing fixed Polish text in LeadDetail.tsx: ' + text);
    process.exit(1);
  }
}

const hits = [];
for (const file of files) {
  const body = read(file);
  const lines = body.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (forbidden.some((pattern) => line.includes(pattern))) {
      hits.push(file + ':' + (index + 1) + ': ' + line.trim());
    }
  });
}

if (hits.length) {
  console.error('Stage84G mojibake still present:');
  console.error(hits.join('\n'));
  process.exit(1);
}

console.log('PASS STAGE84G_LEAD_DETAIL_POLISH_CLEAN_SWEEP');
