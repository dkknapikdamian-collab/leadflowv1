#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const checks = [];
function read(p) { return fs.readFileSync(path.join(root, p), 'utf8'); }
function exists(p) { return fs.existsSync(path.join(root, p)); }
function check(label, condition) { checks.push({ label, pass: Boolean(condition) }); }

const probe = 'tools/stage216a2-lcc-runtime-smoke.cjs';
const report = '_project/reports/STAGE216A2_LCC_RUNTIME_SMOKE_2026-05-31.md';
const obsidian = 'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage216-A2 LCC runtime smoke.md';

check('Stage216-A2 runtime probe exists', exists(probe));
check('Stage216-A2 report exists', exists(report));
check('Stage216-A2 Obsidian update exists', exists(obsidian));

if (exists(probe)) {
  const src = read(probe);
  check('probe requires CLOSEFLOW_APP_URL', src.includes('CLOSEFLOW_APP_URL'));
  check('probe supports optional CLOSEFLOW_WORKSPACE_ID', src.includes('CLOSEFLOW_WORKSPACE_ID'));
  check('probe is GET-only', src.includes("method: 'GET'") && !/method:\s*['\"](POST|PATCH|PUT|DELETE)['\"]/.test(src));
  check('probe checks leads endpoint', src.includes('/api/leads'));
  check('probe checks clients endpoint', src.includes('/api/clients'));
  check('probe checks cases endpoint', src.includes('/api/cases'));
  check('probe checks detail endpoints when ids exist', src.includes('?id=') && src.includes('firstId'));
  check('probe detects non-json/html response', src.includes('NON_JSON_HTML_RESPONSE') && src.includes('INVALID_API_RESPONSE'));
  check('probe can write runtime result report', src.includes('--write') && src.includes('STAGE216A2_LCC_RUNTIME_SMOKE_RESULT_'));
  check('probe does not write business data', !src.includes('JSON.stringify(input)') && !src.includes('body: JSON.stringify'));
}

for (const p of [report, obsidian]) {
  if (exists(p)) {
    const text = read(p);
    check(`${p} mentions Leads`, text.includes('Leads'));
    check(`${p} mentions Clients`, text.includes('Clients'));
    check(`${p} mentions Cases`, text.includes('Cases'));
    check(`${p} mentions GET-only`, text.includes('GET-only'));
    check(`${p} mentions INVALID_API_RESPONSE`, text.includes('INVALID_API_RESPONSE'));
    check(`${p} says no SQL/RLS/GRANT`, /SQL\/RLS\/GRANT/.test(text) || (/SQL/.test(text) && /RLS/.test(text) && /GRANT/.test(text)));
    check(`${p} has manual smoke checklist`, text.includes('/leads') && text.includes('/clients') && text.includes('/cases'));
    check(`${p} points to Stage216-A3`, text.includes('Stage216-A3'));
    check(`${p} bans git add dot`, text.includes('git add .'));
  }
}

const failed = checks.filter((c) => !c.pass);
for (const c of checks) console.log(`${c.pass ? 'PASS' : 'FAIL'} - ${c.label}`);
if (failed.length) {
  console.error(`\nFAIL: ${failed.length} Stage216-A2 checks failed.`);
  process.exit(1);
}
console.log(`\nPASS: ${checks.length} Stage216-A2 checks passed.`);
