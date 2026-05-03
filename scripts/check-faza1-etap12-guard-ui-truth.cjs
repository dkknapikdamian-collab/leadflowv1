const fs = require('fs');
const path = require('path');

const root = process.cwd();
const problems = [];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function assert(condition, message) {
  if (!condition) problems.push(message);
}

const pkg = JSON.parse(read('package.json'));
const scripts = pkg.scripts || {};

for (const script of [
  'check:ui-truth',
  'check:public-security-claims',
  'check:integration-status-copy',
  'check:faza1-etap12-guard-ui-truth',
]) {
  assert(Boolean(scripts[script]), 'package.json missing script: ' + script);
}

for (const file of [
  'scripts/check-ui-truth-claims.cjs',
  'scripts/check-public-security-claims.cjs',
  'scripts/check-integration-status-copy.cjs',
  'scripts/check-faza1-etap12-guard-ui-truth.cjs',
  'docs/release/FAZA1_ETAP12_GUARD_UI_TRUTH_2026-05-03.md',
]) {
  assert(exists(file), 'missing Etap 1.2 file: ' + file);
}

const doc = exists('docs/release/FAZA1_ETAP12_GUARD_UI_TRUTH_2026-05-03.md')
  ? read('docs/release/FAZA1_ETAP12_GUARD_UI_TRUTH_2026-05-03.md')
  : '';
assert(doc.includes('FAZA 1 - Etap 1.2 - Guard UI Truth'), 'Etap 1.2 doc missing exact ASCII-safe title');
assert(doc.includes('SOC 2 certified'), 'Etap 1.2 doc must mention SOC 2 certified banned claim');
assert(doc.includes('Google Calendar connected'), 'Etap 1.2 doc must mention Google Calendar connected banned claim');
assert(doc.includes('AI saved'), 'Etap 1.2 doc must mention AI saved banned claim');

if (problems.length) {
  console.error('FAZA 1 - Etap 1.2 - Guard UI Truth failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log('PASS FAZA 1 - Etap 1.2 - Guard UI Truth');
