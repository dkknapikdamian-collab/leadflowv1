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
  if (!regex.test(content)) pass(scope, message || 'Forbidden absent: ' + regex);
  else fail(scope, (message || 'Forbidden present: ' + regex) + ' [regex=' + regex + ']');
}
function section(title) { console.log('\n== ' + title + ' =='); }

const files = {
  fallback: 'src/lib/supabase-fallback.ts',
  tasks: 'src/pages/Tasks.tsx',
  calendar: 'src/pages/Calendar.tsx',
  releaseDoc: 'docs/release/FAZA4_ETAP44A_LIVE_REFRESH_MUTATION_BUS_2026-05-04.md',
  technicalDoc: 'docs/technical/LIVE_REFRESH_MUTATION_BUS_STAGE44A_2026-05-04.md',
  pkg: 'package.json',
  quiet: 'scripts/closeflow-release-check-quiet.cjs',
  test: 'tests/faza4-etap44a-live-refresh-mutation-bus.test.cjs',
};

const fallback = readRequired(files.fallback);
const tasks = readRequired(files.tasks);
const calendar = readRequired(files.calendar);
const releaseDoc = readRequired(files.releaseDoc);
const technicalDoc = readRequired(files.technicalDoc);
const pkgRaw = readRequired(files.pkg);
const quiet = readRequired(files.quiet);
readRequired(files.test);

section('Mutation bus source');
assertIncludes(files.fallback, fallback, "CLOSEFLOW_DATA_MUTATED_EVENT = 'closeflow:data-mutated'", 'Mutation event constant exists');
assertIncludes(files.fallback, fallback, 'emitCloseflowDataMutation', 'Mutation emitter exists');
assertIncludes(files.fallback, fallback, 'subscribeCloseflowDataMutations', 'Mutation subscriber helper exists');
assertIncludes(files.fallback, fallback, 'new CustomEvent(CLOSEFLOW_DATA_MUTATED_EVENT', 'CustomEvent dispatch exists');
assertIncludes(files.fallback, fallback, 'clearApiGetCache();', 'Mutation still clears GET cache');
assertRegex(files.fallback, fallback, /else\s*\{[\s\S]*clearApiGetCache\(\);[\s\S]*emitCloseflowDataMutation\(path,\s*method\);[\s\S]*\}/, 'Non-GET result clears cache and emits mutation');
assertNotRegex(files.fallback, fallback, /window\.location\.reload\(/, 'No full reload in data layer');

section('Tasks listener');
assertIncludes(files.tasks, tasks, 'subscribeCloseflowDataMutations', 'Tasks imports/subscribes to mutation bus');
assertIncludes(files.tasks, tasks, 'FAZA4_ETAP44A_TASKS_LIVE_REFRESH', 'Tasks listener marker exists');
assertRegex(files.tasks, tasks, /subscribeCloseflowDataMutations\(\(detail\)[\s\S]*refreshSupabaseData\(\)/, 'Tasks listener triggers refreshSupabaseData');
assertNotRegex(files.tasks, tasks, /window\.location\.reload\(/, 'Tasks does not use full reload');

section('Calendar listener');
assertIncludes(files.calendar, calendar, 'subscribeCloseflowDataMutations', 'Calendar imports/subscribes to mutation bus');
assertIncludes(files.calendar, calendar, 'FAZA4_ETAP44A_CALENDAR_LIVE_REFRESH', 'Calendar listener marker exists');
assertRegex(files.calendar, calendar, /subscribeCloseflowDataMutations\(\(detail\)[\s\S]*refreshSupabaseBundle\(\)/, 'Calendar listener triggers refreshSupabaseBundle');
assertNotRegex(files.calendar, calendar, /window\.location\.reload\(/, 'Calendar does not use full reload');

section('Documentation');
for (const marker of [
  'FAZA 4 - Etap 4.4A - Live refresh mutation bus',
  'closeflow:data-mutated',
  'Tasks',
  'Calendar',
  'FAZA 4 - Etap 4.4B - Today live refresh listener',
]) {
  assertIncludes(files.releaseDoc, releaseDoc, marker, 'Release doc contains: ' + marker);
}
for (const marker of [
  'LIVE REFRESH MUTATION BUS',
  'CLOSEFLOW_DATA_MUTATED_EVENT',
  'No full reload',
  'FAZA 4 - Etap 4.4B - Today live refresh listener',
]) {
  assertIncludes(files.technicalDoc, technicalDoc, marker, 'Technical doc contains: ' + marker);
}

section('Package and quiet gate');
let pkg = {};
try { pkg = JSON.parse(pkgRaw); pass(files.pkg, 'package.json parses'); }
catch (error) { fail(files.pkg, 'package.json parse failed: ' + (error instanceof Error ? error.message : String(error))); }
const scripts = pkg.scripts || {};
if (scripts['check:faza4-etap44a-live-refresh-mutation-bus'] === 'node scripts/check-faza4-etap44a-live-refresh-mutation-bus.cjs') pass(files.pkg, 'check:faza4-etap44a-live-refresh-mutation-bus is wired');
else fail(files.pkg, 'missing check:faza4-etap44a-live-refresh-mutation-bus');
if (scripts['test:faza4-etap44a-live-refresh-mutation-bus'] === 'node --test tests/faza4-etap44a-live-refresh-mutation-bus.test.cjs') pass(files.pkg, 'test:faza4-etap44a-live-refresh-mutation-bus is wired');
else fail(files.pkg, 'missing test:faza4-etap44a-live-refresh-mutation-bus');
assertIncludes(files.quiet, quiet, 'tests/faza4-etap44a-live-refresh-mutation-bus.test.cjs', 'Quiet release gate includes Stage4.4A static test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL FAZA 4 - Etap 4.4A live refresh mutation bus guard failed.');
  process.exit(1);
}
console.log('\nPASS FAZA 4 - Etap 4.4A live refresh mutation bus guard');
