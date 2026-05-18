const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const stage77 = fs.readFileSync(path.join(root, 'tests/stage77-lead-detail-single-status-pill.test.cjs'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

test('Stage118B keeps Stage77 compatible with date-aware statusClass and exposes quiet alias', () => {
  assert.ok(stage77.includes('dateValue\\?: unknown'), 'Stage77 must accept the Stage115D date-aware statusClass signature.');
  assert.ok(stage77.includes('statusClass'), 'Stage77 must still check statusClass.');
  assert.equal(pkg.scripts['verify:closeflow:quiet'], 'node scripts/closeflow-release-check-quiet.cjs');
});
