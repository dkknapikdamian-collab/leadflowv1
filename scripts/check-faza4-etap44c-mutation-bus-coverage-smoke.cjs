#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const results = [];

function section(title) { console.log('\n== ' + title + ' =='); }
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
  if (content.includes(needle)) pass(scope, message);
  else fail(scope, message + ' [needle=' + JSON.stringify(needle) + ']');
}
function assertRegex(scope, content, regex, message) {
  if (regex.test(content)) pass(scope, message);
  else fail(scope, message + ' [regex=' + regex + ']');
}
function assertNotRegex(scope, content, regex, message) {
  if (!regex.test(content)) pass(scope, message);
  else fail(scope, message + ' [forbidden=' + regex + ']');
}
function exactMutationImportCount(content) {
  return (content.match(/^import\s*\{\s*subscribeCloseflowDataMutations\s*\}\s*from\s*['"]\.\.\/lib\/supabase-fallback['"]\s*;$/gm) || []).length;
}
function anyNamedImportWithTargetCount(content) {
  let count = 0;
  const re = /^import(?:\s+type)?\s*\{([\s\S]*?)\}\s*from\s*(['"])([^'"]+)\2\s*;?/gm;
  let match;
  while ((match = re.exec(content))) {
    const names = String(match[1]).split(',').map((part) => part.trim().split(/\s+as\s+/i)[0].trim());
    if (names.includes('subscribeCloseflowDataMutations')) count += 1;
  }
  return count;
}
function assertExactMutationImport(scope, content) {
  const exact = exactMutationImportCount(content);
  const any = anyNamedImportWithTargetCount(content);
  if (exact === 1 && any === 1) pass(scope, 'subscribeCloseflowDataMutations imported exactly once from ../lib/supabase-fallback');
  else fail(scope, `mutation import exact=${exact}, any=${any}`);
}

const files = {
  fallback: 'src/lib/supabase-fallback.ts',
  tasks: 'src/pages/Tasks.tsx',
  calendar: 'src/pages/Calendar.tsx',
  today: 'src/pages/TodayStable.tsx',
  releaseDoc: 'docs/release/FAZA4_ETAP44C_MUTATION_BUS_COVERAGE_SMOKE_2026-05-04.md',
  technicalDoc: 'docs/technical/LIVE_REFRESH_MUTATION_BUS_COVERAGE_STAGE44C_2026-05-04.md',
  pkg: 'package.json',
  quiet: 'scripts/closeflow-release-check-quiet.cjs',
  test: 'tests/faza4-etap44c-mutation-bus-coverage-smoke.test.cjs',
};

const fallback = readRequired(files.fallback);
const tasks = readRequired(files.tasks);
const calendar = readRequired(files.calendar);
const today = readRequired(files.today);
const releaseDoc = readRequired(files.releaseDoc);
const technicalDoc = readRequired(files.technicalDoc);
const pkgRaw = readRequired(files.pkg);
const quiet = readRequired(files.quiet);
readRequired(files.test);

section('Mutation bus source');
assertIncludes(files.fallback, fallback, 'CLOSEFLOW_DATA_MUTATED_EVENT', 'Mutation event constant exists');
assertIncludes(files.fallback, fallback, 'closeflow:data-mutated', 'Mutation event name is stable');
assertRegex(files.fallback, fallback, /emitCloseflowDataMutation\s*\(/, 'Mutation emitter exists');
assertRegex(files.fallback, fallback, /subscribeCloseflowDataMutations\s*\(/, 'Mutation subscriber exists');
assertRegex(files.fallback, fallback, /window\.dispatchEvent\s*\(\s*new\s+CustomEvent/, 'Emitter dispatches CustomEvent');
assertRegex(files.fallback, fallback, /apiGetCache\.clear\s*\(\s*\)/, 'Mutation path clears API GET cache');
assertNotRegex(files.fallback, fallback, /window\.location\.reload\s*\(/, 'No full page reload in data layer');

section('Screen subscribers');
assertExactMutationImport(files.tasks, tasks);
assertRegex(files.tasks, tasks, /subscribeCloseflowDataMutations\s*\(/, 'Tasks subscribes to mutation bus');
assertRegex(files.tasks, tasks, /refreshSupabaseData\s*\(/, 'Tasks can refresh data after mutation');
assertNotRegex(files.tasks, tasks, /window\.location\.reload\s*\(/, 'Tasks does not use full reload');

assertExactMutationImport(files.calendar, calendar);
assertRegex(files.calendar, calendar, /subscribeCloseflowDataMutations\s*\(/, 'Calendar subscribes to mutation bus');
assertRegex(files.calendar, calendar, /refreshSupabaseBundle\s*\(/, 'Calendar can refresh data after mutation');
assertNotRegex(files.calendar, calendar, /window\.location\.reload\s*\(/, 'Calendar does not use full reload');

assertExactMutationImport(files.today, today);
assertRegex(files.today, today, /subscribeCloseflowDataMutations\s*\(/, 'TodayStable subscribes to mutation bus');
assertRegex(files.today, today, /refreshData\s*\(\s*\)/, 'TodayStable can refresh data after mutation');
assertNotRegex(files.today, today, /window\.location\.reload\s*\(/, 'TodayStable does not use full reload');

section('Documentation');
for (const marker of [
  'FAZA 4 - Etap 4.4C - mutation bus coverage smoke v3',
  'manual_live_refresh_evidence_required',
  'src/pages/Tasks.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/TodayStable.tsx',
  'FAZA 5 - Etap 5.1 - AI read vs draft intent',
]) assertIncludes(files.releaseDoc, releaseDoc, marker, 'Release doc contains: ' + marker);

for (const marker of [
  'LIVE REFRESH MUTATION BUS COVERAGE STAGE44C v3',
  'emitCloseflowDataMutation',
  'subscribeCloseflowDataMutations',
  'manual_live_refresh_evidence_required',
  'FAZA 5 - Etap 5.1 - AI read vs draft intent',
]) assertIncludes(files.technicalDoc, technicalDoc, marker, 'Technical doc contains: ' + marker);

section('Package and quiet gate');
let pkg = {};
try { pkg = JSON.parse(pkgRaw); pass(files.pkg, 'package.json parses'); }
catch (error) { fail(files.pkg, 'package.json parse failed: ' + (error instanceof Error ? error.message : String(error))); }

const scripts = pkg.scripts || {};
if (scripts['check:faza4-etap44c-mutation-bus-coverage-smoke'] === 'node scripts/check-faza4-etap44c-mutation-bus-coverage-smoke.cjs') pass(files.pkg, 'check:faza4-etap44c-mutation-bus-coverage-smoke is wired');
else fail(files.pkg, 'missing check:faza4-etap44c-mutation-bus-coverage-smoke');

if (scripts['test:faza4-etap44c-mutation-bus-coverage-smoke'] === 'node --test tests/faza4-etap44c-mutation-bus-coverage-smoke.test.cjs') pass(files.pkg, 'test:faza4-etap44c-mutation-bus-coverage-smoke is wired');
else fail(files.pkg, 'missing test:faza4-etap44c-mutation-bus-coverage-smoke');

assertIncludes(files.quiet, quiet, 'tests/faza4-etap44c-mutation-bus-coverage-smoke.test.cjs', 'Quiet release gate includes Stage4.4C static test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL FAZA 4 - Etap 4.4C mutation bus coverage smoke v3 guard failed.');
  process.exit(1);
}
console.log('\nPASS FAZA 4 - Etap 4.4C mutation bus coverage smoke v3 guard');
