#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const APP_URL = (process.env.CLOSEFLOW_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
const OUT = path.join('_project', 'reports', 'STAGE216C_NOTIFICATIONS_ACTIVITY_AI_DRAFTS_RUNTIME_SMOKE_RESULT_2026-05-31.md');

const endpoints = [
  '/api/activities?limit=5',
  '/api/system?kind=ai-drafts&limit=5',
  '/api/system?kind=assistant-context',
  '/api/system?kind=profile-settings',
  '/api/system?kind=workspace-settings',
  '/api/me',
];

function classify(status, contentType, text) {
  const lowerType = String(contentType || '').toLowerCase();
  const body = String(text || '');
  const trimmed = body.trim();
  if (!lowerType.includes('application/json')) {
    if (/^\s*</.test(body) || lowerType.includes('text/html')) return 'NON_JSON_HTML_RESPONSE';
    if (/^\s*import\s|from\s+["']\/src\//m.test(body) || body.includes('import.meta.hot') || body.includes('/src/')) return 'VITE_DEV_API_SOURCE_RESPONSE';
    return 'NON_JSON_RESPONSE';
  }
  if (status === 401 || status === 403) return `AUTH_REQUIRED_${status}`;
  if (status === 400) return 'CONTROLLED_400_JSON';
  if (status >= 500) return `SERVER_ERROR_${status}`;
  if (status >= 200 && status < 300) return `PASS_JSON_${status}`;
  return `JSON_STATUS_${status}`;
}

async function hit(endpoint) {
  const url = APP_URL + endpoint;
  try {
    const response = await fetch(url, { method: 'GET', headers: { accept: 'application/json' } });
    const text = await response.text();
    const contentType = response.headers.get('content-type') || '';
    const classification = classify(response.status, contentType, text);
    return { endpoint, status: response.status, contentType, classification, sample: text.slice(0, 300).replace(/\r?\n/g, ' ') };
  } catch (error) {
    return { endpoint, status: 0, contentType: '', classification: 'FETCH_FAILED', sample: String(error && error.message || error).slice(0, 300) };
  }
}

function isHardFail(result) {
  return result.classification === 'FETCH_FAILED'
    || result.classification === 'NON_JSON_HTML_RESPONSE'
    || result.classification === 'VITE_DEV_API_SOURCE_RESPONSE'
    || result.classification === 'NON_JSON_RESPONSE'
    || result.classification.startsWith('SERVER_ERROR_');
}

function writeReport(results) {
  const lines = [];
  lines.push('---');
  lines.push('typ: runtime_smoke_result');
  lines.push('stage: STAGE216C');
  lines.push('project: CloseFlow / LeadFlow');
  lines.push(`app_url: ${APP_URL}`);
  lines.push(`created_at: ${new Date().toISOString()}`);
  lines.push('---');
  lines.push('');
  lines.push('# STAGE216-C runtime smoke result');
  lines.push('');
  lines.push('## Wyniki');
  lines.push('');
  lines.push('| Endpoint | Status | Content-Type | Klasyfikacja | Próbka |');
  lines.push('|---|---:|---|---|---|');
  for (const result of results) {
    const sample = String(result.sample || '').replace(/\|/g, '\\|');
    lines.push(`| ${result.endpoint} | ${result.status} | ${result.contentType || '-'} | ${result.classification} | ${sample} |`);
  }
  lines.push('');
  lines.push('## Interpretacja');
  lines.push('');
  lines.push('- AUTH_REQUIRED_401 / AUTH_REQUIRED_403 JSON: endpoint żyje i kontroluje auth.');
  lines.push('- CONTROLLED_400_JSON: endpoint żyje, ale wymaga parametru albo walidacji.');
  lines.push('- PASS_JSON_2xx: endpoint zwraca JSON poprawnie.');
  lines.push('- SERVER_ERROR_5xx, NON_JSON_HTML_RESPONSE, VITE_DEV_API_SOURCE_RESPONSE, FETCH_FAILED: FAIL do Stage216-C2.');
  lines.push('');
  lines.push('## Werdykt');
  lines.push('');
  lines.push(results.some(isHardFail) ? '- FAIL: wymaga Stage216-C2.' : '- PASS/CONTROLLED: brak twardego runtime FAIL w GET-only smoke.');
  return lines.join('\n');
}

async function main() {
  const results = [];
  for (const endpoint of endpoints) {
    const result = await hit(endpoint);
    results.push(result);
    console.log(`${result.classification} ${result.status} ${endpoint} ${result.contentType}`);
  }
  if (process.argv.includes('--write')) {
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, writeReport(results), 'utf8');
    console.log(`WROTE ${OUT}`);
  }
  if (results.some(isHardFail)) process.exitCode = 1;
}

main();
