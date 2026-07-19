const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const wrapper = fs.readFileSync(path.join(root, 'scripts/run-lint-cross-platform.cjs'), 'utf8').replace(/\r\n/g, '\n');
const workflow = fs.readFileSync(path.join(root, '.github/workflows/ci.yml'), 'utf8').replace(/\r\n/g, '\n');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const lint = String(packageJson.scripts.lint || '');

test('01 existing lint command contains the Windows-only npm.cmd debt being bridged', () => {
  assert.match(lint, /\bnpm\.cmd\b/);
});

test('02 wrapper selects npm.cmd only on Windows and npm elsewhere', () => {
  assert.match(wrapper, /process\.platform === 'win32' \? 'npm\.cmd' : 'npm'/);
});

test('03 wrapper replaces every npm.cmd token before execution', () => {
  assert.match(wrapper, /configuredLint\.replace\(\/\\bnpm\\\.cmd\\b\/g, npmExecutable\)/);
  const linuxCommand = lint.replace(/\bnpm\.cmd\b/g, 'npm');
  assert.doesNotMatch(linuxCommand, /\bnpm\.cmd\b/);
  assert.match(linuxCommand, /npm run check:lead-detail-feedback-p1/);
  assert.match(linuxCommand, /npm run check:repo-backup-hygiene/);
});

test('04 Linux workflow uses the portable wrapper instead of npm run lint', () => {
  const lintStep = workflow.slice(workflow.indexOf('- name: Lint'), workflow.indexOf('- name: Build'));
  assert.match(lintStep, /run: node scripts\/run-lint-cross-platform\.cjs/);
  assert.doesNotMatch(lintStep, /run: npm run lint/);
});

test('05 wrapper preserves child exit status and inherited environment', () => {
  assert.match(wrapper, /env: process\.env/);
  assert.match(wrapper, /shell: true/);
  assert.match(wrapper, /process\.exit\(typeof result\.status === 'number' \? result\.status : 1\)/);
});

test('06 explicit dry-run proves normalization without hiding real CI failures', () => {
  assert.match(wrapper, /process\.env\.CI_LINT_DRY_RUN === '1'/);
  assert.match(wrapper, /CI_LINT_PORTABLE_ENTRY: PASS/);
  assert.match(wrapper, /CI_LINT_DRY_RUN: NO_CHILD_PROCESS_EXECUTED/);
});

test('07 repair is CI-only and does not reference runtime modules', () => {
  assert.doesNotMatch(wrapper, /src\/|supabase|google-calendar|work_items|event-route|task-route/);
  assert.doesNotMatch(workflow, /src\/server|supabase\/migrations/);
});
