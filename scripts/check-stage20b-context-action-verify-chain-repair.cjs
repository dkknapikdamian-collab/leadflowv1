const fs = require('fs');
const path = require('path');
const root = process.cwd();
const STAGE = 'STAGE20B_CONTEXT_ACTION_VERIFY_CHAIN_REPAIR_V1';
function pass(message){ console.log('PASS ' + message); }
function fail(message){ console.error('FAIL ' + message); process.exitCode = 1; }
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel){ return fs.existsSync(path.join(root, rel)); }
const pkgBuffer = fs.readFileSync(path.join(root, 'package.json'));
if (pkgBuffer[0] === 0xef && pkgBuffer[1] === 0xbb && pkgBuffer[2] === 0xbf) fail('package.json has UTF-8 BOM'); else pass('package.json has no UTF-8 BOM');
const pkg = JSON.parse(pkgBuffer.toString('utf8'));
pass('package.json parses with JSON.parse');
const scripts = pkg.scripts || {};
if (scripts['verify:stage14-action-route-parity']) pass('package.json exposes verify:stage14-action-route-parity'); else fail('package.json missing verify:stage14-action-route-parity');
if (String(scripts['verify:stage15-context-action-contract'] || '').includes('verify:stage14-action-route-parity')) pass('Stage15 verify chain includes verify:stage14-action-route-parity'); else fail('Stage15 verify chain missing verify:stage14-action-route-parity');
if (scripts['check:stage20b-context-action-verify-chain-repair-v1']) pass('package.json exposes Stage20B check script'); else fail('package.json missing Stage20B check script');
if (scripts['test:stage20b-context-action-verify-chain-repair-v1']) pass('package.json exposes Stage20B test script'); else fail('package.json missing Stage20B test script');
if (exists('docs/release/STAGE20B_CONTEXT_ACTION_VERIFY_CHAIN_REPAIR_V1_2026-05-06.md')) pass('Stage20B release doc exists'); else fail('Stage20B release doc missing');
const doc = read('docs/release/STAGE20B_CONTEXT_ACTION_VERIFY_CHAIN_REPAIR_V1_2026-05-06.md');
if (doc.includes(STAGE)) pass('Stage20B release doc contains marker'); else fail('Stage20B release doc missing marker');
if (doc.includes('verify:stage14-action-route-parity')) pass('Stage20B release doc documents alias'); else fail('Stage20B release doc missing alias');
if (process.exitCode) process.exit(process.exitCode);
console.log('PASS ' + STAGE);
