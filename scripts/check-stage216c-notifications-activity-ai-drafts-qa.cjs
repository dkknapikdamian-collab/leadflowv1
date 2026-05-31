#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const checks = [];
function pass(name) { checks.push({ name, ok: true }); }
function fail(name, detail) { checks.push({ name, ok: false, detail }); }
function assert(name, condition, detail) { condition ? pass(name) : fail(name, detail); }
function read(rel) { return fs.existsSync(rel) ? fs.readFileSync(rel, 'utf8') : ''; }

const artifacts = [
  'tools/stage216c-generate-notifications-activity-ai-drafts-qa.cjs',
  'tools/stage216c-notifications-activity-ai-drafts-runtime-smoke.cjs',
  'scripts/check-stage216c-notifications-activity-ai-drafts-qa.cjs',
  '_project/reports/STAGE216C_NOTIFICATIONS_ACTIVITY_AI_DRAFTS_QA_2026-05-31.md',
  'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage216-C notifications activity ai drafts QA.md',
];

for (const rel of artifacts) assert(`artifact exists: ${rel}`, fs.existsSync(rel), 'missing');

const generator = read('tools/stage216c-generate-notifications-activity-ai-drafts-qa.cjs');
const runtime = read('tools/stage216c-notifications-activity-ai-drafts-runtime-smoke.cjs');

let generatorRunOutput = '';
try {
  generatorRunOutput = cp.execFileSync(process.execPath, ['tools/stage216c-generate-notifications-activity-ai-drafts-qa.cjs', '--write'], { encoding: 'utf8' });
  assert('generator runs with --write', generatorRunOutput.includes('WROTE'), generatorRunOutput);
} catch (error) {
  fail('generator runs with --write', error.stdout || error.message);
}

const report = read('_project/reports/STAGE216C_NOTIFICATIONS_ACTIVITY_AI_DRAFTS_QA_2026-05-31.md');
const obsidian = read('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage216-C notifications activity ai drafts QA.md');

for (const expected of [
  'src/pages/NotificationsCenter.tsx',
  'src/pages/Activity.tsx',
  'src/pages/AiDrafts.tsx',
  'src/lib/notifications.ts',
  'src/lib/ai-drafts.ts',
  'api/activities.ts',
  'api/system.ts',
  'STAGE216B_TASKS_EVENTS_CALENDAR_QA_2026-05-31.md',
]) {
  assert(`generator scans/reference includes ${expected}`, generator.includes(expected), 'missing reference');
}

assert('generator writes _project report', generator.includes('STAGE216C_NOTIFICATIONS_ACTIVITY_AI_DRAFTS_QA_2026-05-31.md'), 'missing report output');
assert('generator writes Obsidian update path', generator.includes('CloseFlow Stage216-C notifications activity ai drafts QA.md'), 'missing obsidian output');

for (const endpoint of [
  '/api/activities?limit=5',
  '/api/system?kind=ai-drafts&limit=5',
  '/api/system?kind=assistant-context',
  '/api/system?kind=profile-settings',
  '/api/system?kind=workspace-settings',
  '/api/me',
]) {
  assert(`runtime smoke includes ${endpoint}`, runtime.includes(endpoint), 'missing endpoint');
}
assert('runtime smoke is explicitly GET', runtime.includes("method: 'GET'") || runtime.includes('method: "GET"'), 'GET method missing');
assert('runtime smoke contains no write HTTP methods', !/method:\s*['"](POST|PATCH|PUT|DELETE)['"]/i.test(runtime), 'write method found');
assert('runtime smoke classifies NON_JSON_HTML_RESPONSE', runtime.includes('NON_JSON_HTML_RESPONSE'), 'missing classifier');
assert('runtime smoke classifies VITE_DEV_API_SOURCE_RESPONSE', runtime.includes('VITE_DEV_API_SOURCE_RESPONSE'), 'missing classifier');
assert('runtime smoke classifies AUTH_REQUIRED', runtime.includes('AUTH_REQUIRED_'), 'missing classifier');
assert('runtime smoke fails on 5xx', runtime.includes('SERVER_ERROR_') && runtime.includes('isHardFail'), 'missing 5xx fail logic');

assert('report contains Stage216-C heading', report.includes('STAGE216-C - Notifications / Activity / AI drafts QA'), 'bad report');
assert('report contains manual QA', report.includes('## Manual QA'), 'missing manual QA');
assert('obsidian contains FAKTY/DECYZJE/HIPOTEZY', obsidian.includes('## FAKTY') && obsidian.includes('## DECYZJE DAMIANA') && obsidian.includes('## HIPOTEZY AI'), 'obsidian structure missing');

for (const rel of [
  'tools/stage216c-generate-notifications-activity-ai-drafts-qa.cjs',
  'tools/stage216c-notifications-activity-ai-drafts-runtime-smoke.cjs',
]) {
  const text = read(rel);
  assert(`${rel} contains no executable SQL/RLS/GRANT mutation statement pattern`, !/\b(create\s+policy|alter\s+table|drop\s+policy|grant\s+|revoke\s+|enable\s+row\s+level\s+security)\b/i.test(text), 'SQL/RLS/GRANT mutation text found');
}

for (const check of checks) {
  console.log(`${check.ok ? 'PASS' : 'FAIL'} - ${check.name}${check.detail ? ': ' + check.detail : ''}`);
}
const failed = checks.filter((check) => !check.ok).length;
console.log(`\nPASS: ${checks.length - failed}`);
console.log(`FAIL: ${failed}`);
if (failed) process.exit(1);
