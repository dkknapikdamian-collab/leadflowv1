#!/usr/bin/env node
/* STAGE223_R2W_MASS_RELEASE_GATE_SCAN
 * Runs quiet release-gate test files one by one and keeps going after failures.
 * Goal: reveal multiple blockers in one run instead of discovering one failing test per ZIP.
 */
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const quietPath = path.join(root, 'scripts', 'closeflow-release-check-quiet.cjs');
const reportDir = path.join(root, '_project', 'reports');
fs.mkdirSync(reportDir, { recursive: true });

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/^\uFEFF/, '');
}

function extractQuietTests() {
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const found = new Set();
  const regex = /tests\/[A-Za-z0-9._\-\/]+\.test\.cjs/g;
  for (const match of quiet.matchAll(regex)) {
    found.add(match[0]);
  }
  return [...found].sort();
}

function runTest(testPath) {
  const result = spawnSync(process.execPath, ['--test', testPath], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 10,
  });

  return {
    testPath,
    status: result.status,
    ok: result.status === 0,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function firstUsefulLine(output) {
  const lines = output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const preferred = lines.find((line) => /AssertionError|ENOENT|FAILED|Error:|ERR_ASSERTION|SyntaxError/i.test(line));
  return preferred || lines.slice(-1)[0] || '';
}

const tests = extractQuietTests();
const startedAt = new Date().toISOString();

console.log(`STAGE223_R2W_MASS_RELEASE_GATE_SCAN_START tests=${tests.length}`);

const results = [];
for (const testPath of tests) {
  const result = runTest(testPath);
  results.push(result);
  const status = result.ok ? 'OK' : 'FAIL';
  console.log(`${status} ${testPath}`);
  if (!result.ok) {
    console.log(`  ${firstUsefulLine(result.stderr || result.stdout)}`);
  }
}

const failed = results.filter((item) => !item.ok);
const finishedAt = new Date().toISOString();
const reportPath = path.join(reportDir, `STAGE223_R2W_MASS_RELEASE_GATE_SCAN_${startedAt.replace(/[:.]/g, '-')}.json`);

fs.writeFileSync(reportPath, JSON.stringify({
  stage: 'STAGE223_R2W_MASS_RELEASE_GATE_SCAN',
  startedAt,
  finishedAt,
  total: results.length,
  pass: results.length - failed.length,
  fail: failed.length,
  failed: failed.map((item) => ({
    testPath: item.testPath,
    status: item.status,
    summary: firstUsefulLine(item.stderr || item.stdout),
    stdoutTail: item.stdout.split(/\r?\n/).slice(-40).join('\n'),
    stderrTail: item.stderr.split(/\r?\n/).slice(-40).join('\n'),
  })),
}, null, 2));

console.log(`STAGE223_R2W_MASS_RELEASE_GATE_SCAN_REPORT ${path.relative(root, reportPath)}`);

if (failed.length) {
  console.error(`STAGE223_R2W_MASS_RELEASE_GATE_SCAN_FAILED count=${failed.length}`);
  for (const item of failed) {
    console.error(`FAIL ${item.testPath}: ${firstUsefulLine(item.stderr || item.stdout)}`);
  }
  process.exit(1);
}

console.log('STAGE223_R2W_MASS_RELEASE_GATE_SCAN_OK');
