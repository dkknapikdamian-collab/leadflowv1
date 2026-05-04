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
  return fs.readFileSync(full, 'utf8');
}
function pass(scope, message) { results.push({ level: 'PASS', scope, message }); }
function fail(scope, message) { results.push({ level: 'FAIL', scope, message }); }
function assertIncludes(scope, content, needle, message) {
  if (content.includes(needle)) pass(scope, message || 'Found: ' + needle);
  else fail(scope, (message || 'Missing: ' + needle) + ' [needle=' + JSON.stringify(needle) + ']');
}
function assertRegex(scope, content, regex, message) {
  if (regex.test(content)) pass(scope, message || 'Matched: ' + regex);
  else fail(scope, (message || 'Missing regex: ' + regex) + ' [regex=' + regex + ']');
}
function assertNotRegex(scope, content, regex, message) {
  if (!regex.test(content)) pass(scope, message || 'Forbidden pattern absent: ' + regex);
  else fail(scope, (message || 'Forbidden pattern present: ' + regex) + ' [regex=' + regex + ']');
}
function section(title) { console.log('\n== ' + title + ' =='); }

const files = {
  smoke: 'scripts/smoke-critical-crud.cjs',
  releaseDoc: 'docs/release/FAZA4_ETAP43_CRITICAL_CRUD_RELOAD_SMOKE_2026-05-04.md',
  technicalDoc: 'docs/technical/CRITICAL_CRUD_RELOAD_SMOKE_STAGE43_2026-05-04.md',
  test: 'tests/faza4-etap43-critical-crud-smoke.test.cjs',
  pkg: 'package.json',
  quiet: 'scripts/closeflow-release-check-quiet.cjs',
  supabaseFallback: 'src/lib/supabase-fallback.ts',
  vercel: 'vercel.json',
  workItems: 'api/work-items.ts',
};

const smoke = readRequired(files.smoke);
const releaseDoc = readRequired(files.releaseDoc);
const technicalDoc = readRequired(files.technicalDoc);
const test = readRequired(files.test);
const pkgRaw = readRequired(files.pkg);
const quiet = readRequired(files.quiet);
const fallback = readRequired(files.supabaseFallback);
const vercel = readRequired(files.vercel);
const workItems = readRequired(files.workItems);

section('Smoke script contract');
for (const marker of [
  'FAZA4_ETAP43_CRITICAL_CRUD_RELOAD_SMOKE',
  'CLOSEFLOW_SMOKE_BASE_URL',
  'CLOSEFLOW_SMOKE_ACCESS_TOKEN',
  'CLOSEFLOW_SMOKE_WORKSPACE_ID',
  'CLOSEFLOW_SMOKE_KEEP_DATA',
  'CLOSEFLOW_SMOKE_AI_EXPECTED',
  '/api/me',
  '/api/leads',
  '/api/tasks',
  '/api/events',
  '/api/system?kind=ai-drafts',
  "action: 'start_service'",
  "action: 'confirm'",
  "action: 'cancel'",
  'PASS critical CRUD smoke',
]) {
  assertIncludes(files.smoke, smoke, marker, 'Smoke script contains: ' + marker);
}
assertRegex(files.smoke, smoke, /GET\s+\/api\/tasks|\/api\/tasks/, 'Smoke script touches task list reload');
assertRegex(files.smoke, smoke, /GET\s+\/api\/events|\/api\/events/, 'Smoke script touches event list reload');
assertRegex(files.smoke, smoke, /cleanup[\s\S]*api\/leads[\s\S]*api\/tasks[\s\S]*api\/events/, 'Smoke script has cleanup for created records');

section('Existing API surface used by UI');
for (const marker of [
  '/api/leads',
  '/api/tasks',
  '/api/events',
  '/api/system?kind=ai-drafts',
  'start_service',
  'fetchTasksFromSupabase',
  'fetchEventsFromSupabase',
  'createAiDraftInSupabase',
  'updateAiDraftInSupabase',
  'deleteAiDraftFromSupabase',
]) {
  assertIncludes(files.supabaseFallback, fallback, marker, 'UI API helper contains: ' + marker);
}

section('Vercel rewrites');
assertRegex(files.vercel, vercel, /"source":\s*"\/api\/tasks"[\s\S]*?"destination":\s*"\/api\/work-items\?kind=tasks"/, 'Vercel tasks rewrite exists');
assertRegex(files.vercel, vercel, /"source":\s*"\/api\/events"[\s\S]*?"destination":\s*"\/api\/work-items\?kind=events"/, 'Vercel events rewrite exists');

section('Stage4.2 syntax remains clean');
assertNotRegex(files.workItems, workItems, /^\uFEFF/, 'api/work-items.ts has no leading BOM');
assertNotRegex(files.workItems, workItems, /function isEventRow\(row: any\) \{function isEventRow/, 'No duplicated isEventRow declaration');
assertNotRegex(files.workItems, workItems, /syncLeadNextActionasync function syncLeadNextAction/, 'No duplicated syncLeadNextAction declaration');

section('Documentation');
for (const marker of [
  'FAZA 4 - Etap 4.3 - CRUD smoke test i reload persistence',
  'scripts/smoke-critical-crud.cjs',
  'CLOSEFLOW_SMOKE_BASE_URL',
  'CLOSEFLOW_SMOKE_ACCESS_TOKEN',
  'Manualny reload UI nadal zostaje wymagany',
  'FAZA 4 - Etap 4.4 - Live refresh bez ręcznego odświeżania',
]) {
  assertIncludes(files.releaseDoc, releaseDoc, marker, 'Release doc contains: ' + marker);
}
for (const marker of [
  'CRITICAL CRUD / RELOAD SMOKE',
  '/api/leads',
  '/api/tasks',
  '/api/events',
  '/api/system?kind=ai-drafts',
  'CLOSEFLOW_SMOKE_ACCESS_TOKEN',
  'FAZA 4 - Etap 4.4 - Live refresh bez ręcznego odświeżania',
]) {
  assertIncludes(files.technicalDoc, technicalDoc, marker, 'Technical doc contains: ' + marker);
}

section('Package and quiet gate');
let pkg = {};
try { pkg = JSON.parse(pkgRaw); pass(files.pkg, 'package.json parses'); }
catch (error) { fail(files.pkg, 'package.json parse failed: ' + (error instanceof Error ? error.message : String(error))); }
const scripts = pkg.scripts || {};
if (scripts['smoke:critical-crud'] === 'node scripts/smoke-critical-crud.cjs') pass(files.pkg, 'smoke:critical-crud is wired');
else fail(files.pkg, 'missing smoke:critical-crud');
if (scripts['check:faza4-etap43-critical-crud-smoke'] === 'node scripts/check-faza4-etap43-critical-crud-smoke.cjs') pass(files.pkg, 'check:faza4-etap43-critical-crud-smoke is wired');
else fail(files.pkg, 'missing check:faza4-etap43-critical-crud-smoke');
if (scripts['test:faza4-etap43-critical-crud-smoke'] === 'node --test tests/faza4-etap43-critical-crud-smoke.test.cjs') pass(files.pkg, 'test:faza4-etap43-critical-crud-smoke is wired');
else fail(files.pkg, 'missing test:faza4-etap43-critical-crud-smoke');
assertIncludes(files.quiet, quiet, 'tests/faza4-etap43-critical-crud-smoke.test.cjs', 'Quiet release gate includes Stage4.3 static test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL FAZA 4 - Etap 4.3 critical CRUD smoke guard failed.');
  process.exit(1);
}
console.log('\nPASS FAZA 4 - Etap 4.3 critical CRUD smoke guard');
