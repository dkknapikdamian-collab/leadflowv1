const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  normalizeCommand,
  runDiagnostic,
  sanitizeForFileName,
  splitShellChain,
} = require('../scripts/diagnostics/run-lint-chain-first-failure.cjs');

test('splits a simple && chain in order', () => {
  assert.deepEqual(splitShellChain('one && two && three'), ['one', 'two', 'three']);
});

test('does not split && inside double quotes', () => {
  assert.deepEqual(splitShellChain('node -e "console.log(\'a && b\')" && next'), [
    'node -e "console.log(\'a && b\')"',
    'next',
  ]);
});

test('does not split && inside single quotes', () => {
  assert.deepEqual(splitShellChain("node -e 'a && b' && next"), ["node -e 'a && b'", 'next']);
});

test('rejects empty chain segments', () => {
  assert.throws(() => splitShellChain('one && && two'), /G15_R6_EMPTY_LINT_CHAIN_SEGMENT/);
});

test('rejects unterminated quotes', () => {
  assert.throws(() => splitShellChain('one && "two'), /G15_R6_UNTERMINATED_QUOTE/);
});

test('normalizes npm.cmd only outside Windows', () => {
  assert.equal(normalizeCommand('npm.cmd run check', 'linux'), 'npm run check');
  assert.equal(normalizeCommand('npm.cmd run check', 'win32'), 'npm.cmd run check');
});

test('creates bounded file-safe names', () => {
  const value = sanitizeForFileName('npm run check:thing -- --flag');
  assert.match(value, /^[a-z0-9-]+$/);
  assert.ok(value.length <= 80);
});

test('stops at first nonzero command and records prior passes', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'g15-r6-'));
  const packagePath = path.join(root, 'package.json');
  const artifactRoot = path.join(root, '_project/artifacts/g15-r6-lint-chain');
  fs.writeFileSync(packagePath, JSON.stringify({ scripts: { lint: 'first && second && third' } }));

  const calls = [];
  const spawn = (command) => {
    calls.push(command);
    if (command === 'second') return { status: 7, stdout: '', stderr: 'SECOND_FAILED' };
    return { status: 0, stdout: `${command}_PASS`, stderr: '' };
  };

  const summary = runDiagnostic({ root, packagePath, artifactRoot, platform: 'linux', spawn });

  assert.deepEqual(calls, ['first', 'second']);
  assert.equal(summary.commands_passed_before_failure, 1);
  assert.equal(summary.first_nonzero_command, 'second');
  assert.equal(summary.first_nonzero_exit_code, 7);
  assert.equal(summary.result, 'FIRST_NONZERO_IDENTIFIED');
  assert.match(fs.readFileSync(path.join(root, summary.first_nonzero_log_file), 'utf8'), /SECOND_FAILED/);
});

test('records all-pass result without inventing a failure', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'g15-r6-'));
  const packagePath = path.join(root, 'package.json');
  const artifactRoot = path.join(root, '_project/artifacts/g15-r6-lint-chain');
  fs.writeFileSync(packagePath, JSON.stringify({ scripts: { lint: 'npm.cmd run one && node two.cjs' } }));

  const calls = [];
  const spawn = (command) => {
    calls.push(command);
    return { status: 0, stdout: 'PASS', stderr: '' };
  };

  const summary = runDiagnostic({ root, packagePath, artifactRoot, platform: 'linux', spawn });

  assert.deepEqual(calls, ['npm run one', 'node two.cjs']);
  assert.equal(summary.commands_passed_before_failure, 2);
  assert.equal(summary.first_nonzero_command, null);
  assert.equal(summary.result, 'ALL_COMMANDS_PASS');
});
