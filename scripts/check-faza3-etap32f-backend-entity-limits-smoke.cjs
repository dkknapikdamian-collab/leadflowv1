#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const results = [];

function readRequired(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) {
    results.push({ level: 'FAIL', scope: relativePath, message: 'Missing file' });
    return '';
  }
  return fs.readFileSync(full, 'utf8').replace(/^\uFEFF/, '');
}
function pass(scope, message) { results.push({ level: 'PASS', scope, message }); }
function fail(scope, message) { results.push({ level: 'FAIL', scope, message }); }
function assertIncludes(scope, content, needle, message) {
  if (content.includes(needle)) pass(scope, message || 'Found: ' + needle);
  else fail(scope, (message || 'Missing: ' + needle) + ' [needle=' + JSON.stringify(needle) + ']');
}
function assertRegex(scope, content, regex, message) {
  if (regex.test(content)) pass(scope, message || 'Matched: ' + regex);
  else fail(scope, (message || 'Missing pattern: ' + regex) + ' [regex=' + regex + ']');
}
function section(title) { console.log('\n== ' + title + ' =='); }

const files = {
  gate: 'src/server/_access-gate.ts',
  leads: 'api/leads.ts',
  workItems: 'api/work-items.ts',
  aiDrafts: 'src/server/ai-drafts.ts',
  releaseDoc: 'docs/release/FAZA3_ETAP32F_BACKEND_ENTITY_LIMITS_SMOKE_2026-05-03.md',
  technicalDoc: 'docs/technical/BACKEND_ENTITY_LIMITS_SMOKE_STAGE32F_2026-05-03.md',
  pkg: 'package.json',
  quiet: 'scripts/closeflow-release-check-quiet.cjs',
};

const gate = readRequired(files.gate);
const leads = readRequired(files.leads);
const workItems = readRequired(files.workItems);
const aiDrafts = readRequired(files.aiDrafts);
const releaseDoc = readRequired(files.releaseDoc);
const technicalDoc = readRequired(files.technicalDoc);
const pkgRaw = readRequired(files.pkg);
const quiet = readRequired(files.quiet);

section('Access gate auto-count contract');
assertIncludes(files.gate, gate, "from '../lib/plans.js'", 'Access gate imports plan module');
assertIncludes(files.gate, gate, 'getPlanLimits', 'Access gate references canonical plan limits');
assertIncludes(files.gate, gate, 'normalizePlanId', 'Access gate references canonical plan normalizer');
assertIncludes(files.gate, gate, 'PLAN_IDS', 'Access gate references canonical plan ids');
assertIncludes(files.gate, gate, 'type WorkspaceEntityLimitKey = keyof typeof FREE_LIMITS', 'Entity limit key type exists');
assertIncludes(files.gate, gate, 'function getWorkspaceEntityLimitQueries', 'Entity limit query builder exists');
assertIncludes(files.gate, gate, 'async function countWorkspaceEntitiesForLimit', 'Entity auto count helper exists');
assertIncludes(files.gate, gate, 'PLAN_IDS.free', 'Only Free is quantity-limited marker exists');
assertIncludes(files.gate, gate, 'getPlanLimits(readPlanId(workspace), status)', 'Canonical plan limits are used');
assertIncludes(files.gate, gate, 'selectFirstAvailable(queries)', 'Auto count reads from Supabase');
assertIncludes(files.gate, gate, 'WORKSPACE_ENTITY_LIMIT_REACHED', 'Stable limit error remains');
assertIncludes(files.gate, gate, 'activeLeads', 'Lead limit key present');
assertIncludes(files.gate, gate, 'activeTasks', 'Task limit key present');
assertIncludes(files.gate, gate, 'activeEvents', 'Event limit key present');
assertIncludes(files.gate, gate, 'activeDrafts', 'Draft limit key present');
assertIncludes(files.gate, gate, 'leads?select=id', 'Lead count query present');
assertIncludes(files.gate, gate, 'work_items?select=id', 'Work item count query present');
assertIncludes(files.gate, gate, 'ai_drafts?select=id', 'AI draft count query present');

section('API create path wiring');
assertRegex(files.leads, leads, /assertWorkspaceEntityLimit\(\s*workspaceId\s*,\s*['"]lead['"]\s*\)/, 'Lead create checks entity limit');
assertRegex(files.workItems, workItems, /assertWorkspaceEntityLimit\(\s*finalWorkspaceId\s*,\s*kind === ['"]events['"] \? ['"]event['"] : ['"]task['"]\s*\)/, 'Task/Event create checks entity limit');
assertRegex(files.aiDrafts, aiDrafts, /assertWorkspaceEntityLimit\(\s*workspaceId\s*,\s*['"]ai_draft['"]\s*\)/, 'AI draft create checks entity limit');

section('Documentation');
for (const marker of [
  'FAZA 3 - Etap 3.2F - Backend entity limits smoke',
  'activeLeads = 5',
  'activeTasks = 5',
  'activeEvents = 5',
  'activeDrafts = 3',
  'WORKSPACE_ENTITY_LIMIT_REACHED',
  'FAZA 4 - Etap 4.1 - Data contract map',
]) {
  assertIncludes(files.releaseDoc, releaseDoc, marker, 'Release doc contains: ' + marker);
}
for (const marker of [
  'BACKEND ENTITY LIMITS SMOKE',
  'src/server/_access-gate.ts',
  'api/leads.ts',
  'api/work-items.ts',
  'src/server/ai-drafts.ts',
  'WORKSPACE_ENTITY_LIMIT_REACHED',
]) {
  assertIncludes(files.technicalDoc, technicalDoc, marker, 'Technical doc contains: ' + marker);
}

section('Package and quiet gate');
let pkg = {};
try { pkg = JSON.parse(pkgRaw); pass(files.pkg, 'package.json parses'); }
catch (error) { fail(files.pkg, 'package.json parse failed: ' + (error instanceof Error ? error.message : String(error))); }
const scripts = pkg.scripts || {};
if (scripts['check:faza3-etap32f-backend-entity-limits-smoke'] === 'node scripts/check-faza3-etap32f-backend-entity-limits-smoke.cjs') pass(files.pkg, 'check:faza3-etap32f-backend-entity-limits-smoke is wired');
else fail(files.pkg, 'missing check:faza3-etap32f-backend-entity-limits-smoke');
if (scripts['test:faza3-etap32f-backend-entity-limits-smoke'] === 'node --test tests/faza3-etap32f-backend-entity-limits-smoke.test.cjs') pass(files.pkg, 'test:faza3-etap32f-backend-entity-limits-smoke is wired');
else fail(files.pkg, 'missing test:faza3-etap32f-backend-entity-limits-smoke');
assertIncludes(files.quiet, quiet, 'tests/faza3-etap32f-backend-entity-limits-smoke.test.cjs', 'Quiet release gate includes Faza3 Etap3.2F test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL FAZA 3 - Etap 3.2F backend entity limits smoke guard failed.');
  process.exit(1);
}
console.log('\nPASS FAZA 3 - Etap 3.2F backend entity limits smoke guard');
