const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const packagePath = path.join(root, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const configuredLint = String(packageJson?.scripts?.lint || '').trim();

if (!configuredLint) {
  console.error('CI_LINT_SCRIPT_MISSING');
  process.exit(1);
}

const npmExecutable = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const portableLint = configuredLint.replace(/\bnpm\.cmd\b/g, npmExecutable);

if (process.platform !== 'win32' && /\bnpm\.cmd\b/.test(portableLint)) {
  console.error('CI_LINT_WINDOWS_ONLY_NPM_CMD_REMAINS');
  process.exit(1);
}

console.log(`CI_LINT_PLATFORM=${process.platform}`);
console.log(`CI_LINT_NPM_EXECUTABLE=${npmExecutable}`);

const result = spawnSync(portableLint, {
  cwd: root,
  env: process.env,
  shell: true,
  stdio: 'inherit',
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(typeof result.status === 'number' ? result.status : 1);
