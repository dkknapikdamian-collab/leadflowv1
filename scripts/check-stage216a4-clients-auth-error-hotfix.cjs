#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));
const checks = [];
function check(label, condition) { checks.push({ label, pass: Boolean(condition) }); }

const clientsPath = 'api/clients.ts';
const probePath = 'tools/stage216a2-lcc-runtime-smoke.cjs';
const reportPath = '_project/reports/STAGE216A4_CLIENTS_AUTH_ERROR_HOTFIX_2026-05-31.md';
const obsidianPath = 'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage216-A4 clients auth error hotfix.md';

check('clients API exists', exists(clientsPath));
check('Stage216-A2 runtime smoke tool exists', exists(probePath));
check('Stage216-A4 report exists', exists(reportPath));
check('Stage216-A4 Obsidian update exists', exists(obsidianPath));

if (exists(clientsPath)) {
  const src = read(clientsPath);
  check('clients imports writeAuthErrorResponse', src.includes("import { writeAuthErrorResponse } from '../src/server/_supabase-auth.js';"));
  check('clients has Stage216-A4 marker', src.includes('STAGE216A4_CLIENTS_AUTH_ERROR_HOTFIX'));
  check('clients catch delegates structured auth errors', /if \(error\?\.code \|\| error\?\.status \|\| error\?\.statusCode\) \{\s*writeAuthErrorResponse\(res, error\);\s*return;\s*\}/m.test(src));
  check('clients still preserves CLIENT_NOT_FOUND 404 fallback', src.includes("message === 'CLIENT_NOT_FOUND' ? 404 : 500"));
  check('clients still requires workspace', src.includes("CLIENT_WORKSPACE_REQUIRED"));
  check('clients still has scoped write gate', src.includes('assertWorkspaceWriteAccess(workspaceId, req)'));
  check('clients supports GET/POST/PATCH/DELETE', ['req.method === \'GET\'', "req.method === 'POST'", "req.method === 'PATCH'", "req.method === 'DELETE'"].every((token) => src.includes(token)));
}

if (exists(probePath)) {
  const probe = read(probePath);
  check('runtime smoke recognizes AUTH_REQUIRED as non-hard auth state', probe.includes("status: 'AUTH_REQUIRED'") && probe.includes('AUTH_REQUIRED may still require manual logged-in browser QA'));
  check('runtime smoke detects Vite API source response', probe.includes('VITE_DEV_API_SOURCE_RESPONSE'));
}

for (const p of [reportPath, obsidianPath]) {
  if (exists(p)) {
    const text = read(p);
    check(`${p} mentions /api/clients`, text.includes('/api/clients'));
    check(`${p} mentions AUTHORIZATION_BEARER_REQUIRED`, text.includes('AUTHORIZATION_BEARER_REQUIRED'));
    check(`${p} mentions no SQL/RLS/GRANT`, /SQL/.test(text) && /RLS/.test(text) && /GRANT/.test(text));
    check(`${p} separates facts`, text.includes('## FAKTY'));
    check(`${p} separates decisions`, text.includes('## DECYZJE DAMIANA'));
    check(`${p} separates hypotheses`, text.includes('## HIPOTEZY AI'));
    check(`${p} has next step`, text.includes('## NASTĘPNY KROK'));
  }
}

const failed = checks.filter((c) => !c.pass);
for (const c of checks) console.log(`${c.pass ? 'PASS' : 'FAIL'} - ${c.label}`);
if (failed.length) {
  console.error(`\nFAIL: ${failed.length} Stage216-A4 checks failed.`);
  process.exit(1);
}
console.log(`\nPASS: ${checks.length} Stage216-A4 checks passed.`);
