#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const LIMIT = 12;
const MARKER = 'API0_VERCEL_HOBBY_DIGEST_CONSOLIDATION';
const failures = [];

function rel(...parts) {
  return path.join(ROOT, ...parts);
}
function read(file) {
  return fs.existsSync(rel(file)) ? fs.readFileSync(rel(file), 'utf8').replace(/^\uFEFF/, '') : '';
}
function pass(message) {
  console.log(`PASS ${message}`);
}
function fail(message) {
  console.log(`FAIL ${message}`);
  failures.push(message);
}
function expect(condition, message) {
  if (condition) pass(message);
  else fail(message);
}
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const apiFiles = walk(rel('api'))
  .filter((file) => /\.(ts|js|mjs|cjs)$/.test(file))
  .map((file) => path.relative(ROOT, file).replace(/\\/g, '/'))
  .sort();

console.log('== API files ==');
for (const file of apiFiles) console.log(`API_FUNCTION ${file}`);
expect(apiFiles.length <= LIMIT, `Vercel Hobby API function count <= ${LIMIT}, actual=${apiFiles.length}`);
expect(!apiFiles.includes('api/daily-digest.ts'), 'api/daily-digest.ts removed as separate Serverless Function');

const vercel = read('vercel.json');
expect(vercel.includes('"source": "/api/daily-digest"'), 'vercel.json keeps public /api/daily-digest rewrite source');
expect(vercel.includes('"destination": "/api/system?kind=daily-digest"'), 'vercel.json rewrites daily digest to api/system');
expect(vercel.includes('"path": "/api/daily-digest"'), 'vercel cron path remains /api/daily-digest');

const system = read('api/system.ts');
expect(system.includes('dailyDigestHandler'), 'api/system.ts imports/references dailyDigestHandler');
expect(system.includes('weeklyReportHandler'), 'api/system.ts imports/references weeklyReportHandler');
expect(system.includes("kind === 'daily-digest'") && system.includes('dailyDigestHandler(req, res)'), 'api/system.ts routes kind=daily-digest');
expect(system.includes("kind === 'weekly-report'") && system.includes('weeklyReportHandler(req, res)'), 'api/system.ts routes kind=weekly-report');
expect(system.includes(MARKER), `api/system.ts contains ${MARKER}`);

const doc = read('docs/fixes/CLOSEFLOW_API0_VERCEL_HOBBY_FUNCTION_CONSOLIDATION_2026-05-10.md');
expect(doc.includes('Vercel Hobby') && doc.includes('api/daily-digest.ts'), 'API-0 documentation exists');

const packageText = read('package.json');
JSON.parse(packageText);
expect(packageText.includes('check:closeflow-api0-vercel-hobby-functions'), 'package.json has API-0 check script');

console.log(`\napi_function_count=${apiFiles.length}`);
console.log(`api_function_limit=${LIMIT}`);
console.log(`problem_count=${failures.length}`);

if (failures.length) {
  console.error('FAIL CLOSEFLOW_API0_VERCEL_HOBBY_FUNCTIONS_FAILED');
  process.exit(1);
}

console.log('CLOSEFLOW_API0_VERCEL_HOBBY_FUNCTIONS_OK');
