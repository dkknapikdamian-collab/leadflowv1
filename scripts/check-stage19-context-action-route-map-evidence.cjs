const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const root = process.cwd();
const STAGE = 'STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_V1';
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
requireScript(pkg,'audit:stage19-context-action-route-map-evidence','node scripts/audit-stage19-context-action-route-map-evidence.cjs');
requireScript(pkg,'check:stage19-context-action-route-map-evidence-v1','node scripts/check-stage19-context-action-route-map-evidence.cjs');
requireScript(pkg,'test:stage19-context-action-route-map-evidence-v1','node --test tests/stage19-context-action-route-map-evidence.test.cjs');
requireScript(pkg,'verify:stage19-context-action-route-map-evidence','npm.cmd run audit:stage19-context-action-route-map-evidence && npm.cmd run check:stage19-context-action-route-map-evidence-v1 && npm.cmd run test:stage19-context-action-route-map-evidence-v1');
for (const rel of [
 'scripts/audit-stage19-context-action-route-map-evidence.cjs',
 'scripts/check-stage19-context-action-route-map-evidence.cjs',
 'tests/stage19-context-action-route-map-evidence.test.cjs',
 'docs/release/STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_V1_2026-05-06.md',
 'docs/release/STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_LATEST.md',
 'src/lib/context-action-contract.ts',
 'src/components/ContextActionDialogs.tsx',
 'src/pages/LeadDetail.tsx',
 'src/pages/ClientDetail.tsx',
 'src/pages/CaseDetail.tsx'
]) { if(exists(rel)) pass(rel + ' exists'); else fail(rel + ' missing'); }
requireContains('scripts/audit-stage19-context-action-route-map-evidence.cjs', STAGE);
requireContains('docs/release/STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_V1_2026-05-06.md', STAGE);
requireContains('docs/release/STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_V1_2026-05-06.md', 'Mapa routingu akcji');
try {
  childProcess.execFileSync(process.execPath, ['scripts/audit-stage19-context-action-route-map-evidence.cjs'], { cwd: root, stdio: 'inherit' });
  pass('Stage19 route map evidence audit passes');
} catch (error) {
  fail('Stage19 route map evidence audit failed');
}
if(process.exitCode) process.exit(process.exitCode);
console.log('PASS ' + STAGE);
