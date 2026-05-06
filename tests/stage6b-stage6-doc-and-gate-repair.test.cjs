const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const STAGE = 'STAGE6B_STAGE6_DOC_AND_GATE_REPAIR_V1';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
}

test('Stage6 release doc contains exact guard phrases required by original check', () => {
  const doc = read('docs/release/STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1_2026-05-06.md');
  assert.match(doc, /Nie odpowiada z pustego prompta/);
  assert.match(doc, /Nie zmyśla przy pustym kontekście/);
  assert.match(doc, new RegExp(STAGE));
});

test('Stage6B scripts are registered and package.json stays valid JSON without BOM', () => {
  const buf = fs.readFileSync(path.join(root, 'package.json'));
  assert.notDeepEqual(Array.from(buf.slice(0, 3)), [0xef, 0xbb, 0xbf]);
  const pkg = JSON.parse(buf.toString('utf8').replace(/^\uFEFF/, ''));
  assert.equal(pkg.scripts['check:stage6b-stage6-doc-and-gate-repair-v1'], 'node scripts/check-stage6b-stage6-doc-and-gate-repair.cjs');
  assert.equal(pkg.scripts['test:stage6b-stage6-doc-and-gate-repair-v1'], 'node --test tests/stage6b-stage6-doc-and-gate-repair.test.cjs');
});

test('Stage6B release doc documents fatal gate behavior', () => {
  const doc = read('docs/release/STAGE6B_STAGE6_DOC_AND_GATE_REPAIR_V1_2026-05-06.md');
  assert.match(doc, new RegExp(STAGE));
  assert.match(doc, /FAIL w checku blokuje commit\/push/);
  assert.match(doc, /buildem, commitem i pushem/);
});
