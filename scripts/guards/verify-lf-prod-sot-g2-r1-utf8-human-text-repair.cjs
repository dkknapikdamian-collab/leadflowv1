const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
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

const files = {
  g2Report: path.join(root, '_project', 'runs', 'LF-PROD-SOT-G2_LISTS_CARDS_STATUS_DATE_SOT_MAP_AND_CONTRACT.md'),
  r1Report: path.join(root, '_project', 'runs', 'LF-PROD-SOT-G2-R1_UTF8_HUMAN_TEXT_REPAIR_AND_GUARD.md'),
  g2Map: path.join(mapBase, 'LF-PROD-SOT-G2_LISTS_CARDS_STATUS_DATE_SOT_MAP_AND_CONTRACT_MAP.md'),
  r1Note: path.join(mapBase, 'LF-PROD-SOT-G2-R1_UTF8_HUMAN_TEXT_REPAIR_AND_GUARD.md'),
  router: path.join(mapBase, '00_MAPY_I_ZALEZNOSCI_SOT.md'),
};

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

function read(file) {
  assert.equal(fs.existsSync(file), true, `missing file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function must(text, token, label) {
  assert.equal(text.includes(token), true, `${label}: missing ${token}`);
}

function mustNotMojibake(text, label) {
  for (const token of forbiddenMojibake) {
    assert.equal(text.includes(token), false, `${label}: mojibake token detected`);
  }
}

function dirtyPaths() {
  return execFileSync(
    'git',
    ['status', '--porcelain=v1', '--untracked-files=all'],
    { cwd: root, encoding: 'utf8' },
  )
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      let value = line.slice(3).trim();
      const arrow = value.lastIndexOf(' -> ');
      if (arrow >= 0) value = value.slice(arrow + 4);
      if (value.startsWith('"') && value.endsWith('"')) {
        try { value = JSON.parse(value); } catch {}
      }
      return value.replaceAll('\\', '/');
    });
}

assert.equal(
  execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim(),
  'dev-rollout-freeze',
  'STOP_BRANCH_MISMATCH',
);

const pkg = JSON.parse(read(path.join(root, 'package.json')));
assert.equal(
  pkg.scripts?.['verify:lf-prod-sot-g2-r1'],
  'node scripts/guards/verify-lf-prod-sot-g2-r1-utf8-human-text-repair.cjs && node --test tests/lf-prod-sot-g2-r1-utf8-human-text-repair.test.cjs',
  'G2-R1 package alias must be exact',
);

const docs = [
  [read(files.g2Report), 'G2 report'],
  [read(files.r1Report), 'G2-R1 report'],
  [read(files.g2Map), 'G2 map'],
  [read(files.r1Note), 'G2-R1 note'],
  [read(files.router), 'SOT router'],
];

for (const [doc, label] of docs) {
  mustNotMojibake(doc, label);
}

for (const [doc, label] of [
  [read(files.r1Report), 'G2-R1 report'],
  [read(files.r1Note), 'G2-R1 note'],
]) {
  must(doc, 'STATUS: PASS_UTF8_REPAIR_AND_GUARD', label);
  must(doc, 'RUNTIME_CHANGED: NO', label);
  must(doc, 'SRC_CHANGED: NO', label);
  must(doc, 'G3_CREATED: NO', label);
  must(doc, 'NEXT_STAGE_SELECTED: LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP', label);
}

const g2Report = read(files.g2Report);
const g2Map = read(files.g2Map);
const router = read(files.router);

for (const doc of [g2Report, g2Map]) {
  must(doc, 'G2_FINAL_STATUS: PASS_MAP_AND_CONTRACT', 'G2 document');
  must(doc, 'TOTAL_CALLSITE_COUNT: 39', 'G2 document');
  must(doc, 'G2_R1_STATUS: PASS_UTF8_REPAIR_AND_GUARD', 'G2 document');
}

for (const token of [
  'G2_R1_UTF8_REPAIR: PASS_UTF8_REPAIR_AND_GUARD',
  'G2_R1_GUARD_ADDED: YES',
  'G3_BLOCKED_UNTIL_G2_R1: CLEARED',
  'LF-PROD-SOT-G2-R1_UTF8_HUMAN_TEXT_REPAIR_AND_GUARD.md',
]) {
  must(router, token, 'SOT router');
}

const allowed = new Set([
  'package.json',
  '_project/runs/LF-PROD-SOT-G2_LISTS_CARDS_STATUS_DATE_SOT_MAP_AND_CONTRACT.md',
  '_project/runs/LF-PROD-SOT-G2-R1_UTF8_HUMAN_TEXT_REPAIR_AND_GUARD.md',
  'scripts/guards/verify-lf-prod-sot-g2-r1-utf8-human-text-repair.cjs',
  'tests/lf-prod-sot-g2-r1-utf8-human-text-repair.test.cjs',
]);

for (const file of dirtyPaths()) {
  if (file.startsWith('src/')) throw new Error(`STOP_G2_R1_SRC_CHANGE: ${file}`);
  assert.equal(allowed.has(file), true, `G2-R1 forbidden app change: ${file}`);
}

assert.equal(
  fs.existsSync(path.join(root, '_project', 'runs', 'LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP.md')),
  false,
  'G3 app report must not exist',
);
assert.equal(
  fs.existsSync(path.join(mapBase, 'LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP.md')),
  false,
  'G3 Obsidian map must not exist',
);

console.log('LF-PROD-SOT-G2-R1 UTF8 HUMAN TEXT REPAIR: PASS');
