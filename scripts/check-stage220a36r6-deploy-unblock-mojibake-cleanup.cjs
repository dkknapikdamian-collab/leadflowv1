const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const FORBIDDEN_ENCODING_CODES = [0xfeff, 0x0139, 0x013d, 0x00c4, 0x00c5, 0x0102];

function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(message) { console.error('STAGE220A36_R6_DEPLOY_UNBLOCK_MOJIBAKE_CLEANUP_FAIL:', message); process.exit(1); }
function requireText(text, token, label) { if (!text.includes(token)) fail(label + ' missing token: ' + token); }
function forbidText(text, token, label) { if (text.includes(token)) fail(label + ' forbidden token still present: ' + token); }
function assertCleanFile(rel) {
  const text = read(rel);
  if (text.charCodeAt(0) === 0xfeff) fail(rel + ' has BOM');
  for (const code of FORBIDDEN_ENCODING_CODES.slice(1)) {
    if (text.includes(String.fromCharCode(code))) fail(rel + ' has forbidden encoding marker U+' + code.toString(16).toUpperCase());
  }
}

[
  'scripts/check-stage220a36r4-build-guard-and-case-item-schema-fix.cjs',
  'tests/stage220a36r4-build-guard-and-case-item-schema-fix.test.cjs',
  'scripts/check-stage220a36r5-r4-guard-token-compat.cjs',
  'tests/stage220a36r5-r4-guard-token-compat.test.cjs',
].forEach(assertCleanFile);

const editor = read('src/components/finance/CaseFinanceEditorDialog.tsx');
const r4 = read('scripts/check-stage220a36r4-build-guard-and-case-item-schema-fix.cjs');
const pkg = JSON.parse(read('package.json'));
const caseItems = read('api/case-items.ts');

const modeIdx = editor.indexOf('cf-finance-field--commission-mode');
const rateIdx = editor.indexOf('cf-finance-field--commission-rate');
const amountIdx = editor.indexOf('cf-finance-field--commission-amount');
const basisIdx = editor.indexOf('cf-finance-field--basis');
if (!(modeIdx >= 0 && rateIdx > modeIdx && amountIdx > rateIdx && basisIdx > amountIdx)) {
  fail('commission modal field order is not mode -> rate -> amount -> basis');
}

requireText(editor, 'Podstawa procentu (wartość transakcji/zlecenia)', 'commission basis UI label');
requireText(editor, 'disabled={!isPercentCommission}', 'basis disabled unless percent');
requireText(editor, 'disabled={!isFixedCommission}', 'commission amount disabled unless fixed');
requireText(r4, 'FORBIDDEN_ENCODING_CODES', 'R4 guard encoding codepoint check');
forbidText(r4, 'Prowizja nale', 'R4 guard brittle Polish token check');
forbidText(caseItems, 'approved_at: body.approvedAt', 'case-items approved_at POST payload');

if (pkg.scripts['check:stage220a36r6-deploy-unblock-mojibake-cleanup'] !== 'node scripts/check-stage220a36r6-deploy-unblock-mojibake-cleanup.cjs') {
  fail('package missing R6 check script');
}
if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage220a36r6-deploy-unblock-mojibake-cleanup.cjs')) {
  fail('prebuild missing R6 guard');
}

console.log(JSON.stringify({ ok: true, stage: 'STAGE220A36_R6_DEPLOY_UNBLOCK_MOJIBAKE_CLEANUP', guard: 'check:stage220a36r6-deploy-unblock-mojibake-cleanup' }, null, 2));
