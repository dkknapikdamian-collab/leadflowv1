#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const checks = [];
function check(label, condition) {
  checks.push({ label, pass: Boolean(condition) });
}
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

const apiPath = 'api/leads.ts';
const reportPath = '_project/reports/STAGE216A5_LEAD_SERVICE_RPC_FALLBACK_HOTFIX_2026-05-31.md';
const obsPath = 'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage216-A5 lead service RPC fallback hotfix.md';

check('api/leads.ts exists', exists(apiPath));
check('Stage216-A5 report exists', exists(reportPath));
check('Stage216-A5 Obsidian update exists', exists(obsPath));

if (exists(apiPath)) {
  const src = read(apiPath);
  check('keeps closeflow_start_lead_service RPC path', src.includes("rpc/closeflow_start_lead_service"));
  check('has Stage216-A5 marker', src.includes('CLOSEFLOW_STAGE216A5_LEAD_SERVICE_RPC_FALLBACK_HOTFIX'));
  check('has fallback error helper', src.includes('function isLeadServiceRpcFallbackError'));
  check('fallback detects SQLSTATE 55000', src.includes("message.includes('55000')"));
  check('fallback detects v_client record bug', src.includes('v_client'));
  check('fallback detects tuple structure bug', src.includes('tuple structure'));
  check('fallback detects not-yet-assigned record bug', src.includes('not-yet-assigned record'));
  check('RPC catch uses fallback helper', src.includes('if (isLeadServiceRpcFallbackError(error))'));
  check('legacy JS fallback still creates/ensures client', src.includes('const clientRow = await ensureClientForLead'));
  check('legacy JS fallback still inserts case', src.includes('insertCaseWithSchemaFallback(casePayload)'));
  check('legacy JS fallback still updates lead', src.includes('updateLeadWithSchemaFallback(leadId, workspaceId, leadPayload)'));
  check('legacy JS fallback still records activity', src.includes('lead_moved_to_service'));
  check('does not mutate clients auth hotfix', !src.includes('AUTHORIZATION_BEARER_REQUIRED client'));
}

for (const rel of [reportPath, obsPath]) {
  if (!exists(rel)) continue;
  const text = read(rel);
  check(`${rel} mentions v_client`, text.includes('v_client'));
  check(`${rel} mentions SQLSTATE 55000`, text.includes('55000'));
  check(`${rel} mentions fallback`, /fallback/i.test(text));
  check(`${rel} says no SQL/RLS/GRANT`, text.includes('SQL/RLS/GRANT'));
  check(`${rel} separates facts`, text.includes('FAKTY'));
  check(`${rel} separates decisions`, text.includes('DECYZJE'));
  check(`${rel} separates hypotheses`, text.includes('HIPOTEZY'));
  check(`${rel} has next step`, text.includes('NASTĘPNY KROK'));
}

for (const c of checks) {
  console.log(`${c.pass ? 'PASS' : 'FAIL'} - ${c.label}`);
}
const failed = checks.filter((c) => !c.pass);
if (failed.length) {
  console.error(`\nFAIL: ${failed.length} Stage216-A5 checks failed.`);
  process.exit(1);
}
console.log(`\nPASS: ${checks.length} Stage216-A5 checks passed.`);
