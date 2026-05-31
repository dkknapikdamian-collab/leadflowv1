#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const STAGE = 'Stage216-A2';
const appUrlRaw = process.env.CLOSEFLOW_APP_URL || process.env.VITE_CLOSEFLOW_APP_URL || '';
const workspaceId = process.env.CLOSEFLOW_WORKSPACE_ID || process.env.VITE_CLOSEFLOW_WORKSPACE_ID || '';
const writeReport = process.argv.includes('--write');

function normalizeBaseUrl(value) {
  return String(value || '').trim().replace(/\/+$/, '');
}

function nowStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function rowId(row) {
  if (!row || typeof row !== 'object') return '';
  return String(row.id || row._id || '').trim();
}

function isJsonLike(contentType) {
  return /application\/json|\+json/i.test(String(contentType || ''));
}

async function probeEndpoint(baseUrl, item) {
  const headers = { Accept: 'application/json' };
  if (workspaceId) {
    headers['x-workspace-id'] = workspaceId;
    headers['x-closeflow-workspace-id'] = workspaceId;
  }

  const url = `${baseUrl}${item.path}`;
  const startedAt = Date.now();
  let response;
  try {
    response = await fetch(url, { method: 'GET', headers });
  } catch (error) {
    return {
      label: item.label,
      path: item.path,
      status: 'FAIL',
      httpStatus: 0,
      durationMs: Date.now() - startedAt,
      error: `FETCH_FAILED:${error?.message || String(error)}`,
      hint: 'Czy aplikacja działa na CLOSEFLOW_APP_URL? Najpierw uruchom npm run dev albo sprawdź URL produkcyjny.',
    };
  }

  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();
  const durationMs = Date.now() - startedAt;

  let parsed = null;
  let parseError = '';
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      parseError = error?.message || String(error);
    }
  }

  const nonJsonHtml = text.trim().startsWith('<') || /<!doctype html/i.test(text);
  const unauthorized = response.status === 401 || response.status === 403;
  const notFound = response.status === 404;

  if (!isJsonLike(contentType) && text && nonJsonHtml) {
    return {
      label: item.label,
      path: item.path,
      status: 'FAIL',
      httpStatus: response.status,
      durationMs,
      error: 'NON_JSON_HTML_RESPONSE',
      contentType,
      sample: text.slice(0, 180),
      hint: 'Endpoint zwrócił HTML zamiast JSON. To kandydat na INVALID_API_RESPONSE w aplikacji.',
    };
  }

  if (parseError && text) {
    return {
      label: item.label,
      path: item.path,
      status: 'FAIL',
      httpStatus: response.status,
      durationMs,
      error: `NON_JSON_RESPONSE:${parseError}`,
      contentType,
      sample: text.slice(0, 180),
    };
  }

  if (unauthorized) {
    return {
      label: item.label,
      path: item.path,
      status: 'AUTH_REQUIRED',
      httpStatus: response.status,
      durationMs,
      json: parsed,
      note: 'Endpoint działa jako JSON, ale wymaga poprawnego auth/workspace context. To nie jest błąd parsowania.',
    };
  }

  if (notFound && item.allow404) {
    return {
      label: item.label,
      path: item.path,
      status: 'NOT_FOUND_OK',
      httpStatus: response.status,
      durationMs,
      json: parsed,
    };
  }

  if (!response.ok) {
    return {
      label: item.label,
      path: item.path,
      status: 'FAIL',
      httpStatus: response.status,
      durationMs,
      error: parsed?.error || `HTTP_${response.status}`,
      json: parsed,
    };
  }

  const shapeOk = item.expectArray ? Array.isArray(parsed) : Boolean(parsed && typeof parsed === 'object');
  return {
    label: item.label,
    path: item.path,
    status: shapeOk ? 'PASS' : 'FAIL',
    httpStatus: response.status,
    durationMs,
    count: Array.isArray(parsed) ? parsed.length : undefined,
    firstId: Array.isArray(parsed) ? rowId(parsed[0]) : rowId(parsed),
    error: shapeOk ? undefined : 'UNEXPECTED_JSON_SHAPE',
    json: shapeOk ? undefined : parsed,
  };
}

function buildReport(results, baseUrl) {
  const pass = results.filter((r) => r.status === 'PASS').length;
  const auth = results.filter((r) => r.status === 'AUTH_REQUIRED').length;
  const soft = results.filter((r) => r.status === 'NOT_FOUND_OK').length;
  const fail = results.filter((r) => r.status === 'FAIL').length;
  const lines = [];
  lines.push(`# STAGE216-A2 LCC runtime GET-only smoke result`);
  lines.push('');
  lines.push(`- generated_at: ${new Date().toISOString()}`);
  lines.push(`- app_url: ${baseUrl}`);
  lines.push(`- workspace_header_present: ${workspaceId ? 'yes' : 'no'}`);
  lines.push(`- mode: GET-only, no writes, no SQL/RLS/GRANT changes`);
  lines.push(`- summary: PASS ${pass}, AUTH_REQUIRED ${auth}, NOT_FOUND_OK ${soft}, FAIL ${fail}`);
  lines.push('');
  lines.push('| status | http | endpoint | duration | detail |');
  lines.push('|---|---:|---|---:|---|');
  for (const result of results) {
    const detail = result.error || result.note || (result.count !== undefined ? `count=${result.count}` : '') || '';
    lines.push(`| ${result.status} | ${result.httpStatus} | ${result.path} | ${result.durationMs}ms | ${String(detail).replace(/\|/g, '/')} |`);
  }
  lines.push('');
  lines.push('## Interpretacja');
  lines.push('');
  lines.push('- `PASS`: endpoint zwrócił JSON o oczekiwanym kształcie.');
  lines.push('- `AUTH_REQUIRED`: endpoint działa jako JSON, ale wymaga prawidłowego auth/workspace context. To jest oczekiwane w wielu lokalnych runach bez sesji.');
  lines.push('- `FAIL`: wymaga Stage216-A3 albo ręcznej diagnostyki. Szczególnie ważne są HTML/non-JSON, bo frontend może pokazać `INVALID_API_RESPONSE`.');
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const baseUrl = normalizeBaseUrl(appUrlRaw);
  if (!baseUrl) {
    console.error(`${STAGE}_MISSING_CLOSEFLOW_APP_URL`);
    console.error('Ustaw np. $env:CLOSEFLOW_APP_URL="http://localhost:3000" albo URL produkcyjny.');
    process.exit(2);
  }

  const endpoints = [
    { label: 'leads list', path: '/api/leads', expectArray: true },
    { label: 'clients list', path: '/api/clients', expectArray: true },
    { label: 'cases list', path: '/api/cases', expectArray: true },
  ];

  const results = [];
  for (const endpoint of endpoints) {
    const result = await probeEndpoint(baseUrl, endpoint);
    results.push(result);
    if (result.status === 'PASS' && result.firstId) {
      results.push(await probeEndpoint(baseUrl, {
        label: `${endpoint.label} detail`,
        path: `${endpoint.path}?id=${encodeURIComponent(result.firstId)}`,
        expectArray: false,
        allow404: true,
      }));
    }
  }

  for (const result of results) {
    const suffix = result.error ? ` - ${result.error}` : result.note ? ` - ${result.note}` : result.count !== undefined ? ` - count=${result.count}` : '';
    console.log(`${result.status} ${result.httpStatus} ${result.path}${suffix}`);
  }

  const failCount = results.filter((r) => r.status === 'FAIL').length;
  const report = buildReport(results, baseUrl);

  if (writeReport) {
    const outDir = path.join(process.cwd(), '_project', 'reports');
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `STAGE216A2_LCC_RUNTIME_SMOKE_RESULT_${nowStamp()}.md`);
    fs.writeFileSync(outPath, report, 'utf8');
    console.log(`Report written: ${path.relative(process.cwd(), outPath)}`);
  }

  if (failCount) {
    console.error(`\n${STAGE}_RUNTIME_SMOKE_FAILED: ${failCount} failed endpoint(s).`);
    process.exit(1);
  }

  console.log(`\n${STAGE}_RUNTIME_SMOKE_OK: no hard FAIL. AUTH_REQUIRED may still require manual logged-in browser QA.`);
}

main().catch((error) => {
  console.error(`${STAGE}_RUNTIME_SMOKE_CRASHED`, error?.message || String(error));
  process.exit(1);
});
