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
  today: 'src/pages/TodayStable.tsx',
  fallback: 'src/lib/supabase-fallback.ts',
  releaseDoc: 'docs/release/FAZA4_ETAP44B_TODAY_LIVE_REFRESH_LISTENER_2026-05-04.md',
  technicalDoc: 'docs/technical/TODAY_LIVE_REFRESH_LISTENER_STAGE44B_2026-05-04.md',
  pkg: 'package.json',
  quiet: 'scripts/closeflow-release-check-quiet.cjs',
  test: 'tests/faza4-etap44b-today-live-refresh-listener.test.cjs',
};

const today = readRequired(files.today);
const fallback = readRequired(files.fallback);
const releaseDoc = readRequired(files.releaseDoc);
const technicalDoc = readRequired(files.technicalDoc);
const pkgRaw = readRequired(files.pkg);
const quiet = readRequired(files.quiet);
readRequired(files.test);

section('Stage44A dependency');
assertIncludes(files.fallback, fallback, "CLOSEFLOW_DATA_MUTATED_EVENT = 'closeflow:data-mutated'", 'Mutation bus constant exists from Stage44A');
assertIncludes(files.fallback, fallback, 'subscribeCloseflowDataMutations', 'Mutation bus subscriber exists from Stage44A');

section('TodayStable listener');
assertIncludes(files.today, today, 'subscribeCloseflowDataMutations', 'TodayStable imports/subscribes to mutation bus');
assertIncludes(files.today, today, 'FAZA4_ETAP44B_TODAY_LIVE_REFRESH', 'TodayStable listener marker exists');
assertRegex(files.today, today, /subscribeCloseflowDataMutations\(\(detail\)[\s\S]*refreshData\(\)/, 'TodayStable listener triggers refreshData');
for (const entity of ['task', 'event', 'lead', 'case', 'client', 'aiDraft', 'activity', 'payment']) {
  assertIncludes(files.today, today, "'" + entity + "'", 'TodayStable listens for entity: ' + entity);
}
assertRegex(files.today, today, /setTimeout\(\(\) => \{[\s\S]*refreshData\(\)[\s\S]*\},\s*120\)/, 'TodayStable live refresh is debounced');
assertNotRegex(files.today, today, /window\.location\.reload\(/, 'TodayStable does not use full reload');

section('Documentation');
for (const marker of [
  'FAZA 4 - Etap 4.4B - Today live refresh listener',
  'closeflow:data-mutated',
  'TodayStable',
  'refreshData()',
  'FAZA 4 - Etap 4.4C - mutation bus coverage smoke / manual live refresh evidence',
]) {
  assertIncludes(files.releaseDoc, releaseDoc, marker, 'Release doc contains: ' + marker);
}
for (const marker of [
  'TODAY LIVE REFRESH LISTENER',
  'subscribeCloseflowDataMutations',
  'refreshData()',
  'window.location.reload()',
  'FAZA 4 - Etap 4.4C - mutation bus coverage smoke / manual live refresh evidence',
]) {
  assertIncludes(files.technicalDoc, technicalDoc, marker, 'Technical doc contains: ' + marker);
}

section('Package and quiet gate');
let pkg = {};
try { pkg = JSON.parse(pkgRaw); pass(files.pkg, 'package.json parses'); }
catch (error) { fail(files.pkg, 'package.json parse failed: ' + (error instanceof Error ? error.message : String(error))); }
const scripts = pkg.scripts || {};
if (scripts['check:faza4-etap44b-today-live-refresh-listener'] === 'node scripts/check-faza4-etap44b-today-live-refresh-listener.cjs') pass(files.pkg, 'check:faza4-etap44b-today-live-refresh-listener is wired');
else fail(files.pkg, 'missing check:faza4-etap44b-today-live-refresh-listener');
if (scripts['test:faza4-etap44b-today-live-refresh-listener'] === 'node --test tests/faza4-etap44b-today-live-refresh-listener.test.cjs') pass(files.pkg, 'test:faza4-etap44b-today-live-refresh-listener is wired');
else fail(files.pkg, 'missing test:faza4-etap44b-today-live-refresh-listener');
assertIncludes(files.quiet, quiet, 'tests/faza4-etap44b-today-live-refresh-listener.test.cjs', 'Quiet release gate includes Stage4.4B static test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL FAZA 4 - Etap 4.4B Today live refresh listener guard failed.');
  process.exit(1);
}
console.log('\nPASS FAZA 4 - Etap 4.4B Today live refresh listener guard');
