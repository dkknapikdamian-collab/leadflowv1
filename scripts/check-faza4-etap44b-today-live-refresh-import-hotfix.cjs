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
function section(title) { console.log('\n== ' + title + ' =='); }

function exactMutationImportCount(value) {
  return (value.match(/^import\s*\{\s*subscribeCloseflowDataMutations\s*\}\s*from\s*['"]\.\.\/lib\/supabase-fallback['"]\s*;$/gm) || []).length;
}

function reactImportContainsMutation(value) {
  const reactImports = value.match(/import\s*\{[\s\S]*?\}\s*from\s*['"]react['"]\s*;/g) || [];
  return reactImports.some((block) => /\bsubscribeCloseflowDataMutations\b/.test(block));
}

function fallbackMutationImportCount(value) {
  const fallbackImports = value.match(/import\s*\{[\s\S]*?\}\s*from\s*['"]\.\.\/lib\/supabase-fallback['"]\s*;/g) || [];
  return fallbackImports.filter((block) => /\bsubscribeCloseflowDataMutations\b/.test(block)).length;
}

function reactImportContains(value, name) {
  const reactImports = value.match(/import\s*\{[\s\S]*?\}\s*from\s*['"]react['"]\s*;/g) || [];
  return reactImports.some((block) => block.includes(name));
}

function assertTrue(scope, condition, message) {
  if (condition) pass(scope, message);
  else fail(scope, message);
}

function assertFalse(scope, condition, message) {
  if (!condition) pass(scope, message);
  else fail(scope, message);
}

function assertCount(scope, actual, expected, message) {
  if (actual === expected) pass(scope, message + ' count=' + actual);
  else fail(scope, message + ' count=' + actual + ', expected=' + expected);
}

function assertIncludes(scope, content, needle, message) {
  if (content.includes(needle)) pass(scope, message);
  else fail(scope, message + ' [needle=' + JSON.stringify(needle) + ']');
}

const files = {
  today: 'src/pages/TodayStable.tsx',
  fallback: 'src/lib/supabase-fallback.ts',
  releaseDoc: 'docs/release/FAZA4_ETAP44B_TODAY_LIVE_REFRESH_IMPORT_HOTFIX_2026-05-04.md',
  technicalDoc: 'docs/technical/TODAY_LIVE_REFRESH_IMPORT_HOTFIX_STAGE44B_2026-05-04.md',
  pkg: 'package.json',
  quiet: 'scripts/closeflow-release-check-quiet.cjs',
  test: 'tests/faza4-etap44b-today-live-refresh-import-hotfix.test.cjs',
};

const today = readRequired(files.today);
const fallback = readRequired(files.fallback);
const releaseDoc = readRequired(files.releaseDoc);
const technicalDoc = readRequired(files.technicalDoc);
const pkgRaw = readRequired(files.pkg);
const quiet = readRequired(files.quiet);
readRequired(files.test);

section('TodayStable import state');

assertFalse(files.today, reactImportContainsMutation(today), 'subscribeCloseflowDataMutations is not imported from react');
assertCount(files.today, exactMutationImportCount(today), 1, 'exact single data-layer import exists');
assertCount(files.today, fallbackMutationImportCount(today), 1, 'single fallback import contains mutation subscriber');
assertIncludes(files.today, today, "import { subscribeCloseflowDataMutations } from '../lib/supabase-fallback';", 'subscribeCloseflowDataMutations imported from ../lib/supabase-fallback');

for (const name of ['useCallback', 'useEffect', 'useMemo', 'useState', 'type ReactNode']) {
  assertTrue(files.today, reactImportContains(today, name), 'React import keeps ' + name);
}

assertIncludes(files.today, today, 'FAZA4_ETAP44B_TODAY_LIVE_REFRESH', 'Stage44B listener marker remains present');
assertIncludes(files.today, today, 'subscribeCloseflowDataMutations((detail)', 'Today listener subscribes to mutation bus');
assertIncludes(files.today, today, 'refreshData()', 'Today listener can trigger refreshData');

section('supabase-fallback export');
assertIncludes(files.fallback, fallback, 'export function subscribeCloseflowDataMutations', 'Data layer exports subscribeCloseflowDataMutations');
assertIncludes(files.fallback, fallback, 'CLOSEFLOW_DATA_MUTATED_EVENT', 'Data layer keeps mutation event constant');

section('Documentation');
for (const marker of [
  'FAZA 4 - Etap 4.4B import hotfix v10',
  '../lib/supabase-fallback',
  'react',
  'TypeError: subscribeCloseflowDataMutations is not a function',
  'FAZA 4 - Etap 4.4C - mutation bus coverage smoke / manual live refresh evidence',
]) {
  assertIncludes(files.releaseDoc, releaseDoc, marker, 'Release doc contains: ' + marker);
}
for (const marker of [
  'TODAY LIVE REFRESH IMPORT HOTFIX v10',
  '../lib/supabase-fallback',
  'react',
  'APP_ROUTE_RENDER_FAILED',
  'FAZA 4 - Etap 4.4C - mutation bus coverage smoke / manual live refresh evidence',
]) {
  assertIncludes(files.technicalDoc, technicalDoc, marker, 'Technical doc contains: ' + marker);
}

section('Package and quiet gate');
let pkg = {};
try { pkg = JSON.parse(pkgRaw); pass(files.pkg, 'package.json parses'); }
catch (error) { fail(files.pkg, 'package.json parse failed: ' + (error instanceof Error ? error.message : String(error))); }
const scripts = pkg.scripts || {};
if (scripts['check:faza4-etap44b-today-live-refresh-import-hotfix'] === 'node scripts/check-faza4-etap44b-today-live-refresh-import-hotfix.cjs') pass(files.pkg, 'check:faza4-etap44b-today-live-refresh-import-hotfix is wired');
else fail(files.pkg, 'missing check:faza4-etap44b-today-live-refresh-import-hotfix');
if (scripts['test:faza4-etap44b-today-live-refresh-import-hotfix'] === 'node --test tests/faza4-etap44b-today-live-refresh-import-hotfix.test.cjs') pass(files.pkg, 'test:faza4-etap44b-today-live-refresh-import-hotfix is wired');
else fail(files.pkg, 'missing test:faza4-etap44b-today-live-refresh-import-hotfix');
assertIncludes(files.quiet, quiet, 'tests/faza4-etap44b-today-live-refresh-import-hotfix.test.cjs', 'Quiet release gate includes Stage4.4B import hotfix test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL FAZA 4 - Etap 4.4B import hotfix v10 guard failed.');
  process.exit(1);
}
console.log('\nPASS FAZA 4 - Etap 4.4B import hotfix v10 guard');
