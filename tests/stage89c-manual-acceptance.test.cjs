const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');

test('Stage89C records manual acceptance where future agents will see it', () => {
  const rootDoc = read('00_READ_FIRST_STAGE89_ACCEPTED_ADMIN_DEBUG_AND_LEAD_DETAIL.md');
  assert.ok(rootDoc.includes('ACCEPTED_MANUAL_BY_USER'));
  assert.ok(rootDoc.includes('Admin Debug Toolbar'));
  assert.ok(rootDoc.includes('LeadDetail right rail'));
  assert.ok(rootDoc.includes('Nie wracaj do kolejnego \u0142atania'));
});

test('Stage89C release doc lists accepted stages and guard status', () => {
  const releaseDoc = read('docs/release/STAGE89C_MANUAL_ACCEPTANCE_LEDGER_2026-05-05.md');
  assert.ok(releaseDoc.includes('Stage87G'));
  assert.ok(releaseDoc.includes('Stage88'));
  assert.ok(releaseDoc.includes('Stage89'));
  assert.ok(releaseDoc.includes('Stage89B'));
  assert.ok(releaseDoc.includes('verify:admin-tools'));
});
