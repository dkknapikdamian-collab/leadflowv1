const assert = require('assert');
const fs = require('fs');
const path = require('path');
const test = require('node:test');

const marker = 'STAGE65_CASE_OPERATIONAL_VERIFY_INCLUDES_STAGE64';
const repoRoot = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function parsePackage() {
  const raw = read('package.json');
  assert.notStrictEqual(raw.charCodeAt(0), 0xfeff, 'package.json must not start with BOM');
  assert.ok(!raw.includes('\\u0026'), 'package.json must not contain escaped ampersands');
  return JSON.parse(raw);
}

test(`${marker}: case operational verify runs Stage64 exactly once`, () => {
  const pkg = parsePackage();
  const verifyCase = pkg.scripts['verify:case-operational-ui'];
  assert.ok(verifyCase, 'verify:case-operational-ui script is missing');
  const needle = 'check:stage64-case-detail-work-item-dedupe';
  assert.strictEqual(verifyCase.split(needle).length - 1, 1, 'Stage64 guard should be included exactly once');
  assert.ok(verifyCase.includes(`npm.cmd run ${needle}`), 'Stage64 guard should be executed through npm.cmd run');
  assert.ok(
    verifyCase.lastIndexOf(needle) > verifyCase.lastIndexOf('verify:ui-contrast'),
    'Stage64 should be appended after verify:ui-contrast to avoid breaking old exact-string guards',
  );
});

test(`${marker}: Stage65 guard and docs are wired`, () => {
  const pkg = parsePackage();
  assert.strictEqual(
    pkg.scripts['check:stage65-case-operational-verify-includes-stage64'],
    'node scripts/check-stage65-case-operational-verify-includes-stage64.cjs',
  );
  assert.strictEqual(
    pkg.scripts['test:stage65-case-operational-verify-includes-stage64'],
    'node --test tests/stage65-case-operational-verify-includes-stage64.test.cjs',
  );
  assert.ok(fs.existsSync(path.join(repoRoot, 'scripts/check-stage65-case-operational-verify-includes-stage64.cjs')));
  assert.ok(fs.existsSync(path.join(repoRoot, 'docs/release/STAGE65_CASE_OPERATIONAL_VERIFY_INCLUDES_STAGE64_2026-05-04.md')));
  assert.ok(read('docs/release/STAGE65_CASE_OPERATIONAL_VERIFY_INCLUDES_STAGE64_2026-05-04.md').includes(marker));
});
