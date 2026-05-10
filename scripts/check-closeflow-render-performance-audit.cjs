#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const results = [];

const docPath = 'docs/perf/CLOSEFLOW_RENDER_PERFORMANCE_AUDIT_2026-05-09.md';
const scriptPath = 'scripts/check-closeflow-render-performance-audit.cjs';

function readRequired(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) {
    results.push({ level: 'FAIL', scope: relativePath, message: 'Missing file' });
    return '';
  }
  return fs.readFileSync(full, 'utf8');
}

function pass(scope, message) {
  results.push({ level: 'PASS', scope, message });
}

function fail(scope, message) {
  results.push({ level: 'FAIL', scope, message });
}

function assertIncludes(scope, content, needle, message) {
  if (content.includes(needle)) pass(scope, message || 'Found: ' + needle);
  else fail(scope, (message || 'Missing: ' + needle) + ' [needle=' + JSON.stringify(needle) + ']');
}

function assertRegex(scope, content, regex, message) {
  if (regex.test(content)) pass(scope, message || 'Matched: ' + regex);
  else fail(scope, (message || 'Missing regex: ' + regex) + ' [regex=' + regex + ']');
}

function assertMinCount(scope, content, regex, min, message) {
  const matches = content.match(regex) || [];
  if (matches.length >= min) pass(scope, `${message}: ${matches.length}/${min}`);
  else fail(scope, `${message}: ${matches.length}/${min}`);
}

function section(title) {
  console.log('\n== ' + title + ' ==');
}

const doc = readRequired(docPath);
const self = readRequired(scriptPath);

section('PERF-0 document identity');
for (const marker of [
  'PERF-0',
  'Render/performance audit without feature cuts',
  'bez zmian runtime',
  'bez usuwania funkcji',
  'bez zmiany UX',
  'bez uproszczania logiki biznesowej przez kasowanie',
]) {
  assertIncludes(docPath, doc, marker, 'Document contains marker: ' + marker);
}

section('Required files to inspect');
for (const file of [
  'src/lib/supabase-fallback.ts',
  'src/pages/TodayStable.tsx',
  'src/pages/TasksStable.tsx',
  'src/pages/Leads.tsx',
  'src/pages/Clients.tsx',
  'src/pages/Cases.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/CaseDetail.tsx',
  'src/lib/work-items/*',
  'src/lib/nearest-action.ts',
  'src/lib/relation-value.ts',
]) {
  assertIncludes(docPath, doc, file, 'Audit file listed: ' + file);
}

section('Required audit themes');
for (const theme of [
  'Podwójne fetchowanie',
  'Reload całej listy po drobnej mutacji',
  'Brak cache invalidation tylko dla encji',
  'Ciężkie useMemo po dużych listach',
  'Filtrowanie/sortowanie bez normalizacji danych',
  'Zbyt szerokie importy ikon',
]) {
  assertIncludes(docPath, doc, theme, 'Theme present: ' + theme);
}

section('Concrete optimization backlog');
assertMinCount(docPath, doc, /PERF-OPT-\d{2}/g, 10, 'At least 10 concrete PERF-OPT items');
for (const marker of [
  'PERF-OPT-01',
  'PERF-OPT-02',
  'PERF-OPT-03',
  'PERF-OPT-04',
  'PERF-OPT-05',
  'PERF-OPT-06',
  'PERF-OPT-07',
  'PERF-OPT-08',
  'PERF-OPT-09',
  'PERF-OPT-10',
  'PERF-OPT-11',
  'PERF-OPT-12',
]) {
  assertIncludes(docPath, doc, marker, 'Optimization item present: ' + marker);
}

section('No feature-cut guardrails');
for (const marker of [
  'Nie usuwać funkcji.',
  'Nie usuwać ekranów.',
  'Nie zmieniać UX.',
  'Nie kasować działających flow.',
  'Nie mieszać tego etapu z visual systemem.',
]) {
  assertIncludes(docPath, doc, marker, 'Guardrail present: ' + marker);
}

section('Evidence and next stages');
for (const marker of [
  'Network',
  'React Profiler',
  'Bundle',
  'PERF-1 - Pomiar i request log evidence',
  'PERF-2 - Supabase fallback dedupe i entity invalidation',
  'PERF-3 - Work-items relation index',
  'PERF-4 - TodayStable render pass cleanup',
  'PERF-5 - TasksStable/Calendar mutation refresh narrowing',
  'PERF-6 - List screens derived data normalization',
  'PERF-7 - Icon import and bundle audit',
  'Kryterium zakończenia PERF-0',
]) {
  assertIncludes(docPath, doc, marker, 'Evidence/stage marker present: ' + marker);
}

section('Self check');
assertIncludes(scriptPath, self, 'CLOSEFLOW_RENDER_PERFORMANCE_AUDIT_PERF0_OK', 'Stable success marker exists in check script');

section('Report');
for (const item of results) {
  console.log(item.level + ' ' + item.scope + ': ' + item.message);
}

const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL CLOSEFLOW_RENDER_PERFORMANCE_AUDIT_PERF0_CHECK_FAILED');
  process.exit(1);
}

console.log('\nCLOSEFLOW_RENDER_PERFORMANCE_AUDIT_PERF0_OK');
