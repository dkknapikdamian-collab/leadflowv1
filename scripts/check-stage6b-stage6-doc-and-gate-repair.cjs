const fs = require('fs');
const path = require('path');

const root = process.cwd();
const STAGE = 'STAGE6B_STAGE6_DOC_AND_GATE_REPAIR_V1';
let failed = false;

function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { console.error(`FAIL ${message}`); failed = true; }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, ''); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function mustContain(rel, needle) {
  const text = read(rel);
  if (text.includes(needle)) pass(`${rel} contains ${needle}`);
  else fail(`${rel} missing ${needle}`);
}

const pkgBuf = fs.readFileSync(path.join(root, 'package.json'));
if (pkgBuf[0] === 0xef && pkgBuf[1] === 0xbb && pkgBuf[2] === 0xbf) fail('package.json has UTF-8 BOM');
else pass('package.json has no UTF-8 BOM');

let pkg = null;
try {
  pkg = JSON.parse(pkgBuf.toString('utf8').replace(/^\uFEFF/, ''));
  pass('package.json parses with JSON.parse');
} catch (error) {
  fail(`package.json does not parse: ${error.message}`);
}

if (pkg && pkg.scripts && pkg.scripts['check:stage6b-stage6-doc-and-gate-repair-v1']) pass('package.json exposes Stage6B check script');
else fail('package.json missing Stage6B check script');
if (pkg && pkg.scripts && pkg.scripts['test:stage6b-stage6-doc-and-gate-repair-v1']) pass('package.json exposes Stage6B test script');
else fail('package.json missing Stage6B test script');

if (exists('scripts/check-stage6-ai-no-hallucination-data-truth.cjs')) pass('Stage6 original check script exists');
else fail('Stage6 original check script missing');
if (exists('tests/stage6-ai-no-hallucination-data-truth.test.cjs')) pass('Stage6 original test script exists');
else fail('Stage6 original test script missing');

mustContain('docs/release/STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1_2026-05-06.md', 'Nie odpowiada z pustego prompta');
mustContain('docs/release/STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1_2026-05-06.md', 'Nie zmyśla przy pustym kontekście');
mustContain('docs/release/STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1_2026-05-06.md', STAGE);
mustContain('docs/release/STAGE6B_STAGE6_DOC_AND_GATE_REPAIR_V1_2026-05-06.md', STAGE);
mustContain('docs/release/STAGE6B_STAGE6_DOC_AND_GATE_REPAIR_V1_2026-05-06.md', 'FAIL w checku blokuje commit/push');
mustContain('docs/release/STAGE6B_STAGE6_DOC_AND_GATE_REPAIR_V1_2026-05-06.md', 'buildem, commitem i pushem');

if (failed) process.exit(1);
console.log(`PASS ${STAGE}`);
