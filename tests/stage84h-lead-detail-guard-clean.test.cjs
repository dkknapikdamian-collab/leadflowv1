const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repo = path.join(__dirname, '..');
function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function chars() {
  return String.fromCharCode.apply(String, arguments);
}

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

test('Stage84H guard files do not contain literal mojibake markers', () => {
  const files = [
    'src/pages/LeadDetail.tsx',
    'scripts/check-stage84-lead-detail-work-center.cjs',
    'tests/stage84-lead-detail-work-center.test.cjs',
    'scripts/check-stage84g-lead-detail-polish-clean-sweep.cjs',
  ];
  for (const file of files) {
    const body = read(file);
    assert.equal(forbidden.some((pattern) => body.includes(pattern)), false, file + ' contains encoding marker');
  }
});

test('Stage84H LeadDetail keeps clean Polish labels', () => {
  const body = read('src/pages/LeadDetail.tsx');
  for (const text of ['Najbliższa zaplanowana akcja', 'Powód ryzyka', 'Otwórz sprawę', 'Dopisz notatkę', 'Oferta wysłana']) {
    assert.ok(body.includes(text), 'Missing clean label: ' + text);
  }
});

