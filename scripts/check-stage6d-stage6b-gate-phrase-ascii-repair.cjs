const fs = require('fs');
const path = require('path');

const root = process.cwd();
const STAGE = 'STAGE6D_STAGE6B_GATE_PHRASE_ASCII_REPAIR_V1';
let failed = false;

function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { console.error(`FAIL ${message}`); failed = true; }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, ''); }
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

if (pkg?.scripts?.['check:stage6d-stage6b-gate-phrase-ascii-repair-v1']) pass('package.json exposes Stage6D check script');
else fail('package.json missing Stage6D check script');
if (pkg?.scripts?.['test:stage6d-stage6b-gate-phrase-ascii-repair-v1']) pass('package.json exposes Stage6D test script');
else fail('package.json missing Stage6D test script');

mustContain('docs/release/STAGE6B_STAGE6_DOC_AND_GATE_REPAIR_V1_2026-05-06.md', 'buildem, commitem i pushem');
mustContain('docs/release/STAGE6B_STAGE6_DOC_AND_GATE_REPAIR_V1_2026-05-06.md', 'FAIL w checku blokuje commit/push');
mustContain('docs/release/STAGE6B_STAGE6_DOC_AND_GATE_REPAIR_V1_2026-05-06.md', STAGE);
mustContain('docs/release/STAGE6D_STAGE6B_GATE_PHRASE_ASCII_REPAIR_V1_2026-05-06.md', STAGE);
mustContain('docs/release/STAGE6D_STAGE6B_GATE_PHRASE_ASCII_REPAIR_V1_2026-05-06.md', 'PowerShell ASCII-safe');
mustContain('docs/release/STAGE6D_STAGE6B_GATE_PHRASE_ASCII_REPAIR_V1_2026-05-06.md', 'No Markdown inside PowerShell code');

if (failed) process.exit(1);
console.log(`PASS ${STAGE}`);
