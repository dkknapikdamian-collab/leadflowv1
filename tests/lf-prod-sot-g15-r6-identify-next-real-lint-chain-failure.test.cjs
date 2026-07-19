const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  normalizeCommand,
  runDiagnostic,
  splitAndChain,
  tailLines,
} = require('../scripts/diagnose-lint-chain-first-failure.cjs');

test('01 splitAndChain preserves command order', () => {
  assert.deepEqual(splitAndChain('one && two && three'), ['one', 'two', 'three']);
});

test('02 splitAndChain does not split quoted double ampersands', () => {
  assert.deepEqual(
    splitAndChain('node -e "console.log(\'a && b\')" && node second.cjs'),
    ['node -e "console.log(\'a && b\')"', 'node second.cjs'],
  );
});

test('03 splitAndChain rejects empty commands', () => {
  assert.throws(() => splitAndChain('one && && two'), /EMPTY_LINT_COMMAND/);
});

test('04 normalizeCommand uses npm on non-Windows systems', () => {
  assert.equal(normalizeCommand('npm.cmd run a && npm.cmd run b', 'linux'), 'npm run a && npm run b');
});

test('05 normalizeCommand preserves npm.cmd on Windows', () => {
  assert.equal(normalizeCommand('npm.cmd run a', 'win32'), 'npm.cmd run a');
});

test('06 tailLines returns only the requested tail', () => {
  assert.equal(tailLines('1\n2\n3\n4', 2), '3\n4');
});

test('07 diagnostic stops at first non-zero and records exact evidence', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'g15-r6-test-'));
  try {
    const packagePath = path.join(tmp, 'package.json');
    const outputDirectory = path.join(tmp, 'artifact');
    const pass = `${JSON.stringify(process.execPath)} -e "process.exit(0)"`;
    const fail = `${JSON.stringify(process.execPath)} -e "console.error('G15_R6_EXPECTED_FAILURE'); process.exit(7)"`;
    const forbiddenAfterFailure = `${JSON.stringify(process.execPath)} -e "process.exit(99)"`;
    fs.writeFileSync(packagePath, JSON.stringify({ scripts: { lint: `${pass} && ${fail} && ${forbiddenAfterFailure}` } }));

    const result = runDiagnostic({ packagePath, outputDirectory, platform: process.platform });
    assert.equal(result.result, 'PASS_FIRST_NONZERO_IDENTIFIED');
    assert.equal(result.commandsPassedBeforeFailure, 1);
    assert.equal(result.commands.length, 2);
    assert.equal(result.firstNonzero.index, 2);
    assert.equal(result.firstNonzero.exitCode, 7);
    assert.match(result.firstNonzero.tail, /G15_R6_EXPECTED_FAILURE/);
    assert.ok(fs.existsSync(path.join(outputDirectory, 'diagnostic.json')));
    assert.ok(fs.existsSync(path.join(outputDirectory, 'diagnostic.txt')));
    assert.ok(fs.existsSync(path.join(outputDirectory, '02-nonzero.log')));
    assert.equal(fs.existsSync(path.join(outputDirectory, '03-nonzero.log')), false);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('08 diagnostic reports all-green without inventing a failure', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'g15-r6-green-'));
  try {
    const packagePath = path.join(tmp, 'package.json');
    const outputDirectory = path.join(tmp, 'artifact');
    const pass = `${JSON.stringify(process.execPath)} -e "process.exit(0)"`;
    fs.writeFileSync(packagePath, JSON.stringify({ scripts: { lint: `${pass} && ${pass}` } }));
    const result = runDiagnostic({ packagePath, outputDirectory, platform: process.platform });
    assert.equal(result.result, 'PASS_LINT_CHAIN_ALL_GREEN');
    assert.equal(result.firstNonzero, null);
    assert.equal(result.commandsPassedBeforeFailure, 2);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
