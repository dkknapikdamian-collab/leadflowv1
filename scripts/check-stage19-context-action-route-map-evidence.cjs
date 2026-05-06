const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const root = process.cwd();
const STAGE = 'STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_V1';
function pass(message) { console.log('PASS ' + message); }
function fail(message) { console.error('FAIL ' + message); process.exitCode = 1; }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function requireContains(rel, needle) { if (!exists(rel)) return fail(rel + ' missing'); const text = read(rel); if (text.includes(needle)) pass(rel + ' contains ' + needle); else fail(rel + ' missing ' + needle); }
function requireScript(pkg, key, expected) { if (pkg.scripts && pkg.scripts[key] === expected) pass('package.json script ' + key + ' registered'); else fail('package.json script ' + key + ' missing or different'); }

const buffer = fs.readFileSync(path.join(root, 'package.json'));
if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) fail('package.json has UTF-8 BOM'); else pass('package.json has no UTF-8 BOM');
const pkg = JSON.parse(buffer.toString('utf8'));
pass('package.json parses with JSON.parse');
requireScript(pkg, 'audit:stage19-context-action-route-map', 'node scripts/audit-context-action-route-map.cjs');
requireScript(pkg, 'check:stage19-context-action-route-map-evidence-v1', 'node scripts/check-stage19-context-action-route-map-evidence.cjs');
requireScript(pkg, 'test:stage19-context-action-route-map-evidence-v1', 'node --test tests/stage19-context-action-route-map-evidence.test.cjs');
requireScript(pkg, 'verify:stage19-context-action-route-map', 'npm.cmd run verify:stage18-context-action-runtime-smoke && npm.cmd run audit:stage19-context-action-route-map && npm.cmd run check:stage19-context-action-route-map-evidence-v1 && npm.cmd run test:stage19-context-action-route-map-evidence-v1');

for (const rel of [
  'scripts/audit-context-action-route-map.cjs',
  'scripts/check-stage19-context-action-route-map-evidence.cjs',
  'tests/stage19-context-action-route-map-evidence.test.cjs',
  'docs/release/STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_V1_2026-05-06.md',
  'src/lib/context-action-contract.ts',
  'src/components/ContextActionDialogs.tsx',
  'src/components/TaskCreateDialog.tsx',
  'src/components/EventCreateDialog.tsx',
  'src/components/ContextNoteDialog.tsx'
]) { if (exists(rel)) pass(rel + ' exists'); else fail(rel + ' missing'); }
requireContains('docs/release/STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_V1_2026-05-06.md', STAGE);
requireContains('scripts/audit-context-action-route-map.cjs', STAGE);
requireContains('scripts/audit-context-action-route-map.cjs', 'Route map');
requireContains('scripts/audit-context-action-route-map.cjs', 'TaskCreateDialog');
requireContains('scripts/audit-context-action-route-map.cjs', 'EventCreateDialog');
requireContains('scripts/audit-context-action-route-map.cjs', 'ContextNoteDialog');
requireContains('scripts/audit-context-action-route-map.cjs', 'insertTaskToSupabase');
requireContains('scripts/audit-context-action-route-map.cjs', 'insertEventToSupabase');
requireContains('scripts/audit-context-action-route-map.cjs', 'insertActivityToSupabase');

try {
  childProcess.execFileSync(process.execPath, ['scripts/audit-context-action-route-map.cjs'], { cwd: root, stdio: 'inherit' });
  pass('Stage19 route map audit script passes');
} catch (error) {
  fail('Stage19 route map audit script failed');
}
if (process.exitCode) process.exit(process.exitCode);
console.log('PASS ' + STAGE);
