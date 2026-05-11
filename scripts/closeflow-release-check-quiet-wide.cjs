#!/usr/bin/env node
'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const quietGatePath = path.join(repoRoot, 'scripts', 'closeflow-release-check-quiet.cjs');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}

function extractRequiredTests() {
  const source = read(quietGatePath);
  const tests = [];
  const seen = new Set();
  for (const match of source.matchAll(/['"](tests\/[^'"\n]+\.test\.cjs)['"]/g)) {
    const relativePath = match[1];
    if (!seen.has(relativePath)) {
      seen.add(relativePath);
      tests.push(relativePath);
    }
  }
  if (tests.length === 0) {
    throw new Error('No tests found in closeflow-release-check-quiet.cjs');
  }
  return tests;
}

function run(label, command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    shell: false,
  });
  return {
    label,
    status: result.status || 0,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    error: result.error || null,
  };
}

function main() {
  const tests = extractRequiredTests();
  const failures = [];

  for (const relativePath of tests) {
    const abs = path.join(repoRoot, relativePath);
    if (!fs.existsSync(abs)) {
      console.log('FAIL ' + relativePath);
      failures.push({ relativePath, stdout: '', stderr: 'Missing required test: ' + relativePath, status: 1 });
      continue;
    }
    const result = run(relativePath, process.execPath, ['--test', relativePath]);
    if (result.error || result.status !== 0) {
      console.log('FAIL ' + relativePath);
      failures.push({ relativePath, stdout: result.stdout, stderr: result.stderr || String(result.error || ''), status: result.status || 1 });
    } else {
      console.log('OK ' + relativePath);
    }
  }

  if (failures.length > 0) {
    console.error('');
    console.error('CLOSEFLOW_WIDE_QUIET_GATE_FAILED count=' + failures.length);
    for (const failure of failures) {
      console.error('');
      console.error('FAILED: ' + failure.relativePath);
      if (failure.stdout) console.error(failure.stdout);
      if (failure.stderr) console.error(failure.stderr);
    }
    process.exit(1);
  }

  console.log('');
  console.log('CLOSEFLOW_WIDE_QUIET_GATE_OK count=' + tests.length);
}

main();
