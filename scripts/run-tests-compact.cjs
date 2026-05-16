#!/usr/bin/env node
/*
  CloseFlow compact test runner.
  Cel: uruchamia\u0107 testy bez zalewania konsoli pe\u0142n\u0105 zawarto\u015Bci\u0105 plik\u00F3w z AssertionError.actual.
  Pe\u0142ny log zawsze trafia do test-results/last-test-full.log.
*/
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const args = process.argv.slice(2);
const mode = args.includes('--critical') ? 'critical' : 'all';
const passthrough = args.filter((arg) => arg !== '--critical' && arg !== '--raw');

const resultDir = path.join(root, 'test-results');
const fullLogPath = path.join(resultDir, 'last-test-full.log');
const summaryPath = path.join(resultDir, 'last-test-summary.txt');

function fileExists(relPath) {
  return fs.existsSync(path.join(root, relPath));
}

function listCriticalTests() {
  const critical = [
    'tests/a13-critical-regressions.test.cjs',
    'tests/supabase-workspace-auth-contract.test.cjs',
    'tests/today-ai-drafts-tile-stage29.test.cjs',
    'tests/today-action-layout-not-column-cramped.test.cjs',
    'tests/today-funnel-dedup-stage11.test.cjs',
    'tests/task-form-visual-rebuild.test.cjs',
  ];
  return critical.filter(fileExists);
}

function normalizeLine(line) {
  return String(line || '')
    .replace(/\x1b\[[0-9;]*m/g, '')
    .replace(/\r/g, '')
    .trim();
}

function truncate(value, max = 220) {
  const text = normalizeLine(value).replace(/\s+/g, ' ');
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + '\u2026';
}

function extractFailures(log) {
  const lines = String(log || '').split(/\n/);
  const failures = [];
  let lastSubtest = '';
  let lastLocation = '';

  for (let index = 0; index < lines.length; index += 1) {
    const line = normalizeLine(lines[index]);
    if (!line) continue;

    const subtestMatch = line.match(/^#\s+Subtest:\s+(.+)$/i);
    if (subtestMatch) {
      lastSubtest = truncate(subtestMatch[1], 180);
      lastLocation = '';
      continue;
    }

    const locationMatch = line.match(/^#\s+(?:at\s+)?([^\s]+\.test\.cjs:\d+:\d+)/i);
    if (locationMatch) {
      lastLocation = truncate(locationMatch[1], 180);
      continue;
    }

    const notOkMatch = line.match(/^not ok\s+\d+\s+-\s+(.+)$/i);
    if (notOkMatch) {
      failures.push({
        name: truncate(notOkMatch[1], 180),
        location: lastLocation,
        reason: '',
      });
      continue;
    }

    const crossMatch = line.match(/^(?:\u2716|\u00D7|x)\s+(.+?)(?:\s+\([^)]+\))?$/i);
    if (crossMatch && !line.includes('tests failed')) {
      failures.push({
        name: truncate(crossMatch[1], 180),
        location: lastLocation,
        reason: '',
      });
      continue;
    }

    const failScriptMatch = line.match(/^FAIL\s+(.+)$/i);
    if (failScriptMatch) {
      failures.push({
        name: lastSubtest || 'script failure',
        location: lastLocation,
        reason: truncate(failScriptMatch[0], 220),
      });
      continue;
    }

    const assertionMatch = line.match(/^(AssertionError|Error|TypeError|SyntaxError|ReferenceError)\b.*$/);
    if (assertionMatch && failures.length) {
      const current = failures[failures.length - 1];
      if (!current.reason) current.reason = truncate(line, 220);
    }
  }

  const seen = new Set();
  return failures.filter((failure) => {
    const key = `${failure.name}::${failure.location}::${failure.reason}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractTotals(log) {
  const source = String(log || '');
  const tests = source.match(/#\s+tests\s+(\d+)/i)?.[1] || '';
  const pass = source.match(/#\s+pass\s+(\d+)/i)?.[1] || '';
  const fail = source.match(/#\s+fail\s+(\d+)/i)?.[1] || '';
  const duration = source.match(/#\s+duration_ms\s+([0-9.]+)/i)?.[1] || '';
  return { tests, pass, fail, duration };
}

function printSummary({ status, log, selectedTests }) {
  const failures = extractFailures(log);
  const totals = extractTotals(log);
  const summaryLines = [];

  summaryLines.push('== CloseFlow compact test summary ==');
  summaryLines.push(`Mode: ${mode}`);
  if (selectedTests.length && mode === 'critical') summaryLines.push(`Critical files: ${selectedTests.length}`);
  if (totals.tests || totals.pass || totals.fail) {
    summaryLines.push(`Tests: ${totals.tests || '?'} | Pass: ${totals.pass || '0'} | Fail: ${totals.fail || '0'}${totals.duration ? ` | ${Math.round(Number(totals.duration))} ms` : ''}`);
  }
  summaryLines.push(`Full log: ${path.relative(root, fullLogPath)}`);
  summaryLines.push('');

  if (status === 0) {
    summaryLines.push('OK: testy przesz\u0142y.');
  } else {
    summaryLines.push(`FAIL: testy nie przesz\u0142y. Pokazuj\u0119 tylko kr\u00F3tk\u0105 list\u0119, bez pe\u0142nych diff\u00F3w i bez zawarto\u015Bci plik\u00F3w.`);
    summaryLines.push('');
    if (!failures.length) {
      summaryLines.push('Nie uda\u0142o si\u0119 wyci\u0105gn\u0105\u0107 nazw test\u00F3w z logu. Otw\u00F3rz pe\u0142ny log z pliku powy\u017Cej.');
    } else {
      failures.slice(0, 40).forEach((failure, index) => {
        summaryLines.push(`${index + 1}. ${failure.name}`);
        if (failure.location) summaryLines.push(`   ${failure.location}`);
        if (failure.reason) summaryLines.push(`   ${failure.reason}`);
      });
      if (failures.length > 40) summaryLines.push(`... oraz ${failures.length - 40} kolejnych b\u0142\u0119d\u00F3w w pe\u0142nym logu.`);
    }
  }

  const summary = summaryLines.join('\n');
  fs.writeFileSync(summaryPath, summary + '\n', 'utf8');
  console.log(summary);
}

fs.mkdirSync(resultDir, { recursive: true });

const selectedTests = mode === 'critical' ? listCriticalTests() : [];
const nodeArgs = mode === 'critical'
  ? ['--test', '--test-reporter=tap', ...selectedTests, ...passthrough]
  : ['--test', '--test-reporter=tap', 'tests/**/*.test.cjs', ...passthrough];

if (mode === 'critical' && selectedTests.length === 0) {
  console.error('FAIL: nie znaleziono plik\u00F3w test\u00F3w krytycznych.');
  process.exit(1);
}

const result = spawnSync(process.execPath, nodeArgs, {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 1024 * 1024 * 80,
  env: process.env,
});

const stdout = result.stdout || '';
const stderr = result.stderr || '';
const log = [
  `$ ${process.execPath} ${nodeArgs.join(' ')}`,
  '',
  stdout,
  stderr,
].join('\n');

fs.writeFileSync(fullLogPath, log, 'utf8');

if (result.error) {
  const message = `Runner error: ${result.error.message}`;
  fs.appendFileSync(fullLogPath, `\n${message}\n`, 'utf8');
  console.error(message);
  process.exit(1);
}

printSummary({ status: result.status || 0, log, selectedTests });
process.exit(result.status || 0);
