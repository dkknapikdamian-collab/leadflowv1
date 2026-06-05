const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const FORBIDDEN_ENCODING_CODES = [0xfeff, 0x0139, 0x013d, 0x00c4, 0x00c5, 0x0102];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function fail(message) {
  console.error('STAGE220A36_R4_BUILD_GUARD_AND_CASE_ITEM_SCHEMA_FIX_FAIL:', message);
  process.exit(1);
}
function requireText(text, token, label) {
  if (!text.includes(token)) fail(label + ' missing token: ' + token);
}
function requireAnyText(text, tokens, label) {
  if (!tokens.some((token) => text.includes(token))) {
    fail(label + ' missing one of: ' + tokens.join(' | '));
  }
}
function forbidText(text, token, label) {
  if (text.includes(token)) fail(label + ' forbidden token still present: ' + token);
}
function assertCleanScript(rel) {
  const text = read(rel);
  if (text.charCodeAt(0) === 0xfeff) fail(rel + ' has BOM');
  for (const code of FORBIDDEN_ENCODING_CODES.slice(1)) {
    if (text.includes(String.fromCharCode(code))) fail(rel + ' has mojibake marker U+' + code.toString(16).toUpperCase());
  }
}

const a35 = read('scripts/check-stage220a35-client-commission-finance.cjs');
const a36 = read('scripts/check-stage220a36-commission-input-model-split.cjs');
const caseItems = read('api/case-items.ts');
const pkg = JSON.parse(read('package.json'));

assertCleanScript('scripts/check-stage220a35-client-commission-finance.cjs');
assertCleanScript('scripts/check-stage220a36-commission-input-model-split.cjs');
assertCleanScript('scripts/check-stage220a36r4-build-guard-and-case-item-schema-fix.cjs');
assertCleanScript('tests/stage220a36r4-build-guard-and-case-item-schema-fix.test.cjs');

requireText(a35, 'CaseFinanceEditorDialog commission percent basis', 'A35 guard flexible basis token');
requireAnyText(a36, [
  'CaseFinanceEditorDialog percent basis label',
  'CaseFinanceEditorDialog percent basis field',
], 'A36 guard flexible basis token');

forbidText(caseItems, 'approved_at: body.approvedAt', 'case-items POST payload');
forbidText(caseItems, 'approvedAt?: string | null', 'CaseItemInput schema cache unsafe field');
requireText(caseItems, 'file_name: null', 'case-items POST payload still creates file fields');
requireText(caseItems, 'updated_at: now', 'case-items POST payload still creates updated_at');

if (pkg.scripts['check:stage220a36r4-build-guard-and-case-item-schema-fix'] !== 'node scripts/check-stage220a36r4-build-guard-and-case-item-schema-fix.cjs') {
  fail('package missing check script');
}
if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage220a36r4-build-guard-and-case-item-schema-fix.cjs')) {
  fail('prebuild missing R4 guard');
}

console.log(JSON.stringify({ ok: true, stage: 'STAGE220A36_R4_BUILD_GUARD_AND_CASE_ITEM_SCHEMA_FIX', guard: 'check:stage220a36r4-build-guard-and-case-item-schema-fix' }, null, 2));
