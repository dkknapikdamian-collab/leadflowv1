const fs = require('fs');
const path = require('path');

const repo = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function chars() {
  return String.fromCharCode.apply(String, arguments);
}

const files = [
  'src/pages/LeadDetail.tsx',
  'scripts/check-stage84-lead-detail-work-center.cjs',
  'tests/stage84-lead-detail-work-center.test.cjs',
  'scripts/check-stage84g-lead-detail-polish-clean-sweep.cjs',
  'docs/release/STAGE84_LEAD_DETAIL_WORK_CENTER_2026-05-05.md',
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

const required = [
  'Najbliższa akcja',
  'Powód ryzyka',
  'Otwórz sprawę',
  'Dopisz notatkę',
  'Oferta wysłana',
  'Brak zaplanowanych działań',
];

const leadDetail = read('src/pages/LeadDetail.tsx');
for (const text of required) {
  if (!leadDetail.includes(text)) {
    console.error('Missing clean Stage84 Polish text: ' + text);
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
  console.error('Stage84H forbidden encoding markers found:');
  console.error(hits.join('\n'));
  process.exit(1);
}

console.log('PASS STAGE84H_LEAD_DETAIL_GUARD_CLEAN');
