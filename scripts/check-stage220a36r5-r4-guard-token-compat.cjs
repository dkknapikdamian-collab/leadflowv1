const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(message) { console.error('STAGE220A36_R5_R4_GUARD_TOKEN_COMPAT_FAIL:', message); process.exit(1); }
function requireText(text, token, label) { if (!text.includes(token)) fail(label + ' missing token: ' + token); }
function forbidText(text, token, label) { if (text.includes(token)) fail(label + ' forbidden token still present: ' + token); }

const r4 = read('scripts/check-stage220a36r4-build-guard-and-case-item-schema-fix.cjs');
const a36 = read('scripts/check-stage220a36-commission-input-model-split.cjs');
const pkg = JSON.parse(read('package.json'));

requireText(r4, 'function requireAnyText', 'R4 guard flexible helper');
requireText(r4, "'CaseFinanceEditorDialog percent basis label'", 'R4 accepts current A36 basis label token');
requireText(r4, "'CaseFinanceEditorDialog percent basis field'", 'R4 accepts historical A36 basis field token');
forbidText(r4, "requireText(a36, 'CaseFinanceEditorDialog percent basis field'", 'R4 old rigid field-only check');
requireText(a36, 'CaseFinanceEditorDialog percent basis label', 'current A36 basis label token');
if (pkg.scripts['check:stage220a36r5-r4-guard-token-compat'] !== 'node scripts/check-stage220a36r5-r4-guard-token-compat.cjs') {
  fail('package missing R5 guard script');
}
if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage220a36r5-r4-guard-token-compat.cjs')) {
  fail('prebuild missing R5 guard');
}

console.log(JSON.stringify({ ok: true, stage: 'STAGE220A36_R5_R4_GUARD_TOKEN_COMPAT', guard: 'check:stage220a36r5-r4-guard-token-compat' }, null, 2));
