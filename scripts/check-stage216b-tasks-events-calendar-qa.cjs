#!/usr/bin/env node
/*
  CloseFlow Stage216-B package guard.
  Verifies that QA/smoke artifacts exist and remain read-only/safe.
*/

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const REQUIRED_FILES = [
  'tools/stage216b-generate-tasks-events-calendar-qa.cjs',
  'tools/stage216b-tasks-events-calendar-runtime-smoke.cjs',
  'scripts/check-stage216b-tasks-events-calendar-qa.cjs',
  '_project/reports/STAGE216B_TASKS_EVENTS_CALENDAR_QA_2026-05-31.md',
  'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage216-B tasks events calendar QA.md',
];

const REQUIRED_SOURCE_REFERENCES = [
  'package.json',
  'vercel.json',
  'src/lib/supabase-fallback.ts',
  'api/work-items.ts',
  'api/system.ts',
  'src/pages/TasksStable.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/TodayStable.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/CaseDetail.tsx',
  'scripts/check-stage216a2-lcc-runtime-smoke.cjs',
];

const REQUIRED_ENDPOINT_REFERENCES = [
  '/api/tasks',
  '/api/events',
  '/api/work-items?kind=tasks',
  '/api/work-items?kind=events',
  '/api/system?apiRoute=tasks',
  '/api/system?apiRoute=events',
];

const CHECKED_STAGE_FILES = [
  'tools/stage216b-generate-tasks-events-calendar-qa.cjs',
  'tools/stage216b-tasks-events-calendar-runtime-smoke.cjs',
  'APPLY_CLOSEFLOW_STAGE216B_TASKS_EVENTS_CALENDAR_QA_2026-05-31.ps1',
];

const failures = [];
const passes = [];

function read(file) {
  return fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
}

function pass(msg) {
  passes.push(msg);
  console.log(`PASS - ${msg}`);
}

function fail(msg) {
  failures.push(msg);
  console.error(`FAIL - ${msg}`);
}

function exists(file) {
  return fs.existsSync(path.resolve(process.cwd(), file));
}

for (const file of REQUIRED_FILES) {
  if (exists(file)) pass(`artifact exists: ${file}`);
  else fail(`missing artifact: ${file}`);
}

if (exists('tools/stage216b-generate-tasks-events-calendar-qa.cjs')) {
  const generator = read('tools/stage216b-generate-tasks-events-calendar-qa.cjs');
  for (const ref of REQUIRED_SOURCE_REFERENCES) {
    if (generator.includes(ref)) pass(`generator scans/reference includes ${ref}`);
    else fail(`generator missing source reference ${ref}`);
  }
  if (/fs\.writeFileSync\([^\n]+REPORT_PATH/.test(generator) || generator.includes('writeIfRequested(REPORT_PATH')) pass('generator writes _project report');
  else fail('generator does not write _project report');
  if (generator.includes('OBSIDIAN_UPDATE')) pass('generator writes Obsidian update path');
  else fail('generator missing Obsidian update path');
}

if (exists('tools/stage216b-tasks-events-calendar-runtime-smoke.cjs')) {
  const runtime = read('tools/stage216b-tasks-events-calendar-runtime-smoke.cjs');
  for (const ref of REQUIRED_ENDPOINT_REFERENCES) {
    if (runtime.includes(ref)) pass(`runtime smoke includes ${ref}`);
    else fail(`runtime smoke missing ${ref}`);
  }
  if (/method:\s*['"]GET['"]/.test(runtime)) pass('runtime smoke is explicitly GET');
  else fail('runtime smoke does not explicitly use GET');
  if (/method:\s*['"](POST|PUT|PATCH|DELETE)['"]/.test(runtime)) fail('runtime smoke contains a write HTTP method');
  else pass('runtime smoke contains no write HTTP methods');
  for (const marker of ['NON_JSON_HTML_RESPONSE', 'VITE_DEV_API_SOURCE_RESPONSE', 'AUTH_REQUIRED']) {
    if (runtime.includes(marker)) pass(`runtime smoke classifies ${marker}`);
    else fail(`runtime smoke missing classifier ${marker}`);
  }
}

if (exists('APPLY_CLOSEFLOW_STAGE216B_TASKS_EVENTS_CALENDAR_QA_2026-05-31.ps1')) {
  const apply = read('APPLY_CLOSEFLOW_STAGE216B_TASKS_EVENTS_CALENDAR_QA_2026-05-31.ps1');
  if (/git\s+add\s+\./i.test(apply)) fail('apply script contains forbidden broad git staging');
  else pass('apply script avoids broad git staging');
  if (apply.includes('dev-rollout-freeze')) pass('apply script checks expected branch');
  else fail('apply script does not check expected branch');
}

for (const file of CHECKED_STAGE_FILES) {
  if (!exists(file)) continue;
  const text = read(file);
  const withoutComments = text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
  const suspiciousSqlStatement = /\b(ALTER\s+TABLE|CREATE\s+POLICY|ALTER\s+POLICY|DROP\s+POLICY|GRANT\s+[^\n;]+|REVOKE\s+[^\n;]+|CREATE\s+FUNCTION|DROP\s+FUNCTION)\b[\s\S]{0,160};/i;
  if (suspiciousSqlStatement.test(withoutComments)) fail(`${file} appears to contain an executable SQL/RLS/GRANT mutation statement`);
  else pass(`${file} contains no executable SQL/RLS/GRANT mutation statement pattern`);
}

if (exists('tools/stage216b-generate-tasks-events-calendar-qa.cjs')) {
  const result = spawnSync(process.execPath, ['tools/stage216b-generate-tasks-events-calendar-qa.cjs', '--write'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: 'pipe',
  });
  if (result.status === 0) {
    pass('generator runs with --write');
    if (result.stdout.trim()) console.log(result.stdout.trim());
  } else {
    fail(`generator failed with status ${result.status}: ${result.stderr || result.stdout}`);
  }
}

console.log('');
console.log(`PASS: ${passes.length}`);
console.log(`FAIL: ${failures.length}`);

if (failures.length) {
  process.exitCode = 1;
}
