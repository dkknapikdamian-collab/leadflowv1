const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { execFileSync } = require('node:child_process');

const root = process.cwd();
const mapBase = path.resolve(
  root,
  '..',
  '00_OBSIDIAN_VAULT',
  '10_PROJEKTY',
  'CloseFlow_Lead_App',
  '04_NAPRAWA_ZRODLA_PRAWDY',
);

const docs = [
  path.join(root, '_project', 'runs', 'LF-PROD-SOT-G2_LISTS_CARDS_STATUS_DATE_SOT_MAP_AND_CONTRACT.md'),
  path.join(root, '_project', 'runs', 'LF-PROD-SOT-G2-R1_UTF8_HUMAN_TEXT_REPAIR_AND_GUARD.md'),
  path.join(mapBase, 'LF-PROD-SOT-G2_LISTS_CARDS_STATUS_DATE_SOT_MAP_AND_CONTRACT_MAP.md'),
  path.join(mapBase, 'LF-PROD-SOT-G2-R1_UTF8_HUMAN_TEXT_REPAIR_AND_GUARD.md'),
  path.join(mapBase, '00_MAPY_I_ZALEZNOSCI_SOT.md'),
];

const forbiddenMojibake = [
  '\u00e2\u20ac\u201d',
  '\u00e2\u20ac\u2122',
  '\u0102\u0142',
  '\u0139\u201a',
  '\u0139\u203a',
  '\u0139\u013d',
  '\u00c4\u2026',
  '\u00c4\u2122',
  '\u00c4\u2021',
  '\u0139\u201e',
  '\u0139\u015b',
  '\u0139\u00bb',
  '\u00c2',
  '\u00ef\u00bb\u00bf',
  '\ufffd',
];

test('G2-R1 guard passes', () => {
  execFileSync(
    process.execPath,
    ['scripts/guards/verify-lf-prod-sot-g2-r1-utf8-human-text-repair.cjs'],
    { cwd: root, stdio: 'pipe' },
  );
});

test('G2-R1 alias is exact', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.equal(
    pkg.scripts?.['verify:lf-prod-sot-g2-r1'],
    'node scripts/guards/verify-lf-prod-sot-g2-r1-utf8-human-text-repair.cjs && node --test tests/lf-prod-sot-g2-r1-utf8-human-text-repair.test.cjs',
  );
});

test('all G2 and G2-R1 human documents are clean UTF-8 text', () => {
  for (const file of docs) {
    const text = fs.readFileSync(file, 'utf8');
    for (const token of forbiddenMojibake) {
      assert.equal(text.includes(token), false, `${path.basename(file)} contains mojibake`);
    }
  }
});

test('G2 callsite contract and no-runtime decision remain unchanged', () => {
  const report = fs.readFileSync(docs[0], 'utf8');
  const map = fs.readFileSync(docs[2], 'utf8');

  for (const doc of [report, map]) {
    assert.ok(doc.includes('G2_FINAL_STATUS: PASS_MAP_AND_CONTRACT'));
    assert.ok(doc.includes('TOTAL_CALLSITE_COUNT: 39'));
    assert.ok(doc.includes('RUNTIME_CHANGED: NO'));
    assert.ok(doc.includes('SRC_CHANGED: NO'));
    assert.ok(doc.includes('G3_CREATED: NO'));
  }
});
