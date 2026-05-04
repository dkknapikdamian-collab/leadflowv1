const fs = require('fs');
const path = require('path');

const marker = 'STAGE65_CASE_OPERATIONAL_VERIFY_INCLUDES_STAGE64';
const repoRoot = process.cwd();
const packagePath = path.join(repoRoot, 'package.json');

function fail(message) {
  console.error(`FAIL ${marker}: ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function readUtf8(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) fail(`missing ${relativePath}`);
  return fs.readFileSync(fullPath, 'utf8');
}

function countOccurrences(value, needle) {
  return value.split(needle).length - 1;
}

if (!fs.existsSync(packagePath)) fail('missing package.json');
const packageRaw = fs.readFileSync(packagePath, 'utf8');
if (packageRaw.charCodeAt(0) === 0xfeff) fail('package.json starts with UTF-8 BOM');
if (packageRaw.includes('\\u0026')) fail('package.json contains escaped ampersand operators');

let pkg;
try {
  pkg = JSON.parse(packageRaw);
} catch (error) {
  fail(`package.json is not valid JSON: ${error.message}`);
}

const scripts = pkg.scripts || {};
const verifyCase = String(scripts['verify:case-operational-ui'] || '');
const stage64Check = 'check:stage64-case-detail-work-item-dedupe';
const stage65Check = 'check:stage65-case-operational-verify-includes-stage64';
const stage65Test = 'test:stage65-case-operational-verify-includes-stage64';

if (!verifyCase) fail('missing package script verify:case-operational-ui');
if (!scripts[stage64Check]) fail(`missing package script ${stage64Check}`);
if (!scripts['test:stage64-case-detail-work-item-dedupe']) fail('missing package script test:stage64-case-detail-work-item-dedupe');
if (!scripts[stage65Check]) fail(`missing package script ${stage65Check}`);
if (!scripts[stage65Test]) fail(`missing package script ${stage65Test}`);
pass('package.json contains Stage64 and Stage65 scripts');

if (!verifyCase.includes(`npm.cmd run ${stage64Check}`)) fail('verify:case-operational-ui does not run Stage64 guard');
if (countOccurrences(verifyCase, stage64Check) !== 1) fail('verify:case-operational-ui runs Stage64 guard more than once');
const contrastIndex = verifyCase.lastIndexOf('verify:ui-contrast');
const stage64Index = verifyCase.lastIndexOf(stage64Check);
if (contrastIndex === -1) fail('verify:case-operational-ui does not contain verify:ui-contrast anchor');
if (stage64Index <= contrastIndex) fail('Stage64 guard must be appended after existing verify:ui-contrast to preserve older exact-string guards');
pass('verify:case-operational-ui includes Stage64 guard after existing chain');

const requiredFiles = [
  'scripts/check-stage64-case-detail-work-item-dedupe.cjs',
  'tests/stage64-case-detail-work-item-dedupe.test.cjs',
  'scripts/check-stage65-case-operational-verify-includes-stage64.cjs',
  'tests/stage65-case-operational-verify-includes-stage64.test.cjs',
  'docs/release/STAGE65_CASE_OPERATIONAL_VERIFY_INCLUDES_STAGE64_2026-05-04.md',
];
for (const file of requiredFiles) {
  readUtf8(file);
  pass(`${file} exists`);
}

const caseDetail = readUtf8('src/pages/CaseDetail.tsx');
for (const fragment of [
  'STAGE64_CASE_DETAIL_WORK_ITEM_DEDUPE',
  'function dedupeCaseTasks(',
  'function dedupeCaseEvents(',
  'function dedupeCaseWorkItems(',
]) {
  if (!caseDetail.includes(fragment)) fail(`CaseDetail.tsx missing Stage64 fragment: ${fragment}`);
}
pass('CaseDetail.tsx still contains Stage64 dedupe implementation');

const doc = readUtf8('docs/release/STAGE65_CASE_OPERATIONAL_VERIFY_INCLUDES_STAGE64_2026-05-04.md');
if (!doc.includes(marker)) fail('release doc missing Stage65 marker');
if (!doc.includes('verify:case-operational-ui')) fail('release doc missing verify script description');
pass('Stage65 release doc contains marker and verification scope');

console.log(`PASS ${marker}`);