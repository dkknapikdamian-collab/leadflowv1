const fs = require('fs');
const path = require('path');
const root = process.cwd();
const STAGE = 'STAGE20C_CONTEXT_ACTION_VERIFY_CHAIN_STAGE14_REPAIR_V1';
function pass(message) { console.log('PASS ' + message); }
function fail(message) { console.error('FAIL ' + message); process.exitCode = 1; }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
const buf = fs.readFileSync(path.join(root, 'package.json'));
if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) fail('package.json has UTF-8 BOM'); else pass('package.json has no UTF-8 BOM');
const pkg = JSON.parse(read('package.json'));
pass('package.json parses with JSON.parse');
const scripts = pkg.scripts || {};
if (scripts['verify:stage14-action-route-parity'] && scripts['verify:stage14-action-route-parity'].includes('check:stage14-context-action-route-parity-v1')) pass('verify:stage14-action-route-parity includes Stage14 check'); else fail('verify:stage14-action-route-parity missing Stage14 check');
if (scripts['verify:stage14-action-route-parity'] && scripts['verify:stage14-action-route-parity'].includes('test:stage14-context-action-route-parity-v1')) pass('verify:stage14-action-route-parity includes Stage14 test'); else fail('verify:stage14-action-route-parity missing Stage14 test');
if (scripts['verify:stage15-context-action-contract'] && scripts['verify:stage15-context-action-contract'].includes('verify:stage14-action-route-parity')) pass('verify:stage15-context-action-contract chains Stage14 alias'); else fail('verify:stage15-context-action-contract missing Stage14 alias');
if (exists('docs/release/STAGE20C_CONTEXT_ACTION_VERIFY_CHAIN_STAGE14_REPAIR_V1_2026-05-06.md')) pass('Stage20C release doc exists'); else fail('Stage20C release doc missing');
if (read('docs/release/STAGE20C_CONTEXT_ACTION_VERIFY_CHAIN_STAGE14_REPAIR_V1_2026-05-06.md').includes(STAGE)) pass('Stage20C release doc contains marker'); else fail('Stage20C release doc missing marker');
if (process.exitCode) process.exit(process.exitCode);
console.log('PASS ' + STAGE);
