#!/usr/bin/env node
/*
  CloseFlow Stage216-B runtime smoke.
  GET-only probe for tasks/events/calendar-related API routes.

  Expected use:
    $env:CLOSEFLOW_APP_URL="http://localhost:3000"
    $env:CLOSEFLOW_WORKSPACE_ID="real-workspace-uuid"
    node tools/stage216b-tasks-events-calendar-runtime-smoke.cjs --write
*/

const fs = require('node:fs');
const path = require('node:path');

const STAGE = 'STAGE216B';
const REPORT_PATH = path.join('_project', 'reports', 'STAGE216B_TASKS_EVENTS_CALENDAR_RUNTIME_SMOKE_RESULT_2026-05-31.md');

const DEFAULT_ENDPOINTS = [
  '/api/tasks',
  '/api/events',
  '/api/work-items?kind=tasks',
  '/api/work-items?kind=events',
  '/api/system?apiRoute=tasks',
  '/api/system?apiRoute=events',
];

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {
    write: args.includes('--write'),
    json: args.includes('--json'),
    failOnAuth: args.includes('--fail-on-auth'),
  };
  const endpointArg = args.find((x) => x.startsWith('--endpoint='));
  if (endpointArg) out.endpoints = endpointArg.slice('--endpoint='.length).split(',').map((x) => x.trim()).filter(Boolean);
  return out;
}

function normalizeBaseUrl(input) {
  const raw = input || process.env.CLOSEFLOW_APP_URL || 'http://localhost:3000';
  return raw.replace(/\/+$/, '');
}

function endpointUrl(baseUrl, endpoint) {
  const url = new URL(endpoint, `${baseUrl}/`);
  return url.toString();
}

function looksLikeHtml(text) {
  return /<!doctype\s+html|<html[\s>]|<head[\s>]|<body[\s>]/i.test(text || '');
}

function looksLikeViteSource(text) {
  const sample = text || '';
  return /import\s+\{[^}]+\}\s+from\s+["']\/?src\//.test(sample)
    || /import\.meta\.hot|\/node_modules\/\.vite\//.test(sample)
    || /from\s+["']\/@vite\//.test(sample)
    || /Vite\s+dev/i.test(sample);
}

function safeJsonParse(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

function classifyResponse({ status, contentType, text }) {
  const trimmed = (text || '').trim();
  const jsonish = /application\/json|\+json/i.test(contentType || '') || /^[\[{]/.test(trimmed);
  const parsed = jsonish ? safeJsonParse(trimmed) : { ok: false, error: 'not-jsonish' };

  if (looksLikeViteSource(trimmed)) {
    return { verdict: 'FAIL', code: 'VITE_DEV_API_SOURCE_RESPONSE', json: false, parsed };
  }

  if (looksLikeHtml(trimmed)) {
    return { verdict: 'FAIL', code: 'NON_JSON_HTML_RESPONSE', json: false, parsed };
  }

  if (!parsed.ok) {
    return { verdict: 'FAIL', code: 'NON_JSON_RESPONSE', json: false, parsed };
  }

  if (status === 401 || status === 403) {
    return { verdict: 'PASS_AUTH_REQUIRED', code: `AUTH_REQUIRED_${status}`, json: true, parsed };
  }

  if (status >= 500) {
    return { verdict: 'FAIL', code: `SERVER_ERROR_${status}`, json: true, parsed };
  }

  if (status >= 400) {
    return { verdict: 'WARN_CLIENT_ERROR_JSON', code: `CLIENT_ERROR_${status}`, json: true, parsed };
  }

  return { verdict: 'PASS', code: `JSON_${status}`, json: true, parsed };
}

async function probe(baseUrl, endpoint) {
  const url = endpointUrl(baseUrl, endpoint);
  const headers = {
    'Accept': 'application/json',
    'X-CloseFlow-Stage': STAGE,
  };

  if (process.env.CLOSEFLOW_WORKSPACE_ID) headers['X-Workspace-Id'] = process.env.CLOSEFLOW_WORKSPACE_ID;
  if (process.env.CLOSEFLOW_AUTH_TOKEN) headers['Authorization'] = `Bearer ${process.env.CLOSEFLOW_AUTH_TOKEN}`;

  try {
    const started = Date.now();
    const response = await fetch(url, { method: 'GET', headers, redirect: 'manual' });
    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();
    const ms = Date.now() - started;
    const classification = classifyResponse({ status: response.status, contentType, text });
    return {
      endpoint,
      url,
      status: response.status,
      contentType,
      bytes: Buffer.byteLength(text, 'utf8'),
      ms,
      preview: text.slice(0, 300).replace(/\s+/g, ' ').trim(),
      ...classification,
    };
  } catch (error) {
    return {
      endpoint,
      url,
      status: null,
      contentType: null,
      bytes: 0,
      ms: null,
      preview: String(error && error.message ? error.message : error).slice(0, 300),
      verdict: 'FAIL',
      code: 'FETCH_FAILED',
      json: false,
      parsed: { ok: false, error: String(error && error.message ? error.message : error) },
    };
  }
}

function markdownTable(results) {
  return results.map((r) => `| ${r.endpoint} | ${r.status ?? '-'} | ${r.contentType || '-'} | ${r.bytes} | ${r.ms ?? '-'} | ${r.verdict} | ${r.code} | ${String(r.preview || '').replace(/\|/g, '/')} |`).join('\n');
}

function buildReport({ baseUrl, endpoints, results }) {
  const fail = results.filter((r) => r.verdict === 'FAIL');
  const pass = results.filter((r) => r.verdict === 'PASS' || r.verdict === 'PASS_AUTH_REQUIRED');
  const warn = results.filter((r) => r.verdict === 'WARN_CLIENT_ERROR_JSON');
  const overall = fail.length ? 'FAIL' : 'PASS_WITH_AUTH_OK';

  return `---
typ: runtime_smoke_result
stage: STAGE216B
status: ${overall}
date: 2026-05-31
---

# STAGE216-B runtime smoke result - tasks/events/calendar

## Kontekst

- base_url: ${baseUrl}
- endpoints: ${endpoints.length}
- PASS/PASS_AUTH_REQUIRED: ${pass.length}
- WARN_CLIENT_ERROR_JSON: ${warn.length}
- FAIL: ${fail.length}
- generated_at: ${new Date().toISOString()}

## Tabela wyników

| Endpoint | HTTP | Content-Type | Bytes | ms | Verdict | Code | Preview |
|---|---:|---|---:|---:|---|---|---|
${markdownTable(results)}

## Interpretacja

- PASS JSON: endpoint działa jako JSON.
- AUTH_REQUIRED 401/403 JSON: endpoint żyje, auth/workspace wymagany, to nie jest INVALID_API_RESPONSE.
- NON_JSON_HTML_RESPONSE: twardy FAIL.
- VITE_DEV_API_SOURCE_RESPONSE: prawdopodobnie uruchomiono zwykłe npm run dev zamiast npm run dev:api albo route API zwraca source.
- SERVER_ERROR_500: twardy FAIL i wejście do Stage216-B2.
- FETCH_FAILED: app URL/port nie odpowiada.

## Następny krok

${fail.length ? '- Przygotować Stage216-B2 jako wąski fix dla konkretnych FAIL-i z tabeli.' : '- Wykonać ręczne QA tasks/events/calendar, potem przejść do Stage216-C.'}
`;
}

async function main() {
  const args = parseArgs();
  const baseUrl = normalizeBaseUrl(process.env.CLOSEFLOW_APP_URL);
  const endpoints = args.endpoints || DEFAULT_ENDPOINTS;
  const results = [];

  for (const endpoint of endpoints) {
    const result = await probe(baseUrl, endpoint);
    results.push(result);
    const line = `${result.code} ${result.status ?? '-'} ${endpoint} ${result.contentType || ''}`.trim();
    console.log(line);
  }

  const hasFail = results.some((r) => r.verdict === 'FAIL');
  const hasAuth = results.some((r) => r.verdict === 'PASS_AUTH_REQUIRED');
  const shouldFailAuth = args.failOnAuth && hasAuth;

  if (args.write) {
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
    fs.writeFileSync(REPORT_PATH, buildReport({ baseUrl, endpoints, results }), 'utf8');
    console.log(`WROTE ${REPORT_PATH}`);
  }

  if (args.json) {
    console.log(JSON.stringify({ baseUrl, endpoints, results }, null, 2));
  }

  if (hasFail || shouldFailAuth) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
