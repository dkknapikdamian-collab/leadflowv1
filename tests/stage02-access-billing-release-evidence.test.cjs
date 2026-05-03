const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('Stage02 access/billing release evidence is present and wired', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const evidencePath = path.join(root, 'docs', 'release', 'STAGE02_ACCESS_BILLING_EVIDENCE_2026-05-03.md');
  const archPath = path.join(root, 'docs', 'architecture', 'CASE_DETAIL_WRITE_ACCESS_GATE_STAGE02B.md');

  assert.equal(pkg.scripts['audit:stage02-access-release-evidence'], 'node scripts/print-stage02-access-release-evidence.cjs');
  assert.equal(pkg.scripts['check:stage02-access-billing-release-evidence'], 'node tests/stage02-access-billing-release-evidence.test.cjs');
  assert.ok(pkg.scripts['check:access-billing-source-of-truth-stage02a']);
  assert.ok(pkg.scripts['check:case-detail-write-access-gate-stage02b']);
  assert.ok(pkg.scripts['check:repo-backup-hygiene']);

  assert.ok(quiet.includes('tests/stage02-access-billing-release-evidence.test.cjs'));
  assert.ok(fs.existsSync(evidencePath), 'missing Stage02 evidence doc');
  assert.ok(fs.existsSync(archPath), 'missing Stage02B architecture doc');

  const evidence = fs.readFileSync(evidencePath, 'utf8');
  assert.match(evidence, /Stage02 release evidence/);
  assert.match(evidence, /Stage02A source of truth guard/);
  assert.match(evidence, /Stage02B CaseDetail write gate/);
  assert.match(evidence, /Stage03A/);
});

test('Stage02 root preflight report stays out of repo', () => {
  const ignored = read('.gitignore');
  assert.match(ignored, /stage\*_preflight_report\.txt/);
  assert.equal(fs.existsSync(path.join(root, 'stage02b_case_detail_preflight_report.txt')), false);
});
