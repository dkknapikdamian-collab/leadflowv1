const assert = require('assert');
const fs = require('fs');
const path = require('path');
const test = require('node:test');

const marker = 'STAGE67_PACKAGE_JSON_HYGIENE';
const repoRoot = process.cwd();
const packagePath = path.join(repoRoot, 'package.json');

function readPackage() {
  const raw = fs.readFileSync(packagePath, 'utf8');
  return { raw, pkg: JSON.parse(raw) };
}

test(`${marker}: package.json has stable machine-safe formatting`, () => {
  const { raw, pkg } = readPackage();
  assert.notStrictEqual(raw.charCodeAt(0), 0xfeff, 'package.json must not start with BOM');
  assert.ok(!raw.includes('\\u0026'), 'package.json must not contain escaped ampersands');
  assert.strictEqual(raw, `${JSON.stringify(pkg, null, 2)}\n`, 'package.json must be canonical 2-space JSON');
});

test(`${marker}: case operational verify keeps case dedupe and history copy guards`, () => {
  const { pkg } = readPackage();
  const verify = String(pkg.scripts?.['verify:case-operational-ui'] || '');
  assert.ok(verify.includes('npm.cmd run check:stage64-case-detail-work-item-dedupe'));
  assert.ok(verify.includes('npm.cmd run check:stage66-case-history-passive-copy'));
  assert.strictEqual(verify.split('check:stage64-case-detail-work-item-dedupe').length - 1, 1);
  assert.strictEqual(verify.split('check:stage66-case-history-passive-copy').length - 1, 1);
});

test(`${marker}: Stage67 scripts are registered`, () => {
  const { pkg } = readPackage();
  assert.strictEqual(pkg.scripts?.['check:stage67-package-json-hygiene'], 'node scripts/check-stage67-package-json-hygiene.cjs');
  assert.strictEqual(pkg.scripts?.['test:stage67-package-json-hygiene'], 'node --test tests/stage67-package-json-hygiene.test.cjs');
});
