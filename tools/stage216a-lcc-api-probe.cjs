#!/usr/bin/env node
/*
Stage216-A L/C/C API probe.
Default mode is GET-only. It never writes unless both:
  STAGE216A_WRITE_PROBE=1
  CONFIRM_STAGE216A_WRITE_PROBE=yes
are set. Write mode is intentionally not implemented in this stage.
*/
const baseUrl = (process.env.CLOSEFLOW_APP_URL || '').replace(/\/+$/, '');
const workspaceId = process.env.CLOSEFLOW_WORKSPACE_ID || '';
const token = process.env.CLOSEFLOW_ACCESS_TOKEN || '';
const userEmail = process.env.CLOSEFLOW_USER_EMAIL || '';
const allowWrite = process.env.STAGE216A_WRITE_PROBE === '1' && process.env.CONFIRM_STAGE216A_WRITE_PROBE === 'yes';

if (!baseUrl) {
  console.error('Missing CLOSEFLOW_APP_URL, e.g. http://localhost:3000 or https://closeflowapp.vercel.app');
  process.exit(2);
}

if (allowWrite) {
  console.error('Write probe is intentionally disabled in Stage216-A. Use a separate Stage216-A write test after explicit approval.');
  process.exit(2);
}

function headers() {
  const h = { 'Content-Type': 'application/json' };
  if (workspaceId) {
    h['x-workspace-id'] = workspaceId;
    h['x-closeflow-workspace-id'] = workspaceId;
  }
  if (token) h.Authorization = `Bearer ${token}`;
  if (userEmail) h['x-user-email'] = userEmail;
  return h;
}

async function requestJson(path) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, { headers: headers() });
  const text = await response.text();
  let data = null;
  let json = true;
  if (text) {
    try { data = JSON.parse(text); } catch { json = false; data = text.slice(0, 240); }
  }
  return { path, status: response.status, ok: response.ok, json, data };
}

function firstId(data) {
  if (!Array.isArray(data)) return '';
  const first = data.find((row) => row && typeof row === 'object' && row.id);
  return first ? String(first.id) : '';
}

const checks = [];
async function check(label, path) {
  const result = await requestJson(path);
  checks.push({ label, ...result });
  const state = result.ok && result.json ? 'PASS' : 'FAIL';
  console.log(`${state} - ${label} ${path} status=${result.status} json=${result.json}`);
  if (!result.json) console.log(`  raw=${String(result.data).slice(0, 160)}`);
  return result;
}

(async () => {
  const leads = await check('GET leads list', '/api/leads');
  const clients = await check('GET clients list', '/api/clients');
  const cases = await check('GET cases list', '/api/cases');

  const leadId = firstId(leads.data);
  const clientId = firstId(clients.data);
  const caseId = firstId(cases.data);

  if (leadId) await check('GET lead detail', `/api/leads?id=${encodeURIComponent(leadId)}`);
  else console.log('SKIP - GET lead detail: no lead id in list');

  if (clientId) await check('GET client detail', `/api/clients?id=${encodeURIComponent(clientId)}`);
  else console.log('SKIP - GET client detail: no client id in list');

  if (caseId) await check('GET case detail', `/api/cases?id=${encodeURIComponent(caseId)}`);
  else console.log('SKIP - GET case detail: no case id in list');

  const failed = checks.filter((c) => !c.ok || !c.json);
  if (failed.length) {
    console.error(`\nFAIL: ${failed.length} Stage216-A L/C/C API probe checks failed.`);
    process.exit(1);
  }

  console.log(`\nPASS: ${checks.length} Stage216-A L/C/C API probe checks passed.`);
})().catch((error) => {
  console.error('STAGE216A_PROBE_FAILED', error?.message || error);
  process.exit(1);
});
