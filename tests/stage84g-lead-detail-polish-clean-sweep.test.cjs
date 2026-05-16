const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repo = path.join(__dirname, '..');
const files = [
  'src/pages/LeadDetail.tsx',
  'docs/release/STAGE84_LEAD_DETAIL_WORK_CENTER_2026-05-05.md',
  'scripts/check-stage84-lead-detail-work-center.cjs',
  'tests/stage84-lead-detail-work-center.test.cjs',
];

test('Stage84G keeps LeadDetail Polish copy clean', () => {
  for (const file of files) {
    const body = fs.readFileSync(path.join(repo, file), 'utf8');
    assert.doesNotMatch(body, /Najbli\u017Csza|Pow\u00F3d|Otw\u00F3rz|spraw\u0119|notatk\u0119|wys\u0142ana|dzia\u0142a\u0144|wdro\u017Ceniu/);
  }
});
