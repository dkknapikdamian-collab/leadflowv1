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
    assert.doesNotMatch(body, /NajbliĹĽsza|PowĂłd|OtwĂłrz|sprawÄ™|notatkÄ™|wysĹ‚ana|dziaĹ‚aĹ„|wdroĹĽeniu/);
  }
});
