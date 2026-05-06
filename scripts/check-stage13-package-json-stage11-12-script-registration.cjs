const fs = require('fs');
const path = require('path');
const root = process.cwd();
const STAGE = 'STAGE13_PACKAGE_JSON_STAGE11_12_SCRIPT_REGISTRATION_V1';
function pass(message){ console.log('PASS ' + message); }
function fail(message){ console.error('FAIL ' + message); process.exitCode = 1; }
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel){ return fs.existsSync(path.join(root, rel)); }
function requireScript(pkg, key, expected){
  if (pkg.scripts && pkg.scripts[key] === expected) pass('package.json script ' + key + ' registered');
  else fail('package.json script ' + key + ' missing or different');
}
const buffer = fs.readFileSync(path.join(root, 'package.json'));
if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) fail('package.json has UTF-8 BOM');
else pass('package.json has no UTF-8 BOM');
const pkg = JSON.parse(buffer.toString('utf8'));
pass('package.json parses with JSON.parse');
requireScript(pkg, 'check:stage11-vercel-hobby-function-budget-guard-v1', 'node scripts/check-stage11-vercel-hobby-function-budget-guard.cjs');
requireScript(pkg, 'test:stage11-vercel-hobby-function-budget-guard-v1', 'node --test tests/stage11-vercel-hobby-function-budget-guard.test.cjs');
requireScript(pkg, 'audit:stage12-ai-assistant-vercel-release-evidence', 'node scripts/print-stage12-ai-assistant-vercel-release-evidence.cjs');
requireScript(pkg, 'test:stage12-ai-assistant-vercel-release-evidence-v1', 'node --test tests/stage12-ai-assistant-vercel-release-evidence.test.cjs');
requireScript(pkg, 'verify:stage11-stage12-ai-vercel-evidence', 'npm.cmd run check:stage11-vercel-hobby-function-budget-guard-v1 && npm.cmd run test:stage11-vercel-hobby-function-budget-guard-v1 && npm.cmd run audit:stage12-ai-assistant-vercel-release-evidence && npm.cmd run test:stage12-ai-assistant-vercel-release-evidence-v1');
for (const rel of [
  'scripts/check-stage11-vercel-hobby-function-budget-guard.cjs',
  'tests/stage11-vercel-hobby-function-budget-guard.test.cjs',
  'scripts/print-stage12-ai-assistant-vercel-release-evidence.cjs',
  'tests/stage12-ai-assistant-vercel-release-evidence.test.cjs',
]) {
  if (exists(rel)) pass(rel + ' exists'); else fail(rel + ' missing');
}
if (exists('docs/release/STAGE13_PACKAGE_JSON_STAGE11_12_SCRIPT_REGISTRATION_V1_2026-05-06.md')) pass('Stage13 release doc exists');
else fail('Stage13 release doc missing');
if (process.exitCode) process.exit(process.exitCode);
console.log('PASS ' + STAGE);
