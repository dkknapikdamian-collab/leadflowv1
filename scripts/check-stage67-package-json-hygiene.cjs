const fs = require('fs');
const path = require('path');

const marker = 'STAGE67_PACKAGE_JSON_HYGIENE';
const repoRoot = process.cwd();
const packagePath = path.join(repoRoot, 'package.json');
const releaseDocPath = path.join(repoRoot, 'docs', 'release', 'STAGE67_PACKAGE_JSON_HYGIENE_2026-05-04.md');

function fail(message) {
  console.error(`FAIL ${marker}: ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function countIncludes(value, needle) {
  return String(value || '').split(needle).length - 1;
}

if (!fs.existsSync(packagePath)) fail('missing package.json');
const raw = fs.readFileSync(packagePath, 'utf8');

if (raw.charCodeAt(0) === 0xfeff) fail('package.json starts with UTF-8 BOM');
pass('package.json has no BOM');

if (raw.includes('\\u0026')) fail('package.json contains escaped ampersand operators');
pass('package.json has plain && operators');

let pkg;
try {
  pkg = JSON.parse(raw);
} catch (error) {
  fail(`package.json is not valid JSON: ${error.message}`);
}
pass('package.json parses as JSON');

const canonical = `${JSON.stringify(pkg, null, 2)}\n`;
if (raw !== canonical) fail('package.json is not normalized to JSON.stringify(..., null, 2) + newline');
pass('package.json uses canonical 2-space JSON formatting');

const scripts = pkg.scripts || {};
if (scripts['check:stage67-package-json-hygiene'] !== 'node scripts/check-stage67-package-json-hygiene.cjs') {
  fail('missing check:stage67-package-json-hygiene script');
}
pass('package.json contains Stage67 check script');

if (scripts['test:stage67-package-json-hygiene'] !== 'node --test tests/stage67-package-json-hygiene.test.cjs') {
  fail('missing test:stage67-package-json-hygiene script');
}
pass('package.json contains Stage67 test script');

const caseVerify = String(scripts['verify:case-operational-ui'] || '');
if (!caseVerify.includes('npm.cmd run check:stage64-case-detail-work-item-dedupe')) {
  fail('verify:case-operational-ui does not include Stage64 dedupe guard');
}
pass('verify:case-operational-ui includes Stage64 dedupe guard');

if (!caseVerify.includes('npm.cmd run check:stage66-case-history-passive-copy')) {
  fail('verify:case-operational-ui does not include Stage66 history copy guard');
}
pass('verify:case-operational-ui includes Stage66 history copy guard');

if (countIncludes(caseVerify, 'check:stage64-case-detail-work-item-dedupe') !== 1) {
  fail('verify:case-operational-ui contains duplicated Stage64 guard');
}
pass('verify:case-operational-ui contains Stage64 guard once');

if (countIncludes(caseVerify, 'check:stage66-case-history-passive-copy') !== 1) {
  fail('verify:case-operational-ui contains duplicated Stage66 guard');
}
pass('verify:case-operational-ui contains Stage66 guard once');

if (!fs.existsSync(releaseDocPath)) fail('missing Stage67 release doc');
const releaseDoc = fs.readFileSync(releaseDocPath, 'utf8');
if (!releaseDoc.includes(marker)) fail('Stage67 release doc missing marker');
pass('Stage67 release doc contains marker');

console.log(`PASS ${marker}`);
