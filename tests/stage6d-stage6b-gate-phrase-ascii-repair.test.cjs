const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const STAGE = 'STAGE6D_STAGE6B_GATE_PHRASE_ASCII_REPAIR_V1';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
}

test('Stage6B exact fatal gate phrase is present', () => {
  const doc = read('docs/release/STAGE6B_STAGE6_DOC_AND_GATE_REPAIR_V1_2026-05-06.md');
  assert.match(doc, /buildem, commitem i pushem/);
  assert.match(doc, /FAIL w checku blokuje commit\/push/);
  assert.match(doc, new RegExp(STAGE));
});

test('Stage6D scripts are registered and package.json stays valid JSON without BOM', () => {
  const buf = fs.readFileSync(path.join(root, 'package.json'));
  assert.notDeepEqual(Array.from(buf.slice(0, 3)), [0xef, 0xbb, 0xbf]);
  const pkg = JSON.parse(buf.toString('utf8').replace(/^\uFEFF/, ''));
  assert.equal(pkg.scripts['check:stage6d-stage6b-gate-phrase-ascii-repair-v1'], 'node scripts/check-stage6d-stage6b-gate-phrase-ascii-repair.cjs');
  assert.equal(pkg.scripts['test:stage6d-stage6b-gate-phrase-ascii-repair-v1'], 'node --test tests/stage6d-stage6b-gate-phrase-ascii-repair.test.cjs');
});

test('Stage6D release doc documents PowerShell parse-safe repair', () => {
  const doc = read('docs/release/STAGE6D_STAGE6B_GATE_PHRASE_ASCII_REPAIR_V1_2026-05-06.md');
  assert.match(doc, new RegExp(STAGE));
  assert.match(doc, /PowerShell ASCII-safe/);
  assert.match(doc, /No Markdown inside PowerShell code/);
});
