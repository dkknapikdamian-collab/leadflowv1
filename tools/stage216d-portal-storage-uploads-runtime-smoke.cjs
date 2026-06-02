const fs = require('fs');
const path = require('path');

const root = process.cwd();
const WRITE = process.argv.includes('--write');
const appUrl = (process.env.CLOSEFLOW_APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
const outFile = path.join(root, '_project/reports/STAGE216D_PORTAL_STORAGE_UPLOADS_RUNTIME_SMOKE_RESULT_2026-06-01.md');

const endpoints = [
  '/api/storage-upload-health',
  '/api/storage-upload',
  '/api/client-portal-session',
  '/api/client-portal-tokens?caseId=__stage216d_smoke__',
  '/api/portal?route=session',
  '/api/cases?id=__stage216d_smoke__&portalSession=__stage216d_smoke__',
  '/api/case-items?caseId=__stage216d_smoke__&portalSession=__stage216d_smoke__',
];

function sample(text) {
  return String(text || '').replace(/\s+/g, ' ').trim().slice(0, 260).replace(/\|/g, '\\|');
}

function classify(status, contentType, text, error) {
  if (error) return 'FETCH_FAILED';
  const ct = String(contentType || '').toLowerCase();
  const body = String(text || '');
  if (ct.includes('text/html') || /^\s*<!doctype html/i.test(body) || /^\s*<html/i.test(body)) return 'NON_JSON_HTML_RESPONSE';
  if (/import\s+|export\s+|from\s+["']react["']|vite/i.test(body) && !ct.includes('json')) return 'VITE_DEV_API_SOURCE_RESPONSE';
  if (ct.includes('application/json')) {
    if (status === 401) return 'AUTH_REQUIRED_401';
    if (status === 403) return 'AUTH_OR_SESSION_REQUIRED_403';
    if (status === 405) return 'JSON_STATUS_405';
    if (status === 404) return 'JSON_STATUS_404';
    if (status === 400) return 'CONTROLLED_400_JSON';
    if (status === 200) return 'PASS_JSON_200';
    if (status >= 500 && /PORTAL_STORAGE_HEALTH_SECRET_MISSING|SUPABASE_SERVER_CONFIG_MISSING|SUPABASE_PORTAL_BUCKET_MISSING|PORTAL_STORAGE_BUCKET_NOT_FOUND_OR_INACCESSIBLE|PORTAL_STORAGE_BUCKET_MUST_NOT_BE_PUBLIC/.test(body)) return 'CONFIG_REQUIRED_500';
    if (status >= 500) return 'SERVER_ERROR_500';
    return `JSON_STATUS_${status}`;
  }
  if (status >= 500) return 'SERVER_ERROR_500_NON_JSON';
  return `NON_JSON_STATUS_${status}`;
}

async function probe(endpoint) {
  const url = appUrl + endpoint;
  try {
    const response = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
    const text = await response.text();
    const contentType = response.headers.get('content-type') || '';
    return { endpoint, status: response.status, contentType, classification: classify(response.status, contentType, text), text: sample(text) };
  } catch (error) {
    return { endpoint, status: 0, contentType: '-', classification: 'FETCH_FAILED', text: sample(error && error.message ? error.message : String(error || 'fetch failed')) };
  }
}

(async () => {
  const results = [];
  for (const endpoint of endpoints) {
    const result = await probe(endpoint);
    results.push(result);
    console.log(`${result.classification} ${result.status} ${result.endpoint} ${result.contentType}`);
  }

  const hardFail = results.some((r) => [
    'FETCH_FAILED',
    'NON_JSON_HTML_RESPONSE',
    'VITE_DEV_API_SOURCE_RESPONSE',
    'SERVER_ERROR_500',
    'SERVER_ERROR_500_NON_JSON',
  ].includes(r.classification));

  const configFindings = results.filter((r) => r.classification === 'CONFIG_REQUIRED_500');
  const createdAt = new Date().toISOString();
  const md = `---
typ: runtime_smoke_result
stage: STAGE216D
project: CloseFlow / LeadFlow
app_url: ${appUrl}
created_at: ${createdAt}
mode: local-only
---

# Stage216-D runtime smoke result

## Endpointy GET-only

| Endpoint | Status | Content-Type | Klasyfikacja | Próbka |
|---|---:|---|---|---|
${results.map((r) => `| ${r.endpoint} | ${r.status} | ${r.contentType || '-'} | ${r.classification} | ${r.text || '-'} |`).join('\n')}

## Interpretacja

- GET-only: test nie wykonuje uploadu i nie tworzy tokenów/sesji.
- CONFIG_REQUIRED_500 oznacza kontrolowany brak konfiguracji lokalnej storage health, nie zmianę SQL.
- HTML/Vite/source albo niekontrolowany 500 oznacza kandydat Stage216-D2.

${configFindings.length ? `## Config findings\n\n${configFindings.map((r) => `- ${r.endpoint}: ${r.text}`).join('\n')}\n` : ''}
## Werdykt

${hardFail ? '- FAIL: wymaga Stage216-D2 albo naprawy dev runnera, zależnie od klasyfikacji.' : '- PASS/CONTROLLED: brak twardego runtime FAIL w GET-only smoke.'}
`;

  if (WRITE) {
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, md, 'utf8');
    console.log('WROTE ' + path.relative(root, outFile));
  }

  if (hardFail) process.exitCode = 1;
})();
