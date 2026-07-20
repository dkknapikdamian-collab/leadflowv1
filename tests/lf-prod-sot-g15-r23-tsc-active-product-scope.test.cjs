const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const configPath = path.join(root, 'tsconfig.json');
const guardPath = path.join(root, 'scripts/check-g15-r23-tsc-active-product-scope.cjs');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

test('R23 TypeScript scope guard passes', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /excludes historical patcher scopes/);
});

test('main tsconfig includes active product and API roots', () => {
  assert.deepEqual(config.include, ['src/**/*', 'api/**/*', 'vite.config.ts']);
  assert.equal(config.compilerOptions.allowJs, true);
  assert.equal(config.compilerOptions.noEmit, true);
});

test('main tsconfig excludes non-product and historical repair roots', () => {
  for (const required of ['node_modules', 'dist', '_project', '_local_backups', 'backups', 'bisect', 'scripts', 'tools']) {
    assert.ok(config.exclude.includes(required), `missing exclude ${required}`);
  }
});

test('parsed TypeScript program contains active files and no historical patchers', () => {
  const readResult = ts.readConfigFile(configPath, ts.sys.readFile);
  assert.equal(readResult.error, undefined);
  const parsed = ts.parseJsonConfigFileContent(readResult.config, ts.sys, root, undefined, configPath);
  assert.deepEqual(parsed.errors, []);
  const files = parsed.fileNames.map((file) => path.relative(root, file).replaceAll('\\', '/'));
  for (const required of ['src/App.tsx', 'api/me.ts', 'vite.config.ts']) assert.ok(files.includes(required), `missing ${required}`);
  assert.equal(files.some((file) => /^(scripts|tools|_project|_local_backups|backups|bisect)\//.test(file)), false);
});

test('scoped tsc typechecks active product sources', () => {
  const tscBin = path.join(root, 'node_modules', 'typescript', 'bin', 'tsc');
  const result = spawnSync(process.execPath, [tscBin, '--noEmit', '--pretty', 'false'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});
