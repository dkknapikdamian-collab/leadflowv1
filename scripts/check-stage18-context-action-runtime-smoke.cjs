const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const root = process.cwd();
const STAGE = 'STAGE18_CONTEXT_ACTION_RUNTIME_SMOKE_V1';
function pass(message){ console.log('PASS ' + message); }
function fail(message){ console.error('FAIL ' + message); process.exitCode = 1; }
function exists(rel){ return fs.existsSync(path.join(root, rel)); }
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8'); }
function requireContains(rel, needle){ if(!exists(rel)) return fail(rel + ' missing'); const text=read(rel); if(text.includes(needle)) pass(rel + ' contains ' + needle); else fail(rel + ' missing ' + needle); }
function requireScript(pkg,key,expected){ if(pkg.scripts && pkg.scripts[key] === expected) pass('package.json script ' + key + ' registered'); else fail('package.json script ' + key + ' missing or different'); }
const buffer = fs.readFileSync(path.join(root,'package.json'));
if(buffer[0]===0xef && buffer[1]===0xbb && buffer[2]===0xbf) fail('package.json has UTF-8 BOM'); else pass('package.json has no UTF-8 BOM');
const pkg = JSON.parse(buffer.toString('utf8'));
pass('package.json parses with JSON.parse');
requireScript(pkg,'audit:stage18-context-action-runtime-smoke','node scripts/smoke-stage18-context-action-runtime-contract.cjs');
requireScript(pkg,'check:stage18-context-action-runtime-smoke-v1','node scripts/check-stage18-context-action-runtime-smoke.cjs');
requireScript(pkg,'test:stage18-context-action-runtime-smoke-v1','node --test tests/stage18-context-action-runtime-smoke.test.cjs');
requireScript(pkg,'verify:stage18-context-action-runtime-smoke','npm.cmd run verify:stage17-context-action-contract-registry && npm.cmd run audit:stage18-context-action-runtime-smoke && npm.cmd run check:stage18-context-action-runtime-smoke-v1 && npm.cmd run test:stage18-context-action-runtime-smoke-v1');
for (const rel of [
 'scripts/smoke-stage18-context-action-runtime-contract.cjs',
 'scripts/check-stage18-context-action-runtime-smoke.cjs',
 'tests/stage18-context-action-runtime-smoke.test.cjs',
 'docs/release/STAGE18_CONTEXT_ACTION_RUNTIME_SMOKE_V1_2026-05-06.md',
 'src/lib/context-action-contract.ts',
 'src/components/ContextActionDialogs.tsx'
]) { if(exists(rel)) pass(rel + ' exists'); else fail(rel + ' missing'); }
requireContains('src/lib/context-action-contract.ts','STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY_V1');
requireContains('src/components/ContextActionDialogs.tsx','data-context-action-kind');
requireContains('src/components/ContextActionDialogs.tsx','buildContextFromExplicitClick');
requireContains('src/components/ContextActionDialogs.tsx','TaskCreateDialog');
requireContains('src/components/ContextActionDialogs.tsx','EventCreateDialog');
requireContains('src/components/ContextActionDialogs.tsx','ContextNoteDialog');
requireContains('docs/release/STAGE18_CONTEXT_ACTION_RUNTIME_SMOKE_V1_2026-05-06.md',STAGE);
try {
  childProcess.execFileSync(process.execPath, ['scripts/smoke-stage18-context-action-runtime-contract.cjs'], { cwd: root, stdio: 'inherit' });
  pass('Stage18 runtime smoke script passes');
} catch (error) {
  fail('Stage18 runtime smoke script failed');
}
if(process.exitCode) process.exit(process.exitCode);
console.log('PASS ' + STAGE);
