#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = process.cwd();
const outputDir = path.join(root, '_project', 'artifacts', 'g15-r23a-active-tsc');
const logPath = path.join(outputDir, 'tsc.log');
const summaryPath = path.join(outputDir, 'summary.json');

function normalizeFile(file) {
  const normalized = String(file || '').replaceAll('\\', '/');
  if (!path.isAbsolute(normalized)) return normalized.replace(/^\.\//, '');
  return path.relative(root, normalized).replaceAll('\\', '/');
}

function parseTscOutput(text) {
  const errors = [];
  const globalErrors = [];
  for (const rawLine of String(text || '').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const located = line.match(/^(.*?)\((\d+),(\d+)\): error (TS\d+):\s*(.*)$/);
    if (located) {
      errors.push({
        file: normalizeFile(located[1]),
        line: Number(located[2]),
        column: Number(located[3]),
        code: located[4],
        message: located[5],
      });
      continue;
    }
    const global = line.match(/^error (TS\d+):\s*(.*)$/);
    if (global) globalErrors.push({ code: global[1], message: global[2] });
  }
  return { errors, globalErrors };
}

function buildSummary(exitCode, parsed) {
  const nonActiveErrors = parsed.errors.filter((error) => !/^(src|api)\//.test(error.file) && error.file !== 'vite.config.ts');
  const countsByFile = {};
  for (const error of parsed.errors) countsByFile[error.file] = (countsByFile[error.file] || 0) + 1;
  const orderedFiles = Object.entries(countsByFile)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([file, count]) => ({ file, count }));

  let status = 'ALL_GREEN';
  if (exitCode !== 0 && parsed.globalErrors.length) status = 'GLOBAL_TYPE_FOUNDATION_ERROR';
  else if (exitCode !== 0 && nonActiveErrors.length) status = 'NON_PRODUCT_SCOPE_LEAK';
  else if (exitCode !== 0 && parsed.errors.length) status = 'ACTIVE_TYPE_DEBT_IDENTIFIED';
  else if (exitCode !== 0) status = 'UNCLASSIFIED_TSC_FAILURE';

  return {
    stage: 'LF-PROD-SOT-G15-R23A_TSC_ACTIVE_SCOPE_AND_TYPE_DEBT_MAP',
    status,
    tscExitCode: exitCode,
    errorCount: parsed.errors.length,
    globalErrorCount: parsed.globalErrors.length,
    nonActiveErrorCount: nonActiveErrors.length,
    firstError: parsed.errors[0] || parsed.globalErrors[0] || null,
    files: orderedFiles,
    globalErrors: parsed.globalErrors,
    nonActiveErrors,
  };
}

function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const result = spawnSync(command, ['tsc', '--noEmit', '--pretty', 'false'], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  const combined = [result.stdout || '', result.stderr || ''].filter(Boolean).join('\n');
  fs.writeFileSync(logPath, combined, 'utf8');
  const parsed = parseTscOutput(combined);
  const summary = buildSummary(Number.isInteger(result.status) ? result.status : 1, parsed);
  fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(summary, null, 2));

  if (summary.status === 'GLOBAL_TYPE_FOUNDATION_ERROR') process.exit(2);
  if (summary.status === 'NON_PRODUCT_SCOPE_LEAK') process.exit(3);
  if (summary.status === 'UNCLASSIFIED_TSC_FAILURE') process.exit(4);
}

if (require.main === module) main();

module.exports = { normalizeFile, parseTscOutput, buildSummary };
